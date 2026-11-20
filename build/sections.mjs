// Gold Coast Palava — sections 2–8, v2: light paper, spring motion, B-roll woven through.
import fs from 'node:fs';
import { Part, cuer, SP } from './lib.mjs';
import { SEGMENTS, B, has } from './parts.mjs';
import { banner, BANNER_CSS } from './banner.mjs';
import { normalizeDesign } from '/home/user/video-studio/src/design-to-motion/normalize.js';
import { compileToHyperFrames } from '/home/user/video-studio/src/design-to-motion/to-hyperframes.js';

const make = (key) => { const s = SEGMENTS[key]; return [new Part({ ...s }), cuer(s.pieces), s]; };
const ON = 'color:var(--ink);background:#FCF5E8;padding:18px 34px 26px;border:5px solid var(--ink);box-shadow:12px 14px 0 var(--ink);width:fit-content;max-width:1500px';
const card = (p, at, { x, y, w = 420, label, desk, title, rot = 0 }) => {
  const id = p.id_('cd');
  p.tl.push(`tl.fromTo("#${id}", {opacity:0}, {opacity:1, duration:0.08, ease:"none"}, ${at});`);
  p.tl.push(`tl.fromTo("#${id}", {y:-320, scale:1.2, rotation:${rot + (p.uid % 2 ? 16 : -16)}}, {y:0, scale:1, rotation:${rot}, duration:${SP.default}, ease:"sp-default"}, ${at});`);
  p.ev(at);
  p.sound('page-turn-3.mp3', at + 0.1, -19); p.sound('syn-thud.wav', at + 0.32, -17);
  return `<div id="${id}" class="card" style="left:${x}px;top:${y}px;width:${w}px"><div class="lbl"><span>${label}</span><b>${desk}</b></div><h3>${title}</h3><div class="dots"></div></div>`;
};
const SYM = `<svg viewBox="-10 -10 220 220" width="100%" height="100%"><path d="M100 172C38 132 24 76 64 56c22-10 36 4 36 18 0-14 14-28 36-18 40 20 26 76-36 116z" fill="#FBF6EA" stroke="#1A1612" stroke-width="10" stroke-linejoin="round"/><path d="M100 74v90M58 84h32M60 100h30M68 116h22M80 132h10M110 84h32M110 100h30M110 116h22M110 132h10" stroke="#1A1612" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M100 22l12 14-12 14-12-14z" fill="#C9962F" stroke="#1A1612" stroke-width="4"/></svg>`;
const hl = (p, text, at, { size = 96, style = '', x = 150, y = 300, w = 1620, stagger } = {}) => `<div class="hl" style="left:${x}px;top:${y}px;width:${w}px;${style}"><h1 style="font-size:${size}px">${p.words(p.id_('w'), text, at, stagger ? { stagger } : {})}</h1></div>`;

// =============================================================================
export function paper() {
  const [p, c, s] = make('paper');
  // A. The full channel banner assembles on "This is the Gold Coast Palava" and holds through the pause
  const mEnd = c('in our part of the world') - 0.1;
  const m0 = c('this is the gold coast');
  p.css.push(BANNER_CSS);
  const pb = banner(p, 'pb', { t0: Math.max(0.15, m0 - 0.2), speed: 1.5, until: mEnd + 0.5 });
  p.sound('stamp-1.mp3', m0 + 0.2, -14);
  p.scene(0, mEnd, pb, { enter: 'cut', drift: 0.03, bg: 'plain' });
  // B. Dictionary, with the drummers in a moving print: "a story too big for one mouth"
  const dEnd = c('each edition') - 0.1;
  const argue = p.icon('argument', c('an argument') - 0.15, { x: 1280, y: 230, w: 500, rot: 3, sfx: 'syn-boop.wav', db: -18, until: dEnd });
  const defs = [['trouble', 'trouble'], ['an argument', 'an argument'], ['a story too big', 'a story too big for one mouth to carry']]
    .map(([q, txt], i) => { const id = p.id_('df'); p.tl.push(`tl.fromTo("#${id}", {xPercent:-110}, {xPercent:0, duration:${SP.default}, ease:"sp-default"}, ${c(q)});`); p.ev(c(q)); return `<div style="overflow:hidden"><div id="${id}" style="font-family:'Playfair Display',serif;font-size:50px;margin:12px 0;white-space:nowrap"><b class="mono" style="color:var(--red);font-size:38px;margin-right:24px">${i + 1}.</b>${txt}</div></div>`; }).join('');
  p.scene(mEnd, dEnd, `<div class="hl" style="left:150px;top:170px;width:1250px">${p.kicker('IN OUR PART OF THE WORLD', mEnd + 0.1)}
    <h1 style="font-size:170px">${p.words(p.id_('pl'), 'pa·la·va', mEnd + 0.2)} <span style="font-size:60px;font-style:italic;font-weight:400;color:var(--muted)">(n.)</span></h1><div style="margin-top:30px">${defs}</div></div>
    ${p.stamp('NEVER SHORT OF ANY OF THE THREE', c('never been short'), { x: 150, y: 820, rot: -3, size: 40 })}${argue}`);
  p.sound('real-grumble.mp3', c('an argument') + 0.05, -9, 3.0);
  // C. One day / event / decision, then the four questions
  const cEnd = c('then we look') - 0.1;
  const big3 = [['one day', 'ONE DAY'], ['one event', 'ONE EVENT'], ['one decision', 'ONE DECISION']].map(([q, t], i) => card(p, c(q), { x: 150 + i * 560, y: 180, w: 500, label: 'EACH EDITION', desk: `No. ${i + 1}`, title: t, rot: [-2, 1, -1][i] })).join('');
  const slow = p.chip('…and slow it _down_', c('slow it down'), { kind: 'chip gold' }) + p.chip('to see what *really* happened', c('what really happened'), { kind: 'chip' });
  const qs = [['who was in the room', 'Who was in the room?'], ['what the weather', 'What was the weather doing?'], ['who was afraid', 'Who was afraid?'], ['who was lying', 'Who was *lying?*']].map(([q, t]) => p.chip(t, c(q), { kind: 'chip light' })).join('');
  p.vprint(B('rain-street.mp4'), c('what the weather') - 0.2, cEnd, { x: 1290, y: 540, w: 520, rot: 3, caption: 'What was the weather doing?', credit: 'Shiashie, Accra · Wikimedia Commons · CC BY-SA 4.0' });
  p.sound('syn-rain.wav', c('what the weather') - 0.1, -17, Math.min(6, cEnd - c('what the weather') + 0.5)); p.sound('syn-splash.wav', c('what the weather') + 0.6, -22);
  p.scene(dEnd, cEnd, `${big3}<div style="position:absolute;left:150px;top:520px">${slow}</div><div style="position:absolute;left:150px;top:620px;width:1100px">${qs}</div>`);
  // D. The world at that very hour — two chapters collide
  const wEnd = c('and finally') - 0.1;
  const ch = (id, txt, x) => `<div id="${id}" class="card" style="left:${x}px;top:470px;width:560px;height:250px"><div class="lbl"><span>TEXTBOOK</span><b>CHAPTER</b></div><h3>${txt}</h3></div>`;
  const ca = p.id_('ch'), cb = p.id_('ch');
  const tw = c('two things you were taught');
  p.grow(ca, tw, { rot: -2 }); p.grow(cb, tw + 0.3, { rot: 2 });
  p.move(`#${ca}`, { x: 250, rotation: -4 }, c('same week') - 0.5, 'heavy');
  p.move(`#${cb}`, { x: -250, rotation: 3 }, c('same week') - 0.5, 'heavy');
  p.scene(cEnd, wEnd, `<div style="position:absolute;left:0;top:0;width:960px;height:1080px;background:#EADFC4"></div>
    <div class="hl" style="left:110px;top:170px;width:760px"><div class="kicker"><i style="background:var(--red)"></i><span>GHANA</span></div><h1 style="font-size:84px">${p.words(p.id_('g'), 'That day, that hour.', cEnd + 0.3)}</h1></div>
    <div class="hl" style="left:1050px;top:170px;width:760px"><div class="kicker"><i style="background:var(--red)"></i><span>THE REST OF THE WORLD</span></div><h1 style="font-size:84px">${p.words(p.id_('g'), '…at that very *hour.*', c('at that very hour'))}</h1></div>
    ${ch(ca, 'A chapter on Ghana', 330)}${ch(cb, 'A chapter on the world', 1030)}
    ${p.stamp('SAME WEEK', c('same week'), { x: 800, y: 790, rot: -6, size: 70 })}`);
  // E. Bring it home — the city in motion behind the chips
  const hEnd = c('we cover four desks') - 0.1;
  const homeIcons = [['on your phone', 'phone', 'syn-phone-ring.wav', -15], ['in traffic', 'traffic', 'syn-horns.wav', -16], ['in the group chat', 'groupchat', 'syn-dings.wav', -15], ['the argument at the table', 'family-table', 'syn-boop.wav', -19]]
    .map(([q, n_, fx, db], i) => p.icon(n_, c(q), { x: 140 + i * 420, y: 540, w: 360, rot: [-4, 3, -2, 4][i], sfx: fx, db })).join('');
  const homeVid = has('traffic-accra.mp4') ? 'traffic-accra.mp4' : 'castle-courtyard.mp4';
  p.broll(wEnd, hEnd, B(homeVid), { dim: 0.35, credit: 'Wikimedia Commons · CC BY-SA 4.0', overlay: `${p.chip('WE BRING IT HOME', c('bring it home'), { kind: 'chip red', x: 150, y: 120 })}${hl(p, 'The Ghana you are living in _right now._', c('the ghana you are living'), { size: 84, y: 200, w: 1080, style: 'color:var(--ink);background:#FCF5E8;padding:22px 40px 30px;border:5px solid var(--ink);box-shadow:12px 14px 0 var(--ink)' })}${homeIcons}` });
  // F. Four desks drop onto kente
  const fEnd = c('and each edition opens') - 0.1;
  const desks = [['politics', 'POLITICS DESK', 'The day the Gold Coast became Ghana'], ['business', 'BUSINESS DESK', 'When the cedi was born'], ['sports', 'SPORTS & ENT.', 'Black Stars take Africa’s crown at home'], ['life and culture', 'LIFE & CULTURE', 'Kente: the cloth that tells a story']]
    .map(([q, d, t], i) => card(p, c(q), { x: 110 + i * 440, y: 360, w: 400, label: 'GOLD COAST PALAVA', desk: d, title: t, rot: [-2, 1.5, -1, 2][i] })).join('');
  p.broll(hEnd, fEnd, B('kente-wall.mp4'), { dim: 0.3, credit: 'Kente weaving · Wikimedia Commons · CC BY-SA 4.0', overlay: `${hl(p, 'Four desks. Each gets its turn.', hEnd + 0.2, { size: 84, y: 170, style: ON })}${desks}` });
  // G. Front page → the lead story
  const gEnd = c('we speak mostly') - 0.1;
  const heads = ['Akosombo: the dam that lit a nation', '1992: Ghana votes again', 'Soweto, 2010: the night Africa held its breath', 'The family house: who lives, who decides', 'When the cedi was born', 'Kente: the cloth that tells a story'];
  const fp = fEnd + 0.35;
  const fronts = heads.map((t, i) => card(p, fp + i * 0.16, { x: 120 + (i % 3) * 580, y: 170 + Math.floor(i / 3) * 340, w: 520, label: 'FRONT PAGE', desk: ['BUSINESS', 'POLITICS', 'SPORTS', 'LIFE', 'BUSINESS', 'CULTURE'][i], title: t, rot: [-2, 1, -1.5, 2, -1, 1.5][i] })).join('');
  const lid = p.id_('lead');
  p.grow(lid, c('one lead story'), { from: 0.3, dy: 0, preset: 'heavy' });
  p.tl.push(`tl.to("#${lid}", {scale:1.1, duration:${Math.max(0.5, gEnd - c('one lead story') - 0.8).toFixed(2)}, ease:"none", immediateRender:false}, ${(c('one lead story') + 0.8).toFixed(2)});`);
  p.ev(c('go deep'));
  p.sound('whoosh-2.mp3', c('one lead story') - 0.1, -12);
  p.scene(fEnd, gEnd, `${fronts}<div id="${lid}" style="position:absolute;left:460px;top:250px;width:1000px;background:#FCF5E8;color:var(--ink);padding:50px 60px;box-shadow:0 40px 80px -20px rgba(60,40,10,.45);border:6px solid var(--ink);border-top:22px solid var(--red)">
      <div class="mono" style="font-size:26px;letter-spacing:.3em;color:var(--red);font-weight:700">THE LEAD STORY</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:96px;line-height:1.02;margin-top:18px">One story.<br><i style="color:var(--gold)">Gone deep.</i></div></div>`);
  // H. Language & tone
  const lEnd = c('chale') - 0.1;
  p.scene(gEnd, lEnd, `<div class="hl" style="left:150px;top:190px;width:1600px">${p.kicker('HOW WE SPEAK', gEnd + 0.1)}<h1 style="font-size:100px">${p.words(p.id_('ln'), 'Mostly English.', gEnd + 0.2)}<br>${p.words(p.id_('ln'), 'Enough *Pidgin* to keep us honest.', c('enough pidgin'))}</h1></div>
    ${p.icon('serious', c('serious about the facts'), { x: 1020, y: 470, w: 380, rot: -3, sfx: 'syn-tick.wav', db: -20, until: lEnd })}${p.icon('light', c('light about everything else'), { x: 1440, y: 470, w: 380, rot: 4, sfx: 'syn-boop.wav', db: -22, until: lEnd })}`);
  // I. Chale — drums and dancers, the show kicks off
  const danceVid = has('jera.mp4') ? 'jera.mp4' : 'drummers.mp4';
  p.broll(lEnd, s.dur, B(danceVid), { dim: 0.3, credit: 'Wikimedia Commons · CC BY-SA 4.0', overlay: hl(p, 'Chale, make we show you _what that looks like._', lEnd + 0.2, { size: 100, y: 300, style: ON }), opts: { enter: 'iris' } });
  return p;
}

// =============================================================================
export function lead() {
  const [p, c, s] = make('lead');
  // A. Dateline, with Cape Coast's cannons in a moving print
  const aEnd = c('a british governor') - 0.1;
  p.scene(0, aEnd, `<div class="hl" style="left:150px;top:200px;width:1000px">${p.kicker('FROM THE ARCHIVE · A SAMPLE', 0.1)}
    <div style="font-family:'Playfair Display',serif;font-weight:900;font-size:128px;line-height:1">${p.typed('22 JANUARY 1824', c('on the afternoon'), { cls: '', cps: 14 })}</div>
    <div class="mono" style="font-size:38px;font-weight:700;margin-top:30px">${p.typed('THE AFTERNOON · FOREST NEAR BONSASO', c('on the afternoon') + 1.0, { cps: 24, sfx: false })}</div>
    <div class="sub" style="font-size:50px">${p.words(p.id_('dl'), 'on the south bank of the *Bonsa River*', c('on the south bank'), { stagger: 0.05 })}</div></div>`, { enter: 'cut' });
  p.sound('syn-suspense.wav', c('on the afternoon') - 0.25, -13);
  p.vprint(B('castle-cannon.mp4'), 0.4, aEnd, { x: 1180, y: 520, w: 640, rot: 3, caption: 'Gold Coast cannon, Cape Coast Castle', credit: 'Wikimedia Commons · CC BY-SA 4.0' });
  // B. The standoff, moving
  const bEnd = c('he was a soldier') - 0.1;
  const nm = p.id_('nmc');
  p.tl.push(`tl.fromTo("#${nm}", {xPercent:-120}, {xPercent:0, duration:${SP.heavy}, ease:"sp-heavy"}, ${c('sir charles') - 0.2});`); p.ev(c('sir charles'));
  const name = `<div style="position:absolute;left:0;top:640px;overflow:hidden;padding-right:40px"><div id="${nm}" style="margin-left:110px;background:rgba(255,253,247,.96);padding:22px 34px;border-left:12px solid var(--red)"><div class="mono" style="font-size:22px;letter-spacing:.2em;color:var(--red);font-weight:700">BRITISH GOVERNOR</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:64px">Sir Charles McCarthy</div></div></div>`;
  p.broll(aEnd, bEnd, B('battle-wide.mp4'), { rate: 0.7, dim: 0.12, overlay: `${name}${p.chip('≈ 500 men', c('500 men'), { kind: 'chip red', x: 250, y: 470 })}${p.chip('≈ 10,000 Asante', c('about 10'), { kind: 'chip gold', x: 1250, y: 200 })}` });
  p.sound('drums-2.mp3', c('asante army of'), -22, 4);
  // C. The man and his march — Cape Coast Castle, seat of the governors
  const cEnd = c('the asante army advanced') - 0.1;
  const hard = [['weeks of mud', 'mud', 'syn-mud.wav', -14], ['the rains having soaked', 'gunpowder', 'syn-splash.wav', -16], ['the ammunition he had sent', 'ammo-road', 'crate-2.mp3', -16]]
    .map(([q, n_, fx, db], i) => p.icon(n_, c(q), { x: 150 + i * 380, y: 560, w: 330, rot: [-4, 3, -2][i], sfx: fx, db, len: 1.2 })).join('');
  p.scene(bEnd, cEnd, `<div class="hl" style="left:150px;top:170px;width:1000px">${p.kicker('THE GOVERNOR', bEnd + 0.1)}<h1 style="font-size:84px">${p.words(p.id_('fi'), 'A soldier of *French and Irish* descent —', bEnd + 0.25)}</h1><h1 style="font-size:84px;color:var(--red)">${p.words(p.id_('ab'), 'a committed abolitionist.', c('committed abolitionist'))}</h1></div>
    ${hard}
    ${p.stamp('DELAYED', c('still somewhere on the road') + 0.3, { x: 1380, y: 800, rot: -10, size: 60 })}`);
  p.vprint(B('castle-courtyard.mp4'), bEnd + 0.4, c('weeks of mud') + 1.5, { x: 1180, y: 190, w: 620, rot: -3, caption: 'Cape Coast Castle, seat of British governors', credit: 'Wikimedia Commons · CC BY-SA 4.0' });
  // D. Fan formation
  const dEnd = c('and then mccarthy') - 0.1;
  const fan = c('fan formation');
  const dots = []; const N = 46;
  for (let i = 0; i < N; i++) {
    const a = Math.PI * (0.08 + 0.84 * i / (N - 1)); const r = 330 + (i % 3) * 26;
    const x = 1300 + Math.cos(a) * r, y = 640 - Math.sin(a) * r;
    p.tl.push(`tl.fromTo("#fd${i}", {scale:0}, {scale:1, duration:${SP.snappy}, ease:"sp-snappy"}, ${(fan + i * 0.03).toFixed(3)});`);
    dots.push(`<div id="fd${i}" style="position:absolute;left:${x.toFixed(0) - 11}px;top:${y.toFixed(0) - 11}px;width:22px;height:22px;border-radius:50%;background:var(--gold);border:3px solid var(--ink)"></div>`);
  }
  p.ev(fan); p.ev(fan + 1);
  const brit = p.id_('br'); p.grow(brit, fan + 0.6, { from: 0.5, dy: 30, preset: 'snappy' });
  const half = p.id_('hm'); p.tl.push(`tl.fromTo("#${half}", {scaleY:0}, {scaleY:1, duration:${SP.default}, ease:"sp-default"}, ${c('half a mile')});`); p.ev(c('half a mile'));
  p.scene(cEnd, dEnd, `${p.print('img/asante-captain.jpg', cEnd + 0.2, { x: 130, y: 150, w: 470, rot: -3, caption: 'Asante captain in war dress', credit: 'T. E. Bowdich, 1819 · Wikimedia Commons' })}
    <div class="hl" style="left:700px;top:120px;width:1150px">${p.kicker('THE FAMOUS FAN FORMATION', fan - 0.3)}</div>
    ${dots.join('')}
    <div id="${brit}" style="position:absolute;left:1250px;top:900px;width:100px;height:26px;background:var(--red);border:3px solid var(--ink)"></div>
    <div class="mono" style="position:absolute;left:1180px;top:940px;font-size:20px;font-weight:700">McCARTHY'S LINE</div>
    <div id="${half}" style="position:absolute;left:1296px;top:660px;width:0;height:230px;border-left:4px dashed var(--ink);transform-origin:50% 0"><div class="mono" style="position:absolute;left:18px;top:90px;white-space:nowrap;font-size:26px;font-weight:700">½ MILE</div></div>
    ${p.chip('horns & drums of every chief', c('the horns and drums'), { kind: 'chip gold', x: 1050, y: 190 })}`);
  p.vprint(B('drummers.mp4'), c('the horns and drums') - 0.2, dEnd, { x: 130, y: 600, w: 520, rot: 2, caption: 'Drums still carry the message', credit: 'Wikimedia Commons · CC BY-SA 4.0', mediaStart: 5 });
  p.sound('drums-1.mp3', c('the horns and drums'), -12, Math.min(5, dEnd - c('the horns and drums')));
  // E. The inexplicable (light, with a red rule)
  const eEnd = c('he pushed his') - 0.1;
  p.headline(dEnd, eEnd, { kicker: 'AND THEN', text: 'McCarthy did something historians *still struggle to explain.*', size: 104, y: 280, extra: p.rule(c('still struggle'), { x: 150, y: 640, w: 900, color: 'var(--red)', h: 10 }) });
  // F. The band plays (moving), the drums answer, the muskets end it
  const fA = c('each time the music stopped') - 0.1;
  const gs = p.id_('gs');
  p.tl.push(`tl.fromTo("#${gs}", {yPercent:115}, {yPercent:0, duration:${SP.heavy}, ease:"sp-heavy"}, ${c('god save the king')});`); p.ev(c('god save the king'));
  p.broll(eEnd, fA, B('band-close.mp4'), { rate: 0.75, dim: 0.2, overlay: `<div class="hl" style="left:120px;top:170px;width:1700px;${ON}"><div class="mono" style="font-size:26px;letter-spacing:.3em;color:var(--gold);font-weight:700">THE REGIMENTAL BAND PLAYS</div><h1 style="font-size:120px"><span class="mk"><span id="${gs}" class="wd">“God Save the King”</span></span></h1></div>${p.chip('the band, pushed forward', c('regimental band forward'), { kind: 'chip gold', x: 120, y: 420 })}${p.chip('to shake the loyalty of the army in front of him', c('shake the loyalty'), { kind: 'chip light', x: 120, y: 520 })}` });
  p.sound('band-1.mp3', c('ordered it to play') - 0.3, -12, fA - c('ordered it to play') + 0.4);
  const fEnd = c('when the ammunition finally') - 0.1;
  const fire = c('musket fire');
  // The band against the drums: two stickers, two loudness meters that grow each time one answers the other
  const loud = c('the asante drums came back louder');
  const duel = p.icon('trumpet', fA + 0.1, { x: 220, y: 190, w: 330, rot: -4, sfx: 'syn-boop.wav', db: -22, until: fire })
    + p.icon('drum', loud, { x: 1370, y: 190, w: 330, rot: 4, sfx: 'syn-tick.wav', db: -20, until: fire });
  const bm = p.id_('bm'), dm = p.id_('dm');
  const meter = (id, x, col) => `<div style="position:absolute;left:${x}px;top:640px;width:380px;height:34px;border:5px solid var(--ink);background:#FCF5E8;box-shadow:8px 8px 0 var(--ink)"><div id="${id}" style="width:100%;height:100%;background:${col};transform-origin:0 50%"></div></div>`;
  const step = (id, v, at) => { p.tl.push(`tl.to("#${id}", ${JSON.stringify({ scaleX: v, ...{ duration: SP.default, ease: 'sp-default' }, immediateRender: false })}, ${at.toFixed(3)});`); p.ev(at); };
  p.tl.push(`tl.fromTo("#${bm}", {scaleX:0}, {scaleX:0.55, duration:${SP.default}, ease:"sp-default"}, ${(fA + 0.2).toFixed(3)});`);
  p.tl.push(`tl.fromTo("#${dm}", {scaleX:0}, {scaleX:0.001, duration:0.01, ease:"none"}, 0);`); step(bm, 0.08, c('each time the music stopped')); step(dm, 0.7, loud);
  step(bm, 0.65, c('so he had it played again')); step(dm, 0.9, c('so he had it played again') + 1.2);
  step(bm, 0.72, c('and then again')); step(dm, 1, c('and then again') + 1.4);
  step(bm, 0.2, c('officers stood at attention') + 0.3);
  const callouts = `${duel}${meter(bm, 200, 'var(--red)')}${meter(dm, 1350, 'var(--gold)')}`;
  const flash = p.id_('fl'); p.tl.push(`tl.fromTo("#${flash}", {opacity:0}, {opacity:0.9, duration:0.05, ease:"none"}, ${fire}); tl.to("#${flash}", {opacity:0, duration:0.5, ease:"power2.out", immediateRender:false}, ${fire + 0.06});`);
  const shk = p.id_('shk');
  p.tl.push(`tl.to("#${shk}", {x:16, duration:0.04, yoyo:true, repeat:7, ease:"none", immediateRender:false}, ${fire});`); p.ev(fire);
  p.scene(fA, fEnd, `<div id="${shk}" class="wrap"><div class="cover" style="background-image:url(${p.asset('final/battle-light.png')});transform:scale(1.15);transform-origin:70% 40%"></div><div class="shade" style="opacity:.25"></div>${callouts}</div><div id="${flash}" style="position:absolute;inset:0;background:#fff4dc;opacity:0"></div>${p.stamp('MUSKET FIRE', fire + 0.1, { x: 1100, y: 640, rot: -8, size: 70, sfx: null })}`, { bg: 'none' });
  p.sound('drums-2.mp3', c('the asante drums came back'), -10, 2.6);
  p.sound('band-2.mp3', c('so he had it played again'), -14, 1.8);
  p.sound('band-2.mp3', c('and then again'), -14, 1.5);
  p.sound('drums-1.mp3', c('and then again') + 1.4, -8, 3);
  p.sound('musket-1.mp3', fire, -4); p.sound('musket-2.mp3', fire + 0.35, -7);
  // G. The crate opens (moving)
  const gEnd = c('that is what we call') - 0.1;
  p.broll(fEnd, gEnd, B('crate-open.mp4'), { rate: 0.8, dim: 0.12, overlay: `<div class="hl" style="left:120px;top:170px;width:900px;${ON}"><div class="mono" style="font-size:26px;letter-spacing:.3em;color:var(--gold);font-weight:700">THE AMMUNITION ARRIVES</div></div>${p.chip('…finally', c('finally arrived'), { kind: 'chip light', x: 120, y: 240 })}${p.chip('the boxes are opened', c('boxes were opened'), { kind: 'chip', x: 120, y: 340 })}${p.chip('found to contain…', c('found to contain'), { kind: 'chip gold', x: 120, y: 440 })}${p.stamp('BISCUITS & MACARONI', c('biscuits and macaroni'), { x: 640, y: 560, rot: -7, size: 64 })}` });
  p.sound('crate-1.mp3', c('boxes were opened'), -6);
  // H. That is a lead story
  const wl = s.pieces[s.pieces.length - 1].local0;   // the "wire-line" piece is always last
  p.headline(gEnd, wl - 0.1, { kicker: 'GOLD COAST PALAVA', text: 'That is what we call a *Lead Story.*', size: 120, y: 330, extra: p.stamp('LEAD STORY', c('a lead story') + 0.5, { x: 1250, y: 680, rot: -8, size: 70 }) });
  // I. And this is The Wire
  p.scene(wl - 0.1, s.dur, `<div style="position:absolute;left:0;right:0;top:400px;text-align:center;color:var(--red);font-size:40px;font-weight:700;letter-spacing:.3em">${p.typed('AND THIS IS WHAT WE CALL', c('and this is what we call'), { cps: 22, sfx: false })}</div>
    <div class="hl" style="left:0;top:470px;width:1920px;text-align:center"><h1 style="font-size:180px">${p.words(p.id_('tw'), 'The Wire.', c('the wire', { after: wl }), { stagger: 0.15 })}</h1></div>`);
  p.sound('teletype-2.mp3', c('the wire', { after: wl }), -10, 3);
  return p;
}

// =============================================================================
export function wire() {
  const [p, c, s] = make('wire');
  const aEnd = c('so in the very spring') - 0.1;
  p.tl.push(`tl.fromTo("#ticker", {x:0}, {x:-1900, duration:${(aEnd + 0.6).toFixed(2)}, ease:"none"}, 0);`);
  const tick = 'THE WIRE ▪ 2 DEC 1823 · WASHINGTON ▪ 22 JAN 1824 · BONSASO ▪ MAR 1824 · RANGOON ▪ MAY 1824 · VIENNA ▪ ';
  // Four columns on one line: portrait, dot on the line, date, place, caption, then that column's own chips.
  const node = (at, x, img, date, place, cap, chips = '') => {
    const id = p.id_('nd');
    // each event slides in along the line, as if carried by time
    p.tl.push(`tl.fromTo("#${id}", {opacity:0}, {opacity:1, duration:0.1, ease:"none"}, ${at.toFixed(3)});`);
    p.tl.push(`tl.fromTo("#${id}", {x:${x > 960 ? 420 : -420}, rotation:${x > 960 ? 4 : -4}}, {x:0, rotation:0, duration:${SP.heavy}, ease:"sp-heavy"}, ${at.toFixed(3)});`); p.ev(at);
    p.sound('syn-swish.wav', at - 0.05, -19); p.sound('teletype-1.mp3', at + 0.2, -22, 1.0);
    // a red pulse travels along the line to the new event
    p.tl.push(`tl.to("#tlpulse", {x:${x - 18}, duration:${SP.default}, ease:"sp-default", immediateRender:false}, ${(at - 0.1).toFixed(3)});`);
    return `<div id="${id}" style="position:absolute;left:${x - 210}px;top:160px;width:420px;text-align:center">
      <div class="roundimg" style="width:240px;height:240px;margin:0 auto;background-image:url(${p.asset(img)})"></div>
      <div style="width:30px;height:30px;border-radius:50%;background:var(--red);border:4px solid var(--ink);margin:20px auto 0"></div>
      <div class="mono" style="font-size:34px;font-weight:700;margin-top:16px">${date}</div>
      <div class="mono" style="font-size:22px;letter-spacing:.2em;color:var(--red);font-weight:700">${place}</div>
      <div style="font-family:'Playfair Display',serif;font-size:30px;line-height:1.15;margin-top:10px;height:72px">${cap}</div></div>
      <div class="chips-sm" style="position:absolute;left:${x - 210}px;top:670px;width:420px;display:flex;flex-direction:column;align-items:center">${chips}</div>`;
  };
  const ch = (t, q, kind) => p.chip(t, c(q), { kind });
  const nodes = [
    node(c('seven weeks before'), 730, 'final/battle-light.png', '22 JAN 1824', 'BONSASO', 'The band plays'),
    node(c('on december'), 260, 'img/monroe.jpg', '2 DEC 1823', 'WASHINGTON', 'Monroe: the Americas are closed',
      ch('MONROE → CONGRESS', 'president james monroe', 'chip light') + ch('“closed to new colonies”', 'the americas were closed', 'chip') + ch('THE MONROE DOCTRINE', 'which became the monroe', 'chip red')),
    node(c('six weeks after'), 1200, 'img/rangoon.jpg', 'MAR 1824', 'RANGOON', 'Britain declares war on Burma',
      ch('WAR ON BURMA', 'declare war on burma', 'chip red') + ch('into Rangoon', 'into rangoon', 'chip light')),
    node(c('and by may'), 1660, 'img/beethoven.jpg', 'MAY 1824', 'VIENNA', 'Beethoven’s Ninth',
      ch('NINTH SYMPHONY', 'ninth symphony', 'chip gold') + ch('“Ode to Joy”', 'ode to joy', 'chip light')),
  ].join('');
  const arrow = (at, cx, txt) => p.chip(txt, at, { kind: 'chip light tiny', x: cx - 90, y: 250 });
  const line = p.rule(0.3, { x: -400, y: 433, w: 2800, color: 'var(--ink)', h: 5 });
  // time keeps moving: the whole line drifts across the frame and its ticks scroll past
  p.tl.push(`tl.fromTo("#tlpan", {x:190}, {x:-40, duration:${(aEnd + 0.6).toFixed(2)}, ease:"none"}, 0);`);
  p.tl.push(`tl.fromTo("#tlticks", {x:0}, {x:-720, duration:${(aEnd + 0.6).toFixed(2)}, ease:"none"}, 0);`);
  p.tl.push(`tl.fromTo("#tlpulse", {x:-120}, {x:-120, duration:0.01, ease:"none"}, 0);`);
  p.scene(0, aEnd, `<div style="position:absolute;left:0;top:70px;height:56px;width:4000px;background:var(--ink);overflow:hidden"><div id="ticker" class="mono" style="white-space:nowrap;color:var(--gold);font-size:28px;font-weight:700;letter-spacing:.12em;line-height:56px">${tick.repeat(4)}</div></div>
    <div id="tlpan" style="position:absolute;left:0;top:0;width:1920px;height:1080px">
      <div style="position:absolute;left:-400px;top:418px;width:2800px;height:34px;overflow:hidden"><div id="tlticks" style="width:4000px;height:34px;background:repeating-linear-gradient(90deg, var(--ink) 0 4px, transparent 4px 60px)"></div></div>
      ${line}
      <div id="tlpulse" style="position:absolute;left:0;top:417px;width:36px;height:36px;border-radius:50%;background:var(--red);box-shadow:0 0 0 10px rgba(163,36,43,.22)"></div>
      ${nodes}
      ${arrow(c('seven weeks before') + 0.6, 495, '← 7 WEEKS')}${arrow(c('six weeks after') + 0.6, 965, '6 WEEKS →')}</div>`, { enter: 'cut' });
  // B. The same spring — castle footage on the left, the line lights up word by word on the right
  const bEnd = c('there is much more') - 0.1;
  const q = p.spoken(c, aEnd, bEnd, { accents: { universal: 'gold', brotherhood: 'gold', mapped: 'acc', seriously: 'acc' } });
  p.scene(aEnd, bEnd, `<div class="hl" style="left:880px;top:150px;width:960px">${p.kicker('THE SAME SPRING', aEnd + 0.1)}<h1 style="font-size:60px;line-height:1.16;font-weight:700">${q}</h1></div>`);
  p.vprint(B('castle-wide.mp4'), aEnd + 0.15, bEnd, { x: 80, y: 230, w: 720, rot: -2, caption: 'An empire that thought it understood the world', credit: 'Cape Coast Castle · Wikimedia Commons · CC BY-SA 4.0' });
  p.vprint(B('kente-pattern.mp4'), c('a kingdom it had never') - 0.4, bEnd, { x: 160, y: 620, w: 520, rot: 3, caption: 'A kingdom it never took seriously', credit: 'Wikimedia Commons · CC BY-SA 4.0' });
  // C. Still on the file — centred rows, each redaction tears away with a sound, each answer gets a picture
  const row = (at, txt, y) => {
    const id = p.id_('rw');
    p.tl.push(`tl.fromTo("#${id}-bar", {scaleX:1}, {scaleX:0, duration:${SP.default}, ease:"sp-default"}, ${at});`); p.ev(at);
    p.sound('syn-tear.wav', at, -13);
    return `<div style="position:absolute;left:330px;top:${y}px;width:1180px;height:96px"><div style="font-family:'Playfair Display',serif;font-weight:700;font-size:52px;line-height:96px;white-space:nowrap;text-align:center">${txt}</div><div id="${id}-bar" style="position:absolute;inset:0;background:var(--ink);transform-origin:100% 50%"></div></div>`;
  };
  const hd = c("the governor's head"), rk = c('the rockets'), qm = c('a queen mother');
  p.scene(bEnd, s.dur, `<div class="hl" style="left:0;top:150px;width:1920px;display:flex;justify-content:center">${p.kicker('STILL ON THE FILE', bEnd + 0.1)}</div>
    ${row(hd, 'What happened to the governor’s <i style="color:var(--red)">head</i>', 270)}
    ${row(rk, 'What the Asantes made of the <i style="color:var(--red)">rockets</i> (1826)', 410)}
    ${row(qm, 'A queen mother, and a <i style="color:var(--red)">chair</i> — 1900', 550)}
    ${p.icon('governor', hd + 0.35, { x: 40, y: 200, w: 270, rot: -5, sfx: 'syn-boop.wav', db: -18 })}
    ${p.print('img/congreve.jpg', rk + 0.35, { x: 1560, y: 230, w: 320, rot: 4, caption: 'Congreve rockets', credit: '' })}
    ${p.print('img/golden-stool-1935.jpg', qm + 0.35, { x: 40, y: 560, w: 280, rot: -3, caption: 'The Golden Stool', credit: '' })}
    ${p.stamp('FULL EDITION — COMING', c('that will be a full edition'), { x: 470, y: 740, rot: -4, size: 54 })}
    ${p.stamp('NO SPOILERS', c('i will not spoil it'), { x: 1180, y: 800, rot: 6, size: 54, color: 'var(--ink)' })}`);
  p.sound('whoosh-1.mp3', rk + 0.3, -18); p.sound('stamp-1.mp3', qm + 0.5, -18);
  return p;
}

// =============================================================================
export function walk() {
  const [p, c, s] = make('walk');
  const aEnd = c('first the details') - 0.1;
  const five = p.id_('five'), thg = p.id_('thg');
  p.tl.push(`tl.fromTo("#${five}", {yPercent:110}, {yPercent:0, duration:${SP.heavy}, ease:"sp-heavy"}, ${c('five things')});`); p.ev(c('five things'));
  p.tl.push(`tl.fromTo("#${thg}", {yPercent:120}, {yPercent:0, duration:${SP.default}, ease:"sp-default"}, ${c('five things') + 0.25});`);
  p.sound('stamp-1.mp3', c('five things') + 0.2, -8);
  p.headline(0, aEnd, { kicker: 'WHAT YOU WALK AWAY WITH', text: 'So what is in it *for you?*', size: 130, y: 260, enter: 'cut', extra: `<div class="mk" style="position:absolute;left:1350px;top:380px"><div id="${five}" class="big-num" style="font-size:360px">5</div></div><div class="mk" style="position:absolute;left:1580px;top:700px"><div id="${thg}" class="mono wd" style="font-size:40px;font-weight:700">THINGS</div></div>` });
  const b = [c('first the details'), c('second the world'), c('third a way'), c('fourth something'), c('fifth a place'), s.dur];
  // Moving cartoon prints where the page has room (things 2, 4 and 5)
  const reel = { 1: ['castle-arches.mp4', 'The world beside us'], 3: ['drummers.mp4', 'Something to carry into the group chat'], 4: ['kente-hanging.mp4', 'Your letters, read out next edition'] };
  const mid = (i) => b[i] + (b[i + 1] - b[i]) * 0.45;
  Object.entries(reel).forEach(([i, [f, cap]]) => p.vprint(B(f), mid(+i), b[+i + 1] - 0.15, { x: 1430, y: 430, w: 420, rot: +i % 2 ? -3 : 3, caption: cap, mediaStart: 1 }));
  // Everything said becomes a picture that lands as it is spoken, each with its own small sound
  const FX = ['syn-boop.wav', 'syn-tick.wav', 'syn-ding.wav', 'syn-boop.wav'];
  const grid = (items, cols = 4, w = 290, x0 = 520, gap = 340, rows = [370, 640]) => items.map(([q, n_, fx], i) => {
    const r = Math.floor(i / cols), k = i % cols, inRow = Math.min(cols, items.length - r * cols);
    const x = x0 + (cols - inRow) * gap / 2 + k * gap;
    return p.icon(n_, c(q), { x, y: rows[r], w, rot: [-4, 3, -2, 4][i % 4], sfx: fx || FX[i % 4], db: -20 });
  }).join('');
  p.numbered(b[0], b[1] - 0.1, 1, 'The details nobody gave you.', [], { extra: grid([
    ['most of us were taught', 'textbooks'], ['weather', 'storm', 'syn-splash.wav'], ['rumors', 'rumours'], ['bad decisions', 'bad-decision'],
    ['unlikely friendships', 'friendship'], ['very human fear', 'fear'], ['dinner table', 'dinner-memory']]) });
  p.numbered(b[1], b[2] - 0.1, 2, 'The world beside us.', [], { extra: grid([
    ['every edition sets ghana', 'ghana-world'], ['where we were ahead', 'race'], ['same storm', 'same-storm', 'syn-splash.wav']], 3, 270, 520, 300, [420]) });
  p.numbered(b[2], b[3] - 0.1, 3, 'A way to read today’s news.', [], { extra: grid([
    ['a coup', 'coup'], ['a currency crisis', 'currency'], ['a stadium scandal', 'stadium'], ['a loud election', 'election'], ['sharper questions', 'tv-interview']]) });
  p.numbered(b[3], b[4] - 0.1, 4, 'Something to say.', [], { extra: grid([
    ['a group chat', 'groupchat', 'syn-dings.wav'], ['a classroom', 'classroom'], ['a family argument', 'family-table']], 3, 270, 520, 300, [380])
    + p.icon('x-logo', c('on x'), { x: 840, y: 700, w: 180, rot: -5, sfx: 'syn-pop.wav', db: -17 })
    + p.icon('substack-logo', c('on substack'), { x: 1080, y: 700, w: 180, rot: 4, sfx: 'syn-pop.wav', db: -17 }) });
  p.numbered(b[4], b[5], 5, 'A place to answer back.', [], { extra: grid([
    ['letters page', 'letters-pile'], ['the best letters', 'letter-mic'], ['helping write it', 'write-together']], 3, 270, 520, 300, [420]) });
  return p;
}

// =============================================================================
export function nest() {
  const [p, c, s] = make('nest');
  const aEnd = c('her name is') - 0.1;
  p.headline(0, aEnd, { kicker: 'THE NEST · ONE DESK', text: 'Every paper is only as good as the people it makes *uncomfortable.*', size: 100, x: 600, y: 270, width: 1200, enter: 'cut', extra: p.print('/home/user/gcp/build/assets/gcp-highlight-nest-1080x1080.png', 0.2, { x: 130, y: 260, w: 380, rot: -4 }) + p.chip('ONE DESK', c('introduce one desk'), { kind: 'chip red', x: 600, y: 180 }) + p.rule(c('makes uncomfortable'), { x: 600, y: 760, w: 760, color: 'var(--red)', h: 10 }) });
  // Aba: the still, then the footage of her hand and the passport
  const plan = c('she also has a quiet plan');
  const plate = `<div class="hl" style="left:110px;top:200px;width:900px;${ON}"><div class="mono" style="display:inline-block;font-size:26px;letter-spacing:.3em;color:var(--red);background:var(--paper);padding:8px 16px;font-weight:700">THE DESK THAT TALKS</div><h1 style="font-size:220px;line-height:.95">${p.words(p.id_('aba'), 'Aba.', c('her name is'), { stagger: 0.1 })}</h1></div>`;
  // she talks to the printer, the plantain seller and the generator: each one appears as she names it
  const talks = p.chip('she talks to me…', c('she talks to me') + 0.35, { kind: 'chip light', x: 120, y: 560 })
    + p.icon('printer', c('to the printer'), { x: 1150, y: 170, w: 320, rot: -4, sfx: 'press-1.mp3', db: -16, len: 1.6 })
    + p.icon('plantain', c('the woman who sells plantain'), { x: 1520, y: 300, w: 330, rot: 3, sfx: 'syn-boop.wav', db: -19 })
    + p.icon('generator', c('to the generator'), { x: 1230, y: 560, w: 360, rot: -2, sfx: 'syn-tick.wav', db: -18 });
  p.cover(aEnd, plan - 0.1, 'final/aba-light.png', { move: 'in', focus: '55% 45%', dim: 0.25, overlay: `${plate}${talks}` });
  p.sound('generator-1.mp3', c('when it dies') - 0.4, -10, 3.5);
  const bEnd = c('i gave her') - 0.1;
  const lab = (txt, at, x, y) => { const id = p.id_('pl'); p.grow(id, at, { preset: 'snappy', dy: 20, from: 0.6 }); return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px" class="mono"><div style="background:var(--red);color:#fff;font-size:28px;font-weight:700;padding:8px 16px;letter-spacing:.1em;white-space:nowrap">${txt}</div></div>`; };
  const lg = c('which is to leave ghana');
  const plane = p.icon('airplane', lg, { x: 1200, y: 150, w: 380, rot: -8, sfx: 'syn-takeoff.wav', db: -11 });
  const planeId = plane.match(/id="([^"]+)"/)[1];
  p.tl.push(`tl.to("#${planeId}", {x:700, y:-420, scale:0.6, duration:1.8, ease:"power2.in", immediateRender:false}, ${(lg + 1.6).toFixed(3)});`);
  p.broll(plan - 0.1, bEnd, B('aba-passport.mp4'), { rate: 0.75, dim: 0.2, overlay: `${plane}${p.chip('a quiet plan: <b style="color:var(--gold)">leave Ghana</b>', c('which is to leave ghana'), { kind: 'chip', x: 110, y: 200 })}${lab('PASSPORT: RENEWED', c('passport already renewed'), 1180, 420)}${lab('DESTINATION: CHOSEN', c('destination already chosen'), 1180, 500)}` });
  // The 1824 file
  const cEnd = c('she sat with') - 0.1;
  p.scene(bEnd, cEnd, `<div style="position:absolute;left:150px;top:200px;width:820px;height:600px;background:#D9B97A;border:4px solid var(--ink);box-shadow:16px 18px 0 var(--ink);transform:rotate(-2deg)"><div class="mono" style="position:absolute;left:40px;top:30px;font-size:36px;font-weight:700;letter-spacing:.2em">FILE · 1824</div>${p.print('img/bowdich-mission.jpg', bEnd + 0.3, { x: 230, y: 110, w: 330, rot: 3 })}</div>
    <div class="hl" style="left:1060px;top:220px;width:760px">${p.kicker('THE 1824 FILE', bEnd + 0.1)}<h1 style="font-size:80px">${p.words(p.id_('sk'), 'Expecting her to *skim* it.', c('expecting her to skim'))}</h1></div>
    ${p.stamp('READ TWICE', c('she read it twice'), { x: 1080, y: 560, rot: -8, size: 66 })}
    ${p.chip('…she stopped talking altogether', c('stopped talking altogether'), { kind: 'chip', x: 1060, y: 720 })}
    ${p.chip('in The Nest: a *medical emergency*', c('medical emergency'), { kind: 'chip light', x: 1060, y: 820 })}`);
  // Ten minutes — the footage again, slower
  const dEnd = c('as for the other') - 0.1;
  const tm = p.id_('tm'); p.grow(tm, c('ten minutes'), { from: 0.7, dy: 0, preset: 'heavy' });
  p.broll(cEnd, dEnd, B('aba-passport.mp4'), { rate: 0.5, mediaStart: 0.5, dim: 0.2, overlay: `<div id="${tm}" class="mono" style="position:absolute;left:120px;top:150px;font-size:150px;font-weight:700;${ON}">10:00</div><div class="mono" style="position:absolute;left:120px;top:400px;font-size:26px;color:#FCF5E8;background:var(--ink);padding:8px 16px;font-weight:700;letter-spacing:.2em">A HAND FLAT ON THE PAGE</div>${lab('→ A FEW CENTIMETRES FURTHER FROM THE EDGE', c('push the passport'), 900, 380)}${p.chip('she is still working it out', c('still working it out'), { kind: 'chip gold', x: 120, y: 860 })}` });
  // The other desks
  const eEnd = c('one of them sits') - 0.1;
  p.headline(dEnd, eEnd, { kicker: 'AS FOR THE OTHER DESKS', text: 'A good newspaper keeps some of its *sources* to itself.', size: 104, y: 300, extra: `<div style="position:absolute;left:150px;top:180px">${p.chip('you will have to wait', c('you will have to wait'), { kind: 'chip gold' })}</div>${p.stamp('SOURCES PROTECTED', c('to itself'), { x: 1100, y: 700, rot: -6, size: 52 })}` });
  const fEnd = c('and that another') - 0.1;
  p.broll(eEnd, fEnd, B('lamp-desk.mp4'), { rate: 0.8, dim: 0.25, overlay: `<div class="hl" style="left:110px;top:170px;width:1000px;${ON}"><div class="mono" style="font-size:26px;letter-spacing:.3em;color:var(--gold);font-weight:700">DESK No. 2</div><h1 style="font-size:84px">${p.words(p.id_('lp'), 'The lamp is never switched on.', c('the lamp is never'))}</h1></div>${p.chip('its owner has never needed it', c('has never needed it'), { kind: 'chip light', x: 110, y: 500 })}` });
  const gEnd = c('they will each be') - 0.1;
  p.broll(fEnd, gEnd, B('trust-desk.mp4'), { rate: 0.8, dim: 0.25, overlay: `<div class="hl" style="left:110px;top:170px;width:1100px;${ON}"><div class="mono" style="font-size:26px;letter-spacing:.3em;color:var(--gold);font-weight:700">DESK No. 3</div><h1 style="font-size:84px">${p.words(p.id_('tr'), 'Has not yet decided whether to *trust* me.', c('another has not yet'))}</h1></div>` });
  const desks = [['DESK No. 1', 'Aba'], ['DESK No. 2', '██████'], ['DESK No. 3', '██████']].map(([l, t], i) => card(p, gEnd + 0.2 + i * 0.25, { x: 170 + i * 560, y: 300, w: 500, label: 'THE NEST', desk: l, title: t, rot: [-2, 1, -1][i] })).join('');
  p.scene(gEnd, s.dur, `${desks}${p.stamp('INTRODUCED WHEN THE STORY CALLS', c('when the story calls'), { x: 330, y: 720, rot: -4, size: 50 })}`);
  return p;
}

// =============================================================================
export function editor() {
  const [p, c, s] = make('editor');
  const vEnd = (({ local0, vo_in, vo_out }) => local0 + vo_out - vo_in)(s.pieces[s.pieces.length - 1]);
  const q = p.spoken(c, 0, vEnd + 0.01, { accents: { someone: 'acc', else: 'acc', read: 'gold' } });
  const sig = p.id_('sig');
  p.tl.push(`tl.fromTo("#${sig}", {strokeDasharray:900, strokeDashoffset:900}, {strokeDashoffset:0, duration:1.4, ease:"power2.inOut"}, ${vEnd - 0.4});`); p.ev(vEnd - 0.4);
  p.sound('pen-1.mp3', vEnd - 0.4, -10, 1.6);
  p.scene(0, p.dur, `<div class="hl" style="left:170px;top:190px;width:1580px"><div class="kicker" style="color:var(--red)"><i style="background:var(--red)"></i>EDITOR'S NOTE</div><h1 style="font-size:84px;line-height:1.14;font-weight:700">${q}</h1></div>
    <svg style="position:absolute;left:1280px;top:760px" width="460" height="140" viewBox="0 0 460 140"><path id="${sig}" d="M10 90 C 40 20, 70 20, 80 80 S 120 120, 140 60 S 180 10, 200 70 S 240 110, 270 50 C 290 20, 320 100, 350 70 S 420 40, 450 60" fill="none" stroke="#A3242B" stroke-width="5" stroke-linecap="round"/></svg>
    <div class="mono" style="position:absolute;left:1300px;top:900px;color:var(--red);font-size:22px;letter-spacing:.2em;font-weight:700">— THE EDITOR, THE NEST</div>`, { enter: 'cut' });
  p.ev(p.dur - 1.2);
  return p;
}

// =============================================================================
export function dispatch() {
  const [p, c, s] = make('dispatch');
  p.css.push(BANNER_CSS);
  const aEnd = c('filed and signed') - 0.1;
  p.headline(0, aEnd, { kicker: 'DISPATCH', text: process.env.GCP_DISPATCH_TEXT || 'This is the *headline edition* of the Gold Coast Palava.', size: 110, y: 290, enter: 'cut' });
  const bEnd = c('and dispatched to') - 0.1;
  const sig = p.id_('sg');
  p.tl.push(`tl.fromTo("#${sig}", {strokeDasharray:900, strokeDashoffset:900}, {strokeDashoffset:0, duration:1.3, ease:"power2.inOut"}, ${c('filed and signed') + 0.5});`); p.ev(c('filed and signed') + 0.5);
  p.sound('pen-2.mp3', c('filed and signed') + 0.5, -8);
  p.scene(aEnd, bEnd, `<div class="hl" style="left:150px;top:230px;width:1600px">${p.kicker('FILED & SIGNED', aEnd + 0.1)}<div class="mono" style="font-size:52px;font-weight:700;line-height:1.5">${p.typed('THE NEST · 266 SANDPIPER LOOP', c('at the nest'), { cps: 24 })}<br>${p.typed('ONIPA ENCLAVE', c('enclave') - 0.8, { cps: 20, sfx: false })}</div></div>
    <svg style="position:absolute;left:150px;top:560px" width="520" height="160" viewBox="0 0 460 140"><path id="${sig}" d="M10 90 C 40 20, 70 20, 80 80 S 120 120, 140 60 S 180 10, 200 70 S 240 110, 270 50 C 290 20, 320 100, 350 70 S 420 40, 450 60" fill="none" stroke="#1A1612" stroke-width="5" stroke-linecap="round"/></svg>
    ${p.stamp('FILED', c('filed and signed') + 1.8, { x: 900, y: 560, rot: -10, size: 90 })}`);
  // Route
  const vEnd = (({ local0, vo_in, vo_out }) => local0 + vo_out - vo_in)(s.pieces[s.pieces.length - 1]);
  const stops = [['accra', 'ACCRA'], ['kumasi', 'KUMASI'], ['bungpurugu', 'BUNKPURUGU'], ['hafasini', 'HALF ASSINI'], ['and to the world', 'THE WORLD']];
  const route = stops.map(([q, t], i) => p.chip(t, c(q), { kind: i === 4 ? 'chip gold' : 'chip', x: 150 + i * 340, y: 520 + (i % 2) * 120 })).join('');
  const path_ = p.id_('rt');
  p.tl.push(`tl.fromTo("#${path_}", {strokeDasharray:1800, strokeDashoffset:1800}, {strokeDashoffset:0, duration:${(c('and to the world') - c('accra') + 0.5).toFixed(2)}, ease:"none"}, ${c('accra')});`);
  stops.forEach(([q]) => p.sound('page-turn-3.mp3', c(q), -18));
  p.scene(bEnd, vEnd + 0.6, `<div class="hl" style="left:150px;top:220px;width:1600px">${p.kicker('…AND DISPATCHED TO', bEnd + 0.1)}<h1 style="font-size:100px">${p.words(p.id_('dp'), 'Wherever you are reading.', bEnd + 0.3)}</h1></div>
    <svg style="position:absolute;left:0;top:0" width="1920" height="1080"><path id="${path_}" d="M230 560 L570 680 L910 560 L1250 680 L1590 560" fill="none" stroke="#A3242B" stroke-width="5" stroke-dasharray="14 10"/></svg>${route}`);
  // Outro: the banner assembles once more on the soundtrack swell, then folds back into the symbol
  const o0 = vEnd + 0.6;
  const bn = banner(p, 'ob', { t0: o0 + 0.2, speed: 1.15, until: s.dur - 3.0 });
  const sub = p.chip('SUBSCRIBE — so the next edition finds you', o0 + 3.2, { kind: 'chip red sub-sm' });
  // final fold: everything but the symbol collapses into it, the symbol centres
  const fold = s.dur - 3.0;
  p.tl.push(`tl.to("#ob-sym", ${JSON.stringify({ x: 494, y: -95, scale: 3.0, duration: SP.heavy, ease: 'sp-heavy', immediateRender: false })}, ${fold});`);
  p.tl.push(`tl.to("#ob > :not(#ob-sym)", {opacity:0, scale:0.6, duration:0.5, ease:"power2.in", immediateRender:false}, ${fold});`);
  p.ev(fold); p.ev(o0 + 7); p.ev(o0 + 10);
  p.sound('whoosh-2.mp3', fold, -12);
  p.scene(o0, s.dur, `${bn}<div style="position:absolute;left:0;right:0;top:690px;text-align:center">${sub}</div>`, { drift: 0.03, bg: 'plain' });
  p.mastEnd = o0;
  return p;
}

// =============================================================================
// Letters Page — authored as a static design and animated by design-to-motion.
export function letters() {
  const s = SEGMENTS.letters, c = cuer(s.pieces);
  const q1 = c('here is our very first'), q2 = c('what is one thing'), q3 = c('leave it in the comments'), q4 = c('subscribe');
  const design = {
    name: 'letters-page', width: 1920, height: 1080, fps: 30, duration: s.dur, style: 'energetic', exit: 'none',
    tokens: { colors: { ink: '#1A1612', paper: '#F7F1E3', gold: '#C9962F', red: '#A3242B', muted: '#6B6253' } },
    background: '$paper',
    layers: [
      { id: 'paperbg', type: 'image', src: '/home/user/gcp/build/assets/paper.jpg', x: 0, y: 0, width: 1920, height: 1080, motion: 'none' },
      { id: 'kente', type: 'rect', x: 0, y: 0, width: 1920, height: 14, fill: 'repeating-linear-gradient(90deg,#C9962F 0 46px,#A3242B 46px 70px,#1A1612 70px 86px)', motion: 'none' },
      { id: 'icon', type: 'image', src: '/home/user/gcp/build/assets/gcp-highlight-letters-1080x1080.png', x: 150, y: 150, width: 260, height: 260, radius: 130, motion: { preset: 'pop', delay: q1 } },
      { id: 'kicker', type: 'text', text: 'LETTERS PAGE · QUESTION No. 1', x: 460, y: 205, width: 1200, fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: 30, letterSpacing: 0.2, color: '$red', motion: { preset: 'slide-right', delay: q1 + 0.2 } },
      { id: 'intro', type: 'text', text: 'Our very first letter question:', x: 460, y: 260, width: 1300, fontFamily: 'Playfair Display', fontSize: 58, italic: true, color: '$muted', motion: { preset: 'rise', delay: q1 + 0.5 } },
      { id: 'rule', type: 'line', x: 460, y: 350, width: 600, height: 8, color: '$gold', motion: { preset: 'wipe', delay: q1 + 0.8 } },
      { id: 'question', type: 'text', text: 'What is one thing happening in Ghana today that you suspect has a much older story behind it?', x: 150, y: 450, width: 1640, fontFamily: 'Playfair Display', fontWeight: 900, fontSize: 86, lineHeight: 1.08, color: '$ink', motion: { preset: 'rise', split: 'words', stagger: 0.17, delay: q2 } },
      { id: 'pinbox', type: 'rect', x: 150, y: 830, width: 860, height: 96, fill: '$ink', radius: 48, motion: { preset: 'scale-in', delay: q3 } },
      { id: 'pintext', type: 'text', text: 'PINNED IN THE COMMENTS — LEAVE YOURS', x: 150, y: 860, width: 860, align: 'center', fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: 30, color: '#FBF8EF', motion: { preset: 'rise', delay: q3 + 0.25 } },
      { id: 'subbtn', type: 'rect', x: 1090, y: 830, width: 560, height: 96, fill: '$red', radius: 48, motion: { preset: 'pop', delay: q4, idle: 'pulse' } },
      { id: 'subtext', type: 'text', text: 'SUBSCRIBE', x: 1090, y: 856, width: 560, align: 'center', fontFamily: 'IBM Plex Mono', fontWeight: 700, fontSize: 40, letterSpacing: 0.2, color: '#FFFFFF', motion: { preset: 'rise', delay: q4 + 0.2 } },
    ],
  };
  fs.mkdirSync('designs', { recursive: true });
  fs.writeFileSync('designs/letters.json', JSON.stringify(design, null, 2));
  const scene = normalizeDesign(design);
  const sfx = [[q1, 'page-turn-2.mp3', -12], [q2, 'whoosh-1.mp3', -18], [q3, 'typewriter-1.mp3', -16], [q4, 'stamp-1.mp3', -10]].map(([t, f, db]) => ({ file: `/home/user/gcp/project/media/sfx/${f}`, T: +(s.T0 + t).toFixed(3), db }));
  return { dur: s.dur, html: scene.layers, write: (dir) => { compileToHyperFrames(scene, dir, { baseDir: '/' }); return { sfx, busy: [[s.T0 + q1, s.T0 + s.dur]] }; } };
}
