// Special No. 1 — the four questions and the lesson. Each section: the phone (the team chat) holds the right third,
// the left two-thirds change every few seconds with the story. Cues are keyed to the transcript (Whisper spellings).
import path from 'node:path';
import { SP } from '/home/user/gcp/build/lib.mjs';
import { HELPERS as K } from './sp1.mjs';
const { make, cs, fx, efx, H, chip, stack, stk, prt, nameCard, card, quote, dateline, counter, away, strikeWord, ghanaFlag, sceneP, LX, SP1_CSS, Phone, n3, spr, PSFX, ED1SFX } = K;

const tw = (p, text, at, size = 60, color = 'var(--ink)', cps = 20) => p.typed(text, at, { cps, cls: 'tw' }).replace('class="tw"', `class="tw" style="font-size:${size}px;color:${color}"`);
const at_ = (x, y, html) => `<div style="position:absolute;left:${x}px;top:${y}px">${html}</div>`;
const big = (p, text, at, { size = 120, x = LX, y = 300, w = 1100, stagger = 0.08, color } = {}) => H(p, text, at, { size, x, y, w, stagger, color });
/** a road sign that springs onto its pole */
const sign = (p, text, at, { x, y, red = false, rot = 0, dir = 'r' } = {}) => {
  const id = p.id_('sg'); p.tl.push(`tl.fromTo("#${id}", {scale:0.2, rotation:${rot + (dir === 'r' ? 30 : -30)}}, ${JSON.stringify({ scale: 1, rotation: rot, ...spr('playful') })}, ${n3(at)});`);
  p.tl.push(`tl.fromTo("#${id}", {opacity:0}, {opacity:1, duration:0.1, ease:"none"}, ${n3(at)});`);
  p.ev(at); efx(p, red ? 'knock.wav' : ['pop-1.wav', 'pop-2.wav', 'pop-3.wav'][p.uid % 3], at, -15);
  return `<div id="${id}" class="sign${red ? ' red' : ''}" style="left:${x}px;top:${y}px;transform-origin:${dir === 'r' ? '0%' : '100%'} 50%">${dir === 'l' ? '◀ ' : ''}${text}${dir === 'r' ? ' ▶' : ''}</div>`;
};
/** a cinema screen in the dark: projector beam, flicker, silent-picture title */
const cinema = (p, at, until, { x = 470, y = 170, w = 740, h = 430 } = {}) => {
  const id = p.id_('cn'); p.grow(id, at, { from: 0.85, dy: 30 });
  const reps = Math.max(1, Math.floor((until - at) / 0.16));
  p.tl.push(`tl.fromTo("#${id}-fl", {opacity:0.0}, {opacity:0.22, duration:0.08, ease:"none", yoyo:true, repeat:${reps}}, ${n3(at + 0.3)});`);
  fx(p, 'projector.wav', at + 0.1, -20, Math.min(6, until - at));
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h + 160}px">
    <div style="position:absolute;left:0;top:0;width:${w}px;height:${h}px;background:#E8E0CC;border:14px solid #1A1612;box-shadow:0 30px 60px -20px rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px">
      <div class="tw" style="font-size:30px;letter-spacing:.2em;color:#1A1612">★ SILENT PICTURES ★</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:64px;color:#1A1612">The Matinée</div><div class="tw" style="font-size:22px;color:#1A1612">ACCRA · 1940s</div>
      <div id="${id}-fl" style="position:absolute;inset:0;background:#000"></div></div>
    </div>`;
};
/** a typed official letter */
const letter = (p, at, lines, { x = LX, y = 170, w = 640 } = {}) => {
  const id = p.id_('lt'); p.grow(id, at, { rot: -2, from: 0.8, dy: 60 }); efx(p, 'paper-slap.wav', at + 0.15, -14);
  let t = at + 0.5;
  const body = lines.map((l) => { const h = tw(p, l, t, 30, 'var(--ink)', 26); t += l.length / 26 + 0.25; return `<div style="margin-top:14px">${h}</div>`; }).join('');
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;min-height:400px;background:#FFFDF6;padding:40px 44px;box-shadow:0 2px 6px rgba(0,0,0,.08), 0 40px 70px -24px rgba(60,40,10,.45);border-top:10px solid var(--gold)"><div class="mono" style="font-size:18px;letter-spacing:.24em;color:var(--muted)">OFFICIAL · CONFIDENTIAL</div>${body}</div>`;
};
/** a speech bubble */
const bubble = (p, text, at, { x, y, w = 360, size = 44 } = {}) => { const id = p.id_('bb'); p.grow(id, at, { from: 0.3, dy: 20, preset: 'playful' }); efx(p, 'pop-3.wav', at, -14);
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;background:#FCF5E8;border:5px solid var(--ink);border-radius:36px;padding:20px 28px;font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:${size}px;line-height:1.1;box-shadow:8px 10px 0 var(--ink)">${text}<div style="position:absolute;left:46px;bottom:-34px;width:0;height:0;border-left:22px solid transparent;border-right:22px solid transparent;border-top:34px solid var(--ink)"></div></div>`; };
/** a film strip of frames that slides across, each frame landing on its cue */
const filmstrip = (p, frames, { x = LX, y = 420 } = {}) => {
  const id = p.id_('fs'); const t0 = frames[0][1];
  p.tl.push(`tl.fromTo("#${id}", {x:-1400}, ${JSON.stringify({ x: 0, ...spr('default') })}, ${n3(t0 - 0.4)});`); p.ev(t0 - 0.4); p.sound('whoosh-1.mp3', t0 - 0.45, -18);
  fx(p, 'projector.wav', t0 - 0.3, -24, 3.5);
  const fr = frames.map(([t, at], i) => { const fid = `${id}-${i}`; p.tl.push(`tl.fromTo("#${fid}", {yPercent:110}, ${JSON.stringify({ yPercent: 0, ...spr('snappy') })}, ${n3(at)});`); p.ev(at); fx(p, 'shutter.wav', at, -18);
    return `<div class="fframe" style="overflow:hidden"><span id="${fid}" style="display:block">${t}</span></div>`; }).join('');
  return `<div id="${id}" class="fstrip" style="left:${x - 30}px;top:${y}px;padding-left:30px;padding-right:30px">${fr}</div>`;
};
/** route diagram: dots and labels joined by a dashed line, a plane travelling along it */
const route = (p, stops, { y = 520, x0 = LX + 40, x1 = 1180, plane = true, t0, t1 } = {}) => {
  const id = p.id_('rt'); const n = stops.length; const xs = stops.map((_, i) => x0 + (x1 - x0) * (n === 1 ? 0 : i / (n - 1)));
  p.tl.push(`tl.fromTo("#${id}-ln", {strokeDashoffset:${x1 - x0}}, {strokeDashoffset:0, duration:${n3(t1 - t0)}, ease:"sine.inOut"}, ${n3(t0)});`);
  const dots = stops.map(([lab, at], i) => { const did = `${id}-d${i}`; p.tl.push(`tl.fromTo("#${did}", {scale:0}, ${JSON.stringify({ scale: 1, ...spr('playful') })}, ${n3(at)});`); p.ev(at); efx(p, 'pop-2.wav', at, -16);
    return `<div id="${did}" style="position:absolute;left:${xs[i] - 22}px;top:${y - 22}px;width:44px;height:44px;border-radius:50%;background:var(--red);border:6px solid #FCF5E8;box-shadow:0 0 0 4px var(--ink)"></div><div class="mono" style="position:absolute;left:${xs[i] - 150}px;width:300px;text-align:center;top:${y + 40}px;font-size:30px;font-weight:700;letter-spacing:.12em">${lab}</div>`; }).join('');
  let pl = '';
  if (plane) { const pid = `${id}-pl`; p.tl.push(`tl.fromTo("#${pid}", {x:${x0 - 80}}, {x:${x1 - 80}, duration:${n3(t1 - t0)}, ease:"sine.inOut"}, ${n3(t0)});`); fx(p, path.join(PSFX, 'syn-takeoff.wav'), t0, -18);
    pl = `<div id="${pid}" style="position:absolute;left:0;top:${y - 150}px;width:160px">${`<img src="${p.asset('/home/user/gcp/project/media/icons/cut/airplane.png')}" style="width:160px;display:block">`}</div>`; }
  return `<svg style="position:absolute;left:0;top:0" width="1300" height="1080"><path id="${id}-ln" d="M${x0} ${y} L${x1} ${y}" stroke="#1A1612" stroke-width="6" stroke-dasharray="${x1 - x0}" fill="none"/></svg><svg style="position:absolute;left:0;top:0" width="1300" height="1080"><path d="M${x0} ${y} L${x1} ${y}" stroke="#F3EBD7" stroke-width="3" stroke-dasharray="14 12" fill="none"/></svg>${dots}${pl}`;
};
/** flames (drawn) that lick upward, with fire crackle */
const flames = (p, at, until, { x = 600, y = 420, w = 520 } = {}) => {
  const id = p.id_('fl'); p.grow(id, at, { from: 0.4, dy: 80, preset: 'playful' }); fx(p, 'fire.wav', at, -14, Math.min(5, until - at));
  const reps = Math.max(1, Math.floor((until - at) / 0.22));
  const tongues = [[0.1, 0.55, '#C8962F'], [0.3, 0.85, '#A4241B'], [0.5, 1.0, '#D9692D'], [0.7, 0.75, '#A4241B'], [0.88, 0.5, '#C8962F']].map(([cx, hh, col], i) => {
    const tid = `${id}-t${i}`; p.tl.push(`tl.fromTo("#${tid}", {scaleY:0.85}, {scaleY:1.12, duration:${0.18 + i * 0.03}, ease:"sine.inOut", yoyo:true, repeat:${reps}}, ${n3(at + 0.2 + i * 0.05)});`);
    return `<div id="${tid}" style="position:absolute;left:${cx * w - 70}px;bottom:40px;width:140px;height:${hh * 320}px;background:${col};border-radius:50% 50% 45% 45% / 70% 70% 30% 30%;transform-origin:50% 100%;border:5px solid #1A1612"></div>`; }).join('');
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:400px">${tongues}<div style="position:absolute;left:0;right:0;bottom:0;height:60px;background:#4A3A2C;border:5px solid #1A1612;border-radius:30px"></div></div>`;
};
/** an eye chart; the lower rows blur as he struggles */
const eyeChart = (p, at, blurAt, { x = 760, y = 140 } = {}) => {
  const id = p.id_('ec'); p.grow(id, at, { from: 0.7, dy: 50, rot: 2 }); efx(p, 'paper-slap.wav', at + 0.1, -16);
  const rows = ['E', 'F P', 'T O Z', 'L P E D', 'P E C F D', 'E D F C Z P', 'F E L O P Z D'];
  const html = rows.map((r, i) => { const rid = `${id}-r${i}`; if (i >= 3) p.tl.push(`tl.fromTo("#${rid}", {filter:"blur(0px)"}, {filter:"blur(${(i - 2) * 2.4}px)", duration:1.4, ease:"sine.inOut"}, ${n3(blurAt + (i - 3) * 0.25)});`);
    return `<div id="${rid}" style="font-family:'Playfair Display',serif;font-weight:700;font-size:${Math.round(120 / (1 + i * 0.55))}px;letter-spacing:.18em;line-height:1.25">${r}</div>`; }).join('');
  p.ev(blurAt);
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:420px;background:#FFFDF6;border:5px solid var(--ink);box-shadow:12px 14px 0 var(--ink);padding:26px 10px;text-align:center">${html}</div>`;
};
/** a progress bar that fills */
const progress = (p, label, at, dur, { x = LX, y = 700, w = 900, color = 'var(--green)' } = {}) => {
  const id = p.id_('pg'); p.tl.push(`tl.fromTo("#${id}", {scaleX:0}, {scaleX:1, duration:${dur}, ease:"power1.inOut"}, ${n3(at)});`); p.ev(at); p.ev(at + dur);
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px"><div class="mono" style="font-size:24px;font-weight:700;letter-spacing:.18em;margin-bottom:10px">${label}</div><div style="height:42px;border:5px solid var(--ink);background:#FCF5E8;box-shadow:8px 9px 0 var(--ink)"><div id="${id}" style="height:100%;background:${color};transform-origin:0 50%"></div></div></div>`;
};
/** the editor's lesson number */
const lessonNo = (p, n, text, at, { y = 200 } = {}) => {
  const nid = p.id_('ln'); p.tl.push(`tl.fromTo("#${nid}", {yPercent:110}, ${JSON.stringify({ yPercent: 0, ...spr('heavy') })}, ${n3(at - 0.1)});`);
  return `<div class="mk" style="position:absolute;left:${LX}px;top:${y - 30}px"><div id="${nid}" class="big-num" style="font-size:300px">${n}</div></div>${H(p, text, at, { x: LX + 240, y: y + 40, w: 860, size: 84 })}`;
};
const hesseName = 'Christian Tsui Hesse';

// ---------------------------------------------------------------------------
// QUESTION ONE — How does a boy from Osu end up behind the camera?
export function q1() {
  const [p, c, s] = make('q1'); p.css.push(SP1_CSS); p.label = '';
  const t = (...q) => cs(c, ...q);
  const B = t('how does a boy'), C = t('i knew why'), D = t('christian'), E = t('in 1954'), F = t('and the young man'), G = t('then came the part'), Hh = t('by his own account'),
    I = t('he stood behind'), J = t('soon, a letter', 'soon a letter'), Kf = t('his fathers verdict', "his father's verdict"), L = t('yet the same father'), M = t('intentionality plus'), N = t('the journey only');
  const ph = new Phone(p, { pinned: 'How does a boy from Osu end up behind the camera?', enter: 0.0, clock0: '11:52',
    prior: [{ kind: 'day', text: 'Yesterday' }, { who: 'Aba', text: 'Who exactly is Chris Hesse?? And why am I only hearing his name now?', time: '11:47 pm' }] });
  const q = t('asked the first question');
  ph.typing('Baaba', 0.6, q); ph.msg({ who: 'Baaba', text: 'Serious question. How does a pastor’s son from Osu in the 1930s end up as Nkrumah’s cameraman? My parents would faint 😅', time: '11:52 pm', at: q });
  ph.focus(q + 0.3, 3.4);
  const roads = t('the respectable roads');
  ph.typing('Kwame', C + 0.2, roads + 0.4); ph.msg({ who: 'Kwame', text: '😂😂 doctor, lawyer or engineer. pick one', time: '11:53 pm', at: roads + 0.4 });
  ph.divider('Today', M - 0.5);
  ph.msg({ who: 'Kofi', text: 'Intentionality + skill + opportunity = transformation.', time: '12:04 am', at: M + 0.2 });
  ph.focus(M + 0.4, 3.6);
  ph.build();
  // A — Baaba, The Ascendant
  sceneP(p, 0, B, `${at_(LX, 150, tw(p, '11:52 PM', 0.3, 84, 'var(--red)'))}
    ${nameCard(p, 0.25, { y: 300, role: 'IN THE CHAT', name: 'Baaba, The Ascendant' })}
    ${chip(p, 'rarely types more than a line', t('who rarely types'), LX, 520, 'chip light')}
    ${chip(p, '…asked the first question properly', q - 0.2, LX, 616, 'chip gold')}`, { enter: 'cut' });
  // B — a boy from Osu, 1932, a priest's son, the camera at the birth of a nation
  sceneP(p, B, C, `${H(p, 'A boy from *Osu*…', B + 0.05, { size: 110, kicker: 'QUESTION ONE' })}
    ${dateline(p, '29 AUGUST 1932', t('born on the 29th', 'born on'), { y: 360, size: 54 })}
    ${chip(p, 'son of a Presbyterian priest', t('presbyterian'), LX, 500, 'chip light')}
    ${stk(p, 'film-camera', t('holding the camera') - 0.1, { x: 860, y: 330, w: 330, rot: 4, life: 'sway', until: C })}
    ${chip(p, '…at the birth of a nation', t('birth of a nation'), LX, 600, 'chip red')}
    ${at_(LX, 700, ghanaFlag(170))}`, { enter: 'wipeL' });
  // C — the respectable roads (and everything else is a detour)
  const pole = p.id_('pole'); p.grow(pole, C + 0.1, { from: 0.6, dy: 200, preset: 'heavy' });
  sceneP(p, C, D, `${H(p, 'The *respectable* roads', C + 0.05, { size: 84, w: 1000 })}
    <div id="${pole}" style="position:absolute;left:600px;top:300px;width:26px;height:700px;background:#6B4A2C;border:4px solid #1A1612;border-radius:6px"></div>
    ${sign(p, 'MEDICINE', t('medicine'), { x: 630, y: 320 })}${sign(p, 'LAW', t('law'), { x: 270, y: 410, dir: 'l' })}
    ${sign(p, 'PHARMACY', t('pharmacy'), { x: 630, y: 500 })}${sign(p, 'ENGINEERING', t('and engineering', 'engineering'), { x: 150, y: 590, dir: 'l' })}
    ${chip(p, 'in her house, as in many of ours', t('in her house'), LX, 860, 'chip gold')}
    ${sign(p, 'EVERYTHING ELSE: DETOUR', t('detour') - 0.1, { x: 420, y: 720, red: true, rot: -6 })}`, { enter: 'wipeU' });
  // D — Christian Tsui Hesse: cinema forbidden at home, so he sneaked out to watch Chaplin
  sceneP(p, D, E, `${nameCard(p, D + 0.05, { y: 120, role: 'THE BOY', name: hesseName })}
    ${p.stamp('CINEMA: FORBIDDEN', t('forbidden') - 0.05, { x: 130, y: 270, rot: -6, size: 46 })}
    ${cinema(p, t('curious boys') - 0.3, E, { x: 470, y: 400, w: 720, h: 380 })}
    ${chip(p, 'sneaked out to watch Charlie Chaplin', t('charlie chaplin') - 0.4, LX, 860, 'chip gold')}`, { enter: 'iris' });
  // E — 1954: the colonial film school at Kanda, where TV3 stands today
  sceneP(p, E, F, `${at_(LX, 120, counter(p, E + 0.1, 1954, { from: 1930, size: 220, fmt: false }))}
    ${chip(p, 'the year he finished school', t('finished school'), LX, 380, 'chip light')}
    ${chip(p, 'West African Film School · Kanda', t('west african film'), LX, 476, 'chip red')}
    ${chip(p, 'where TV3 stands today', t('where tv3', 'tv3'), LX, 572, 'chip gold')}
    ${chip(p, 'training Africans to make the colonial state’s films', t('training africans'), LX, 668, 'chip light')}
    ${stk(p, 'film-cans', t('west african film') + 0.3, { x: 900, y: 120, w: 280, rot: 5, life: 'bob', until: F })}`, { enter: 'wipeR' });
  // F — he chose the camera department on purpose; Łódź, 1960
  sceneP(p, F, G, `${prt(p, 'hesse-camera', F + 0.1, { x: 740, y: 150, w: 450, rot: 3 })}
    ${H(p, 'He walked in…', F + 0.1, { size: 88, w: 560 })}
    ${chip(p, 'chose the camera department', t('camera department'), LX, 330, 'chip light')}
    ${p.stamp('ON PURPOSE', t('on purpose'), { x: 140, y: 440, rot: -5, size: 56 })}
    ${dateline(p, 'ŁÓDŹ, POLAND · 1960', t('national film school') - 0.2, { y: 640, size: 50, sting: false })}`, { enter: 'push' });
  // G — positioning
  sceneP(p, G, Hh, `${H(p, 'Positioning.', t('positioning') - 0.1, { size: 200, y: 340, kicker: 'THEN CAME THE PART I CALL', kat: G })}`, { enter: 'wipeU' });
  // H — by his own account: James Fort, 1951, from the roof of a van
  sceneP(p, Hh, I, `${chip(p, 'by his own account', Hh + 0.05, LX, 150, 'chip light')}
    ${dateline(p, 'JAMES FORT PRISON · 1951', t('james fort') - 0.2, { y: 260, size: 50, sting: false })}
    ${chip(p, 'Nkrumah walks out', t('walking out'), LX, 400, 'chip red')}
    ${prt(p, 'hesse-rooftop', t('roof of a van') - 0.4, { x: 560, y: 470, w: 620, rot: -2, caption: 'filming from up high' })}`, { enter: 'wipeL' });
  // I — Camera Two, 6 March 1957; the best angle until Nkrumah noticed "this chap"
  sceneP(p, I, J, `${p.stamp('CAMERA 2', I + 0.3, { x: 140, y: 140, rot: -6, size: 70 })}
    ${dateline(p, '6 MARCH 1957 · INDEPENDENCE DAY', t('independence day') - 0.2, { y: 300, size: 44 })}
    ${at_(LX, 420, ghanaFlag(220))}
    ${prt(p, 'hesse-young-crowd', t('best angle') - 0.3, { x: 820, y: 400, w: 340, rot: 3, caption: 'always the best angle' })}
    ${bubble(p, '“Who is this chap?”', t('noticed this chap', 'this chap') - 0.1, { x: 390, y: 450, w: 380 })}
    ${chip(p, 'how much is he paid?', t('how much he was paid', 'how much'), LX, 800, 'chip gold')}`, { enter: 'wipeR' });
  // J — the letter: "the Leader has commanded…"
  sceneP(p, J, Kf, `${letter(p, J + 0.1, ['The Leader has commanded…', 'that Mr C. T. Hesse be placed', 'in the senior grade, as', 'personal cameraman.'], { y: 140 })}
    ${p.stamp('SENIOR GRADE', t('senior grade'), { x: 820, y: 300, rot: -8, size: 50 })}
    ${chip(p, 'personal cameraman', t('personal cameraman'), 820, 480, 'chip red')}`, { enter: 'rise' });
  // K — his father's verdict
  sceneP(p, Kf, L, `${quote(p, 'You are going to make films for *what?*', t('you are going'), { who: 'HIS FATHER’S VERDICT', y: 260, size: 92, w: 1050, cardAt: Kf + 0.1 })}`, { enter: 'wipeU' });
  // L — the airport: to see with his own eyes
  sceneP(p, L, M, `${H(p, 'The same father, at the *airport*', L + 0.05, { size: 84, w: 1000 })}
    ${stk(p, 'airplane', t('the airport') - 0.1, { x: 700, y: 360, w: 460, rot: -8, life: 'sail', until: M })}
    ${chip(p, 'to see it with his own eyes', t('his own eyes', 'own eyes'), LX, 430, 'chip gold')}
    ${chip(p, 'his son, back from America', t('from america', 'america'), LX, 526, 'chip light')}`, { enter: 'push' });
  // M — the equation
  const eq = [['Intentionality', M + 0.05], ['+ Skill', t('plus skill')], ['+ Opportunity', t('plus opportunity')], ['= *Transformation*', t('equals transformation', 'equals')]];
  sceneP(p, M, N, `${eq.map(([w, a], i) => H(p, w, a, { size: i === 3 ? 110 : 96, y: 140 + i * 170, stagger: 0.05 })).join('')}`, { enter: 'iris' });
  eq.forEach(([, a]) => efx(p, 'bell.wav', a + 0.1, -26));
  // N — somebody has to choose it first
  sceneP(p, N, s.dur, `${H(p, 'The journey only makes sense *later*…', N + 0.05, { size: 84, w: 1000 })}
    ${H(p, 'but somebody has to *choose it first.*', t('but somebody'), { size: 96, y: 480, w: 1050 })}`, { enter: 'wipeL' });
  return p;
}


// ---------------------------------------------------------------------------
// QUESTION TWO — Was he a witness, or a believer?
export function q2() {
  const [p, c, s] = make('q2'); p.css.push(SP1_CSS); p.label = '';
  const t = (...q) => cs(c, ...q);
  const B = t('so the man was'), C = t('you know be small', 'small question'), D = t('hesse loved'), E = t('nkrumahs walking stick', 'walking stick'), F = t('but on the 1st', 'on the 1st'),
    G = t('hesse was standing'), Hh = t('he has said'), I = t('that is a witness'), J = t('the same man went'), Kk = t('the film is fair'), L = t('anita afonu'), M = t('and an archive', 'an archive report'),
    N = t('hesse insists'), O = t('when a student'), Q = t('he cannot prove'), R = t('he only filmed'), S = t('kwame read that');
  const ph = new Phone(p, { pinned: 'Was he a witness, or a believer?', enter: 0.0, clock0: '12:11',
    prior: [{ who: 'Kwame', text: '😂😂 doctor, lawyer or engineer. pick one', time: '11:53 pm' }, { kind: 'day', text: 'Today' }, { who: 'Kofi', text: 'Intentionality + skill + opportunity = transformation.', time: '12:04 am' }] });
  ph.typing('Kwame', 0.4, B); ph.msg({ who: 'Kwame', text: 'So the man was Nkrumah’s propaganda unit abeg. Why are we calling it history? 🤨', time: '12:11 am', at: B });
  ph.focus(B + 0.3, 3.6);
  ph.msg({ who: 'Aba', text: 'Kwame you’ve started 🙄', time: '12:12 am', at: C + 0.2 });
  const notParty = t('party propagandist');
  ph.typing('Baaba', t('agreed on very little'), notParty + 0.6); ph.msg({ who: 'Baaba', text: 'He filmed every government after Nkrumah too. That’s not a party man.', time: '12:20 am', at: notParty + 0.6 });
  ph.focus(notParty + 0.8, 3.0);
  const hmm = t('typed hmm', 'hmm');
  ph.typing('Kwame', S + 0.2, hmm + 0.15); ph.msg({ who: 'Kwame', text: 'hmm', time: '12:31 am', at: hmm + 0.15 });
  ph.focus(hmm + 0.3, 3.2, { s: 1.14 });
  ph.build();
  // A — Kwame, The Combative, did not wait for a full stop
  sceneP(p, 0, B, `${at_(LX, 150, tw(p, '12:11 AM', 0.3, 84, 'var(--red)'))}
    ${nameCard(p, 0.3, { y: 300, role: 'IN THE CHAT', name: 'Kwame, The Combative' })}
    ${stk(p, 'kwame-boxer', 0.6, { x: 760, y: 420, w: 380, rot: 4, life: 'jiggle', until: B })}
    ${chip(p, 'did not even wait for a full stop', t('full stop') - 0.6, LX, 520, 'chip gold')}`, { enter: 'cut' });
  // B — propaganda unit?
  sceneP(p, B, C, `${H(p, 'So the man was Nkrumah’s *propaganda unit?*', B + 0.05, { size: 92, w: 1050 })}
    ${p.stamp('ABEG', t('i beg'), { x: 140, y: 520, rot: -7, size: 64 })}
    ${chip(p, 'why are we calling it history?', t('why are we calling'), LX, 680, 'chip red')}`, { enter: 'wipeL' });
  // C — E no be small question
  sceneP(p, C, D, `${H(p, 'E no be *small* question.', C + 0.05, { size: 120, y: 260 })}
    ${chip(p, 'the film does not dodge it', t('does not dodge'), LX, 600, 'chip light')}`, { enter: 'wipeU' });
  // D — the believer column
  sceneP(p, D, E, `${H(p, 'Believer?', D + 0.05, { size: 120, kicker: 'EXHIBIT A' })}
    ${stack(p, [['he loved Nkrumah', t('loved nkrumah', 'hesse loved') + 0.2], ['…and says so freely', t('says so freely'), 'chip gold'], ['they shared a private code', t('private code'), 'chip red']], { y: 360 })}
    ${prt(p, 'hesse-young-crowd', D + 0.4, { x: 820, y: 300, w: 340, rot: -3 })}`, { enter: 'push' });
  // E — the walking stick: roll / stop
  const roll = t('when to roll'), stop = t('when to stop');
  sceneP(p, E, F, `${H(p, 'Nkrumah’s *walking stick*', E + 0.05, { size: 84, w: 1000 })}
    ${stk(p, 'walking-stick', E + 0.2, { x: 690, y: 300, w: 60, rot: -8, life: 'sway', until: F })}
    ${chip(p, 'not for a bad leg', t('bad leg'), LX, 360, 'chip light')}
    ${chip(p, '▶ ROLL', roll, 820, 420, 'chip')}${chip(p, '■ STOP', stop, 820, 540, 'chip red')}
    ${p.stamp('A BELIEVER', t('that is a believer') - 0.05, { x: 140, y: 720, rot: -6, size: 64 })}`, { enter: 'wipeR' });
  fx(p, 'shutter.wav', roll + 0.1, -16); fx(p, 'projector.wav', roll + 0.2, -22, 1.4); fx(p, 'shutter.wav', stop + 0.1, -16);
  // F — Kulungugu, 1 August 1962
  sceneP(p, F, G, `${dateline(p, 'KULUNGUGU · 1 AUGUST 1962', F + 0.15, { y: 220, size: 64 })}
    ${chip(p, '📍 a border village in the Upper East', t('upper east', 'border village'), LX, 400, 'chip light')}
    ${chip(p, 'near the Burkina Faso border', t('upper east', 'border village') + 0.6, LX, 496, 'chip gold')}`, { bg: 'ink', enter: 'iris' });
  // G — filming schoolchildren; a bomb went off
  const bomb = t('a bomb went off');
  sceneP(p, G, Hh, `${stk(p, 'film-camera', G + 0.1, { x: 800, y: 200, w: 330, rot: -3, life: 'jiggle', until: Hh })}
    ${chip(p, 'in the middle of the crowd', G + 0.3, LX, 220, 'chip light')}
    ${chip(p, 'filming schoolchildren performing', t('filming schoolchildren'), LX, 316, 'chip light')}
    ${card(p, `<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:110px;line-height:1;color:var(--red)">${p.words(p.id_('w'), 'A bomb went off.', bomb, { stagger: 0.07 })}</div>`, bomb - 0.1, { x: LX, y: 560, w: 1000 })}`, { bg: 'ink', enter: 'wipeU' });
  efx(p, 'boom.wav', bomb + 0.15, -8);
  { const id = p.id_('shk'); }
  // H — Captain Buckman; children died while the camera was rolling
  sceneP(p, Hh, I, `${chip(p, 'he has said…', Hh + 0.1, LX, 140, 'chip light')}${nameCard(p, t('captain buckman') - 0.2, { y: 230, role: 'AIDE-DE-CAMP', name: 'Captain Buckman' })}
    ${chip(p, 'threw Nkrumah down', t('threw nkrumah'), LX, 400, 'chip light')}
    ${chip(p, 'covered him with his own body', t('own body'), LX, 496, 'chip gold')}
    ${chip(p, 'children died that day', t('children died'), LX, 592, 'chip red')}
    ${chip(p, '…while the camera was rolling', t('camera was rolling'), LX, 688, 'chip light')}`, { bg: 'ink', enter: 'wipeL' });
  // I — that is a witness
  sceneP(p, I, J, `<div style="position:absolute;left:${LX}px;top:240px;font-family:'Playfair Display',serif;font-weight:900;font-size:120px;color:var(--muted)">Believer</div>
    <div style="position:absolute;left:${LX}px;top:420px;font-family:'Playfair Display',serif;font-weight:900;font-size:120px">${p.words(p.id_('w'), 'Witness.', I + 0.1)}</div>
    ${p.stamp('A WITNESS', I + 0.45, { x: 640, y: 470, rot: -8, size: 64 })}${p.stamp('A BELIEVER', I + 0.05, { x: 640, y: 270, rot: 5, size: 48 })}`, { enter: 'wipeU' });
  // J — every government after
  sceneP(p, J, Kk, `${H(p, 'The same man went on to film…', J + 0.05, { size: 72, w: 1050 })}
    ${filmstrip(p, [['ANKRAH', t('ankara', 'ankrah')], ['AFRIFA', t('afrifa')], ['BUSIA', t('busia')], ['RAWLINGS', t('rawlings')]], { y: 330 })}
    ${chip(p, 'governments that agreed on very little', t('agreed on very little'), LX, 620, 'chip gold')}
    ${p.stamp('NOT A PARTY PROPAGANDIST', t('party propagandist') - 0.2, { x: 140, y: 740, rot: -4, size: 44 })}`, { enter: 'push' });
  // K — the other side
  sceneP(p, Kk, L, `${H(p, 'The other side *speaks.*', Kk + 0.05, { size: 120, y: 300 })}
    ${stk(p, 'scales-balance', Kk + 0.4, { x: 800, y: 520, w: 340, life: 'sway', until: L })}`, { enter: 'wipeR' });
  // L — Anita Afonu: history books, her own mother — intolerant of dissent
  sceneP(p, L, M, `${nameCard(p, L + 0.05, { y: 130, role: 'THE FILMMAKER WHO WALKS US THROUGH IT', name: 'Anita Afonu' })}
    ${stk(p, 'mind-books', t('history books') - 0.1, { x: 860, y: 360, w: 300, life: 'bob', until: M })}
    ${stack(p, [['her history books', t('history books')], ['her own mother', t('her own mother'), 'chip gold'], ['remember him as intolerant of dissent', t('intolerant'), 'chip red']], { y: 400 })}`, { enter: 'wipeL' });
  // M — at least a thousand opponents jailed
  sceneP(p, M, N, `${chip(p, 'an archive report in the film', M + 0.1, LX, 160, 'chip light')}
    ${at_(LX, 260, counter(p, t('a thousand') - 0.2, 1000, { size: 230, prefix: '', suffix: '+', from: 0 }))}
    ${H(p, 'opponents *jailed*', t('opponents'), { size: 84, y: 520 })}`, { enter: 'wipeU' });
  // N — the CIA claim vs the coup leader's denial (no verdict)
  sceneP(p, N, O, `${quote(p, 'America organised the 1966 coup.', t('america organized', 'organized'), { who: 'HESSE INSISTS', y: 140, size: 54, w: 740 })}
    ${quote(p, 'Nobody helped us.', t('a coup leader'), { who: 'A COUP LEADER, ON CAMERA', x: 420, y: 520, size: 62, w: 740 })}
    ${stk(p, 'coup', t('1966 coup', '1966') , { x: 930, y: 160, w: 250, life: 'jiggle', until: O })}`, { enter: 'push' });
  // O — a student asks him to prove Nkrumah was good; he refuses
  sceneP(p, O, Q, `${stk(p, 'classroom', O + 0.1, { x: 760, y: 200, w: 420, life: 'bob', until: Q })}
    ${chip(p, '“Prove he was a good man.”', t('prove that nkrumah', 'to prove'), LX, 260, 'chip light')}
    ${p.stamp('HE REFUSES', t('he refuses'), { x: 140, y: 420, rot: -6, size: 64 })}`, { enter: 'wipeR' });
  // Q — an angel or Satan?
  sceneP(p, Q, R, `${H(p, 'He cannot prove whether Nkrumah was…', Q + 0.05, { size: 64, w: 1050 })}
    <div style="position:absolute;left:${LX}px;top:420px;font-family:'Playfair Display',serif;font-weight:900;font-size:150px;color:var(--gold)">${p.words(p.id_('w'), 'an angel', t('an angel'))}</div>
    <div style="position:absolute;left:${LX + 520}px;top:600px;font-family:'Playfair Display',serif;font-weight:900;font-size:150px;color:var(--red)">${p.words(p.id_('w'), 'or Satan?', t('satan') - 0.25)}</div>`, { enter: 'iris' });
  // R — I only filmed him; you watch and judge
  sceneP(p, R, S, `${quote(p, 'I only filmed him. It is for you to *watch and judge.*', R + 0.05, { who: 'HESSE', y: 200, size: 76, w: 1050 })}
    ${stk(p, 'film-camera', t('watch and judge') - 0.3, { x: 860, y: 600, w: 260, life: 'sway', until: S })}`, { enter: 'wipeU' });
  // S — Kwame: "hmm"
  sceneP(p, S, s.dur, `${H(p, 'hmm', hmm, { size: 260, y: 160, color: 'var(--ink)' })}
    ${chip(p, 'Kwame read that, typed…', S + 0.1, LX, 470, 'chip light')}
    ${chip(p, '…and went quiet', t('went quiet'), LX, 566, 'chip gold')}
    ${p.stamp('A CONCESSION SPEECH', t('concession speech', 'concession') - 0.3, { x: 140, y: 700, rot: -5, size: 58 })}`, { enter: 'wipeL' });
  return p;
}

// ---------------------------------------------------------------------------
// QUESTION THREE — Who owns a nation's memory?
export function q3() {
  const [p, c, s] = make('q3'); p.css.push(SP1_CSS); p.label = '';
  const t = (...q) => cs(c, ...q);
  const B = t('if the coup makers'), C = t('here is the 1'), D = t('ghana had no'), E = t('so every colour'), F = t('on thursday'), G = t('on the flight'), Hh = t('so nkrumah drew'), I = t('and told him'),
    J = t('dont be afraid'), Kk = t('in moscow'), L = t('at home'), M = t('and they burned'), N = t('but nobody had told'), O = t('the black and white films'), Q = t('when the film corporation'),
    R = t('surviving was only'), S = t('the film says'), T = t('hesse says the storage', 'the storage fees'), U = t('until a laboratory'), V = t('he spent some'), W = t('and each met'), X = t('his reply was simple'),
    Y = t('only now, after', 'only now after'), Z = t('and the work is said');
  const ph = new Phone(p, { pinned: 'Who owns a nation’s memory?', enter: 0.0, clock0: '12:38',
    prior: [{ who: 'Baaba', text: 'He filmed every government after Nkrumah too. That’s not a party man.', time: '12:20 am' }, { who: 'Kwame', text: 'hmm', time: '12:31 am' }] });
  ph.typing('Aba', 0.3, B); ph.msg({ who: 'Aba', text: 'Wait. If the coup people burned everything, how are we even watching these films??', time: '12:38 am', at: B });
  ph.focus(B + 0.3, 3.6);
  ph.typing('Baaba', N + 0.4, O - 0.3); ph.msg({ who: 'Baaba', text: 'So Ghana not having a colour lab is what saved our history?? 😮', time: '12:46 am', at: O - 0.3 });
  const thrown = t('archive was thrown', 'thrown away');
  ph.typing('Aba', thrown + 0.3, R - 0.3); ph.msg({ who: 'Aba', text: 'And the black & white ones were just… thrown away? The thing pain me oo 😭', time: '12:47 am', at: R - 0.3 });
  ph.focus(R - 0.1, 3.4);
  ph.build();
  // A — Aba came back
  sceneP(p, 0, B, `${at_(LX, 150, tw(p, '12:38 AM', 0.3, 84, 'var(--red)'))}
    ${nameCard(p, 0.3, { y: 300, role: 'IN THE CHAT', name: 'Aba, The Restless' })}
    ${chip(p, 'the question that cracked it open', t('cracked it open', 'cracked'), LX, 520, 'chip gold')}`, { enter: 'cut' });
  // B — if they burned everything…
  sceneP(p, B, C, `${H(p, 'If they burned *everything*…', B + 0.05, { size: 88, w: 1100 })}
    ${flames(p, B + 0.4, C, { x: 560, y: 440, w: 520 })}
    ${chip(p, 'how are we even watching these films?', t('how are we even'), LX, 330, 'chip red')}`, { enter: 'wipeL' });
  // C — the 1%
  sceneP(p, C, D, `<div style="position:absolute;left:${LX}px;top:240px">${tw(p, 'THE 1%', C + 0.1, 240, 'var(--red)', 10)}</div>`, { enter: 'iris' });
  // D — no colour lab; the heat
  sceneP(p, D, E, `${H(p, 'No colour-film *laboratory* in Ghana', D + 0.05, { size: 80, w: 1050 })}
    ${p.stamp('NO COLOUR LAB', D + 0.9, { x: 140, y: 400, rot: -6, size: 56 })}
    ${chip(p, '☀ the heat was hard on film anyway', t('the heat'), LX, 560, 'chip gold')}
    ${stk(p, 'film-cans', D + 0.3, { x: 860, y: 380, w: 280, life: 'bob', until: E })}`, { enter: 'wipeU' });
  // E — flown to London; prints back to Accra; negatives kept in cold vaults
  const vault = t('cold vaults');
  sceneP(p, E, F, `${H(p, 'Every colour reel flew to *London*', E + 0.05, { size: 72, w: 1050 })}
    ${route(p, [['ACCRA', E + 0.3], ['LONDON', t('laboratory in london', 'in london')]], { y: 420, t0: E + 0.3, t1: t('laboratory in london', 'in london') + 0.2, x1: 760 })}
    ${chip(p, 'prints → back to Accra', t('sent prints'), LX, 560, 'chip light')}
    ${chip(p, 'negatives → cold vaults', vault - 0.3, LX, 656, 'chip red')}
    ${p.print('/home/user/gcp/sp1/media/real/cold-vault.png', vault - 0.2, { x: 850, y: 470, w: 330, rot: 3, caption: 'kept cold in London' })}`, { enter: 'push' });
  efx(p, 'wind.wav', vault, -20, 2.5);
  // F — Thursday 24 February 1966: to Hanoi; the soldiers took Accra
  sceneP(p, F, G, `${dateline(p, 'THURSDAY, 24 FEBRUARY 1966', F + 0.1, { y: 150, size: 56 })}
    ${route(p, [['ACCRA', t('travelling to hanoi', 'hanoi') - 0.4], ['HANOI', t('hanoi')]], { y: 400, t0: t('hanoi') - 0.4, t1: t('hanoi') + 0.6, x1: 760 })}
    ${chip(p, 'with Hesse in the delegation', t('in the delegation', 'delegation'), LX, 540, 'chip light')}
    ${stk(p, 'coup', t('the soldiers took') - 0.1, { x: 820, y: 520, w: 320, life: 'jiggle', until: G })}
    ${p.stamp('COUP', t('took accra') , { x: 140, y: 680, rot: -8, size: 80 })}`, { enter: 'wipeR' });
  // G — the flight on to Moscow; the men drift off to chat and laugh
  sceneP(p, G, Hh, `${route(p, [['HANOI', G + 0.1], ['MOSCOW', G + 0.8]], { y: 300, t0: G + 0.1, t1: G + 1.4, x1: 760 })}
    ${chip(p, 'Hesse remembers', t('hesse remembers'), LX, 470, 'chip light')}
    ${chip(p, 'the men around the president drift off…', t('the men around'), LX, 566, 'chip light')}
    ${chip(p, '…to chat and laugh among themselves', t('chat and laugh'), LX, 662, 'chip gold')}`, { enter: 'push' });
  fx(p, 'cabin.wav', G, -22, 6); efx(p, 'murmur.wav', t('chat and laugh') - 0.3, -22, 3);
  // H — Nkrumah draws a curtain and comes to his cameraman's corner
  const cur = p.id_('cu'), curT = Hh + 0.4;
  p.tl.push(`tl.fromTo("#${cur}-l", {xPercent:-100}, ${JSON.stringify({ xPercent: 0, ...spr('heavy') })}, ${n3(curT)});`);
  p.tl.push(`tl.fromTo("#${cur}-r", {xPercent:100}, ${JSON.stringify({ xPercent: 0, ...spr('heavy') })}, ${n3(curT + 0.05)});`); p.ev(curT); fx(p, 'curtain.wav', curT - 0.05, -12);
  const drape = (side) => `<div id="${cur}-${side}" style="position:absolute;top:0;${side === 'l' ? 'left:0' : 'right:0'};width:50%;height:100%;background:repeating-linear-gradient(90deg,#7E1B14 0 34px,#A4241B 34px 60px,#8E1F17 60px 80px);border:5px solid #1A1612"></div>`;
  sceneP(p, Hh, I, `<div style="position:absolute;left:${LX + 520}px;top:150px;width:560px;height:560px;overflow:hidden;border:6px solid var(--ink);box-shadow:12px 14px 0 var(--ink);background:#2B2A26">
      ${stk(p, 'film-camera', Hh + 0.1, { x: 140, y: 110, w: 280, life: 'bob', until: I })}${drape('l')}${drape('r')}</div>
    ${H(p, 'He drew a *curtain*…', Hh + 0.05, { size: 84, w: 520 })}
    ${chip(p, 'came to the corner', t('came to the corner'), LX, 470, 'chip light')}
    ${chip(p, 'where his cameraman sat', t('his cameraman sat', 'cameraman sat'), LX, 566, 'chip gold')}`, { enter: 'wipeU' });
  // I — a new Africa will germinate from the ashes
  const sprout = p.id_('spr'), sprT = t('germinated') - 0.2;
  p.tl.push(`tl.fromTo("#${sprout}", {scaleY:0}, ${JSON.stringify({ scaleY: 1, ...spr('playful') })}, ${n3(sprT)});`); p.ev(sprT); efx(p, 'bell.wav', sprT + 0.2, -20);
  sceneP(p, I, J, `${quote(p, 'Coups will go on across Africa until a new Africa *germinates from the ashes.*', I + 0.1, { who: 'NKRUMAH, TO HIS CAMERAMAN', y: 140, size: 58, w: 1050 })}
    <div style="position:absolute;left:520px;top:560px;width:300px;height:280px"><div style="position:absolute;left:0;right:0;bottom:0;height:70px;background:#8A8378;border:5px solid var(--ink);border-radius:50% 50% 10px 10px"></div>
      <svg id="${sprout}" style="position:absolute;left:90px;bottom:60px;transform-origin:60px 200px" width="120" height="200" viewBox="0 0 120 200"><path d="M60 200 C60 140 60 100 60 60" stroke="#2E6B3A" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M60 90 C20 80 8 50 14 30 C40 34 58 56 60 90z" fill="#3E8A4A" stroke="#1A1612" stroke-width="4"/><path d="M60 70 C100 60 112 30 106 10 C80 14 62 36 60 70z" fill="#3E8A4A" stroke="#1A1612" stroke-width="4"/></svg></div>`, { enter: 'wipeL' });
  // J — don't be afraid; keep on filming
  sceneP(p, J, Kk, `${H(p, '“Don’t be afraid. *Keep on filming.*”', J + 0.05, { size: 112, y: 240, w: 1080 })}
    ${stk(p, 'film-camera', J + 0.8, { x: 880, y: 620, w: 260, life: 'jiggle', until: Kk })}`, { enter: 'iris' });
  fx(p, 'projector.wav', J + 0.9, -24, 2.5);
  // K — Moscow: a Kremlin car; he never saw him again
  sceneP(p, Kk, L, `${chip(p, 'MOSCOW', Kk + 0.1, LX, 160, 'chip')}
    ${chip(p, 'a Kremlin car drove Nkrumah away', t('kremlin car'), LX, 256, 'chip light')}
    ${H(p, 'Hesse never saw him *again.*', t('never saw him'), { size: 104, y: 420, w: 1050 })}`, { enter: 'wipeR' });
  fx(p, 'car.wav', t('kremlin car') + 0.2, -14);
  // L — the NLC orders records, books and films destroyed
  sceneP(p, L, M, `${chip(p, 'AT HOME', L + 0.1, LX, 150, 'chip')}
    ${nameCard(p, t('national liberation') - 0.1, { y: 240, role: 'THE ORDER', name: 'National Liberation Council' })}
    ${stack(p, [['records', t('records')], ['books', t('books')], ['films', t('and films') - 0.05, 'chip gold']], { y: 470 })}
    ${p.stamp('DESTROY', t('destroyed') - 0.1, { x: 520, y: 560, rot: -8, size: 90 })}`, { enter: 'push' });
  // M — they burned what they could find
  sceneP(p, M, N, `${H(p, 'They burned what they *could find.*', M + 0.05, { size: 92, w: 1050, color: '#F3EBD7' })}
    ${flames(p, M + 0.2, N, { x: 360, y: 430, w: 600 })}`, { bg: 'ink', enter: 'wipeU' });
  // N — but the negatives in London
  sceneP(p, N, O, `${p.print('/home/user/gcp/sp1/media/real/cold-vault.png', N + 0.1, { x: 700, y: 160, w: 440, rot: 3, caption: 'the negatives, London' })}
    ${H(p, 'Nobody told them about *London.*', N + 0.2, { size: 84, w: 560 })}
    ${p.stamp('SAFE', t('negatives in london', 'in london'), { x: 140, y: 560, rot: -8, size: 90 })}`, { enter: 'wipeR' });
  // O — the black-and-white films stayed home
  sceneP(p, O, Q, `${H(p, 'The *black-and-white* films stayed home…', O + 0.05, { size: 80, w: 1050 })}
    <div style="position:absolute;left:760px;top:380px;filter:grayscale(1) contrast(1.1)">${stk(p, 'film-cans', O + 0.4, { x: 0, y: 0, w: 300, life: 'bob', until: Q + 3 })}</div>
    ${chip(p, '…and were not so lucky', t('not so lucky'), LX, 460, 'chip red')}`, { enter: 'wipeL' });
  // Q — the corporation sold in the 90s; the archive thrown away
  const bin = p.id_('bin');
  p.tl.push(`tl.to("#${bin}", {y:900, rotation:30, duration:0.7, ease:"power3.in", immediateRender:false}, ${n3(thrown + 0.1)});`); p.ev(thrown + 0.1); efx(p, 'knock.wav', thrown + 0.6, -12); efx(p, 'glass.wav', thrown + 0.65, -20);
  sceneP(p, Q, R, `${chip(p, 'the film corporation, sold in the 1990s', t('was sold', 'sold in the'), LX, 160, 'chip light')}
    ${chip(p, 'to the Malaysian company behind TV3', t('malaysian'), LX, 256, 'chip gold')}
    ${chip(p, 'Hesse says', t('hesse says'), LX, 352, 'chip light')}
    <div id="${bin}" style="position:absolute;left:740px;top:420px;filter:grayscale(1) contrast(1.1)">${stk(p, 'film-cans', Q + 0.2, { x: 0, y: 0, w: 300, life: 'bob', until: thrown })}</div>
    ${p.stamp('THROWN AWAY', thrown - 0.05, { x: 140, y: 560, rot: -6, size: 72 })}`, { enter: 'push' });
  // R — surviving was only the beginning
  sceneP(p, R, S, `${H(p, 'Surviving was only *the beginning.*', R + 0.05, { size: 110, y: 280, w: 1080 })}`, { enter: 'wipeU' });
  // S — the cans thrown into a car park
  sceneP(p, S, T, `<div style="position:absolute;left:${LX}px;top:180px;width:150px;height:150px;background:#1D4F91;border:6px solid #FCF5E8;outline:5px solid #1D4F91;border-radius:16px;color:#fff;font-family:'GCP Round',sans-serif;font-weight:700;font-size:110px;display:flex;align-items:center;justify-content:center">P</div>
    ${H(p, 'Thrown out into a *car park*', S + 0.1, { x: LX + 200, y: 190, size: 72, w: 860 })}
    ${stk(p, 'film-cans', t('car park') - 0.2, { x: 520, y: 430, w: 300, rot: 70, life: 'jiggle', until: T })}
    ${chip(p, 'the film says', S + 0.4, LX, 420, 'chip light')}`, { enter: 'wipeR' });
  efx(p, 'knock.wav', t('car park'), -14);
  // T — storage fees nearly three years behind
  sceneP(p, T, U, `${card(p, `<div class="mono" style="font-size:22px;font-weight:700;letter-spacing:.2em;color:var(--muted)">STORAGE · INVOICE</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:60px;margin-top:10px">Fees due</div><div style="margin-top:6px">${counter(p, t('three years') - 0.4, 3, { size: 150, suffix: ' years', fmt: false })}</div><div class="mono" style="font-size:24px;margin-top:6px">behind</div>`, T + 0.05, { x: LX, y: 170, w: 640 })}
    ${p.stamp('OVERDUE', t('three years') + 0.4, { x: 700, y: 500, rot: -10, size: 70 })}`, { enter: 'push' });
  // U — a laboratory near London restores it frame by frame
  const frames = Array.from({ length: 6 }, (_, i) => { const fid = p.id_('fr'); const a = t('frame by frame') - 1.2 + i * 0.25; p.tl.push(`tl.fromTo("#${fid}", {backgroundColor:"#5A534A"}, {backgroundColor:"#F3EBD7", duration:0.2, ease:"none"}, ${n3(a)});`); p.ev(a); if (i % 2 === 0) fx(p, 'shutter.wav', a, -22);
    return `<div id="${fid}" class="fframe" style="width:150px;height:110px;font-size:26px">${i + 1}</div>`; }).join('');
  sceneP(p, U, V, `${H(p, 'Restored *frame by frame*', U + 0.05, { size: 92, w: 1050 })}
    ${chip(p, 'a laboratory near London', U + 0.6, LX, 330, 'chip light')}
    <div class="fstrip" style="left:${LX - 30}px;top:470px;padding:26px 30px">${frames}</div>`, { enter: 'wipeU' });
  // V — 21 years, more than a thousand reels
  sceneP(p, V, W, `${prt(p, 'hesse-reels', V + 0.1, { x: 690, y: 150, w: 500, rot: 3 })}
    ${at_(LX, 140, counter(p, t('21 years') - 0.3, 21, { size: 200, fmt: false }))}${at_(LX, 350, `<div class="mono" style="font-size:30px;font-weight:700;letter-spacing:.14em">YEARS OF ASKING</div>`)}
    ${chip(p, 'government after government', t('government after'), LX, 420, 'chip light')}
    ${at_(LX, 520, counter(p, t('a thousand reels', 'thousand reels') - 0.4, 1000, { size: 150, suffix: '+' }))}${at_(LX, 690, `<div class="mono" style="font-size:30px;font-weight:700;letter-spacing:.14em">REELS TO DIGITISE</div>`)}`, { enter: 'push' });
  // W — the same dilemma: old film, or hospitals and schools?
  sceneP(p, W, X, `${H(p, 'The same *dilemma*', W + 0.05, { size: 92 })}
    ${stk(p, 'scales-balance', W + 0.4, { x: 560, y: 330, w: 420, life: 'sway', until: X })}
    ${chip(p, 'old film?', t('old film'), LX, 400, 'chip gold')}
    ${chip(p, 'hospitals', t('hospitals'), LX, 520, 'chip light')}${chip(p, 'schools', t('and schools', 'schools'), LX, 616, 'chip light')}
    ${stk(p, 'medic-clinic', t('hospitals'), { x: 900, y: 650, w: 200, life: 'bob', until: X })}`, { enter: 'wipeR' });
  // X — they belong to Mother Ghana
  sceneP(p, X, Y, `${H(p, 'They belong to *Mother Ghana.*', t('mother ghana') - 0.6, { size: 120, y: 300, w: 1080, kicker: 'HIS REPLY WAS SIMPLE', kat: X + 0.05 })}
    ${at_(LX, 680, ghanaFlag(240))}`, { enter: 'iris' });
  // Y — only now: the government commits money (24-Hour Economy)
  sceneP(p, Y, Z, `${H(p, 'Only now, *after the film*…', Y + 0.05, { size: 92 })}
    ${chip(p, 'the government commits money', t('committed money', 'committed'), LX, 330, 'chip light')}
    ${chip(p, 'through the 24-Hour Economy programme', t('24hour', 'economy'), LX, 426, 'chip gold')}
    ${chip(p, 'to digitise the films held in Britain', t('to digitize', 'digitize the films'), LX, 522, 'chip light')}
    ${p.stamp('FUNDED', t('committed money', 'committed') + 0.4, { x: 800, y: 640, rot: -7, size: 70 })}`, { enter: 'wipeL' });
  // Z — the work is said to be underway
  sceneP(p, Z, s.dur, `${H(p, 'The work is said to be *underway.*', Z + 0.05, { size: 92, w: 1050 })}
    ${progress(p, 'DIGITISING · MOTHER GHANA’S FILMS', Z + 0.6, Math.max(1.5, s.dur - Z - 1.2), { y: 480 })}`, { enter: 'wipeU' });
  return p;
}

// ---------------------------------------------------------------------------
// QUESTION FOUR — Why did it take outsiders to celebrate him?
export function q4() {
  const [p, c, s] = make('q4'); p.css.push(SP1_CSS); p.label = '';
  const t = (...q) => cs(c, ...q);
  const B = t('why did it take'), C = t('fair'), D = t('anita afonu and', 'anita afonu'), E = t('and afonu admits', 'afonu admits'), F = t('the lesson is not'), G = t('it is that a story');
  const ph = new Phone(p, { pinned: 'Why did it take outsiders to celebrate him?', enter: 0.0, clock0: '1:21',
    prior: [{ who: 'Baaba', text: 'So Ghana not having a colour lab is what saved our history?? 😮', time: '12:46 am' }, { who: 'Aba', text: 'And the black & white ones were just… thrown away? The thing pain me oo 😭', time: '12:47 am' }] });
  ph.typing('Baaba', 0.3, B); ph.msg({ who: 'Baaba', text: 'Honest question tho. Why did it take a Canadian, Obama and Speed to put a Ghanaian in the spotlight?', time: '1:21 am', at: B });
  ph.focus(B + 0.3, 3.4);
  ph.typing('Kwame', t('in the spotlight', 'spotlight') - 0.8, C - 0.15); ph.msg({ who: 'Kwame', text: 'Now THAT is the real palava 👀', time: '1:22 am', at: C - 0.15 });
  ph.build();
  sceneP(p, 0, B, `${at_(LX, 150, tw(p, '1:21 AM', 0.3, 84, 'var(--red)'))}
    ${nameCard(p, 0.3, { y: 300, role: 'IN THE CHAT', name: 'Baaba, The Ascendant' })}
    ${chip(p, '…asked the one that stung', t('the one that stung', 'stung'), LX, 520, 'chip red')}`, { enter: 'cut' });
  // B — a Canadian director, a former American president, a streamer from Ohio… and a Ghanaian in the spotlight
  const spot = t('in the spotlight', 'spotlight'), sp = p.id_('spot');
  p.tl.push(`tl.fromTo("#${sp}", {opacity:0}, {opacity:1, duration:0.1, ease:"none"}, ${n3(spot - 0.2)});`); p.ev(spot - 0.2); efx(p, 'glass.wav', spot - 0.1, -18);
  sceneP(p, B, C, `${H(p, 'Why did it take…', B + 0.05, { size: 76 })}${stack(p, [['a Canadian director', t('canadian director', 'canadian'), 'chip light'], ['a former American president', t('former american', 'american president'), 'chip light'], ['a streamer from Ohio', t('streamer from ohio', 'streamer'), 'chip light']], { y: 290 })}
    <div id="${sp}" style="position:absolute;left:620px;top:0;width:560px;height:1080px;background:linear-gradient(180deg, rgba(255,236,170,.0) 0%, rgba(255,236,170,.55) 60%, rgba(255,236,170,.7) 100%);clip-path:polygon(40% 0, 60% 0, 100% 100%, 0 100%)"></div>
    ${prt(p, 'hesse-kafui', spot - 0.3, { x: 720, y: 380, w: 360, rot: 2, caption: 'a Ghanaian, in the spotlight' })}`, { enter: 'wipeL' });
  sceneP(p, C, D, `${p.stamp('FAIR.', C + 0.05, { x: 140, y: 170, rot: -6, size: 80 })}
    ${H(p, 'But Ghanaians made this film *too.*', t('but ghanaians') , { size: 110, y: 360, w: 1080 })}`, { enter: 'wipeU' });
  sceneP(p, D, E, `${nameCard(p, D + 0.05, { y: 150, role: 'PRODUCER', name: 'Anita Afonu' })}
    ${nameCard(p, t('amponsa', 'yao') - 0.1, { y: 330, role: 'PRODUCER', name: 'Yaw Amponsah' })}
    ${chip(p, 'both trained at our own film institute', t('our own film', 'film institute'), LX, 540, 'chip gold')}
    ${chip(p, 'among its producers', t('among its producers', 'producers'), LX, 636, 'chip light')}
    ${stk(p, 'film-camera', D + 0.5, { x: 880, y: 560, w: 260, life: 'sway', until: E })}`, { enter: 'push' });
  sceneP(p, E, F, `${H(p, 'In film school, they…', E + 0.05, { size: 84 })}
    <div style="position:absolute;left:${LX}px;top:330px;font-family:'Playfair Display',serif;font-weight:900;font-size:110px;color:var(--green)">${p.words(p.id_('w'), 'talked about him ✓', t('talked about'))}</div>
    <div style="position:absolute;left:${LX}px;top:500px">${strikeWord(p, 'taught about him', t('never taught', 'taught') + 0.4, { size: 110, color: 'var(--red)' })}</div>`, { enter: 'wipeR' });
  sceneP(p, F, G, `${H(p, 'The lesson is not that…', F + 0.05, { size: 84 })}
    <div style="position:absolute;left:${LX}px;top:330px">${strikeWord(p, 'foreigners care more', t('care more') + 0.3, { size: 110 })}</div>`, { enter: 'wipeU' });
  sceneP(p, G, s.dur, `${H(p, 'A story nobody keeps is a story *nobody can tell.*', G + 0.1, { size: 112, y: 220, w: 1080 })}
    ${stk(p, 'film-cans', t('nobody can tell') - 0.3, { x: 880, y: 640, w: 240, life: 'bob', until: s.dur })}`, { enter: 'iris' });
  return p;
}

// ---------------------------------------------------------------------------
// THE LESSON — eyes, road, craft, back it up; and a line for Aba. Then the chat signs off.
export function lesson() {
  const [p, c, s] = make('lesson'); p.css.push(SP1_CSS); p.label = '';
  const t = (...q) => cs(c, ...q);
  const B = t('today, he is', 'today he is'), C = t('struggles with'), D = t('but refuses'), E = t('choose your road'), F = t('learn your craft'), G = t('and document everything'), Hh = t('chali'),
    I = t('you carry a camera'), J = t('and for abba', 'for abba'), Kk = t('ghana is what we have'), L = c('belong there', { end: true });
  const ph = new Phone(p, { pinned: 'Ok Editor. What’s the lesson?', enter: 0.0, clock0: '1:54', exit: s.dur - 0.7,
    prior: [{ who: 'Baaba', text: 'Honest question tho. Why did it take a Canadian, Obama and Speed to put a Ghanaian in the spotlight?', time: '1:21 am' }, { who: 'Kwame', text: 'Now THAT is the real palava 👀', time: '1:22 am' }] });
  const ask = t('asked me for the lesson', 'for the lesson');
  ph.typing('Aba', 0.3, ask); ph.msg({ who: 'Aba', text: 'Ok Editor. What’s the lesson? Then I’ll sleep 😴', time: '1:54 am', at: ask });
  ph.focus(ask + 0.2, 3.0);
  // backing up, on Kofi's own phone
  const bk = p.id_('bk'), bkT = t('back it up') - 0.2;
  // the sign-off after the last line
  const a1 = L + 0.7, k1 = L + 2.0, r0 = L + 3.4;
  ph.typing('Aba', L + 0.1, a1); ph.msg({ who: 'Aba', text: 'ok that last line was for me 😶', time: '1:57 am', at: a1 });
  ph.msg({ who: 'Kofi', text: 'Create intentionally. Document relentlessly. Preserve for posterity. Goodnight, squad.', time: '1:58 am', at: k1 });
  ['Aba', 'Baaba', 'Kwame'].forEach((w, i) => ph.msg({ who: w, text: '🙏🏾', big: true, time: '1:58 am', at: r0 + i * 0.35 }));
  ph.focus(a1 + 0.1, s.dur - a1 - 1.0, { s: 1.1 });
  const pid = ph.build();
  // backup banner over the phone screen
  p.html.push(`<div id="${bk}" class="clip" data-start="${n3(bkT)}" data-duration="3.6" data-track-index="5" style="position:absolute;left:${K.PHONE.x + 40}px;top:${K.PHONE.y + 70}px;width:${K.PHONE.w - 80}px;z-index:760;background:rgba(40,44,48,.96);border-radius:22px;padding:14px 18px;font-family:'Inter',sans-serif;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.4)"><div style="font-size:17px;font-weight:700">☁️  Chat backup</div><div style="font-size:15px;opacity:.75;margin-top:2px">Backing up messages and media…</div><div style="height:8px;border-radius:4px;background:rgba(255,255,255,.18);margin-top:10px;overflow:hidden"><div id="${bk}-b" style="height:100%;background:#00A884;transform-origin:0 50%"></div></div></div>`);
  p.tl.push(`tl.fromTo("#${bk}", {y:-160}, ${JSON.stringify({ y: 0, ...spr('snappy') })}, ${n3(bkT)});`, `tl.fromTo("#${bk}-b", {scaleX:0}, {scaleX:1, duration:2.4, ease:"power1.inOut"}, ${n3(bkT + 0.3)});`, `tl.to("#${bk}", {y:-200, duration:0.35, ease:"power2.in", immediateRender:false}, ${n3(bkT + 3.2)});`);
  p.ev(bkT); fx(p, 'wa-notify.wav', bkT, -18);
  sceneP(p, 0, B, `${at_(LX, 150, tw(p, '1:54 AM', 0.3, 84, 'var(--red)'))}
    ${chip(p, 'close to two o’clock', 0.6, LX, 300, 'chip light')}
    ${chip(p, 'Aba asks for the lesson', ask - 0.2, LX, 396, 'chip gold')}
    ${H(p, 'So here it is.', t('so here it is'), { size: 110, y: 560 })}`, { enter: 'cut' });
  sceneP(p, B, C, `${at_(LX, 120, counter(p, t('94') - 0.4, 94, { size: 240, fmt: false }))}
    ${chip(p, 'years old today', t('94') + 0.4, LX, 390, 'chip light')}
    ${chip(p, 'a whole life lived through his eyes', t('whole life'), LX, 486, 'chip gold')}
    ${prt(p, 'hesse-reels', B + 0.3, { x: LX, y: 600, w: 380, rot: -3 })}
    ${eyeChart(p, t('eye chart') - 0.2, C + 0.3, { x: 820, y: 140 })}`, { enter: 'wipeL' });
  sceneP(p, C, D, `${eyeChart(p, C, C + 0.5, { x: 760, y: 140 })}
    ${chip(p, 'he struggles with the letters', C + 0.2, LX, 260, 'chip light')}
    ${p.stamp('GLAUCOMA', t('glaucoma'), { x: 140, y: 420, rot: -6, size: 70 })}`, { enter: 'cut' });
  sceneP(p, D, E, `${quote(p, 'There is more work to be done *while we are alive.*', t('because there is', 'more work') - 0.2, { who: 'HE REFUSES TO ACCEPT HE WILL BE BLIND', y: 220, size: 76, w: 1050, cardAt: D + 0.1 })}`, { enter: 'wipeU' });
  sceneP(p, E, F, `${lessonNo(p, '1', 'Choose your road *on purpose.*', E + 0.05)}
    ${chip(p, 'even when your father asks what it is for', t('even when your father'), LX, 560, 'chip light')}`, { enter: 'push' });
  sceneP(p, F, G, `${lessonNo(p, '2', 'Learn your *craft.*', F + 0.05)}
    ${chip(p, 'until your angle is the one they send for', t('until your angle'), LX, 560, 'chip gold')}
    ${stk(p, 'film-camera', F + 0.4, { x: 900, y: 560, w: 260, life: 'sway', until: G })}`, { enter: 'push' });
  sceneP(p, G, Hh, `${lessonNo(p, '3', 'Document everything. *Back it up.*', G + 0.05)}
    ${chip(p, 'ordinary on your phone tonight…', t('ordinary on your phone'), LX, 560, 'chip light')}
    ${chip(p, '…the only record of our time tomorrow', t('only record'), LX, 656, 'chip red')}
    ${stk(p, 'data-phone', t('back it up'), { x: 920, y: 640, w: 220, life: 'bob', until: Hh })}`, { enter: 'push' });
  sceneP(p, Hh, I, `${H(p, 'Chale.', Hh, { size: 130 })}
    ${chip(p, 'he kept the light burning', t('kept the light'), LX, 330, 'chip gold')}
    ${at_(LX, 430, counter(p, t('60 years') - 0.4, 60, { size: 180, suffix: ' years', fmt: false }))}
    ${chip(p, '…with tins of film', t('tins of film'), LX, 650, 'chip light')}
    ${stk(p, 'film-cans', t('tins of film') - 0.2, { x: 900, y: 360, w: 260, life: 'bob', until: I })}`, { enter: 'wipeR' });
  sceneP(p, I, J, `${H(p, 'A camera and cloud storage, *in your pocket*', I + 0.05, { size: 84, w: 1050 })}
    ${stk(p, 'data-phone', t('cloud storage') - 0.2, { x: 760, y: 420, w: 320, life: 'bob', until: J })}
    ${p.stamp('NO EXCUSE', t('no excuse'), { x: 140, y: 520, rot: -7, size: 76 })}`, { enter: 'wipeU' });
  sceneP(p, J, Kk, `${p.print('/home/user/gcp/project/media/final/aba-light.png', J + 0.05, { x: 720, y: 300, w: 460, rot: 3, caption: 'Aba, The Restless' })}
    ${chip(p, 'Aba, who still talks about leaving', t('talks about leaving'), LX, 140, 'chip light')}
    ${prt(p, 'hesse-kafui', t('kafui day', 'kafui') - 0.4, { x: LX, y: 280, w: 360, rot: -2, caption: 'Kafui Dey Interviews, YouTube (April 2026)' })}`, { enter: 'push' });
  sceneP(p, Kk, s.dur, `${H(p, 'Ghana is what we have.', Kk, { size: 120, y: 150, w: 1080 })}
    ${quote(p, 'You can live in London or anywhere else, but *you do not belong there.*', t('you can live') - 0.1, { who: 'REV. CHRIS TSUI HESSE', y: 470, size: 56, w: 1050 })}`, { enter: 'iris' });
  fx(p, 'crickets.wav', L + 0.2, -26, s.dur - L);
  return p;
}

export const BUILDERS = { q1, q2, q3, q4, lesson };
