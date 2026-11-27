// Social reel (9:16) — Special No. 2, "Nineteen Years: The Rawlings Question": the client's own voice + SFX, no music,
// ~2:17. Opens on Kwame's grenade in the team chat, the rule, the vertical montage, then the catchiest beats in order;
// ends on "Now it is your turn…" over the ledger and the end card ("Watch the full Special on YouTube").
import fs from 'node:fs';
import crypto from 'node:crypto';
import { loadReel, captions, hl, kick, nameCard, counter, tallPic, tallVid, endCard, bannerP, enrichSfx, X0, SP } from './rlib.mjs';
import { Phone, PHONE_CSS } from '/home/user/gcp/sp2/build/phone.mjs';
const M = '/home/user/gcp/sp2/media', E1 = '/home/user/gcp/ed1/media', PS = '/home/user/gcp/project/media/sfx';
const img = (k) => [`${M}/real/${k}.jpg`, `${M}/real/${k}.png`].find((f) => fs.existsSync(f));
const n3 = (v) => +(+v).toFixed(3);
const spr = (k) => ({ duration: SP[k], ease: `sp-${k}` });
export const CLIPS = [];

export function build() {
  const { R, p, c, at, win } = loadReel('/home/user/gcp/reels/sp2', 'FULL SPECIAL ON YOUTUBE');
  p.css.push(PHONE_CSS, `@font-face { font-family:'Special Elite'; src:url('assets/special-elite.ttf') format('truetype'); }
    @font-face { font-family:'Noto Color Emoji'; src:url('assets/noto-emoji.ttf') format('truetype'); }
    .tw { font-family:'Special Elite','IBM Plex Mono',monospace; }
    .rcard { position:absolute; background:#FCF5E8; border:6px solid var(--ink); box-shadow:14px 16px 0 var(--ink); padding:34px 40px; }
    .strike { position:relative; display:inline-block; } .strike i { position:absolute; left:-3%; right:-3%; top:52%; height:10px; background:var(--red); transform-origin:0 50%; border-radius:4px; }`);
  const fx = (f, t, db = -16, len) => p.sfx.push({ file: f.startsWith('/') ? f : `${M}/sfx/${f}`, T: n3(t), db, ...(len ? { len } : {}) });
  const e1 = (f, t, db = -16, len) => fx(`${E1}/sfx/${f}`, t, db, len);
  const st = (name, t, o = {}) => { const dir = fs.existsSync(`${M}/stickers_cut/${name}.png`) ? `${M}/stickers_cut` : fs.existsSync(`${E1}/stickers_cut/${name}.png`) ? `${E1}/stickers_cut` : '/home/user/gcp/project/media/icons/cut';
    return p.icon(name, t, { dir, sfx: o.sfx ?? `${E1}/sfx/pop-2.wav`, db: -14, ...o }); };
  const tw = (text, t, size = 54, color = 'var(--red)', cps = 20) => p.typed(text, t, { cps, cls: 'tw' }).replace('class="tw"', `class="tw" style="font-size:${size}px;color:${color}"`);
  const card = (inner, t, { y = 700, x = X0, w = 940 } = {}) => { const id = p.id_('rc'); p.grow(id, t, { from: 0.8, dy: 60 }); return `<div id="${id}" class="rcard" style="left:${x}px;top:${y}px;width:${w}px">${inner}</div>`; };
  const quote = (text, t, { who = '', y = 700, size = 72, cardAt } = {}) => card(`${who ? `<div class="mono" style="font-size:26px;font-weight:700;letter-spacing:.2em;color:var(--red);margin-bottom:12px">${who}</div>` : ''}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:${size}px;line-height:1.06">${p.words(p.id_('q'), text, t, { stagger: 0.07 })}</div>`, cardAt ?? t - 0.12, { y });
  const strike = (text, t, { size = 96, x = X0, y }) => { const id = p.id_('sk'); p.tl.push(`tl.fromTo("#${id}", {scaleX:0}, ${JSON.stringify({ scaleX: 1, ...spr('snappy') })}, ${n3(t)});`); p.ev(t); e1('whip.wav', t, -16);
    return `<div style="position:absolute;left:${x}px;top:${y}px"><span class="strike" style="font-family:'Playfair Display',serif;font-weight:900;font-size:${size}px">${text}<i id="${id}"></i></span></div>`; };
  const dl = (text, t, { y = 280, size = 50, sting = true } = {}) => { if (sting) fx(`${PS}/syn-suspense.wav`, t - 0.1, -16); return `<div style="position:absolute;left:${X0}px;top:${y}px;border:5px solid var(--red);padding:12px 24px;background:rgba(252,245,232,.95)">${tw(text, t + 0.1, size)}</div>`; };
  const phone = (opts) => new Phone(p, { x: 290, y: 352, scale: 1.16, rot: -1, ...opts });

  // HOOK — 11:12 pm: Kwame's grenade in the team chat
  let [a, b] = win('hook');
  const yrs = c('19 years in power');
  p.scene(0, b, `${kick(p, '11:12 PM · KWAME, IN THE TEAM CHAT', 0.1, { y: 170, color: 'var(--gold)' })}`, { enter: 'cut', bg: 'ink' });
  { const ph = phone({ start: 0, end: b + 0.35, enter: 0.05, clock0: '11:12' });
    ph.divider('Today', 0.3);
    ph.msg({ who: 'Kwame', text: 'Six years today since JJ died. My uncle’s status is all “Junior Jesus” 🙄', time: '11:12 pm', at: 0.6 });
    ph.typing('Kwame', c('dropped a grenade') - 0.2, yrs - 0.2);
    ph.msg({ who: 'Kwame', text: '19 YEARS in power. 19!! And Ghana still dey like this?', time: '11:12 pm', at: yrs - 0.2 });
    ph.focus(yrs, 2.4, { s: 1.04, dx: 0, dy: -10 });
    ph.build(); }
  p.html.push(`<div class="clip" data-start="0" data-duration="${n3(b + 0.3)}" data-track-index="6" style="position:absolute;inset:0;z-index:720">
    ${p.stamp('19 YEARS', yrs + 0.2, { x: 520, y: 260, rot: -7, size: 76 })}</div>`);
  fx('wa-notify.wav', 0.1, -14); fx('vibrate.wav', 0.15, -16); e1('boom.wav', c('grenade'), -14);

  // THE RULE — not worship, not crucify: weigh
  [a, b] = win('rule');
  const weigh = c('we will weigh him');
  p.scene(a, b, `${kick(p, 'ONE RULE BEFORE WE START', a + 0.1)}
    ${strike('worship him', c('worship this man') + 0.4, { y: 300 })}
    ${strike('crucify him', c('crucify him') + 0.3, { y: 440 })}
    <div style="position:absolute;left:${X0}px;top:600px;font-family:'Playfair Display',serif;font-weight:900;font-size:120px;color:var(--red);width:940px;line-height:1">${p.words(p.id_('w'), 'We will weigh him.', weigh, { stagger: 0.1 })}</div>
    ${st('scales-balance', weigh + 0.2, { x: 250, y: 860, w: 580, life: 'sway', until: b + 0.4 })}`, { enter: 'wipeU' });

  // THE MONTAGE
  [a, b] = win('brand');
  p.scene(a, b, bannerP(p, 'bnr', { t0: a + 0.1, until: b + 0.4, lockY: 800 }).html, { enter: 'iris', bg: 'paper' });

  // 4 JUNE 1979 — broken out, chairman of the AFRC within hours, 112 days, executions
  [a, b] = win('june');
  p.scene(a, b, `${dl('ACCRA · 4 JUNE 1979', a + 0.1)}
    ${hl(p, 'Broken out of jail. *In power within hours.*', c('soldiers broke'), { size: 84, y: 400 })}
    ${tallPic(p, img('rawlings-1979'), a + 0.6, { y: 650, h: 520, until: b, pos: '50% 30%' })}
    ${p.chip('chairman of the AFRC within hours', c('chairman of'), { kind: 'chip gold', x: X0, y: 1200 })}
    ${p.stamp('112 DAYS', c('112 days', '112'), { x: 600, y: 600, rot: -6, size: 72 })}
    ${p.chip('eight senior officers executed', c('executed eight'), { kind: 'chip red', x: X0, y: 1300 })}`, { enter: 'wipeL' });

  // 1983 — three storms at once
  [a, b] = win('storms');
  const infl = c('inflation reached'), jan = c('and in january'), bags = c('the checked bags');
  p.scene(a, jan - 0.1, `${kick(p, 'THE 1% MOST OF US FORGET', a + 0.1)}
    ${hl(p, '1983: *three storms at once*', a + 0.2, { size: 100, y: 270 })}
    ${counter(p, 123, infl + 0.1, { size: 220, color: 'var(--red)', y: 520, suffix: '%', label: 'INFLATION' })}
    ${st('drought', c('the worst drought') - 0.1, { x: 140, y: 830, w: 800, life: 'pulse', until: jan })}
    ${p.chip('bushfires burned what was left', c('bushfires'), { kind: 'chip red', x: X0, y: 1300 })}`, { enter: 'iris' });
  p.scene(jan - 0.1, b, `${dl('JANUARY 1983 · NIGERIA', jan, { y: 260, sting: false })}
    ${p.chip('orders “illegal migrants” out', c('nigeria ordered'), { kind: 'chip light', x: X0, y: 390 })}
    ${counter(p, 1000000, c('so more than a million') + 0.2, { size: 150, y: 500, suffix: '+', label: 'GHANAIANS CAME HOME' })}
    ${st('ghana-must-go', bags - 0.2, { x: 230, y: 780, w: 620, rot: -4, life: 'bob', until: b + 0.4 })}
    ${p.chip('“Ghana Must Go”', c('ghana must go'), { kind: 'chip red', x: 300, y: 1330 })}`, { enter: 'wipeU' });

  // THE HARD STATE — tribunals, Makola, the 1982 murders
  [a, b] = win('hard');
  const same = c('and that same year');
  p.scene(a, same - 0.1, `${kick(p, 'PEOPLE’S POWER… BESIDE A HARD STATE', a + 0.1)}
    ${tallPic(p, img('rawlings-throne'), a + 0.2, { y: 280, h: 560, until: same, pos: '50% 35%' })}
    ${p.chip('public tribunals', a + 0.3, { kind: 'chip red', x: X0, y: 880 })}
    ${st('market-stall', c('makola') - 0.2, { x: 160, y: 960, w: 620, life: 'jiggle', until: same, sfx: `${PS}/crate-1.mp3` })}
    ${p.chip('Makola Market demolished · 1982', c('makola') + 0.3, { kind: 'chip light', x: X0, y: 1340 })}`, { enter: 'wipeR' });
  p.scene(same - 0.1, b, `${kick(p, '1982', same, { color: 'var(--red)' })}
    ${hl(p, 'Three High Court judges and a retired army major', c('three high court'), { size: 76, y: 280 })}
    ${st('judges-chairs', same + 0.2, { x: 120, y: 620, w: 840, life: 'float', until: b + 0.4, sfx: `${E1}/sfx/bell.wav` })}
    ${p.chip('abducted and murdered', c('abducted and murdered'), { kind: 'chip red', x: X0, y: 1120 })}
    ${p.chip('a crime that still haunts that era', c('still haunts'), { kind: 'chip light', x: X0, y: 1230 })}`, { enter: 'iris', bg: 'paper' });

  // RESCUE OR RETREAT — both
  [a, b] = win('rescue');
  p.scene(a, b, `${kick(p, 'THE IMF & WORLD BANK RECOVERY', a + 0.1)}
    ${hl(p, 'A rescue, or a retreat?', a + 0.15, { size: 104, y: 270 })}
    ${p.stamp('BOTH.', c('both'), { x: 560, y: 520, rot: -8, size: 96 })}
    ${st('devaluation', c('both') + 0.3, { x: 100, y: 560, w: 400, life: 'jiggle', until: b })}
    ${p.chip('the shelves filled', c('the shelves filled'), { kind: 'chip gold', x: X0, y: 1000 })}
    ${p.chip('urban workers swallowed the pain', c('but urban workers'), { kind: 'chip red', x: X0, y: 1110 })}
    ${p.chip('a self-reliant people’s economy…', c('and the dream'), { kind: 'chip light', x: X0, y: 1220 })}
    ${p.chip('…a market economy run by a soldier', c('run by a soldier') - 0.6, { kind: 'chip light', x: X0, y: 1330 })}`, { enter: 'wipeL' });

  // AHWOI — a born leader… and toy planes
  [a, b] = win('ahwoi');
  const planes = c('toy planes');
  p.scene(a, b, `${tallPic(p, img('ahwoi-book'), a + 0.1, { x: 590, y: 250, w: 420, h: 560, until: b, pos: '50% 40%', zoom: 1.04 })}
    ${nameCard(p, a + 0.2, 'Kwamena Ahwoi', 'Working with Rawlings · 2020', { y: 300, w: 500 })}
    ${quote('A born leader… *mesmerising charisma.*', c('a born leader') - 0.1, { who: 'AHWOI ON RAWLINGS', y: 860, size: 66 })}
    ${p.chip('but: no plan, no strategy', c('no plan'), { kind: 'chip red', x: X0, y: 1180 })}
    ${p.chip('looked out of the window…', c('looked out'), { kind: 'chip light', x: X0, y: 1290 })}
    ${st('toy-plane', planes - 0.4, { x: 90, y: 585, w: 330, rot: -5, life: 'sail', until: b + 0.4, sfx: `${PS}/syn-takeoff.wav` })}
    ${p.chip('…played with his toy planes', planes - 0.2, { kind: 'chip gold', x: X0, y: 1395 })}`, { enter: 'wipeU' });

  // 7 JANUARY 2001 — the first peaceful handover to the opposition
  [a, b] = win('handover');
  p.scene(a, b, `${dl('7 JANUARY 2001', a + 0.1, { y: 260 })}
    ${hl(p, 'He handed power to *John Kufuor*', c('he handed power'), { size: 92, y: 390 })}
    ${st('election', c('the first peaceful') - 0.2, { x: 300, y: 700, w: 480, life: 'bob', until: b + 0.4 })}
    ${p.chip('the first peaceful transfer to the opposition', c('the first peaceful') + 0.2, { kind: 'chip gold', x: X0, y: 1230 })}
    ${p.chip('in our history', c('in our history'), { kind: 'chip red', x: X0, y: 1330 })}`, { enter: 'push' });

  // THE PROVERB — the nightjar
  [a, b] = win('proverb');
  p.scene(a, b, `${kick(p, 'AN OLD AKAN PROVERB · THE NIGHTJAR', a + 0.05)}
    ${hl(p, 'Santrofi anomaa', a + 0.1, { size: 110, y: 270 })}
    ${card(`<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:72px;line-height:1.05">Catch it: <span style="color:var(--red)">a curse.</span></div>`, a + 0.2, { y: 470 })}
    ${card(`<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:72px;line-height:1.05">Let it go: <span style="color:#8E6A1E">something precious.</span></div>`, c('let it go'), { y: 680 })}
    ${st('nightjar', a + 0.4, { x: 200, y: 960, w: 680, life: 'bob', until: b + 0.4, sfx: `${E1}/sfx/wind.wav` })}`, { enter: 'iris' });

  // THE LESSON
  [a, b] = win('lesson');
  p.scene(a, b, `${kick(p, 'THE LESSON, SQUAD', a + 0.1)}
    ${hl(p, 'Anger can diagnose a nation.', c('anger can'), { size: 100, y: 280 })}
    <div style="position:absolute;left:${X0}px;top:560px;font-family:'Playfair Display',serif;font-weight:900;font-size:100px;color:var(--red);width:940px;line-height:1.02">${p.words(p.id_('w'), 'Only a plan can heal it.', c('but only a plan') + 0.2, { stagger: 0.08 })}</div>
    ${st('tech-drawing', c('one good blueprint') - 0.4, { x: 260, y: 840, w: 560, life: 'sway', until: b + 0.4 })}
    ${p.chip('19 years of power ≠ one good blueprint', c('and 19 years', '19 years of power'), { kind: 'chip gold', x: X0, y: 1340 })}`, { enter: 'push' });

  // YOUR TURN — the ledger (Remotion), the balance levels; comments
  [a, b] = win('turn');
  const props = { duration: +(b - a + 0.6).toFixed(2), width: 1280, height: 720, fps: 30, kicker: 'YOUR TURN', title: 'Which column weighs more?', level: +(c('which column') - a).toFixed(2), rows: [
    { at: 0.3, side: 'L', year: '1979', text: 'AFRC executions' }, { at: 0.45, side: 'R', year: '1983', text: 'Stopped the collapse' },
    { at: 0.6, side: 'L', year: '1982', text: 'Judges abducted, killed' }, { at: 0.75, side: 'R', year: '1983', text: 'Economic Recovery Programme' },
    { at: 0.9, side: 'L', year: '1982', text: 'Makola demolished' }, { at: 1.05, side: 'R', year: '1988', text: 'District Assemblies' },
    { at: 1.2, side: 'L', year: '1995', text: 'Kume Preko deaths' }, { at: 1.35, side: 'R', year: '1992', text: 'The Constitution' },
    { at: 1.5, side: 'L', year: '—', text: 'No blueprint' }, { at: 1.65, side: 'R', year: '2001', text: 'The peaceful handover' }] };
  const file = `/home/user/gcp/reels/sp2/clips/GcpLedger-${crypto.createHash('md5').update(JSON.stringify(props)).digest('hex').slice(0, 10)}.mp4`;
  CLIPS.push({ comp: 'GcpLedger', props, file });
  p.scene(a, b, `${kick(p, 'NOW IT IS YOUR TURN', a + 0.1)}
    ${hl(p, 'The curse, or *the precious thing?*', a + 0.2, { size: 92, y: 280 })}
    ${fs.existsSync(file) ? tallVid(p, file, a + 0.3, b + 0.3, { y: 560, h: 529 }) : ''}
    ${st('comments-pin', c('and why'), { x: 700, y: 1080, w: 260, life: 'bob', until: b + 0.4 })}
    ${p.chip('tell us in the comments', c('and why'), { kind: 'chip red', x: X0, y: 1150 })}`, { enter: 'wipeU' });

  endCard(p, at.endcard.T0 - 0.1, R.total, 'GOLD COAST PALAVA · SPECIAL No. 2', { what: 'Special' });
  captions(p, R);
  enrichSfx(p);
  p.html.push('<div class="bottomdeco"></div>');
  return { p, R };
}
