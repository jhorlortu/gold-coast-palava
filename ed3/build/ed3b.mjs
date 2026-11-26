// Edition 3 — the main business: Lead Story ("Lines in pencil"), The Wire (9 May 1956), The Palava Desk (Bawku:
// two histories, no verdict), Then v Now, Team Aside (Amo), Editor's Note (pencil and ink), Letters, Dispatch (+ COMBO2).
import fs from 'node:fs';
import { SP } from '/home/user/gcp/build/lib.mjs';
import { banner, BANNER_CSS } from '/home/user/gcp/build/banner.mjs';
import { livingNest } from '/home/user/gcp/ed2/build/nestlive.mjs';
import * as M from './maps.mjs';
import { art, stringMap, WEST_AFRICA, fingertip, stack, head, away, nameCard, counter, card, mono, H, nestBed, pin, st, st1, fx, cs, make, STK, STK1, SFX, SFX1, PILOT, r3 } from './ed3.mjs';
const REAL = '/home/user/gcp/ed3/media/real', DRAWN3 = '/home/user/gcp/ed3/media/drawn';
const img = (k) => [`${DRAWN3}/${k}.jpg`, `${REAL}/${k}.jpg`].find((f) => fs.existsSync(f));
const band = (p, html, { z = 800 } = {}) => p.html.push(`<div class="clip" data-start="0" data-duration="${r3(p.dur)}" data-track-index="8" style="position:absolute;inset:0;z-index:${z};pointer-events:none">${html}</div>`);
const GH = [-3.6, 4.5, 1.6, 11.3];                     // Ghana box
const NORTH = [-2.2, 8.0, 1.0, 11.3];                  // northern Ghana / Dagbon box
// the boldface-a-fact card on the right of a scene
const factCard = (p, lbl, big, at, { x = 1150, y = 200, w = 620, size = 120, sub = '' } = {}) => card(p, `${mono(lbl, { size: 24 })}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:${size}px;line-height:1;margin-top:10px">${big}</div>${sub ? `<div class="mono" style="font-size:22px;font-weight:700;margin-top:10px">${sub}</div>` : ''}`, at, { x, y, w });

// ---------------------------------------------------------------------------
// LEAD STORY — "Lines in pencil". A timeline builds along the bottom; maps draw their lines as string.
export function lead() {
  const [p, c, s] = make('lead');
  const b = (...q) => cs(c, ...q);
  const cut = [0, b('germany had already'), b('inland, britain'), b('and on the third'), b('then, on the fourteenth'), b('britain and germany also split'), b('on the twenty-sixth'), b('the pencil moved'), b('britain and france then'), s.dur].map((t, i) => i ? t - 0.1 : 0);
  const sc = (i, html, o = {}) => p.scene(cut[i], cut[i + 1], html, o);
  // the timeline band
  const DATES = [['1884–85', b('from november 1884'), 'Berlin'], ['Jul 1884', b('that july'), 'Togoland'], ['Dec 1896', b('third and fourth'), 'Adibo dali'], ['1899', b('fourteenth of november'), 'Yendi → Germany'],
    ['1901 · 1902', b('twenty-sixth of september'), 'Northern Territories'], ['7 Aug 1914', b('seventh of august'), 'the first shot'], ['1914–19', b('britain and france then'), 'Togoland cut in two']];
  const X0 = 150, X1 = 1770, xs = DATES.map((_, i) => X0 + i * (X1 - X0) / (DATES.length - 1));
  const line = p.id_('tln');
  p.tl.push(`tl.fromTo("#${line}", {scaleX:0}, {scaleX:1, duration:1.2, ease:"sp-default"}, ${r3(DATES[0][1] - 0.3)});`);
  const marks = DATES.map(([y, at, lbl], i) => { const id = p.id_('tm');
    p.tl.push(`tl.fromTo("#${id}", {opacity:0, y:30, scale:.6}, {opacity:1, y:0, scale:1, duration:${SP.snappy}, ease:"sp-snappy"}, ${r3(at)});`); p.ev(at); fx(p, 'blip.wav', at, -18); fx(p, 'pin.wav', at + 0.05, -20);
    return `<div id="${id}" style="position:absolute;left:${xs[i] - 110}px;top:858px;width:220px;text-align:center;opacity:0"><div style="width:22px;height:22px;margin:0 auto;border-radius:50%;background:var(--red);border:4px solid #FCF5E8;box-shadow:0 0 0 3px var(--ink)"></div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:28px;line-height:1;margin-top:4px">${y}</div><div class="mono" style="font-size:14px;font-weight:700;letter-spacing:.06em;color:var(--red)">${lbl}</div></div>`; }).join('');
  band(p, `<div style="position:absolute;left:0;right:0;top:846px;height:110px;background:linear-gradient(180deg, rgba(243,235,215,0), rgba(243,235,215,.94) 30%)"></div><div id="${line}" style="position:absolute;left:${X0}px;top:868px;width:${X1 - X0}px;height:5px;background:var(--ink);transform-origin:0 50%"></div>${marks}`);
  // 0 — Berlin: Europe divides Africa, not one African in the room
  sc(0, `${head(p, 'BERLIN · NOV 1884 – FEB 1885', 0.1, 'Dividing Africa — with *not one African* in the room.', 0.3, { size: 70, w: 900 })}
    ${p.print(img('berlin-1884'), 0.6, { x: 1090, y: 140, w: 700, rot: 2, caption: 'The Berlin Conference, 1884 (engraving)' })}
    ${p.stamp('AFRICANS PRESENT: 0', b('not one african'), { x: 160, y: 560, rot: -4, size: 52 })}
    ${stack(p, [['the powers of Europe', b('the powers of europe'), 'chip light'], ['the rules for dividing Africa', b('the rules for dividing'), 'chip red']], { y: 400 })}`, { enter: 'cut' });
  // 1 — July 1884: Togoland
  const T1 = stringMap(p, { x: 1000, y: 120, w: 820, h: 700, bbox: [-3.6, 4.5, 2.6, 11.3], fills: [{ country: 'Ghana', fill: '#F3E9CF' }, { country: 'Togo', fill: '#E3D3AE', at: b('called it togoland') - 0.2 }],
    strings: [{ country: 'Ghana', color: 'red' }, { country: 'Togo', color: 'black', at: b('raised its flag'), dur: 1.8 }], pins: [{ place: 'Lome', label: 'TOGOLAND', at: b('called it togoland'), fs: 22, dx: -40, dy: 30 }] });
  sc(1, `${head(p, 'JULY 1884', cut[1] + 0.1, 'Germany raises its flag *east of the Volta.*', cut[1] + 0.2, { size: 76, w: 820 })}${T1.html}
    ${stack(p, [['…and calls it Togoland', b('called it togoland'), 'chip gold']], { y: 480 })}`);
  // 2 — the neutral zone around Salaga and Yendi
  const NZ = stringMap(p, { strings: [{ country: 'Ghana', color: 'red' }, { country: 'Togo', color: 'black' }], x: 980, y: 110, w: 840, h: 720, bbox: NORTH, fills: [{ country: 'Ghana', fill: '#F3E9CF' }, { country: 'Togo', fill: '#E6D9B8' }, { d: (P) => M.polyPath(P, M.NEUTRAL_ZONE), fill: 'rgba(200,150,47,.35)', at: b('neutral zone') - 0.1 }],
    lines: [{ d: (P) => M.polyPath(P, M.NEUTRAL_ZONE), color: '#8A6420', at: b('neutral zone'), dur: 1.4, w: 5 }], pins: [{ place: 'Salaga', label: 'SALAGA', at: b('around salaga'), dx: -150, dy: -18 }, { place: 'Yendi', label: 'YENDI', at: b('and yendi'), dx: 18, dy: -50 }] });
  sc(2, `${head(p, 'INLAND · THE TRADING COUNTRY', cut[2] + 0.1, 'Both wanted it. So: a *neutral zone.*', cut[2] + 0.2, { size: 76, w: 820 })}${NZ.html}
    ${stack(p, [['Britain and Germany both wanted Salaga and Yendi', b('both wanted'), 'chip light'], ['…until the Germans marched on Yendi', b('marched on yendi'), 'chip red']], { y: 480 })}`);
  fx(p, SFX1 + '/murmur.wav', b('marched on yendi') - 0.2, -24, 3);
  // 3 — Adibo dali, 3–4 December 1896; Yendi burned
  const yf = p.id_('yf');
  p.tl.push(`tl.fromTo("#${yf}", {opacity:0, scale:.5}, {opacity:1, scale:1, duration:1.2, ease:"power2.out"}, ${r3(b('burned yendi'))});`);
  p.tl.push(`tl.to("#${yf}", {scale:1.12, opacity:.75, duration:0.35, ease:"sine.inOut", repeat:8, yoyo:true, immediateRender:false}, ${r3(b('burned yendi') + 1.2)});`); p.ev(b('burned yendi'));
  const AD = stringMap(p, { strings: [{ country: 'Ghana', color: 'red' }, { country: 'Togo', color: 'black' }], x: 980, y: 110, w: 840, h: 720, bbox: NORTH, fills: [{ country: 'Ghana', fill: '#F3E9CF' }, { country: 'Togo', fill: '#E6D9B8' }, { d: (P) => M.polyPath(P, M.NEUTRAL_ZONE), fill: 'rgba(200,150,47,.25)' }],
    pins: [{ place: 'Yendi', label: 'YENDI', dx: 18, dy: -50 }], extra: (P) => { const [x, y] = P(M.PLACE.Yendi); return `<circle id="${yf}" cx="${x}" cy="${y}" r="70" fill="url(#fireg)" opacity="0" style="transform-origin:${x}px ${y}px"/><defs><radialGradient id="fireg"><stop offset="0" stop-color="#FFD36A"/><stop offset=".45" stop-color="#E8622C" stop-opacity=".85"/><stop offset="1" stop-color="#A4241B" stop-opacity="0"/></radialGradient></defs>`; } });
  sc(3, `${head(p, '3 – 4 DECEMBER 1896', cut[3] + 0.1, '*Adibo dali* — the day of Adibo.', b('still calls') - 0.2, { size: 84, w: 820 })}${AD.html}
    ${stack(p, [['the Dagbamba fight the Germans at Adibo', b('fought them'), 'chip light'], ['Yendi burned to the ground', b('burned yendi'), 'chip red']], { y: 480 })}`, { enter: 'iris' });
  fx(p, 'fire-far.wav', b('burned yendi'), -10);
  // 4 — Samoa, 1899: a line from the Pacific to northern Ghana
  const W = { x: 120, y: 330, w: 1680, h: 500 };
  const SAM = stringMap(p, { ...W, bbox: [-180, -40, 30, 40], card: true, fills: [{ country: 'Ghana', fill: '#C8962F' }, { country: 'Samoa', fill: '#A4241B' }],
    extra: (P) => { const land = ['Brazil', 'Australia', 'Indonesia', 'Papua New Guinea', 'Peru', 'Colombia', 'Venezuela', 'Bolivia', 'Ecuador', 'Mexico', 'Nigeria', 'Ghana', "Côte d'Ivoire", 'Liberia', 'Cameroon', 'Niger', 'Mali', 'Chad', 'Gabon', 'New Zealand', 'Philippines', 'Chile', 'Argentina', 'Guyana', 'Suriname', 'Venezuela', 'Panama', 'Costa Rica', 'Nicaragua', 'Honduras', 'Guatemala', 'Cuba', 'Malaysia', 'Thailand', 'Vietnam', 'India', 'Sri Lanka', 'Saudi Arabia', 'Sudan', 'Ethiopia', 'Kenya', 'Tanzania', 'Angola', 'Congo', 'Dem. Rep. Congo', 'Central African Rep.', 'Senegal', 'Guinea', 'Algeria', 'Libya', 'Egypt', 'Mauritania', 'Morocco', 'Togo', 'Benin', 'Burkina Faso', 'Sierra Leone'];
      return land.map((n) => { try { return `<path d="${M.countryPath(P, n, 110)}" fill="#DCCFAE" stroke="#BFAF8A" stroke-width="1"/>`; } catch { return ''; } }).join(''); },
    lines: [{ d: (P) => { const [ax, ay] = P([-172.1, -13.8]), [bx_, by_] = P([-0.1, 9.4]); return `M${ax} ${ay} C ${ax + 300} ${ay - 170}, ${bx_ - 400} ${by_ - 150}, ${bx_} ${by_}`; }, color: 'red', at: b('islands of samoa') + 0.2, dur: 2.2, w: 6 }],
    pins: [{ ll: [-172.1, -13.8], label: 'SAMOA', at: b('islands of samoa'), dx: 16, dy: 10 }, { ll: [-0.1, 9.4], label: 'YENDI', at: b('islands of samoa') + 2.3, dx: -110, dy: -50 }] });
  sc(4, `${head(p, '14 NOVEMBER 1899', cut[4] + 0.1, 'A deal so strange it belongs on *page one.*', cut[4] + 0.2, { size: 70, w: 1400 })}${SAM.html}
    ${art(p, 'islands', b('islands of samoa') - 0.1, { x: 1500, y: 120, w: 260, rot: 4, life: 'bob', until: cut[5], sfx: SFX + '/waves.wav', db: -14 })}
    ${p.chip('a treaty mostly about Samoa', b('mostly about'), { kind: 'chip gold', x: 150, y: 270 })}`);
  // 5 — the split: Yendi to Germany, Salaga and western Dagbon British
  const SPL = stringMap(p, { strings: [{ country: 'Ghana', color: 'red' }, { country: 'Togo', color: 'black' }], x: 980, y: 110, w: 840, h: 720, bbox: NORTH, fills: [{ country: 'Ghana', fill: '#F3E9CF' }, { country: 'Togo', fill: '#E6D9B8' }, { d: (P) => M.polyPath(P, M.NEUTRAL_ZONE), fill: 'rgba(200,150,47,.22)' },
      { d: (P) => M.polyPath(P, [[-0.22, 8.15], [0.32, 8.15], [0.38, 9.05], [0.3, 10.1], [-0.28, 10.1], [-0.3, 9.75], [-0.18, 9.3], [-0.25, 8.8]]), fill: 'rgba(26,22,18,.22)', at: b('went to germany') }],
    lines: [{ d: (P) => M.linePath(P, M.LINE_1899), color: 'black', at: b('split the neutral'), dur: 1.4, w: 7 }],
    pins: [{ place: 'Yendi', label: 'YENDI → GERMANY', at: b('went to germany'), dx: 18, dy: -50 }, { place: 'Salaga', label: 'SALAGA → BRITAIN', at: b('stayed british') - 0.6, dx: -250, dy: 12 }] });
  sc(5, `${head(p, 'THE NEUTRAL ZONE, SPLIT', cut[5] + 0.1, 'Yendi, seat of the Yaa Naa, goes to *Germany.*', b('so yendi') - 0.1, { size: 74, w: 820 })}${SPL.html}
    ${stack(p, [['the western part of Dagbon stays British', b('the western part'), 'chip red'], ['a kingdom with its capital across the line', b('stayed british') + 0.4, 'chip gold']], { y: 520 })}`);
  // 6 — 26 September 1901: Asante a colony; the Northern Territories a protectorate from 1 Jan 1902
  const NT = stringMap(p, { x: 1060, y: 110, w: 720, h: 720, bbox: GH, fills: [{ country: 'Ghana', fill: '#F3E9CF' }, { d: (P) => M.polyPath(P, [[-3.5, 8.0], [1.5, 8.0], [1.5, 11.4], [-3.5, 11.4]]), fill: 'rgba(164,36,27,.28)', clip: 'GH', at: b('northern territories') }],
    strings: [{ country: 'Ghana', color: 'red' }], lines: [{ d: (P) => M.linePath(P, [[-3.0, 8.0], [-2.2, 8.1], [-1.2, 8.05], [-0.2, 8.1], [0.4, 8.0]]), color: 'red', at: b('northern territories'), dur: 1.2, w: 5 }] });
  sc(6, `${head(p, '26 SEPTEMBER 1901 · ORDERS IN COUNCIL', cut[6] + 0.1, 'One day, two *signatures.*', cut[6] + 0.3, { size: 92, w: 900 })}${NT.html}
    ${stack(p, [['Asante: a colony (the ending of Edition 1)', b('made asante a colony'), 'chip light'], ['the Northern Territories: a protectorate', b('created the northern'), 'chip red'], ['in force from 1 January 1902', b('first of january'), 'chip gold']], { y: 420 })}
    ${p.stamp('SEE EDITION 1', b('ending of our first'), { x: 160, y: 720, rot: -4, size: 40 })}
    ${art(p, 'report', cut[6] + 0.4, { x: 820, y: 180, w: 220, rot: 6, life: 'bob', until: cut[7], sfx: SFX1 + '/paper-slap.wav' })}`);
  // 7 — 7 August 1914: the first shot
  const shot = b('returned fire');
  const sh = p.id_('sh'); p.tl.push(`tl.fromTo("#${sh}", {opacity:.9}, {opacity:0, duration:0.35, ease:"power2.out"}, ${r3(shot + 0.25)});`); p.ev(shot + 0.25);
  const SH = stringMap(p, { x: 1060, y: 140, w: 720, h: 680, bbox: [-3.4, 5.0, 2.6, 11.3], ...WEST_AFRICA(null), pins: [{ place: 'Nuatja', label: 'NUATJA', at: b('near nuatja'), dx: -150, dy: -50 }] });
  sc(7, `${head(p, 'THE PENCIL MOVED AGAIN · 1914', cut[7] + 0.1, 'The first shot of the *First World War.*', cut[7] + 0.25, { size: 74, w: 900 })}${SH.html}
    ${nameCard(p, b('a soldier named'), { y: 420, role: 'GOLD COAST REGIMENT', name: 'Alhaji Grunshi', note: 'no authentic portrait on record' })}
    ${p.stamp('7 AUGUST 1914', b('seventh of august'), { x: 160, y: 640, rot: -5, size: 56 })}
    ${p.chip('by a soldier in British service', b('in british service'), { kind: 'chip red', x: 160, y: 750 })}
    ${p.chip('the Gold Coast Regiment marches into Togoland', b('marched into togoland'), { kind: 'chip light', x: 160, y: 330 })}
    <div id="${sh}" style="position:absolute;inset:0;background:#FFF6DA;opacity:0;pointer-events:none"></div>`);
  fx(p, 'rifle.wav', shot + 0.25, -4);
  // 8 — Togoland cut in two; the Ewe sliced in half
  const TG = stringMap(p, { x: 1000, y: 110, w: 800, h: 730, bbox: [-1.6, 5.6, 2.4, 11.3], fills: [{ country: 'Ghana', fill: '#F3E9CF' }, { country: 'Togo', fill: '#E6D9B8' },
      { d: (P) => M.polyPath(P, [[-1.6, 5.5], [2.4, 5.5], [2.4, 7.9], [-1.6, 7.9]]), fill: 'rgba(46,107,58,.30)', at: b('sliced the ewe') }],
    strings: [{ country: 'Togo', color: 'black' }, { country: 'Ghana', color: 'red', at: b('cut togoland in two'), dur: 2.0, w: 8 }], pins: [{ place: 'Yendi', label: 'YENDI · BRITISH', at: b('put yendi back'), dx: -230, dy: -50 }] });
  sc(8, `${head(p, 'BRITAIN AND FRANCE', cut[8] + 0.1, 'Togoland, *cut in two.*', cut[8] + 0.2, { size: 92, w: 860 })}${TG.html}
    ${stack(p, [['Yendi back with Dagbon', b('put yendi back'), 'chip light'], ['…but the Ewe sliced in half', b('sliced the ewe'), 'chip red']], { y: 440 })}
    <div class="mono" style="position:absolute;left:1020px;top:770px;font-size:20px;font-weight:700;color:#2E6B3A;background:rgba(252,245,232,.9);padding:4px 10px">EWE LANDS, BOTH SIDES OF THE LINE</div>`);
  return p;
}

// ---------------------------------------------------------------------------
// THE WIRE — Wednesday, 9 May 1956, British Togoland. Special Elite dateline, grey rain-season light, a ticker.
export function wire() {
  const [p, c, s] = make('wire');
  const b = (...q) => cs(c, ...q);
  const cut = [0, b('some one hundred'), b('the choice on the ballot'), b('when the count'), b('the map tells it'), b('on the thirteenth'), s.dur].map((t, i) => i ? t - 0.1 : 0);
  const sc = (i, html, o = {}) => p.scene(cut[i], cut[i + 1], html, o);
  const tk = p.id_('tk');
  const rain = Array.from({ length: 70 }, (_, i) => { const id = p.id_('rn'), x = (i * 271) % 1920, y = (i * 137) % 900, d = 0.7 + (i % 5) * 0.12;
    p.tl.push(`tl.fromTo("#${id}", {y:-200}, {y:1200, duration:${r3(d)}, ease:"none", repeat:${Math.ceil(s.dur / d)}}, ${r3((i % 7) * 0.1)});`);
    return `<i id="${id}" style="position:absolute;left:${x}px;top:${y - 900}px;width:2px;height:${40 + (i % 4) * 14}px;background:rgba(90,100,110,.28);transform:rotate(8deg)"></i>`; }).join('');
  const TICK = 'BRITISH TOGOLAND · PLEBISCITE DAY · UNITE WITH THE GOLD COAST — OR REMAIN A UN TRUST TERRITORY? · 194,230 ON THE ROLL · ';
  p.tl.push(`tl.fromTo("#${tk}", {x:0}, {x:-2400, duration:${r3(s.dur)}, ease:"none"}, 0);`);
  band(p, `<div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(110,120,130,.20), rgba(120,125,130,.08));mix-blend-mode:multiply"></div>${rain}
    <div style="position:absolute;left:0;right:0;top:902px;height:52px;background:var(--ink);overflow:hidden"><div id="${tk}" class="elite" style="white-space:nowrap;color:#F3EBD7;font-size:28px;line-height:52px;padding-left:40px">${TICK.repeat(4)}</div></div>`);
  for (let t = 0; t < s.dur - 1; t += 7.6) fx(p, 'rain.wav', t, -26, Math.min(8, s.dur - t));
  // 0 — dateline; the roads; the commissioner
  sc(0, `<div style="position:absolute;left:150px;top:120px;background:#FCF5E8;border:4px solid var(--ink);box-shadow:10px 12px 0 var(--ink);padding:24px 34px;width:1100px">
      <div class="elite" style="font-size:50px;line-height:1.15">${p.typed('WEDNESDAY, 9 MAY 1956', 0.2, { cps: 18, cls: 'elite' })}<br>${p.typed('BRITISH TOGOLAND — THE RAINS', 1.6, { cps: 18, cls: 'elite', sfx: false })}</div></div>
    ${stack(p, [['the farm roads around Ho and Kpandu: red mud', b('red mud', 'farm roads'), 'chip red'], ['the people queue to decide their future', b('queued to decide'), 'chip light']], { y: 420 })}
    ${nameCard(p, b('a united nations commissioner'), { y: 640, role: 'UN PLEBISCITE COMMISSIONER · MEXICO', name: 'Eduardo Espinosa y Prieto' })}
    ${art(p, 'ballot', b('queued to decide'), { x: 1360, y: 260, w: 400, rot: 3, life: 'bob', until: cut[1], sfx: SFX + '/ballot.wav', db: -10 })}`, { enter: 'cut' });
  fx(p, 'queue.wav', b('queued to decide') - 0.2, -22, 4); fx(p, SFX + '/key.wav', 0.2, -20); fx(p, SFX + '/carriage-bell.wav', 1.5, -20);
  // 1 — the roll and the turnout
  sc(1, `${head(p, 'ON THE ROLL', cut[1] + 0.1, 'Nearly 200,000 names. Most *came.*', cut[1] + 0.2, { size: 84 })}
    <div style="position:absolute;left:150px;top:430px">${counter(p, cut[1] + 0.4, 194230, { size: 160, dur: 1.6 })}<div class="mono" style="font-size:28px;font-weight:700">REGISTERED</div></div>
    <div style="position:absolute;left:1000px;top:430px">${counter(p, b('eighty-three percent'), 83, { size: 160, color: 'var(--red)', suffix: '%' })}<div class="mono" style="font-size:28px;font-weight:700;color:var(--red)">TURNOUT (ABOUT)</div></div>`);
  // 2 — the ballot: unite or remain
  const opt = (lbl, txt, at, x, col) => card(p, `${mono(lbl, { size: 26, color: col })}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:54px;line-height:1.05;margin-top:10px">${txt}</div>`, at, { x, y: 400, w: 760 });
  sc(2, `${head(p, 'THE CHOICE ON THE BALLOT', cut[2] + 0.1, 'Blunt.', cut[2] + 0.2, { size: 96 })}
    ${opt('OPTION 1', 'Unite with the Gold Coast', b('unite with the gold coast'), 150, 'var(--red)')}${opt('OPTION 2', 'Remain a UN trust territory', b('or remain'), 1010, '#2350A0')}
    ${p.chip('Nkrumah’s CPP: union', b("nkrumah's convention", 'convention people'), { kind: 'chip red', x: 150, y: 700 })}
    ${p.chip('Togoland Congress: against — reunion with the Ewe across the French line', b('the togoland congress'), { kind: 'chip light', x: 150, y: 790 })}`);
  // 3 — the result
  const bar = (lbl, n, pct, col, at, y) => { const id = p.id_('br'); p.tl.push(`tl.fromTo("#${id}", {scaleX:0}, {scaleX:1, duration:${SP.heavy}, ease:"sp-heavy"}, ${r3(at)});`); p.ev(at); fx(p, 'thump.wav', at + 0.3, -12);
    return `<div style="position:absolute;left:150px;top:${y}px;width:1620px"><div class="mono" style="font-size:28px;font-weight:700">${lbl}</div><div style="display:flex;align-items:center;gap:24px;margin-top:8px"><div id="${id}" style="width:${pct * 14}px;height:110px;background:${col};border:4px solid var(--ink);transform-origin:0 50%"></div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:80px">${pct}%</div><div class="mono" style="font-size:30px;font-weight:700">${n}</div></div></div>`; };
  sc(3, `${head(p, 'WHEN THE COUNT WAS DONE', cut[3] + 0.1, 'Union, by *58 to 42.*', cut[3] + 0.2, { size: 92 })}
    ${bar('UNION WITH THE GOLD COAST', '93,095', 58, '#C8962F', b('ninety-three thousand'), 400)}${bar('SEPARATION', '67,492', 42, '#6B6253', b('sixty-seven thousand'), 620)}`);
  // 4 — the district map: north for union, Ho and Kpandu against
  const DD = stringMap(p, { x: 1020, y: 100, w: 760, h: 750, bbox: [-1.4, 5.6, 1.4, 11.3], fills: [{ country: 'Ghana', fill: '#F3E9CF' }, { country: 'Togo', fill: '#E6D9B8' },
      ...M.DISTRICTS.map((d) => ({ d: (P) => M.band(P, d.lat), fill: d.union ? '#C8962F' : '#6B6253', op: 0.75, clip: 'BT', at: d.union ? b(d.name === 'Mamprusi' ? 'districts of mamprusi' : d.name === 'Dagomba' ? 'dagomba' : d.name === 'Gonja' ? 'gonja' : 'buem-krachi') : b(d.name === 'Ho' ? 'ho and kpandu' : 'and kpandu, voted', 'and kpandu') }))],
    strings: [{ country: 'Ghana', color: 'red' }, { country: 'Togo', color: 'black' }] });
  const ddHtml = DD.html;
  sc(4, `${head(p, 'THE MAP TELLS IT BETTER', cut[4] + 0.1, 'The north said *yes.* The south said *no.*', cut[4] + 0.2, { size: 76, w: 840 })}${ddHtml}
    ${stack(p, [['Mamprusi · Dagomba · Gonja · Buem-Krachi: union', b('voted heavily'), 'chip gold'], ['Ho · Kpandu (southern Ewe): against', b('voted clearly against'), 'chip light']], { y: 470 })}`);
  // 5 — UN approves; 6 March 1957
  const BT = stringMap(p, { x: 1060, y: 100, w: 720, h: 750, bbox: GH, fills: [{ country: 'Ghana', fill: '#F3E9CF' }, { country: 'Ghana', fill: '#C8962F', op: 0.55, clip: 'BT', at: b('british togoland was born') }], strings: [{ country: 'Ghana', color: 'red' }] });
  sc(5, `${head(p, '13 DEC 1956 → 6 MARCH 1957', cut[5] + 0.1, 'British Togoland, born *with Ghana.*', b('british togoland was born') - 0.2, { size: 80, w: 880 })}${BT.html}
    ${stack(p, [['the UN General Assembly approves the union', b('general assembly'), 'chip light'], ['the long eastern strip: the Volta up through Oti and Dagbon', b('the long eastern strip'), 'chip gold']], { y: 470 })}`);
  fx(p, SFX1 + '/bell.wav', b('british togoland was born'), -14);
  return p;
}

// ---------------------------------------------------------------------------
// THE PALAVA DESK — "Who holds the pen?" Bawku: two histories, equal size, neutral colours; no verdict.
export function palava() {
  const [p, c, s] = make('palava');
  const b = (...q) => cs(c, ...q);
  const cut = [0, b('the mamprusi say'), b('since independence'), b('in february 2023'), b('asked to mediate'), b('the government accepted'), b('chale, this desk'), s.dur].map((t, i) => i ? t - 0.1 : 0);
  const sc = (i, html, o = {}) => p.scene(cut[i], cut[i + 1], html, o);
  // 0 — Bawku, by the borders with Burkina Faso and Togo
  const BW = stringMap(p, { x: 1000, y: 100, w: 800, h: 740, bbox: [-1.6, 9.9, 0.9, 11.6], ...WEST_AFRICA(null), pins: [{ place: 'Bawku', label: 'BAWKU', at: 0.6, fs: 28, dx: 20, dy: 18 }, { place: 'Nalerigu', label: 'NALERIGU', at: null, dx: -170, dy: 14 }] });
  sc(0, `${head(p, 'NORTH TO BAWKU', 0.1, 'Not which country — *which chief.*', b('not which country') - 0.1, { size: 84, w: 860 })}${BW.html}
    ${stack(p, [['near the borders with Burkina Faso and Togo', b('near the borders'), 'chip light'], ['two histories — this desk will not pretend there is one', b('two histories'), 'chip gold']], { y: 470 })}
    ${p.stamp('TWO HISTORIES', b('only one'), { x: 160, y: 700, rot: -4, size: 56 })}`, { enter: 'cut' });
  // 1 — the split card: equal size, neutral colours
  const acct = (title, items, x) => `<div style="position:absolute;left:${x}px;top:180px;width:780px;height:650px;background:#F1ECE2;border:4px solid #4A4640;box-shadow:10px 12px 0 #4A4640;padding:30px 34px">
      <div class="mono" style="font-size:28px;font-weight:700;letter-spacing:.2em;color:#4A4640">${title}</div>
      ${items.map(([t, at]) => { const id = p.id_('ai'); p.tl.push(`tl.fromTo("#${id}", {opacity:0, y:20}, {opacity:1, y:0, duration:${SP.snappy}, ease:"sp-snappy"}, ${r3(at)});`); p.ev(at); fx(p, SFX1 + '/pop-1.wav', at, -20);
        return `<div id="${id}" style="opacity:0;font-family:'Playfair Display',serif;font-weight:900;font-size:38px;line-height:1.15;margin-top:22px;padding-left:28px;position:relative"><b style="position:absolute;left:0;color:#7A746A">·</b>${t}</div>`; }).join('')}</div>`;
  sc(1, `${acct('MAMPRUSI ACCOUNT', [['Their people founded the Bawku skin, early 1700s', b('founded the bawku')], ['For two centuries, chiefs sent by the Naayiri at Nalerigu', b('for two centuries')]], 150)}
    ${acct('KUSASI ACCOUNT', [['The people of the land: first settlers, custodians', b('people of the land')], ['Mamprusi chiefs placed over them by the colonial administration — dated 1932', b('which they date')], ['British indirect rule wanted kings; the Kusasi had governed without one', b('british indirect rule')]], 990)}`, { enter: 'wipeU' });
  // 2 — who holds the pen: four dates, a name struck and rewritten each time
  const LED = [['1958', 'Court of Appeal', 'KUSASI', b('in 1958')], ['1966', 'NLCD 112 (after the coup)', 'MAMPRUSI', b('after the 1966')], ['1983', 'PNDC Law 75', 'KUSASI', b('in 1983')], ['2003', 'Supreme Court suit withdrawn', 'BOTH CLAIM VICTORY', b('in 2003')]];
  const rows = LED.map(([y, by, who, at], i) => { const id = p.id_('lr'), sk = p.id_('sk'), nw = p.id_('nw');
    p.tl.push(`tl.fromTo("#${id}", {opacity:0, x:-40}, {opacity:1, x:0, duration:${SP.snappy}, ease:"sp-snappy"}, ${r3(at)});`);
    p.tl.push(`tl.fromTo("#${nw}", {clipPath:"inset(0% 100% 0% 0%)"}, {clipPath:"inset(0% 0% 0% 0%)", duration:0.8, ease:"power1.inOut"}, ${r3(at + 0.5)});`);
    p.ev(at + 0.5); if (i < LED.length - 1) p.ev(LED[i + 1][3] - 0.1);
    if (i < LED.length - 1) p.tl.push(`tl.fromTo("#${sk}", {scaleX:0}, {scaleX:1, duration:0.4, ease:"power2.out"}, ${r3(LED[i + 1][3] - 0.1)});`);
    p.ev(at); fx(p, 'nib.wav', at + 0.5, -14, 0.9);
    return `<div id="${id}" style="opacity:0;display:flex;align-items:baseline;gap:30px;margin:14px 0;position:relative"><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:56px;width:150px">${y}</div><div class="mono" style="font-size:24px;font-weight:700;width:520px">${by}</div><div id="${nw}" class="hand" style="font-size:64px;color:#1F2A5C;position:relative">${who}<i id="${sk}" style="position:absolute;left:-8px;right:-8px;top:50%;height:6px;background:#1A1612;transform-origin:0 50%;transform:scaleX(0)"></i></div></div>`; }).join('');
  sc(2, `${head(p, 'SINCE INDEPENDENCE', cut[2] + 0.1, 'Government after government picked up *the pen.*', cut[2] + 0.2, { size: 74, w: 1300 })}
    <div style="position:absolute;left:150px;top:360px;width:1500px;background:#FCF5E8;border:4px solid var(--ink);box-shadow:10px 12px 0 var(--ink);padding:24px 40px">${mono('THE BAWKU SKIN · AWARDED TO…', { size: 24 })}${rows}</div>
    ${art(p, 'nib', cut[2] + 0.6, { x: 1580, y: 150, w: 230, rot: 0, life: 'sway', until: cut[3], sfx: SFX + '/nib.wav' })}`);
  // 3 — 2023 to 2025: no images of victims
  const blk = b('at least fifty-eight', 'fifty-eight people') - 0.3;
  p.scene(cut[3], blk, `${head(p, 'FEBRUARY 2023 · NALERIGU', cut[3] + 0.1, 'The Naayiri enskins *his own* Bawku Naaba.', cut[3] + 0.2, { size: 74, w: 1100 })}
    ${nameCard(p, b('alhaji seidu abagre'), { y: 430, role: 'ENSKINNED AT NALERIGU · FEB 2023', name: 'Alhaji Seidu Abagre' })}
    ${p.chip('October 2024: he arrives in Bawku', b('when he arrived'), { kind: 'chip light', x: 150, y: 650 })}
    ${p.chip('…and the shooting returns', b('the shooting returned'), { kind: 'chip red', x: 150, y: 745 })}`);
  p.scene(blk, cut[4], `<div style="position:absolute;inset:0;background:#141210"></div><div style="position:absolute;left:0;right:0;top:420px;text-align:center"><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:76px;color:#F3EBD7;line-height:1.15">${p.words(p.id_('bk'), 'At least 58 killed,', blk + 0.3, { stagger: 0.1 })}<br>${p.words(p.id_('bk'), 'Oct 2024 to Feb 2025.', blk + 1.0, { stagger: 0.1 })}</div></div>`, { bg: 'none', enter: 'cut' });
  // 4 — the Asantehene's mediation report
  sc(4, `${head(p, 'ASKED TO MEDIATE', cut[4] + 0.1, 'The Asantehene’s report, *16 December 2025.*', b('presented his report') - 0.2, { size: 72, w: 1000 })}
    ${nameCard(p, b('otumfuo osei tutu', 'the asantehene'), { y: 400, role: 'ASANTEHENE · MEDIATOR', name: 'Otumfuo Osei Tutu II' })}
    ${card(p, `${mono('THE REPORT', { size: 22 })}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:38px;line-height:1.15;margin-top:10px">Recognises <span style="color:#1F2A5C">Asigri Abugrago Azoka II</span> as Bawku Naaba.</div><div style="font-family:'Playfair Display',serif;font-size:32px;line-height:1.2;margin-top:12px">Alhaji Abagre: return to Nalerigu, or live in Bawku as a private citizen.</div>`, b('it recognised'), { x: 150, y: 600, w: 1100 })}
    ${p.stamp('BAWKU NAABA: ASIGRI ABUGRAGO AZOKA II', b('as bawku naaba'), { x: 150, y: 870, rot: -2, size: 30 })}
    ${p.chip('…or a private citizen in Bawku', b('private citizen'), { kind: 'chip gold', x: 1300, y: 600 })}
    ${art(p, 'report', b('presented his report'), { x: 1400, y: 160, w: 330, rot: 4, life: 'bob', until: cut[5], sfx: SFX1 + '/paper-slap.wav' })}`);
  // 5 — responses; the curfew; the talks
  sc(5, `${card(p, `${mono('THE RESPONSES', { size: 24 })}${[['Accepted by the government', b('the government accepted')], ['GH¢1bn fund to rebuild Bawku', b('one-billion-cedi')], ['Rejected by the Naayiri', b('the naayiri rejected')], ['25 December: the army moves Alhaji Abagre out', b('on christmas day')]].map(([t, at]) => { const id = p.id_('rs'); p.tl.push(`tl.fromTo("#${id}", {opacity:0, x:-30}, {opacity:1, x:0, duration:${SP.snappy}, ease:"sp-snappy"}, ${r3(at)});`); p.ev(at); fx(p, 'kachunk.wav', at, -18);
      return `<div id="${id}" style="opacity:0;font-family:'Playfair Display',serif;font-weight:900;font-size:44px;line-height:1.15;margin:14px 0">${t}</div>`; }).join('')}`, cut[5] + 0.1, { x: 150, y: 130, w: 1100 })}
    ${art(p, 'curfew', b('the ten-at-night curfew'), { x: 1360, y: 160, w: 380, rot: -3, life: 'pulse', until: cut[6], sfx: SFX + '/tick.wav', db: -10 })}
    ${p.chip('10 pm curfew: still in force', b('the ten-at-night curfew'), { kind: 'chip red', x: 150, y: 640 })}
    ${p.chip('talks go on · National Peace Council', b('talks between'), { kind: 'chip light', x: 150, y: 740 })}`);
  // 6 — no verdict
  sc(6, `<div class="hl" style="left:150px;top:220px;width:1600px"><h1 style="font-size:96px">${p.words(p.id_('nv'), 'Notice who was holding *the pen.*', b('notice who'), { stagger: 0.08 })}</h1></div>
    ${p.stamp('NO VERDICT', b('gives no verdict'), { x: 160, y: 560, rot: -5, size: 110 })}`, { enter: 'iris' });
  fx(p, 'thump.wav', b('gives no verdict') + 0.1, -6);
  return p;
}

// ---------------------------------------------------------------------------
// THEN v NOW — 1956 ballot box / 2020 roadblock; Western Togoland; Radcliffe; the classified: the north as a labour reserve.
export function thennow() {
  const [p, c, s] = make('thennow');
  const b = (...q) => cs(c, ...q);
  const cut = [0, b('on the sixteenth'), b('and at dawn'), b('the state answers'), b('it is not only'), b('and here is the item'), b('it also decided'), b('e no be small'), s.dur].map((t, i) => i ? t - 0.1 : 0);
  const sc = (i, html, o = {}) => p.scene(cut[i], cut[i + 1], html, o);
  const half = (side, yr, lbl, artName, at) => `<div style="position:absolute;left:${side ? 980 : 0}px;top:0;width:940px;height:1080px;background:${side ? '#F7EDD3' : '#EADDBE'}">
      <div style="position:absolute;left:80px;top:130px">${p.kicker(side ? 'NOW' : 'THEN', at)}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:150px;line-height:1">${p.words(p.id_('y'), yr, at + 0.1)}</div><div class="mono" style="font-size:28px;font-weight:700;margin-top:10px;width:780px">${lbl}</div></div>
      ${art(p, artName, at + 0.3, { x: 330, y: 480, w: 440, rot: side ? 3 : -3, life: 'bob', until: cut[1] + 0.5, sfx: side ? SFX + '/thump.wav' : SFX + '/ballot.wav', db: -12 })}</div>`;
  sc(0, `${half(0, '1956', '42% OF BRITISH TOGOLAND VOTED TO WAIT', 'ballot', 0.2)}${half(1, '2020', 'A SMALL MOVEMENT SAYS THE WAIT NEVER ENDED', 'roadblock', b('now, a small') - 0.1)}<div style="position:absolute;left:958px;top:0;width:44px;height:1080px;background:var(--ink)"></div>`, { enter: 'cut', bg: 'none' });
  const HO = stringMap(p, { x: 1100, y: 110, w: 680, h: 720, bbox: [-0.6, 5.6, 1.6, 8.4], fills: [{ country: 'Ghana', fill: '#F3E9CF' }, { country: 'Togo', fill: '#E6D9B8' }], strings: [{ country: 'Ghana', color: 'red' }, { country: 'Togo', color: 'black' }],
    pins: [{ place: 'Ho', label: 'HO', at: b('in ho'), dx: 18, dy: -50 }, { place: 'Mepe', label: 'MEPE', at: b('mepe'), dx: -130, dy: 10 }, { place: 'Aveyime', label: 'AVEYIME', at: b('aveyime'), dx: -190, dy: -46 }] });
  sc(1, `${head(p, '16 NOVEMBER 2019 · HO', cut[1] + 0.1, 'A declared state of *“Western Togoland”.*', b('declared a state') - 0.1, { size: 74, w: 900 })}${HO.html}
    ${nameCard(p, b('led by charles'), { y: 400, role: 'HOMELAND STUDY GROUP FOUNDATION · THEN IN HIS 80s', name: 'Charles Kormi Kudzordzi' })}
    ${p.chip('the claim: the 1956 union was never properly formed', b('never properly formed'), { kind: 'chip light', x: 150, y: 620 })}`);
  sc(2, `${head(p, 'DAWN · 25 SEPTEMBER 2020', cut[2] + 0.1, 'Police stations raided. *Roads blocked.*', b('raided the police') - 0.1, { size: 76, w: 900 })}${HO.html.replace(/id="([a-z]+\d+)/g, 'id="$1x')}
    ${art(p, 'roadblock', b('blocked the roads'), { x: 160, y: 470, w: 420, rot: -3, life: 'bob', until: cut[3], sfx: SFX + '/thump.wav', db: -10 })}
    ${p.chip('armed men linked to the movement', b('armed men'), { kind: 'chip red', x: 620, y: 520 })}`);
  sc(3, `${head(p, 'BOTH THINGS ARE TRUE AT ONCE', cut[3] + 0.1, 'The state’s answer — and the court’s.', cut[3] + 0.2, { size: 74, w: 1000 })}
    ${stack(p, [['a UN plebiscite settled the matter', b('a united nations plebiscite'), 'chip light'], ['the Volta chiefs disowned the declaration', b('the volta chiefs'), 'chip light'], ['courts jailed members of the armed group', b('the courts have jailed'), 'chip red']], { y: 400 })}
    ${p.chip('held for long periods without trial', b('held for long'), { kind: 'chip red', x: 150, y: 690 })}
    ${p.stamp('BOTH TRUE AT ONCE', b('both things are true'), { x: 160, y: 800, rot: -4, size: 50 })}
    ${factCard(p, 'ECOWAS COURT · MAY 2025', 'US$75,000', b('the ecowas court'), { sub: 'TO 30 MEMBERS HELD FOR LONG PERIODS WITHOUT TRIAL', size: 110, y: 380 })}
    ${st(p, 'gavel', b('the ecowas court') - 0.2, { x: 1500, y: 140, w: 240, rot: -4, life: 'bob', until: cut[4], sfx: SFX1 + '/knock.wav', db: -8 })}`);
  // 4 — the world: Radcliffe, 1947
  const IN = stringMap(p, { x: 1060, y: 110, w: 720, h: 740, bbox: [60, 5, 98, 37], fills: [{ country: 'India', fill: '#F3E9CF' }, { country: 'Pakistan', fill: '#E6D9B8' }, { country: 'Bangladesh', fill: '#E6D9B8' }, { country: 'Nepal', fill: '#E9E0C8' }, { country: 'Sri Lanka', fill: '#E9E0C8' }],
    strings: [{ country: 'Pakistan', color: 'red', at: b('five weeks'), dur: 1.6 }, { country: 'Bangladesh', color: 'red', at: b('five weeks') + 0.8, dur: 1.4 }] });
  sc(4, `${head(p, 'THE WORLD · PARTITION OF INDIA, 1947', cut[4] + 0.1, 'Five weeks, a lawyer, *a line.*', b('cyril radcliffe') - 0.1, { size: 80, w: 900 })}${IN.html}
    ${nameCard(p, b('cyril radcliffe'), { y: 420, role: 'BRITISH LAWYER · HAD NEVER SEEN INDIA', name: 'Cyril Radcliffe' })}
    ${p.chip('about five weeks to divide it', b('five weeks'), { kind: 'chip gold', x: 150, y: 640 })}
    ${p.chip('…millions uprooted', b('millions were uprooted'), { kind: 'chip red', x: 150, y: 735 })}`);
  // 5 — the classified enlarges: lines inside the north
  const cl = p.id_('cl');
  p.tl.push(`tl.fromTo("#${cl}", {scale:0.28, x:620, y:380}, {scale:1, x:0, y:0, duration:${SP.heavy}, ease:"sp-heavy"}, ${r3(cut[5] + 0.2)});`); fx(p, 'swoop.wav', cut[5] + 0.2, -12); fx(p, 'hit.wav', cut[5] + 0.6, -14);
  sc(5, `<div id="${cl}" style="position:absolute;left:150px;top:140px;width:1620px;height:760px;background:#FCF5E8;border:5px dashed var(--ink);padding:40px 60px;transform-origin:100% 100%">
      <div class="mono" style="display:flex;justify-content:space-between;font-size:26px;font-weight:700;letter-spacing:.1em"><span>CLASSIFIED · THE 1%</span><b style="color:var(--red)">BAWKU</b></div>
      <div style="font-family:'Playfair Display',serif;font-weight:900;font-size:74px;line-height:1.05;margin-top:30px">${p.words(p.id_('cr'), 'Colonial rule drew lines *inside the north* too.', b('colonial rule drew'), { stagger: 0.07 })}</div>
      ${stack(p, [['which chiefs would rule which peoples — written into law', b('deciding which chiefs'), 'chip light'], ['every government since could redraw — never erase', b('could redraw'), 'chip red']], { x: 60, y: 360 })}</div>`, { enter: 'cut' });
  // 6 — what the north was for: labour south, schools scarce
  const LB = stringMap(p, { x: 1240, y: 120, w: 540, h: 700, bbox: GH, fills: [{ country: 'Ghana', fill: '#F3E9CF' }], strings: [{ country: 'Ghana', color: 'red' }],
    lines: [{ d: (P) => M.linePath(P, [[-0.9, 10.4], [-1.1, 8.6], [-1.6, 6.9], [-1.9, 5.8]]), color: '#1A1612', at: b('sent northern men'), dur: 1.8, w: 6 }],
    pins: [{ place: 'Tamale', label: 'TAMALE · 1951', at: b('opened in tamale'), dx: 16, dy: -50 }, { place: 'Cape Coast', label: 'CAPE COAST · 1876', at: b('after mfantsipim'), dx: -40, dy: 26 }] });
  sc(6, `${head(p, 'WHAT THE NORTH WAS FOR', cut[6] + 0.1, 'Men sent south. *Schools kept scarce.*', b('sent northern men') - 0.1, { size: 76, w: 1000 })}${LB.html}
    ${st(p, 'farmer-walk', b('sent northern men'), { x: 900, y: 140, w: 280, rot: -3, life: 'bob', until: cut[7] })}
    ${card(p, `${mono('FIRST SECONDARY SCHOOLS', { size: 22 })}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:40px;line-height:1.2;margin-top:10px">Mfantsipim, Cape Coast · <span style="color:var(--red)">1876</span><br>Government Secondary School, Tamale · <span style="color:var(--red)">1951</span></div>`, b('the north’s first', "north's first", 'first secondary'), { x: 150, y: 420, w: 1000 })}
    <div style="position:absolute;left:150px;top:690px;display:flex;align-items:baseline;gap:20px">${counter(p, b('seventy-five years'), 75, { size: 140, color: 'var(--red)' })}<span class="mono" style="font-size:28px;font-weight:700">YEARS LATER</span></div>
    ${art(p, 'school', b('opened in tamale'), { x: 760, y: 640, w: 300, rot: 3, life: 'bob', until: cut[7], sfx: SFX1 + '/bell.wav', db: -14 })}`);
  sc(7, `<div class="hl" style="left:150px;top:200px;width:1600px"><h1 style="font-size:130px">${p.words(p.id_('en'), 'E no be *small thing.*', cut[7] + 0.15, { stagger: 0.09 })}</h1></div>
    ${stack(p, [['the north was run as a labour reserve', b('labour reserve'), 'chip red'], ['Bawku still lives inside a decision made for it', b('bawku still lives'), 'chip gold']], { y: 520 })}`);
  fx(p, 'hit.wav', cut[7] + 0.2, -14);
  return p;
}

// ---------------------------------------------------------------------------
// THE TEAM ASIDE — back at the Nest: Amo, The Discerning. Hands and the map only; no faces.
export function team() {
  const [p, c, s] = make('team');
  const b = (...q) => cs(c, ...q);
  const cut = [0, b('he carries the name'), b('amo is blind'), b('late in the evening'), b('kwame, the combative'), s.dur].map((t, i) => i ? t - 0.1 : 0);
  // 0 — the living Nest; the camera finds the shared table
  const N = livingNest(p, 0, cut[1], { grade: 'evening', truck: 40, seed: 41, start: { scale: 1.05, x: 0, y: 0 } });
  N.aim([905, 520], 1.9, b('the hands on that') - 0.3);
  p.scene(0, cut[1], `${N.html}${card(p, `${mono('BACK AT THE NEST')}${H(p, 'The hands belong to *Amo.*', b('belong to amo') - 0.2, 64)}`, 0.1, { x: 110, y: 120, w: 820 })}
    ${nameCard(p, b('the discerning'), { y: 560, role: 'THE DISCERNING', name: 'Amo', note: 'new at the Nest this edition' })}`, { bg: 'none', enter: 'cut', drift: 0 });
  nestBed(p, 0, cut[1] + 0.5, -22); fx(p, 'hit.wav', b('the discerning'), -18);
  // 1 — his namesake, Anton Wilhelm Amo
  const AX = stringMap(p, { x: 1180, y: 160, w: 600, h: 600, bbox: GH, fills: [{ country: 'Ghana', fill: '#F3E9CF' }], strings: [{ country: 'Ghana', color: 'red' }], pins: [{ place: 'Axim', label: 'AXIM', at: b('near axim'), dx: 16, dy: -50 }] });
  p.scene(cut[1], cut[2], `${head(p, 'HIS NAMESAKE', cut[1] + 0.1, 'Anton Wilhelm Amo, *c. 1703.*', cut[1] + 0.2, { size: 84, w: 960 })}${AX.html}
    ${stack(p, [['taken from near Axim to Germany as a boy', b('a boy taken'), 'chip light'], ['grew up to teach philosophy there (Halle, Jena)', b('teach philosophy'), 'chip gold'], ['…does not take the world as it is handed to him', b('does not take the world'), 'chip red']], { y: 420 })}`);
  // 2 — by touch: a friend's hands glue the strings; his fingertip finds Yendi by the knot
  const TM = stringMap(p, { x: 0, y: 0, w: 1920, h: 1080, bbox: [-3.4, 4.5, 2.2, 11.4], ...WEST_AFRICA(null), lines: [{ d: (P) => M.linePath(P, M.LINE_1899), color: 'black', w: 7 }],
    pins: [{ place: 'Yendi', label: 'YENDI — THE KNOT', at: b('by the knot'), fs: 26, dx: 20, dy: 16 }],
    extra: (P) => { const [x, y] = P([-0.18, 9.3]); return `<circle cx="${x}" cy="${y}" r="13" fill="#1A1612"/><circle cx="${x - 4}" cy="${y - 4}" r="4" fill="#6B6253"/>`; } });
  const [yx, yy] = TM.P(M.PLACE.Yendi);
  const blurHands = p.id_('bh'); p.tl.push(`tl.fromTo("#${blurHands}", {opacity:0, x:120}, {opacity:.85, x:0, duration:${SP.default}, ease:"sp-default"}, ${r3(b('glued every string'))});`);
  p.tl.push(`tl.to("#${blurHands}", {opacity:0, x:160, duration:0.6, ease:"power2.in", immediateRender:false}, ${r3(b('and he traced'))});`); p.ev(b('glued every string'));
  const pts = [[-2.6, 6.0], [-1.0, 8.2], [-0.25, 8.8], [-0.18, 9.3], [-0.12, 9.42], [-0.18, 9.3]].map((ll) => TM.P(ll));
  p.scene(cut[2], cut[3], `<div class="wrap" style="transform:translate(${r3(960 - 1.5 * yx)}px, ${r3(560 - 1.5 * yy)}px) scale(1.5);transform-origin:0 0">${TM.html}
      <div id="${blurHands}" style="position:absolute;left:${yx + 220}px;top:${yy - 240}px;width:300px;filter:blur(7px);opacity:0">${art(p, 'palm', b('glued every string'), { abs: false, w: 300, sfx: null, life: 'sway', until: b('and he traced') })}</div>
      ${fingertip(p, pts, b('and he traced'), b('swerves away') + 0.6, { w: 210 })}</div>
    ${card(p, `${mono('BY TOUCH')}${H(p, 'Amo is blind. He learns a place by *touch.*', cut[2] + 0.2, 50)}`, cut[2] + 0.1, { x: 110, y: 110, w: 760 })}
    ${p.chip('a friend glued every string down for him', b('glued every string'), { kind: 'chip light', x: 110, y: 400 })}
    ${p.chip('his fingers knew Yendi by the knot', b('his fingers knew', 'until his fingers'), { kind: 'chip gold', x: 110, y: 490 })}`, { bg: 'none', enter: 'iris', drift: 0.03 });
  fx(p, 'peel.wav', b('glued every string'), -18);
  // 3 — the strings peeled off; a palm on the bare card
  const pe = b('he peeled the strings'), palm = b('laid his palm');
  const PE = stringMap(p, { x: 0, y: 0, w: 1920, h: 1080, bbox: [-3.4, 4.5, 2.2, 11.4], fills: WEST_AFRICA(null).fills });
  const strs = ["Côte d'Ivoire", 'Burkina Faso', 'Benin', 'Togo', 'Ghana'].map((n, i) => { const id = p.id_('pl'); p.tl.push(`tl.to("#${id}", {strokeDashoffset:-1000, opacity:0, duration:0.7, ease:"power2.in", immediateRender:false}, ${r3(pe + 0.4 + i * 0.35)});`); fx(p, 'peel.wav', pe + 0.4 + i * 0.35, -14);
    return M.stringPath(M.countryPath(PE.P, n), M.COL[{ Ghana: 'red', Togo: 'black' }[n] || 'blue'], { id, w: 6 }).replace(`id="${id}"`, `id="${id}" stroke-dasharray="1000" stroke-dashoffset="0"`); }).join('');
  p.ev(pe + 0.4);
  p.scene(cut[3], cut[4], `${PE.html.replace('</svg>', `${M.STRING_DEFS}${strs}</svg>`)}
    ${art(p, 'palm', palm, { x: 760, y: 300, w: 420, rot: -8, life: 'bob', until: cut[4] + 0.4, sfx: SFX1 + '/paper-slap.wav', db: -12 })}
    ${card(p, `${mono('LATE IN THE EVENING')}${H(p, 'One by one, the strings *come off.*', cut[3] + 0.2, 50)}`, cut[3] + 0.1, { x: 110, y: 110, w: 760 })}`, { bg: 'none', enter: 'wipeL', drift: 0.03 });
  // 4 — Kwame goes quiet: under every string, the card is one piece
  const N2 = livingNest(p, cut[4], s.dur, { grade: 'evening', truck: 30, seed: 43, start: { scale: 1.7, x: 95, y: 34 } });
  p.scene(cut[4], s.dur, `${N2.html}
    ${st1(p, 'kwame-boxer', cut[4] + 0.2, { x: 1330, y: 360, w: 320, rot: 4, life: 'sway', until: s.dur, sfx: SFX1 + '/whip.wav' })}
    ${pin(p, 'Kwame · The Combative', 1460, 360, cut[4] + 0.4, -340, -80)}
    ${card(p, `${H(p, 'Under every string, the card is *one piece.*', b('under every string') - 0.1, 56)}`, b('ran his hand'), { x: 110, y: 130, w: 880 })}
    ${p.chip('More about Amo in good time.', b('i will tell you'), { kind: 'chip gold', x: 110, y: 460 })}`, { bg: 'none', enter: 'push', drift: 0 });
  nestBed(p, cut[4], s.dur, -22);
  return p;
}

// ---------------------------------------------------------------------------
// THE EDITOR'S NOTE — "Pencil and ink": a pencil sketch, an eraser, then a pen nib inking over it.
export function editor() {
  const [p, c, s] = make('editor');
  const b = (...q) => cs(c, ...q);
  const mid = b('every border') - 0.1;
  const pl = p.id_('pl'), er = p.id_('er'), ik = p.id_('ik');
  const sk = b('sketch in pencil'), rub = b('rubbed out'), inkT = b('inking over');
  p.tl.push(`tl.fromTo("#${pl}", {strokeDashoffset:1000}, {strokeDashoffset:0, duration:1.6, ease:"power1.inOut"}, ${r3(sk)});`);
  p.tl.push(`tl.fromTo("#${er}", {strokeDashoffset:1000}, {strokeDashoffset:640, duration:0.9, ease:"power1.inOut"}, ${r3(rub)});`);
  p.tl.push(`tl.fromTo("#${ik}", {strokeDashoffset:1000}, {strokeDashoffset:0, duration:2.0, ease:"power1.inOut"}, ${r3(inkT - 0.2)});`);
  [sk, rub, inkT].forEach((t) => p.ev(t));
  const LINE = 'M120 160 C 300 80, 460 260, 640 150 S 960 60, 1160 180 S 1400 260, 1560 140';
  const paper = (inner) => `<svg style="position:absolute;left:180px;top:520px" width="1680" height="320" viewBox="0 0 1680 320">${inner}</svg>`;
  p.scene(0, mid, `${head(p, 'PENCIL AND INK', 0.1, 'Sketch in pencil — it can be *rubbed out.*', sk - 0.2, { size: 80, w: 1100 })}
    ${p.chip('before sound, before security: visual arts', b('i trained in visual arts', 'visual arts'), { kind: 'chip light', x: 150, y: 400 })}
    ${paper(`<path id="${pl}" d="${LINE}" fill="none" stroke="#8A8072" stroke-width="5" stroke-dasharray="1000" stroke-dashoffset="1000" pathLength="1000"/><path id="${er}" d="${LINE}" fill="none" stroke="#F3EBD7" stroke-width="14" stroke-dasharray="1000" stroke-dashoffset="1000" pathLength="1000" transform="translate(0 0)"/>`)}
    ${art(p, 'pencil', sk, { x: 1420, y: 190, w: 360, rot: 0, life: 'jiggle', until: mid, sfx: SFX + '/pencil.wav', db: -8 })}`, { enter: 'cut' });
  fx(p, 'pencil.wav', sk, -8); fx(p, 'eraser.wav', rub, -8);
  p.scene(mid, s.dur, `${head(p, 'IN BERLIN AND LONDON', mid + 0.1, 'Sketched by men who never *walked the ground.*', mid + 0.2, { size: 76, w: 1200 })}
    ${paper(`<path d="${LINE}" fill="none" stroke="#8A8072" stroke-width="5"/><path id="${ik}" d="${LINE}" fill="none" stroke="#1A1612" stroke-width="12" stroke-linecap="round" stroke-dasharray="1000" stroke-dashoffset="1000" pathLength="1000"/>`)}
    ${art(p, 'nib', inkT - 0.3, { x: 1440, y: 190, w: 330, rot: 0, life: 'jiggle', until: s.dur, sfx: SFX + '/nib.wav', db: -6 })}
    ${p.chip('Berlin · London', b('in berlin and london', 'berlin and london'), { kind: 'chip light', x: 150, y: 420 })}
    ${p.chip('…and we have been inking over them ever since', inkT, { kind: 'chip red', x: 150, y: 510 })}`, { enter: 'wipeL' });
  fx(p, 'nib.wav', inkT, -8);
  return p;
}

// ---------------------------------------------------------------------------
// LETTERS PAGE — connect: which colonial line still shapes your town, family or school?
export function letters() {
  const [p, c, s] = make('letters');
  const b = (...q) => cs(c, ...q);
  const q = b('so which colonial');
  const pc = p.id_('pc'); p.grow(pc, b('bawku’s chiefs', "bawku's chiefs") - 0.2, { rot: -1, from: 0.7, preset: 'heavy' }); fx(p, 'kachunk.wav', b("bawku's chiefs") - 0.1, -14);
  const TXT = 'Connect: Bawku’s chiefs, the Volta’s separatists and Dagbon’s split capital all trace back to lines drawn before 1914. Which colonial line still shapes your own town, family or school, and how?'.split(' ');
  const body = TXT.map((w, i) => { const id = p.id_('cw'), at = b("bawku's chiefs") + 0.2 + i * 0.16; p.tl.push(`tl.set("#${id}", {opacity:1}, ${r3(at)});`); if (i % 2 === 0) fx(p, 'key.wav', at, -24); if (i % 6 === 0) p.ev(at); return `<span id="${id}" style="opacity:0">${w}</span>`; }).join(' ');
  p.scene(0, s.dur, `${head(p, 'LETTERS PAGE', 0.1, 'This week: *connect.*', b('asks you to connect') - 0.1, { size: 96 })}
    ${p.icon('letters-pile', 0.4, { x: 1500, y: 110, w: 260, rot: 4, life: 'bob', until: s.dur, sfx: SFX1 + '/paper-slap.wav' })}
    <div id="${pc}" style="position:absolute;left:150px;top:400px;width:1080px;background:#FFFFFF;border-radius:18px;box-shadow:0 30px 60px -20px rgba(60,40,10,.45);padding:30px 36px">
      <div style="font-family:'GCP Round',sans-serif;font-size:22px;color:#606060">📌 Pinned by Gold Coast Palava</div>
      <div style="display:flex;gap:20px;margin-top:16px"><div style="width:64px;height:64px;border-radius:50%;background:var(--red);color:#FCF5E8;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-weight:900;font-size:34px;flex:none">G</div>
        <div><div style="font-family:'GCP Round',sans-serif;font-weight:700;font-size:24px">@GoldCoastPalava</div><div style="font-family:'GCP Round',sans-serif;font-size:32px;line-height:1.35;margin-top:8px;color:#0F0F0F">${body}</div></div></div></div>
    ${stack(p, [['your town?', q + 0.4, 'chip gold'], ['your family?', b('your family'), 'chip light'], ['your school?', b('or your school'), 'chip light'], ['I will pin the best answer', b('pin the best'), 'chip red']], { x: 1290, y: 420 })}`, { enter: 'cut' });
  return p;
}

// ---------------------------------------------------------------------------
// THE DISPATCH — typewriter, a stamp, a bundle tied and carried out; then the closing montage (COMBO2).
export function dispatch() {
  const [p, c, s] = make('dispatch');
  p.css.push(BANNER_CSS);
  const b = (...q) => cs(c, ...q);
  const vEnd = (({ local0, vo_in, vo_out }) => local0 + vo_out - vo_in)(s.pieces[s.pieces.length - 1]);
  const aEnd = b('and dispatched to') - 0.1;
  const sig = p.id_('sg');
  p.tl.push(`tl.fromTo("#${sig}", {strokeDasharray:900, strokeDashoffset:900}, {strokeDashoffset:0, duration:1.3, ease:"power2.inOut"}, ${r3(b('filed and signed') + 0.3)});`); p.ev(b('filed and signed') + 0.3);
  p.sound('pen-2.mp3', b('filed and signed') + 0.3, -10);
  p.scene(0, aEnd, `<div class="hl" style="left:150px;top:150px;width:1600px">${p.kicker('DISPATCH', 0.1)}<h1 style="font-size:96px">${p.words(p.id_('fe'), 'The *third edition*, complete.', 0.25, { stagger: 0.07 })}</h1></div>
    <div style="position:absolute;left:150px;top:420px;display:flex;gap:16px">${p.chip('CHECKED', b('checked'), { kind: 'chip light' })}${p.chip('STAMPED', b('stamped'), { kind: 'chip light' })}${p.chip('≈ 50 MB', b('priced at'), { kind: 'chip gold' })}</div>
    <div class="mono" style="position:absolute;left:150px;top:560px;font-size:46px;font-weight:700;line-height:1.5">${p.typed('THE NEST · 266 SANDPIPER LOOP', b('at the nest', 'at the nest,'), { cps: 24 })}<br>${p.typed('ONIPA ENCLAVE', b('onipa enclave', 'enclave') - 0.6, { cps: 20, sfx: false })}</div>
    <svg style="position:absolute;left:1150px;top:560px" width="520" height="160" viewBox="0 0 460 140"><path id="${sig}" d="M10 90 C 40 20, 70 20, 80 80 S 120 120, 140 60 S 180 10, 200 70 S 240 110, 270 50 C 290 20, 320 100, 350 70 S 420 40, 450 60" fill="none" stroke="#1A1612" stroke-width="5" stroke-linecap="round"/></svg>
    ${p.print(PILOT + '/final/nest-light.png', b('at the nest', 'at the nest,') - 0.2, { x: 1320, y: 110, w: 470, rot: 2, caption: 'The Nest · 266 Sandpiper Loop' })}
    ${p.stamp('FILED', b('filed and signed') + 1.6, { x: 1250, y: 760, rot: -10, size: 80 })}`, { enter: 'cut' });
  fx(p, 'thump.wav', b('stamped') + 0.1, -8); fx(p, 'thump.wav', b('filed and signed') + 1.7, -6);
  const stops = [['to accra', 'ACCRA'], ['to kumasi', 'KUMASI'], ['to bunkpurugu', 'BUNKPURUGU'], ['to half assini', 'HALF ASSINI'], ['and to the world', 'THE WORLD']];
  const route = stops.map(([q, t], i) => p.chip(t, b(q), { kind: i === 4 ? 'chip gold' : 'chip', x: 150 + i * 340, y: 560 + (i % 2) * 120 })).join('');
  stops.forEach(([q]) => fx(p, SFX1 + '/pop-2.wav', b(q), -16));
  const path_ = p.id_('rt');
  p.tl.push(`tl.fromTo("#${path_}", {strokeDasharray:1800, strokeDashoffset:1800}, {strokeDashoffset:0, duration:${r3(b('and to the world') - b('to accra') + 0.5)}, ease:"none"}, ${r3(b('to accra'))});`);
  p.scene(aEnd, vEnd + 0.6, `<div class="hl" style="left:150px;top:200px;width:1600px">${p.kicker('…AND DISPATCHED TO', aEnd + 0.1)}<h1 style="font-size:96px">${p.words(p.id_('dp'), 'Menners, vim dey. *Make we chat later.*', b('menners'), { stagger: 0.08 })}</h1></div>
    <svg style="position:absolute;left:0;top:0" width="1920" height="1080"><path id="${path_}" d="M230 600 L570 720 L910 600 L1250 720 L1590 600" fill="none" stroke="#A4241B" stroke-width="5" stroke-dasharray="14 10"/></svg>${route}
    ${st1(p, 'folded-paper', aEnd + 0.3, { x: 1560, y: 760, w: 220, rot: 6, life: 'bob', until: vEnd + 0.6, sfx: SFX + '/bundle.wav', db: -10 })}`);
  const o0 = vEnd + 0.6;
  const bn = banner(p, 'ob', { t0: o0 + 0.2, speed: 1.15, until: s.dur - 3.0 });
  const sub = p.chip('SUBSCRIBE — so the next edition finds you', o0 + 3.2, { kind: 'chip red sub-sm' });
  const fold = s.dur - 3.0;
  p.tl.push(`tl.to("#ob-sym", ${JSON.stringify({ x: 494, y: -95, scale: 3.0, duration: SP.heavy, ease: 'sp-heavy', immediateRender: false })}, ${fold});`);
  p.tl.push(`tl.to("#ob > :not(#ob-sym)", {opacity:0, scale:0.6, duration:0.5, ease:"power2.in", immediateRender:false}, ${fold});`);
  p.ev(fold); p.ev(o0 + 7); p.ev(o0 + 10); p.sound('whoosh-2.mp3', fold, -12);
  p.scene(o0, s.dur, `${bn}<div style="position:absolute;left:0;right:0;top:690px;text-align:center">${sub}</div>`, { drift: 0.03, bg: 'plain' });
  p.mastEnd = o0;
  return p;
}

export const BUILDERS2 = { lead, wire, palava, thennow, team, editor, letters, dispatch };
