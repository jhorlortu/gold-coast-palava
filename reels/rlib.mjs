// Vertical (1080x1920) social-reel helpers on top of the Gold Coast Palava engine.
// Zones: masthead 150-230 | headline 260-700 | picture 720-1300 | captions ~1330-1520 | platform UI below (decor only).
import fs from 'node:fs';
import path from 'node:path';
import { Part, cuer, SP, PORTRAIT } from '/home/user/gcp/build/lib.mjs';
if (!PORTRAIT) throw new Error('run reels with GCP_FORMAT=9x16');
export { Part, SP };
export const X0 = 70, CW = 940;
const E1 = '/home/user/gcp/ed1/media/sfx';
import { bannerP } from './bannerP.mjs';
export { bannerP };
const n = (v) => +(+v).toFixed(3);
const spr = (k) => `duration:${SP[k]}, ease:"sp-${k}"`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function loadReel(dir, label = '') {
  const R = JSON.parse(fs.readFileSync(path.join(dir, 'reel.json'), 'utf8'));
  const pieces = R.pieces.map((q) => ({ vo_in: q.vo_in, vo_out: q.vo_out, local0: q.T0 }));
  const c = cuer(pieces);
  const p = new Part({ id: 'reel', dur: R.total, T0: 0, label });
  p.overlap = 0.35;
  const at = Object.fromEntries([...R.pieces, ...R.beats].map((q) => [q.id, q]));
  // scene window for an item: from just before it starts to just before the next item starts
  const order = [...R.pieces, ...R.beats].sort((a, b) => a.T0 - b.T0);
  const win = (id) => { const i = order.findIndex((q) => q.id === id); return [Math.max(0, order[i].T0 - 0.12), i + 1 < order.length ? order[i + 1].T0 - 0.12 : R.total]; };
  p.css.push(PORTRAIT_CSS);
  return { R, p, c, at, win };
}

const PORTRAIT_CSS = `
.mast-l { top:108px; left:50%; transform:translateX(-50%); white-space:nowrap; font-size:22px; }
.mast-r { display:none; }
.ccw { position:absolute; left:40px; right:40px; top:1490px; display:flex; justify-content:center; z-index:950; }
.ccb { background:#FCF5E8; border:5px solid var(--ink); box-shadow:8px 10px 0 var(--ink); padding:12px 30px 16px; font-family:'GCP Round',sans-serif; font-weight:700; font-size:60px; line-height:1.12; text-align:center; max-width:960px; color:var(--ink); }
.ccb .cw { display:inline-block; opacity:.38; }
.namecard { position:absolute; background:rgba(255,253,247,.97); padding:20px 30px; border-left:12px solid var(--red); box-shadow:0 26px 40px -20px rgba(60,40,10,.45); }
.namecard .nm { font-family:'Playfair Display',serif; font-weight:900; font-size:58px; line-height:1.02; }
.namecard .rl { font-family:'IBM Plex Mono',monospace; font-weight:700; font-size:24px; letter-spacing:.16em; color:var(--red); margin-top:10px; text-transform:uppercase; }
.bignum { font-family:'Playfair Display',serif; font-weight:900; line-height:1; white-space:nowrap; }
.tframe { position:absolute; background:#FCF5E8; padding:16px; box-shadow:0 2px 6px rgba(0,0,0,.06), 0 40px 70px -24px rgba(60,40,10,.45); }
.quote { position:absolute; background:#FCF5E8; border:6px solid var(--ink); box-shadow:14px 16px 0 var(--ink); padding:40px 44px; }
.quote h1 { font-family:'Playfair Display',serif; font-style:italic; font-weight:900; line-height:1.05; }
.bottomdeco { position:absolute; left:0; right:0; bottom:0; height:14px; background:url(assets/kente.png) repeat-x; background-size:auto 14px; }
`;

/** Captions: one cream card per phrase, words appear as spoken, the word being spoken in red. */
export function captions(p, R) {
  R.captions.forEach((cp, k) => {
    const id = `cc${k}`;
    const words = cp.words.map((w, i) => {
      const wid = `${id}w${i}`, t = w.t, tn = i + 1 < cp.words.length ? cp.words[i + 1].t : cp.T1 - 0.05;
      p.tl.push(`tl.set("#${wid}", {opacity:1, color:"#A4241B"}, ${n(Math.max(cp.T0 + 0.001, t - 0.04))});`);
      p.tl.push(`tl.set("#${wid}", {color:"#1A1612"}, ${n(Math.max(t, tn - 0.04))});`);
      return `<span id="${wid}" class="cw">${esc(w.w)}</span>`;
    }).join(' ');
    p.html.push(`<div id="${id}" class="clip ccw" data-start="${n(cp.T0)}" data-duration="${n(Math.max(0.2, cp.T1 - cp.T0))}" data-track-index="8"><div class="ccb">${words}</div></div>`);
  });
}

export const hl = (p, text, at, { size = 92, y = 280, x = X0, w = CW, align = 'left', style = '' } = {}) =>
  `<div class="hl" style="left:${x}px;top:${y}px;width:${w}px;text-align:${align};${style}"><h1 style="font-size:${size}px">${p.words(p.id_('w'), text, at)}</h1></div>`;
export const kick = (p, text, at, { y = 220, x = X0, color } = {}) => `<div class="hl" style="left:${x}px;top:${y}px;width:${CW}px">${p.kicker(text, at, color)}</div>`;
export const sub = (p, text, at, { y = 560, x = X0, size = 46, w = CW } = {}) => `<div class="hl" style="left:${x}px;top:${y}px;width:${w}px"><div class="sub" style="font-size:${size}px;margin:0">${p.words(p.id_('sb'), text, at, { stagger: 0.06, preset: 'default' })}</div></div>`;

/** A name plate that slides out of its mask (for people with no authentic image, and to label portraits). */
export function nameCard(p, at, name, role, { x = X0, y = 900, w } = {}) {
  const id = p.id_('nc');
  p.tl.push(`tl.fromTo("#${id}", {xPercent:-110}, {xPercent:0, ${spr('default')}}, ${n(at)});`);
  p.sound('syn-swish.wav', at, -18); p.sound(`${E1}/paper-slap.wav`, at + 0.25, -20); p.ev(at);
  return `<div style="position:absolute;left:0;top:${y}px;overflow:hidden;padding:0 40px 40px 0"><div id="${id}" class="namecard" style="position:relative;margin-left:${x}px;${w ? `width:${w}px;` : ''}"><div class="nm">${name}</div><div class="rl">${role}</div></div></div>`;
}

/** A big number that counts up to its value. */
export function counter(p, value, at, { size = 220, color = 'var(--ink)', suffix = '', prefix = '', dur = 1.1, x = X0, y = 760, label = '', lsize = 30 } = {}) {
  const id = p.id_('cn');
  p.tl.push(`tl.fromTo("#${id}", {innerText:0}, {innerText:${value}, duration:${dur}, ease:"power2.out", snap:{innerText:1}, onUpdate:function(){var e=document.getElementById("${id}");e.innerText=Number(e.innerText).toLocaleString("en-GB");}}, ${n(at)});`);
  p.tl.push(`tl.fromTo("#${id}-b", {scale:0.6, opacity:0}, {scale:1, opacity:1, ${spr('heavy')}}, ${n(at)});`);
  for (let q = 0; q < dur; q += 0.09) p.sound('syn-tick.wav', at + q, -24);
  p.sound('syn-thud.wav', at + dur, -16); p.sound(`${E1}/coins.wav`, at + dur, -22); p.ev(at); p.ev(at + dur);
  return `<div id="${id}-b" style="position:absolute;left:${x}px;top:${y}px;transform-origin:0 50%"><div class="bignum" style="font-size:${size}px;color:${color}">${prefix}<span id="${id}">0</span>${suffix}</div>${label ? `<div class="mono" style="font-size:${lsize}px;font-weight:700;letter-spacing:.16em;margin-top:6px">${label}</div>` : ''}</div>`;
}

/** Moving picture in a tall frame (portrait-friendly crop of a cartoon clip, chosen per shot). */
export function tallVid(p, src, start, end, { x = X0, y = 720, w = CW, h = 600, rot = 0, mediaStart = 0, rate = 1, pos = '50% 50%' } = {}) {
  const id = p.id_('tv');
  const realEnd = Math.min(p.dur, end + p.overlap), dur = n(realEnd - start), zz = 600 + p.uid;
  p.html.push(`<div id="${id}-f" class="clip tframe" data-start="${n(start)}" data-duration="${dur}" style="left:${x - 16}px;top:${y - 16}px;width:${w + 32}px;height:${h + 32}px;z-index:${zz};transform-origin:50% 50%"></div>`);
  p.html.push(`<video id="${id}-v" class="clip" src="${p.asset(src)}" data-start="${n(start)}" data-duration="${dur}" data-media-start="${n(mediaStart)}"${rate !== 1 ? ` data-playback-rate="${rate}"` : ''} muted playsinline style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;object-fit:cover;object-position:${pos};z-index:${zz + 1};transform-origin:${w / 2 + 16}px ${h / 2 + 16}px"></video>`);
  for (const sel of [`#${id}-f`, `#${id}-v`]) {
    p.tl.push(`tl.fromTo("${sel}", {scale:0.8, y:120, rotation:${rot + 6}}, {scale:1, y:0, rotation:${rot}, ${spr('default')}}, ${n(start)});`);
    p.tl.push(`tl.to("${sel}", {y:-2300, rotation:${rot - 8}, ${spr('default')}, immediateRender:false}, ${n(Math.max(start + 0.5, end - 0.4))});`);
  }
  p.sound('whoosh-1.mp3', start, -18); p.ev(start);
  return id;
}

/** A still picture as a cover crop inside a tall frame, with a slow push-in. */
export function tallPic(p, src, at, { x = X0, y = 720, w = CW, h = 600, rot = 0, pos = '50% 50%', until, zoom = 1.12 } = {}) {
  const id = p.id_('tp');
  p.grow(id, at, { rot, from: 0.82, dy: 90 });
  if (until) p.tl.push(`tl.fromTo("#${id}-i", {scale:1}, {scale:${zoom}, duration:${n(until - at)}, ease:"none"}, ${n(at)});`);
  return `<div id="${id}" class="tframe" style="left:${x - 16}px;top:${y - 16}px;width:${w + 32}px;height:${h + 32}px;overflow:hidden"><div style="width:${w}px;height:${h}px;overflow:hidden"><div id="${id}-i" style="width:100%;height:100%;background:url(${p.asset(src)}) ${pos}/cover;filter:saturate(1.2) contrast(1.06)"></div></div></div>`;
}

/** Brand mark: the symbol, the wordmark rising letter by letter, the kente sweeping in. */
export function brandMark(p, at, { y = 560, presents = true } = {}) {
  const sym = p.id_('sym'), kt = p.id_('kt'), kb = p.id_('kb'), od = p.id_('od');
  p.tl.push(`tl.fromTo("#${sym}", {scale:0.2, rotation:-25, opacity:0}, {scale:1, rotation:0, opacity:1, ${spr('heavy')}}, ${n(at)});`);
  p.tl.push(`tl.fromTo("#${kt}", {scaleX:0}, {scaleX:1, ${spr('heavy')}}, ${n(at + 0.25)});`);
  p.tl.push(`tl.fromTo("#${kb}", {scaleX:0}, {scaleX:1, ${spr('heavy')}}, ${n(at + 0.3)});`);
  p.sound('heavy-swoosh.mp3', at - 0.1, -10); p.sound('stamp-2.mp3', at + 0.35, -14);
  const word1 = p.words(p.id_('bw'), 'Gold Coast', at + 0.55, { stagger: 0.09 });
  const word2 = p.words(p.id_('bw'), '*Palava*', at + 0.85, { stagger: 0.09 });
  if (presents) p.tl.push(`tl.fromTo("#${od}", {yPercent:120}, {yPercent:0, ${spr('default')}}, ${n(at + 1.3)});`);
  return `<img id="${sym}" src="${p.asset('/home/user/gcp/build/assets/gcp-symbol-transparent-1024.svg')}" style="position:absolute;left:340px;top:${y - 420}px;width:400px">
    <img id="${kt}" src="assets/kente.png" style="position:absolute;left:90px;top:${y + 20}px;width:900px;height:22px;object-fit:cover">
    <div class="hl" style="left:0;top:${y + 60}px;width:1080px;text-align:center"><h1 style="font-size:150px;line-height:.98">${word1}<br>${word2}</h1></div>
    <img id="${kb}" src="assets/kente.png" style="position:absolute;left:90px;top:${y + 400}px;width:900px;height:22px;object-fit:cover">
    ${presents ? `<div style="position:absolute;left:0;right:0;top:${y + 450}px;text-align:center"><span class="mk"><span id="${od}" class="wd mono" style="font-size:30px;font-weight:700;letter-spacing:.3em;color:var(--red)">AN OPTIMUM DIGITAL NEWSPAPER</span></span></div>` : ''}`;
}

/** End card: the banner montage (top cards), then "watch the full edition on YouTube". */
export function endCard(p, start, end, edition) {
  const play = p.id_('pl'), cta = p.id_('cta');
  const bn = bannerP(p, p.id_('ebn'), { t0: start + 0.05, until: end, cards: 'top', lockY: 780, speed: 1.4 });
  const y = Math.round(bn.bottom + 70);
  p.tl.push(`tl.fromTo("#${play}", {scale:0, rotation:-30}, {scale:1, rotation:0, ${spr('playful')}}, ${n(start + 1.1)});`);
  p.tl.push(`tl.to("#${play}", {scale:1.07, duration:0.6, ease:"sine.inOut", repeat:${Math.max(1, Math.floor((end - start - 2) / 0.6))}, yoyo:true, immediateRender:false}, ${n(start + 2.0)});`);
  p.tl.push(`tl.fromTo("#${cta}", {yPercent:120}, {yPercent:0, ${spr('default')}}, ${n(start + 1.3)});`);
  p.sound('syn-ding.wav', start + 1.15, -12); p.sound(`${E1}/bell.wav`, start + 1.4, -18);
  return p.scene(start, end, `${bn.html}
    <div style="position:absolute;left:0;right:0;top:${y}px;display:flex;justify-content:center;align-items:center;gap:26px">
      <div id="${play}" style="width:120px;height:84px;border-radius:22px;background:var(--red);display:flex;align-items:center;justify-content:center;box-shadow:0 14px 26px -10px rgba(120,20,10,.5)"><div style="width:0;height:0;border-left:38px solid #FCF5E8;border-top:23px solid transparent;border-bottom:23px solid transparent;margin-left:8px"></div></div>
      <div style="overflow:hidden"><div id="${cta}" style="font-family:'GCP Round',sans-serif;font-weight:700;font-size:50px;line-height:1.1">Watch the full edition<br><span style="color:var(--red)">on YouTube</span></div></div></div>
    <div style="position:absolute;left:0;right:0;top:${y + 170}px;text-align:center" class="mono"><span style="font-size:28px;font-weight:700;letter-spacing:.22em;background:rgba(251,248,239,.94);padding:6px 14px">${esc(edition)}</span></div>`, { enter: 'iris', bg: 'paper' });
}

/** Livelier sound: chip pops vary (three pop sounds), every landed card also gets a paper slap. */
export function enrichSfx(p) {
  let k = 0;
  p.sfx = p.sfx.flatMap((c) => {
    if (c.file.endsWith('/syn-pop.wav')) return [{ ...c, file: `${E1}/pop-${(k++ % 3) + 1}.wav`, db: c.db + 3 }];
    if (c.file.endsWith('/syn-thud.wav')) return [c, { ...c, file: `${E1}/paper-slap.wav`, db: c.db - 4 }];
    return [c];
  });
}
