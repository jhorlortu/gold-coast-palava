// Gold Coast Palava — segments, intro and cold open (v2: light, springs, B-roll).
import fs from 'node:fs';
import { Part, cuer } from './lib.mjs';
import { banner, BANNER_CSS } from './banner.mjs';

const plan = JSON.parse(fs.readFileSync('/home/user/gcp/work/timeline.json', 'utf8'));
const P = Object.fromEntries(plan.parts.map((p) => [p.id, p]));
const seg = (id, fromPart, toPartExclusive, label) => {
  const T0 = P[fromPart].T0, T1 = toPartExclusive ? P[toPartExclusive].T0 : plan.total;
  const pieces = plan.parts.filter((p) => p.kind === 'vo' && p.T0 >= T0 - 1e-6 && p.T0 < T1 - 1e-6).map((p) => ({ vo_in: p.vo_in, vo_out: p.vo_out, local0: +(p.T0 - T0).toFixed(3) }));
  return { id, T0, dur: +(T1 - T0).toFixed(3), label, pieces };
};
export const SEGMENTS = {
  intro: seg('intro', 'intro', 'cold-open', ''),
  coldopen: seg('coldopen', 'cold-open', 'paper', 'COLD OPEN · THE NEST, 2 A.M.'),
  paper: seg('paper', 'paper', 'sting-lead', 'WHAT THIS PAPER IS'),
  lead: seg('lead', 'lead', 'sting-wire', 'LEAD STORY · POLITICS DESK'),
  wire: seg('wire', 'wire', 'sting-walk-away', 'THE WIRE · SAME WEEK, ELSEWHERE'),
  walk: seg('walk', 'walk-away', 'sting-nest', 'WHAT YOU WALK AWAY WITH'),
  nest: seg('nest', 'nest', 'sting-editors-note', 'THE NEST · ONE DESK'),
  editor: seg('editor', 'editors-note', 'letters', "EDITOR'S NOTE"),
  letters: seg('letters', 'letters', 'sting-dispatch', 'LETTERS PAGE'),
  dispatch: seg('dispatch', 'dispatch', null, 'DISPATCH'),
};
export const B = (f) => `/home/user/gcp/project/media/broll/${f}`;
export const has = (f) => fs.existsSync(B(f));

// ---------------------------------------------------------------------------
// Intro: the symbol draws itself on the soundtrack's opening phrase, holds alone through the
// track's silence, and on the downbeat at 7.67 the whole banner assembles around it.
export function intro() {
  const s = SEGMENTS.intro;
  const p = new Part({ ...s }); p.mast = false; p.css.push(BANNER_CSS);
  const placesId = p.id_('pl');
  const places = p.typed('OPTIMUM DIGITAL PRESENTS', 3.6, { cps: 14 });
  // lockup centre is (468, 537); start big and centred: offset (+492, -110), scale 2.6
  const bn = banner(p, 'bn', { t0: 7.67, symbolFrom: { x: 494, y: -95, s: 3.85 }, drawSymbol: [0.35, 3.1], until: s.dur - 0.85 });
  p.tl.push(`tl.to("#${placesId}", {yPercent:-130, duration:${0.35}, ease:"power2.in", immediateRender:false}, 6.55);`);
  // breath in the silence: the symbol settles a touch smaller, the diamond pulses
  p.tl.push(`tl.to("#bn-sym", {scale:3.1, duration:0.9, ease:"sine.inOut", immediateRender:false}, 6.74);`);
  // push-through into the next scene
  p.tl.push(`tl.fromTo("#intro-cam", {scale:1}, {scale:1.06, duration:3.0, ease:"none"}, 8.4);`);
  p.tl.push(`tl.to("#intro-cam", {scale:3.2, duration:0.85, ease:"expo.in", immediateRender:false}, ${s.dur - 0.85});`);
  p.ev(s.dur - 0.85); p.ev(10.4);
  p.sound('whoosh-2.mp3', s.dur - 0.55, -10);
  p.html.push(`<div id="introsc" class="clip scene" data-start="0" data-duration="${s.dur}" data-track-index="1" style="z-index:2"><div class="bgp plain"></div>
    <div id="intro-cam" class="wrap" style="transform-origin:960px 540px">${bn}
      <div style="position:absolute;left:0;right:0;top:760px;text-align:center"><span class="mk"><span id="${placesId}" class="wd mono" style="font-size:38px;font-weight:700;letter-spacing:.22em;color:var(--red)">${places}</span></span></div>
    </div></div>`);
  return p;
}

// ---------------------------------------------------------------------------
export function coldopen() {
  const s = SEGMENTS.coldopen, c = cuer(s.pieces);
  const p = new Part({ ...s });
  // A. Night newsroom, moving footage (the illustration, animated)
  const aEnd = c('the desks around me') - 0.1;
  const time = p.typed('A LITTLE PAST 2 A.M.', 0.5, { cps: 18 });
  const addr = p.chip('THE NEST · 266 SANDPIPER LOOP · ONIPA ENCLAVE', c('266'), { kind: 'chip light' });
  const pre = p.words('pre', '…pretending to *sleep.*', c('pretending to sleep'), { stagger: 0.12 });
  const nestTag = p.chip('THE NEST', c('the nest is doing'), { kind: 'chip red' });
  const every = p.words(p.id_('ev'), 'what every newsroom does at this hour', c('every newsroom'), { stagger: 0.05 });
  p.broll(0, aEnd, B('nest-push.mp4'), { rate: 0.62, dim: 0.25, opts: { enter: 'cut' }, overlay: `
    <div style="position:absolute;left:96px;top:130px;font-size:34px;font-weight:700;color:#FFF8EA;letter-spacing:.16em;text-shadow:0 2px 10px rgba(0,0,0,.5)">${time}</div>
    <div style="position:absolute;left:96px;top:196px">${addr}</div>
    <div style="position:absolute;left:96px;top:300px">${nestTag}</div>
    <div class="hl" style="left:96px;top:390px;width:900px;color:#FFF8EA;text-shadow:0 4px 18px rgba(0,0,0,.5)"><h1 style="font-size:54px;font-weight:700">${every}</h1></div>
    <div class="hl" style="left:900px;top:560px;width:940px;text-align:right;color:#FFF8EA;text-shadow:0 4px 24px rgba(0,0,0,.45)"><h1 style="font-size:96px;font-style:italic;font-weight:700">${pre}</h1></div>` });
  p.sound('ambience-1.mp3', 0, -14, 12); p.sound('ambience-2.mp3', 11.8, -14, 12); p.sound('ambience-1.mp3', 23.6, -16, 4);
  // B. The desks: the camera travels to each object as it is named
  const bEnd = c('you will meet') - 0.1;
  const cv = p.id_('desk');
  const lab = (txt, x, y, at, dx = 40, dy = -70) => { const id = p.id_('lb'); p.grow(id, at, { preset: 'snappy', dy: 20, from: 0.6 }); return `<div id="${id}" style="position:absolute;left:${x - 9}px;top:${y - 9}px"><div style="width:18px;height:18px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 6px rgba(201,150,47,.35)"></div><div class="mono" style="position:absolute;left:${dx}px;top:${dy}px;white-space:nowrap;background:#FCF5E8;color:var(--ink);font-size:28px;font-weight:700;padding:6px 14px;border-left:6px solid var(--red)">${txt}</div></div>`; };
  const jac = c('jacket'), tea = c('cup of tea'), hp = c('headphones');
  // camera keys: wide → jacket → tea → headphones → wide
  const aim = (x, y, sc) => { const mx = (sc - 1) * 960 - 4, my = (sc - 1) * 540 - 4; return { scale: sc, x: Math.max(-mx, Math.min(mx, (960 - x) * sc)), y: Math.max(-my, Math.min(my, (540 - y) * sc)) }; };
  const dkh = p.id_('dkh');
  p.move(`#${dkh}`, { y: -520 }, Math.max(aEnd + 2.2, tea - 0.4), 'snappy');
  p.move(`#${cv}`, aim(430, 640, 1.6), jac - 0.2, 'heavy');
  p.move(`#${cv}`, aim(1575, 790, 1.6), tea - 0.2, 'heavy');
  p.move(`#${cv}`, aim(1340, 875, 1.6), hp - 0.2, 'heavy');
  p.move(`#${cv}`, { scale: 1.05, x: 0, y: 0 }, hp + 2.2, 'heavy');
  p.scene(aEnd, bEnd, `<div id="${cv}" class="wrap" style="transform-origin:960px 540px"><div class="cover" style="background-image:url(${p.asset('final/nest-light.png')})"></div>
      ${lab('a jacket on one chair', 430, 640, jac + 0.15)}${lab('a cup of tea, giving up its steam', 1575, 790, tea + 0.15, -470, -95)}${lab('headphones, still humming', 1340, 875, hp + 0.15, -450, 40)}</div>
    <div style="position:absolute;left:110px;top:200px">${p.chip('…the last of its _steam_', c('the last of its steam'), { kind: 'chip' })}</div>
    <div style="position:absolute;left:110px;top:300px">${p.chip('…still faintly *humming*', c('faintly humming'), { kind: 'chip light' })}</div>
    <div id="${dkh}" class="hl" style="left:110px;top:180px;width:900px;color:#FFF8EA;text-shadow:0 4px 20px rgba(0,0,0,.5)"><h1 style="font-size:76px">${p.words(p.id_('dk'), 'Dark desks. None of them empty.', aEnd + 0.3)}</h1></div>`, { bg: 'none', enter: 'wipeL', drift: 0 });
  // C. The people (moving footage again)
  const cEnd = c('first since this') - 0.1;
  p.broll(bEnd, cEnd, B('nest-windows.mp4'), { rate: 0.75, dim: 0.3, overlay: `
    <div class="hl" style="left:120px;top:260px;width:1300px;color:#FFF8EA;text-shadow:0 4px 24px rgba(0,0,0,.5)"><h1 style="font-size:92px">${p.words(p.id_('pp'), 'You will meet some of the people who sit here.', bEnd + 0.25, { stagger: 0.07 })}</h1>
    <div class="sub" style="color:#F2D9A0"><span class="mk"><span id="notall" class="wd">…though not all of them tonight.</span></span></div></div>`, opts: { enter: 'push' } });
  p.tl.push(`tl.fromTo("#notall", {yPercent:120}, {yPercent:0, duration:0.6, ease:"sp-default"}, ${c('though not all')});`); p.ev(c('though not all'));
  // D. The price box — centred; the box arrives with the words "35 megabytes", the stamp lands beneath it
  const m35 = c('35 megabytes');
  const priceLbl = p.kicker('THE PRICE OF THIS EDITION', cEnd + 0.15);
  const priceBox = p.id_('pb');
  p.grow(priceBox, m35 - 0.25, { rot: -1.5, preset: 'heavy', from: 0.7, dy: 40 });
  p.sound('whoosh-1.mp3', m35 - 0.35, -16);
  const price = p.words('price', '≈ 35 MB', m35 + 0.05, { stagger: 0.1 });
  const foot = p.chip('cheaper than most arguments about *football*', c('cheaper than most'), { kind: 'chip light' });
  const ball = p.id_('ball');
  p.tl.push(`tl.fromTo("#${ball}", {opacity:0}, {opacity:1, duration:0.1, ease:"none"}, ${c('about football')});`);
  p.tl.push(`tl.fromTo("#${ball}", {x:-300, rotation:-360}, {x:0, rotation:0, duration:0.9, ease:"sp-default"}, ${c('about football')});`); p.ev(c('about football'));
  p.sound('crate-1.mp3', c('about football') + 0.7, -22, 0.4);
  const stamp = p.stamp('A GOOD DEAL MORE USEFUL', c('a good deal more useful'), { x: 0, y: 0, rot: -3, size: 46 }).replace('left:0px;top:0px;', 'position:relative;left:auto;top:auto;');
  p.scene(cEnd, s.dur, `
    <div style="position:absolute;left:0;right:0;top:170px;display:flex;justify-content:center">${priceLbl}</div>
    <div style="position:absolute;left:0;right:0;top:250px;display:flex;justify-content:center">
      <div id="${priceBox}" style="border:8px solid var(--ink);padding:20px 60px 34px;background:#FCF5E8;box-shadow:16px 18px 0 var(--ink)">
        <div class="mono" style="font-size:28px;font-weight:700;letter-spacing:.3em;color:var(--red)">PRICE</div>
        <div style="font-family:'Playfair Display',serif;font-weight:900;font-size:230px;line-height:1;white-space:nowrap">${price}</div></div></div>
    <div style="position:absolute;left:0;right:0;top:665px;display:flex;justify-content:center;align-items:center;gap:26px">${foot}
      <div id="${ball}" style="position:relative;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle at 35% 35%, #fff 0 30%, #ddd 31% 100%);border:4px solid var(--ink);box-shadow:inset -8px -8px 0 rgba(0,0,0,.12)"><div style="position:absolute;left:24px;top:24px;width:24px;height:24px;background:var(--ink);transform:rotate(45deg)"></div></div></div>
    <div style="position:absolute;left:0;right:0;top:810px;display:flex;justify-content:center">${stamp}</div>`, { enter: 'wipeU' });
  return p;
}

export const BUILDERS = { intro, coldopen };
