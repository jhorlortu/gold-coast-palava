// Social reel (9:16) — Edition 3, "The Lines on the Map": straight content, voice + SFX, no music.
// Hook (a Ghana border drawn in a treaty about Samoa) → the question on the sticky note → the montage → the catchiest
// beats in order → "Chale, this desk gives no verdict" at the living Nest → end card.
import { loadReel, captions, hl, kick, tallPic, endCard, bannerP, enrichSfx, X0 } from './rlib.mjs';
import { livingNest } from '/home/user/gcp/ed2/build/nestlive.mjs';
import { art, stringMap, WEST_AFRICA, nameCard, counter, fx, SFX1, r3 } from '/home/user/gcp/ed3/build/ed3.mjs';
import * as M from '/home/user/gcp/ed3/build/maps.mjs';
const FONTS = '/home/user/gcp/ed2/build/node_modules/@fontsource';
const REAL = '/home/user/gcp/ed3/media/real';
const NORTH = [-2.2, 8.0, 1.0, 11.3], GH = [-3.6, 4.5, 1.6, 11.3];
const LAND = ['Brazil', 'Australia', 'Indonesia', 'Papua New Guinea', 'Peru', 'Colombia', 'Venezuela', 'Bolivia', 'Ecuador', 'Mexico', 'Nigeria', "Côte d'Ivoire",
  'Liberia', 'Cameroon', 'Niger', 'Mali', 'Chad', 'Gabon', 'New Zealand', 'Philippines', 'Chile', 'Argentina', 'Guyana', 'Suriname', 'Panama', 'Costa Rica', 'Nicaragua',
  'Honduras', 'Guatemala', 'Togo', 'Benin', 'Burkina Faso', 'Guinea', 'Sierra Leone', 'Senegal', 'Mauritania', 'Algeria', 'Libya', 'Sudan', 'Central African Rep.',
  'Dem. Rep. Congo', 'Congo', 'Angola', 'Namibia', 'South Africa', 'Ethiopia', 'Kenya', 'Tanzania', 'Somalia', 'Malaysia', 'Thailand', 'Vietnam', 'India', 'Saudi Arabia',
  'Egypt', 'Morocco', 'W. Sahara', 'Uruguay', 'Paraguay', 'Cuba', 'United States of America', 'Botswana', 'Zambia', 'Mozambique', 'Madagascar', 'Uganda', 'South Sudan'];

export function build() {
  const { R, p, c: c0, at, win } = loadReel('/home/user/gcp/reels/ed3', 'FULL EDITION ON YOUTUBE');
  const c = (...qs) => { for (const q of qs) { try { return c0(q); } catch {} } throw new Error('no cue: ' + qs.join(' | ')); };
  c.words = c0.words;
  p.css.push(`@font-face { font-family:'Caveat'; src:url('${p.asset(FONTS + '/caveat/files/caveat-latin-700-normal.woff2')}') format('woff2'); font-weight:700; }
@font-face { font-family:'Special Elite'; src:url('${p.asset(FONTS + '/special-elite/files/special-elite-latin-400-normal.woff2')}') format('woff2'); }
.hand { font-family:'Caveat', cursive; font-weight:700; }`);
  const chip = (t, tt, y, kind = 'chip light', x = X0) => p.chip(t, tt, { kind, x, y });
  // a framed window onto the living Nest (1920x1080 picture scaled into a portrait frame)
  const nestWin = (t0, t1, { y = 640, h = 700, left = -260, sc = 0.65, aims = [] } = {}) => {
    const N = livingNest(p, t0, t1, { grade: 'evening', truck: 30, seed: 33, start: { scale: 1.1, x: 0, y: 0 } });
    aims.forEach(([spot, s_, t]) => N.aim(spot, s_, t));
    for (let t = t0; t < t1 - 0.4; t += 19) fx(p, 'nest-room.wav', t, -22, Math.min(20, t1 - t));
    for (let t = Math.ceil(t0) + 0.02; t < t1; t += 1) fx(p, 'tick.wav', t, -32);
    const id = p.id_('nw'); p.grow(id, t0 + 0.05, { from: 0.85, dy: 80 });
    return `<div id="${id}" class="tframe" style="left:${X0 - 16}px;top:${y - 16}px;width:972px;height:${h + 32}px"><div style="position:relative;width:940px;height:${h}px;overflow:hidden"><div style="position:absolute;left:${left}px;top:0;width:1920px;height:1080px;transform:scale(${sc});transform-origin:0 0">${N.html}</div></div></div>`;
  };

  // HOOK — 14 November 1899: a treaty about Samoa splits the neutral zone; Yendi goes to Germany
  let [a, b] = win('hook');
  const split = c('britain and germany also') - 0.1;
  const SAM = stringMap(p, { x: X0, y: 640, w: 940, h: 560, bbox: [-180, -36, 24, 36], fills: [{ country: 'Ghana', fill: '#C8962F' }, { country: 'Samoa', fill: '#A4241B' }],
    extra: (P) => LAND.map((n) => { try { return `<path d="${M.countryPath(P, n, 110)}" fill="#D2C29C" stroke="#B09F78" stroke-width="1"/>`; } catch { return ''; } }).join(''),
    lines: [{ d: (P) => { const [ax, ay] = P([-172.1, -13.8]), [bx, by] = P([-0.1, 9.4]); return `M${ax} ${ay} C ${ax + 180} ${ay - 150}, ${bx - 260} ${by - 140}, ${bx} ${by}`; }, color: 'red', at: c('islands of samoa') + 0.2, dur: 2.0, w: 6 }],
    pins: [{ ll: [-172.1, -13.8], label: 'SAMOA', at: c('islands of samoa'), dx: 16, dy: 10 }, { ll: [-0.1, 9.4], label: 'GOLD COAST', at: c('other side of the world', 'the world'), dx: -190, dy: 20 }] });
  p.scene(0, split, `${kick(p, '14 NOVEMBER 1899', 0.1)}
    ${hl(p, 'A treaty about *Samoa*… drew a line in Ghana.', 0.15, { size: 88, y: 290 })}${SAM.html}
    ${art(p, 'islands', c('islands of samoa') - 0.1, { x: 690, y: 1120, w: 300, rot: 4, life: 'bob', until: split + 0.3, sfx: '/home/user/gcp/ed3/media/sfx/waves.wav', db: -14 })}`, { enter: 'cut' });
  const SPL = stringMap(p, { x: X0, y: 620, w: 940, h: 780, bbox: NORTH, strings: [{ country: 'Ghana', color: 'red' }, { country: 'Togo', color: 'black' }],
    fills: [{ country: 'Ghana', fill: '#F3E9CF' }, { country: 'Togo', fill: '#E6D9B8' }, { d: (P) => M.polyPath(P, M.NEUTRAL_ZONE), fill: 'rgba(200,150,47,.3)' },
      { d: (P) => M.polyPath(P, [[-0.22, 8.15], [0.32, 8.15], [0.38, 9.05], [0.3, 10.1], [-0.28, 10.1], [-0.3, 9.75], [-0.18, 9.3], [-0.25, 8.8]]), fill: 'rgba(26,22,18,.24)', at: c('went to germany') - 0.2 }],
    lines: [{ d: (P) => M.linePath(P, M.LINE_1899), color: 'black', at: split + 0.4, dur: 1.4, w: 8 }],
    pins: [{ place: 'Yendi', label: 'YENDI → GERMANY', at: c('so yendi'), dx: 18, dy: -50, fs: 26 }, { place: 'Salaga', label: 'SALAGA', at: split + 0.9, dx: -150, dy: 12, fs: 26 }] });
  p.scene(split, b, `${kick(p, 'THE NEUTRAL ZONE, SPLIT', split + 0.1)}
    ${hl(p, 'Yendi, seat of the Yaa Naa, goes to *Germany.*', split + 0.15, { size: 84, y: 290 })}${SPL.html}`, { enter: 'wipeL' });
  fx(p, 'snap.wav', split + 0.4, -10);

  // THE QUESTION — on the sticky note
  [a, b] = win('question');
  const note = c.words(a, b + 0.3).map((w, i) => { const id = `qn${i}`, t = Math.max(a + 0.05, w.s - 0.04);
    p.tl.push(`tl.fromTo("#${id}", {opacity:0, y:12}, {opacity:1, y:0, duration:0.4, ease:"sp-snappy"}, ${r3(t)});`); p.ev(t);
    const txt = w.w.replace(/,$/, /british/i.test(w.w) ? '?' : ',');
    return `<span id="${id}" style="display:inline-block;opacity:0${/german|british/i.test(w.w) ? ';color:#B3261E;text-decoration:underline;text-decoration-thickness:6px;text-underline-offset:10px' : ''}">${txt}</span>`; }).join(' ');
  fx(p, 'scribble.wav', a + 0.1, -14, 2.6); fx(p, 'scribble.wav', a + 2.8, -16, 2.6); fx(p, 'hit.wav', b - 0.5, -12);
  p.scene(a, b, `<div style="position:absolute;inset:0;background:#3B2A1C"></div>
    <div style="position:absolute;left:70px;top:250px;width:940px;height:1060px;background:linear-gradient(170deg,#FBE36A,#F3CF3C);box-shadow:0 40px 80px -20px rgba(0,0,0,.6);transform:rotate(-1.5deg);padding:90px 70px">
      <div class="hand" style="font-size:112px;line-height:1.12;color:#1F2A5C">${note}</div></div>
    ${art(p, 'pencil', a + 0.3, { x: 650, y: 1110, w: 320, rot: 8, life: 'jiggle', until: b + 0.3, sfx: '/home/user/gcp/ed3/media/sfx/pencil.wav', db: -12 })}`, { enter: 'rise', bg: 'none' });

  // THE MONTAGE
  [a, b] = win('brand');
  p.scene(a, b, bannerP(p, 'bnr', { t0: a + 0.1, until: b + 0.4, lockY: 800 }).html, { enter: 'iris', bg: 'paper' });

  // BERLIN — Europe divides Africa, not one African in the room
  [a, b] = win('berlin');
  p.scene(a, b, `${kick(p, 'BERLIN · NOV 1884 – FEB 1885', a + 0.1)}
    ${hl(p, 'Dividing Africa, with *not one African* in the room.', a + 0.15, { size: 84, y: 290 })}
    ${tallPic(p, `${REAL}/berlin-1884.jpg`, a + 0.4, { y: 640, h: 560, until: b + 0.4, zoom: 1.15 })}
    ${chip('the powers of Europe', c('the powers of europe'), 1230)}
    ${p.stamp('AFRICANS PRESENT: 0', c('not one african'), { x: 300, y: 1310, rot: -5, size: 62 })}`, { enter: 'wipeU' });
  fx(p, 'thump.wav', c('not one african') + 0.35, -8);
  fx(p, SFX1 + '/murmur.wav', a + 0.6, -24, 4);

  // ADIBO DALI — 3–4 December 1896; Yendi burned
  [a, b] = win('adibo');
  const burn = c('burned yendi'), yf = p.id_('yf');
  p.tl.push(`tl.fromTo("#${yf}", {opacity:0, scale:.5}, {opacity:1, scale:1, duration:1.2, ease:"power2.out"}, ${r3(burn)});`);
  p.tl.push(`tl.to("#${yf}", {scale:1.12, opacity:.75, duration:0.35, ease:"sine.inOut", repeat:6, yoyo:true, immediateRender:false}, ${r3(burn + 1.2)});`); p.ev(burn);
  const AD = stringMap(p, { x: X0, y: 620, w: 940, h: 740, bbox: NORTH, strings: [{ country: 'Ghana', color: 'red' }, { country: 'Togo', color: 'black' }],
    fills: [{ country: 'Ghana', fill: '#F3E9CF' }, { country: 'Togo', fill: '#E6D9B8' }, { d: (P) => M.polyPath(P, M.NEUTRAL_ZONE), fill: 'rgba(200,150,47,.25)' }],
    pins: [{ place: 'Yendi', label: 'YENDI', dx: 18, dy: -50, fs: 26, at: a + 0.6 }, { ll: [0.05, 9.25], label: 'ADIBO', dx: -150, dy: 18, fs: 26, at: c('at adibo') }],
    extra: (P) => { const [x, y] = P(M.PLACE.Yendi); return `<defs><radialGradient id="fireg"><stop offset="0" stop-color="#FFD36A"/><stop offset=".45" stop-color="#E8622C" stop-opacity=".85"/><stop offset="1" stop-color="#A4241B" stop-opacity="0"/></radialGradient></defs><circle id="${yf}" cx="${x}" cy="${y}" r="90" fill="url(#fireg)" opacity="0" style="transform-origin:${x}px ${y}px"/>`; } });
  p.scene(a, b, `${kick(p, '3 – 4 DECEMBER 1896', a + 0.1)}
    ${hl(p, '*Adibo dali:* the day of Adibo.', c('still calls') - 0.3, { size: 104, y: 290 })}${AD.html}
    ${chip('the Dagbamba fight the Germans', a + 0.3, 1385, 'chip light')}`, { enter: 'iris' });
  fx(p, 'fire.wav', burn, -10); fx(p, 'fire-far.wav', burn + 1.5, -16);

  // THE FIRST SHOT — 7 August 1914, near Nuatja
  [a, b] = win('shot');
  const shot = c('returned fire'), sh = p.id_('sh');
  p.tl.push(`tl.fromTo("#${sh}", {opacity:.9}, {opacity:0, duration:0.35, ease:"power2.out"}, ${r3(shot + 0.25)});`); p.ev(shot + 0.25);
  const SH = stringMap(p, { x: X0, y: 880, w: 940, h: 460, bbox: [-3.4, 5.0, 2.6, 11.3], ...WEST_AFRICA(null), pins: [{ place: 'Nuatja', label: 'NUATJA', at: a + 0.8, dx: 18, dy: -50, fs: 26 }] });
  p.scene(a, b, `${kick(p, '7 AUGUST 1914 · TOGOLAND', a + 0.1)}
    ${hl(p, 'The first shot of the *First World War.*', a + 0.15, { size: 90, y: 290 })}
    ${nameCard(p, a + 0.3, { y: 600, role: 'GOLD COAST REGIMENT', name: 'Alhaji Grunshi', note: 'no authentic portrait on record' })}${SH.html}
    ${chip('by a soldier in British service', c('in british service'), 1370, 'chip red')}
    <div id="${sh}" style="position:absolute;inset:0;background:#FFF6DA;opacity:0;pointer-events:none"></div>`, { enter: 'push' });
  fx(p, 'rifle.wav', shot + 0.25, -4);

  // TOGOLAND CUT IN TWO — the Ewe sliced in half
  [a, b] = win('split');
  const ewe = c('sliced the ewe');
  const TG = stringMap(p, { x: X0, y: 560, w: 940, h: 800, bbox: [-1.6, 5.6, 2.4, 11.3], fills: [{ country: 'Ghana', fill: '#F3E9CF' }, { country: 'Togo', fill: '#E6D9B8' },
      { d: (P) => M.polyPath(P, [[-1.6, 5.5], [2.4, 5.5], [2.4, 7.9], [-1.6, 7.9]]), fill: 'rgba(46,107,58,.32)', at: ewe }],
    strings: [{ country: 'Togo', color: 'black' }, { country: 'Ghana', color: 'red', at: c('cut togoland') - 0.1, dur: 2.0, w: 8 }], pins: [{ place: 'Yendi', label: 'YENDI · BRITISH', at: c('put yendi back'), dx: -270, dy: -50, fs: 26 }] });
  p.scene(a, b, `${kick(p, 'BRITAIN AND FRANCE · 1914–19', a + 0.1)}${hl(p, 'Togoland, *cut in two.*', a + 0.15, { size: 110, y: 290 })}${TG.html}
    ${chip('…and the Ewe sliced in half', ewe, 1385, 'chip red')}`, { enter: 'wipeR' });
  fx(p, 'snip.wav', c('cut togoland') + 0.6, -8); fx(p, 'snip.wav', ewe + 0.2, -8);

  // THE VOTE — 9 May 1956
  [a, b] = win('vote');
  const yes = c('ninety-three'), no = c('sixty-seven'), bar = p.id_('vb'), bar2 = p.id_('vb2');
  p.tl.push(`tl.fromTo("#${bar}", {scaleX:0}, {scaleX:1, duration:0.9, ease:"sp-heavy"}, ${r3(c('fifty-eight'))});`);
  p.tl.push(`tl.fromTo("#${bar2}", {scaleX:0}, {scaleX:1, duration:0.9, ease:"sp-heavy"}, ${r3(c('forty-two'))});`);
  p.ev(c('fifty-eight')); p.ev(c('forty-two')); fx(p, 'kachunk.wav', c('fifty-eight'), -10); fx(p, 'kachunk.wav', c('forty-two'), -10);
  p.scene(a, b, `${kick(p, 'BRITISH TOGOLAND · 9 MAY 1956', a + 0.1)}${hl(p, 'Union with the Gold Coast? *The count.*', a + 0.15, { size: 84, y: 290 })}
    <div style="position:absolute;left:${X0}px;top:600px">${counter(p, yes, 93095, { size: 170, color: 'var(--red)', dur: 1.3 })}<div class="mono" style="font-size:30px;font-weight:700;letter-spacing:.16em">CHOSE UNION</div></div>
    <div style="position:absolute;left:${X0}px;top:860px">${counter(p, no, 67492, { size: 170, dur: 1.3 })}<div class="mono" style="font-size:30px;font-weight:700;letter-spacing:.16em">SAID NO</div></div>
    <div style="position:absolute;left:${X0}px;top:1130px;width:940px;height:110px;display:flex;border:5px solid var(--ink);box-shadow:10px 12px 0 var(--ink);background:#FCF5E8">
      <div id="${bar}" style="width:58%;background:var(--red);transform-origin:0 50%;color:#FCF5E8;font-family:'Playfair Display',serif;font-weight:900;font-size:64px;display:flex;align-items:center;padding-left:24px">58%</div>
      <div id="${bar2}" style="width:42%;background:#7B5A3E;transform-origin:0 50%;color:#FCF5E8;font-family:'Playfair Display',serif;font-weight:900;font-size:64px;display:flex;align-items:center;padding-left:24px">42%</div></div>
    ${art(p, 'ballot', a + 0.4, { x: 740, y: 560, w: 260, rot: 6, life: 'bob', until: b + 0.3, sfx: '/home/user/gcp/ed3/media/sfx/ballot.wav', db: -12 })}`, { enter: 'push' });

  // BAWKU — not which country, but which chief
  [a, b] = win('bawku');
  const W = WEST_AFRICA(null);
  const BK = stringMap(p, { x: X0, y: 600, w: 940, h: 760, bbox: [-3.4, 4.6, 1.9, 12.0], fills: W.fills, strings: W.strings,
    pins: [{ place: 'Bawku', label: 'BAWKU', at: c('bawku'), dx: -170, dy: -20, fs: 30, r: 13, color: '#A4241B' }] });
  p.scene(a, b, `${kick(p, 'THE PALAVA DESK · BAWKU', a + 0.1)}${hl(p, 'Not which country, but *which chief.*', a + 0.15, { size: 92, y: 290 })}${BK.html}
    ${chip('near Burkina Faso and Togo', c('burkina'), 1385, 'chip gold')}`, { enter: 'wipeL' });

  // THE PEN — government after government
  [a, b] = win('pen');
  const ROWS = [['1958', 'Court of Appeal', 'KUSASI', c('in 1958')], ['1966', 'NLCD 112 (after the coup)', 'MAMPRUSI', c('after the 1966')]];
  const rows = ROWS.map(([y, who, to, t], i) => { const id = p.id_('lr'), aw = p.id_('aw');
    p.tl.push(`tl.fromTo("#${id}", {opacity:0, x:-40}, {opacity:1, x:0, duration:${0.6}, ease:"sp-snappy"}, ${r3(t)});`);
    const tAw = i ? c('handed the skin') : c('ruled for the kusasi', 'for the kusasi');
    p.tl.push(`tl.fromTo("#${aw}", {clipPath:"inset(0 100% 0 0)"}, {clipPath:"inset(0 0% 0 0)", duration:0.6, ease:"power1.out"}, ${r3(tAw)});`);
    p.ev(t); p.ev(tAw); fx(p, 'nib.wav', tAw, -10);
    return `<div id="${id}" style="display:flex;align-items:baseline;gap:22px;padding:18px 0;border-bottom:3px dashed #BFAF8A;opacity:0"><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:64px">${y}</div><div class="mono" style="font-size:24px;font-weight:700;width:280px">${who}</div><div id="${aw}" class="hand" style="font-size:78px;color:#1F2A5C">${to}</div></div>`; }).join('');
  const strike = p.id_('sk');
  p.tl.push(`tl.fromTo("#${strike}", {scaleX:0}, {scaleX:1, duration:0.3, ease:"power2.out"}, ${r3(c('handed the skin') - 0.3)});`); fx(p, 'eraser.wav', c('handed the skin') - 0.3, -12);
  p.scene(a, b, `${kick(p, 'SINCE INDEPENDENCE', a + 0.1)}${hl(p, 'Government after government picked up *the pen.*', a + 0.15, { size: 84, y: 290 })}
    <div style="position:absolute;left:${X0}px;top:660px;width:940px;background:#FCF5E8;border:5px solid var(--ink);box-shadow:12px 14px 0 var(--ink);padding:26px 36px">
      <div class="mono" style="font-size:24px;font-weight:700;letter-spacing:.2em;color:var(--red)">THE BAWKU SKIN · AWARDED TO</div>${rows}
      <i id="${strike}" style="position:absolute;left:500px;top:128px;width:300px;height:10px;background:var(--red);transform-origin:0 50%;transform:scaleX(0)"></i></div>
    ${art(p, 'nib', c('picked up the pen') - 0.1, { x: 640, y: 1070, w: 330, rot: -6, life: 'sway', until: b + 0.3, sfx: '/home/user/gcp/ed3/media/sfx/nib.wav', db: -10 })}`, { enter: 'iris' });

  // RADCLIFFE — five weeks to divide India
  [a, b] = win('radcliffe');
  const IN = stringMap(p, { x: X0, y: 820, w: 940, h: 560, bbox: [60, 6, 100, 37],
    fills: [{ country: 'India', fill: '#F3E9CF' }, { country: 'Pakistan', fill: '#E6D9B8' }, { country: 'Bangladesh', fill: '#E6D9B8' }, { country: 'Nepal', fill: '#EADFC4' }, { country: 'Sri Lanka', fill: '#EADFC4' }],
    strings: [{ country: 'Pakistan', color: 'red', at: c("was given about", "five weeks") - 0.2, dur: 1.6 }, { country: 'Bangladesh', color: 'red', at: c("was given about", "five weeks") + 0.8, dur: 1.2 }] });
  p.scene(a, b, `${kick(p, 'NOT ONLY OUR STORY · 1947', a + 0.1)}${hl(p, 'Five weeks to divide *India.*', a + 0.15, { size: 110, y: 290 })}
    ${nameCard(p, c('cyril radcliffe', 'radcliffe'), { y: 560, role: 'A BRITISH LAWYER', name: 'Cyril Radcliffe', note: 'had never seen India' })}${IN.html}
    ${chip('millions uprooted', c('millions'), 1300, 'chip red', 600)}`, { enter: 'wipeU' });
  fx(p, 'peel.wav', c('to divide it'), -12);

  // EDITOR'S NOTE — pencil, then ink
  [a, b] = win('pencil');
  const ink = c('inking over') - 0.1;
  const PN = stringMap(p, { x: X0, y: 600, w: 940, h: 640, bbox: GH, fills: [{ country: 'Ghana', fill: '#F3E9CF' }],
    strings: [{ country: 'Ghana', color: '#8A8072', at: c('sketched in pencil') - 0.3, dur: 1.8, w: 5 }, { country: 'Ghana', color: 'black', at: ink, dur: 1.8, w: 10 }] });
  p.scene(a, b, `${kick(p, "EDITOR'S NOTE", a + 0.1)}${hl(p, 'Sketched in *pencil.* Inked ever since.', a + 0.15, { size: 92, y: 290 })}${PN.html}
    ${chip('in Berlin and London', c('in berlin and london'), 1270, 'chip light')}
    ${chip('by men who never walked the ground', c('by men who'), 1360, 'chip gold')}
    ${art(p, 'pencil', c('sketched in pencil') - 0.2, { x: 700, y: 640, w: 290, rot: 10, life: 'jiggle', until: ink, sfx: '/home/user/gcp/ed3/media/sfx/pencil.wav', db: -12 })}
    ${art(p, 'nib', ink, { x: 700, y: 900, w: 290, rot: -8, life: 'sway', until: b + 0.3, sfx: '/home/user/gcp/ed3/media/sfx/nib.wav', db: -10 })}`, { enter: 'push' });

  // CHALE — back at the living Nest
  [a, b] = win('chale');
  p.scene(a, b, `${hl(p, 'Chale, this desk gives *no verdict.*', a + 0.05, { size: 104, y: 290 })}${nestWin(a, b + 0.4, { y: 640, h: 700, aims: [[[900, 560], 1.4, a + 0.1]] })}
    ${chip('who was holding the pen?', c('holding the pen'), 1385, 'chip red')}`, { enter: 'push' });
  endCard(p, at.endcard.T0 - 0.1, R.total, 'GOLD COAST PALAVA · EDITION 3');

  captions(p, R);
  enrichSfx(p);
  p.html.push('<div class="bottomdeco"></div>');
  return { p, R };
}
