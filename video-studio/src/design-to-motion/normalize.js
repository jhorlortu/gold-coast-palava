// Design-to-motion, stage 1: turn a static design (frames + layers, the shape a Figma
// export or a hand-written JSON has) into a fully specified motion scene.
//
//  - resolves design tokens ("$brand" -> "#7c5cff")
//  - fills in sizes/defaults so the renderers never guess
//  - AUTO-CHOREOGRAPHS layers that have no explicit motion: it picks an entrance from
//    each layer's role (background, headline, body, image, shape, rule) and staggers
//    them in reading order (top-to-bottom, left-to-right), tuned by the scene's `style`.
import { resolveMotion } from '../shared/motion.js';

/** Choreography styles: which entrance each role gets and how tightly they cascade. */
export const STYLES = {
  minimal: {
    stagger: 0.12, start: 0.15, exit: 'fade',
    roles: { background: 'fade', headline: 'rise', body: 'fade', image: 'fade', shape: 'fade', rule: 'wipe' },
  },
  energetic: {
    stagger: 0.08, start: 0.05, exit: 'scale-out',
    roles: { background: 'fade', headline: { preset: 'pop', split: 'words', stagger: 0.07 }, body: 'slide-left', image: 'scale-in', shape: 'pop', rule: 'wipe' },
  },
  elegant: {
    stagger: 0.2, start: 0.25, exit: 'blur-out',
    roles: { background: 'fade', headline: { preset: 'blur-in', split: 'words', stagger: 0.12 }, body: 'blur-in', image: 'fade-zoom', shape: 'fade', rule: 'wipe' },
  },
  cinematic: {
    stagger: 0.25, start: 0.3, exit: 'fade',
    roles: { background: { preset: 'fade-zoom', duration: 2 }, headline: { preset: 'rise', split: 'chars', stagger: 0.03 }, body: 'fade', image: { preset: 'fade-zoom', idle: 'float' }, shape: 'fade', rule: 'wipe' },
  },
};

const LAYER_TYPES = new Set(['rect', 'ellipse', 'text', 'image', 'line', 'group']);

export function normalizeDesign(design, { durationOverride } = {}) {
  if (!design || !Array.isArray(design.layers)) throw new Error('Design must have a "layers" array');
  const width = design.width ?? 1920;
  const height = design.height ?? 1080;
  const duration = durationOverride ?? design.duration ?? 5;
  const styleName = design.style ?? 'minimal';
  const style = STYLES[styleName];
  if (!style) throw new Error(`Unknown design style "${styleName}". Known: ${Object.keys(STYLES).join(', ')}`);
  const tokens = flattenTokens(design.tokens || {});
  const exit = design.exit ?? style.exit;

  const resolve = (v) => {
    if (typeof v !== 'string' || !v.startsWith('$')) return v;
    const key = v.slice(1);
    if (!(key in tokens)) throw new Error(`Unknown design token "${v}". Defined: ${Object.keys(tokens).join(', ') || '(none)'}`);
    return tokens[key];
  };

  const ids = new Set();
  const prep = (layer, parent) => {
    if (!LAYER_TYPES.has(layer.type)) throw new Error(`Layer "${layer.id}" has unknown type "${layer.type}"`);
    let id = String(layer.id ?? `${layer.type}-${ids.size + 1}`).replace(/[^a-zA-Z0-9_-]/g, '-');
    while (ids.has(id)) id += '_';
    ids.add(id);
    const out = { ...layer, id };
    for (const k of Object.keys(out)) if (k !== 'children' && k !== 'motion') out[k] = resolve(out[k]);
    out.x ??= 0; out.y ??= 0;
    out.width ??= layer.type === 'text' ? (parent?.width ?? width) - out.x : 100;
    out.height ??= layer.type === 'text' ? Math.round((out.fontSize ?? 48) * (out.lineHeight ?? 1.2)) : layer.type === 'line' ? (out.strokeWidth ?? 4) : 100;
    out.opacity ??= 1;
    out.rotation ??= 0;
    if (layer.type === 'text') {
      out.text = String(out.text ?? '');
      out.fontSize ??= 48;
      out.fontFamily ??= tokens['font.body'] ?? 'Inter';
      out.fontWeight ??= 400;
      out.color ??= tokens['color.text'] ?? '#ffffff';
      out.align ??= 'left';
      out.lineHeight ??= 1.2;
      out.letterSpacing ??= 0;
    }
    if (layer.type === 'line') out.color ??= out.stroke ?? tokens['color.text'] ?? '#ffffff';
    if (layer.type === 'group') out.children = (layer.children || []).map((c) => prep(c, out));
    out._absX = (parent?._absX ?? 0) + out.x;
    out._absY = (parent?._absY ?? 0) + out.y;
    out._explicitMotion = layer.motion;
    return out;
  };
  const layers = design.layers.map((l) => prep(l, null));

  // Auto-choreography over top-level layers in reading order.
  const order = [...layers]
    .map((l, i) => ({ l, i }))
    .sort((a, b) => roleRank(a.l, width, height) - roleRank(b.l, width, height) || rowOf(a.l) - rowOf(b.l) || a.l._absX - b.l._absX || a.i - b.i);
  let slot = 0;
  for (const { l } of order) {
    const role = roleOf(l, width, height);
    const auto = role === 'background' ? { delay: 0 } : { delay: style.start + slot++ * style.stagger };
    const roleMotion = style.roles[role];
    const base = typeof roleMotion === 'string' ? { preset: roleMotion } : { ...roleMotion };
    const explicit = typeof l._explicitMotion === 'string' ? { preset: l._explicitMotion } : (l._explicitMotion || {});
    l.role = role;
    l.motion = resolveMotion({ ...base, ...auto, ...explicit }, { exit });
    if (l.motion.split && l.type !== 'text') l.motion.split = null;
    if (l.type === 'group') applyChildMotion(l, style, exit, l.motion.delay);
  }
  const strip = (l) => { delete l._explicitMotion; delete l._absX; delete l._absY; l.children?.forEach(strip); return l; };
  layers.forEach(strip);

  // Keep every entrance inside the scene so nothing is still moving at the cut.
  const end = maxEnd(layers);
  if (end > duration) {
    console.warn(`[design-to-motion] "${design.name ?? 'design'}": entrances finish at ${end.toFixed(2)}s, after the ${duration}s scene ends`);
  }

  return {
    name: design.name ?? 'design',
    width, height, duration,
    fps: design.fps ?? 30,
    background: resolve(design.background ?? '#000000'),
    style: styleName,
    layers,
  };
}

function applyChildMotion(group, style, exit, groupDelay) {
  group.children.forEach((c, i) => {
    const role = roleOf(c, group.width, group.height);
    const roleMotion = style.roles[role];
    const base = typeof roleMotion === 'string' ? { preset: roleMotion } : { ...roleMotion };
    const explicit = typeof c._explicitMotion === 'string' ? { preset: c._explicitMotion } : (c._explicitMotion || {});
    c.role = role;
    // Children cascade after the group lands; exits are handled by the group.
    c.motion = resolveMotion({ ...base, delay: groupDelay + 0.1 + i * style.stagger, ...explicit, exit: 'none' }, { exit: 'none' });
    if (c.motion.split && c.type !== 'text') c.motion.split = null;
    if (c.type === 'group') applyChildMotion(c, style, exit, c.motion.delay);
  });
}

function maxEnd(layers) {
  let m = 0;
  for (const l of layers) {
    const pieces = l.motion.split ? splitText(l.text, l.motion.split).filter((p) => p.trim()).length : 1;
    m = Math.max(m, l.motion.delay + l.motion.duration + Math.max(0, pieces - 1) * l.motion.stagger);
    if (l.children) m = Math.max(m, maxEnd(l.children));
  }
  return m;
}

export function roleOf(l, W, H) {
  if (l.role) return l.role;
  const area = (l.width * l.height) / (W * H);
  if ((l.type === 'rect' || l.type === 'image') && area >= 0.6) return 'background';
  if (l.type === 'text') return (l.fontSize ?? 48) >= 72 ? 'headline' : 'body';
  if (l.type === 'image') return 'image';
  if (l.type === 'line') return 'rule';
  return 'shape';
}
const roleRank = (l, W, H) => (roleOf(l, W, H) === 'background' ? 0 : 1);
// Layers whose tops are within 40px share a row, so a row reads left-to-right.
const rowOf = (l) => Math.round(l._absY / 40);

function flattenTokens(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') flattenTokens(v, key, out);
    else { out[key] = v; out[k] ??= v; }
  }
  // Common aliases: tokens.colors.brand is reachable as $brand, $colors.brand or $color.brand.
  for (const [k, v] of Object.entries(out)) {
    if (k.startsWith('colors.')) out[`color.${k.slice(7)}`] ??= v;
    if (k.startsWith('fonts.')) out[`font.${k.slice(6)}`] ??= v;
  }
  return out;
}

/** Split text into animatable pieces, keeping whitespace as its own pieces. */
export function splitText(text, mode) {
  if (mode === 'chars') return Array.from(text);
  if (mode === 'words') return text.split(/(\s+)/).filter((p) => p.length);
  if (mode === 'lines') return text.split(/(\n)/).filter((p) => p.length);
  return [text];
}

/**
 * Group split pieces for rendering: whitespace stays plain text, and the characters
 * of one word are kept together in a no-wrap group so lines never break mid-word.
 * Returns [{ space: ' ' } | { pieces: ['W','o','r','d'] }].
 */
export function textGroups(text, mode) {
  if (mode !== 'chars') return splitText(text, mode).map((p) => (p.trim() ? { pieces: [p] } : { space: p }));
  return text.split(/(\s+)/).filter((p) => p.length).map((w) => (w.trim() ? { pieces: Array.from(w) } : { space: w }));
}
