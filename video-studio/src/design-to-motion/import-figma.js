// Figma -> design JSON. Works from a saved Figma REST response (GET /v1/files/:key)
// or fetches it live with FIGMA_TOKEN. Motion can be authored in Figma itself by
// putting a preset in a layer name: "Headline [pop]", "Logo [spin delay=0.4]",
// "Hero shot [fade-zoom idle=float]". Layers without hints are auto-choreographed.
import fs from 'node:fs';
import path from 'node:path';

const rgba = (c, extraOpacity = 1) => {
  if (!c) return undefined;
  const a = (c.a ?? 1) * extraOpacity;
  const to = (v) => Math.round(v * 255);
  return a >= 0.999 ? `#${[c.r, c.g, c.b].map((v) => to(v).toString(16).padStart(2, '0')).join('')}` : `rgba(${to(c.r)},${to(c.g)},${to(c.b)},${+a.toFixed(3)})`;
};

function paint(fills) {
  const f = (fills || []).filter((p) => p.visible !== false);
  if (!f.length) return { fill: undefined };
  const p = f[f.length - 1]; // topmost
  if (p.type === 'SOLID') return { fill: rgba(p.color, p.opacity ?? 1) };
  if (p.type?.startsWith('GRADIENT')) {
    const stops = (p.gradientStops || []).map((s) => `${rgba(s.color, p.opacity ?? 1)} ${Math.round(s.position * 100)}%`).join(', ');
    if (p.type === 'GRADIENT_RADIAL') return { fill: `radial-gradient(circle, ${stops})` };
    let angle = 180;
    const h = p.gradientHandlePositions;
    if (h?.length >= 2) angle = Math.round((Math.atan2(h[1].y - h[0].y, h[1].x - h[0].x) * 180) / Math.PI + 90);
    return { fill: `linear-gradient(${angle}deg, ${stops})` };
  }
  if (p.type === 'IMAGE') return { imageRef: p.imageRef, fit: p.scaleMode === 'FIT' ? 'contain' : 'cover' };
  return { fill: undefined };
}

/** Parse "Name [preset key=value ...]" into a motion object. */
export function motionFromName(name = '') {
  const m = name.match(/\[([^\]]+)\]\s*$/);
  if (!m) return undefined;
  const [preset, ...kv] = m[1].trim().split(/\s+/);
  const motion = { preset };
  for (const pair of kv) {
    const [k, v] = pair.split('=');
    motion[k] = v === undefined ? true : Number.isFinite(Number(v)) ? Number(v) : v;
  }
  return motion;
}

const cleanName = (name = '') => name.replace(/\[[^\]]*\]\s*$/, '').trim();

function convert(node, origin, imageDir) {
  if (node.visible === false) return null;
  const box = node.absoluteBoundingBox || { x: origin.x, y: origin.y, width: 0, height: 0 };
  const base = {
    id: cleanName(node.name) || node.id,
    x: Math.round(box.x - origin.x),
    y: Math.round(box.y - origin.y),
    width: Math.round(box.width),
    height: Math.round(box.height),
  };
  if (node.opacity != null && node.opacity < 1) base.opacity = +node.opacity.toFixed(3);
  const motion = motionFromName(node.name);
  if (motion) base.motion = motion;
  const shadow = (node.effects || []).find((e) => e.type === 'DROP_SHADOW' && e.visible !== false);
  if (shadow) base.shadow = { x: shadow.offset?.x ?? 0, y: shadow.offset?.y ?? 0, blur: shadow.radius ?? 0, color: rgba(shadow.color) };
  const stroke = (node.strokes || []).find((s) => s.visible !== false && s.type === 'SOLID');
  if (stroke && node.strokeWeight && node.type !== 'LINE') { base.stroke = rgba(stroke.color, stroke.opacity ?? 1); base.strokeWidth = node.strokeWeight; }

  const p = paint(node.fills);
  if (p.imageRef) return { ...base, type: 'image', src: path.join(imageDir, `${p.imageRef}.png`), fit: p.fit, radius: node.cornerRadius };

  switch (node.type) {
    case 'TEXT': {
      const s = node.style || {};
      return {
        ...base, type: 'text', text: node.characters ?? '',
        fontFamily: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight,
        italic: s.italic || undefined,
        align: { LEFT: 'left', CENTER: 'center', RIGHT: 'right', JUSTIFIED: 'justify' }[s.textAlignHorizontal] ?? 'left',
        lineHeight: s.lineHeightPx && s.fontSize ? +(s.lineHeightPx / s.fontSize).toFixed(3) : undefined,
        letterSpacing: s.letterSpacing && s.fontSize ? +(s.letterSpacing / s.fontSize).toFixed(4) : undefined,
        textTransform: { UPPER: 'uppercase', LOWER: 'lowercase', TITLE: 'capitalize' }[s.textCase],
        color: p.fill ?? '#000000',
      };
    }
    case 'ELLIPSE':
      return { ...base, type: 'ellipse', fill: p.fill };
    case 'LINE':
      return { ...base, type: 'line', height: Math.max(1, node.strokeWeight ?? 2), color: rgba(stroke?.color) ?? '#000000' };
    case 'RECTANGLE':
    case 'VECTOR':
    case 'STAR':
    case 'POLYGON':
    case 'BOOLEAN_OPERATION':
      return { ...base, type: 'rect', fill: p.fill ?? 'transparent', radius: node.cornerRadius };
    case 'FRAME':
    case 'GROUP':
    case 'COMPONENT':
    case 'COMPONENT_SET':
    case 'INSTANCE':
    case 'SECTION': {
      const children = (node.children || []).map((c) => convert(c, box, imageDir)).filter(Boolean);
      if (p.fill && node.type !== 'GROUP') children.unshift({ id: `${base.id}-bg`, type: 'rect', x: 0, y: 0, width: base.width, height: base.height, fill: p.fill, radius: node.cornerRadius, motion: 'none' });
      return { ...base, type: 'group', children };
    }
    default:
      return null;
  }
}

function findFrames(doc) {
  const frames = [];
  for (const page of doc.children || []) for (const n of page.children || []) if (['FRAME', 'COMPONENT', 'SECTION'].includes(n.type)) frames.push(n);
  return frames;
}

/**
 * @param figma   parsed Figma REST JSON (file response or { nodes: {...} } response)
 * @param opts.frame  frame name to convert (default: first top-level frame)
 */
export function figmaToDesign(figma, { frame, imageDir = 'images', duration = 5, style = 'minimal' } = {}) {
  let candidates;
  if (figma.document) candidates = findFrames(figma.document);
  else if (figma.nodes) candidates = Object.values(figma.nodes).map((n) => n.document);
  else if (figma.type) candidates = [figma];
  else throw new Error('Unrecognised Figma JSON: expected a file response (with "document") or a nodes response');
  const f = frame ? candidates.find((c) => c.name === frame || cleanName(c.name) === frame) : candidates[0];
  if (!f) throw new Error(`Frame "${frame}" not found. Frames: ${candidates.map((c) => c.name).join(', ')}`);
  const box = f.absoluteBoundingBox;
  const bg = paint(f.fills).fill ?? '#ffffff';
  const layers = (f.children || []).map((c) => convert(c, box, imageDir)).filter(Boolean);
  return {
    name: cleanName(f.name),
    width: Math.round(box.width),
    height: Math.round(box.height),
    duration,
    style,
    background: bg,
    layers,
    source: { figmaNode: f.id },
  };
}

/** Fetch a Figma file (and its image fills) with FIGMA_TOKEN, saving images to imageDir. */
export async function fetchFigma(fileKey, { token = process.env.FIGMA_TOKEN, nodeId, imageDir } = {}) {
  if (!token) throw new Error('Set FIGMA_TOKEN (a Figma personal access token) to fetch from Figma');
  const headers = { 'X-Figma-Token': token };
  const url = nodeId ? `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(nodeId)}` : `https://api.figma.com/v1/files/${fileKey}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Figma API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (imageDir) {
    const imgs = await (await fetch(`https://api.figma.com/v1/files/${fileKey}/images`, { headers })).json();
    fs.mkdirSync(imageDir, { recursive: true });
    for (const [ref, u] of Object.entries(imgs.meta?.images || {})) {
      const r = await fetch(u);
      if (r.ok) fs.writeFileSync(path.join(imageDir, `${ref}.png`), Buffer.from(await r.arrayBuffer()));
    }
  }
  return json;
}
