// Social reel (9:16) — Edition 2, "Sacks out, wrappers back": straight content, voice + SFX, no music.
// Hook (the mid-season price cut) → the question on the sticky note → the montage → the catchiest beats → Chale → end card.
import { loadReel, captions, hl, kick, nameCard, tallPic, endCard, bannerP, enrichSfx, X0 } from './rlib.mjs';
import { livingNest } from '/home/user/gcp/ed2/build/nestlive.mjs';
const E2 = '/home/user/gcp/ed2/media', E1 = '/home/user/gcp/ed1/media';
const STK = `${E2}/stickers_cut`, SFX = `${E2}/sfx`;
const FONTS = '/home/user/gcp/ed2/build/node_modules/@fontsource';
const r3 = (v) => +(+v).toFixed(3);

export function build() {
  const { R, p, c: c0, at, win } = loadReel('/home/user/gcp/reels/ed2', 'FULL EDITION ON YOUTUBE');
  // cue by phrase, trying alternatives in turn
  const c = (...qs) => { for (const q of qs) { try { return c0(q); } catch {} } throw new Error('no cue: ' + qs.join(' | ')); };
  c.words = c0.words;
  p.css.push(`@font-face { font-family:'Caveat'; src:url('${p.asset(FONTS + '/caveat/files/caveat-latin-700-normal.woff2')}') format('woff2'); font-weight:700; }
.hand { font-family:'Caveat', cursive; font-weight:700; }`);
  const fx = (f, t, db = -14, len) => p.sfx.push({ file: f.startsWith('/') ? f : `${SFX}/${f}`, T: r3(t), db, ...(len ? { len } : {}) });
  const st = (name, t, o = {}) => p.icon(name, t, { dir: STK, sfx: o.sfx ?? `${E1}/sfx/pop-2.wav`, ...o });
  const st1 = (name, t, o = {}) => p.icon(name, t, { dir: `${E1}/stickers_cut`, sfx: o.sfx ?? `${E1}/sfx/pop-2.wav`, ...o });
  // seek-safe rolling number (stack of preset values snapped in turn)
  const counter = (t, to, { size = 230, color = 'var(--ink)', y = 700, label = '', dur = 1.2 } = {}) => {
    const id = p.id_('ct'), N = Math.min(14, Math.max(2, to));
    const spans = Array.from({ length: N + 1 }, (_, k) => { const v = Math.round(to * (1 - Math.pow(1 - k / N, 2)));
      if (k > 0) p.tl.push(`tl.set("#${id}-${k}", {opacity:1}, ${r3(t + dur * k / N)});`);
      if (k < N) p.tl.push(`tl.set("#${id}-${k}", {opacity:0}, ${r3(t + dur * (k + 1) / N)});`);
      return `<span id="${id}-${k}" style="${k ? 'position:absolute;left:0;top:0;opacity:0' : ''}">${v.toLocaleString('en-GB')}</span>`; }).join('');
    for (let q = 0; q < dur; q += 0.1) p.sound('syn-tick.wav', t + q, -24);
    fx('register.wav', t + dur, -16); p.ev(t); p.ev(t + dur);
    return `<div style="position:absolute;left:${X0}px;top:${y}px"><div class="bignum" style="position:relative;font-size:${size}px;color:${color}"><span style="visibility:hidden">${to.toLocaleString('en-GB')}</span><span style="position:absolute;left:0;top:0">${spans}</span></div>${label ? `<div class="mono" style="font-size:30px;font-weight:700;letter-spacing:.16em;margin-top:6px">${label}</div>` : ''}</div>`;
  };
  // a struck old price → the new price
  const priceCut = (from, to, t1, t2, y, unit) => { const a = p.id_('pa'), b = p.id_('pb'), sl = p.id_('ps');
    p.tl.push(`tl.fromTo("#${a}", {opacity:0, x:-60}, {opacity:1, x:0, duration:0.5, ease:"sp-snappy"}, ${r3(t1)});`);
    p.tl.push(`tl.fromTo("#${sl}", {scaleX:0}, {scaleX:1, duration:0.3, ease:"power2.out"}, ${r3(t2 - 0.15)});`);
    p.tl.push(`tl.fromTo("#${b}", {opacity:0, y:60, scale:1.3}, {opacity:1, y:0, scale:1, duration:0.9, ease:"sp-heavy"}, ${r3(t2)});`);
    p.ev(t1); p.ev(t2); fx('drop.wav', t2 - 0.25, -8); fx('thump.wav', t2 + 0.45, -10);
    return `<div style="position:absolute;left:${X0}px;top:${y}px;width:940px"><div id="${a}" style="position:relative;display:inline-block;font-family:'Playfair Display',serif;font-weight:900;font-size:120px;color:var(--muted)">${from}<i id="${sl}" style="position:absolute;left:-6px;right:-6px;top:52%;height:14px;background:var(--red);transform-origin:0 50%"></i></div>
      <div id="${b}" style="font-family:'Playfair Display',serif;font-weight:900;font-size:140px;line-height:1.1;color:var(--red)">↓ ${to}</div><div class="mono" style="font-size:30px;font-weight:700;letter-spacing:.16em;margin-top:10px">${unit}</div></div>`; };
  // a framed window onto the living Nest (1920x1080 picture scaled into a portrait frame)
  const nestWin = (t0, t1, { y = 640, h = 700, left = -260, sc = 0.65, aims = [] } = {}) => {
    const N = livingNest(p, t0, t1, { grade: 'evening', truck: 30, seed: 21, start: { scale: 1.1, x: 0, y: 0 } });
    aims.forEach(([spot, s_, t]) => N.aim(spot, s_, t));
    for (let t = t0; t < t1 - 0.4; t += 19) fx('nest-room.wav', t, -22, Math.min(20, t1 - t));
    for (let t = Math.ceil(t0) + 0.02; t < t1; t += 1) fx('tick.wav', t, -32);
    const id = p.id_('nw'); p.grow(id, t0 + 0.05, { from: 0.85, dy: 80 });
    return `<div id="${id}" class="tframe" style="left:${X0 - 16}px;top:${y - 16}px;width:972px;height:${h + 32}px"><div style="position:relative;width:940px;height:${h}px;overflow:hidden"><div style="position:absolute;left:${left}px;top:0;width:1920px;height:1080px;transform:scale(${sc});transform-origin:0 0">${N.html}</div></div></div>`;
  };

  // HOOK — Accra, 12 February 2026: the farmers' price, cut mid-season
  let [a, b] = win('hook');
  p.scene(0, b, `${kick(p, 'ACCRA · 12 FEBRUARY 2026', 0.1)}
    ${hl(p, 'He cut the cocoa farmers’ price — *mid-season.*', 0.15, { size: 86, y: 290 })}
    ${priceCut('GH¢58,000', 'GH¢41,392', c('from 58'), c('to 41,392', 'to 41'), 700, 'PER TONNE')}
    ${st('scissors', c('he cut the price') + 0.3, { x: 720, y: 600, w: 260, rot: 8, life: 'jiggle', until: b + 0.3, sfx: `${SFX}/snip.wav`, db: -6 })}
    ${st('podium', c('middle of the season', 'the season') - 0.2, { x: 330, y: 1000, w: 380, rot: -3, life: 'bob', until: b + 0.3 })}`, { enter: 'cut' });
  // THE QUESTION — on the sticky note, in her hand
  [a, b] = win('question');
  const words = c.words(a, b + 0.3);
  const note = words.map((w, i) => { const id = `qn${i}`, t = Math.max(a + 0.05, w.s - 0.04);
    p.tl.push(`tl.fromTo("#${id}", {opacity:0, y:12}, {opacity:1, y:0, duration:0.4, ease:"sp-snappy"}, ${r3(t)});`); p.ev(t);
    return `<span id="${id}" style="display:inline-block;opacity:0${/sacks|wrappers/i.test(w.w) ? ';color:#B3261E;text-decoration:underline;text-decoration-thickness:6px;text-underline-offset:10px' : ''}">${w.w}</span>`; }).join(' ');
  fx('scribble.wav', a + 0.1, -14, 2.4); fx('scribble.wav', a + 2.5, -16, 2.2); fx('hit.wav', b - 0.6, -12);
  p.scene(a, b, `<div style="position:absolute;inset:0;background:#3B2A1C"></div>
    <div style="position:absolute;left:70px;top:250px;width:940px;height:1060px;background:linear-gradient(170deg,#FBE36A,#F3CF3C);box-shadow:0 40px 80px -20px rgba(0,0,0,.6);transform:rotate(-1.5deg);padding:90px 70px">
      <div class="hand" style="font-size:118px;line-height:1.12;color:#1F2A5C">${note}</div></div>
    ${st('chocolate-note', a + 0.3, { x: 680, y: 1130, w: 260, rot: 10, life: 'bob', until: b + 0.3, sfx: `${SFX}/crinkle.wav`, db: -10 })}`, { enter: 'rise', bg: 'none' });
  // THE MONTAGE
  [a, b] = win('brand');
  p.scene(a, b, bannerP(p, 'bnr', { t0: a + 0.1, until: b + 0.4, lockY: 800 }).html, { enter: 'iris', bg: 'paper' });
  // TETTEH QUARSHIE — Fernando Po, 1870 → Mampong, 1879
  [a, b] = win('teshie');
  const plant = c('planted them') - 0.1;
  p.scene(a, plant, `${kick(p, 'THE MAN FROM TESHIE', a + 0.1)}${hl(p, 'Tetteh *Quarshie.*', a + 0.15, { size: 130, y: 290 })}
    ${st('ship-island', c('sailed in 1870', 'in 1870'), { x: 170, y: 560, w: 740, life: 'sail', until: plant + 0.3, sfx: `${SFX}/ship.wav`, db: -10 })}
    ${p.chip('1870 → Fernando Po (Bioko)', c('fernando'), { kind: 'chip red', x: X0, y: 1290 })}
    ${p.chip('home with cocoa beans', c('came home'), { kind: 'chip gold', x: X0, y: 1390 })}`, { enter: 'wipeL' });
  fx('waves.wav', a + 0.5, -20, 4);
  p.scene(plant, b, `${kick(p, '1879 · MAMPONG, AKUAPEM', plant + 0.1)}${hl(p, 'He planted them at *Mampong.*', plant + 0.15, { size: 104, y: 290 })}
    ${tallPic(p, `${E2}/drawn/quarshie-tree.jpg`, plant + 0.3, { y: 640, h: 560, until: b + 0.4 })}
    ${st('planting', plant + 0.9, { x: 700, y: 1080, w: 280, rot: 5, life: 'bob', until: b })}`, { enter: 'iris' });
  // 1937 — THE HOLD-UP
  [a, b] = win('holdup');
  const sugar = c('sugar') - 0.15;
  p.scene(a, sugar, `${kick(p, 'OCTOBER 1937', a + 0.1)}${hl(p, 'The farmers *held up* the crop.', c('held up') - 0.2, { size: 104, y: 290 })}
    ${st('shop-shutter', c('boycotted') - 0.2, { x: 190, y: 600, w: 700, life: 'bob', until: sugar + 0.3, sfx: `${SFX}/shutter.wav`, db: -6 })}
    ${p.stamp('HELD UP', c('held up') + 0.4, { x: 120, y: 1240, rot: -6, size: 110, sfx: null })}`, { enter: 'push' });
  fx('thump.wav', c('held up') + 0.5, -6);
  p.scene(sugar, b, `${hl(p, 'Except what no home can do *without…*', sugar + 0.05, { size: 88, y: 290 })}
    ${st('essentials', sugar + 0.1, { x: 170, y: 600, w: 740, life: 'bob', until: b + 0.3 })}
    ${p.chip('sugar', c('sugar'), { kind: 'chip light', x: X0, y: 1340 })}${p.chip('kerosene', c('kerosene'), { kind: 'chip gold', x: 290, y: 1340 })}${p.chip('matches', c('matches'), { kind: 'chip light', x: 560, y: 1340 })}${p.chip('tobacco', c('tobacco'), { kind: 'chip red', x: 790, y: 1340 })}`, { enter: 'wipeU' });
  // THE 64 KG BAG — how machay?
  [a, b] = win('bag');
  p.scene(a, b, `${kick(p, 'ONE 64-KILO BAG · SEFWI', a + 0.1)}${hl(p, 'Suddenly worth… *how machay?*', c('how much i', 'how much') - 0.3, { size: 104, y: 290 })}
    ${priceCut('GH¢3,600', 'GH¢2,587', c('about 3'), c('2,587', '587'), 640, 'PER BAG')}
    ${st('cocoa-sack', a + 0.4, { x: 600, y: 1030, w: 380, rot: -4, life: 'bob', until: b + 0.3, sfx: `${SFX}/thump.wav` })}`, { enter: 'wipeR' });
  // THE FARMER'S SHARE — 70% vs 11%
  [a, b] = win('share');
  const s70 = c('about 70'), s11 = c('about 11', 'takes about 11');
  const seg = (h, col, t, lbl, tc = '#FCF5E8') => { const id = p.id_('sg'); p.tl.push(`tl.fromTo("#${id}", {scaleX:0}, {scaleX:1, duration:0.9, ease:"sp-heavy"}, ${r3(t)});`); p.ev(t); fx('snap.wav', t, -8);
    return `<div id="${id}" style="height:${h}px;background:${col};border-bottom:6px solid #2A1A10;transform-origin:0 50%;display:flex;align-items:center;padding:0 30px;color:${tc};font-family:'Playfair Display',serif;font-weight:900;font-size:62px">${lbl}</div>`; };
  p.scene(a, b, `${kick(p, 'A CHOCOLATE BAR’S VALUE', a + 0.1)}${hl(p, 'Where the money *goes.*', a + 0.15, { size: 104, y: 290 })}
    <div style="position:absolute;left:${X0}px;top:560px;width:940px;border:6px solid #2A1A10;box-shadow:12px 14px 0 #2A1A10;background:#5A3A22">
      ${seg(470, '#A4241B', s70, '70% · brands &amp; shops')}${seg(152, '#7B5A3E', s70 + 0.6, '19% · the rest')}${seg(120, '#C8962F', s11, '11% · the farmer', '#1A1612')}</div>
    ${p.chip('UN food agency (FAO) study', a + 0.6, { kind: 'chip light', x: X0, y: 1370 })}`, { enter: 'iris' });
  // EDITOR'S VIEW — stop exporting raw beans
  [a, b] = win('stop');
  const STG = [['GRINDING', c('grinding,', 'grinding')], ['PRESSING', c('pressing')], ['PACKING', c('packing')], ['BRANDING', c('branding')]];
  p.scene(a, b, `${p.stamp("EDITOR'S VIEW", a + 0.2, { x: X0, y: 230, rot: -4, size: 56 })}
    ${hl(p, 'Stop exporting *raw beans.*', c('raw beans must stop', 'must stop') - 0.6, { size: 116, y: 360 })}
    ${STG.map(([t, tt], i) => p.chip(t, tt, { kind: i % 2 ? 'chip gold' : 'chip red', x: X0 + (i % 2) * 300, y: 720 + i * 100 })).join('')}
    ${st('products', c('every stage') , { x: 660, y: 860, w: 340, rot: 4, life: 'bob', until: b + 0.3, sfx: `${SFX}/sparkle.wav`, db: -12 })}
    ${p.chip('a job here · dollars here', c('a job here'), { kind: 'chip light', x: X0, y: 1180 })}`, { enter: 'push' });
  fx('thump.wav', a + 0.3, -6);
  // THEN v NOW — a single buyer: cocoa 1947 / gold 2025
  [a, b] = win('then');
  const now = c('now, a republic', 'a republic') - 0.1;
  p.scene(a, b, `<div style="position:absolute;left:0;top:0;width:1080px;height:960px;background:#EADDBE"></div><div style="position:absolute;left:0;top:960px;width:1080px;height:960px;background:#F7EDD3"></div>
    <div style="position:absolute;left:0;top:948px;width:1080px;height:24px;background:var(--ink)"></div>
    <div class="hl" style="left:${X0}px;top:240px;width:600px">${p.kicker('THEN', a + 0.1)}<h1 style="font-size:170px">${p.words(p.id_('y'), '1947', a + 0.2)}</h1><div class="mono" style="font-size:30px;font-weight:700">A COLONY · ONE BUYER FOR COCOA</div></div>
    ${st('cocoa-sack', a + 0.5, { x: 640, y: 380, w: 360, life: 'bob', until: b + 0.3 })}
    <div class="hl" style="left:${X0}px;top:1010px;width:600px">${p.kicker('NOW', now)}<h1 style="font-size:170px">${p.words(p.id_('y'), '2025', now + 0.1)}</h1><div class="mono" style="font-size:30px;font-weight:700">A REPUBLIC · ONE BUYER FOR GOLD</div></div>
    ${st('gold-refine', now + 0.3, { x: 640, y: 1040, w: 360, life: 'pulse', until: b + 0.3, sfx: `${SFX}/sparkle.wav`, db: -10 })}`, { enter: 'wipeU', bg: 'none' });
  // THE SMUGGLING HAS TURNED AROUND — the border arrow flips
  [a, b] = win('smuggle');
  const arr = p.id_('ar'), flip = c('but this year');
  p.tl.push(`tl.fromTo("#${arr}", {scaleX:1}, {scaleX:-1, duration:0.9, ease:"sp-heavy"}, ${r3(flip)});`); p.ev(flip); fx('swoop.wav', flip, -8); fx('hit.wav', flip + 0.2, -14);
  p.scene(a, b, `${kick(p, 'THE CLASSIFIED · WESTERN BORDER', a + 0.1)}${hl(p, 'The smuggling has *turned around.*', a + 0.15, { size: 96, y: 290 })}
    <div style="position:absolute;left:${X0}px;top:600px;width:940px;height:420px">
      <div style="position:absolute;left:0;top:0;width:450px;height:420px;background:#E8D9B5;border:4px solid var(--ink)"><div class="mono" style="position:absolute;left:18px;top:14px;font-size:28px;font-weight:700">CÔTE D’IVOIRE</div></div>
      <div style="position:absolute;left:490px;top:0;width:450px;height:420px;background:#F2E6C6;border:4px solid var(--ink)"><div class="mono" style="position:absolute;right:18px;top:14px;font-size:28px;font-weight:700">GHANA</div></div>
      <div style="position:absolute;left:466px;top:-10px;width:8px;height:440px;background:repeating-linear-gradient(180deg,var(--red) 0 18px,transparent 18px 30px)"></div>
      <div id="${arr}" style="position:absolute;left:170px;top:170px;width:600px;height:80px;transform-origin:300px 40px"><svg width="600" height="80"><line x1="560" y1="40" x2="60" y2="40" stroke="#A4241B" stroke-width="18"/><path d="M84 6 L20 40 L84 74" fill="none" stroke="#A4241B" stroke-width="18" stroke-linejoin="round"/></svg></div></div>
    ${p.chip('for decades: west', c('for decades'), { kind: 'chip light', x: X0, y: 1060 })}
    ${p.chip('this year: Ivorian cocoa, ~GH¢1,200 a bag', c('cheaper ivorian', 'ivorian'), { kind: 'chip red', x: X0, y: 1160 })}
    ${p.chip('…passed off as Ghanaian', c('passing it off'), { kind: 'chip gold', x: X0, y: 1260 })}
    ${st('smuggler-bike', flip + 0.6, { x: 610, y: 790, w: 230, rot: 4, life: 'jiggle', until: b + 0.3, sfx: `${SFX}/bike-bell.wav`, db: -10 })}`, { enter: 'wipeL' });
  [a, b] = win('small');
  p.scene(a, b, `${hl(p, 'E no be *small thing.*', a + 0.05, { size: 150, y: 560 })}`, { enter: 'push' });
  // THE RAW TAKE — 147 years
  [a, b] = win('raw');
  fx('raw-take.wav', a, -8);
  p.scene(a, b, `${kick(p, "EDITOR'S NOTE", a + 0.05)}${hl(p, 'Nobody pays for the *raw take.*', a + 0.1, { size: 110, y: 290 })}
    ${st1('sound-desk', a + 0.2, { x: 220, y: 720, w: 640, life: 'jiggle', until: b + 0.3 })}`, { enter: 'iris' });
  [a, b] = win('mix');
  fx('mastered.wav', a, -8); fx('crackle.wav', a, -24, 4);
  p.scene(a, b, `${counter(a + 0.2, 147, { size: 300, color: 'var(--red)', y: 260, label: 'YEARS OF SELLING THE RAW TAKE' })}
    ${p.chip('some of the finest cocoa on earth', c('the finest cocoa', 'finest cocoa'), { kind: 'chip gold', x: X0, y: 700 })}
    ${p.chip('…somebody else does the mixing', c('somebody else'), { kind: 'chip red', x: X0, y: 800 })}
    ${st('vinyl', c('somebody else'), { x: 120, y: 920, w: 420, rot: -4, life: 'spin', until: b + 0.3 })}
    ${st('chocolate-note', c('somebody else') + 0.3, { x: 640, y: 940, w: 300, rot: 8, life: 'bob', until: b + 0.3, sfx: `${SFX}/register.wav`, db: -12 })}`, { enter: 'wipeU' });
  // CHALE — back at the living Nest
  [a, b] = win('chale');
  p.scene(a, b, `${hl(p, 'Chale, we go *crosh.*', a + 0.05, { size: 130, y: 300 })}${nestWin(a, b + 0.4, { y: 620, h: 700, aims: [[[760, 700], 1.4, a + 0.1]] })}`, { enter: 'push' });
  endCard(p, at.endcard.T0 - 0.1, R.total, 'GOLD COAST PALAVA · EDITION 2');

  captions(p, R);
  enrichSfx(p);
  p.html.push('<div class="bottomdeco"></div>');
  return { p, R };
}
