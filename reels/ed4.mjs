// Social reel (9:16) — Edition 4, "What Is a Cedi?": straight content, voice + SFX, no music.
// Hook (is the cedi printed in Switzerland?) → the shell question on a sticky note → the montage → the catchiest beats in
// order → the end card: watch the full edition on YouTube, link in bio.
import fs from 'node:fs';
import { loadReel, captions, hl, kick, endCard, bannerP, enrichSfx, X0 } from './rlib.mjs';
import { livingNest } from '/home/user/gcp/ed2/build/nestlive.mjs';
import { art, nameCard, counter, fx, SFX1, r3, bill, note, realImg, TABLE, sticky } from '/home/user/gcp/ed4/build/ed4.mjs';
const FONTS = '/home/user/gcp/ed4/build/node_modules/@fontsource';
const S4 = '/home/user/gcp/ed4/media/sfx';

export function build() {
  const { R, p, c: c0, at, win } = loadReel('/home/user/gcp/reels/ed4', 'FULL EDITION ON YOUTUBE');
  const c = (...qs) => { for (const q of qs) { try { return c0(q); } catch {} } throw new Error('no cue: ' + qs.join(' | ')); };
  c.words = c0.words;
  p.css.push(`@font-face { font-family:'Caveat'; src:url('${p.asset(FONTS + '/caveat/files/caveat-latin-700-normal.woff2')}') format('woff2'); font-weight:700; }
@font-face { font-family:'Special Elite'; src:url('${p.asset(FONTS + '/special-elite/files/special-elite-latin-400-normal.woff2')}') format('woff2'); }
.hand { font-family:'Caveat', cursive; font-weight:700; } .elite { font-family:'Special Elite', monospace; }`);
  const chip = (t, tt, y, kind = 'chip light', x = X0) => p.chip(t, tt, { kind, x, y });
  const card = (inner, t, { y, x = X0, w = 940, rot = 0 }) => { const id = p.id_('cd'); if (t != null) { p.grow(id, t, { from: 0.8, dy: 30, rot }); fx(p, SFX1 + '/paper-slap.wav', t + 0.15, -18); }
    return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;background:#FCF5E8;border:5px solid var(--ink);box-shadow:12px 14px 0 var(--ink);padding:26px 34px;transform:rotate(${rot}deg)">${inner}</div>`; };
  const mono = (t) => `<div class="mono" style="font-size:26px;font-weight:700;letter-spacing:.2em;color:var(--red)">${t}</div>`;
  const big = (t, size = 96) => `<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:${size}px;line-height:1.02;margin-top:8px">${t}</div>`;

  // HOOK — the sticky note on the shared table
  let [a, b] = win('hook');
  p.scene(0, b, `${TABLE()}
    ${hl(p, 'Is the cedi printed in *Switzerland?*', 0.1, { size: 96, y: 260 })}
    ${sticky(p, 0.3, { x: 170, y: 680, w: 740, rot: -4, size: 120 })}
    ${bill(p, note('200'), c('as your uncle'), { x: 120, y: 1110, w: 520, rot: -6 })}${bill(p, note('5'), c('every funeral'), { x: 520, y: 1160, w: 460, rot: 7 })}`, { enter: 'cut', bg: 'none' });
  fx(p, `${S4}/key.wav`, 0.4, -16); fx(p, `${S4}/key.wav`, 0.8, -18);

  // THE QUESTION — a cowrie and the money in your pocket
  [a, b] = win('question');
  p.scene(a, b, `${kick(p, 'FRONT PAGE · OUR LEAD', a + 0.1)}${hl(p, 'How did a *sea shell* name the money in your pocket?', a + 0.15, { size: 92, y: 300 })}
    ${art(p, 'cowrie', c('a little sea shell', 'sea shell'), { x: 330, y: 760, w: 420, rot: -12, life: 'pulse', until: b + 0.3, sfx: `${S4}/shell-set.wav`, db: -8 })}
    ${chip('from islands in the Indian Ocean', c('islands in the indian'), 1300, 'chip gold')}`, { enter: 'rise' });

  // THE MONTAGE
  [a, b] = win('brand');
  p.scene(a, b, bannerP(p, 'bnr', { t0: a + 0.1, until: b + 0.4, lockY: 800 }).html, { enter: 'iris', bg: 'paper' });

  // SIKA
  [a, b] = win('sika');
  p.scene(a, b, `${kick(p, 'IN TWI', a + 0.1)}${hl(p, 'Gold and money share *one word.*', a + 0.15, { size: 96, y: 290 })}
    <div style="position:absolute;left:${X0}px;top:700px;font-family:'Playfair Display',serif;font-weight:900;font-size:300px;line-height:1;color:var(--gold)">${p.words(p.id_('sk'), 'sika', c('sika') - 0.05, { stagger: 0.1 })}</div>
    ${p.icon('gold-dust', a + 0.4, { dir: '/home/user/gcp/ed1/media/stickers_cut', x: 560, y: 1080, w: 400, rot: 4, life: 'bob', until: b + 0.3, sfx: SFX1 + '/coins.wav' })}`, { enter: 'push' });

  // A PINCH OF GOLD — the pesewa
  [a, b] = win('pinch');
  p.scene(a, b, `${kick(p, 'THE SMALLEST GOLDWEIGHT', a + 0.1)}${hl(p, 'The pesewa: *a pinch of gold.*', a + 0.15, { size: 100, y: 290 })}
    ${p.icon('scales-balance', a + 0.3, { dir: '/home/user/gcp/ed1/media/stickers_cut', x: 120, y: 650, w: 520, rot: -3, life: 'sway', until: b + 0.3 })}
    ${art(p, 'pesewa', c('was the pesewa'), { x: 600, y: 900, w: 380, rot: 8, life: 'pulse', until: b + 0.3, sfx: SFX1 + '/coins.wav', db: -10 })}
    ${chip('the coin in your pocket', c('so the coin'), 1330, 'chip gold')}`, { enter: 'wipeL' });

  // THE FIRST INFLATION — shells rain down
  [a, b] = win('shells');
  let rs = 13; const R_ = () => ((rs = (rs * 9301 + 49297) % 233280) / 233280);
  const f0 = c('so many cheaper');
  const rainS = Array.from({ length: 40 }, (_, i) => { const id = p.id_('cw'), x = 60 + R_() * 900, y = 760 + R_() * 600, t = f0 + i * 0.08, rot = R_() * 360;
    p.tl.push(`tl.fromTo("#${id}", {y:-1600, rotation:${r3(rot - 90)}, opacity:1}, {y:0, rotation:${r3(rot)}, opacity:1, duration:0.8, ease:"power2.in"}, ${r3(t)});`);
    return `<div id="${id}" style="position:absolute;left:${r3(x)}px;top:${r3(y)}px;width:90px;opacity:0">${art(p, 'cowrie', null, { abs: false, w: 90, sfx: null })}</div>`; }).join('');
  p.ev(f0 + 1.5); p.ev(f0 + 3);
  fx(p, `${S4}/shells-pour.wav`, f0, -8); fx(p, `${S4}/shells-pour.wav`, f0 + 3.8, -12);
  p.scene(a, b, `${kick(p, 'THE SECOND HALF OF THE 1800s', a + 0.1)}${hl(p, 'Cheaper shells from *East Africa.*', a + 0.15, { size: 96, y: 290 })}
    ${art(p, 'sack-pour', c('merchants shipped in'), { x: 540, y: 560, w: 420, rot: -4, life: 'jiggle', until: b + 0.3, sfx: null })}${rainS}
    ${chip('the cowrie lost most of its value', c('lost most of its'), 1000, 'chip red')}${p.stamp('THE FIRST INFLATION', c('the first inflation'), { x: 140, y: 880, rot: -5, size: 52 })}
    ${card(`${mono('INFLATION, 1800s EDITION')}${big('Too many shells, <span style="color:var(--red)">too few goods.</span>', 72)}`, c('too many shells'), { y: 1100 })}`, { enter: 'wipeU' });

  // HELD UP TO THE LIGHT — 19 July 1965
  [a, b] = win('light');
  const held = realImg('cedi1-1965-front') || realImg('pound1-1958-front');
  const gl = p.id_('gl'); p.tl.push(`tl.fromTo("#${gl}", {opacity:0, scale:0.6}, {opacity:1, scale:1, duration:1.2, ease:"sp-heavy"}, ${r3(a + 0.3)});`); fx(p, `${S4}/glint.wav`, a + 0.5, -12);
  p.scene(a, b, `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#8C949A,#A9AEB0 50%,#7E8487)"></div>
    ${kick(p, 'MONDAY, 19 JULY 1965 · ACCRA', a + 0.1)}${hl(p, 'Checking whether freedom had *a watermark.*', a + 0.15, { size: 92, y: 290, color: '#FCF5E8' })}
    <div id="${gl}" style="position:absolute;left:0;top:640px;width:1080px;height:700px;background:radial-gradient(ellipse at 50% 50%, rgba(255,246,214,.95) 0%, rgba(255,230,160,.5) 45%, transparent 72%)"></div>
    ${held ? bill(p, held, a + 0.3, { x: 110, y: 780, w: 860, rot: -4 }) : card(`${mono('THE NEW MONEY')}${big('The cedi, 1965', 90)}`, a + 0.3, { y: 820 })}
    ${chip('people hold the new notes up to the light', c('up to the light'), 1340, 'chip gold')}`, { enter: 'iris', bg: 'none' });

  // FOUR ZEROS CUT OFF — 2007
  [a, b] = win('zeros');
  const z0 = c('four zeros were cut'), zid = p.id_('zz');
  p.tl.push(`tl.to("#${zid} .z", {y:-300, x:(i)=>90*i-140, rotation:(i)=>i%2?40:-40, opacity:0, duration:0.9, ease:"power2.in", stagger:0.12, immediateRender:false}, ${r3(z0 + 0.4)});`); p.ev(z0 + 0.4);
  fx(p, `${S4}/snip.wav`, z0 + 0.4, -10);
  const brick = realImg('cedi20000-2002-front');
  p.scene(a, b, `${TABLE()}${kick(p, '1 JULY 2007', a + 0.1)}${hl(p, 'Four zeros, *cut off.*', a + 0.15, { size: 110, y: 290 })}
    ${brick ? bill(p, brick, a + 0.3, { x: 160, y: 560, w: 760, rot: -3 }) : card(`${mono('THE BIGGEST NOTE, 2007')}${big('¢20,000 ≈ $2', 110)}`, a + 0.3, { y: 600 })}
    <div id="${zid}" style="position:absolute;left:${X0}px;top:1080px;font-family:'Playfair Display',serif;font-weight:900;font-size:150px;color:#FCF5E8;text-shadow:7px 7px 0 #1A1612;white-space:nowrap">¢1<span class="z" style="display:inline-block">0</span><span class="z" style="display:inline-block">,0</span><span class="z" style="display:inline-block">0</span><span class="z" style="display:inline-block">0</span></div>
    ${chip('the biggest note: ≈ $2', c('worth about two dollars'), 1000, 'chip red')}
    <div style="position:absolute;left:${X0}px;top:1270px">${p.chip('= one Ghana cedi', c('one ghana cedi'), { kind: 'chip gold' })}</div>`, { enter: 'push', bg: 'none' });

  // THE RECORD — no public record of Switzerland
  [a, b] = win('record');
  p.scene(a, b, `${kick(p, 'THE PALAVA DESK · THE RECORD', a + 0.1)}${hl(p, 'No public record of a *Swiss* cedi.', a + 0.15, { size: 96, y: 290 })}
    ${sticky(p, a + 0.2, { x: 200, y: 720, w: 680, rot: -4, size: 110 })}
    ${p.stamp('MOSTLY FALSE', c('in switzerland'), { x: 200, y: 1040, rot: -8, size: 110 })}`, { enter: 'wipeL' });
  fx(p, '/home/user/gcp/project/media/sfx/stamp-2.mp3', c('in switzerland'), -8);

  // THE WRONG MACHINE
  [a, b] = win('machine');
  p.scene(a, b, `${kick(p, 'BUT CHALE…', a + 0.1)}${hl(p, 'Most cedis are *never printed at all.*', a + 0.15, { size: 96, y: 290 })}
    ${art(p, 'momo-phone', a + 0.3, { x: 170, y: 640, w: 380, rot: -6, life: 'bob', until: b + 0.3, sfx: `${S4}/blip.wav`, db: -10 })}
    ${art(p, 'keypress', c('the wrong machine'), { x: 520, y: 900, w: 460, rot: 4, life: 'pulse', until: b + 0.3, sfx: `${S4}/key.wav`, db: -8 })}`, { enter: 'push' });

  // HOW MACHAY BE THE PLANTAIN?
  [a, b] = win('plantain');
  p.scene(a, b, `${card(`<div style="font-family:'GCP Round',sans-serif;font-weight:700;font-size:96px;line-height:1.05">“How machay be the plantain?”</div>`, a + 0.1, { y: 300, rot: -2 })}
    ${art(p, 'plantain', a + 0.3, { x: 250, y: 760, w: 580, rot: 6, life: 'sway', until: b + 0.3, sfx: SFX1 + '/pop-3.wav' })}
    ${chip('…that year, and flinched?', c('and flinched'), 1250, 'chip light')}${p.stamp('FLINCH!', c('that year and'), { x: 620, y: 700, rot: 8, size: 70 })}${chip('you had met monetary policy', c('monetary policy'), 1340, 'chip red')}`, { enter: 'wipeU' });
  fx(p, SFX1 + '/murmur.wav', a + 0.2, -20);

  // EIGHT NOTES, EIGHT FACES — the Heritage Series fans out
  [a, b] = win('eight');
  const ks = ['1', '2', '5', '10', '20', '50', '100', '200'];
  const fan = ks.map((k, i) => bill(p, note(k), a + 0.2 + i * 0.22, { x: 90 + (i % 2) * 470, y: 560 + Math.floor(i / 2) * 215, w: 440, rot: i % 2 ? 2 : -2, sfx: i % 2 === 0 })).join('');
  p.scene(a, b, `${kick(p, 'THE HERITAGE SERIES · 12 NOV 2026', a + 0.1)}${hl(p, 'Eight notes, *eight faces.*', a + 0.15, { size: 110, y: 290 })}${fan}`, { enter: 'iris' });

  // NKRUMAH ON THE 200
  [a, b] = win('nkrumah');
  p.scene(a, b, `${kick(p, 'GH¢200', a + 0.1)}${hl(p, 'The only one of the *Big Six* left on our money.', a + 0.15, { size: 88, y: 290 })}
    ${bill(p, note('200'), a + 0.2, { x: 60, y: 700, w: 960, rot: -2, from: 'right' })}
    ${chip('the face the soldiers removed in 1967', c('the face the soldiers'), 600, 'chip red')}${p.stamp('THE ONLY ONE LEFT', c('now the only one'), { x: 380, y: 1340, rot: -6, size: 54 })}<div style="position:relative">${nameCard(p, c('kwame nkrumah'), { x: X0, y: 1180, role: 'GH¢200', name: 'Kwame Nkrumah' })}</div>`, { enter: 'push' });
  fx(p, SFX1 + '/bell.wav', c('kwame nkrumah'), -14);

  // DECIMAL — six years before Britain
  [a, b] = win('decimal');
  p.scene(a, b, `${kick(p, 'THE 1% · PAGE ONE’S CORNER', a + 0.1)}${hl(p, 'Ghana counted in tens *before the empire did.*', a + 0.15, { size: 88, y: 290 })}
    ${card(`${mono('GHANA GOES DECIMAL')}${big('19 July 1965', 100)}`, c('ghana dropped pounds'), { y: 660 })}
    ${card(`${mono('BRITAIN GOES DECIMAL')}${big('15 Feb 1971', 100)}`, c('and britain itself'), { y: 930 })}
    ${chip('almost six years first', c('almost six years'), 1240, 'chip red')}`, { enter: 'wipeL' });

  // PRINTED BELIEF
  [a, b] = win('belief');
  p.scene(a, b, `${kick(p, "EDITOR'S NOTE · PRINTED BELIEF", a + 0.1)}${hl(p, 'They print the paper. *Only we can print the belief.*', a + 0.15, { size: 88, y: 290 })}
    ${bill(p, note('1'), a + 0.3, { x: 120, y: 820, w: 840, rot: 3 })}`, { enter: 'push' });

  endCard(p, at.endcard.T0 - 0.1, R.total, 'GOLD COAST PALAVA · EDITION 4', { html: 'Watch the full edition on YouTube<br><span style="color:var(--red)">— link in bio</span>' });
  captions(p, R);
  enrichSfx(p);
  p.html.push('<div class="bottomdeco"></div>');
  return { p, R };
}
