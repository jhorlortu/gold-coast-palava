// The channel banner montage re-blocked for 1080x1920: the same layers as the 16:9 banner (newspaper sheets,
// the eight desk cards, the symbol, the wordmark glyph by glyph, places, rule, tagline), arranged for portrait.
// Sheets slide in from beyond the top/bottom edges, the cards fly in on wide arcs and keep drifting,
// the wordmark rises letter by letter in the centre.
import fs from 'node:fs';
import path from 'node:path';
import { SP } from '/home/user/gcp/build/lib.mjs';
const DIR = '/home/user/gcp/build/assets/banner2';
const SPEC = JSON.parse(fs.readFileSync(path.join(DIR, 'spec.json'), 'utf8'));
const spr = (k) => ({ duration: SP[k], ease: `sp-${k}` });
const T = (sel, from, to, at) => `tl.fromTo(${JSON.stringify(sel)}, ${JSON.stringify(from)}, ${JSON.stringify(to)}, ${(+at).toFixed(3)});`;
const r = (v) => +(+v).toFixed(1);

// portrait placements: [left, top, width, rotation]
const SHEETS = [[-40, -30, 400, -3], [330, -50, 400, 2], [690, -30, 420, -2], [-60, 1630, 420, 2], [330, 1650, 400, -2], [700, 1630, 420, 3]];
const SHEET_SRC = [0, 1, 2, 4, 5, 6];
const SIDE = [[-70, 520, 230, 2, 8], [920, 520, 230, -2, 9], [-70, 1060, 230, -3, 8], [920, 1060, 230, 3, 9]];
const CARDS = [[60, 250, -3], [580, 236, 2], [90, 500, 2.5], [600, 520, -2], [60, 1240, 2], [590, 1226, -2.5], [90, 1470, -2], [600, 1490, 3]];

/** opts: t0 (start), until (keep drifting), cards ('all' | 'top' | 'none'), lockY (top of the lockup block) */
export function bannerP(p, id, { t0, until = null, cards = 'all', lockY = 800, speed = 1 } = {}) {
  const k = 1 / speed, html = [], tl = (s) => p.tl.push(s);
  const src = (f) => p.asset(path.join(DIR, f));
  // newspaper sheets: top row drops in, bottom row rises in, side strips slide in
  SHEETS.forEach(([x, y, w, rot], i) => {
    const sid = `${id}-sh${i}`, top = y < 900;
    html.push(`<img id="${sid}" src="${src(`sheet${SHEET_SRC[i]}.png`)}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px">`);
    tl(T(`#${sid}`, { y: top ? -520 : 520, rotation: rot + (i % 2 ? 8 : -8) }, { y: 0, rotation: rot, ...spr('default') }, t0 + i * 0.05 * k));
  });
  SIDE.forEach(([x, y, w, rot, s], i) => {
    const sid = `${id}-sd${i}`;
    html.push(`<img id="${sid}" src="${src(`sheet${s}.png`)}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px">`);
    tl(T(`#${sid}`, { x: x < 500 ? -420 : 420, rotation: rot + 6 }, { x: 0, rotation: rot, ...spr('default') }, t0 + 0.12 + i * 0.05 * k));
  });
  // cards
  const use = cards === 'all' ? [0, 1, 2, 3, 4, 5, 6, 7] : cards === 'top' ? [0, 1, 2, 3] : [];
  const cw = 420, ch = Math.round(cw * SPEC.cards[0].h / SPEC.cards[0].w);
  use.forEach((ci, j) => {
    const [x, y, rot] = CARDS[ci], cid = `${id}-c${ci}`, at = t0 + (0.4 + j * 0.13) * k;
    const fx = x < 400 ? -900 : 900, fy = y < 900 ? -700 : 700;
    html.push(`<img id="${cid}" class="bn-card" src="${src(`card${ci}.png`)}" style="position:absolute;left:${x}px;top:${y}px;width:${cw}px;height:${ch}px;box-shadow:7px 9px 0 rgba(70,52,25,.30)">`);
    tl(T(`#${cid}`, { opacity: 0 }, { opacity: 1, duration: 0.08, ease: 'none' }, at));
    tl(T(`#${cid}`, { x: fx, y: fy, scale: 1.3, rotation: rot + (j % 2 ? -30 : 30) }, { x: 0, y: 0, scale: 1, rotation: rot, ...spr('default') }, at));
    if (until && until > at + 1.4) {
      const d = 2.2 + (j % 3) * 0.45, n = Math.max(1, Math.floor((until - at - 1.2) / d));
      tl(`tl.to("#${cid}", ${JSON.stringify({ x: (j % 2 ? 1 : -1) * 12, y: (j % 2 ? -1 : 1) * 9, rotation: rot + (j % 2 ? 1.6 : -1.6), duration: d, ease: 'sine.inOut', repeat: n - 1, yoyo: true, immediateRender: false })}, ${(at + 1.2).toFixed(3)});`);
    }
    p.ev(at); p.sound(j % 2 ? 'page-turn-3.mp3' : 'page-turn-4.mp3', at + 0.12, -18); p.sound('whoosh-1.mp3', at - 0.1, -24);
  });
  // lockup: symbol, places, wordmark (glyph by glyph), rule, tagline — centred
  const tx = SPEC.text, WW = 940, sc = WW / tx.word.w, L = (1080 - WW) / 2;
  const symW = 150, symId = `${id}-sym`;
  html.push(`<img id="${symId}" src="${p.asset('/home/user/gcp/build/assets/gcp-symbol-transparent-1024.svg')}" style="position:absolute;left:${(1080 - symW) / 2}px;top:${lockY}px;width:${symW}px">`);
  tl(T(`#${symId}`, { scale: 0.2, rotation: -25, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, ...spr('heavy') }, t0 + 0.1 * k));
  const placesY = lockY + 180, wordY = placesY + tx.places.h * sc + 10, ruleY = wordY + tx.word.h * sc + 6, tagY = ruleY + tx.rule.h * sc + 4;
  const rise = (name, y, at) => {
    const b = tx[name], w = b.w * sc, h = b.h * sc, iid = `${id}-${name}`;
    html.push(`<div style="position:absolute;overflow:hidden;left:${r((1080 - w) / 2)}px;top:${r(y)}px;width:${r(w)}px;height:${r(h + 4)}px"><img id="${iid}" src="${src(name + '.png')}" style="position:absolute;left:0;top:0;width:${r(w)}px;height:${r(h)}px"></div>`);
    tl(T(`#${iid}`, { yPercent: 120 }, { yPercent: 0, ...spr('default') }, at));
  };
  rise('places', placesY, t0 + 0.6 * k);
  const wsrc = src('word.png'), wh = tx.word.h * sc;
  tx.word_glyphs.forEach(([a, b], i) => {
    const gid = `${id}-wl${i}`, x0 = Math.max(0, a - 3), x1 = Math.min(tx.word.w, b + 3);
    html.push(`<div style="position:absolute;overflow:hidden;left:${r(L + x0 * sc)}px;top:${r(wordY)}px;width:${r((x1 - x0) * sc)}px;height:${r(wh + 8)}px"><img id="${gid}" src="${wsrc}" style="position:absolute;left:${r(-x0 * sc)}px;top:0;width:${WW}px;height:${r(wh)}px"></div>`);
    tl(T(`#${gid}`, { yPercent: 120 }, { yPercent: 0, ...spr('heavy') }, t0 + (0.3 + i * 0.04) * k));
  });
  html.push(`<img id="${id}-rule" src="${src('rule.png')}" style="position:absolute;left:${L}px;top:${r(ruleY)}px;width:${WW}px;height:${r(tx.rule.h * sc)}px;transform-origin:0 50%">`);
  tl(T(`#${id}-rule`, { scaleX: 0 }, { scaleX: 1, ...spr('default') }, t0 + 0.8 * k));
  rise('tag', tagY, t0 + 1.0 * k);
  // the kente strips sweep in
  html.push(`<img id="${id}-kt" src="${src('kente-top.png')}" style="position:absolute;left:0;top:0;width:1080px;height:22px;transform-origin:50% 50%">`);
  tl(T(`#${id}-kt`, { scaleX: 0 }, { scaleX: 1, ...spr('heavy') }, t0));
  p.ev(t0); p.ev(t0 + 0.3 * k); p.ev(t0 + 1.0 * k);
  p.sound('whoosh-2.mp3', t0 - 0.12, -12); p.sound('press-2.mp3', t0, -18, 2.5); p.sound('stamp-2.mp3', t0 + 0.35 * k, -16);
  return { id, html: `<div id="${id}" style="position:absolute;inset:0;overflow:hidden">${html.join('')}</div>`, bottom: tagY + tx.tag.h * sc };
}
