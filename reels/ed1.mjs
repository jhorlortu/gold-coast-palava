// Social reel (9:16) — Edition 1, "Why is Ghana a powerful nation?": straight content, voice + SFX, no music.
import fs from 'node:fs';
import { loadReel, captions, hl, kick, sub, nameCard, counter, tallVid, tallPic, endCard, bannerP, enrichSfx, X0 } from './rlib.mjs';
const E = '/home/user/gcp/ed1/media';
const STK = `${E}/stickers_cut`;
const img = (k) => [`${E}/drawn/${k}.jpg`, `${E}/real/${k}.jpg`].find((f) => fs.existsSync(f));

export function build() {
  const { R, p, c, at, win } = loadReel('/home/user/gcp/reels/ed1', 'FULL EDITION ON YOUTUBE');
  const fx = (f, t, db = -16, len) => p.sfx.push({ file: `${E}/sfx/${f}`, T: +t.toFixed(3), db, ...(len ? { len } : {}) });
  const st = (name, t, o = {}) => p.icon(name, t, { dir: STK, sfx: o.sfx ?? `${E}/sfx/pop-2.wav`, ...o });
  const shake = (scene, t) => { p.tl.push(`tl.to("#${scene}-cam", {x:16, duration:0.045, ease:"none", repeat:7, yoyo:true, immediateRender:false}, ${t.toFixed(3)});`); p.ev(t); };

  // HOOK — Kumasi, 28 March 1900: an ordinary chair, when he wanted the Golden Stool
  let [a, b] = win('hook');
  const gs = c('brought the golden') - 0.1;
  p.scene(0, gs, `${kick(p, 'KUMASI · 28 MARCH 1900', 0.1)}
    ${hl(p, 'He asked why he’d been given an *ordinary chair…*', 0.15, { size: 88, y: 300 })}
    ${tallPic(p, img('kumasi-1900-03-28'), 0.4, { y: 626, h: 621, until: gs + 0.4 })}
    ${nameCard(p, c('as the queens'), 'Sir Frederick Hodgson', 'Governor of the Gold Coast', { y: 1259 })}`, { enter: 'cut' });
  fx('knock.wav', c('ordinary chair'), -14);
  p.scene(gs, b, `${hl(p, '…instead of the *Golden Stool.*', gs + 0.1, { size: 104, y: 300 })}
    ${st('golden-stool-sky', gs + 0.3, { x: 190, y: 604, w: 700, life: 'float', until: b + 0.4, sfx: `${E}/sfx/bell.wav`, db: -12 })}`, { enter: 'iris' });

  // THE QUESTION
  [a, b] = win('question');
  p.scene(a, b, `${kick(p, 'THIS EDITION’S QUESTION', a + 0.1)}${hl(p, 'Why is Ghana a *powerful nation?*', a + 0.15, { size: 124, y: 300 })}
    ${st('sticky-note', a + 0.4, { x: 240, y: 856, w: 600, rot: -4, life: 'sway', until: b, sfx: `${E}/sfx/paper-slap.wav`, db: -14 })}`, { enter: 'wipeU' });
  fx('heartbeat.wav', a + 0.8, -13);

  // THE MONTAGE — the channel banner assembles (vertical edition of the opening montage)
  [a, b] = win('brand');
  p.scene(a, b, bannerP(p, 'bnr', { t0: a + 0.1, until: b + 0.4, lockY: 800 }).html, { enter: 'iris', bg: 'paper' });

  // THE SYMBOL — Okomfo Anokye, Osei Tutu, 24 states, the stool from the sky
  [a, b] = win('priest');
  p.scene(a, b, `${kick(p, 'AROUND 1701', a + 0.1)}
    ${nameCard(p, c('the priest'), 'Okomfo Anokye', 'The priest', { y: 320 })}
    ${nameCard(p, c('the first king'), 'Osei Tutu', 'The first king', { y: 558 })}
    ${counter(p, 24, c('that 24'), { size: 250, color: 'var(--red)', y: 810, label: 'PROUD, QUARRELSOME STATES', dur: 0.9 })}
    ${st('twenty-four-states', c('that 24') + 0.4, { x: 520, y: 776, w: 480, life: 'pulse', until: b })}
    ${p.stamp('A LAW WON’T UNITE THEM', c('because of a law') - 0.2, { x: 80, y: 1305, rot: -4, size: 44 })}`, { enter: 'wipeL' });
  [a, b] = win('sky');
  p.scene(a, b, `${kick(p, 'ACCORDING TO ASANTE TRADITION', a + 0.1)}${hl(p, 'A golden stool, *called down from the sky.*', c('called a golden stool') - 0.2, { size: 88, y: 300 })}
    ${st('golden-stool-sky', c('down from the sky') - 0.1, { x: 210, y: 580, w: 660, life: 'float', until: b, sfx: `${E}/sfx/wind.wav`, db: -14 })}
    ${p.chip('the spirit of the whole nation', c('the spirit of the whole'), { kind: 'chip gold', x: X0, y: 1351 })}`, { enter: 'iris' });
  fx('bell.wav', c('the spirit of the whole'), -14);
  [a, b] = win('spirit');
  p.scene(a, b, `${hl(p, 'A spirit that could not be…', a + 0.1, { size: 96, y: 300 })}
    ${p.stamp('TAXED', c('be taxed'), { x: 110, y: 626, rot: -8, size: 100 })}
    ${p.stamp('BRIBED', c('bribed'), { x: 380, y: 856, rot: 5, size: 100 })}
    ${p.stamp('OR SHOT', c('or shot'), { x: 150, y: 1086, rot: -4, size: 100 })}`, { enter: 'push' });

  // THE SOUND — the drum is a weapon; McCarthy's band
  [a, b] = win('drum');
  p.scene(a, b, `${hl(p, 'A drum in a forest is a *weapon.*', a + 0.1, { size: 112, y: 300, style: 'color:#FCF5E8' })}
    ${p.icon('drum', a + 0.3, { x: 260, y: 810, w: 560, rot: 4, life: 'jiggle', until: b + 0.3, sfx: 'drums-1.mp3', db: -10, len: 3.4 })}`, { enter: 'wipeL', bg: 'ink' });
  [a, b] = win('band');
  const order = c('and ordered his band') - 0.1, crate = c('the one storesman') - 0.1, died = c('and mccarthy did not') - 0.1;
  p.scene(a, order, `${kick(p, 'NSAMANKOW · 22 JANUARY 1824', a + 0.1)}
    ${nameCard(p, a + 0.2, 'Sir Charles McCarthy', 'British governor', { y: 290 })}
    ${counter(p, 500, c('about 500'), { size: 190, color: 'var(--red)', y: 580, label: 'IN HIS FIRING LINE' })}
    ${p.icon('governor', c('about 500') + 0.3, { x: 650, y: 534, w: 320, life: 'bob', until: order })}
    <div class="mono" style="position:absolute;left:${X0}px;top:902px;font-size:44px;font-weight:700;color:var(--muted)">versus</div>
    ${counter(p, 10000, c('something like'), { size: 190, color: 'var(--gold)', y: 983, label: 'ASANTE WARRIORS', dur: 1.3 })}`, { enter: 'push' });
  const sb = p.scene(order, crate, `${hl(p, 'He ordered his band to play the *anthem.*', order + 0.1, { size: 84, y: 290 })}
    ${p.chip('the drums came back louder', c('the drums returned'), { kind: 'chip gold', x: X0, y: 546 })}
    ${p.chip('“the sound of home” — to make them surrender', c('make them surrender') - 0.2, { kind: 'chip red', x: X0, y: 1328 })}
    ${p.stamp('MUSKET FIRE', c('musket fire') - 0.1, { x: 150, y: 1328, rot: -6, size: 76, sfx: null })}`, { enter: 'wipeU' });
  tallVid(p, '/home/user/gcp/project/media/broll/band-close.mp4', order + 0.2, crate, { y: 672, h: 610, rate: 0.8, pos: '50% 40%' });
  p.sound('band-1.mp3', order + 0.3, -14, c('the drums returned') - order);
  p.sound('drums-2.mp3', c('the drums returned'), -11, 3.5);
  p.sound('musket-1.mp3', c('musket fire') - 0.05, -8); p.sound('musket-3.mp3', c('musket fire') + 0.35, -10);
  shake(sb, c('musket fire'));
  p.scene(crate, died, `${kick(p, 'THE AMMUNITION ARRIVES', crate + 0.1)}${hl(p, 'The boxes were *opened…*', crate + 0.2, { size: 92, y: 300 })}
    ${p.stamp('BISCUITS', c('biscuits'), { x: 100, y: 1213, rot: -9, size: 70, sfx: 'stamp-1.mp3' })}
    ${p.stamp('MACARONI', c('macaroni'), { x: 480, y: 1328, rot: 6, size: 70, sfx: 'stamp-2.mp3' })}`, { enter: 'wipeR' });
  tallVid(p, '/home/user/gcp/project/media/broll/crate-open.mp4', crate + 0.15, died, { y: 558, h: 598, rate: 0.85 });
  p.sound('crate-1.mp3', c('when they were opened'), -12);
  p.scene(died, b, `${hl(p, 'McCarthy did not *survive the afternoon.*', died + 0.1, { size: 104, y: 420 })}
    ${p.stamp('ASANTE PRESTIGE AT ITS PEAK', died + 1.2, { x: 80, y: 1018, rot: -4, size: 40 })}`, { enter: 'iris' });

  // POWER IS NOT INVINCIBILITY — 1896: Prempeh I into exile
  [a, b] = win('power');
  p.scene(a, b, `${hl(p, 'Power is not *invincibility.*', a + 0.1, { size: 124, y: 580 })}${p.rule(a + 0.8, { x: X0, y: 948, w: 600, color: 'var(--red)', h: 14 })}`, { enter: 'push' });
  [a, b] = win('1896');
  const boat = c('were pushed into') - 0.1;
  p.scene(a, boat, `${kick(p, 'JANUARY 1896', a + 0.1)}${hl(p, 'A bloodless force *walked into Kumasi.*', a + 0.15, { size: 88, y: 300 })}
    ${p.print(img('prempeh-submission'), a + 0.6, { x: 100, y: 604, w: 860, rot: -2 })}
    ${nameCard(p, c('and king prempe'), 'Prempeh I', 'Asantehene · never seen the sea', { y: 1248 })}`, { enter: 'wipeL' });
  p.scene(boat, b, `${hl(p, 'Pushed into a *boat.*', boat + 0.1, { size: 116, y: 300 })}
    ${st('exile-boat', boat + 0.3, { x: 90, y: 534, w: 520, life: 'sail', until: b, sfx: `${E}/sfx/whip.wav` })}
    ${p.print(img('prempeh1-exile'), c('sierra leone') - 0.3, { x: 600, y: 580, w: 400, rot: 3 })}
    ${p.chip('Elmina · held a year', c('held at elmina'), { kind: 'chip light', x: X0, y: 1132 })}
    ${p.chip('→ Sierra Leone', c('sierra leone'), { kind: 'chip light', x: X0, y: 1236 })}
    ${p.chip('→ the Seychelles', c('the seychelles'), { kind: 'chip red', x: X0, y: 1340 })}`, { enter: 'wipeU' });

  // THE NATION'S SOUL — Yaa Asantewaa
  [a, b] = win('soul');
  const yaa = c('and when ya') - 0.1, tom = c('tomorrow') - 0.1;
  p.scene(a, yaa, `${hl(p, 'As if he’d asked to sit on the nation’s *soul.*', a + 0.1, { size: 92, y: 300 })}
    ${st('golden-stool-sky', a + 0.5, { x: 250, y: 626, w: 580, life: 'float', until: yaa })}
    ${p.stamp('NEVER SAT UPON', c('never sat upon') - 0.1, { x: 170, y: 1316, rot: -5, size: 64 })}`, { enter: 'push' });
  p.scene(yaa, tom, `${kick(p, 'THE ONLY ASANTE WOMAN PRESENT', c('the only asante woman'))}
    ${tallPic(p, img('asantewaa-museum'), yaa + 0.2, { y: 310, h: 529, pos: '50% 40%', until: tom + 0.4 })}
    <div class="mono" style="position:absolute;left:${X0}px;top:897px;font-size:22px;font-weight:700;letter-spacing:.12em;color:var(--muted)">HER MUSEUM AT EJISU</div>
    ${nameCard(p, c('asantewa') + 0.2, 'Yaa Asantewaa', 'Queen mother of Ejisu', { y: 948 })}
    ${p.chip('acting chief — her chief exiled with Prempeh', c('and its acting chief'), { kind: 'chip light', x: X0, y: 1144 })}
    ${p.chip('she asked about the king…', c('asked about the king'), { kind: 'chip gold', x: X0, y: 1248 })}
    ${p.stamp('HE WILL NOT RETURN', c('that he would not') - 0.1, { x: 330, y: 1340, rot: -4, size: 48 })}
    ${p.rule(c('she answered'), { x: X0, y: 1466, w: 940, color: 'var(--red)', h: 12 })}`, { enter: 'wipeL' });
  p.scene(tom, b, `${kick(p, 'A DECLARATION OF WAR', tom + 0.1)}
    <div class="quote" style="left:${X0}px;top:420px;width:940px"><h1 style="font-size:96px">“${p.words(p.id_('qt'), 'Tomorrow, ghost widows would get *husbands.*', tom + 0.2, { stagger: 0.14 })}”</h1></div>`, { enter: 'iris' });
  fx('heartbeat.wav', tom + 0.2, -11);

  // THE DIG — Armitage searches under the huts; the stool is not there
  [a, b] = win('dig');
  const dug = c('and dug under') - 0.1;
  p.scene(a, dug, `${kick(p, '31 MARCH 1900', a + 0.1)}
    ${nameCard(p, c('captain armitage'), 'Captain Armitage', '+ 45 Hausa soldiers', { y: 290 })}
    ${tallPic(p, img('forest-fight-1900'), a + 0.5, { y: 580, h: 644, until: dug + 0.4 })}
    ${p.chip('following a boy named Esumi', c('a boy named'), { kind: 'chip gold', x: X0, y: 1340 })}`, { enter: 'wipeU' });
  p.scene(dug, b, `${hl(p, 'They dug under *hut floors…*', dug + 0.1, { size: 104, y: 300 })}
    ${st('red-clay', dug + 0.4, { x: 520, y: 580, w: 460, life: 'jiggle', until: b, sfx: '/home/user/gcp/project/media/sfx/syn-mud.wav' })}
    ${p.stamp('NOT THERE', c('that was not there') + 0.2, { x: 90, y: 856, rot: -9, size: 110 })}
    ${p.chip('an angry crowd waiting', c('angry crowd'), { kind: 'chip red', x: X0, y: 1305 })}`, { enter: 'wipeL' });
  fx('murmur.wav', c('angry crowd') - 0.2, -14, 3);

  // THE SIEGE — and the one thing Britain wanted
  [a, b] = win('siege');
  const never = c('but the one thing') - 0.1;
  p.scene(a, never, `${kick(p, 'THE SIEGE', a + 0.1)}${hl(p, 'The fort, besieged until *15 July.*', a + 0.1, { size: 100, y: 300 })}
    ${p.chip('Yaa Asantewaa + 14 others', c('and ya asantewa'), { kind: 'chip light', x: X0, y: 696 })}
    ${p.chip('→ exiled to the Seychelles', c('to the seychelles'), { kind: 'chip red', x: X0, y: 799 })}
    ${st('exile-boat', c('to the seychelles') + 0.2, { x: 420, y: 926, w: 460, life: 'sail', until: never })}`, { enter: 'push' });
  p.scene(never, b, `${hl(p, 'The one thing Britain wanted…', never + 0.1, { size: 96, y: 300 })}
    ${st('golden-stool-sky', never + 0.4, { x: 250, y: 558, w: 580, life: 'float', until: b })}
    ${p.stamp('NEVER TAKEN', c('never came into') - 0.1, { x: 170, y: 1282, rot: -6, size: 96 })}`, { enter: 'iris' });

  // NOW — Ghana at 70, the Asante flag beside the national one
  [a, b] = win('now');
  p.scene(a, b, `${kick(p, 'NOW', a + 0.1)}
    ${counter(p, 70, c('ghana turned 70'), { size: 260, color: 'var(--red)', y: 290, label: 'GHANA TURNED 70 · 6 MARCH 2027', dur: 1.0 })}
    ${p.chip('in Kumasi, the Asante flag still flies', c('the asante flag'), { kind: 'chip gold', x: X0, y: 718 })}
    ${tallPic(p, img('asante-flag'), c('the asante flag') + 0.2, { y: 856, h: 437, until: b })}
    ${p.stamp('THE STOOL NEVER CHANGED HANDS', c('never changed hands') - 0.2, { x: 50, y: 1340, rot: -3, size: 38 })}`, { enter: 'wipeU' });

  // LETTERS — the recall question; Chale
  [a, b] = win('recall');
  p.scene(a, b, `${kick(p, 'LETTERS PAGE', a + 0.1)}${hl(p, 'Which detail will you repeat *tomorrow?*', c('which single detail') - 0.1, { size: 96, y: 300 })}
    ${st('comments-pin', a + 0.6, { x: 280, y: 718, w: 520, life: 'pulse', until: b, sfx: `${E}/sfx/bell.wav` })}
    ${p.chip('tell us in the comments 👇', c('someone tomorrow') + 0.2, { kind: 'chip red', x: X0, y: 1351 })}`, { enter: 'wipeL' });
  [a, b] = win('chale');
  p.scene(a, b, `${hl(p, 'Chale, I go see you for the *next one.*', a + 0.1, { size: 112, y: 534 })}`, { enter: 'push' });
  endCard(p, at.endcard.T0 - 0.1, R.total, 'GOLD COAST PALAVA · EDITION 1');

  captions(p, R);
  enrichSfx(p);
  p.html.push('<div class="bottomdeco"></div>');
  return { p, R };
}
