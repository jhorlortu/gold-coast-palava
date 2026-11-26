// Edition 2 — the main business: Lead Story, The Wire, The Palava Desk, Then v Now, Team Aside, Editor's Note,
// Letters Page, Dispatch (+ outro montage, COMBO2).
import { SP } from '/home/user/gcp/build/lib.mjs';
import { banner, BANNER_CSS } from '/home/user/gcp/build/banner.mjs';
import { livingNest } from './nestlive.mjs';
import { stack, head, away, nameCard, counter, card, mono, H, nestBed, pin, st, st1, fx, cs, make, RIGHT, STK, STK1, SFX, SFX1, DRAWN, PILOT, r3 } from './ed2.mjs';

// a persistent band (above the scenes, below the masthead) for the section-long timeline
const band = (p, html, { z = 800 } = {}) => p.html.push(`<div class="clip" data-start="0" data-duration="${r3(p.dur)}" data-track-index="8" style="position:absolute;inset:0;z-index:${z};pointer-events:none">${html}</div>`);
const fly = (p, id, at) => { p.tl.push(`tl.to("#${id}", {y:-900, rotation:-6, duration:0.55, ease:"power3.in", immediateRender:false}, ${r3(at)});`); p.ev(at); p.sound('whoosh-2.mp3', at, -20); };

// ---------------------------------------------------------------------------
// LEAD STORY — "Brown gold". A timeline builds along the bottom as each date is spoken; a gold pin drops on 1947.
export function lead() {
  const [p, c, s] = make('lead');
  const b = (...q) => cs(c, ...q);
  const cut = [0, b('and in 1879'), b('the basel'), b('in the first edition'), b('small family farms'), b('the trouble was'), b('so the price'), b('they held up'),
    b('london sent'), b('what came next'), b('hold that thought'), b('when the board paid'), b('then the drought'), s.dur].map((t, i) => i ? t - 0.1 : 0);
  const sc = (i, html, o = {}) => p.scene(cut[i], cut[i + 1], html, o);
  // the timeline band
  const DATES = [['1870', b('sailed in 1870', 'in 1870')], ['1879', b('in 1879'), 'Mampong'], ['1911', b('by 1911'), 'world No. 1'], ['1937', b('in 1937'), 'the hold-up'],
    ['1947', b('in 1947'), 'Marketing Board'], ['1978', b('in 1978'), 'Côte d’Ivoire overtakes'], ['1983', b('1983'), 'drought · fires'], ['2020s', b('by the early'), 'comeback']];
  const X0 = 140, X1 = 1780, xs = DATES.map((_, i) => X0 + i * (X1 - X0) / (DATES.length - 1));
  const line = p.id_('tln');
  p.tl.push(`tl.fromTo("#${line}", {scaleX:0}, {scaleX:1, duration:1.2, ease:"sp-default"}, ${r3(DATES[0][1] - 0.3)});`);
  const marks = DATES.map(([y, at, lbl], i) => { const id = p.id_('tm');
    p.tl.push(`tl.fromTo("#${id}", {opacity:0, y:30, scale:.6}, {opacity:1, y:0, scale:1, duration:${SP.snappy}, ease:"sp-snappy"}, ${r3(at)});`);
    p.tl.push(`tl.fromTo("#${id}-d", {scale:1.8}, {scale:1, duration:${SP.snappy}, ease:"sp-snappy"}, ${r3(at)});`);
    p.ev(at); fx(p, 'blip.wav', at, -18); fx(p, SFX1 + '/pop-' + (1 + i % 3) + '.wav', at + 0.05, -20);
    return `<div id="${id}" style="position:absolute;left:${xs[i] - 90}px;top:858px;width:180px;text-align:center;opacity:0"><div id="${id}-d" style="width:22px;height:22px;margin:0 auto;border-radius:50%;background:var(--red);border:4px solid #FCF5E8;box-shadow:0 0 0 3px var(--ink)"></div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:30px;line-height:1;margin-top:4px">${y}</div>${lbl ? `<div class="mono" style="font-size:14px;font-weight:700;letter-spacing:.06em;color:var(--red)">${lbl}</div>` : ''}</div>`; }).join('');
  // the gold pin drops on 1947 at "Hold that thought" and stays
  const gp = p.id_('gp'), hold = b('hold that thought');
  p.tl.push(`tl.fromTo("#${gp}", {opacity:0, y:-420, rotation:-30}, {opacity:1, y:0, rotation:0, duration:${SP.playful}, ease:"sp-playful"}, ${r3(hold)});`); fx(p, 'sparkle.wav', hold + 0.3, -12); fx(p, SFX1 + '/glass.wav', hold + 0.45, -16);
  band(p, `<div style="position:absolute;left:0;right:0;top:846px;height:110px;background:linear-gradient(180deg, rgba(243,235,215,0), rgba(243,235,215,.92) 30%)"></div>
    <div id="${line}" style="position:absolute;left:${X0}px;top:868px;width:${X1 - X0}px;height:5px;background:var(--ink);transform-origin:0 50%"></div>${marks}
    <div id="${gp}" style="position:absolute;left:${xs[4] - 22}px;top:792px;opacity:0"><svg width="44" height="76" viewBox="0 0 44 76"><path d="M22 74 L22 34" stroke="#1A1612" stroke-width="4"/><circle cx="22" cy="22" r="19" fill="#C8962F" stroke="#1A1612" stroke-width="4"/><circle cx="16" cy="16" r="5" fill="#F7E3A1"/></svg></div>`);
  // 0 — Tetteh Quarshie sails to Fernando Po
  sc(0, `${head(p, 'THE MAN FROM TESHIE', 0.1, 'Tetteh *Quarshie.*', 0.3, { size: 110 })}
    ${stack(p, [['1870 → Fernando Po (today: Bioko)', b('fernando'), 'chip red'], ['home ~6 years later, with cocoa beans', b('came home')]], { y: 420 })}
    ${nameCard(p, 1.6, { y: 620, role: 'FARMER & BLACKSMITH · TESHIE', name: 'Tetteh Quarshie', note: 'no authentic portrait survives' })}
    ${st(p, 'ship-island', b('sailed in 1870', 'in 1870'), { x: 1180, y: 150, w: 600, rot: 3, life: 'sail', until: cut[1], sfx: SFX + '/ship.wav', db: -12 })}
    ${st(p, 'cocoa-sack', b('cocoa beans') - 0.1, { x: 1560, y: 560, w: 220, rot: -6, life: 'bob', until: cut[1] })}`, { enter: 'cut' });
  fx(p, 'waves.wav', b('fernando'), -24, 4);
  // 1 — 1879, Mampong
  sc(1, `${head(p, '1879 · MAMPONG, AKUAPEM', cut[1] + 0.1, 'He planted them at *Mampong.*', cut[1] + 0.3, { size: 92 })}
    ${st(p, 'planting', cut[1] + 0.4, { x: 160, y: 470, w: 330, rot: -4, life: 'bob', until: cut[2] })}
    ${p.print(DRAWN + '/quarshie-tree.jpg', cut[1] + 0.9, { x: 1060, y: 170, w: 700, rot: 2, caption: 'Mampong today: one of the original trees, planted 1879' })}`);
  // 2 — the Basel missionaries; the forest belt; 1911 world No. 1
  sc(2, `${head(p, 'ACROSS THE FOREST BELT', cut[2] + 0.1, 'By 1911: the *world’s largest* producer.', b('by 1911') - 0.3, { size: 80 })}
    ${stack(p, [['the Basel missionaries: “we were first”', b('basel'), 'chip light'], ['from farms like his, the crop spreads', b('from farms like his'), 'chip gold']], { y: 460 })}
    ${p.stamp('WORLD No. 1 · 1911', b('the gold coast was the largest', 'largest cocoa'), { x: 160, y: 680, rot: -4, size: 60 })}
    ${st(p, 'cocoa-pod', cut[2] + 0.4, { x: 1250, y: 140, w: 420, rot: 6, life: 'sway', until: cut[3] })}`);
  // 3 — the second gold
  sc(3, `${head(p, 'IN EDITION 1: A LAND NAMED FOR ITS GOLD', cut[3] + 0.1, 'The *second gold.*', b('a second gold') - 0.2, { size: 120 })}
    ${stack(p, [['Edition 1: a land named for its gold', b('named for its gold'), 'chip light'], ['…a brown one', b('a brown one'), 'chip red']], { y: 470 })}
    ${st(p, 'gold-cocoa', cut[3] + 0.3, { x: 1120, y: 170, w: 660, rot: 0, life: 'pulse', until: cut[4], sfx: SFX + '/sparkle.wav', db: -12 })}`);
  // 4 — small family farms
  sc(4, `${head(p, 'NOT PLANTATIONS', cut[4] + 0.1, 'Small *family farms.*', cut[4] + 0.2, { size: 110 })}
    ${stack(p, [['owners sold to whoever would buy', b('whose owners sold'), 'chip gold']], { y: 470 })}
    ${st(p, 'family-farm', cut[4] + 0.2, { x: 1180, y: 120, w: 560, rot: 2, life: 'bob', until: cut[5] })}`);
  // 5 — only a handful would buy: the 1937 buying agreement
  sc(5, `${head(p, '1937 · THE BUYING AGREEMENT', cut[5] + 0.1, 'Only a *handful* would buy.', cut[5] + 0.25, { size: 88 })}
    ${stack(p, [['Cadbury', b('cadbury'), 'chip red'], ['the United Africa Company', b('united africa'), 'chip red']], { y: 400 })}
    <div style="position:absolute;left:150px;top:600px;display:flex;gap:70px;align-items:flex-end">
      <div>${counter(p, b('13 firms'), 13, { size: 150 })}<div class="mono" style="font-size:26px;font-weight:700">FIRMS SIGNED</div></div>
      <div>${counter(p, b('about 94'), 94, { size: 150, color: 'var(--red)', suffix: '%' })}<div class="mono" style="font-size:26px;font-weight:700;color:var(--red)">OF THE COLONY’S COCOA</div></div></div>
    ${st(p, 'purse', b('drew up'), { x: 1300, y: 200, w: 420, rot: 4, life: 'bob', until: cut[6], sfx: SFX1 + '/coins.wav' })}`);
  // 6 — announced, not bargained; public in October
  sc(6, `${head(p, 'THE FARMER’S PRICE', cut[6] + 0.1, 'No longer bargained. Simply *announced.*', cut[6] + 0.2, { size: 80 })}
    ${p.stamp('ANNOUNCED', b('simply announced', 'announced'), { x: 1180, y: 220, rot: 6, size: 70, sfx: null })}
    ${stack(p, [['October: the deal goes public', b('became public'), 'chip light'], ['cocoa: 60%+ of the colony’s exports', b('more than 60'), 'chip gold'], ['…and nobody in London expected this', b('nobody in london'), 'chip red']], { y: 460 })}
    ${st(p, 'podium', b('became public'), { x: 1300, y: 420, w: 380, rot: -3, life: 'bob', until: cut[7] })}`);
  fx(p, 'thump.wav', b('simply announced', 'announced') + 0.1, -8);
  // 7 — the hold-up and the boycott
  sc(7, `${head(p, 'OCTOBER 1937', cut[7] + 0.1, 'They *held up* the crop.', cut[7] + 0.2, { size: 104 })}
    ${p.stamp('HELD UP', cut[7] + 1.2, { x: 160, y: 430, rot: -6, size: 80, sfx: null })}
    ${stack(p, [['boycotting European shop goods', b('boycotted'), 'chip red'], ['except: sugar · kerosene · matches · tobacco', b('sugar'), 'chip light']], { y: 600 })}
    ${away(p, st(p, 'shop-shutter', b('boycotted') - 0.2, { x: 1180, y: 170, w: 560, rot: 0, life: 'bob', until: b('sugar'), sfx: SFX + '/shutter.wav', db: -8 }), b('sugar') - 0.3)}
    ${st(p, 'essentials', b('sugar'), { x: 1200, y: 190, w: 520, rot: 3, life: 'bob', until: cut[8] })}`);
  fx(p, 'thump.wav', cut[7] + 1.3, -6);
  // 8 — London sends a commission; the agreement is suspended; farmers proved it
  sc(8, `${head(p, 'LONDON SENDS A COMMISSION', cut[8] + 0.1, 'The agreement is *suspended.*', b('buying agreement was suspended', 'was suspended'), { size: 88 })}
    ${stack(p, [['years before the crossroads of 1948…', b('years before'), 'chip light'], ['cocoa farmers proved this colony could organise — and win', b('cocoa farmers who first', 'first proved'), 'chip gold']], { y: 460 })}
    ${p.stamp('FARMERS WIN', b('organize and win', 'and win'), { x: 160, y: 700, rot: -5, size: 64 })}
    ${p.print('/home/user/gcp/ed2/media/real/nowell-report.jpg', cut[8] + 0.3, { x: 1260, y: 120, w: 470, rot: 3, caption: 'The commission’s report, 1938' })}`);
  fx(p, 'chant.wav', b('organize and win', 'and win') - 1.0, -20);
  // 9 — protection: the war, the Cocoa Marketing Board, a convenient purse
  sc(9, `${head(p, 'WHAT CAME NEXT', cut[9] + 0.1, 'It looked like *protection.*', cut[9] + 0.2, { size: 92 })}
    ${stack(p, [['the war: Britain buys the crop itself', b('during the war'), 'chip light'], ['1947: the Cocoa Marketing Board', b('in 1947'), 'chip red'], ['single buyer & seller of every bean', b('single buyer'), 'chip light'], ['to shield farmers from cartels & wild prices', b('shield farmers'), 'chip light'], ['…a very convenient purse for whoever governed', b('convenient purse'), 'chip gold']], { y: 400 })}
    ${away(p, st(p, 'cocoa-sack', cut[9] + 0.4, { x: 1250, y: 200, w: 460, rot: -3, life: 'bob', until: b('convenient purse') }), b('convenient purse') - 0.35)}
    ${st(p, 'purse', b('convenient purse'), { x: 1230, y: 180, w: 500, rot: 4, life: 'pulse', until: cut[10], sfx: SFX1 + '/coins.wav', db: -10 })}`);
  // 10 — hold that thought (the pin drops onto 1947 in the band)
  sc(10, `<div class="hl" style="left:0;right:0;top:330px;text-align:center"><h1 style="font-size:150px">${p.words(p.id_('ht'), 'Hold that *thought.*', cut[10] + 0.15, { stagger: 0.1 })}</h1></div>`, { enter: 'iris' });
  // 11 — the board paid too little: farmers carry beans west; Côte d'Ivoire overtakes, 1978
  const arr = p.id_('ar'), walk = p.id_('wk');
  p.tl.push(`tl.fromTo("#${arr}", {strokeDashoffset:900}, {strokeDashoffset:0, duration:1.4, ease:"power2.inOut"}, ${r3(b('farmers carried') )});`); fx(p, 'swoop.wav', b('farmers carried'), -14);
  p.tl.push(`tl.fromTo("#${walk}", {x:0}, {x:-520, duration:${r3(cut[12] - b('farmers carried'))}, ease:"none"}, ${r3(b('farmers carried'))});`);
  sc(11, `${head(p, 'AFTER INDEPENDENCE', cut[11] + 0.1, 'The board paid *too little.*', cut[11] + 0.2, { size: 88 })}
    <div style="position:absolute;left:900px;top:330px;width:900px;height:400px">
      <div style="position:absolute;left:0;top:0;width:430px;height:400px;background:#E8D9B5;border:4px solid var(--ink)"><div class="mono" style="position:absolute;left:24px;top:20px;font-size:26px;font-weight:700">CÔTE D’IVOIRE</div></div>
      <div style="position:absolute;left:470px;top:0;width:430px;height:400px;background:#F2E6C6;border:4px solid var(--ink)"><div class="mono" style="position:absolute;right:24px;top:20px;font-size:26px;font-weight:700">GHANA</div></div>
      <div style="position:absolute;left:446px;top:-10px;width:8px;height:420px;background:repeating-linear-gradient(180deg,var(--red) 0 18px,transparent 18px 30px)"></div>
      <svg style="position:absolute;left:0;top:0;overflow:visible" width="900" height="400"><path id="${arr}" d="M820 260 C 650 200, 420 220, 160 260" fill="none" stroke="#A4241B" stroke-width="10" stroke-dasharray="900" stroke-dashoffset="900" stroke-linecap="round"/><path d="M180 236 L140 262 L184 284" fill="none" stroke="#A4241B" stroke-width="10" stroke-linejoin="round"/></svg>
      <div id="${walk}" style="position:absolute;left:640px;top:150px">${st(p, 'farmer-walk', b('farmers carried'), { x: 0, y: 0, w: 230, rot: 0, life: 'bob', until: cut[12], abs: false })}</div></div>
    ${stack(p, [['beans walk to where they pay better: west', b('west into'), 'chip gold']], { y: 400 })}
    ${p.stamp('1978 · CÔTE D’IVOIRE OVERTAKES', b('in 1978'), { x: 150, y: 600, rot: -4, size: 30 })}`);
  // 12 — 1983 drought & fires; reform; a million tonnes by the 2020s
  sc(12, `${head(p, '1983 → THE 2020s', cut[12] + 0.1, 'Drought, fire — then a *long climb* back.', cut[12] + 0.2, { size: 76 })}
    ${away(p, st(p, 'bushfire', cut[12] + 0.2, { x: 1220, y: 150, w: 520, rot: -2, life: 'jiggle', until: b('reform'), sfx: SFX + '/fire.wav', db: -14 }), b('a long climb') - 0.3)}
    ${st(p, 'family-farm', b('a long climb'), { x: 1240, y: 160, w: 480, rot: 3, life: 'bob', until: s.dur })}
    ${stack(p, [['reform', b('reform'), 'chip light']], { y: 450 })}
    <div style="position:absolute;left:150px;top:560px;display:flex;align-items:baseline;gap:24px">${counter(p, b('about a million'), 1, { size: 150, dur: 0.8, prefix: '≈ ', suffix: ' million' })}<span class="mono" style="font-size:28px;font-weight:700">TONNES · EARLY 2020s</span></div>`);
  fx(p, 'fire.wav', cut[12] + 0.6, -20);
  return p;
}

// ---------------------------------------------------------------------------
// THE WIRE — Thursday, 12 February 2026, Accra. Dateline in Special Elite, harmattan haze, a ticker underneath.
export function wire() {
  const [p, c, s] = make('wire');
  const b = (...q) => cs(c, ...q);
  const cut = [0, b('he cut the price'), b('so, a 64', 'a 64'), b('the reason was'), b('so, the buyers', 'the buyers stayed'), b('underneath'), b('during the debt'), b('in western north'), b('parliament has'), s.dur].map((t, i) => i ? t - 0.1 : 0);
  const sc = (i, html, o = {}) => p.scene(cut[i], cut[i + 1], html, o);
  // harmattan haze over the whole section + the ticker
  const tk = p.id_('tk'), dust = Array.from({ length: 26 }, (_, i) => { const id = p.id_('hz'), x = (i * 397) % 1920, y = (i * 211) % 820, d = 6 + (i % 5);
    p.tl.push(`tl.fromTo("#${id}", {x:0, y:0}, {x:${-260 - (i % 4) * 60}, y:${20 + (i % 3) * 14}, duration:${d}, ease:"none", repeat:${Math.ceil(s.dur / d)}}, 0);`);
    return `<i id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${3 + i % 4}px;height:${3 + i % 4}px;border-radius:50%;background:rgba(190,140,80,.35)"></i>`; }).join('');
  const TICK = 'COCOA · FARMGATE PRICE CUT MID-SEASON · GH¢58,000 → GH¢41,392 A TONNE · WORLD PRICE BELOW US$4,100 · BAGS WAIT IN SHEDS · COCOBOD LAW PASSED · ';
  p.tl.push(`tl.fromTo("#${tk}", {x:0}, {x:-2400, duration:${r3(s.dur)}, ease:"none"}, 0);`);
  band(p, `<div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(226,180,110,.22), rgba(214,160,90,.10));mix-blend-mode:multiply"></div>${dust}
    <div style="position:absolute;left:0;right:0;top:902px;height:52px;background:var(--ink);overflow:hidden"><div id="${tk}" class="elite" style="white-space:nowrap;color:#F3EBD7;font-size:28px;line-height:52px;padding-left:40px">${TICK.repeat(4)}</div></div>`);
  fx(p, SFX1 + '/wind.wav', 0, -26, 5); fx(p, SFX1 + '/wind.wav', 4.8, -28, 5);
  // 0 — dateline; the minister announces
  const dl = p.id_('dl');
  sc(0, `<div id="${dl}" style="position:absolute;left:150px;top:120px;background:#FCF5E8;border:4px solid var(--ink);box-shadow:10px 12px 0 var(--ink);padding:24px 34px;width:1000px">
      <div class="elite" style="font-size:52px;line-height:1.15">${p.typed('THURSDAY, 12 FEBRUARY 2026', 0.2, { cps: 20, cls: 'elite' })}<br>${p.typed('ACCRA — THE HARMATTAN', 1.7, { cps: 18, cls: 'elite', sfx: false })}</div></div>
    ${nameCard(p, b('minister for finance'), { y: 400, role: 'MINISTER FOR FINANCE', name: 'Dr Cassiel Ato Forson' })}
    ${p.print(DRAWN + '/ato-forson.jpg', b('kassiel', 'minister for finance') + 0.2, { x: 1300, y: 140, w: 400, rot: 2, caption: 'Dr Cassiel Ato Forson' })}
    ${p.stamp('A FIRST IN LIVING MEMORY', b('living memory'), { x: 160, y: 640, rot: -4, size: 48 })}`, { enter: 'cut' });
  fx(p, 'key.wav', 0.2, -20); fx(p, SFX + '/carriage-bell.wav', 1.6, -20);
  // 1 — the price card: per tonne
  const pc = (from, to, at1, at2, unit) => { const a = p.id_('pa'), bb = p.id_('pb'), slash = p.id_('ps');
    p.tl.push(`tl.fromTo("#${a}", {opacity:0, x:-60}, {opacity:1, x:0, duration:${SP.snappy}, ease:"sp-snappy"}, ${r3(at1)});`);
    p.tl.push(`tl.fromTo("#${slash}", {scaleX:0}, {scaleX:1, duration:0.3, ease:"power2.out"}, ${r3(at2 - 0.1)});`);
    p.tl.push(`tl.fromTo("#${bb}", {opacity:0, y:60, scale:1.3}, {opacity:1, y:0, scale:1, duration:${SP.heavy}, ease:"sp-heavy"}, ${r3(at2)});`);
    p.ev(at1); p.ev(at2); fx(p, 'drop.wav', at2 - 0.2, -10); fx(p, 'thump.wav', at2 + 0.5, -12);
    return `<div style="display:flex;align-items:center;gap:40px"><div id="${a}" style="position:relative;font-family:'Playfair Display',serif;font-weight:900;font-size:110px;color:var(--muted)">${from}<i id="${slash}" style="position:absolute;left:-6px;right:-6px;top:52%;height:12px;background:var(--red);transform-origin:0 50%"></i></div><div style="font-size:90px">→</div><div id="${bb}" style="font-family:'Playfair Display',serif;font-weight:900;font-size:130px;color:var(--red)">${to}</div></div><div class="mono" style="font-size:28px;font-weight:700;letter-spacing:.14em;margin-top:6px">${unit}</div>`; };
  sc(1, `${head(p, 'MID-SEASON', cut[1] + 0.1, 'He *cut* the farmers’ price.', cut[1] + 0.2, { size: 84 })}
    <div style="position:absolute;left:150px;top:420px">${pc('GH¢58,000', 'GH¢41,392', b('58'), b('41'), 'PER TONNE')}</div>
    ${st(p, 'scissors', b('he cut the price') + 0.3, { x: 1380, y: 120, w: 380, rot: 6, life: 'jiggle', until: cut[2], sfx: SFX + '/snip.wav', db: -8 })}`);
  // 2 — the 64 kg bag: how machay?
  sc(2, `${head(p, 'ONE 64-KILO BAG · SEFWI', cut[2] + 0.1, 'Suddenly worth… *how machay?*', b('how much i', 'how much') - 0.2, { size: 84 })}
    <div style="position:absolute;left:150px;top:430px">${pc('GH¢3,600', 'GH¢2,587', b('3', 'about 3'), b('2 ,587', '587'), 'PER 64 KG BAG')}</div>
    ${st(p, 'cocoa-sack', cut[2] + 0.3, { x: 1360, y: 150, w: 400, rot: -4, life: 'bob', until: cut[3] })}
    ${p.chip('a farmer in Sefwi', b('in sefwi', 'sefwi'), { kind: 'chip gold', x: 1360, y: 620 })}`);
  // 3 — the chart: world price above US$10,000 (late 2024) → below US$4,100 (Feb 2026); Ghana's price now above it
  const wl = p.id_('wl'), gl = p.id_('gl'), l1 = b('shot past'), l2 = b('fallen below'), l3 = b('now stood above', 'stood above');
  p.tl.push(`tl.fromTo("#${wl}", {strokeDashoffset:1400}, {strokeDashoffset:700, duration:1.0, ease:"power2.out"}, ${r3(l1)});`);
  p.tl.push(`tl.to("#${wl}", {strokeDashoffset:0, duration:1.4, ease:"power2.in", immediateRender:false}, ${r3(l2 - 0.3)});`);
  p.tl.push(`tl.fromTo("#${gl}", {scaleX:0}, {scaleX:1, duration:0.9, ease:"sp-default"}, ${r3(l3)});`);
  p.ev(l1); p.ev(l2); p.ev(l3); fx(p, 'riser.wav', l1 - 1.4, -22); fx(p, 'drop.wav', l2, -12); fx(p, 'blip.wav', l3, -14);
  sc(3, `${head(p, 'THE REASON WAS SIMPLE', cut[3] + 0.1, 'The world price *fell.*', cut[3] + 0.3, { size: 76, w: 660 })}
    <div style="position:absolute;left:860px;top:180px;width:920px;height:600px;background:#FCF5E8;border:4px solid var(--ink);box-shadow:10px 12px 0 var(--ink)">
      <div class="mono" style="position:absolute;left:24px;top:16px;font-size:20px;font-weight:700;letter-spacing:.14em">WORLD COCOA PRICE · US$ PER TONNE</div>
      <svg style="position:absolute;left:0;top:0" width="920" height="600">
        ${[2, 4, 6, 8, 10, 12].map((k) => `<line x1="80" x2="880" y1="${560 - k * 40}" y2="${560 - k * 40}" stroke="#1A1612" stroke-opacity=".12"/><text x="20" y="${566 - k * 40}" font-family="IBM Plex Mono" font-size="18">${k}k</text>`).join('')}
        <path id="${wl}" d="M90 420 C 200 360, 300 180, 420 150 S 520 170, 560 260 S 760 420, 870 400" fill="none" stroke="#A4241B" stroke-width="9" stroke-linecap="round" stroke-dasharray="1400" stroke-dashoffset="1400"/>
        <text x="380" y="130" font-family="IBM Plex Mono" font-weight="700" font-size="20" fill="#A4241B">&gt; $10,000 · late 2024</text>
        <text x="650" y="450" font-family="IBM Plex Mono" font-weight="700" font-size="20" fill="#A4241B">&lt; $4,100 · Feb 2026</text>
        <g id="${gl}" style="transform-origin:600px 330px"><line x1="600" x2="880" y1="330" y2="330" stroke="#C8962F" stroke-width="8" stroke-dasharray="16 10"/><text x="610" y="316" font-family="IBM Plex Mono" font-weight="700" font-size="20" fill="#8A6420">GHANA’S PRICE (raised in Oct)</text></g></svg></div>
    ${stack(p, [['raised in October, to stop beans going west', b('raised in october'), 'chip light'], ['…now above what the world would pay', l3, 'chip red']], { y: 470 })}`);
  // 4 — buyers stayed away; bags in sheds; farmers wait
  sc(4, `${head(p, 'SO…', cut[4] + 0.1, 'The bags sat in *sheds.*', b('the bags sat', 'bags sat'), { size: 96 })}
    ${stack(p, [['the buyers stayed away', b('stayed away'), 'chip light'], ['farmers waited months for their money', b('waited months'), 'chip red']], { y: 460 })}
    ${st(p, 'shed-sacks', b('the bags sat', 'bags sat'), { x: 1220, y: 160, w: 540, rot: -2, life: 'bob', until: cut[5], sfx: SFX + '/thump.wav', db: -14 })}`);
  // 5 — the broken habit: 32 years of a loan secured on beans sold before they are picked
  sc(5, `${head(p, 'UNDERNEATH IT', cut[5] + 0.1, 'A broken *habit.*', cut[5] + 0.2, { size: 104 })}
    <div style="position:absolute;left:150px;top:420px;display:flex;align-items:baseline;gap:24px">${counter(p, b('for 32 years', '32 years'), 32, { size: 150, color: 'var(--red)' })}<span class="mono" style="font-size:30px;font-weight:700">YEARS</span></div>
    ${stack(p, [['a syndicated loan from foreign banks', b('syndicated loan'), 'chip light'], ['secured by selling the crop forward — raw', b('selling most of the crop', 'secured by'), 'chip gold']], { y: 640 })}
    ${st(p, 'cocoa-sack', b('selling most of the crop', 'secured by'), { x: 1180, y: 220, w: 360, rot: -4, life: 'bob', until: cut[6] })}
    ${st(p, 'cocoa-pod', b('before they were even picked', 'even picked'), { x: 1560, y: 170, w: 210, rot: 10, life: 'sway', until: cut[6] })}
    ${p.stamp('SOLD', b('before they were even picked', 'even picked') + 0.3, { x: 1220, y: 470, rot: -12, size: 90 })}`);
  // 6 — the loan failed
  sc(6, `${head(p, 'THE DEBT CRISIS', cut[6] + 0.1, 'Then the loan *failed.*', b('that loan failed', 'loan failed') - 0.2, { size: 96 })}
    ${p.stamp('LOAN FAILED', b('that loan failed', 'loan failed') + 0.4, { x: 160, y: 430, rot: -5, size: 64 })}
    ${stack(p, [['under the previous administration', b('previous administration'), 'chip light'], ['foreign traders asked to pre-finance the crop', b('foreign traders'), 'chip gold']], { y: 600 })}
    ${st(p, 'purse', cut[6] + 0.3, { x: 1260, y: 190, w: 440, rot: 5, life: 'sway', until: cut[7], sfx: SFX + '/kachunk.wav', db: -12 })}`);
  // 7 — Western North farmers march
  sc(7, `${head(p, 'WESTERN NORTH', cut[7] + 0.1, 'Farmers *marched* against the cut.', cut[7] + 0.2, { size: 88 })}
    ${st(p, 'farmers-march', cut[7] + 0.2, { x: 1100, y: 150, w: 640, rot: 1, life: 'bob', until: cut[8] })}`);
  fx(p, 'chant.wav', cut[7] + 0.4, -16);
  // 8 — Parliament: the new COCOBOD law (card)
  sc(8, `${head(p, 'PARLIAMENT HAS SINCE PASSED', cut[8] + 0.1, 'A new *COCOBOD law.*', b('a new cocoa bod', 'new cocoa') - 0.2, { size: 92 })}
    ${card(p, `${mono('COCOBOD BILL 2026', { size: 26 })}<div style="margin-top:16px">${[['≥ 70% of the export (FOB) price, guaranteed', b('at least 70')], ['foreign loans swapped for cedi bonds', b('swaps the foreign')], ['≥ 50% of every crop processed at home', b('reserves at least half', 'at least half')]].map(([t, at]) => { const id = p.id_('li'); p.tl.push(`tl.fromTo("#${id}", {opacity:0, x:-30}, {opacity:1, x:0, duration:${SP.snappy}, ease:"sp-snappy"}, ${r3(at)});`); p.ev(at); fx(p, 'kachunk.wav', at, -16); return `<div id="${id}" style="opacity:0;font-family:'Playfair Display',serif;font-weight:900;font-size:40px;line-height:1.15;margin:10px 0;padding-left:34px;position:relative"><b style="position:absolute;left:0;color:var(--red)">✓</b>${t}</div>`; }).join('')}</div>`, cut[8] + 0.5, { x: 150, y: 440, w: 1000 })}
    ${st(p, 'gavel', cut[8] + 0.2, { x: 1300, y: 200, w: 460, rot: -4, life: 'bob', until: s.dur, sfx: SFX1 + '/knock.wav', db: -6 })}`);
  fx(p, SFX1 + '/knock.wav', cut[8] + 0.45, -8); fx(p, SFX1 + '/knock.wav', cut[8] + 0.7, -10);
  return p;
}

// ---------------------------------------------------------------------------
// THE PALAVA DESK — "Sacks out, wrappers back": two truths, neither leaves the table.
export function palava() {
  const [p, c, s] = make('palava');
  const b = (...q) => cs(c, ...q);
  const cut = [0, b('the first is'), b('we built a whole'), b('while the states', 'cocoa processing company'), b('that is why'), b('and a country selling'), b('the second truth'), b('a factory forced'), b('the budget talks'), s.dur].map((t, i) => i ? t - 0.1 : 0);
  const sc = (i, html, o = {}) => p.scene(cut[i], cut[i + 1], html, o);
  const tcard = (lbl, at, x, rot) => card(p, `${mono(lbl, { size: 30 })}<div style="height:150px;margin-top:14px;background:repeating-linear-gradient(45deg,#E9DFC7 0 12px,#F3EBD7 12px 24px);border:2px solid var(--ink)"></div>`, at, { x, y: 470, w: 420, rot });
  sc(0, `${head(p, 'THE QUESTION ON THE WRAPPER', 0.1, 'Two truths. Neither leaves the *table.*', b('two truths') - 0.1, { size: 84, w: 1100 })}
    ${tcard('TRUTH No. 1', b('two truths') + 0.3, 150, -2)}${tcard('TRUTH No. 2', b('two truths') + 0.7, 640, 2)}
    ${st(p, 'chocolate-note', 0.3, { x: 1350, y: 200, w: 340, rot: -8, life: 'bob', until: cut[1], sfx: SFX + '/crinkle.wav', db: -12 })}`, { enter: 'cut' });
  // 1 — the bar split into shares: 70% brands & retailers, 11% farmer
  const seg_ = (id, w, col, at, lbl, txtCol = '#FCF5E8') => { p.tl.push(`tl.fromTo("#${id}", {scaleY:0}, {scaleY:1, duration:${SP.heavy}, ease:"sp-heavy"}, ${r3(at)});`); p.ev(at); fx(p, 'snap.wav', at, -10);
    return `<div id="${id}" style="width:${w}px;height:260px;background:${col};border-right:6px solid #2A1A10;transform-origin:50% 100%;display:flex;align-items:flex-end;padding:18px;box-sizing:border-box;color:${txtCol};font-family:'Playfair Display',serif;font-weight:900;font-size:44px;line-height:1">${lbl}</div>`; };
  const s70 = b('about 70'), s11 = b('takes about 11', 'about 11');
  sc(1, `${head(p, 'TRUTH No. 1', cut[1] + 0.1, 'The money never lived on the *farm.*', cut[1] + 0.2, { size: 84 })}
    <div style="position:absolute;left:150px;top:430px;width:1620px">
      <div style="display:flex;height:260px;border:6px solid #2A1A10;box-shadow:12px 14px 0 #2A1A10;background:#5A3A22">
        ${seg_(p.id_('s'), 1134, '#A4241B', s70, '70% · brands &amp; shops')}${seg_(p.id_('s'), 292, '#7B5A3E', s70 + 0.6, '19% · the rest')}${seg_(p.id_('s'), 178, '#C8962F', s11, '11%', '#1A1612')}</div>
      <div class="mono" style="display:flex;justify-content:space-between;font-size:22px;font-weight:700;margin-top:26px"><span>A CHOCOLATE BAR’S VALUE · FAO-CITED STUDY</span><span style="color:#8A6420">THE FARMER ↑</span></div></div>
    ${p.chip('a study cited by the UN food agency (FAO)', b('a study cited'), { kind: 'chip light', x: 150, y: 330 })}
    ${p.chip('brands & shops at the end of the chain', b('brands and shops'), { kind: 'chip red', x: 900, y: 330 })}`);
  // 2 — the system: loans on raw beans; grinders under half used (gauge)
  const nd = p.id_('nd'), g0 = b('have run at under', 'under half');
  p.tl.push(`tl.fromTo("#${nd}", {rotation:-90}, {rotation:60, duration:1.0, ease:"sp-default"}, ${r3(b('half a million') - 0.2)});`);
  p.tl.push(`tl.to("#${nd}", {rotation:-14, duration:${SP.heavy}, ease:"sp-heavy", immediateRender:false}, ${r3(g0)});`); p.ev(g0); fx(p, 'grind.wav', b('grinding factories'), -16); fx(p, 'drop.wav', g0, -14);
  sc(2, `${head(p, 'WE BUILT A SYSTEM TO SELL BEANS', cut[2] + 0.1, 'Factories built for more, running on *less.*', b('grinding factories') - 0.2, { size: 72 })}
    <div style="position:absolute;left:1130px;top:350px;width:640px;height:380px">
      <svg width="640" height="380" viewBox="0 0 640 380"><path d="M60 330 A 260 260 0 0 1 580 330" fill="none" stroke="#E2D4B3" stroke-width="56"/><path d="M60 330 A 260 260 0 0 1 320 70" fill="none" stroke="#C8962F" stroke-width="56"/>
        <text x="40" y="372" font-family="IBM Plex Mono" font-weight="700" font-size="20">0</text><text x="500" y="372" font-family="IBM Plex Mono" font-weight="700" font-size="20">500,000+ t</text></svg>
      <div id="${nd}" style="position:absolute;left:316px;top:110px;width:8px;height:222px;background:var(--red);transform-origin:4px 220px;border-radius:4px"></div>
      <div style="position:absolute;left:296px;top:310px;width:48px;height:48px;border-radius:50%;background:var(--ink)"></div>
      <div class="mono" style="position:absolute;left:0;right:0;top:-40px;text-align:center;font-size:22px;font-weight:700">GRINDING CAPACITY · UNDER HALF USED</div></div>
    ${stack(p, [['built for 500,000+ tonnes a year', b('half a million'), 'chip light'], ['the loan was secured with raw beans', b('secured with raw', 'with raw beans'), 'chip light'], ['surviving on discounted light-crop beans', b('light crop', 'discounted'), 'chip gold'], ['paying heavily for power & borrowing', b('paying heavily'), 'chip red']], { y: 430 })}
    ${st(p, 'factory', cut[2] + 0.3, { x: 820, y: 640, w: 280, rot: -3, life: 'jiggle', until: cut[3] })}`);
  // 3 — the state's own processor, Tema: five years of losses
  sc(3, `${head(p, 'COCOA PROCESSING COMPANY · TEMA', cut[3] + 0.1, 'Losses, five years *running.*', cut[3] + 0.3, { size: 92 })}
    <div style="position:absolute;left:150px;top:430px;display:flex;align-items:baseline;gap:24px">${counter(p, b('for five years', 'five years'), 5, { size: 200, color: 'var(--red)' })}<span class="mono" style="font-size:30px;font-weight:700">YEARS OF LOSSES</span></div>
    ${st(p, 'factory', cut[3] + 0.2, { x: 1200, y: 170, w: 540, rot: 2, life: 'jiggle', until: cut[4], sfx: SFX + '/grind.wav', db: -18 })}`);
  // 4 — EDITOR'S VIEW: stop exporting raw beans; every stage at home
  const STG = [['GRINDING', b('grinding,', 'grinding')], ['PRESSING', b('pressing')], ['PACKING', b('packing')], ['BRANDING', b('branding')]];
  sc(4, `${p.stamp("EDITOR'S VIEW", cut[4] + 0.2, { x: 150, y: 130, rot: -4, size: 52 })}
    <div class="hl" style="left:150px;top:250px;width:1100px"><h1 style="font-size:96px">${p.words(p.id_('ev'), 'Stop exporting *raw beans.*', b('raw beans must stop', 'must stop') - 0.6, { stagger: 0.07 })}</h1></div>
    <div style="position:absolute;left:150px;top:520px;display:flex;gap:18px">${STG.map(([t, at], i) => p.chip(t, at, { kind: i % 2 ? 'chip gold' : 'chip red' })).join('<span style="font-size:44px;align-self:center">→</span>')}</div>
    ${p.chip('every stage we add at home…', b('every stage'), { kind: 'chip light', x: 150, y: 650 })}
    ${p.chip('a job here · dollars here', b('a job here'), { kind: 'chip gold', x: 700, y: 650 })}
    ${st(p, 'cocoa-sack', cut[4] + 0.4, { x: 1380, y: 220, w: 380, rot: 4, life: 'bob', until: cut[5] })}`);
  fx(p, 'thump.wav', cut[4] + 0.3, -8);
  // 5 — butter, powder and chocolate
  sc(5, `${head(p, 'A COUNTRY THAT SELLS', cut[5] + 0.1, 'Butter, powder and *chocolate…*', b('butter, powder', 'butter') - 0.1, { size: 90 })}
    ${stack(p, [['…is not ruined by one bad year in one raw price', b('is not ruined', 'not ruined'), 'chip gold']], { y: 470 })}
    ${st(p, 'products', b('butter, powder', 'butter'), { x: 1180, y: 170, w: 580, rot: 0, life: 'bob', until: cut[6], sfx: SFX + '/sparkle.wav', db: -14 })}`);
  // 6 — the table turns: TRUTH No. 2 — a mandate is not a market
  const fl = p.id_('fl');
  p.tl.push(`tl.fromTo("#${fl}", {rotationY:180}, {rotationY:0, duration:${SP.heavy}, ease:"sp-heavy"}, ${r3(cut[6] + 0.3)});`); p.ev(cut[6] + 0.3); p.ev(b('a mandate is not', 'a mandate')); fx(p, SFX1 + '/whip.wav', cut[6] + 0.3, -12); fx(p, SFX1 + '/paper-slap.wav', cut[6] + 0.7, -12);
  sc(6, `<div style="position:absolute;left:0;right:0;top:120px;text-align:center">${p.kicker('THE TABLE TURNS · TRUTH No. 2', cut[6] + 0.1)}</div>
    <div style="position:absolute;left:330px;top:240px;width:1260px;perspective:1600px"><div id="${fl}" style="background:#FCF5E8;border:6px solid var(--ink);box-shadow:16px 18px 0 var(--ink);padding:60px 70px;backface-visibility:hidden">
      <div class="mono" style="font-size:24px;font-weight:700;letter-spacing:.2em;color:var(--red)">WHAT THE PROCESSORS PUT ON THE TABLE</div>
      <div style="font-family:'Playfair Display',serif;font-weight:900;font-size:110px;line-height:1.02;margin-top:20px">${p.words(p.id_('mm'), 'A mandate is not a *market.*', b('a mandate is not', 'a mandate'), { stagger: 0.07 })}</div></div></div>`, { enter: 'iris' });
  // 7 — the factory that bleeds; stock rotting in warehouses
  sc(7, `${head(p, 'A FACTORY FORCED TO…', cut[7] + 0.1, '…buy high at home, sell *cheap* abroad.', cut[7] + 0.3, { size: 78 })}
    ${stack(p, [['beans at a high local price', b('high local price'), 'chip light'], ['butter into a cheap world market', b('cheap world market'), 'chip light'], ['…it bleeds', b('bleeds'), 'chip red'], ['no finance, no buyers → stock rotting', b('rotting in warehouses', 'rotting'), 'chip gold']], { y: 430 })}
    ${away(p, st(p, 'factory', cut[7] + 0.3, { x: 1220, y: 180, w: 520, rot: -2, life: 'jiggle', until: b('rotting in warehouses', 'rotting') }), b('rotting in warehouses', 'rotting') - 0.35)}
    ${st(p, 'warehouse', b('rotting in warehouses', 'rotting'), { x: 1260, y: 160, w: 440, rot: 3, life: 'bob', until: cut[8], sfx: SFX + '/thump.wav', db: -12 })}`);
  fx(p, 'drop.wav', b('bleeds') - 0.1, -14);
  // 8 — 2030: before the deadline, or after the warehouses fill?
  sc(8, `${head(p, 'THE BUDGET TALKS OF ENDING RAW EXPORTS BY…', cut[8] + 0.1, '*2030.*', b('by 2030') - 0.1, { size: 220, w: 1400 })}
    ${stack(p, [['the factories?', b('whether the factories', 'the factories'), 'chip light'], ['the power?', b('the power'), 'chip light'], ['the buyers?', b('and the buyers', 'the buyers'), 'chip light']], { y: 560 })}
    ${p.stamp('BEFORE THE DEADLINE…', b('before that deadline', 'deadline'), { x: 900, y: 600, rot: -3, size: 44 })}
    ${p.stamp('…OR AFTER THE WAREHOUSES FILL?', b('after the warehouses', 'warehouses fill'), { x: 900, y: 720, rot: 3, size: 40, color: 'var(--ink)' })}`);
  for (let k = 0; k < 6; k++) fx(p, 'tick.wav', b('by 2030') + k * 0.5, -18);
  return p;
}

// ---------------------------------------------------------------------------
// THEN v NOW — 1947 Cocoa Marketing Board / 2025 GoldBod. The gold pin returns.
export function thennow() {
  const [p, c, s] = make('thennow');
  const b = (...q) => cs(c, ...q);
  const cut = [0, b('the ghana gold board'), b('and its chief'), b('though what'), b("coco's story", 'story is also'), b('and here is the smallest'), b('the smuggling has turned'), b('it would be'), s.dur].map((t, i) => i ? t - 0.1 : 0);
  const sc = (i, html, o = {}) => p.scene(cut[i], cut[i + 1], html, o);
  const gp = p.id_('gp');
  p.tl.push(`tl.fromTo("#${gp}", {opacity:0, y:-420, rotation:-30}, {opacity:1, y:0, rotation:0, duration:${SP.playful}, ease:"sp-playful"}, 1.2);`); fx(p, 'sparkle.wav', 1.4, -12); p.ev(1.2);
  const half = (side, yr, lbl, stk, at) => `<div style="position:absolute;left:${side ? 980 : 0}px;top:0;width:940px;height:1080px;background:${side ? '#F7EDD3' : '#EADDBE'}">
      <div style="position:absolute;left:80px;top:130px">${p.kicker(side ? 'NOW' : 'THEN', at)}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:150px;line-height:1">${p.words(p.id_('y'), yr, at + 0.1)}</div><div class="mono" style="font-size:30px;font-weight:700;margin-top:10px">${lbl}</div></div>
      ${st(p, stk, at + 0.3, { x: 420, y: 470, w: 420, rot: side ? 3 : -3, life: 'bob', until: cut[1] + 0.5, sfx: side ? SFX + '/sparkle.wav' : SFX1 + '/coins.wav', db: -14 })}</div>`;
  sc(0, `${half(0, '1947', 'A COLONY · A SINGLE BUYER FOR COCOA', 'cocoa-sack', 0.2)}${half(1, '2025', 'A REPUBLIC · A SINGLE BUYER FOR GOLD', 'gold-refine', b('now, a republic', 'a republic') - 0.1)}
    <div style="position:absolute;left:958px;top:0;width:44px;height:1080px;background:var(--ink)"></div>
    <div id="${gp}" style="position:absolute;left:250px;top:560px;opacity:0"><svg width="56" height="96" viewBox="0 0 44 76"><path d="M22 74 L22 34" stroke="#1A1612" stroke-width="4"/><circle cx="22" cy="22" r="19" fill="#C8962F" stroke="#1A1612" stroke-width="4"/><circle cx="16" cy="16" r="5" fill="#F7E3A1"/></svg></div>`, { enter: 'cut', bg: 'none' });
  sc(1, `${head(p, 'THE GHANA GOLD BOARD · GOLDBOD', cut[1] + 0.1, 'The *only* buyer of small-scale gold.', cut[1] + 0.3, { size: 76 })}
    ${stack(p, [['buy · assay · export', b('buy, assay', 'assay'), 'chip light'], ['+ up to 54 more in the first half of 2026', b('up to 54'), 'chip gold']], { y: 420 })}
    <div style="position:absolute;left:150px;top:640px;display:flex;align-items:baseline;gap:24px">${counter(p, b('about 104'), 104, { size: 170, color: 'var(--gold)', sfx: 'sparkle.wav' })}<span class="mono" style="font-size:30px;font-weight:700">TONNES BOUGHT IN 2025</span></div>
    ${st(p, 'gold-refine', cut[1] + 0.3, { x: 1260, y: 200, w: 480, rot: 3, life: 'pulse', until: cut[2], sfx: SFX + '/sparkle.wav', db: -14 })}`);
  sc(2, `${card(p, `${mono('GOLDBOD · 2025', { size: 26 })}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:150px;line-height:1;margin-top:10px">80–90%</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:48px">refined in Ghana</div><div class="mono" style="font-size:20px;margin-top:8px;color:var(--muted)">— ITS CHIEF EXECUTIVE</div>`, cut[2] + 0.3, { x: 150, y: 150, w: 900, rot: -1 })}
    ${p.stamp('REFINED AT HOME', b('refined in ghana'), { x: 160, y: 560, rot: -4, size: 46 })}
    ${stack(p, [['in a year: what cocoa struggled with for nearly 80', b('doing in a year', 'in a year'), 'chip gold']], { y: 700 })}
    ${st(p, 'gold-cocoa', cut[2] + 1.0, { x: 1260, y: 200, w: 480, rot: -3, life: 'bob', until: cut[3] })}`);
  fx(p, 'thump.wav', cut[2] + 0.45, -10);
  sc(3, `${head(p, 'WHAT DID THOSE FIRST ACCOUNTS COST?', cut[3] + 0.1, 'The Bank of Ghana bill: *still argued over.*', cut[3] + 0.3, { size: 76 })}
    ${p.stamp('MORE IN EDITION 5', b('fifth edition'), { x: 170, y: 520, rot: -5, size: 72 })}
    ${st(p, 'purse', cut[3] + 0.4, { x: 1300, y: 260, w: 420, rot: 4, life: 'sway', until: cut[4] })}`);
  sc(4, `${card(p, `${mono('WHAT COCOA TEACHES GOLD', { size: 28 })}${H(p, 'Cocoa’s story is gold’s *warning.*', cut[4] + 0.2, 70)}`, cut[4] + 0.1, { x: 150, y: 130, w: 1200 })}
    ${card(p, `<div style="display:flex;gap:24px;align-items:center">${st(p, 'farmer-walk', b('watches its product', 'walk across') - 0.2, { abs: false, w: 160, life: 'bob', until: cut[5] })}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:40px;line-height:1.1">Pay too little → your product <span style="color:var(--red)">walks across the border.</span></div></div>`, b('a single buyer that'), { x: 150, y: 430, w: 1600 })}
    ${card(p, `<div style="display:flex;gap:24px;align-items:center">${st(p, 'purse', b('borrows against') - 0.1, { abs: false, w: 150, life: 'bob', until: cut[5] })}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:40px;line-height:1.1">Borrow against your crop → <span style="color:var(--red)">lose control of it.</span></div></div>`, b('borrows against'), { x: 150, y: 680, w: 1600 })}`);
  // 5 — the corner classified enlarges to full screen; the map arrow flips direction
  const cl = p.id_('cl');
  p.tl.push(`tl.fromTo("#${cl}", {scale:0.28, x:620, y:380}, {scale:1, x:0, y:0, duration:${SP.heavy}, ease:"sp-heavy"}, ${r3(cut[5] + 0.2)});`); fx(p, 'swoop.wav', cut[5] + 0.2, -12); fx(p, 'hit.wav', cut[5] + 0.6, -14);
  sc(5, `<div id="${cl}" style="position:absolute;left:150px;top:150px;width:1620px;height:740px;background:#FCF5E8;border:5px dashed var(--ink);padding:40px 60px;transform-origin:100% 100%">
      <div class="lbl mono" style="display:flex;justify-content:space-between;font-size:26px;font-weight:700;letter-spacing:.1em"><span>CLASSIFIED</span><b style="color:var(--red)">WESTERN BORDER</b></div>
      <div style="font-family:'Playfair Display',serif;font-weight:900;font-size:96px;line-height:1.02;margin-top:40px">Which way are the smugglers carrying cocoa <span style="color:var(--red)">this year?</span></div>
      ${st(p, 'smuggler-bike', cut[5] + 1.2, { x: 1150, y: 380, w: 380, rot: 3, life: 'jiggle', until: cut[6], sfx: SFX + '/bike-bell.wav', db: -12 })}</div>`, { enter: 'cut' });
  const arr = p.id_('ar'), flip = b('the smuggling has turned', 'has turned around');
  p.tl.push(`tl.fromTo("#${arr}", {scaleX:1}, {scaleX:-1, duration:${SP.heavy}, ease:"sp-heavy"}, ${r3(b('but this year') )});`); p.ev(b('but this year')); fx(p, 'swoop.wav', b('but this year'), -10);
  sc(6, `${head(p, 'THE SMALLEST ITEM ON PAGE ONE', cut[6] + 0.1, 'The smuggling has *turned around.*', cut[6] + 0.2, { size: 84 })}
    <div style="position:absolute;left:150px;top:400px;width:1000px;height:360px">
      <div style="position:absolute;left:0;top:0;width:480px;height:360px;background:#E8D9B5;border:4px solid var(--ink)"><div class="mono" style="position:absolute;left:20px;top:16px;font-size:24px;font-weight:700">CÔTE D’IVOIRE</div></div>
      <div style="position:absolute;left:520px;top:0;width:480px;height:360px;background:#F2E6C6;border:4px solid var(--ink)"><div class="mono" style="position:absolute;right:20px;top:16px;font-size:24px;font-weight:700">GHANA</div></div>
      <div style="position:absolute;left:496px;top:-10px;width:8px;height:380px;background:repeating-linear-gradient(180deg,var(--red) 0 18px,transparent 18px 30px)"></div>
      <div id="${arr}" style="position:absolute;left:200px;top:150px;width:600px;height:70px;transform-origin:300px 35px"><svg width="600" height="70"><line x1="560" y1="35" x2="60" y2="35" stroke="#A4241B" stroke-width="16"/><path d="M80 5 L20 35 L80 65" fill="none" stroke="#A4241B" stroke-width="16" stroke-linejoin="round"/></svg></div></div>
    ${stack(p, [['for decades: west', b('for decades'), 'chip light'], ['this year: Ghana pays more', b('paying more'), 'chip gold'], ['Ivorian cocoa at ~GH¢1,200 a bag…', b('cheaper ivorian', 'ivorian'), 'chip red'], ['…passed off as Ghanaian', b('passing it off'), 'chip red']], { x: 1210, y: 400 })}`);
  sc(7, `<div class="hl" style="left:150px;top:200px;width:1600px"><h1 style="font-size:130px">${p.words(p.id_('en'), 'E no be *small thing.*', cut[7] + 0.15, { stagger: 0.09 })}</h1></div>
    ${stack(p, [['some of that gold is dug out of cocoa farms', b('dug out of cocoa', 'dug out'), 'chip gold']], { y: 520 })}
    ${p.stamp('EDITION 10 · THIS SEASON’S LAST', b("season's last", 'last edition'), { x: 170, y: 680, rot: -4, size: 52 })}
    ${st(p, 'gold-cocoa', b('dug out of cocoa', 'dug out') + 0.1, { x: 1350, y: 250, w: 420, rot: 4, life: 'pulse', until: s.dur })}`);
  fx(p, 'hit.wav', cut[7] + 0.2, -14);
  return p;
}

// ---------------------------------------------------------------------------
// THE TEAM ASIDE — back at the living Nest: Baaba, The Ascendant. Kofi tells it; she does not speak.
export function team() {
  const [p, c, s] = make('team');
  const b = (...q) => cs(c, ...q);
  const cut = [0, b('the quietest'), b('this february'), b('she bought'), b('when kwame'), s.dur].map((t, i) => i ? t - 0.1 : 0);
  // 0 — back at the Nest: the camera crosses the room to her desk
  const N = livingNest(p, 0, cut[1], { grade: 'evening', truck: 40, seed: 9, start: { scale: 1.05, x: 0, y: 0 } });
  N.aim([520, 430], 1.7, b('belongs to') - 0.3);
  p.scene(0, cut[1], `${N.html}
    ${card(p, `${mono('BACK AT THE NEST')}${H(p, 'The handwriting belongs to *Baaba.*', b('belongs to') - 0.2, 60)}`, 0.1, { x: 110, y: 120, w: 900 })}
    ${nameCard(p, b('the ascendant', 'call the ascendant'), { y: 560, role: 'THE ASCENDANT', name: 'Baaba', note: 'new at the Nest this edition' })}`, { bg: 'none', enter: 'cut', drift: 0 });
  nestBed(p, 0, cut[1] + 0.5, -22);
  fx(p, 'hit.wav', b('the ascendant', 'call the ascendant'), -18);
  p.scene(cut[1], cut[2], `${head(p, 'BAABA · THE ASCENDANT', cut[1] + 0.1, 'The quietest in the room. Often the *cleverest.*', cut[1] + 0.2, { size: 70 })}
    ${st(p, 'baaba-desk', cut[1] + 0.3, { x: 1120, y: 170, w: 640, rot: -1, life: 'bob', until: b('school fees') })}
    ${stack(p, [['school fees came from a family cocoa farm', b('school fees'), 'chip gold'], ['every report card read aloud like a royal letter', b('report card'), 'chip light']], { y: 470 })}
    ${away(p, '', b('school fees') - 0.2)}
    ${st(p, 'report-card', b('report card'), { x: 1300, y: 520, w: 300, rot: 6, life: 'sway', until: cut[2], sfx: SFX1 + '/paper-slap.wav' })}`);
  fx(p, SFX1 + '/bell.wav', b('royal letter') , -20);
  p.scene(cut[2], cut[3], `${head(p, 'THIS FEBRUARY', cut[2] + 0.1, 'The cocoa money *did not come.*', cut[2] + 0.4, { size: 92 })}
    ${p.stamp('FOR THE FIRST TIME', b('for the first time'), { x: 160, y: 470, rot: -4, size: 56 })}
    ${stack(p, [['instead of complaining…', b('instead of complaining'), 'chip light'], ['…she did what Baaba does', b('she did what'), 'chip gold']], { y: 620 })}
    ${st(p, 'family-farm', cut[2] + 0.3, { x: 1260, y: 200, w: 460, rot: 3, life: 'sway', until: cut[3] })}`);
  // 3 — close-up: the wrapper, "11%" written across it in red ink
  const ink = p.id_('ink'), w11 = b('wrote 11', '11 %');
  p.tl.push(`tl.fromTo("#${ink}", {clipPath:"inset(0% 100% 0% 0%)"}, {clipPath:"inset(0% 0% 0% 0%)", duration:0.9, ease:"power1.inOut"}, ${r3(w11)});`); p.ev(w11); fx(p, 'scribble.wav', w11, -10, 1.2);
  p.scene(cut[3], cut[4], `<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 60% 45%, #6B4A2E 0%, #3B2A1C 70%)"></div>
    ${card(p, `${mono('CLOSE-UP · THE WRAPPER')}${H(p, 'Imported chocolate. *11%* in red ink.', cut[3] + 0.2, 56)}`, cut[3] + 0.1, { x: 110, y: 120, w: 820 })}
    <div style="position:absolute;left:1060px;top:90px;width:560px;height:880px">${st(p, 'chocolate-note', cut[3] + 0.2, { x: 0, y: 0, w: 560, rot: -6, life: 'bob', until: cut[4] + 0.5, sfx: SFX + '/crinkle.wav', db: -12 })}
      <div id="${ink}" class="hand" style="position:absolute;left:150px;top:300px;font-size:150px;line-height:1;color:#B3261E;transform:rotate(-12deg)">11%</div></div>
    ${p.chip('the farmer’s share', b("farmer's share", 'the farmer'), { kind: 'chip gold', x: 110, y: 480 })}
    ${p.chip('left on the shared table', b('left it on', 'shared table'), { kind: 'chip light', x: 110, y: 570 })}`, { bg: 'none', enter: 'iris' });
  // 4 — the living Nest again: Kwame reaches; she slides the wrapper toward him; he puts his hand down
  const t4 = cut[4];
  const N2 = livingNest(p, t4, s.dur, { grade: 'evening', truck: 30, seed: 11, start: aimStart(900, 520, 1.9) });
  const slide = p.id_('sl'), kw = p.id_('kw');
  N2.aim([1150, 520], 1.6, b('his face said') - 0.2); N2.aim([960, 540], 1.15, b('i will tell you', 'in good time') - 0.3);
  p.tl.push(`tl.fromTo("#${slide}", {x:0, rotation:-70}, {x:-150, rotation:-62, duration:1.2, ease:"sp-default"}, ${r3(b('she slid', 'slid the wrapper'))});`); p.ev(b('she slid', 'slid the wrapper'));
  fx(p, 'crinkle.wav', b('she slid', 'slid the wrapper'), -10);
  p.scene(t4, s.dur, `${N2.html.replace('</div></div>\n    <div', `</div></div>\n    <div`)}
    <img id="${slide}" src="${p.asset(STK + '/chocolate-note.png')}" style="position:absolute;left:930px;top:470px;width:120px;transform:rotate(-70deg);filter:drop-shadow(0 6px 6px rgba(0,0,0,.45))">
    ${st1(p, 'kwame-boxer', b('when kwame'), { x: 1330, y: 360, w: 330, rot: 4, life: 'sway', until: s.dur, sfx: SFX1 + '/whip.wav' })}
    ${pin(p, 'Kwame · The Combative', 1460, 360, b('when kwame') + 0.2, -340, -80)}
    ${card(p, `<div class="hand" style="font-size:72px;color:#1A1612;line-height:1">“The thing pain me oo…”</div>${mono('— HIS FACE SAID', { size: 18, color: 'var(--muted)' })}`, b('this thing', 'his face said') - 0.1, { x: 110, y: 130, w: 760, rot: -2 })}
    ${p.chip('…and for once, no reply', b('no reply'), { kind: 'chip red', x: 110, y: 420 })}
    ${p.chip('More about Baaba in good time.', b('i will tell you', 'in good time'), { kind: 'chip gold', x: 110, y: 510 })}`, { bg: 'none', enter: 'wipeL', drift: 0 });
  nestBed(p, t4, s.dur, -22);
  return p;
}
const aimStart = (x, y, sc) => { const mx = (sc - 1) * 960 - 4, my = (sc - 1) * 540 - 4; return { scale: sc, x: Math.max(-mx, Math.min(mx, (960 - x) * sc)), y: Math.max(-my, Math.min(my, (540 - y) * sc)) }; };

// ---------------------------------------------------------------------------
// THE EDITOR'S NOTE — "The raw take": a raw studio take, then the same phrase mixed and mastered.
export function editor() {
  const [p, c, s] = make('editor');
  const b = (...q) => cs(c, ...q);
  const cut = [0, b('the money is in'), b('for 147'), s.dur].map((t, i) => i ? t - 0.1 : 0);
  const wave_ = (id, clean) => { const pts = Array.from({ length: 120 }, (_, i) => { const x = i * 8, a = clean ? 70 * Math.sin(i * 0.31) * Math.sin(i * 0.05 + 0.4) : 40 * Math.sin(i * 0.9) + 30 * Math.sin(i * 2.7 + 1) * ((i % 7) / 7); return `${x},${(110 + a).toFixed(1)}`; }).join(' ');
    p.tl.push(`tl.fromTo("#${id}", {strokeDashoffset:3000}, {strokeDashoffset:0, duration:1.6, ease:"none"}, ${r3(clean ? b('the mix', 'in the mix') : b('the raw take'))});`);
    return `<svg width="960" height="220"><polyline id="${id}" points="${pts}" fill="none" stroke="${clean ? '#C8962F' : '#6B6253'}" stroke-width="${clean ? 6 : 4}" stroke-dasharray="3000" stroke-dashoffset="3000"/></svg>`; };
  p.scene(0, cut[1], `${head(p, 'THE RAW TAKE', 0.1, 'Nobody pays for the *raw take.*', b('nobody pays') - 0.1, { size: 92 })}
    ${stack(p, [['a year of live & studio sound', b('live and studio'), 'chip light']], { y: 430 })}
    <div style="position:absolute;left:150px;top:560px">${wave_(p.id_('wr'), false)}</div>
    ${st1(p, 'sound-desk', 0.4, { x: 1250, y: 220, w: 500, rot: 4, life: 'jiggle', until: cut[1] })}`, { enter: 'cut' });
  fx(p, 'raw-take.wav', b('the raw take'), -10);
  p.scene(cut[1], cut[2], `${head(p, 'THE MONEY IS IN…', cut[1] + 0.1, 'The mix. The master. The *name on the sleeve.*', cut[1] + 0.2, { size: 76 })}
    <div style="position:absolute;left:150px;top:520px">${wave_(p.id_('wm'), true)}</div>
    ${st(p, 'vinyl', b('the record', 'name on the sleeve') - 0.2, { x: 1250, y: 230, w: 480, rot: -3, life: 'spin', until: cut[2] })}`);
  fx(p, 'mastered.wav', b('the mix', 'in the mix') - 0.1, -8);
  p.scene(cut[2], s.dur, `<div style="position:absolute;left:150px;top:150px;display:flex;align-items:baseline;gap:28px">${counter(p, cut[2] + 0.2, 147, { size: 220, color: 'var(--red)' })}<span class="mono" style="font-size:34px;font-weight:700">YEARS OF RAW TAKES</span></div>
    ${stack(p, [['some of the finest cocoa on earth', b('the finest cocoa', 'finest cocoa'), 'chip gold'], ['…and somebody else does the mixing', b('somebody else'), 'chip red']], { y: 520 })}
    ${st(p, 'cocoa-sack', cut[2] + 0.5, { x: 1200, y: 360, w: 300, rot: -4, life: 'bob', until: s.dur })}
    ${st(p, 'chocolate-note', b('somebody else'), { x: 1530, y: 300, w: 230, rot: 8, life: 'bob', until: s.dur, sfx: SFX + '/register.wav', db: -14 })}`);
  fx(p, SFX + '/crackle.wav', cut[2], -26, 4);
  return p;
}

// ---------------------------------------------------------------------------
// LETTERS PAGE — this week's challenge + a pinned-comment graphic.
export function letters() {
  const [p, c, s] = make('letters');
  const b = (...q) => cs(c, ...q);
  const q = b('so, should', 'should cocobod');
  const pc = p.id_('pc');
  p.grow(pc, q - 0.2, { rot: -1, from: 0.7, preset: 'heavy' }); fx(p, 'kachunk.wav', q - 0.1, -14);
  // the comment types itself word by word (normal spaces, so it wraps)
  const TXT = 'Challenge: GoldBod refines our gold at home. Should COCOBOD be made to process every bean by 2030, or will that fill our warehouses with stock nobody buys? Tell us why.'.split(' ');
  const body = TXT.map((w, i) => { const id = p.id_('cw'), at = q + 0.2 + i * 0.16; p.tl.push(`tl.set("#${id}", {opacity:1}, ${r3(at)});`); if (i % 2 === 0) fx(p, 'key.wav', at, -24); if (i % 6 === 0) p.ev(at); return `<span id="${id}" style="opacity:0">${w}</span>`; }).join(' ');
  p.scene(0, s.dur, `${head(p, 'LETTERS PAGE', 0.1, 'This week: a *challenge.*', b('a challenge') - 0.1, { size: 96 })}
    ${p.icon('letters-pile', 0.4, { x: 1500, y: 110, w: 260, rot: 4, life: 'bob', until: s.dur, sfx: SFX1 + '/paper-slap.wav' })}
    <div id="${pc}" style="position:absolute;left:150px;top:400px;width:1080px;background:#FFFFFF;border-radius:18px;box-shadow:0 30px 60px -20px rgba(60,40,10,.45);padding:30px 36px">
      <div style="display:flex;align-items:center;gap:12px;font-family:'GCP Round',sans-serif;font-size:22px;color:#606060">📌 Pinned by Gold Coast Palava</div>
      <div style="display:flex;gap:20px;margin-top:16px"><div style="width:64px;height:64px;border-radius:50%;background:var(--red);color:#FCF5E8;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-weight:900;font-size:34px;flex:none">G</div>
        <div><div style="font-family:'GCP Round',sans-serif;font-weight:700;font-size:24px">@GoldCoastPalava</div><div style="font-family:'GCP Round',sans-serif;font-size:34px;line-height:1.35;margin-top:8px;color:#0F0F0F">${body}</div></div></div></div>
    ${stack(p, [['GoldBod: refined at home', b('goldbod refines', 'refines our gold'), 'chip gold'], ['tell us why in the comments', b('tell us why'), 'chip light'], ['I will pin the best one', b('pin the best'), 'chip red']], { x: 1290, y: 420 })}
    ${st1(p, 'comments-pin', b('the strongest letters', 'strongest letters'), { x: 1450, y: 720, w: 260, rot: 5, life: 'bob', until: s.dur })}`, { enter: 'cut' });
  return p;
}

// ---------------------------------------------------------------------------
// THE DISPATCH — typewriter, stamp, a bundle tied and carried out; then the closing montage (COMBO2).
export function dispatch() {
  const [p, c, s] = make('dispatch');
  p.css.push(BANNER_CSS);
  const b = (...q) => cs(c, ...q);
  const vEnd = (({ local0, vo_in, vo_out }) => local0 + vo_out - vo_in)(s.pieces[s.pieces.length - 1]);
  const aEnd = b('and dispatched to') - 0.1;
  const sig = p.id_('sg');
  p.tl.push(`tl.fromTo("#${sig}", {strokeDasharray:900, strokeDashoffset:900}, {strokeDashoffset:0, duration:1.3, ease:"power2.inOut"}, ${r3(b('filed and signed') + 0.3)});`); p.ev(b('filed and signed') + 0.3);
  p.sound('pen-2.mp3', b('filed and signed') + 0.3, -10);
  p.scene(0, aEnd, `<div class="hl" style="left:150px;top:150px;width:1600px">${p.kicker('DISPATCH', 0.1)}<h1 style="font-size:96px">${p.words(p.id_('fe'), 'The *second edition*, complete.', 0.25, { stagger: 0.07 })}</h1></div>
    <div style="position:absolute;left:150px;top:420px;display:flex;gap:16px">${p.chip('CHECKED', b('checked'), { kind: 'chip light' })}${p.chip('STAMPED', b('stamped'), { kind: 'chip light' })}${p.chip('≈ 50 MB', b('priced at'), { kind: 'chip gold' })}</div>
    <div class="mono" style="position:absolute;left:150px;top:560px;font-size:46px;font-weight:700;line-height:1.5">${p.typed('THE NEST · 266 SANDPIPER LOOP', b('at the nest'), { cps: 24 })}<br>${p.typed('ONIPA ENCLAVE', b('onipa enclave', 'enclave') - 0.6, { cps: 20, sfx: false })}</div>
    <svg style="position:absolute;left:1150px;top:560px" width="520" height="160" viewBox="0 0 460 140"><path id="${sig}" d="M10 90 C 40 20, 70 20, 80 80 S 120 120, 140 60 S 180 10, 200 70 S 240 110, 270 50 C 290 20, 320 100, 350 70 S 420 40, 450 60" fill="none" stroke="#1A1612" stroke-width="5" stroke-linecap="round"/></svg>
    ${p.print(PILOT + '/final/nest-light.png', b('at the nest') - 0.2, { x: 1320, y: 110, w: 470, rot: 2, caption: 'The Nest · 266 Sandpiper Loop' })}
    ${p.stamp('FILED', b('filed and signed') + 1.6, { x: 1250, y: 760, rot: -10, size: 80 })}`, { enter: 'cut' });
  fx(p, 'thump.wav', b('stamped') + 0.1, -8); fx(p, 'thump.wav', b('filed and signed') + 1.7, -6);
  const stops = [['to accra', 'ACCRA'], ['to kumasi', 'KUMASI'], ['to bungpurugu', 'BUNKPURUGU'], ['to harfasini', 'HALF ASSINI'], ['and to the world', 'THE WORLD']];
  const route = stops.map(([q, t], i) => p.chip(t, b(q), { kind: i === 4 ? 'chip gold' : 'chip', x: 150 + i * 340, y: 560 + (i % 2) * 120 })).join('');
  stops.forEach(([q]) => fx(p, SFX1 + '/pop-2.wav', b(q), -16));
  const path_ = p.id_('rt');
  p.tl.push(`tl.fromTo("#${path_}", {strokeDasharray:1800, strokeDashoffset:1800}, {strokeDashoffset:0, duration:${r3(b('and to the world') - b('to accra') + 0.5)}, ease:"none"}, ${r3(b('to accra'))});`);
  p.scene(aEnd, vEnd + 0.6, `<div class="hl" style="left:150px;top:200px;width:1600px">${p.kicker('…AND DISPATCHED TO', aEnd + 0.1)}<h1 style="font-size:104px">${p.words(p.id_('dp'), 'Chale, we go *crosh.*', b('chale, we go', 'we go crush'), { stagger: 0.08 })}</h1></div>
    <svg style="position:absolute;left:0;top:0" width="1920" height="1080"><path id="${path_}" d="M230 600 L570 720 L910 600 L1250 720 L1590 600" fill="none" stroke="#A4241B" stroke-width="5" stroke-dasharray="14 10"/></svg>${route}
    ${st1(p, 'folded-paper', aEnd + 0.3, { x: 1500, y: 140, w: 280, rot: 6, life: 'bob', until: vEnd + 0.6, sfx: SFX + '/bundle.wav', db: -10 })}`);
  const o0 = vEnd + 0.6;
  const bn = banner(p, 'ob', { t0: o0 + 0.2, speed: 1.15, until: s.dur - 3.0 });
  const sub = p.chip('SUBSCRIBE — so the next edition finds you', o0 + 3.2, { kind: 'chip red sub-sm' });
  const fold = s.dur - 3.0;
  p.tl.push(`tl.to("#ob-sym", ${JSON.stringify({ x: 494, y: -95, scale: 3.0, duration: SP.heavy, ease: 'sp-heavy', immediateRender: false })}, ${fold});`);
  p.tl.push(`tl.to("#ob > :not(#ob-sym)", {opacity:0, scale:0.6, duration:0.5, ease:"power2.in", immediateRender:false}, ${fold});`);
  p.ev(fold); p.ev(o0 + 7); p.ev(o0 + 10);
  p.sound('whoosh-2.mp3', fold, -12);
  p.scene(o0, s.dur, `${bn}<div style="position:absolute;left:0;right:0;top:690px;text-align:center">${sub}</div>`, { drift: 0.03, bg: 'plain' });
  p.mastEnd = o0;
  return p;
}

export const BUILDERS2 = { lead, wire, palava, thennow, team, editor, letters, dispatch };
