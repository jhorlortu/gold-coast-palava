// The channel banner (refined artwork), rebuilt as live layers cut from the artwork itself, so it can
// assemble on the page: the newspaper sheets slide in from beyond the frame, the eight desk cards fly in on
// wide arcs and settle on springs, the kente borders sweep across, the symbol morphs into its lockup and the
// wordmark rises letter by letter. Layers and positions come from work/banner2/layers.py (assets/banner2).
import fs from 'node:fs';
import path from 'node:path';
import { SP } from './lib.mjs';

const DIR = '/home/user/gcp/build/assets/banner2';
const SPEC = JSON.parse(fs.readFileSync(path.join(DIR, 'spec.json'), 'utf8'));
const spr = (k) => ({ duration: SP[k], ease: `sp-${k}` });
const T = (sel, from, to, at) => `tl.fromTo(${JSON.stringify(sel)}, ${JSON.stringify(from)}, ${JSON.stringify(to)}, ${+at.toFixed(3)});`;
const r2 = (v) => +(+v).toFixed(2);
export const CARDS = SPEC.cards;
export const BANNER_CSS = `
.bn { position:absolute; inset:0; overflow:hidden; }
.bn img { position:absolute; display:block; }
.bn-card { box-shadow:7px 9px 0 rgba(70,52,25,.30); transform-origin:50% 50%; }
.bn-mask { position:absolute; overflow:hidden; }
.bn-sym { position:absolute; left:${r2(SPEC.symbol.x)}px; top:${r2(SPEC.symbol.y)}px; width:${r2(SPEC.symbol.w)}px; height:${r2(SPEC.symbol.h)}px; transform-origin:50% 50%; }
`;
const SYMBOL = (id) => `<svg viewBox="-10 -10 220 220" width="100%" height="100%"><path id="${id}-heart" d="M100 172C38 132 24 76 64 56c22-10 36 4 36 18 0-14 14-28 36-18 40 20 26 76-36 116z" fill="#FBF6EA" stroke="#1A1612" stroke-width="10" stroke-linejoin="round"/><path id="${id}-lines" d="M100 74v90M58 84h32M60 100h30M68 116h22M80 132h10M110 84h32M110 100h30M110 116h22M110 132h10" stroke="#1A1612" stroke-width="4.5" stroke-linecap="round" fill="none"/><path id="${id}-dia" d="M100 22l12 14-12 14-12-14z" fill="#C9962F" stroke="#1A1612" stroke-width="4"/></svg>`;


/**
 * Builds the banner into Part p and schedules its assembly.
 * opts.t0          when the pieces start arriving (part-local seconds)
 * opts.symbolFrom  {x, y, s}: where the symbol is before it morphs into the lockup (intro: big and centred)
 * opts.drawSymbol  [t0, t1]: draw the symbol's strokes over this window first (intro)
 * opts.speed       1 = intro pace; >1 compresses the stagger
 * opts.until       keep the cards and sheets drifting gently until this time
 */
export function banner(p, id, { t0, symbolFrom = null, drawSymbol = null, speed = 1, cardsAt = null, until = null } = {}) {
  const k = 1 / speed;
  const tl = (s) => p.tl.push(s);
  const src = (f) => p.asset(path.join(DIR, f));
  const html = [];
  // newspaper sheets slide in from beyond the nearest edge (the ring of the banner, cut into ten pieces)
  SPEC.plate.forEach((s, i) => {
    const sid = `${id}-sh${i}`, cx = s.x + s.w / 2, cy = s.y + s.h / 2;
    const dx = cx < 300 ? -700 : cx > 1620 ? 700 : 0, dy = cy < 400 ? -560 : cy > 700 ? 560 : 0;
    html.push(`<img id="${sid}" src="${src(`sheet${i}.png`)}" style="left:${r2(s.x)}px;top:${r2(s.y)}px;width:${r2(s.w)}px;height:${r2(s.h)}px">`);
    tl(T(`#${sid}`, { x: dx, y: dy, rotation: i % 2 ? 6 : -6 }, { x: 0, y: 0, rotation: 0, ...spr('default') }, t0 + 0.02 + i * 0.05 * k));
    if (until) { const d = 3.2 + (i % 4) * 0.4, st = t0 + 1.4, n = Math.max(1, Math.floor((until - st) / d)); if (until > st + 1) tl(`tl.to("#${sid}", ${JSON.stringify({ x: i % 2 ? 5 : -5, y: i % 3 ? 4 : -4, duration: d, ease: 'sine.inOut', repeat: n - 1, yoyo: true, immediateRender: false })}, ${st.toFixed(3)});`); }
  });
  // kente borders sweep in from the centre outwards
  const kh = r2(SPEC.kente_h);
  html.push(`<img id="${id}-kt" src="${src('kente-top.png')}" style="left:0;top:0;width:1920px;height:${kh}px;transform-origin:50% 50%"><img id="${id}-kb" src="${src('kente-bot.png')}" style="left:0;bottom:0;top:auto;width:1920px;height:${kh}px;transform-origin:50% 50%">`);
  tl(T(`#${id}-kt`, { scaleX: 0 }, { scaleX: 1, ...spr('heavy') }, t0));
  tl(T(`#${id}-kb`, { scaleX: 0 }, { scaleX: 1, ...spr('heavy') }, t0 + 0.06));
  // symbol: (optionally) draws itself, then morphs into the lockup
  html.push(`<div id="${id}-sym" class="bn-sym">${SYMBOL(id)}</div>`);
  if (symbolFrom) {
    const { x, y, s } = symbolFrom;
    tl(T(`#${id}-sym`, { x, y, scale: s }, { x, y, scale: s, duration: 0.01 }, 0));
    tl(`tl.to("#${id}-sym", ${JSON.stringify({ x: 0, y: 0, scale: 1, ...spr('heavy'), immediateRender: false })}, ${(t0 + 0.05).toFixed(3)});`);
  } else {
    tl(T(`#${id}-sym`, { scale: 0.3, rotation: -20 }, { scale: 1, rotation: 0, ...spr('heavy') }, t0 + 0.1));
  }
  if (drawSymbol) {
    const [d0, d1] = drawSymbol;
    tl(T(`#${id}-heart`, { strokeDasharray: 620, strokeDashoffset: 620, fillOpacity: 0 }, { strokeDashoffset: 0, duration: (d1 - d0) * 0.75, ease: 'power2.inOut' }, d0));
    tl(T(`#${id}-heart`, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.5, ease: 'none', immediateRender: false }, d0 + (d1 - d0) * 0.7));
    tl(T(`#${id}-lines`, { strokeDasharray: 300, strokeDashoffset: 300 }, { strokeDashoffset: 0, duration: (d1 - d0) * 0.5, ease: 'power2.out' }, d0 + (d1 - d0) * 0.45));
    tl(T(`#${id}-dia`, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, ...spr('snappy') }, d1));
    p.ev(d0); p.ev(d1);
  }
  // lockup text, cut from the artwork: the wordmark rises glyph by glyph, the rest rises through masks
  const tx = SPEC.text;
  const rise = (name, at, preset = 'default') => {
    const b = tx[name], iid = `${id}-${name}`;
    html.push(`<div class="bn-mask" style="left:${r2(b.x)}px;top:${r2(b.y)}px;width:${r2(b.w)}px;height:${r2(b.h + 4)}px"><img id="${iid}" src="${src(name + '.png')}" style="left:0;top:0;width:${r2(b.w)}px;height:${r2(b.h)}px"></div>`);
    tl(T(`#${iid}`, { yPercent: 120 }, { yPercent: 0, ...spr(preset) }, at));
  };
  const W = tx.word, wsrc = src('word.png');
  tx.word_glyphs.forEach(([a, b], i) => {
    const gid = `${id}-wl${i}`, x0 = Math.max(0, a - 3), x1 = Math.min(W.w, b + 3);
    html.push(`<div class="bn-mask" style="left:${r2(W.x + x0)}px;top:${r2(W.y)}px;width:${r2(x1 - x0)}px;height:${r2(W.h + 6)}px"><img id="${gid}" src="${wsrc}" style="left:${r2(-x0)}px;top:0;width:${r2(W.w)}px;height:${r2(W.h)}px"></div>`);
    tl(T(`#${gid}`, { yPercent: 120 }, { yPercent: 0, ...spr('heavy') }, t0 + 0.25 * k + i * 0.04 * k));
  });
  rise('places', t0 + 0.6 * k);
  const rl = tx.rule;
  html.push(`<img id="${id}-rule" src="${src('rule.png')}" style="left:${r2(rl.x)}px;top:${r2(rl.y)}px;width:${r2(rl.w)}px;height:${r2(rl.h)}px;transform-origin:0 50%">`);
  tl(T(`#${id}-rule`, { scaleX: 0 }, { scaleX: 1, ...spr('default') }, t0 + 0.75 * k));
  rise('tag', t0 + 0.95 * k);
  // the eight desk cards fly in from beyond the frame on wide arcs, settle on springs, then keep drifting
  const c0 = cardsAt ?? t0 + 0.45 * k;
  SPEC.cards.forEach((c, i) => {
    const cid = `${id}-c${i}`, at = c0 + i * 0.16 * k;
    const fx = c.cx < 700 ? -900 : c.cx > 1220 ? 900 : (i % 2 ? 700 : -700), fy = c.cy < 300 ? -520 : c.cy > 700 ? 520 : (i % 2 ? -420 : 420);
    html.push(`<img id="${cid}" class="bn-card" src="${src(`card${i}.png`)}" style="left:${r2(c.cx - c.w / 2)}px;top:${r2(c.cy - c.h / 2)}px;width:${r2(c.w)}px;height:${r2(c.h)}px">`);
    tl(T(`#${cid}`, { opacity: 0 }, { opacity: 1, duration: 0.08, ease: 'none' }, at));
    tl(T(`#${cid}`, { x: fx, y: fy, scale: 1.35, rotation: c.rot + (i % 2 ? -32 : 32) }, { x: 0, y: 0, scale: 1, rotation: c.rot, ...spr('default') }, at));
    if (until && until > at + 1.4) {
      const d = 2.2 + (i % 3) * 0.45, n = Math.max(1, Math.floor((until - at - 1.2) / d));
      const ax = (i % 2 ? 1 : -1) * (10 + (i % 3) * 5), ay = (i % 2 ? -1 : 1) * (8 + (i % 4) * 3);
      tl(`tl.to("#${cid}", ${JSON.stringify({ x: ax, y: ay, rotation: c.rot + (i % 2 ? 1.6 : -1.6), duration: d, ease: 'sine.inOut', repeat: n - 1, yoyo: true, immediateRender: false })}, ${(at + 1.2).toFixed(3)});`);
    }
    p.ev(at);
    p.sound(i % 2 ? 'page-turn-3.mp3' : 'page-turn-4.mp3', at + 0.12, -19);
    p.sound('whoosh-1.mp3', at - 0.1, -26);
  });
  p.ev(t0); p.ev(t0 + 0.25 * k); p.ev(t0 + 0.95 * k);
  p.sound('whoosh-2.mp3', t0 - 0.12, -12);
  p.sound('press-2.mp3', t0, -20, 2.5);
  return `<div id="${id}" class="bn">${html.join('')}</div>`;
}
