// Social reel (9:16) — THE INTRODUCTION cut: what the Gold Coast Palava is, its segments, what to expect.
// Voice + SFX only (no music on social versions).
import { loadReel, captions, hl, kick, sub, counter, bannerP, endCard, enrichSfx, X0, CW, SP } from './rlib.mjs';
const BN = '/home/user/gcp/build/assets/banner2';
const E1 = '/home/user/gcp/ed1/media/sfx';

export function build() {
  const { R, p, c, at, win } = loadReel('/home/user/gcp/reels/intro', '');
  const fx = (f, t, db = -16, len) => p.sfx.push({ file: `${E1}/${f}`, T: +t.toFixed(3), db, ...(len ? { len } : {}) });
  // a banner desk card dropping onto the page
  const card = (i, t, x, y, w, rot) => {
    const id = p.id_('dc');
    p.tl.push(`tl.fromTo("#${id}", {opacity:0}, {opacity:1, duration:0.08, ease:"none"}, ${t.toFixed(3)});`);
    p.tl.push(`tl.fromTo("#${id}", {y:-500, scale:1.25, rotation:${rot + (p.uid % 2 ? 18 : -18)}}, {y:0, scale:1, rotation:${rot}, duration:0.9, ease:"sp-default"}, ${t.toFixed(3)});`);
    p.ev(t); p.sound('page-turn-3.mp3', t + 0.1, -17); p.sound('syn-thud.wav', t + 0.35, -17);
    return `<img id="${id}" src="${p.asset(`${BN}/card${i}.png`)}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;box-shadow:9px 11px 0 rgba(70,52,25,.32)">`;
  };

  // THE MONTAGE — the channel banner assembles; "This is the Gold Coast Palava."
  // OPTIMUM DIGITAL PRESENTS — the symbol draws on the soundtrack's opening phrase, the line types beneath it
  let a = 0, b = at.brand.T0;
  p.mastStart = at.brand.T0;                          // no masthead over OPTIMUM DIGITAL PRESENTS (as in COMBO1)
  const sym = p.id_('osym'), odp = p.id_('odp');
  p.tl.push(`tl.fromTo("#${sym}", {scale:0.2, rotation:-30, opacity:0}, {scale:1, rotation:0, opacity:1, duration:${SP.heavy}, ease:"sp-heavy"}, 0.35);`);
  p.tl.push(`tl.fromTo("#${sym}", {y:0}, {y:-14, duration:1.6, ease:"sine.inOut", repeat:3, yoyo:true, immediateRender:false}, 1.6);`);
  p.tl.push(`tl.to("#${odp}", {yPercent:-130, duration:0.35, ease:"power2.in", immediateRender:false}, 6.55);`);
  p.ev(0.35); p.ev(3.6); p.ev(6.55);
  p.scene(0, b, `<img id="${sym}" src="${p.asset('/home/user/gcp/build/assets/gcp-symbol-transparent-1024.svg')}" style="position:absolute;left:290px;top:560px;width:500px">
    <div style="position:absolute;left:0;right:0;top:1150px;text-align:center"><span class="mk"><span id="${odp}" class="wd mono" style="font-size:40px;font-weight:700;letter-spacing:.22em;color:var(--red)">${p.typed('OPTIMUM DIGITAL PRESENTS', 3.6, { cps: 14 })}</span></span></div>`, { enter: 'cut', bg: 'plain' });
  // COMBO1 — the banner assembles on the downbeat; "This is the Gold Coast Palava."
  a = b; b = win('thisis')[1];
  p.scene(a, b, bannerP(p, 'bnr', { t0: a + 0.02, until: b + 0.4, lockY: 790 }).html, { enter: 'iris', bg: 'paper' });

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


  // DISPATCH — "This is the introduction to the Gold Coast Palava", filed and signed at The Nest, dispatched
  [a, b] = win('intro');
  p.scene(a, b, `${kick(p, 'DISPATCH', a + 0.1)}${hl(p, 'This is the *introduction* to the Gold Coast Palava.', a + 0.15, { size: 104, y: 300 })}
    ${p.stamp('THE INTRODUCTION', c('introduction') + 0.3, { x: 120, y: 900, rot: -5, size: 64 })}`, { enter: 'iris' });
  fx('paper-slap.wav', c('introduction') + 0.35, -14);
  [a, b] = win('filed');
  const route = c('and dispatched') - 0.1;
  const nest = p.id_('nst');
  p.tl.push(`tl.fromTo("#${nest}", {scale:1.05}, {scale:1.25, duration:${(route - a + 0.4).toFixed(2)}, ease:"none"}, ${a.toFixed(2)});`);
  p.scene(a, route, `${kick(p, 'FILED & SIGNED', a + 0.1)}
    <div class="tframe" style="left:54px;top:300px;width:972px;height:612px;overflow:hidden"><div style="width:940px;height:580px;overflow:hidden"><div id="${nest}" style="width:100%;height:100%;background:url(${p.asset('/home/user/gcp/project/media/final/nest-light.png')}) 45% 60%/cover"></div></div></div>
    ${p.chip('THE NEST', c('the nest') , { kind: 'chip red', x: X0, y: 960 })}
    ${p.chip('266 Sandpiper Loop', c('266'), { kind: 'chip light', x: X0, y: 1052 })}
    ${p.chip('Onipa Enclave', c('enclave') - 0.3, { kind: 'chip light', x: X0, y: 1144 })}
    ${p.stamp('FILED', c('filed and signed') + 0.9, { x: 640, y: 990, rot: -10, size: 84 })}`, { enter: 'wipeU' });
  fx('paper-slap.wav', c('filed and signed') + 0.2, -16);
  const stops = [['to accra', 'ACCRA'], ['to kumasi', 'KUMASI'], ['to bungpurugu', 'BUNKPURUGU'], ['to hafasini', 'HALF ASSINI'], ['and to the world', 'THE WORLD']];
  const rt = p.id_('rt');
  p.tl.push(`tl.fromTo("#${rt}", {opacity:0}, {opacity:1, duration:0.05, ease:"none"}, ${(c('to accra') - 0.05).toFixed(2)});`);
  p.tl.push(`tl.fromTo("#${rt}", {strokeDasharray:1400, strokeDashoffset:1400}, {strokeDashoffset:0, duration:${(c('and to the world') - c('to accra') + 0.6).toFixed(2)}, ease:"none"}, ${c('to accra').toFixed(2)});`);
  const ys = [560, 760, 960, 1160, 1360];
  p.scene(route, b, `${kick(p, '…AND DISPATCHED TO', route + 0.1)}
    <svg style="position:absolute;left:0;top:0" width="1080" height="1920"><path id="${rt}" d="M300 600 L760 800 L300 1000 L760 1200 L420 1400" fill="none" stroke="#A4241B" stroke-width="6" stroke-dasharray="16 12"/></svg>
    ${stops.map(([q, t], i) => p.chip(t, c(q), { kind: i === 4 ? 'chip gold' : 'chip', x: i % 2 ? 560 : 140, y: ys[i] })).join('')}
    ${p.icon('ghana-world', c('and to the world') + 0.3, { x: 640, y: 1240, w: 300, life: 'spin', until: b + 0.4 })}`, { enter: 'push' });
  stops.forEach(([q], i) => fx(`pop-${(i % 3) + 1}.wav`, c(q), -15));
  endCard(p, at.endcard.T0 - 0.1, R.total, 'GOLD COAST PALAVA · THE INTRODUCTION');

  captions(p, R);
  enrichSfx(p);
  p.html.push('<div class="bottomdeco"></div>');
  return { p, R };
}
