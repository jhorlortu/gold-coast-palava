// Edition 4 — the main business: Lead Story ("From sedie to cedi"), The Wire (Monday 19 July 1965), The Palava Desk
// (Switzerland, or the printing press inside the computer), Then v Now (the Heritage Series), Team Aside (Kwame),
// Editor's Note (printed belief), Letters, Dispatch (+ COMBO2).
import fs from 'node:fs';
import { SP } from '/home/user/gcp/build/lib.mjs';
import { banner, BANNER_CSS } from '/home/user/gcp/build/banner.mjs';
import { livingNest } from '/home/user/gcp/ed2/build/nestlive.mjs';
import * as M from './maps.mjs';
import { art, stack, head, away, nameCard, counter, card, mono, H, nestBed, pin, st, st1, fx, cs, make, SFX, SFX1, PILOT, r3, bill, note, realImg, TABLE, sticky, timeline, split, src } from './ed4.mjs';
const factCard = (p, lbl, big, at, { x = 1150, y = 200, w = 620, size = 120, sub = '' } = {}) => card(p, `${mono(lbl, { size: 24 })}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:${size}px;line-height:1;margin-top:10px">${big}</div>${sub ? `<div class="mono" style="font-size:22px;font-weight:700;margin-top:10px">${sub}</div>` : ''}`, at, { x, y, w });
// an old note from Commons as a print on the page, or a name card when the file is missing (never invent one)
const oldNote = (p, key, at, label, { x, y, w = 560, rot = 0, from = 'top' } = {}) => {
  const f = realImg(key);
  if (f) return bill(p, f, at, { x, y, w, rot, from });
  return card(p, `${mono('BANKNOTE', { size: 20 })}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:44px;line-height:1.05;margin-top:8px">${label}</div>`, at, { x, y, w: Math.min(w, 520), rot });
};
// rain over a grey scene: seeded streaks falling on loops (pure GSAP, seek-safe)
const rain = (p, t0, t1, { n = 70, seed = 5 } = {}) => {
  let a = seed * 9301 + 49297; const R = () => ((a = (a * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: n }, (_, i) => { const id = p.id_('rn'), x = R() * 1920, per = 0.55 + R() * 0.5, len = 40 + R() * 60;
    p.tl.push(`tl.fromTo("#${id}", {y:-200}, {y:1250, duration:${r3(per)}, ease:"none", repeat:${Math.max(0, Math.floor((t1 - t0) / per))}}, ${r3(t0 + R() * per)});`);
    return `<i id="${id}" style="position:absolute;left:${r3(x)}px;top:0;width:2px;height:${r3(len)}px;background:linear-gradient(transparent, rgba(220,228,235,.7));transform:rotate(8deg)"></i>`; }).join('');
};
const GREY = `<div style="position:absolute;inset:0;background:linear-gradient(180deg,#8C949A 0%,#A9AEB0 45%,#7E8487 100%)"></div><div style="position:absolute;inset:0;background:url(assets/papers-bg.jpg) center/cover;opacity:.12;mix-blend-mode:multiply"></div>`;
// light glowing through a note held up to the window (watermark test)
const backlit = (p, srcImg, at, { x, y, w = 900, rot = -3 } = {}) => { const id = p.id_('bk'), gl = p.id_('gl');
  p.tl.push(`tl.fromTo("#${gl}", {opacity:0, scale:0.6}, {opacity:1, scale:1, duration:${SP.heavy}, ease:"sp-heavy"}, ${r3(at)});`); p.grow(id, at, { rot, from: 0.8, preset: 'heavy' }); fx(p, 'glint.wav', at + 0.4, -14);
  return `<div id="${gl}" style="position:absolute;left:${x - 160}px;top:${y - 140}px;width:${w + 320}px;height:${w * 0.45 + 280}px;background:radial-gradient(ellipse at 50% 50%, rgba(255,246,214,.95) 0%, rgba(255,230,160,.55) 40%, transparent 70%)"></div>
    <div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg)"><img src="${p.asset(srcImg)}" style="width:100%;display:block;filter:brightness(1.12) contrast(.9) saturate(1.1);box-shadow:0 0 60px rgba(255,240,200,.8)"></div>`; };

// ---------------------------------------------------------------------------
// LEAD STORY — "From sedie to cedi". Gold dust and goldweights → cowries from the Maldives → the first inflation
// → shillings from London → the Ghana pound (14 July 1958) → count in tens.
export function lead() {
  const [p, c, s] = make('lead');
  const b = (...q) => cs(c, ...q);
  const t2 = b('in twi') - 0.1, t3 = b('weighed on small') - 0.1, t4 = b('so the coin') - 0.1, t5 = b('but gold was') - 0.1, t6 = b('most were gathered') - 0.1,
    t7 = b('then in the second') - 0.1, t8 = b('the british replaced') - 0.1, t9 = b('on the fourteenth of july') - 0.1;
  // 1 — remember the gold of Edition 1
  p.scene(0, t2, `${head(p, 'LEAD STORY · FROM SEDIE TO CEDI', 0.1, 'Remember the gold of *our first edition?*', 0.25, { size: 92, w: 1000 })}
    ${p.print('/home/user/gcp/ed1/media/drawn/prempeh1-exile.jpg', 0.5, { x: 1190, y: 170, w: 560, rot: 2, caption: 'Edition 1 · the gold Asante owed Britain' })}
    ${p.chip('See Edition 1', 0.9, { kind: 'chip red', x: 150, y: 520 })}`, { enter: 'cut' });
  // 2 — sika
  p.scene(t2, t3, `<div class="hl" style="left:150px;top:180px;width:1100px">${p.kicker('IN TWI', t2 + 0.1)}<h1 style="font-size:84px">${p.words(p.id_('sk'), 'Gold and money share *one word.*', t2 + 0.2, { stagger: 0.07 })}</h1></div>
    <div style="position:absolute;left:150px;top:470px;font-family:'Playfair Display',serif;font-weight:900;font-size:260px;line-height:1;color:var(--gold)">${p.words(p.id_('sw'), 'sika', b('sika') - 0.05, { stagger: 0.1 })}</div>
    ${p.chip('for centuries, money here was gold dust', b('for centuries'), { kind: 'chip light', x: 900, y: 600 })}
    ${st1(p, 'gold-dust', b('was gold dust'), { x: 1420, y: 220, w: 360, rot: 4, life: 'bob', until: t3 })}`, { enter: 'wipeL' });
  fx(p, SFX1 + '/coins.wav', b('sika'), -14);
  // 3 — brass scales and goldweights; the pesewa
  p.scene(t3, t4, `${head(p, 'WEIGHED, NOT COUNTED', t3 + 0.1, 'Small brass scales, *little cast figures.*', t3 + 0.2, { size: 76, w: 1000 })}
    ${st1(p, 'scales-balance', t3 + 0.3, { x: 1120, y: 140, w: 420, rot: -3, life: 'sway', until: t4 })}
    ${art(p, 'goldweight', b('little cast figures'), { x: 1530, y: 420, w: 260, rot: 6, life: 'bob', until: t4, sfx: SFX1 + '/knock.wav', db: -14 })}
    ${p.chip('goldweights', b('we now call goldweights'), { kind: 'chip gold', x: 150, y: 430 })}
    ${p.chip('the smallest weight: the pesewa', b('the smallest weight'), { kind: 'chip red', x: 150, y: 530 })}
    ${art(p, 'pesewa', b('was the pesewa') + 0.1, { x: 560, y: 640, w: 260, rot: -6, life: 'pulse', until: t4, sfx: SFX1 + '/coins.wav', db: -12 })}`, { enter: 'push' });
  // 4 — a pinch of gold
  p.scene(t4, t5, `<div class="hl" style="left:150px;top:220px;width:1000px">${p.kicker('BY ITS VERY NAME', t4 + 0.1)}<h1 style="font-size:96px">${p.words(p.id_('pg'), 'The coin in your pocket: *a pinch of gold.*', t4 + 0.2, { stagger: 0.07 })}</h1></div>
    ${art(p, 'pesewa', t4 + 0.15, { x: 1220, y: 260, w: 440, rot: 8, life: 'pulse', until: t5, sfx: SFX1 + '/bell.wav', db: -18 })}
    ${st1(p, 'gold-dust', b('a pinch of gold'), { x: 1100, y: 640, w: 260, rot: -6, life: 'bob', until: t5 })}`, { enter: 'iris' });
  // 5 — gold for big deals, cowries for fish; sedie
  p.scene(t5, t6, `<div class="hl" style="left:150px;top:170px;width:1050px">${p.kicker('THE SMALL CHANGE', t5 + 0.1)}<h1 style="font-size:86px">${p.words(p.id_('gf'), 'Gold for big deals. *Cowries for fish.*', t5 + 0.2, { stagger: 0.07 })}</h1></div>
    ${art(p, 'cowrie-pile', b('there were cowries'), { x: 1250, y: 170, w: 460, rot: 0, life: 'bob', until: t6, sfx: 'shells-pour.wav', db: -20 })}
    ${p.chip('the Akan called them', b('the akan called'), { kind: 'chip light', x: 150, y: 520 })}
    <div style="position:absolute;left:150px;top:610px;font-family:'Playfair Display',serif;font-weight:900;font-size:190px;line-height:1;color:var(--red)">${p.words(p.id_('sd'), 'sedie', b('sedie') - 0.05, { stagger: 0.1 })}</div>
    ${p.stamp('NOT FROM OUR BEACHES', b('they did not come'), { x: 1150, y: 760, rot: -5, size: 44 })}`, { enter: 'wipeU' });
  fx(p, 'shell-set.wav', b('sedie'), -10);
  // 6 — Maldives → round the Cape → the Gold Coast (thin grey line, never celebratory)
  const BOX = [-22, -40, 82, 28], MW = 1920, MH = 1080, P = M.projection(BOX, MW, MH);
  const route = M.linePath(P, [[73.4, 3.6], [62, -6], [48, -24], [36, -34], [20, -38], [10, -30], [6, -14], [3, -2], [-1, 3.8]]);
  const rid = p.id_('rt');
  p.tl.push(`tl.fromTo("#${rid}", {strokeDashoffset:1000}, {strokeDashoffset:0, duration:${r3(Math.max(2, b('in the holds') - b('islands in the indian') + 1.5))}, ease:"power1.inOut"}, ${r3(b('islands in the indian'))});`); p.ev(b('islands in the indian'));
  const [mx, my] = P([73.4, 3.6]), [gx, gy] = P([-1, 5.5]);
  const mpin = (x, y, t, lbl, dx = 18, dy = -46) => { const id = p.id_('mp'); p.tl.push(`tl.fromTo("#${id}", {opacity:0, scale:2}, {opacity:1, scale:1, duration:${SP.snappy}, ease:"sp-snappy"}, ${r3(t)});`); p.ev(t); fx(p, 'pin.wav', t, -14);
    return `<g id="${id}" style="transform-origin:${x}px ${y}px" opacity="0"><circle cx="${x}" cy="${y}" r="11" fill="#C8962F" stroke="#1A1612" stroke-width="3"/><g transform="translate(${x + dx} ${y + dy})"><rect width="${lbl.length * 19 + 26}" height="40" fill="#FCF5E8" stroke="#1A1612" stroke-width="3"/><text x="13" y="29" font-family="Special Elite, IBM Plex Mono, monospace" font-size="28" fill="#1A1612">${lbl}</text></g></g>`; };
  p.scene(t6, t7, `<svg style="position:absolute;left:0;top:0" width="${MW}" height="${MH}"><rect width="${MW}" height="${MH}" fill="#E7EAE6"/><path d="${M.landPath(P, BOX)}" fill="#EFE4C8" stroke="#B9AD8E" stroke-width="1.5"/>
      <path id="${rid}" d="${route}" pathLength="1000" fill="none" stroke="#6E6A62" stroke-width="5" stroke-dasharray="4 14" stroke-linecap="round" style="stroke-dasharray:1000;stroke-dashoffset:1000"/>
      ${mpin(mx, my, b('the maldives'), 'MALDIVES', -230, -60)}${mpin(gx, gy, b('carried to west africa'), 'GOLD COAST', -260, -60)}</svg>
    ${card(p, `<div class="elite" style="font-size:40px">Maldives → Gold Coast</div>`, b('the maldives') + 0.3, { x: 110, y: 110, w: 560 })}
    ${p.chip('in the holds of European ships, as ballast', b('in the holds'), { kind: 'chip light', x: 110, y: 270 })}
    ${card(p, `<div style="font-family:'Playfair Display',serif;font-size:40px;line-height:1.2">…in a trade that also<br><b>bought human beings.</b></div>`, b('in a trade that'), { x: 110, y: 760, w: 760, bg: '#F1EEE6', sfx: false })}`, { bg: 'none', enter: 'wipeR', drift: 0.03 });
  fx(p, 'ship.wav', b('european ships'), -20);
  // 7 — the first inflation: too many shells
  let rs = 11; const R = () => ((rs = (rs * 9301 + 49297) % 233280) / 233280);
  const fall0 = b('so many cheaper'), shells = Array.from({ length: 46 }, (_, i) => { const id = p.id_('cw'), x = 1000 + R() * 820, y = 620 + R() * 330, at = fall0 + i * 0.07, rot = R() * 360;
    p.tl.push(`tl.fromTo("#${id}", {y:-1100, rotation:${r3(rot - 90)}, opacity:1}, {y:0, rotation:${r3(rot)}, opacity:1, duration:0.7, ease:"power2.in"}, ${r3(at)});`);
    return `<div id="${id}" style="position:absolute;left:${r3(x)}px;top:${r3(y)}px;width:70px;opacity:0">${(fs.existsSync('/home/user/gcp/ed4/media/stickers_cut/cowrie.png') ? `<img src="${p.asset('/home/user/gcp/ed4/media/stickers_cut/cowrie.png')}" style="width:70px">` : '') || ''}</div>`; });
  const shellHtml = fs.existsSync('/home/user/gcp/ed4/media/stickers_cut/cowrie.png') ? shells.join('') : shells.map((h) => h.replace('</div>', '') + `${art(p, 'cowrie', null, { abs: false, w: 70, sfx: null })}</div>`).join('');
  p.ev(fall0 + 1.5); p.ev(fall0 + 3);
  p.scene(t7, t8, `${head(p, 'SECOND HALF OF THE 1800s', t7 + 0.1, 'Cheaper shells from *East Africa.*', t7 + 0.2, { size: 80, w: 900 })}
    ${art(p, 'sack-pour', b('merchants shipped in'), { x: 1300, y: 130, w: 420, rot: -4, life: 'jiggle', until: t8, sfx: null })}${shellHtml}
    ${p.chip('the cowrie lost most of its value', b('lost most of its'), { kind: 'chip red', x: 150, y: 420 })}
    ${card(p, `${mono('INFLATION, 1800s EDITION')}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:58px;line-height:1.1;margin-top:10px">Too many shells,<br><span style="color:var(--red)">too few goods.</span></div>`, b('too many shells'), { x: 150, y: 560, w: 780 })}
    ${p.stamp('THE FIRST INFLATION', b('the first inflation'), { x: 640, y: 870, rot: -4, size: 40 })}`, { enter: 'wipeL' });
  fx(p, 'shells-pour.wav', fall0, -10); fx(p, 'shells-pour.wav', fall0 + 3.6, -14);
  // 8 — shells → shillings: the West African Currency Board in London
  const WB = [-18, 2, 16, 16], P2 = M.projection(WB, 1100, 620);
  const four = [['Gambia', b('and the gambia')], ['Sierra Leone', b('sierra leone')], ['Ghana', b('the gold coast')], ['Nigeria', b('for nigeria')]];
  const fills = four.map(([n, at]) => { const id = p.id_('cf'); p.tl.push(`tl.fromTo("#${id}", {opacity:0}, {opacity:1, duration:0.35, ease:"power1.out"}, ${r3(at)});`); p.ev(at); fx(p, 'pin.wav', at, -18);
    return `<path id="${id}" d="${M.countryPath(P2, n)}" fill="#A4241B" opacity="0" stroke="#1A1612" stroke-width="2"/>`; }).join('');
  p.scene(t8, t9, `${head(p, 'COLONIAL MONEY', t8 + 0.1, 'Shells out. *Shillings in.*', t8 + 0.2, { size: 92, w: 800 })}
    <div style="position:absolute;left:720px;top:230px;width:1100px;height:620px;border:4px solid var(--ink);box-shadow:10px 12px 0 var(--ink);background:#EFE4C8"><svg width="1100" height="620"><path d="${M.landPath(P2, WB, 50)}" fill="#E3D3AE" stroke="#B9AD8E" stroke-width="1.5"/>${fills}</svg></div>
    ${p.chip('1912 · West African Currency Board', b('from nineteen twelve'), { kind: 'chip gold', x: 150, y: 420 })}
    ${p.chip('one currency, four colonies', b('issued one currency'), { kind: 'chip light', x: 150, y: 512 })}
    ${p.stamp('LONDON', b('sitting in london'), { x: 250, y: 640, rot: -8, size: 64 })}
    ${p.chip('reserves held in London', b('backed by reserves'), { kind: 'chip light', x: 150, y: 780 })}
    ${card(p, `<div style="font-family:'Playfair Display',serif;font-size:36px;line-height:1.2">Only as free as <b style="color:var(--red)">London allowed.</b></div>`, b('only as free as'), { x: 930, y: 860, w: 640 })}`, { enter: 'push' });
  // 9 — the Ghana pound, 14 July 1958; still £sd until Nkrumah counts in tens
  p.scene(t9, s.dur, `${head(p, '14 JULY 1958', t9 + 0.1, 'Our own notes at last: *the Ghana pound.*', b('the new bank of ghana') - 0.2, { size: 74, w: 940 })}
    ${oldNote(p, 'pound1-1958', b('issued the ghana pound'), '£G1 · Ghana pound, 1958', { x: 1100, y: 150, w: 680, rot: 3 })}
    ${p.chip('16 months after independence', b('sixteen months after'), { kind: 'chip light', x: 150, y: 420 })}
    ${stack(p, [['…but still £ · s · d', b('but still pounds'), 'chip red'], ['Nkrumah: a free country should count in tens', b('until nkrumah decided'), 'chip gold']], { y: 512 })}
    <div style="position:absolute;left:1240px;top:640px;font-family:'Playfair Display',serif;font-weight:900;font-size:260px;line-height:1;color:var(--red)">${p.words(p.id_('ten'), '10', b('count in tens') - 0.05)}</div>
    ${timeline(p, [['1912', 'Currency Board', b('backed by reserves')], ['14 JUL 1958', 'Ghana pound', b('issued the ghana pound')], ['1965', 'count in tens', b('count in tens')]], { t0: t9 + 0.3, x0: 150, x1: 1100 })}`, { enter: 'wipeU' });
  fx(p, SFX1 + '/bell.wav', b('count in tens'), -14);
  return p;
}

// ---------------------------------------------------------------------------
// THE WIRE — Monday 19 July 1965, Accra: grey rain-season light, Special Elite dateline; the cedi is born; the US takes
// silver out of its coins the same week; then the cedi's changes, notes slapped onto the table.
export function wire() {
  const [p, c, s] = make('wire');
  const b = (...q) => cs(c, ...q);
  const t2 = b('ghanaians queued') - 0.1, t3 = b('one cedi was worth') - 0.1, t4 = b('in the silent film') - 0.1, t5 = b('four days after') - 0.1, t6 = b('nkrumahs cedi lived') - 0.1;
  // 1 — dateline in the rain
  p.scene(0, t2, `${GREY}${rain(p, 0, t2 + 0.6, { seed: 3 })}
    ${card(p, `<div class="elite" style="font-size:54px;line-height:1.2">${p.typed('MONDAY, 19 JULY 1965 · ACCRA', 0.2, { cps: 20, cls: 'elite' })}</div>`, 0.05, { x: 150, y: 150, w: 1180 })}
    ${stack(p, [['the cool, grey middle of the rainy season', b('in the cool grey'), 'chip light'], ['Accra wakes under low cloud', b('when accra wakes'), 'chip light'], ['the gutters still hold the night’s rain', b('the open gutters'), 'chip light']], { y: 470 })}`, { bg: 'none', enter: 'cut', drift: 0.03 });
  fx(p, 'rain.wav', 0, -16, Math.min(12, t2 + 0.6)); fx(p, '/home/user/gcp/project/media/sfx/teletype-1.mp3', 0.2, -18);
  // 2 — queues for a new money: the cedi (named after the cowrie), 100 pesewas
  p.scene(t2, t3, `${GREY}${rain(p, t2, t3 + 0.6, { seed: 7, n: 40 })}
    ${card(p, `${mono('GHANAIANS QUEUED')}${H(p, 'Pound notes in hand, *to meet a new money.*', t2 + 0.2, 58)}`, t2 + 0.1, { x: 150, y: 130, w: 980 })}
    ${art(p, 'cowrie', b('named after the sedie'), { x: 260, y: 560, w: 200, rot: -12, life: 'pulse', until: t3, sfx: 'shell-set.wav', db: -10 })}
    <div style="position:absolute;left:520px;top:600px;font-family:'Playfair Display',serif;font-weight:900;font-size:150px;line-height:1;color:#FCF5E8;text-shadow:6px 6px 0 #1A1612">${p.words(p.id_('ar'), '→ cedi', b('named after the sedie') + 0.4)}</div>
    ${p.chip('= 100 pesewas, the old gold weight', b('divided into a hundred'), { kind: 'chip gold', x: 1060, y: 820 })}
    ${art(p, 'pesewa', b('the old gold weight'), { x: 1580, y: 560, w: 200, rot: 8, life: 'pulse', until: t3, sfx: SFX1 + '/coins.wav', db: -14 })}`, { bg: 'none', enter: 'wipeL', drift: 0.03 });
  // 3 — the rate; one face on every note
  p.scene(t3, t4, `${factCard(p, 'THE RATE, 1965', '¢1 = 8s 4d', t3 + 0.1, { x: 150, y: 170, w: 780, size: 110, sub: '£G1 = ¢2.40' })}
    ${oldNote(p, 'cedi1-1965', b('and on the front'), '¢1 · 1965 · Kwame Nkrumah', { x: 1040, y: 160, w: 740, rot: -2 })}
    ${p.stamp('ONE FACE', b('one face'), { x: 1300, y: 720, rot: -7, size: 70 })}
    ${nameCard(p, b('kwame nkrumahs'), { y: 760, role: 'THE PRESIDENT', name: 'Kwame Nkrumah' })}`, { enter: 'push' });
  fx(p, 'register.wav', t3 + 0.6, -16);
  // 4 — held up to the light
  const held = realImg('cedi1-1965') || realImg('pound1-1958');
  p.scene(t4, t5, `${GREY}${held ? backlit(p, held, t4 + 0.2, { x: 900, y: 160, w: 860, rot: -4 }) : ''}
    ${card(p, `${mono('IN THE SILENT FILM')}${H(p, 'People hold the new notes *up to the light…*', t4 + 0.2, 54)}`, t4 + 0.1, { x: 120, y: 150, w: 720 })}
    ${card(p, `<div style="font-family:'Playfair Display',serif;font-style:italic;font-size:52px;line-height:1.15">…as if checking whether <b style="color:var(--red);font-style:normal">freedom had a watermark.</b></div>`, b('as if checking'), { x: 120, y: 700, w: 1100 })}`, { bg: 'none', enter: 'iris', drift: 0.04 });
  fx(p, '/home/user/gcp/project/media/sfx/syn-tick.wav', t4 + 0.2, -24);
  // 5 — the world that week: Washington takes the silver out
  const lbj = realImg('lbj');
  p.scene(t5, t6, `${card(p, `${mono('THE WORLD THAT WEEK')}<div class="elite" style="font-size:46px;margin-top:10px">23 July 1965, Washington.</div>`, t5 + 0.1, { x: 150, y: 140, w: 900 })}
    ${lbj ? p.print(lbj, b('president lyndon johnson'), { x: 1180, y: 120, w: 520, rot: 2, caption: 'President Lyndon B. Johnson' }) : nameCard(p, b('president lyndon johnson'), { x: 1150, y: 160, role: 'WASHINGTON', name: 'President Lyndon B. Johnson' })}
    ${art(p, 'us-coins', b('dimes and quarters'), { x: 1250, y: 560, w: 380, rot: -6, life: 'bob', until: t6, sfx: SFX1 + '/coins.wav', db: -12 })}
    ${p.chip('silver out of dimes and quarters', b('taking the silver'), { kind: 'chip light', x: 150, y: 400 })}
    ${p.chip('the silver was worth more than the coin', b('because the silver'), { kind: 'chip gold', x: 150, y: 490 })}
    ${card(p, `${mono('TWO COUNTRIES, ONE WEEK')}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:64px;line-height:1.05;margin-top:8px">Money is a <span style="color:var(--red)">promise,</span><br>not a metal.</div>`, b('two countries in one'), { x: 150, y: 620, w: 900 })}`, { enter: 'wipeU' });
  // 6 — the cedi's changes, slapped onto the table one by one
  const z0 = b('four zeros were cut');
  const zid = p.id_('zz'); p.grow(zid, b('ten thousand old') - 0.1, { preset: 'heavy', from: 0.6, dy: 30 }); fx(p, 'thump.wav', b('ten thousand old'), -12);
  p.tl.push(`tl.to("#${zid} .z", {y:-260, x:(i)=>80*i-120, rotation:(i)=>i%2?40:-40, opacity:0, duration:0.9, ease:"power2.in", stagger:0.12, immediateRender:false}, ${r3(z0 + 0.4)});`); p.ev(z0 + 0.4);
  const brick = [0, 1, 2, 3, 4].map((i) => oldNote(p, 'cedi20000-2002', i === 4 ? b('twenty thousand cedis') : null, '¢20,000', { x: 1330 + i * 6, y: 150 - i * 8, w: 420, rot: -3 + i })).join('');
  p.scene(t6, s.dur, `${TABLE()}
    ${card(p, `${mono('NKRUMAH’S CEDI')}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:60px;line-height:1">lived ${counter(p, b('lived nineteen months'), 19, { size: 60, suffix: ' months' })}</div>`, t6 + 0.1, { x: 110, y: 90, w: 600 })}
    ${oldNote(p, 'cedi1-1967', b('issued a new cedi'), 'New cedi · 1967', { x: 110, y: 330, w: 440, rot: -6 })}
    ${p.stamp('NKRUMAH’S FACE REMOVED', b('with nkrumahs face'), { x: 110, y: 600, rot: -6, size: 30 })}
    ${oldNote(p, 'cedi10-1979', b('on the ninth of march'), '¢10 · 1979', { x: 620, y: 300, w: 440, rot: 4 })}
    ${p.stamp('30% KEPT · 50% ABOVE ¢5,000', b('kept thirty percent'), { x: 600, y: 600, rot: 5, size: 28 })}
    ${brick}<div style="position:absolute;left:1350px;top:300px;width:40px;height:220px;background:#B9362C;border-radius:8px;transform:rotate(-2deg)"></div>
    ${p.chip('≈ $2', b('worth about two dollars'), { kind: 'chip gold', x: 1500, y: 470 })}
    <div id="${zid}" style="position:absolute;left:1120px;top:620px;font-family:'Playfair Display',serif;font-weight:900;font-size:96px;color:#FCF5E8;text-shadow:5px 5px 0 #1A1612;white-space:nowrap">¢1<span class="z">0</span><span class="z">,0</span><span class="z">0</span><span class="z">0</span> = GH¢1</div>
    ${timeline(p, [['17 FEB 1967', 'New cedi', b('issued a new cedi')], ['9 MAR 1979', 'notes changed again', b('on the ninth of march')], ['1 JUL 2007', '¢10,000 = GH¢1', b('on the first of july')]], { t0: t6 + 0.3, x0: 110, x1: 1810, y: 960 })}`, { bg: 'none', enter: 'wipeL', drift: 0.02 });
  fx(p, 'snip.wav', z0 + 0.4, -12); fx(p, SFX1 + '/whip.wav', z0 + 0.5, -16);
  return p;
}

// ---------------------------------------------------------------------------
// THE PALAVA DESK — "Switzerland, or the printing press inside the computer". Claim v record (verdict: mostly
// false, a Swiss drop of ink maybe); then the wrong machine: mobile money and keystrokes; 2022; monetary policy as a
// tap over a bucket; the IMF years; the gold scheme's bill with both sides on the record.
export function palava() {
  const [p, c, s] = make('palava');
  const b = (...q) => cs(c, ...q);
  const T = [b('the bank of ghana does not'), b('for years the main'), b('notes of twenty nineteen'), b('for the new notes'), b('but chale that question'),
    b('in twenty twenty-two it lent'), b('if you asked'), b('monetary policy plainly'), b('after twenty twenty-two that'), b('and the bill i promised')].map((t) => t - 0.1);
  // 1 — claim v record
  p.scene(0, T[0], `${head(p, 'THE PALAVA YOUR UNCLE STARTED', 0.1, 'Is the cedi printed in *Switzerland?*', 0.25, { size: 92, w: 1300 })}
    ${card(p, `${mono('CLAIM', { color: 'var(--ink)' })}`, 0.6, { x: 150, y: 420, w: 760, pad: '20px 30px' })}${sticky(p, 0.9, { x: 330, y: 530, w: 400, rot: -4, size: 60 })}
    ${card(p, `${mono('RECORD', { color: 'var(--ink)' })}<div class="mono" style="font-size:34px;margin-top:20px;line-height:1.5">${p.typed('Here is the record…', b('here is the record'), { cps: 20 })}</div>`, b('here is the record') - 0.2, { x: 1010, y: 420, w: 760, pad: '20px 30px' })}`, { enter: 'cut' });
  // 2 — not printed at home; fewer than 20 printers
  p.scene(T[0], T[1], `${head(p, 'THE BANK OF GHANA', T[0] + 0.1, 'Does not print its notes *at home.*', T[0] + 0.2, { size: 80, w: 1000 })}
    ${art(p, 'printer', b('it buys them'), { x: 1380, y: 150, w: 360, rot: 4, life: 'jiggle', until: T[1], sfx: '/home/user/gcp/project/media/sfx/press-1.mp3', db: -16 })}
    ${factCard(p, 'BANKNOTE PRINTERS IN THE WORLD', `fewer than ${counter(p, b('fewer than twenty'), 20, { size: 120 })}`, b('fewer than twenty') - 0.2, { x: 150, y: 430, w: 900, size: 100, sub: 'Bank of Ghana, Oct 2025' })}
    ${nameCard(p, b('dominic owusu'), { x: 1110, y: 640, role: 'BANK OF GHANA · CURRENCY', name: 'Dominic Owusu' })}`, { enter: 'wipeL' });
  // 3 — De La Rue (Britain), Germany and France
  p.scene(T[1], T[2], `${head(p, 'FOR YEARS', T[1] + 0.1, 'The main printer: *De La Rue, in Britain.*', T[1] + 0.2, { size: 78, w: 1200 })}
    ${stack(p, [['De La Rue · Britain', b('de la rue'), 'chip red'], ['firms in Germany', b('in germany and'), 'chip light'], ['…and France', b('and france'), 'chip light']], { y: 430 })}
    ${nameCard(p, b('emmanuel asiedu-mante', 'a former deputy'), { x: 900, y: 600, role: 'FORMER DEPUTY GOVERNOR', name: 'Emmanuel Asiedu-Mante' })}`, { enter: 'push' });
  // 4 — Crane Currency beat five rivals (a Swiss one among them)
  const CO = ['De La Rue', 'G&amp;D', 'Canadian Bank Note', 'Oberthur Fiduciaire', 'Orell Füssli · Zurich', 'CRANE CURRENCY'];
  const struck = b('which beat five rivals');
  const rows = CO.map((n, i) => { const id = p.id_('co'), ln = p.id_('ln'), at = b('notes of twenty nineteen') + 0.5 + i * 0.35;
    p.tl.push(`tl.fromTo("#${id}", {xPercent:-110}, {xPercent:0, duration:${SP.default}, ease:"sp-default"}, ${r3(at)});`); p.ev(at);
    if (i < 5) { p.tl.push(`tl.fromTo("#${ln}", {scaleX:0}, {scaleX:1, duration:0.3, ease:"power2.out"}, ${r3(struck + 0.2 + i * 0.22)});`); fx(p, 'snip.wav', struck + 0.2 + i * 0.22, -20); }
    return `<div style="overflow:hidden;padding:4px 0"><div id="${id}" style="position:relative;display:inline-block;font-family:'Playfair Display',serif;font-weight:${i === 5 ? 900 : 700};font-size:${i === 5 ? 64 : 46}px;color:${i === 5 ? 'var(--red)' : 'var(--ink)'}">${n}${i < 5 ? `<div id="${ln}" style="position:absolute;left:-6px;right:-6px;top:52%;height:6px;background:var(--red);transform-origin:0 50%;transform:scaleX(0)"></div>` : ''}</div></div>`; }).join('');
  p.scene(T[2], T[3], `${head(p, 'GH¢100 + GH¢200 (2019) · GH¢5 (60th)', T[2] + 0.1, 'Printed by *Crane Currency*, USA.', b('were printed by') - 0.2, { size: 76, w: 1100 })}
    <div style="position:absolute;left:150px;top:400px">${rows}</div>
    ${p.stamp('A SWISS ONE — BEATEN', b('a swiss one'), { x: 1050, y: 640, rot: -6, size: 40 })}
    ${p.chip('beat five rivals', struck, { kind: 'chip gold', x: 1100, y: 450 })}`, { enter: 'wipeU' });
  // 5 — the new notes' printer not named; SICPA ink; verdict
  const SW = [5.8, 45.7, 10.6, 47.9], P3 = M.projection(SW, 520, 300), [lx, ly] = P3([6.63, 46.52]);
  p.scene(T[3], T[4], `<div class="hl" style="left:150px;top:150px;width:1000px">${p.kicker('THE NEW NOTES', T[3] + 0.1)}<h1 style="font-size:70px">${p.words(p.id_('nn'), 'Printer: *not publicly named.*', T[3] + 0.2)}</h1></div>
    ${art(p, 'ink-drop', b('is the ink'), { x: 160, y: 470, w: 230, rot: -6, life: 'bob', until: T[4], sfx: 'drip.wav', db: -10 })}
    ${card(p, `<svg width="520" height="300"><path d="${M.countryPath(P3, 'Switzerland', 50)}" fill="#E3D3AE" stroke="#1A1612" stroke-width="3"/><circle cx="${lx}" cy="${ly}" r="10" fill="#A4241B" stroke="#1A1612" stroke-width="3"/><text x="${lx + 16}" y="${ly + 8}" font-family="Special Elite, monospace" font-size="24">Lausanne · SICPA</text></svg>`, b('one swiss company'), { x: 450, y: 430, w: 580, pad: '14px' })}
    ${p.chip('security inks on most of the world’s banknotes', b('supplies the security'), { kind: 'chip light', x: 150, y: 790 })}
    ${p.chip('ours? not public', b('though whether that'), { kind: 'chip gold', x: 150, y: 880 })}
    ${card(p, `${mono('CLAIM: “PRINTED IN SWITZERLAND”', { color: 'var(--ink)' })}${sticky(p, null, { x: 120, y: 70, w: 340, rot: -4, size: 52 }).replace('position:absolute;', 'position:relative;margin-top:16px;')}`, T[3] + 0.4, { x: 1130, y: 150, w: 640, pad: '24px 30px' })}
    ${p.stamp('MOSTLY FALSE', b('no public record'), { x: 1180, y: 560, rot: -9, size: 82 })}
    <div class="hand" style="position:absolute;left:1240px;top:690px;font-size:44px;color:var(--red);transform:rotate(-6deg)">${p.typed('(a Swiss drop of ink, maybe)', b('is the ink') + 0.3, { cps: 18, cls: 'hand', sfx: false })}</div>`, { enter: 'iris' });
  fx(p, '/home/user/gcp/project/media/sfx/stamp-2.mp3', b('no public record'), -8);
  // 6 — the wrong machine: mobile money and keystrokes
  p.scene(T[4], T[5], `${head(p, 'THE WRONG MACHINE', T[4] + 0.1, 'Most cedis are *never printed at all.*', b('most cedis are') - 0.1, { size: 82, w: 1000 })}
    ${art(p, 'momo-phone', b('on mobile money'), { x: 1180, y: 150, w: 300, rot: -5, life: 'bob', until: T[5], sfx: SFX + '/blip.wav', db: -10 })}
    ${art(p, 'keypress', b('whenever the bank'), { x: 1480, y: 430, w: 320, rot: 3, life: 'pulse', until: T[5], sfx: SFX + '/key.wav', db: -8 })}
    ${factCard(p, 'MOVED ON MOBILE MONEY, 2025', `GH¢${counter(p, b('four point five four'), 454, { size: 100, suffix: '' }).replace(/>(\d)(\d\d)</g, '>$1.$2<')} trillion`, b('four point five four') - 0.2, { x: 150, y: 430, w: 900, size: 80 })}
    ${p.chip('new money is created whenever the Bank lends', b('and new money is'), { kind: 'chip red', x: 150, y: 760 })}`, { enter: 'wipeL' });
  // 7 — 2022: the overdraft, the fall, 54.1%, a third of a note cut away, default
  const cut = p.id_('ct'), sc = b('so a hundred cedis');
  p.tl.push(`tl.fromTo("#${cut}", {clipPath:"inset(0% 0% 0% 0%)"}, {clipPath:"inset(0% 35% 0% 0%)", duration:1.8, ease:"power1.inOut"}, ${r3(sc + 0.2)});`); p.ev(sc + 0.2);
  p.scene(T[5], T[6], `${factCard(p, 'BoG OVERDRAFT TO GOVERNMENT, 2022', '≈ 7.2% <span style="font-size:44px">of GDP</span>', T[5] + 0.2, { x: 150, y: 130, w: 760, size: 96, sub: 'IMF · created with keystrokes' })}
    ${stack(p, [['the cedi lost ≈ 30% against the dollar', b('that year the cedi'), 'chip light'], ['inflation: 54.1% in December', b('inflation reached'), 'chip red']], { y: 480 })}
    <div style="position:absolute;left:1010px;top:150px;width:780px;height:360px"><div id="${cut}" style="position:relative;width:780px;height:360px">${bill(p, note('100'), b('so a hundred cedis') - 0.3, { x: 0, y: 0, w: 760, rot: 0 })}</div></div>
    ${art(p, 'scissors', sc, { x: 1500, y: 470, w: 220, rot: -20, life: 'jiggle', until: sc + 2.4, sfx: SFX + '/snip.wav', db: -10 })}
    ${p.chip('GH¢100 bought what GH¢65 had bought', b('bought what sixty-five'), { kind: 'chip gold', x: 1010, y: 560 })}
    ${p.stamp('19 DEC 2022 · MOST FOREIGN DEBT PAYMENTS STOPPED', b('on the nineteenth of december'), { x: 160, y: 730, rot: -3, size: 34 })}`, { enter: 'push' });
  for (let k = 0; k < 4; k++) fx(p, SFX + '/snip.wav', sc + 0.3 + k * 0.4, -14);
  // 8 — how machay be the plantain?
  p.scene(T[6], T[7], `${art(p, 'plantain', T[6] + 0.1, { x: 1150, y: 200, w: 520, rot: 6, life: 'sway', until: T[7], sfx: SFX1 + '/pop-3.wav' })}
    ${card(p, `<div style="font-family:'GCP Round',sans-serif;font-weight:700;font-size:64px;line-height:1.1">“How machay be<br>the plantain?”</div>`, b('how machay'), { x: 150, y: 200, w: 820, rot: -2 })}
    ${card(p, `<div style="font-family:'Playfair Display',serif;font-size:52px;line-height:1.15">…and flinched? You had met <b style="color:var(--red)">monetary policy.</b></div>`, b('and flinched'), { x: 150, y: 560, w: 900 })}`, { enter: 'wipeU' });
  fx(p, SFX1 + '/murmur.wav', b('how machay'), -20);
  // 9 — the tap and the bucket: the policy rate sets the price of money
  const flow = p.id_('fw'), lvl = p.id_('lv'), raise = b('raise it and'), cutT = b('cut it and');
  p.tl.push(`tl.fromTo("#${flow}", {scaleX:1}, {scaleX:0.25, duration:${SP.heavy}, ease:"sp-heavy"}, ${r3(raise)});`); p.tl.push(`tl.to("#${flow}", {scaleX:1.4, duration:${SP.heavy}, ease:"sp-heavy", immediateRender:false}, ${r3(cutT)});`);
  p.tl.push(`tl.fromTo("#${lvl}", {scaleY:1}, {scaleY:0.55, duration:1.6, ease:"power1.inOut"}, ${r3(b('prices calm down') - 0.2)});`);
  [raise, cutT].forEach((t) => p.ev(t)); fx(p, 'squeak.wav', raise, -12); fx(p, 'squeak.wav', cutT, -12); fx(p, '/home/user/gcp/project/media/sfx/syn-splash.wav', cutT + 0.3, -22);
  p.scene(T[7], T[8], `${head(p, 'MONETARY POLICY, PLAINLY', T[7] + 0.1, 'The Bank of Ghana sets *the price of money.*', T[7] + 0.2, { size: 70, w: 960 })}
    <div style="position:absolute;left:1180px;top:110px">${art(p, 'tap', T[7] + 0.6, { abs: false, w: 380, life: 'bob', until: T[8] })}</div>
    <div class="mono" style="position:absolute;left:1210px;top:120px;font-size:24px;font-weight:700;background:#FCF5E8;border:3px solid var(--ink);padding:4px 12px">POLICY RATE</div>
    <div id="${flow}" style="position:absolute;left:1468px;top:300px;width:26px;height:330px;background:linear-gradient(#7FB2E0,#5F87B8);border-radius:10px;transform-origin:50% 0"></div>
    <div style="position:absolute;left:1300px;top:560px;width:380px;height:340px">${art(p, 'bucket', T[7] + 0.8, { abs: false, w: 380, life: 'bob', until: T[8], sfx: null })}<div id="${lvl}" style="position:absolute;left:70px;right:70px;bottom:44px;height:150px;background:rgba(164,36,27,.55);transform-origin:50% 100%"></div><div class="mono" style="position:absolute;left:130px;top:190px;font-size:28px;font-weight:700;color:#FCF5E8">PRICES</div></div>
    ${stack(p, [['what banks pay to borrow from it', b('is what banks pay'), 'chip light'], ['raise it → loans cost more, spending slows', raise, 'chip red'], ['…and prices calm down', b('prices calm down'), 'chip light'], ['cut it → money gets cheaper', cutT, 'chip gold']], { y: 420 })}`, { enter: 'wipeL' });
  // 10 — the IMF years to today
  p.scene(T[8], T[9], `${head(p, 'AFTER 2022', T[8] + 0.1, 'From *30%* to *11%.*', T[8] + 0.2, { size: 100, w: 1000 })}
    ${factCard(p, 'IMF PROGRAMME', '$3 billion', b('the imf lent'), { x: 1150, y: 150, w: 620, size: 96, sub: 'completed 27 July 2026' })}
    ${factCard(p, 'INFLATION, OCT 2026', '5.5%', b('inflation fell to'), { x: 150, y: 400, w: 560, size: 110 })}
    ${factCard(p, 'POLICY RATE, 18 NOV 2026', '14% → 11%', b('on the eighteenth of november'), { x: 780, y: 470, w: 700, size: 96 })}
    ${timeline(p, [['2023', 'rate 30%', b('climbed to thirty')], ['27 JUL 2026', 'IMF programme complete', b('ghana completed on')], ['OCT 2026', 'inflation 5.5%', b('inflation fell to')], ['18 NOV 2026', 'rate cut to 11%', b('on the eighteenth of november')]], { t0: T[8] + 0.3 })}`, { enter: 'push' });
  // 11 — the bill from Edition 2: both sides on the record
  p.scene(T[9], s.dur, `${head(p, 'THE BILL FROM EDITION 2', T[9] + 0.1, 'The gold-purchase programme.', T[9] + 0.2, { size: 72, w: 1100 })}
    ${p.chip('See Edition 2', T[9] + 0.5, { kind: 'chip red', x: 1430, y: 150 })}
    ${split(p, b('the imf says'), ['THE IMF', 'Lost <b>more than $1.7 billion</b> in 2025 — while also crediting it with <b>strengthening the reserves.</b>'], ['BANK OF GHANA · GoldBod', 'Have <b>defended the programme</b> and <b>disputed</b> how its losses were described.'], { atB: b('the bank of ghana and goldbod'), y: 330, h: 420 })}
    ${p.stamp('BOTH ON THE RECORD', b('we print both'), { x: 640, y: 800, rot: -4, size: 56 })}
    ${st1(p, 'scales-balance', b('and you weigh them'), { x: 1500, y: 720, w: 260, rot: 0, life: 'sway', until: s.dur })}`, { enter: 'wipeU' });
  return p;
}

// ---------------------------------------------------------------------------
// THEN v NOW — one face then (1965), eight faces now: the Heritage Series lands note by note, in full colour; the
// portrait palava (no verdict); the money in your pocket; the classified: Ghana decimal six years before Britain.
export function thennow() {
  const [p, c, s] = make('thennow');
  const b = (...q) => cs(c, ...q);
  const ORDER = [['1', b('agnes tagoe-quarcoopome', 'agnes'), 'Agnes Tagoe-Quarcoopome', 'remembered as the first Makola trader to open a bank account', b('remembered as the first')],
    ['2', b('cardinal peter'), 'Cardinal Peter Porekuu Dery', '', 0], ['5', b('kwegyir aggrey', 'aggrey on the five'), 'Kwegyir Aggrey', '', 0],
    ['10', b('justice annie'), 'Justice Annie Jiagge', '', 0], ['20', b('the composer ephraim'), 'Ephraim Amu', 'the composer · one of the two men our Amo, The Discerning, is named after', b('the second of the two')],
    ['50', b('theodosia okoh who'), 'Theodosia Okoh', 'who designed our flag', b('who designed our flag')], ['100', b('kofi annan on'), 'Kofi Annan', '', 0],
    ['200', b('and on the two hundred'), 'Kwame Nkrumah', 'the face the soldiers removed in 1967', b('the face the soldiers')]];
  const t1 = ORDER[0][1] - 0.15, tc = b('the notes stay on cotton') - 0.1, tp = b('the palava came') - 0.1, tm = b('and the money in your own') - 0.1, tk = b('and here is the item') - 0.1;
  // 1 — then / now split
  p.scene(0, t1, `<div style="position:absolute;left:0;top:0;width:960px;height:1080px;background:#E9DFC6"></div>
    <div class="hl" style="left:110px;top:110px;width:760px">${p.kicker('THEN · 1965', 0.1)}<h1 style="font-size:72px">${p.words(p.id_('th'), 'One face *on every note.*', 0.2)}</h1></div>
    ${oldNote(p, 'cedi1-1965', 0.5, '¢1 · 1965 · Kwame Nkrumah', { x: 110, y: 430, w: 740, rot: -2 })}
    <div class="hl" style="left:1050px;top:110px;width:760px">${p.kicker('NOW · THU 12 NOV 2026', b('now on thursday'))}<h1 style="font-size:72px">${p.words(p.id_('nw'), 'Eight notes, *eight faces.*', b('eight notes eight'))}</h1></div>
    ${bill(p, note('200'), b('now on thursday') + 0.3, { x: 1050, y: 430, w: 760, rot: 2 })}
    ${p.chip('Bank Square, Accra', b('at bank square'), { kind: 'chip light', x: 1050, y: 820 })}
    ${p.chip('President Mahama launches the Heritage Series', b('president mahama'), { kind: 'chip red', x: 1050, y: 910 })}`, { enter: 'cut' });
  fx(p, SFX1 + '/bell.wav', b('eight notes eight'), -14);
  // 2..9 — each note lands as it is named, big and in full colour, with its name card; then slides to the stack
  ORDER.forEach(([k, at, name, sub, subAt], i) => {
    const end = i + 1 < ORDER.length ? ORDER[i + 1][1] - 0.15 : tc;
    const last = k === '200';
    p.scene(at - 0.15, end, `<div style="position:absolute;left:0;right:0;top:110px;text-align:center">${p.kicker(`GH¢${k} · THE HERITAGE SERIES`, at)}</div>
      ${bill(p, note(k), at - 0.05, { x: last ? 340 : 390, y: 190, w: last ? 1240 : 1140, rot: i % 2 ? 1.2 : -1.2, from: i % 2 ? 'right' : 'left' })}
      ${nameCard(p, at + 0.35, { x: 110, y: last ? 760 : 740, role: `GH¢${k}`, name })}
      ${sub ? p.chip(sub, subAt || at + 0.8, { kind: last ? 'chip red' : 'chip gold', x: last ? 1000 : 900, y: last ? 800 : 860 }) : ''}
      ${last ? p.stamp('THE ONLY ONE OF THE BIG SIX LEFT', b('now the only one'), { x: 820, y: 900, rot: -4, size: 42 }) : ''}`, { enter: ['wipeL', 'push', 'wipeU', 'wipeR'][i % 4], drift: 0.03 });
    fx(p, SFX1 + '/whip.wav', at - 0.1, -16);
  });
  // 10 — all eight on the page; cotton, smaller, for sight loss; circulation date
  const fan = ['1', '2', '5', '10', '20', '50', '100', '200'].map((k, i) => bill(p, note(k), tc + 0.1 + i * 0.12, { x: 110 + (i % 4) * 440, y: 150 + Math.floor(i / 4) * 230, w: 420, rot: (i % 2 ? 2 : -2), sfx: i % 2 === 0 })).join('');
  p.scene(tc, tp, `${fan}
    <div style="position:absolute;left:110px;top:640px;display:flex;gap:16px;flex-wrap:wrap;width:1700px">${p.chip('cotton, not plastic — because of our heat', b('the notes stay on cotton'), { kind: 'chip light' })}${p.chip('smaller', b('they are smaller'), { kind: 'chip light' })}${p.chip('features for people with sight loss', b('they carry features'), { kind: 'chip gold' })}</div>
    ${card(p, `${mono('ENTERS CIRCULATION')}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:54px;margin-top:6px">1 December 2026</div><div class="mono" style="font-size:24px;font-weight:700">old notes stay legal tender</div>`, b('and from the first'), { x: 110, y: 800, w: 760 })}`, { enter: 'wipeU', drift: 0.02 });
  // 11 — the portrait palava: two equal cards, no verdict
  p.scene(tp, tm, `${head(p, 'THE PALAVA CAME WITHIN A DAY', tp + 0.1, 'Whose face is on the fifty?', tp + 0.2, { size: 76, w: 1100 })}
    ${bill(p, note('50'), tp + 0.4, { x: 1250, y: 110, w: 560, rot: 3 })}
    ${split(p, b('theodosia okohs nephew'), ['HER NEPHEW SAID', 'The face looks more like her sister, <b>Dr Letitia Obeng.</b>'], ['THE BANK REPLIED · 13 NOV', 'The portrait was built from <b>photographs of Theodosia Okoh herself.</b>'], { atB: b('the bank replied'), y: 420 })}
    ${p.chip('the Minority: what did it all cost?', b('and the minority'), { kind: 'chip light', x: 150, y: 930 })}
    ${p.stamp('NO VERDICT', b('what the whole exercise'), { x: 1300, y: 900, rot: -6, size: 54 })}`, { enter: 'push' });
  // 12 — the money in your own pocket
  const jar = p.id_('jr'); p.tl.push(`tl.fromTo("#${jar}", {scale:1}, {scale:0.7, duration:2.4, ease:"power1.inOut"}, ${r3(b('quietly shrinking') - 0.6)});`); p.ev(b('quietly shrinking'));
  const bar = (lbl, pct, col, at) => { const id = p.id_('br'); p.tl.push(`tl.fromTo("#${id}", {scaleX:0}, {scaleX:1, duration:${SP.heavy}, ease:"sp-heavy"}, ${r3(at)});`); p.ev(at);
    return `<div style="margin:18px 0"><div class="mono" style="font-size:24px;font-weight:700">${lbl}</div><div style="display:flex;align-items:center;gap:16px"><div id="${id}" style="height:54px;width:${pct * 120}px;background:${col};border:4px solid var(--ink);transform-origin:0 50%"></div><b style="font-family:'Playfair Display',serif;font-size:52px">${pct}%</b></div></div>`; };
  p.scene(tm, tk, `${head(p, 'AND THE MONEY IN YOUR POCKET?', tm + 0.1, 'Easier to move. *No easier to keep.*', b('it has never been') - 0.1, { size: 76, w: 1200 })}
    ${art(p, 'momo-phone', b('easier to move'), { x: 1500, y: 140, w: 240, rot: 6, life: 'bob', until: tk, sfx: SFX + '/blip.wav' })}
    <div style="position:absolute;left:150px;top:420px">${bar('91-day treasury bill', 4.6, '#C8962F', b('a three-month treasury'))}${bar('inflation, Oct 2026', 5.5, '#A4241B', b('while prices rise'))}</div>
    <div id="${jar}" style="position:absolute;left:1250px;top:470px;transform-origin:50% 100%">${art(p, 'jar', b('so money that sits'), { abs: false, w: 340, life: 'bob', until: tk })}</div>
    ${p.chip('money that sits still is quietly shrinking', b('so money that sits'), { kind: 'chip red', x: 150, y: 800 })}`, { enter: 'wipeL' });
  // 13 — the classified from page one, enlarged: Ghana decimal six years before Britain
  p.scene(tk, s.dur, `<div style="position:absolute;left:110px;top:110px;right:110px;bottom:110px;border:5px dashed var(--ink);background:#FCF5E8"></div>
    <div class="hl" style="left:190px;top:170px;width:1500px">${p.kicker('CLASSIFIED · THE 1%', tk + 0.1)}<h1 style="font-size:84px">${p.words(p.id_('cl'), 'The colony counted in tens *before the empire did.*', tk + 0.25)}</h1></div>
    ${factCard(p, 'GHANA GOES DECIMAL', '19 July 1965', b('ghana dropped pounds'), { x: 190, y: 520, w: 700, size: 80 })}
    ${factCard(p, 'BRITAIN GOES DECIMAL', '15 Feb 1971', b('and britain itself'), { x: 1000, y: 520, w: 700, size: 80 })}
    <div style="position:absolute;left:190px;top:820px;font-family:'Playfair Display',serif;font-weight:900;font-size:64px">almost ${counter(p, b('almost six years'), 6, { size: 64, suffix: ' years' })} first</div>
    ${p.stamp('E NO BE SMALL THING', b('e no be small'), { x: 1100, y: 820, rot: -6, size: 56 })}`, { enter: 'iris' });
  return p;
}

// ---------------------------------------------------------------------------
// THE TEAM ASIDE — back at the Nest: Kwame, The Combative. Hands and the table only; no faces.
export function team() {
  const [p, c, s] = make('team');
  const b = (...q) => cs(c, ...q);
  const t2 = b('so he emptied') - 0.1, t3 = b('when baaba') - 0.1, t4 = b('then i told him') - 0.1, t5 = b('went quiet') - 0.1;
  const N = livingNest(p, 0, t2, { grade: 'evening', truck: 40, seed: 47, start: { scale: 1.1, x: 0, y: 0 } });
  N.aim([900, 560], 1.6, b('the wallet on the shared') - 0.2);
  p.scene(0, t2, `${N.html}
    ${card(p, `${mono('BACK AT THE NEST · LATE AFTERNOON')}${H(p, 'The wallet belongs to… *Kwame.*', b('belongs to kwame') - 0.3, 60)}`, 0.2, { x: 110, y: 120, w: 900 })}
    ${nameCard(p, b('the combative'), { y: 470, role: 'THE COMBATIVE', name: 'Kwame' })}
    ${p.chip('he arrived this morning with a bet', b('with a bet'), { kind: 'chip gold', x: 110, y: 700 })}
    ${p.chip('his uncle: “printed in Switzerland”', b('his uncle had told'), { kind: 'chip light', x: 110, y: 790 })}`, { bg: 'none', enter: 'cut', drift: 0 });
  nestBed(p, 0, t2 + 0.4, -22);
  // held up to the window: watermark, thread — no country
  p.scene(t2, t3, `${GREY.replace('#8C949A', '#C7A46A').replace('#A9AEB0', '#E9C98C').replace('#7E8487', '#B08950')}
    ${art(p, 'window', t2 + 0.1, { x: 1350, y: 120, w: 420, life: 'bob', until: t3, sfx: null })}
    ${backlit(p, note('200'), b('held every note up'), { x: 380, y: 300, w: 900, rot: -3 })}
    ${card(p, `${mono('LOOKING FOR THE WORDS')}<div class="elite" style="font-size:44px;margin-top:6px">“Made in Switzerland”</div>`, b('looking for the words'), { x: 110, y: 110, w: 760 })}
    <div style="position:absolute;left:110px;top:800px;display:flex;gap:16px">${p.chip('✓ a watermark', b('found a watermark'), { kind: 'chip light' })}${p.chip('✓ a security thread', b('a security thread'), { kind: 'chip light' })}</div>
    ${p.stamp('NO COUNTRY AT ALL', b('and no country'), { x: 1150, y: 820, rot: -6, size: 56 })}`, { bg: 'none', enter: 'wipeU', drift: 0.03 });
  // Baaba slides the Crane story across; Kwame clings to the ink — half a point
  const clip = p.id_('cp'); p.tl.push(`tl.fromTo("#${clip}", {x:1500, rotation:12}, {x:0, rotation:-3, duration:${SP.default}, ease:"sp-default"}, ${r3(b('slid the crane'))});`); p.ev(b('slid the crane')); fx(p, 'rustle.wav', b('slid the crane'), -12); fx(p, SFX + '/swoop.wav', b('slid the crane'), -18);
  p.scene(t3, t4, `${TABLE('amber')}
    ${nameCard(p, t3 + 0.2, { y: 120, role: 'THE ASCENDANT', name: 'Baaba' })}
    <div id="${clip}" style="position:absolute;left:520px;top:330px;width:900px;background:#F4EEDF;padding:34px 40px;box-shadow:0 26px 40px -16px rgba(30,15,0,.6);transform:rotate(-3deg)"><div class="mono" style="font-size:20px;letter-spacing:.2em;color:#7A6A50">GRAPHIC ONLINE · 2019</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:52px;line-height:1.05;margin-top:10px">CRANE CURRENCY OF USA PRINTED GH¢200, GH¢100 NOTES</div><div style="height:10px;background:repeating-linear-gradient(90deg,#C9BFA9 0 60px,transparent 60px 70px);margin-top:20px"></div><div style="height:10px;background:repeating-linear-gradient(90deg,#C9BFA9 0 90px,transparent 90px 100px);margin-top:12px"></div></div>
    ${art(p, 'ink-drop', b('he clung to the ink'), { x: 180, y: 640, w: 200, rot: -8, life: 'jiggle', until: t4, sfx: 'drip.wav', db: -10 })}
    ${card(p, `${mono('SCORE · KWAME')}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:110px;line-height:1">½ <span style="font-size:44px">point</span></div>`, b('keep half a point'), { x: 1400, y: 700, w: 400 })}`, { bg: 'none', enter: 'push', drift: 0.03 });
  // the Bank's plea: don't crumple, staple or spray; the money bouquet
  p.scene(t4, t5, `${head(p, 'THE BANK OF GHANA BEGS US', t4 + 0.1, 'Don’t crumple. Don’t staple. *Don’t spray.*', b('not to crumple') - 0.1, { size: 72, w: 1300 })}
    ${bill(p, `/home/user/gcp/ed4/media/notes/ghs5-crumpled.png`, b('not to crumple'), { x: 150, y: 430, w: 460, rot: -8 })}
    ${art(p, 'stapler', b('staple'), { x: 720, y: 400, w: 300, rot: 4, life: 'jiggle', until: t5, sfx: '/home/user/gcp/project/media/sfx/stamp-1.mp3', db: -14 })}
    ${p.chip('…or spray our notes at parties', b('or spray our notes'), { kind: 'chip red', x: 150, y: 760 })}
    ${art(p, 'bouquet', b('a money bouquet'), { x: 1300, y: 330, w: 400, rot: 6, life: 'sway', until: t5, sfx: SFX1 + '/pop-3.wav' })}
    ${p.stamp('CANCELLED', b('for a friends birthday'), { x: 1290, y: 760, rot: -10, size: 56 })}`, { enter: 'wipeL' });
  // he went quiet: smooths every note flat with the side of his hand, back into the wallet, the oldest last
  const flat = p.id_('fl'), sm = b('smoothed every note');
  p.tl.push(`tl.fromTo("#${flat}", {clipPath:"inset(0% 100% 0% 0%)"}, {clipPath:"inset(0% 0% 0% 0%)", duration:1.6, ease:"power1.inOut"}, ${r3(sm + 0.2)});`); p.ev(sm + 0.2); fx(p, 'rustle.wav', sm + 0.2, -10); fx(p, 'rustle.wav', sm + 0.9, -12);
  const into = b('and put them back');
  const back = ['200', '100', '50', '20', '10'].map((k, i) => { const id = p.id_('wb'), at = into + 0.3 + i * 0.32;
    p.tl.push(`tl.to("#${id}", {x:${r3(1450 - (180 + i * 150))}, y:${r3(700 - (150 + i * 28))}, scale:0.15, rotation:8, opacity:0, duration:0.45, ease:"power2.in", immediateRender:false}, ${r3(at)});`); p.ev(at); fx(p, 'rustle.wav', at, -18);
    return bill(p, note(k), null, { x: 180 + i * 150, y: 150 + i * 28, w: 380, rot: -4 + i * 2, id }); }).join('');
  const lastIn = b('the oldest last'), old = p.id_('ol');
  p.tl.push(`tl.to("#${old}", {x:${1450 - 660}, y:${700 - 520}, scale:0.15, rotation:8, opacity:0, duration:0.5, ease:"power2.in", immediateRender:false}, ${r3(lastIn + 0.2)});`); p.ev(lastIn + 0.2);
  p.scene(t5, s.dur, `${TABLE('amber')}${back}
    <div id="${old}" style="position:absolute;left:660px;top:520px;width:600px"><img src="${p.asset('/home/user/gcp/ed4/media/notes/ghs5-crumpled.png')}" style="width:100%;display:block;box-shadow:0 22px 34px -12px rgba(40,25,10,.55)"><img id="${flat}" src="${p.asset(note('5'))}" style="position:absolute;left:0;top:0;width:100%;display:block"></div>
    ${art(p, 'wallet', t5 + 0.2, { x: 1380, y: 620, w: 320, rot: -6, life: 'bob', until: s.dur, sfx: 'rustle.wav' })}
    ${card(p, `${mono('…WENT QUIET')}${H(p, 'Every note smoothed flat. *The oldest last.*', t5 + 0.2, 50)}`, t5 + 0.1, { x: 110, y: 820, w: 1000 })}
    ${p.chip('more about Kwame in good time', b('i will tell you more'), { kind: 'chip gold', x: 1180, y: 940 })}`, { bg: 'none', enter: 'wipeU', drift: 0.02 });
  return p;
}

// ---------------------------------------------------------------------------
// THE EDITOR'S NOTE — "Printed belief": a cotton banknote, backlit.
export function editor() {
  const [p, c, s] = make('editor');
  const b = (...q) => cs(c, ...q);
  const mid = b('britain or america') - 0.1;
  p.scene(0, mid, `${head(p, 'PRINTED BELIEF', 0.1, 'A promise is only as strong as *the number who believe it.*', b('a promise is only') - 0.2, { size: 68, w: 1000 })}
    ${backlit(p, note('1'), 0.3, { x: 1100, y: 330, w: 680, rot: 4 })}
    ${p.chip('when I read psychology…', 0.5, { kind: 'chip light', x: 150, y: 480 })}
    ${card(p, `<div style="font-family:'Playfair Display',serif;font-style:italic;font-size:50px;line-height:1.15">A banknote: <b style="color:var(--red);font-style:normal">a promise printed on cotton.</b></div>`, b('and a banknote is'), { x: 150, y: 640, w: 860 })}`, { enter: 'cut' });
  fx(p, '/home/user/gcp/project/media/sfx/page-turn-2.mp3', 0.05, -12);
  p.scene(mid, s.dur, `${head(p, 'BRITAIN OR AMERICA', mid + 0.1, 'They can print the paper. *Only we can print the belief.*', mid + 0.2, { size: 70, w: 1200 })}
    ${p.chip('every government that spends faster than it earns…', b('and every government'), { kind: 'chip light', x: 150, y: 560 })}
    ${p.stamp('…IS SPENDING THAT BELIEF', b('is spending that'), { x: 160, y: 700, rot: -4, size: 56 })}
    ${bill(p, note('200'), mid + 0.4, { x: 1250, y: 470, w: 560, rot: -3 })}`, { enter: 'wipeL' });
  return p;
}

// ---------------------------------------------------------------------------
// LETTERS PAGE — a lesson: what do you, your family or your susu group do to stop your money shrinking?
export function letters() {
  const [p, c, s] = make('letters');
  const b = (...q) => cs(c, ...q);
  const q = b('when prices rise');
  const pc = p.id_('pc'); p.grow(pc, q - 0.2, { rot: -1, from: 0.7, preset: 'heavy' }); fx(p, 'kachunk.wav', q - 0.1, -14);
  const TXT = 'Lesson: when prices rise faster than savings earn, what is one thing you, your family or your susu group does to stop your money shrinking?'.split(' ');
  const body = TXT.map((w, i) => { const id = p.id_('cw'), at = q + 0.2 + i * 0.16; p.tl.push(`tl.set("#${id}", {opacity:1}, ${r3(at)});`); if (i % 2 === 0) fx(p, 'key.wav', at, -24); if (i % 6 === 0) p.ev(at); return `<span id="${id}" style="opacity:0">${w}</span>`; }).join(' ');
  p.scene(0, s.dur, `${head(p, 'LETTERS PAGE', 0.1, 'This week: *a lesson.*', b('asks for a lesson') - 0.1, { size: 96 })}
    ${art(p, 'jar', 0.4, { x: 1520, y: 110, w: 240, rot: 4, life: 'bob', until: s.dur })}
    <div id="${pc}" style="position:absolute;left:150px;top:400px;width:1080px;background:#FFFFFF;border-radius:18px;box-shadow:0 30px 60px -20px rgba(60,40,10,.45);padding:30px 36px">
      <div style="font-family:'GCP Round',sans-serif;font-size:22px;color:#606060">📌 Pinned by Gold Coast Palava</div>
      <div style="display:flex;gap:20px;margin-top:16px"><div style="width:64px;height:64px;border-radius:50%;background:var(--red);color:#FCF5E8;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-weight:900;font-size:34px;flex:none">G</div>
        <div><div style="font-family:'GCP Round',sans-serif;font-weight:700;font-size:24px">@GoldCoastPalava</div><div style="font-family:'GCP Round',sans-serif;font-size:32px;line-height:1.35;margin-top:8px;color:#0F0F0F">${body}</div></div></div></div>
    ${stack(p, [['you?', b('what is one thing'), 'chip gold'], ['your family?', b('your family'), 'chip light'], ['your susu group?', b('your susu group'), 'chip light'], ['I will pin the most useful answer', b('i will pin'), 'chip red']], { x: 1290, y: 420 })}`, { enter: 'cut' });
  return p;
}

// ---------------------------------------------------------------------------
// THE DISPATCH — the shared table, cleared: only the cowrie and the sticky note, "(the ink, maybe)"; filed and
// signed; the route; then the closing montage (COMBO2).
export function dispatch() {
  const [p, c, s] = make('dispatch');
  p.css.push(BANNER_CSS);
  const b = (...q) => cs(c, ...q);
  const vEnd = (({ local0, vo_in, vo_out }) => local0 + vo_out - vo_in)(s.pieces[s.pieces.length - 1]);
  const aEnd = b('and dispatched to') - 0.1;
  const sig = p.id_('sg');
  p.tl.push(`tl.fromTo("#${sig}", {strokeDasharray:900, strokeDashoffset:900}, {strokeDashoffset:0, duration:1.3, ease:"power2.inOut"}, ${r3(b('filed and signed') + 0.3)});`); p.ev(b('filed and signed') + 0.3);
  p.sound('pen-2.mp3', b('filed and signed') + 0.3, -10);
  p.scene(0, aEnd, `${TABLE()}
    ${art(p, 'cowrie', 0.2, { x: 1180, y: 420, w: 170, rot: -10, life: 'pulse', until: aEnd, sfx: 'shell-set.wav' })}
    ${sticky(p, 0.5, { x: 1380, y: 380, w: 420, rot: -5, size: 60, under: '(the ink, maybe)', underAt: 1.2 })}
    ${card(p, `${mono('DISPATCH')}${H(p, 'The *fourth edition*, complete.', 0.25, 76)}`, 0.1, { x: 110, y: 110, w: 980 })}
    <div style="position:absolute;left:110px;top:420px;display:flex;gap:16px">${p.chip('CHECKED', b('checked'), { kind: 'chip light' })}${p.chip('STAMPED', b('stamped'), { kind: 'chip light' })}${p.chip('≈ 50 MB', b('priced at'), { kind: 'chip gold' })}</div>
    ${card(p, `<div class="mono" style="font-size:40px;font-weight:700;line-height:1.5">${p.typed('THE NEST · 266 SANDPIPER LOOP', b('at the nest'), { cps: 24 })}<br>${p.typed('ONIPA ENCLAVE', b('onipa enclave', 'enclave') - 0.6, { cps: 20, sfx: false })}</div>
      <svg style="display:block;margin-top:10px" width="460" height="120" viewBox="0 0 460 140"><path id="${sig}" d="M10 90 C 40 20, 70 20, 80 80 S 120 120, 140 60 S 180 10, 200 70 S 240 110, 270 50 C 290 20, 320 100, 350 70 S 420 40, 450 60" fill="none" stroke="#1A1612" stroke-width="5" stroke-linecap="round"/></svg>`, b('filed and signed') - 0.2, { x: 110, y: 560, w: 900 })}
    ${p.stamp('FILED', b('filed and signed') + 1.6, { x: 760, y: 820, rot: -10, size: 80 })}`, { bg: 'none', enter: 'cut', drift: 0.02 });
  fx(p, 'thump.wav', b('stamped') + 0.1, -8); fx(p, 'thump.wav', b('filed and signed') + 1.7, -6);
  const stops = [['to accra', 'ACCRA'], ['to kumasi', 'KUMASI'], ['to bunkpurugu', 'BUNKPURUGU'], ['to half assini', 'HALF ASSINI'], ['and to the world', 'THE WORLD']];
  const route = stops.map(([q, t], i) => p.chip(t, b(q), { kind: i === 4 ? 'chip gold' : 'chip', x: 150 + i * 340, y: 560 + (i % 2) * 120 })).join('');
  stops.forEach(([q]) => fx(p, SFX1 + '/pop-2.wav', b(q), -16));
  const path_ = p.id_('rt');
  p.tl.push(`tl.fromTo("#${path_}", {strokeDasharray:1800, strokeDashoffset:1800}, {strokeDashoffset:0, duration:${r3(b('and to the world') - b('to accra') + 0.5)}, ease:"none"}, ${r3(b('to accra'))});`);
  p.scene(aEnd, vEnd + 0.6, `<div class="hl" style="left:150px;top:200px;width:1600px">${p.kicker('…AND DISPATCHED TO', aEnd + 0.1)}<h1 style="font-size:110px">${p.words(p.id_('dp'), 'Squad, *better time.*', b('squad'), { stagger: 0.08 })}</h1></div>
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
