// Gold Coast Palava — Edition 3: "The Lines on the Map"
// House style: gold-coast-palava-edit skill. Run with GCP_WORK=/home/user/gcp/ed3/work GCP_EDITION="EDITION 3".
// New in Ed2: the living Nest (nestlive.mjs) plays like a real shot whenever the Nest is on screen; denser, clearer SFX.
import fs from 'node:fs';
import path from 'node:path';
import { Part, cuer, SP } from '/home/user/gcp/build/lib.mjs';
import { banner, BANNER_CSS } from '/home/user/gcp/build/banner.mjs';
import { combo1 } from '/home/user/gcp/build/combo1.mjs';
import { livingNest } from '/home/user/gcp/ed2/build/nestlive.mjs';
import { ART } from './art.mjs';
import * as M from './maps.mjs';

const WORK = '/home/user/gcp/ed3/work';
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
  cold: seg('cold', 'cold-open', 'THE NEST · THIS EVENING'),
  combo1: seg('combo1', 'combo1', ''),
  nest: seg('nest', 'nest', 'THE NEST · THE PRICE'),
  front: seg('front', 'front-page', 'FRONT PAGE'),
  headlead: seg('headlead', 'head-lead', 'LEAD STORY'),
  lead: seg('lead', 'lead', 'LEAD STORY · LINES IN PENCIL'),
  wire: seg('wire', 'wire', 'THE WIRE · BRITISH TOGOLAND, 1956'),
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
const STK = '/home/user/gcp/ed2/media/stickers_cut', STK1 = '/home/user/gcp/ed1/media/stickers_cut';
const SFX = '/home/user/gcp/ed3/media/sfx', SFX1 = '/home/user/gcp/ed1/media/sfx';
const DRAWN = '/home/user/gcp/ed3/media/drawn';
const FONTS = '/home/user/gcp/ed3/build/node_modules/@fontsource';
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
  return `<div id="${id}" style="${abs ? `position:absolute;left:${x}px;top:${y}px;` : 'display:inline-block;'}width:${w}px;opacity:0;transform-origin:50% 80%">${ART[name](w)}</div>`;
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
// COLD OPEN — no music. The Nest this evening; the string map on the shared table; a fingertip on the red string,
// stopping again and again at the worn spot: Bawku.
export function cold() {
  const [p, c, s] = make('cold');
  const aEnd = c('and in our open newsroom') - 0.1, bEnd = c('that town is bawku') - 0.15;
  // A — the living Nest: on the shared table, the string map
  const mini = stringMap(p, { w: 150, h: 170, bbox: [-3.6, 4.6, 1.4, 11.2], ...WEST_AFRICA(null) }).html.replace('position:absolute;left:0px;top:0px', 'position:absolute;left:0;top:0');
  const mapCard = p.id_('mc');
  p.tl.push(`tl.fromTo("#${mapCard}", {opacity:0, y:-30}, {opacity:1, y:0, duration:${SP.default}, ease:"sp-default"}, ${r3(c('holds a map') - 0.1)});`);
  const N = livingNest(p, 0, aEnd, { grade: 'evening', truck: 46, seed: 31, start: { scale: 1.08, x: 0, y: 0 },
    bgExtra: `<div id="${mapCard}" style="position:absolute;left:868px;top:486px;width:75px;height:85px;opacity:0;transform:rotate(-9deg) skewX(-14deg);transform-origin:50% 100%;box-shadow:0 4px 6px rgba(0,0,0,.5);overflow:hidden"><div style="width:150px;height:170px;transform:scale(.5);transform-origin:0 0">${mini}</div></div>` });
  N.aim([910, 520], 1.6, c('holds a map') - 0.3);
  N.aim([910, 520], 2.3, c('traced in string') - 0.2);
  p.scene(0, aEnd, `${N.html}
    ${card(p, `${mono(p.typed('THIS EVENING · THE NEST', 0.35, { cps: 18 }))}${H(p, 'A map you cannot read with your *eyes alone.*', c('a map you cannot') - 0.2, 58)}`, 0.2, { x: 110, y: 120, w: 820 })}
    <div style="position:absolute;left:110px;top:470px;display:flex;gap:14px">${p.chip('RED · Britain', c('red for britain'), { kind: 'chip red' })}${p.chip('BLUE · France', c('blue for france'), { kind: 'chip', }).replace('class="chip"', 'class="chip" style="background:#2350A0"')}${p.chip('BLACK · Germany', c('black for germany'), { kind: 'chip' })}</div>`, { bg: 'none', enter: 'cut', drift: 0 });
  nestBed(p, 0, aEnd + 0.5, -20);
  for (let k = 0; k < 6; k++) fx(p, 'key.wav', 1.3 + k * 0.62 + (k % 2) * 0.17, -27);
  // B — close-up: the string map fills the frame; a fingertip follows the red string and keeps stopping at Bawku
  const SM = stringMap(p, { x: 0, y: 0, w: 1920, h: 1080, bbox: [-4.2, 4.3, 2.6, 11.6], ...WEST_AFRICA(aEnd + 0.1, 0.35),
    extra: (P) => { const [bx, by] = P(M.PLACE.Bawku); const wid = p.id_('wn'); p.tl.push(`tl.fromTo("#${wid}", {opacity:0}, {opacity:1, duration:1.5, ease:"power1.inOut"}, ${r3(c('pressed thin') - 0.6)});`);
      return `<ellipse id="${wid}" cx="${bx}" cy="${by + 8}" rx="70" ry="46" fill="rgba(120,90,50,.35)" style="filter:blur(6px)" opacity="0"/>`; },
    pins: [{ place: 'Bawku', label: 'BAWKU', at: c('pressed thin') + 0.2, fs: 30, dx: 22, dy: -60 }] });
  const [bx, by] = SM.P(M.PLACE.Bawku);
  const route = [[-2.8, 5.0], [-3.1, 7.2], [-2.6, 9.5], [-2.0, 11.0], [-0.6, 11.1], [-0.24, 11.06], [-0.5, 10.6], [-0.24, 11.06], [-0.1, 10.4], [-0.24, 11.06]].map((ll) => SM.P(ll));
  const zoomId = p.id_('zm');
  p.tl.push(`tl.to("#${zoomId}", {scale:1.6, x:${r3(900 - 1.6 * bx)}, y:${r3(560 - 1.6 * by)}, duration:${SP.heavy}, ease:"sp-heavy", immediateRender:false}, ${r3(c('the same town') - 0.2)});`); p.ev(c('the same town'));
  p.scene(aEnd, bEnd, `<div id="${zoomId}" class="wrap" style="transform-origin:0 0">${SM.html}${fingertip(p, route, c('one pair of hands') - 0.2, c('pressed thin') + 0.4)}</div>
    ${card(p, `${mono('CLOSE-UP · THE SHARED TABLE')}${H(p, 'One pair of hands, *all afternoon.*', c('one pair of hands') - 0.3, 52)}`, aEnd + 0.2, { x: 1180, y: 120, w: 640 })}`, { bg: 'none', enter: 'iris', drift: 0.03 });
  fx(p, 'pin.wav', c('again and again') + 0.1, -16); fx(p, 'pin.wav', c('again and again') + 0.7, -18);
  // C — that town is Bawku
  p.scene(bEnd, s.dur, `<div class="wrap" style="transform:translate(${r3(1300 - 2.4 * bx)}px, ${r3(420 - 2.4 * by)}px) scale(2.4);transform-origin:0 0">${stringMap(p, { w: 1920, h: 1080, bbox: [-4.2, 4.3, 2.6, 11.6], ...WEST_AFRICA(null), pins: [{ place: 'Bawku', label: 'BAWKU', fs: 16, dx: 14, dy: -34 }] }).html}</div>
    ${card(p, `${H(p, 'That town is *Bawku.*', bEnd + 0.15, 96)}<div class="sub" style="font-size:40px;margin-top:10px">${p.words(p.id_('wh'), 'Whose hands? *Before we close.*', c('whose hands'), { stagger: 0.07 })}</div>`, bEnd + 0.05, { x: 110, y: 640, w: 980 })}`, { bg: 'none', enter: 'cut', drift: 0.05 });
  fx(p, 'hit.wav', bEnd + 0.1, -12);
  p.mast = true;
  return p;
}

export function combo() { return combo1(SEGMENTS.combo1); }

// ---------------------------------------------------------------------------
// THE NEST — My people, what dey go on? Kofi; the price; missed Editions 1 and 2?
export function nest() {
  const [p, c, s] = make('nest');
  const aEnd = c('and the price') - 0.1, bEnd = c('if you missed') - 0.1;
  const N = livingNest(p, 0, aEnd, { grade: 'evening', truck: 36, seed: 33, start: { scale: 1.3, x: 160, y: -120 } });
  N.aim('typewriter', 1.7, 0.4); N.aim('laptop', 1.5, c('i am kofi') - 0.2); N.aim([960, 540], 1.1, c('this is the gold') - 0.1);
  p.scene(0, aEnd, `${N.html}
    ${card(p, `${H(p, 'My people, what dey *go on?*', 0.1, 84)}<div class="sub" style="font-size:46px;margin-top:14px">${p.words(p.id_('k'), 'I am *Kofi*, the Editor.', c('i am kofi'), { stagger: 0.08 })}</div>`, 0.05, { x: 110, y: 130, w: 980 })}
    <div style="position:absolute;left:110px;top:520px">${p.chip('THE GOLD COAST PALAVA', c('this is the gold'), { kind: 'chip red' })}</div>
    ${pin(p, 'the editor’s desk', 760, 720, c('i am kofi') + 0.4, 40, 30)}`, { bg: 'none', enter: 'cut', drift: 0 });
  nestBed(p, 0, aEnd + 0.4, -22);
  const m50 = cs(c, 'about fifty', 'fifty megabytes'); const box = p.id_('pb');
  p.grow(box, m50 - 0.25, { rot: -1.5, preset: 'heavy', from: 0.7, dy: 40 }); fx(p, 'thump.wav', m50 + 0.1, -10); fx(p, SFX1 + '/coins.wav', m50 + 0.5, -18);
  const smp = stringMap(p, { w: 340, h: 390, ...WEST_AFRICA(c('a small price') + 0.2, 0.25) });
  p.scene(aEnd, bEnd, `<div style="position:absolute;left:0;right:0;top:140px;display:flex;justify-content:center">${p.kicker('THE PRICE OF THIS THIRD EDITION', aEnd + 0.15)}</div>
    <div style="position:absolute;left:0;right:0;top:220px;display:flex;justify-content:center"><div id="${box}" style="border:8px solid var(--ink);padding:20px 60px 34px;background:#FCF5E8;box-shadow:16px 18px 0 var(--ink)">
      <div class="mono" style="font-size:28px;font-weight:700;letter-spacing:.3em;color:var(--red)">PRICE · EDITION No. 3</div>
      <div style="font-family:'Playfair Display',serif;font-weight:900;font-size:220px;line-height:1;white-space:nowrap">${p.words('price', '≈ 50 MB', m50 + 0.05, { stagger: 0.1 })}</div></div></div>
    ${p.stamp('PAID IN DATA', c('paid as always'), { x: 1290, y: 210, rot: 8, size: 46 })}
    <div style="position:absolute;left:1420px;top:560px;width:340px;height:390px;border:4px solid var(--ink);box-shadow:10px 12px 0 var(--ink);transform:rotate(4deg)">${smp.html}</div>
    ${p.chip('a small price for a map', c('a small price'), { kind: 'chip light', x: 180, y: 680 })}
    ${p.chip('Ghana has lived with it for 70 years', c('seventy years', '70 years'), { kind: 'chip gold', x: 180, y: 780 })}`, { enter: 'wipeU' });
  // missed Editions 1 and 2? — two end-screen style cards
  const ec = (img, ed, title, x, at, rot) => { const id = p.id_('ec'); p.grow(id, at, { rot, from: 0.7, preset: 'heavy' }); fx(p, 'kachunk.wav', at + 0.1, -14);
    return `<div id="${id}" style="position:absolute;left:${x}px;top:170px;width:540px;background:#1A1612;padding:14px;box-shadow:0 40px 70px -24px rgba(60,40,10,.5)"><div style="position:relative;height:300px;background:${img}">
      <div style="position:absolute;left:0;right:0;bottom:0;padding:14px 18px;background:linear-gradient(transparent, rgba(0,0,0,.85))"><div class="mono" style="color:#C8962F;font-size:18px;letter-spacing:.2em;font-weight:700">GOLD COAST PALAVA · ${ed}</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:32px;color:#FCF5E8;line-height:1.05">${title}</div></div>
      <div style="position:absolute;left:220px;top:90px;width:90px;height:90px;border-radius:50%;background:rgba(164,36,27,.92);display:flex;align-items:center;justify-content:center"><div style="width:0;height:0;border-left:34px solid #FCF5E8;border-top:22px solid transparent;border-bottom:22px solid transparent;margin-left:8px"></div></div></div></div>`; };
  p.scene(bEnd, s.dur, `${head(p, 'MISSED EDITIONS 1 AND 2?', bEnd + 0.1, '*Watch them first.*', bEnd + 0.25, { size: 92, w: 700 })}
    ${ec(`url(${p.asset('/home/user/gcp/ed1/media/drawn/prempeh1-exile.jpg')}) center 30%/cover`, 'EDITION 1', 'Why is Ghana a powerful nation?', 790, bEnd + 0.4, -2)}
    ${ec(`radial-gradient(ellipse at 60% 45%, #6B4A2E 0%, #3B2A1C 70%)`, 'EDITION 2', 'Sacks out, wrappers back', 1350, bEnd + 0.9, 2)}
    ${st(p, 'chocolate-note', bEnd + 1.0, { x: 1520, y: 180, w: 130, rot: -8, life: 'bob', until: s.dur })}
    ${p.chip('go back for them first', c('go back for them'), { kind: 'chip red', x: 150, y: 450 })}
    ${stack(p, [['26 Sept 1901: Asante a colony — the north a protectorate, the same day', c('on the very same day', 'very same day'), 'chip gold'], ['the cocoa farms of Edition 2 were worked by hands from the north', c('the cocoa farms'), 'chip light']], { y: 560 })}
    ${st(p, 'farmer-walk', c('by hands from'), { x: 1500, y: 640, w: 300, rot: -3, life: 'bob', until: s.dur })}`, { enter: 'push' });
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
  const aEnd = c('our lead') - 0.1;
  p.scene(0, aEnd, `${head(p, 'FRONT PAGE · THE HOUSE RULE', 0.1, 'Every headline is a *question.*', c('every headline') - 0.1, { size: 104, w: 1500, y: 260 })}
    ${st1(p, 'folded-paper', 0.6, { x: 1450, y: 560, w: 300, rot: 5, life: 'bob', until: aEnd + 0.5, sfx: SFX1 + '/paper-slap.wav' })}
    ${p.chip('page one', 0.3, { kind: 'chip red', x: 150, y: 600 })}${p.chip('…as the house rule goes', c('as the house rule'), { kind: 'chip light', x: 150, y: 690 })}`, { enter: 'cut' });
  fx(p, 'swoop.wav', aEnd - 0.1, -18);
  const q1 = c('how did a'), q2 = c('which gold coast soldier'), q3 = c('why did one territory'), q4 = c('why has a town'), q5 = c('and tucked in');
  const fc = p.id_('fc');
  const foc = (x, y, sc, at) => p.move(`#${fc}`, { scale: sc, x: r3((960 - x) * (sc - 1)), y: r3((540 - y) * (sc - 1)) }, at, 'heavy');
  foc(550, 360, 1.18, q1 + 0.6); foc(520, 330, 1.3, c('islands in the pacific')); foc(1430, 275, 1.22, q2 + 0.3); foc(1430, 555, 1.22, q3 + 0.3); foc(550, 735, 1.2, q4 + 0.3); foc(960, 540, 1, q5 - 0.1); foc(1550, 800, 1.3, q5 + 1.3);
  [q2, q3, q4, q5 + 1.2].forEach((t) => fx(p, 'swoop.wav', t + 0.2, -22));
  p.scene(aEnd, s.dur, `<div id="${fc}" class="wrap" style="transform-origin:0 0"><div class="hl" style="left:110px;top:96px;width:900px">${p.kicker('OUR LEAD', aEnd + 0.1)}</div>
    ${qcard(p, q1 - 0.15, { x: 110, y: 150, w: 880, h: 420, tag: 'YENDI · 1899', q: 'How did a king’s capital end up in a <i style="color:var(--red)">German colony</i> — and what had <i style="color:var(--red)">Pacific islands</i> to do with it?', rot: -1.5, lead: true, fs: 46 })}
    ${p.stamp('LEAD STORY', q1 + 0.5, { x: 540, y: 480, rot: -7, size: 46 })}
    ${qcard(p, q2, { x: 1040, y: 150, w: 780, h: 250, tag: '7 AUG 1914', q: 'Which Gold Coast soldier fired the <i style="color:var(--red)">first shot</i> of the First World War — and why in Togoland?', rot: 1.2, fs: 36 })}
    ${qcard(p, q3, { x: 1040, y: 430, w: 780, h: 250, tag: '9 MAY 1956', q: 'Why did one territory vote to join a country <i style="color:var(--red)">that did not yet exist?</i>', rot: -1, fs: 38 })}
    ${qcard(p, q4, { x: 110, y: 610, w: 880, h: 250, tag: 'UPPER EAST · 2021', q: 'Why has one town slept <i style="color:var(--red)">under curfew</i> since 2021?', rot: 1 })}
    ${qcard(p, q5, { x: 1290, y: 712, w: 520, h: 170, tag: 'BAWKU', q: 'Which colonial decision still decides <i style="color:var(--red)">who rules in Bawku tonight?</i>', rot: -2, classified: true, fs: 27 })}
    ${art(p, 'islands', c('islands in the pacific'), { x: 150, y: 400, w: 180, rot: -4, life: 'bob', until: s.dur, sfx: SFX + '/waves.wav', db: -18 })}
    ${art(p, 'ballot', q3 + 1.4, { x: 1690, y: 550, w: 130, rot: 6, life: 'bob', until: s.dur, sfx: SFX + '/ballot.wav', db: -12 })}
    ${art(p, 'curfew', q4 + 1.2, { x: 820, y: 720, w: 150, rot: -4, life: 'pulse', until: s.dur, sfx: SFX + '/tick.wav', db: -14 })}
    ${p.stamp('TONIGHT?', c('bawku tonight'), { x: 1580, y: 650, rot: 6, size: 30 })}
    ${p.stamp('FIRST SHOT', c('the first shot') + 0.2, { x: 1500, y: 300, rot: -6, size: 30, sfx: null })}</div>`, { enter: 'wipeL', drift: 0 });
  fx(p, 'rifle.wav', c('the first shot') + 0.2, -14);
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
export const headlead = heading('headlead', 'LEAD STORY', '“Lines in pencil”');
export const headteam = heading('headteam', 'THE TEAM ASIDE');
export const headletters = heading('headletters', 'LETTERS PAGE');

// ---------------------------------------------------------------------------
// THE COLOPHON (COMBO3) — after the closing montage, in silence, one block at a time, then black.
const COLOPHON = [
  ['THE COLOPHON', ['Edition No. 3 · Price: ~50MB']],
  ['CORRECTIONS &amp; CLARIFICATIONS', ['None this edition.']],
  ['SOURCES &amp; FURTHER READING', ['The London Gazette, Northern Territories Order in Council, 1901.', 'UN, Report of the Plebiscite Commissioner, Togoland under UK Administration (1956).', 'R. G. Thomas, “Forced Labour in British West Africa”, Journal of African History.', 'The Presidency; Graphic Online; Daily Guide; Ministry of the Interior; Citi Newsroom; GhanaWeb.']],
  ['THE MASTHEAD', ['<span class="dl"><b>Editor</b><i></i><b>Kofi</b></span>', '<span class="dl"><b>The Restless</b><i></i><b>Aba</b></span>', '<span class="dl"><b>The Combative</b><i></i><b>Kwame</b></span>', '<span class="dl"><b>The Ascendant</b><i></i><b>Baaba</b></span>', '<span class="dl"><b>The Discerning</b><i></i><b>Amo</b></span>', 'No desks assigned. Every story belongs to everyone at The Nest.']],
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

export { art, stringMap, WEST_AFRICA, fingertip, stack, head, away, nameCard, counter, card, mono, H, nestBed, pin, st, st1, fx, cs, make, RIGHT, STK, STK1, SFX, SFX1, DRAWN, PILOT, r3 };
export const BUILDERS = { cold, combo1: combo, nest, front, headlead, headteam, headletters, credits };
