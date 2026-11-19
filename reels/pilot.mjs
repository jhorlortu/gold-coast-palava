// Social reel (9:16) — the pilot as an introduction: what the Gold Coast Palava is, its segments, what to expect.
// Voice + SFX only (no music on social versions).
import { loadReel, captions, hl, kick, sub, counter, bannerP, endCard, enrichSfx, X0, CW } from './rlib.mjs';
const BN = '/home/user/gcp/build/assets/banner2';
const E1 = '/home/user/gcp/ed1/media/sfx';

export function build() {
  const { R, p, c, at, win } = loadReel('/home/user/gcp/reels/pilot', '');
  const fx = (f, t, db = -16, len) => p.sfx.push({ file: `${E1}/${f}`, T: +t.toFixed(3), db, ...(len ? { len } : {}) });
  // a banner desk card dropping onto the page
  const card = (i, t, x, y, w, rot) => {
    const id = p.id_('dc');
    p.tl.push(`tl.fromTo("#${id}", {opacity:0}, {opacity:1, duration:0.08, ease:"none"}, ${t.toFixed(3)});`);
    p.tl.push(`tl.fromTo("#${id}", {y:-500, scale:1.25, rotation:${rot + (p.uid % 2 ? 18 : -18)}}, {y:0, scale:1, rotation:${rot}, duration:0.9, ease:"sp-default"}, ${t.toFixed(3)});`);
    p.ev(t); p.sound('page-turn-3.mp3', t + 0.1, -17); p.sound('syn-thud.wav', t + 0.35, -17);
    return `<img id="${id}" src="${p.asset(`${BN}/card${i}.png`)}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;box-shadow:9px 11px 0 rgba(70,52,25,.32)">`;
  };

  // HOOK — why this newspaper exists
  let [a, b] = win('hook');
  const yours = c('and this newspaper') - 0.1;
  p.scene(0, yours, `${hl(p, 'A country that does not know its *own story…*', 0.15, { size: 100, y: 300 })}
    ${sub(p, '…tends to be told one by *someone else.*', c('tends to be told'), { y: 672, size: 60 })}
    ${p.icon('rumours', c('by someone else') - 0.2, { x: 290, y: 856, w: 500, life: 'jiggle', until: yours + 0.3 })}`, { enter: 'cut' });
  p.scene(yours, b, `${hl(p, 'This newspaper exists so that next time someone tells *yours…*', yours + 0.1, { size: 88, y: 300 })}
    ${p.icon('letters-pile', yours + 0.6, { x: 280, y: 742, w: 520, life: 'bob', until: b + 0.3, sfx: 'page-turn-1.mp3', db: -15 })}
    ${p.stamp('YOU’LL HAVE READ IT FIRST', c('already have read') - 0.1, { x: 70, y: 1316, rot: -5, size: 52 })}`, { enter: 'wipeU' });
  fx('heartbeat.wav', c('already have read') + 0.4, -15);

  // THE MONTAGE — the channel banner assembles; "This is the Gold Coast Palava."
  a = at.brand.T0 - 0.12; b = win('thisis')[1];
  p.scene(a, b, bannerP(p, 'bnr', { t0: a + 0.12, until: b + 0.4, lockY: 790 }).html, { enter: 'iris', bg: 'paper' });

  // PALAVA — the dictionary entry
  [a, b] = win('palava');
  const ln = (t, txt, y) => { const id = p.id_('dl'); p.tl.push(`tl.fromTo("#${id}", {xPercent:-105}, {xPercent:0, duration:0.9, ease:"sp-default"}, ${t.toFixed(3)});`); p.sound(`${E1}/pop-1.wav`, t, -16); p.ev(t);
    return `<div style="position:absolute;left:${X0 + 40}px;top:${y}px;overflow:hidden;padding-right:30px"><div id="${id}" style="font-family:'Playfair Display',serif;font-weight:700;font-size:58px">${txt}</div></div>`; };
  p.scene(a, b, `${kick(p, 'IN OUR PART OF THE WORLD', a + 0.1)}
    <div class="card" style="left:${X0}px;top:330px;width:${CW}px;height:640px"></div>
    <div class="hl" style="left:${X0 + 40}px;top:360px;width:860px"><h1 style="font-size:130px">${p.words(p.id_('pv'), 'pa·la·va', a + 0.3, { stagger: 0.1 })}</h1></div>
    <div class="mono" style="position:absolute;left:${X0 + 44}px;top:515px;font-size:28px;color:var(--muted);font-weight:700;letter-spacing:.12em">NOUN · GHANAIAN ENGLISH</div>
    ${ln(c('means trouble') + 0.1, '1. <em class="acc">trouble</em>', 610)}
    ${ln(c('an argument'), '2. an argument', 710)}
    ${ln(c('a story too big'), '3. a story too big for', 810)}
    ${ln(c('for one mouth'), '&nbsp;&nbsp;&nbsp;&nbsp;one mouth to carry', 890)}
    ${p.icon('argument', c('an argument') + 0.2, { x: 700, y: 902, w: 300, rot: 6, life: 'jiggle', until: b })}
    ${p.stamp('GHANA HAS ALL THREE', c('any of the three') - 0.3, { x: 150, y: 1224, rot: -5, size: 54 })}`, { enter: 'wipeL' });

  // LEAD STORY — one day, one event, one decision, slowed down
  [a, b] = win('edition');
  const room = c('which usually means') - 0.1;
  p.scene(a, room, `${kick(p, 'EACH EDITION · THE LEAD STORY', a + 0.1)}
    ${hl(p, 'One *day.*', c('one day'), { size: 130, y: 320 })}${hl(p, 'One *event.*', c('one event'), { size: 130, y: 534 })}${hl(p, 'One *decision.*', c('or one decision'), { size: 130, y: 718 })}
    ${sub(p, '…slowed down far enough to see *what really happened.*', c('and slow it down'), { y: 1018, size: 56 })}`, { enter: 'push' });
  fx('wind.wav', c('and slow it down'), -20, 3);
  const cell = (name, t, x, y, label) => `${p.icon(name, t, { x, y, w: 330, life: 'bob', until: b })}${p.chip(label, t + 0.15, { kind: 'chip light', x: x - 10, y: y + 330 })}`;
  p.scene(room, b, `${kick(p, 'WHICH USUALLY MEANS', room + 0.1)}
    ${cell('groupchat', c('who was in the'), 90, 300, 'who was in the room')}
    ${cell('storm', c('what the weather'), 600, 300, 'the weather')}
    ${cell('fear', c('who was afraid'), 90, 760, 'who was afraid')}
    ${cell('rumours', c('who was lying'), 600, 760, 'who was lying')}`, { enter: 'wipeU' });
  fx('glass.wav', c('who was lying') + 0.1, -18);

  // THE WIRE — the rest of the world at that very hour
  [a, b] = win('world');
  p.scene(a, b, `${kick(p, 'THE WIRE', a + 0.1, { color: 'var(--gold)' })}${hl(p, 'What was the rest of the world doing *at that very hour?*', a + 0.2, { size: 92, y: 300, style: 'color:#FCF5E8' })}
    ${p.icon('ghana-world', c('at that very hour') - 0.2, { x: 260, y: 788, w: 560, life: 'spin', until: b })}
    ${p.chip('two chapters you were taught apart…', c('in separate chapters'), { kind: 'chip light', x: X0, y: 1259 })}
    ${p.chip('…happening the same week', c('the same week'), { kind: 'chip gold', x: X0, y: 1362 })}`, { enter: 'wipeR', bg: 'ink' });
  p.sound('teletype-1.mp3', a + 0.1, -18, 2.5);

  // THEN v NOW — bring it home
  [a, b] = win('home');
  p.scene(a, b, `${kick(p, 'THEN v NOW', a + 0.1)}${hl(p, 'Then we bring it home to the Ghana you live in *right now.*', a + 0.2, { size: 84, y: 300 })}
    ${p.icon('phone', c('on your phone'), { x: 90, y: 672, w: 380, life: 'jiggle', until: b, sfx: 'syn-phone-ring.wav', db: -18 })}
    ${p.icon('traffic', c('in traffic'), { x: 600, y: 672, w: 380, life: 'bob', until: b, sfx: 'syn-horns.wav', db: -18 })}
    ${p.icon('groupchat', c('in the group chat'), { x: 90, y: 1075, w: 380, life: 'pulse', until: b, sfx: 'syn-dings.wav', db: -18 })}
    ${p.icon('family-table', c('the argument at'), { x: 600, y: 1075, w: 380, life: 'bob', until: b, sfx: 'syn-grumble.wav', db: -18 })}`, { enter: 'wipeU' });

  // FOUR DESKS — politics, business, sports & entertainment, life & culture
  [a, b] = win('desks');
  p.scene(a, b, `${kick(p, 'FOUR DESKS', a + 0.1)}${hl(p, 'Every desk gets its *turn.*', a + 0.15, { size: 96, y: 300 })}
    ${card(0, c('politics'), 60, 520, 470, -3)}${card(1, c('business'), 560, 500, 470, 2)}
    ${card(2, c('sports and'), 70, 860, 470, 2)}${card(3, c('life and culture'), 560, 880, 470, -2)}`, { enter: 'push' });

  // FRONT PAGE → LEAD STORY
  [a, b] = win('front');
  const lead = c('one lead story') - 0.2;
  p.scene(a, b, `${kick(p, 'FRONT PAGE', a + 0.1)}${hl(p, 'Quick, *mixed headlines…*', c('a front page') - 0.1, { size: 104, y: 300 })}
    ${card(5, c('quick mixed') - 0.2, 70, 540, 420, -6)}${card(6, c('quick mixed') + 0.1, 330, 520, 420, 3)}${card(7, c('quick mixed') + 0.4, 590, 560, 420, -2)}
    ${p.stamp('THEN ONE LEAD STORY — DEEP', lead, { x: 80, y: 1202, rot: -4, size: 50 })}`, { enter: 'wipeL' });
  fx('paper-slap.wav', lead + 0.1, -14);

  // THE TONE — English, enough Pidgin, serious about facts, light about everything else
  [a, b] = win('tone');
  p.scene(a, b, `${kick(p, 'HOW WE TALK', a + 0.1)}${hl(p, 'Mostly *English…*', a + 0.15, { size: 112, y: 300 })}
    ${p.chip('…with enough Pidgin to keep us honest', c('enough pidgin'), { kind: 'chip gold', x: X0, y: 523 })}
    ${p.icon('serious', c('serious about') - 0.1, { x: 330, y: 650, w: 420, life: 'bob', until: b })}
    ${p.stamp('SERIOUS ABOUT THE FACTS', c('serious about'), { x: 70, y: 1144, rot: -4, size: 52 })}
    ${p.stamp('LIGHT ABOUT EVERYTHING ELSE', c('light about'), { x: 60, y: 1282, rot: 3, size: 46, color: 'var(--gold)' })}`, { enter: 'iris' });

  // WHAT'S IN IT FOR YOU — five things, counted down the page
  [a, b] = win('five');
  p.scene(a, b, `${hl(p, 'So what’s in it *for you?*', a + 0.1, { size: 112, y: 340 })}
    ${counter(p, 5, c('five things'), { size: 330, color: 'var(--red)', x: 380, y: 718, label: 'THINGS', lsize: 44, dur: 0.6 })}`, { enter: 'push' });
  a = at.f1.T0 - 0.12; b = win('f5')[1];
  const row = (k, id, icon, txt, y) => { const t = at[id].T0 + 0.05, rid = p.id_('fr');
    p.tl.push(`tl.fromTo("#${rid}", {xPercent:-110}, {xPercent:0, duration:0.9, ease:"sp-default"}, ${t.toFixed(3)});`); p.ev(t); p.sound(`${E1}/pop-${(k % 3) + 1}.wav`, t, -14); p.sound('syn-swish.wav', t, -20);
    return `<div style="position:absolute;left:0;top:${y}px;width:1080px;overflow:hidden;height:190px"><div id="${rid}" style="position:absolute;left:${X0}px;top:0;width:${CW}px;height:170px;display:flex;align-items:center;gap:26px;background:#FCF5E8;border:4px solid var(--ink);box-shadow:8px 9px 0 var(--ink);padding:0 24px">
      <div class="bignum" style="font-size:120px;color:var(--gold);width:80px">${k}</div><div style="flex:1;font-family:'Playfair Display',serif;font-weight:900;font-size:46px;line-height:1.05">${txt}</div>
      <img src="${p.asset(`/home/user/gcp/project/media/icons/cut/${icon}.png`)}" style="width:150px;height:150px;object-fit:contain"></div></div>`; };
  p.scene(a, b, `${kick(p, 'FIVE THINGS', a + 0.1)}
    ${row(1, 'f1', 'dinner-memory', 'The details <em class="acc">nobody gave you</em>', 280)}
    ${row(2, 'f2', 'same-storm', 'The world <em class="acc">beside us</em>', 490)}
    ${row(3, 'f3', 'tv-interview', 'A way to read <em class="acc">today’s news</em>', 700)}
    ${row(4, 'f4', 'groupchat', 'Something <em class="acc">to say</em>', 910)}
    ${row(5, 'f5', 'letter-mic', 'A place to <em class="acc">answer back</em>', 1120)}`, { enter: 'wipeU' });

  // LETTERS PAGE — you help write it
  [a, b] = win('letters');
  p.scene(a, b, `${kick(p, 'THE LETTERS PAGE', a + 0.1)}${hl(p, 'This is not a *lecture.*', a + 0.15, { size: 116, y: 300 })}
    ${p.chip('every edition closes with a question', c('a question on'), { kind: 'chip light', x: X0, y: 558 })}
    ${p.icon('letters-pile', c('the best letters') - 0.1, { x: 90, y: 696, w: 460, life: 'bob', until: b, sfx: 'page-turn-2.mp3', db: -15 })}
    ${p.icon('write-together', c('read out in the next') - 0.1, { x: 560, y: 730, w: 420, life: 'jiggle', until: b })}
    ${p.stamp('YOU HELP WRITE IT', c('helping write it') - 0.2, { x: 120, y: 1282, rot: -5, size: 66 })}`, { enter: 'wipeL' });

  // SUBSCRIBE → END CARD
  [a, b] = win('subscribe');
  p.scene(a, b, `${hl(p, 'Let the next edition *find you.*', a + 0.1, { size: 116, y: 420 })}
    ${p.chip('🔔 SUBSCRIBE', c('subscribe') + 0.1, { kind: 'chip red', x: X0, y: 902 })}`, { enter: 'push' });
  p.sound('syn-ding.wav', c('subscribe') + 0.1, -14);
  endCard(p, at.endcard.T0 - 0.1, R.total, 'GOLD COAST PALAVA · EDITION 1 OUT NOW');

  captions(p, R);
  enrichSfx(p);
  p.html.push('<div class="bottomdeco"></div>');
  return { p, R };
}
