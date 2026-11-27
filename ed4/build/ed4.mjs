// Gold Coast Palava — Edition 4: "What Is a Cedi?"
// House style: gold-coast-palava-edit skill. Run with GCP_WORK=/home/user/gcp/ed4/work GCP_EDITION="EDITION 4".
// New in Ed2: the living Nest (nestlive.mjs) plays like a real shot whenever the Nest is on screen; denser, clearer SFX.
import fs from 'node:fs';
import path from 'node:path';
import { Part, cuer, SP } from '/home/user/gcp/build/lib.mjs';
import { banner, BANNER_CSS } from '/home/user/gcp/build/banner.mjs';
import { combo1 } from '/home/user/gcp/build/combo1.mjs';
import { livingNest } from '/home/user/gcp/ed2/build/nestlive.mjs';
import { ART } from './art4.mjs';
import * as M from './maps.mjs';

const WORK = '/home/user/gcp/ed4/work';
const plan = JSON.parse(fs.readFileSync(path.join(WORK, 'timeline.json'), 'utf8'));
const P = Object.fromEntries(plan.parts.map((p) => [p.id, p]));
const ORDER = plan.parts.filter((p) => !p.id.includes('~'));
const seg = (id, fromPart, label, toEnd = false) => {
  const i = ORDER.findIndex((p) => p.id === fromPart);
  const T0 = P[fromPart].T0, T1 = !toEnd && i + 1 < ORDER.length ? ORDER[i + 1].T0 : plan.total;
  const pieces = plan.parts.filter((p) => p.kind === 'vo' && p.T0 >= T0 - 1e-6 && p.T0 < T1 - 1e-6).map((p) => ({ vo_in: p.vo_in, vo_out: p.vo_out, local0: +(p.T0 - T0).toFixed(3) }));
  return { id, T0, dur: +(T1 - T0).toFixed(3), label, pieces };
};
export const SEGMENTS = {
  cold: seg('cold', 'cold-open', 'THE NEST · THIS AFTERNOON'),
  combo1: seg('combo1', 'combo1', ''),
  nest: seg('nest', 'nest', 'THE NEST · THE PRICE'),
  front: seg('front', 'front-page', 'FRONT PAGE'),
  headlead: seg('headlead', 'head-lead', 'LEAD STORY'),
  lead: seg('lead', 'lead', 'LEAD STORY · FROM SEDIE TO CEDI'),
  wire: seg('wire', 'wire', 'THE WIRE · ACCRA, 1965'),
  palava: seg('palava', 'palava', 'THE PALAVA DESK'),
  thennow: seg('thennow', 'then-now', 'THEN v NOW'),
  headteam: seg('headteam', 'head-team', 'THE TEAM ASIDE'),
  team: seg('team', 'team', 'THE TEAM ASIDE'),
  editor: seg('editor', 'editor', "EDITOR'S NOTE"),
  headletters: seg('headletters', 'head-letters', 'LETTERS PAGE'),
  letters: seg('letters', 'letters', 'LETTERS PAGE'),
  dispatch: seg('dispatch', 'dispatch', 'DISPATCH', true),
};
SEGMENTS.dispatch.dur = +(P.credits.T0 - SEGMENTS.dispatch.T0).toFixed(3);
SEGMENTS.credits = { id: 'credits', T0: P.credits.T0, dur: +(plan.total - P.credits.T0).toFixed(3), label: '', pieces: [] };
{ const c0 = SEGMENTS.cold; const d = c0.T0; c0.T0 = 0; c0.dur = +(c0.dur + d).toFixed(3); c0.pieces = c0.pieces.map((q) => ({ ...q, local0: +(q.local0 + d).toFixed(3) })); }

const PILOT = '/home/user/gcp/project/media';
const STK = '/home/user/gcp/ed2/media/stickers_cut', STK4 = '/home/user/gcp/ed4/media/stickers_cut', STK1 = '/home/user/gcp/ed1/media/stickers_cut';
const SFX = '/home/user/gcp/ed4/media/sfx', SFX1 = '/home/user/gcp/ed1/media/sfx';
const DRAWN = '/home/user/gcp/ed4/media/drawn';
const FONTS = '/home/user/gcp/ed4/build/node_modules/@fontsource';
const r3 = (v) => +(+v).toFixed(3);
const make = (key) => { const s = SEGMENTS[key]; const p = new Part({ ...s }); fontCss(p); { const k0 = p.kicker.bind(p); p.kicker = (t, at, col) => { p.ev(at); return k0(t, at, col); }; } return [p, cuer(s.pieces), s]; };
// Caveat (handwriting on the sticky note / red ink) and Special Elite (the Wire's dateline)
function fontCss(p) {
  p.css.push(`@font-face { font-family:'Caveat'; src:url('${p.asset(FONTS + '/caveat/files/caveat-latin-700-normal.woff2')}') format('woff2'); font-weight:700; }
@font-face { font-family:'Special Elite'; src:url('${p.asset(FONTS + '/special-elite/files/special-elite-latin-400-normal.woff2')}') format('woff2'); }
.hand { font-family:'Caveat', cursive; font-weight:700; }
.elite { font-family:'Special Elite', 'IBM Plex Mono', monospace; }`);
}
const st = (p, name, at, o = {}) => p.icon(name, at, { dir: STK, sfx: o.sfx ?? SFX1 + '/pop-2.wav', ...o });
const st1 = (p, name, at, o = {}) => p.icon(name, at, { dir: STK1, sfx: o.sfx ?? SFX1 + '/pop-2.wav', ...o });
const fx = (p, file, at, db = -16, len) => p.sfx.push({ file: file.startsWith('/') ? file : path.join(SFX, file), T: r3(p.T0 + at), db, ...(len ? { len } : {}) });
const cs = (c, ...qs) => { for (const q of qs) { try { return c(q); } catch {} } throw new Error('no cue: ' + qs.join(' | ')); };
const COLX = 150, COLY = 400, PITCH = 92;
const stack = (p, items, { x = COLX, y = COLY, pitch = PITCH } = {}) => items.filter(Boolean).map(([t, at, kind = 'chip light'], i) => p.chip(t, at, { kind, x, y: y + i * pitch })).join('');
const head = (p, kick, kat, text, tat, { size = 80, w = 940, x = 150, y = 140 } = {}) => `<div class="hl" style="left:${x}px;top:${y}px;width:${w}px">${p.kicker(kick, kat)}<h1 style="font-size:${size}px">${p.words(p.id_('h'), text, tat, { stagger: 0.06 })}</h1></div>`;
const RIGHT = { x: 1150, y: 170, w: 620 };
const away = (p, html, t, { y = -1300, rot = -10, x = 0 } = {}) => { const id = p.id_('aw');
  p.tl.push(`tl.to("#${id}", {y:${y}, x:${x}, rotation:${rot}, duration:0.55, ease:"power3.in", immediateRender:false}, ${r3(t)});`); p.ev(t); p.sound('whoosh-1.mp3', t, -20);
  return `<div id="${id}" style="position:absolute;inset:0;pointer-events:none">${html}</div>`; };
const nameCard = (p, at, { x = 110, y = 640, role, name, note = '' }) => {
  const id = p.id_('nm');
  p.tl.push(`tl.fromTo("#${id}", {xPercent:-120}, {xPercent:0, duration:${SP.heavy}, ease:"sp-heavy"}, ${r3(at)});`); p.ev(at);
  p.sound(SFX1 + '/whip.wav', at, -17);
  return `<div style="position:absolute;left:0;top:${y}px;overflow:hidden;padding-right:40px"><div id="${id}" style="margin-left:${x}px;background:#FCF5E8;padding:20px 34px;border-left:12px solid var(--red);box-shadow:10px 12px 0 rgba(26,22,18,.85)"><div class="mono" style="font-size:22px;letter-spacing:.2em;color:var(--red);font-weight:700">${role}</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:56px;line-height:1.05">${name}</div>${note ? `<div class="mono" style="font-size:20px;margin-top:6px;color:var(--muted)">${note}</div>` : ''}</div></div>`;
};
// rolling counter (seek-safe GSAP innerText snap)
const counter = (p, at, to, { size = 170, color = 'var(--ink)', suffix = '', prefix = '', dur = 1.4, sfx = 'blip.wav' } = {}) => {
  // seek-safe rolling number: a stack of pre-set values, each snapped visible in turn (the renderer ignores innerText tweens)
  const id = p.id_('ct'), N = Math.min(14, Math.max(2, to)), vals = [];
  for (let k = 0; k <= N; k++) { const e = 1 - Math.pow(1 - k / N, 2); vals.push(Math.round(to * e)); }
  const fmt = (v) => v.toLocaleString('en-GB');
  const spans = vals.map((v, k) => { const t0 = at + dur * k / N;
    if (k > 0) p.tl.push(`tl.set("#${id}-${k}", {opacity:1}, ${r3(t0)});`);
    if (k < N) p.tl.push(`tl.set("#${id}-${k}", {opacity:0}, ${r3(at + dur * (k + 1) / N)});`);
    return `<span id="${id}-${k}" style="${k ? 'position:absolute;left:0;top:0;opacity:0' : ''}">${prefix}${fmt(v)}${suffix}</span>`; }).join('');
  p.ev(at); p.ev(at + dur);
  for (let k = 0; k < 5; k++) fx(p, sfx, at + k * dur / 6, -26);
  fx(p, 'register.wav', at + dur - 0.1, -22);
  return `<span style="position:relative;display:inline-block;font-family:'Playfair Display',serif;font-weight:900;font-size:${size}px;color:${color};white-space:nowrap"><span style="visibility:hidden">${prefix}${fmt(to)}${suffix}</span><span style="position:absolute;left:0;top:0">${spans}</span></span>`;
};
// a card that grows in (cream, ink border, hard shadow)
const card = (p, inner, at, { x, y, w, rot = 0, pad = '24px 30px', bg = '#FCF5E8', sfx = true } = {}) => { const id = p.id_('cd');
  if (at != null) { p.grow(id, at, { from: 0.8, dy: 30, rot }); if (sfx) fx(p, SFX1 + '/paper-slap.wav', at + 0.15, -18); }
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;background:${bg};border:4px solid var(--ink);box-shadow:10px 12px 0 var(--ink);padding:${pad};transform:rotate(${rot}deg)">${inner}</div>`; };
const mono = (t, { size = 22, color = 'var(--red)' } = {}) => `<div class="mono" style="font-size:${size}px;font-weight:700;letter-spacing:.2em;color:${color}">${t}</div>`;
const H = (p, t, at, size = 60, stagger = 0.06) => `<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:${size}px;line-height:1.05;margin-top:8px">${p.words(p.id_('w'), t, at, { stagger })}</div>`;
// the Nest's room sound under every living-Nest shot: room tone (fan, insects, lagoon) + the clock ticking each second
const nestBed = (p, t0, t1, db = -22) => {
  for (let t = t0; t < t1 - 0.5; t += 19) fx(p, 'nest-room.wav', t, db, Math.min(20, t1 - t));
  for (let t = Math.ceil(t0) + 0.02; t < t1; t += 1) fx(p, 'tick.wav', t, -33);
};
// a gold pin on a spot in the living Nest (label card beside it)
const pin = (p, txt, x, y, at, dx = 40, dy = -78) => { const id = p.id_('pin'); p.grow(id, at, { preset: 'snappy', dy: 20, from: 0.6 }); fx(p, SFX1 + '/pop-1.wav', at, -16);
  return `<div id="${id}" style="position:absolute;left:${x - 10}px;top:${y - 10}px"><div style="width:20px;height:20px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 7px rgba(201,150,47,.35)"></div><div style="position:absolute;left:${dx}px;top:${dy}px;white-space:nowrap;background:#FCF5E8;border:3px solid var(--ink);box-shadow:6px 7px 0 var(--ink);padding:8px 18px;font-family:'GCP Round',sans-serif;font-weight:700;font-size:28px">${txt}</div></div>`; };

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Edition 3 building blocks
// a code-drawn sticker (art.mjs) that springs in like the Canva stickers, with a life loop
const art = (p, name, at, { x = 0, y = 0, w = 300, rot = 0, life = 'bob', until, sfx = SFX1 + '/pop-2.wav', db = -16, abs = true } = {}) => {
  const id = p.id_('ar');
  p.tl.push(`tl.fromTo("#${id}", {opacity:0}, {opacity:1, duration:0.1, ease:"none"}, ${r3(at)});`);
  p.tl.push(`tl.fromTo("#${id}", {scale:0.2, rotation:${rot + (p.uid % 2 ? -22 : 22)}, y:40}, {scale:1, rotation:${rot}, y:0, duration:${SP.playful}, ease:"sp-playful"}, ${r3(at)});`);
  if (until && until > at + 1.2) { const L = { bob: [{ y: -10 }, 1.6], sway: [{ rotation: rot + 6 }, 1.3], pulse: [{ scale: 1.06 }, 0.9], jiggle: [{ rotation: rot - 4, y: -4 }, 0.22], float: [{ y: -18 }, 2.2] }[life] || [{ y: -10 }, 1.6];
    p.tl.push(`tl.to("#${id}", ${JSON.stringify({ ...L[0], duration: L[1], ease: 'sine.inOut', repeat: Math.max(0, Math.floor((until - at - 0.8) / L[1]) - 1), yoyo: true, immediateRender: false })}, ${r3(at + 0.8)});`); }
  if (sfx) fx(p, sfx, at + 0.03, db);
  p.ev(at);
  // Canva sticker when one exists (Olahub's Team), else the code-drawn fallback (the hands stay code-drawn)
  const cv = `${STK4}/${name}.png`;
  const inner = fs.existsSync(cv) ? `<img src="${p.asset(cv)}" class="sticker" style="width:${w}px;display:block">` : ART[name](w);
  return `<div id="${id}" style="${abs ? `position:absolute;left:${x}px;top:${y}px;` : 'display:inline-block;'}width:${w}px;opacity:0;transform-origin:50% 80%">${inner}</div>`;
};
/**
 * The glued string map: a card with real country shapes; borders drawn on as string (red Britain, blue France,
 * black Germany), extra historical lines, pins with Special Elite labels. Returns html; strings draw on at `at`.
 */
const stringMap = (p, { x = 0, y = 0, w = 1920, h = 1080, bbox = [-3.6, 4.4, 2.2, 11.5], card = true, fills = [], strings = [], lines = [], pins = [], extra = () => '', id = p.id_('sm') } = {}) => {
  const P = M.projection(bbox, w, h);
  const draw = (sid, at, dur) => { p.tl.push(`tl.fromTo("#${sid}", {strokeDasharray:1000, strokeDashoffset:1000}, {strokeDashoffset:0, duration:${dur}, ease:"power1.inOut"}, ${r3(at)});`);
    p.tl.push(`tl.fromTo("#${sid}-t", {opacity:0}, {opacity:1, duration:0.1, ease:"none"}, ${r3(at + dur)});`); p.ev(at); fx(p, 'peel.wav', at, -24, Math.min(1.2, dur)); };
  const fl = fills.map((f) => { const fid = p.id_('fl'); if (f.at != null) { p.tl.push(`tl.fromTo("#${fid}", {opacity:0}, {opacity:${f.op ?? 1}, duration:${f.dur ?? 0.6}, ease:"power1.out"}, ${r3(f.at)});`); p.ev(f.at); }
    const d = f.d ? f.d(P) : M.countryPath(P, f.country);
    const cl = f.clip === 'BT' ? `${id}-bt` : f.clip === 'GH' ? `${id}-gh` : f.clip;
    return `<path id="${fid}" d="${d}" fill="${f.fill}" ${cl ? `clip-path="url(#${cl})"` : ''} opacity="${f.at != null ? 0 : (f.op ?? 1)}" ${f.stroke ? `stroke="${f.stroke}" stroke-width="2"` : ''}/>`; }).join('');
  const st = strings.map((s) => { const sid = p.id_('ss'); if (s.at != null) draw(sid, s.at, s.dur ?? 1.6);
    return M.stringPath(s.d ? s.d(P) : M.countryPath(P, s.country), M.COL[s.color] || s.color, { id: sid, w: s.w ?? 6 }).replace(`id="${sid}"`, `id="${sid}" ${s.at != null ? 'stroke-dasharray="1000" stroke-dashoffset="1000"' : ''}`).replace(`id="${sid}-t"`, `id="${sid}-t" ${s.at != null ? 'opacity="0"' : ''}`); }).join('');
  const ln = lines.map((s) => { const sid = p.id_('sl'); if (s.at != null) draw(sid, s.at, s.dur ?? 1.4);
    return M.stringPath(s.d(P), M.COL[s.color] || s.color, { id: sid, w: s.w ?? 7, twist: s.twist ?? true }).replace(`id="${sid}"`, `id="${sid}" ${s.at != null ? 'stroke-dasharray="1000" stroke-dashoffset="1000"' : ''}`).replace(`id="${sid}-t"`, `id="${sid}-t" ${s.at != null ? 'opacity="0"' : ''}`); }).join('');
  const pn = pins.map((q) => { const [px, py] = P(M.PLACE[q.place] || q.ll); const pid = p.id_('pn');
    if (q.at != null) { p.tl.push(`tl.fromTo("#${pid}", {opacity:0, scale:2.2}, {opacity:1, scale:1, duration:${SP.snappy}, ease:"sp-snappy"}, ${r3(q.at)});`); p.ev(q.at); fx(p, 'pin.wav', q.at, -14); }
    const dx = q.dx ?? 18, dy = q.dy ?? -50;
    return `<g id="${pid}" style="transform-origin:${px}px ${py}px" ${q.at != null ? 'opacity="0"' : ''}><circle cx="${px}" cy="${py}" r="${q.r ?? 9}" fill="${q.color ?? '#C8962F'}" stroke="#1A1612" stroke-width="3"/>${q.label ? `<g transform="translate(${px + dx} ${py + dy})"><rect x="0" y="0" width="${q.label.length * (q.fs ?? 22) * 0.62 + 24}" height="${(q.fs ?? 22) + 16}" fill="#FCF5E8" stroke="#1A1612" stroke-width="3"/><text x="12" y="${(q.fs ?? 22) + 4}" font-family="Special Elite, IBM Plex Mono, monospace" font-size="${q.fs ?? 22}" fill="#1A1612">${q.label}</text></g>` : ''}</g>`; }).join('');
  const bg = card ? `<rect x="0" y="0" width="${w}" height="${h}" fill="#EFE4C8"/><rect x="0" y="0" width="${w}" height="${h}" fill="#EFE4C8" filter="url(#cardgrain)"/>` : '';
  return { html: `<svg id="${id}" style="position:absolute;left:${x}px;top:${y}px;overflow:hidden" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${M.STRING_DEFS}<defs><clipPath id="${id}-bt" clip-path="url(#${id}-gh)"><path d="${M.btClip(P)}"/></clipPath><clipPath id="${id}-gh"><path d="${M.countryPath(P, 'Ghana')}"/></clipPath></defs>${bg}${fl}${extra(P, id)}${st}${ln}${pn}</svg>`, P, id };
};
// the five neighbours as faint card shapes, with their strings (modern borders, colonial colours)
const WEST_AFRICA = (at0, step = 0.5) => ({
  fills: [{ country: "Côte d'Ivoire", fill: '#E6D9B8' }, { country: 'Burkina Faso', fill: '#E6D9B8' }, { country: 'Togo', fill: '#E3D3AE' }, { country: 'Benin', fill: '#E6D9B8' }, { country: 'Ghana', fill: '#F3E9CF' }],
  strings: [{ country: "Côte d'Ivoire", color: 'blue', at: at0 == null ? null : at0 + step, dur: 2 }, { country: 'Burkina Faso', color: 'blue', at: at0 == null ? null : at0 + 2 * step, dur: 2 },
    { country: 'Benin', color: 'blue', at: at0 == null ? null : at0 + 4 * step, dur: 1.6 }, { country: 'Togo', color: 'black', at: at0 == null ? null : at0 + 3 * step, dur: 1.6 }, { country: 'Ghana', color: 'red', at: at0, dur: 2.2 }],
});
// a fingertip that follows a list of [x,y] points (keyframes), pausing at the last one
const fingertip = (p, pts, t0, t1, { w = 190 } = {}) => { const id = p.id_('fg');
  const seg = (t1 - t0) / pts.length;
  p.tl.push(`tl.fromTo("#${id}", {opacity:0}, {opacity:1, duration:0.2, ease:"none"}, ${r3(t0)});`);
  p.tl.push(`tl.fromTo("#${id}", {x:${pts[0][0]}, y:${pts[0][1]}}, {keyframes:${JSON.stringify(pts.slice(1).map(([x, y]) => ({ x, y, duration: r3(seg), ease: 'sine.inOut' })))}}, ${r3(t0)});`);
  p.ev(t0); p.ev((t0 + t1) / 2);
  return `<div id="${id}" style="position:absolute;left:${-w * 0.14}px;top:${-w * 0.49}px;width:${w}px;opacity:0;pointer-events:none">${ART.finger(w)}</div>`; };

// ---------------------------------------------------------------------------
// Edition 4 building blocks
const NOTES = '/home/user/gcp/ed4/media/notes', REAL4 = '/home/user/gcp/ed4/media/real';
const note = (k, side = 'front') => `${NOTES}/ghs${k}-${side}.png`;
const isImg = (f) => { try { const b = fs.readFileSync(f); return b.length > 5000 && ((b[0] === 0xFF && b[1] === 0xD8) || (b[0] === 0x89 && b[1] === 0x50)); } catch { return false; } };
const realImg = (k) => ['.png', '.jpg'].map((e) => `${REAL4}/${k}${e}`).find(isImg);
// a banknote that lands on the surface: drops from above with a spin, settles on a spring, paper slap
const bill = (p, src, at, { x, y, w = 520, rot = 0, shadow = true, sfx = true, id = p.id_('bl'), from = 'top', z = '' } = {}) => {
  const start = from === 'top' ? { y: -900, rotation: rot + 24, scale: 1.15 } : from === 'left' ? { x: -1600, rotation: rot - 12 } : from === 'right' ? { x: 1600, rotation: rot + 12 } : { scale: 0.2, rotation: rot - 30 };
  if (at != null) { p.tl.push(`tl.fromTo("#${id}", {opacity:0}, {opacity:1, duration:0.06, ease:"none"}, ${r3(at)});`);
    p.tl.push(`tl.fromTo("#${id}", ${JSON.stringify(start)}, {x:0, y:0, rotation:${rot}, scale:1, duration:${SP.default}, ease:"sp-default"}, ${r3(at)});`); p.ev(at);
    if (sfx) { fx(p, SFX1 + '/paper-slap.wav', at + 0.32, -15); fx(p, 'rustle.wav', at, -24); } }
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;${at != null ? 'opacity:0;' : ''}transform:rotate(${rot}deg);${z ? `z-index:${z};` : ''}"><img src="${p.asset(src)}" style="width:100%;display:block;border-radius:4px;${shadow ? 'box-shadow:0 22px 34px -12px rgba(40,25,10,.55), 0 2px 0 rgba(0,0,0,.15);' : ''}"></div>`;
};
// the shared table seen from above (warm wood, afternoon light from the louvres)
const TABLE = (light = 'afternoon') => `<div style="position:absolute;inset:0;background:
  repeating-linear-gradient(92deg, rgba(60,30,10,.10) 0 3px, transparent 3px 41px),
  repeating-linear-gradient(88deg, rgba(255,220,160,.05) 0 2px, transparent 2px 23px),
  linear-gradient(180deg, #8C5A33 0%, #7A4C2A 45%, #6E4325 100%)"></div>
  <div style="position:absolute;inset:0;background:${light === 'amber' ? 'linear-gradient(105deg, rgba(255,170,70,.28) 0 18%, transparent 18% 26%, rgba(255,170,70,.24) 26% 42%, transparent 42% 50%, rgba(255,170,70,.2) 50% 64%, transparent 64%)' : 'linear-gradient(105deg, rgba(255,230,170,.22) 0 18%, transparent 18% 26%, rgba(255,230,170,.2) 26% 42%, transparent 42% 50%, rgba(255,230,170,.16) 50% 64%, transparent 64%)'};mix-blend-mode:screen"></div>
  <div style="position:absolute;inset:0;box-shadow:inset 0 0 220px rgba(20,10,0,.55)"></div>`;
// the yellow sticky note (handwritten, pressed hard)
const sticky = (p, at, { x, y, w = 360, rot = -4, text = 'SWITZERLAND', size = 64, under = '', underAt } = {}) => {
  const id = p.id_('sk'); if (at != null) { p.grow(id, at, { rot, from: 0.4, preset: 'snappy', dy: -40 }); fx(p, SFX1 + '/paper-slap.wav', at + 0.12, -16); }
  const ul = under ? `<div class="hand" style="font-size:${Math.round(size * 0.55)}px;color:#2B4F8C;margin-top:6px">${underAt != null ? p.typed(under, underAt, { cps: 14, cls: 'hand', sfx: false }) : under}</div>` : '';
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;padding:44px 22px 34px;background:linear-gradient(180deg,#F8E36A,#F2D643);box-shadow:0 18px 26px -10px rgba(40,25,10,.5);transform:rotate(${rot}deg);text-align:center">
    <div class="hand" style="font-size:${size}px;letter-spacing:.04em;color:#1A1612;line-height:1">${text}</div>${ul}</div>`;
};
// a centred timeline along the bottom of a scene: events slide in with a travelling pulse
const timeline = (p, events, { y = 930, x0 = 150, x1 = 1770, t0 } = {}) => {
  const lid = p.id_('tl'); p.tl.push(`tl.fromTo("#${lid}", {scaleX:0}, {scaleX:1, duration:${SP.heavy}, ease:"sp-heavy"}, ${r3(t0)});`); p.ev(t0);
  const ev = events.map(([lbl, txt, at], i) => { const id = p.id_('te'), x = x0 + (x1 - x0) * (i + 0.5) / events.length;
    p.tl.push(`tl.fromTo("#${id}", {y:60, opacity:0}, {y:0, opacity:1, duration:${SP.snappy}, ease:"sp-snappy"}, ${r3(at)});`); p.ev(at); fx(p, 'pin.wav', at, -18);
    return `<div id="${id}" style="position:absolute;left:${r3(x - 150)}px;top:${y - 84}px;width:300px;text-align:center;opacity:0"><div class="mono" style="font-size:24px;font-weight:700;color:var(--red);letter-spacing:.12em">${lbl}</div><div style="font-family:'Playfair Display',serif;font-weight:700;font-size:26px;line-height:1.1">${txt}</div><div style="width:18px;height:18px;border-radius:50%;background:var(--gold);border:4px solid var(--ink);margin:10px auto 0"></div></div>`; }).join('');
  return `<div id="${lid}" style="position:absolute;left:${x0}px;top:${y + 8}px;width:${x1 - x0}px;height:6px;background:var(--ink);transform-origin:0 50%"></div>${ev}`;
};
// split card: two equal panels, neutral colours
const split = (p, at, [la, ta], [lb, tb], { y = 330, h = 470, atB } = {}) => card(p, `${mono(la, { size: 24, color: 'var(--ink)' })}<div style="font-family:'Playfair Display',serif;font-size:38px;line-height:1.25;margin-top:14px">${ta}</div>`, at, { x: 150, y, w: 760, pad: '30px 36px' })
  + card(p, `${mono(lb, { size: 24, color: 'var(--ink)' })}<div style="font-family:'Playfair Display',serif;font-size:38px;line-height:1.25;margin-top:14px">${tb}</div>`, atB ?? at + 0.4, { x: 1010, y, w: 760, pad: '30px 36px' });
// a source line under a fact card
const src = (t) => `<div class="mono" style="font-size:20px;margin-top:12px;color:var(--muted)">${t}</div>`;

// ---------------------------------------------------------------------------
// COLD OPEN — no music. The Nest this afternoon; top-down on the shared table: a wallet emptied, every note in a
// straight row (oldest and most crumpled at one end, crispest at the other), a cowrie at the head like a chairman,
// a yellow sticky note: SWITZERLAND. Slow push-in on the note. Hands only, never a face.
export function cold() {
  const [p, c, s] = make('cold');
  const b = (...q) => cs(c, ...q);
  const aEnd = b('the oldest and most') - 0.15, bEnd = b('whose wallet it is') - 0.1;
  const N = livingNest(p, 0, aEnd, { grade: 'haze', truck: 40, seed: 41, start: { scale: 1.08, x: 0, y: 0 } });
  N.aim([900, 560], 1.5, b('emptied a whole wallet') - 0.3); N.aim([900, 560], 1.75, b('laid every note') - 0.2);
  p.scene(0, aEnd, `${N.html}
    ${card(p, `${mono(p.typed('THIS AFTERNOON · THE NEST', 0.3, { cps: 18 }))}${H(p, 'A whole wallet, *emptied onto the shared table.*', b('emptied a whole wallet') - 0.2, 56)}`, 0.2, { x: 110, y: 120, w: 860 })}
    ${p.chip('every note in a straight line', b('in a straight line'), { kind: 'chip gold', x: 110, y: 520 })}`, { bg: 'none', enter: 'cut', drift: 0 });
  nestBed(p, 0, aEnd + 0.5, -20);
  // B — top-down on the table: the row of notes, then the cowrie chairman, then the sticky note; slow push-in
  const ROW = [['5', 0.62, 'crumpled'], ['10', 0.7], ['20', 0.74], ['50', 0.8], ['100', 0.84], ['200', 0.9]];
  const old = (k) => realImg(`ghs${k}-2007-front`);
  const t0 = aEnd + 0.15, step = Math.max(0.28, (b('and the crispest') - t0) / ROW.length);
  const crumpled = fs.existsSync(`${NOTES}/ghs5-crumpled.png`) ? `${NOTES}/ghs5-crumpled.png` : note('5');
  const row = ROW.map(([k], i) => bill(p, i === 0 ? crumpled : (k === '200' ? note('200') : (old(k) || note(k))), t0 + i * step, { x: 230 + i * 268, y: 500 + (i % 2) * 22, w: 330, rot: [-11, 5, -3, 2, -1, 0][i], z: 10 + i })).join('');
  const zoom = p.id_('zm');
  p.tl.push(`tl.fromTo("#${zoom}", {scale:1, x:0, y:0}, {scale:1.5, x:-560, y:-160, duration:${r3(bEnd - b('switzerland') + 0.6)}, ease:"sine.inOut"}, ${r3(b('switzerland') - 0.2)});`); p.ev(b('switzerland'));
  p.scene(aEnd, bEnd, `<div id="${zoom}" class="wrap" style="transform-origin:0 0">${TABLE()}
      ${art(p, 'wallet', aEnd + 0.1, { x: 1560, y: 760, w: 300, rot: 8, life: 'bob', until: bEnd, sfx: 'rustle.wav', db: -14 })}
      ${row}
      ${art(p, 'cowrie', b('with a single cowrie'), { x: 40, y: 500, w: 170, rot: -10, life: 'pulse', until: bEnd, sfx: 'shell-set.wav', db: -10 })}
      ${sticky(p, b('a yellow sticky note'), { x: 1180, y: 150, w: 420, rot: -5, text: p.typed('SWITZERLAND', b('switzerland') - 0.1, { cps: 16, cls: 'hand', sfx: false }), size: 66 })}</div>
    ${card(p, `${mono('TOP-DOWN · THE SHARED TABLE')}${H(p, 'Oldest and most crumpled… *to the crispest.*', b('the oldest and most') - 0.1, 48)}`, aEnd + 0.2, { x: 110, y: 110, w: 860 })}
    ${p.chip('the chairman', b('like a chairman'), { kind: 'chip red', x: 40, y: 400 })}`, { bg: 'none', enter: 'wipeU', drift: 0 });
  fx(p, 'key.wav', b('switzerland') + 0.05, -16); fx(p, 'key.wav', b('switzerland') + 0.4, -18);
  // C — whose wallet?
  p.scene(bEnd, s.dur, `${TABLE()}<div class="wrap" style="transform:scale(1.5) translate(-370px,-110px);transform-origin:0 0">${sticky(p, null, { x: 1180, y: 150, w: 420, rot: -5, size: 66 })}</div>
    ${card(p, `${H(p, 'Whose wallet?', bEnd + 0.15, 96)}<div class="sub" style="font-size:42px;margin-top:10px">${p.words(p.id_('wh'), 'I will tell you *before we close.*', b('i will tell you'), { stagger: 0.07 })}</div>`, bEnd + 0.05, { x: 110, y: 600, w: 940 })}
    ${art(p, 'wallet', bEnd + 0.5, { x: 1250, y: 620, w: 340, rot: -6, life: 'sway', until: s.dur, sfx: 'rustle.wav' })}`, { bg: 'none', enter: 'cut', drift: 0.05 });
  fx(p, 'hit.wav', bEnd + 0.1, -12);
  p.mast = true;
  return p;
}

export function combo() { return combo1(SEGMENTS.combo1); }

// ---------------------------------------------------------------------------
// THE NEST — Chale, how the thing dey go? Kofi; the price (≈50 MB, the one price the cedi cannot change);
// missed Editions 1 and 2? Both bills come back today.
export function nest() {
  const [p, c, s] = make('nest');
  const b = (...q) => cs(c, ...q);
  const aEnd = b('and this fourth edition') - 0.1, bEnd = b('if you have not') - 0.1;
  const N = livingNest(p, 0, aEnd, { grade: 'haze', truck: 36, seed: 43, start: { scale: 1.3, x: 160, y: -120 } });
  N.aim('typewriter', 1.7, 0.4); N.aim('laptop', 1.5, b('i am kofi') - 0.2); N.aim([960, 540], 1.1, b('this is the gold') - 0.1);
  p.scene(0, aEnd, `${N.html}
    ${card(p, `${H(p, 'Chale, how the thing *dey go?*', 0.1, 84)}<div class="sub" style="font-size:46px;margin-top:14px">${p.words(p.id_('k'), 'I am *Kofi*, the Editor.', b('i am kofi'), { stagger: 0.08 })}</div>`, 0.05, { x: 110, y: 130, w: 980 })}
    <div style="position:absolute;left:110px;top:520px">${p.chip('THE GOLD COAST PALAVA', b('this is the gold'), { kind: 'chip red' })}</div>
    ${pin(p, 'the editor’s desk', 760, 720, b('i am kofi') + 0.4, 40, 30)}`, { bg: 'none', enter: 'cut', drift: 0 });
  nestBed(p, 0, aEnd + 0.4, -22);
  const m50 = b('about fifty megabytes', 'fifty megabytes'); const box = p.id_('pb');
  p.grow(box, m50 - 0.25, { rot: -1.5, preset: 'heavy', from: 0.7, dy: 40 }); fx(p, 'thump.wav', m50 + 0.1, -10); fx(p, SFX1 + '/coins.wav', m50 + 0.5, -18);
  p.scene(aEnd, bEnd, `<div style="position:absolute;left:0;right:0;top:130px;display:flex;justify-content:center">${p.kicker('THE PRICE OF THIS FOURTH EDITION', aEnd + 0.15)}</div>
    <div style="position:absolute;left:0;right:0;top:210px;display:flex;justify-content:center"><div id="${box}" style="border:8px solid var(--ink);padding:20px 60px 34px;background:#FCF5E8;box-shadow:16px 18px 0 var(--ink)">
      <div class="mono" style="font-size:28px;font-weight:700;letter-spacing:.3em;color:var(--red)">PRICE · EDITION No. 4</div>
      <div style="font-family:'Playfair Display',serif;font-weight:900;font-size:220px;line-height:1;white-space:nowrap">${p.words('price', '≈ 50 MB', m50 + 0.05, { stagger: 0.1 })}</div></div></div>
    ${p.stamp('PAID IN DATA', b('since the thing'), { x: 1290, y: 200, rot: 8, size: 46 })}
    ${p.chip('the one price the cedi cannot change', b('is the one price'), { kind: 'chip gold', x: 180, y: 720 })}
    ${bill(p, note('1'), b('the cedi cannot change') - 0.2, { x: 1300, y: 640, w: 470, rot: 6 })}`, { enter: 'wipeU' });
  const ec = (img, ed, title, x, at, rot) => { const id = p.id_('ec'); p.grow(id, at, { rot, from: 0.7, preset: 'heavy' }); fx(p, 'kachunk.wav', at + 0.1, -14);
    return `<div id="${id}" style="position:absolute;left:${x}px;top:170px;width:540px;background:#1A1612;padding:14px;box-shadow:0 40px 70px -24px rgba(60,40,10,.5)"><div style="position:relative;height:300px;background:${img}">
      <div style="position:absolute;left:0;right:0;bottom:0;padding:14px 18px;background:linear-gradient(transparent, rgba(0,0,0,.85))"><div class="mono" style="color:#C8962F;font-size:18px;letter-spacing:.2em;font-weight:700">GOLD COAST PALAVA · ${ed}</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:32px;color:#FCF5E8;line-height:1.05">${title}</div></div>
      <div style="position:absolute;left:220px;top:90px;width:90px;height:90px;border-radius:50%;background:rgba(164,36,27,.92);display:flex;align-items:center;justify-content:center"><div style="width:0;height:0;border-left:34px solid #FCF5E8;border-top:22px solid transparent;border-bottom:22px solid transparent;margin-left:8px"></div></div></div></div>`; };
  p.scene(bEnd, s.dur, `${head(p, 'MISSED EDITIONS 1 AND 2?', bEnd + 0.1, '*Watch them first.*', bEnd + 0.25, { size: 92, w: 700 })}
    ${ec(`url(${p.asset('/home/user/gcp/ed1/media/drawn/prempeh1-exile.jpg')}) center 30%/cover`, 'EDITION 1', 'The gold Asante owed Britain', 790, bEnd + 0.4, -2)}
    ${ec(`radial-gradient(ellipse at 60% 45%, #8A6A2E 0%, #3B2A1C 70%)`, 'EDITION 2', 'The gold scheme — and its price', 1350, bEnd + 0.9, 2)}
    ${st(p, 'gold-refine', b('the gold scheme'), { x: 1560, y: 190, w: 150, rot: -8, life: 'bob', until: s.dur })}
    ${p.chip('go back for them first', b('go back for them'), { kind: 'chip red', x: 150, y: 450 })}
    ${stack(p, [['Edition 1 · the gold Asante owed Britain', b('the gold asante'), 'chip light'], ['Edition 2 · a price on the gold scheme', b('the gold scheme'), 'chip light']], { y: 560 })}
    ${p.stamp('THE BILL IS DUE', b('to collect their bill'), { x: 900, y: 760, rot: -6, size: 60 })}
    ${st1(p, 'gold-dust', b('both come back'), { x: 1560, y: 600, w: 260, rot: 4, life: 'bob', until: s.dur })}`, { enter: 'push' });
  return p;
}
// ---------------------------------------------------------------------------
// FRONT PAGE — five cards; the camera pushes onto each as it is asked.
const qcard = (p, at, { x, y, w, h, tag, q, rot = 0, lead = false, classified = false, fs = 40 }) => {
  const id = p.id_('qc');
  p.tl.push(`tl.fromTo("#${id}", {opacity:0}, {opacity:1, duration:0.08, ease:"none"}, ${r3(at)});`);
  p.tl.push(`tl.fromTo("#${id}", {y:-340, scale:1.25, rotation:${rot + (p.uid % 2 ? 14 : -14)}}, {y:0, scale:1, rotation:${rot}, duration:${SP.default}, ease:"sp-default"}, ${r3(at)});`);
  p.ev(at); p.sound('page-turn-3.mp3', at + 0.05, -18); fx(p, 'thump.wav', at + 0.3, lead ? -10 : -16);
  const style = classified ? 'background:#FCF5E8;border:3px dashed var(--ink);box-shadow:none' : '';
  return `<div id="${id}" class="card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${style}"><div class="lbl"><span>${classified ? 'CLASSIFIED' : 'FRONT PAGE'}</span><b>${tag}</b></div><h3 style="font-size:${fs}px">${q}</h3></div>`;
};
export function front() {
  const [p, c, s] = make('front');
  const b = (...q) => cs(c, ...q);
  const aEnd = b('our lead') - 0.1;
  p.scene(0, aEnd, `${head(p, 'FRONT PAGE · THE HOUSE RULE', 0.1, 'Every headline is a *question.*', b('every headline') - 0.1, { size: 104, w: 1500, y: 260 })}
    ${st1(p, 'folded-paper', 0.6, { x: 1450, y: 560, w: 300, rot: 5, life: 'bob', until: aEnd + 0.5, sfx: SFX1 + '/paper-slap.wav' })}
    ${p.chip('page one', 0.3, { kind: 'chip red', x: 150, y: 600 })}${p.chip('…as the house rule goes', b('as the house rule'), { kind: 'chip light', x: 150, y: 690 })}`, { enter: 'cut' });
  fx(p, 'swoop.wav', aEnd - 0.1, -18);
  const q1 = b('how did a little'), q2 = b('is the cedi really'), q3 = b('how did ghana create'), q4 = b('why from december'), q5 = b('and tucked in');
  const fc = p.id_('fc');
  const foc = (x, y, sc, at) => p.move(`#${fc}`, { scale: sc, x: r3((960 - x) * (sc - 1)), y: r3((540 - y) * (sc - 1)) }, at, 'heavy');
  foc(550, 360, 1.18, q1 + 0.6); foc(1430, 275, 1.22, q2 + 0.3); foc(1430, 555, 1.22, q3 + 0.3); foc(550, 735, 1.2, q4 + 0.3); foc(960, 540, 1, q5 - 0.1); foc(1550, 800, 1.3, q5 + 1.3);
  [q2, q3, q4, q5 + 1.2].forEach((t) => fx(p, 'swoop.wav', t + 0.2, -22));
  p.scene(aEnd, s.dur, `<div id="${fc}" class="wrap" style="transform-origin:0 0"><div class="hl" style="left:110px;top:96px;width:900px">${p.kicker('OUR LEAD', aEnd + 0.1)}</div>
    ${qcard(p, q1 - 0.15, { x: 110, y: 150, w: 880, h: 420, tag: 'INDIAN OCEAN → YOUR POCKET', q: 'How did a little <i style="color:var(--red)">sea shell</i> give its name to the money in your pocket?', rot: -1.5, lead: true, fs: 50 })}
    ${p.stamp('LEAD STORY', q1 + 0.5, { x: 560, y: 470, rot: -7, size: 46 })}
    ${qcard(p, q2, { x: 1040, y: 150, w: 780, h: 250, tag: 'YOUR UNCLE SWEARS…', q: 'Is the cedi really printed in <i style="color:var(--red)">Switzerland?</i>', rot: 1.2, fs: 42 })}
    ${qcard(p, q3, { x: 1040, y: 430, w: 780, h: 250, tag: '2022', q: 'How did Ghana create billions of cedis <i style="color:var(--red)">without a printing press?</i>', rot: -1, fs: 38 })}
    ${qcard(p, q4, { x: 110, y: 610, w: 880, h: 250, tag: 'FROM DECEMBER', q: 'Why will Nkrumah be the <i style="color:var(--red)">only one of the Big Six</i> left on our money?', rot: 1, fs: 38 })}
    ${qcard(p, q5, { x: 1290, y: 712, w: 520, h: 170, tag: 'THE 1%', q: 'Which empire’s money did Ghana throw away <i style="color:var(--red)">for decimals</i> six years first?', rot: -2, classified: true, fs: 26 })}
    ${art(p, 'cowrie', b('a little sea shell') + 0.2, { x: 160, y: 390, w: 130, rot: -14, life: 'bob', until: s.dur, sfx: 'shell-set.wav', db: -12 })}
    ${art(p, 'ink-drop', q2 + 1.6, { x: 1700, y: 290, w: 100, rot: 6, life: 'bob', until: s.dur, sfx: 'drip.wav', db: -14 })}
    ${art(p, 'keypress', q3 + 1.8, { x: 1650, y: 560, w: 160, rot: -4, life: 'pulse', until: s.dur, sfx: 'key.wav', db: -12 })}
    <div style="position:absolute;left:760px;top:740px;width:210px;transform:rotate(-5deg)">${bill(p, note('200'), q4 + 1.6, { x: 0, y: 0, w: 210, rot: 0 })}</div>
    ${p.stamp('SWITZERLAND?', b('as your uncle swears') + 0.2, { x: 1450, y: 300, rot: -6, size: 30 })}
    ${p.stamp('£ s d → 10', b('for decimals'), { x: 1330, y: 860, rot: 4, size: 26 })}${p.stamp('SIX YEARS FIRST', b('the same thing at home'), { x: 1560, y: 650, rot: -5, size: 26 })}</div>`, { enter: 'wipeL', drift: 0 });
  return p;
}

// ---------------------------------------------------------------------------
const heading = (key, title, sub = '') => () => {
  const s = SEGMENTS[key]; const p = new Part({ ...s }); p.mast = false;
  const id = p.id_('hd'), sid = p.id_('hs');
  p.tl.push(`tl.fromTo("#${id}", {yPercent:120}, {yPercent:0, duration:${SP.heavy}, ease:"sp-heavy"}, 0.12);`);
  if (sub) p.tl.push(`tl.fromTo("#${sid}", {yPercent:120}, {yPercent:0, duration:${SP.default}, ease:"sp-default"}, 0.55);`);
  p.ev(0.12); p.sound('whoosh-1.mp3', 0.0, -14); p.sound(SFX1 + '/paper-slap.wav', 0.35, -16);
  if (key === 'headlead') { p.sound(SFX1 + '/boom.wav', 0.1, -4); p.tl.push(`tl.to("#${id}", {scale:1.06, duration:0.08, ease:"none", repeat:3, yoyo:true, immediateRender:false}, 0.42);`); }
  p.scene(0, s.dur, `<div class="kente top" style="position:absolute;left:0;right:0;top:0;height:14px"></div>
    <div style="position:absolute;left:0;right:0;top:120px;display:flex;justify-content:center"><span class="mk"><span id="${id}" class="wd" style="display:inline-block;font-family:'Playfair Display',serif;font-weight:900;font-size:110px;letter-spacing:.02em;border-bottom:8px solid var(--red);padding-bottom:6px">${title}</span></span></div>
    ${sub ? `<div style="position:absolute;left:0;right:0;top:300px;display:flex;justify-content:center"><span class="mk"><span id="${sid}" class="wd" style="font-family:'Playfair Display',serif;font-style:italic;font-size:56px;color:var(--muted)">${sub}</span></span></div>` : ''}`, { enter: 'wipeU' });
  return p;
};
export const headlead = heading('headlead', 'LEAD STORY', '“From sedie to cedi”');
export const headteam = heading('headteam', 'THE TEAM ASIDE');
export const headletters = heading('headletters', 'LETTERS PAGE');
// ---------------------------------------------------------------------------
// THE COLOPHON (COMBO3) — after the closing montage, in silence, one block at a time, then black.
const COLOPHON = [
  ['THE COLOPHON', ['Edition No. 4 · Price: ~50MB']],
  ['CORRECTIONS &amp; CLARIFICATIONS', ['In Edition 2 we said the cost of the Bank of Ghana’s gold scheme belonged to our fifth edition.', 'The season has been reordered; it is told here, in Edition 4.']],
  ['SOURCES &amp; FURTHER READING', ['Bank of Ghana, “Evolution of Currency in Ghana”; MPC Press Release, 18 Nov 2026; Governor’s statement on the Heritage Series.', 'IMF Country Reports 26/212 (2026) and 23/168 (2023). Ghana Statistical Service, CPI, Dec 2022.', 'Hogendorn &amp; Johnson, The Shell Money of the Slave Trade (Cambridge, 1986).', 'Graphic Online; GhanaWeb; GBC; GhanaFact; MyJoyOnline.']],
  ['THE MASTHEAD', ['<span class="dl"><b>Editor</b><i></i><b>Kofi</b></span>', '<span class="dl"><b>The Combative</b><i></i><b>Kwame</b></span>', '<span class="dl"><b>The Ascendant</b><i></i><b>Baaba</b></span>', '<span class="dl"><b>The Discerning</b><i></i><b>Amo</b></span>', '<span class="dl"><b>[Empty desk]</b><i></i><b>To be announced</b></span>', 'No desks assigned. Every story belongs to everyone at The Nest.']],
  ['PRODUCTION', ['Written, Edited and Narrated by Joshua Horlortu', 'Theme Music by Gonje Group, Legon']],
  ['FINE PRINT', ['The Nest newsroom is a fictional device.', 'Printed at The Nest, 266 Sandpiper Loop, Onipa Enclave. © 2026 Gold Coast Palava']],
];
export function credits() {
  const s = SEGMENTS.credits; const p = new Part({ ...s }); p.mast = false;
  p.css.push(`.colo { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; text-align:center; }
    .colo .slot { position:absolute; left:0; right:0; top:50%; transform:translateY(-50%); display:flex; justify-content:center; overflow:hidden; padding:6px 0; }
    .colo .blk { width:900px; }
    .colo h4 { font-family:'IBM Plex Mono',monospace; font-weight:700; font-size:22px; letter-spacing:.26em; color:var(--red); margin-bottom:12px; }
    .colo p { font-family:'Playfair Display',serif; font-size:24px; line-height:1.45; color:var(--ink); text-transform:uppercase; letter-spacing:.06em; }
    .colo .dl { display:flex; align-items:baseline; gap:8px; width:480px; margin:0 auto; }
    .colo .dl b { font-weight:400; } .colo .dl i { flex:1; border-bottom:2px dotted rgba(26,22,18,.55); position:relative; top:-5px; }
    .colo .blur { position:absolute; inset:-30px; background:url(assets/papers-bg.jpg) center/cover; filter:blur(11px); opacity:.6; }`);
  const n = COLOPHON.length, span = (s.dur - 0.8) / n;
  const blocks = COLOPHON.map(([h, lines], i) => {
    const id = `colo${i}`, t0 = 0.05 + i * span, t1 = t0 + span - 0.12;
    p.tl.push(`tl.fromTo("#${id}", {yPercent:140}, {yPercent:0, duration:0.32, ease:"sp-snappy"}, ${r3(t0)});`);
    if (i < n - 1) p.tl.push(`tl.to("#${id}", {yPercent:-140, duration:0.18, ease:"power2.in", immediateRender:false}, ${r3(t1)});`);
    p.ev(t0);
    return `<div class="slot"><div id="${id}" class="blk"><h4>${h}</h4>${lines.map((l) => `<p>${l}</p>`).join('')}</div></div>`;
  }).join('');
  const fadeAt = s.dur - 0.8;
  p.tl.push(`tl.fromTo("#colo-black", {opacity:0}, {opacity:1, duration:0.6, ease:"power1.inOut"}, ${r3(fadeAt)});`);
  p.scene(0, s.dur, `<div class="blur"></div><div class="colo">${blocks}</div><div id="colo-black" style="position:absolute;inset:0;background:#000;opacity:0"></div>`, { enter: 'cut', drift: 0.02, bg: 'paper' });
  p.sfx = [];
  return p;
}

export { art, stack, head, away, nameCard, counter, card, mono, H, nestBed, pin, st, st1, fx, cs, make, RIGHT, STK, STK1, SFX, SFX1, DRAWN, PILOT, r3, bill, note, realImg, TABLE, sticky, timeline, split, src, NOTES, REAL4 };
export const BUILDERS = { cold, combo1: combo, nest, front, headlead, headteam, headletters, credits };
