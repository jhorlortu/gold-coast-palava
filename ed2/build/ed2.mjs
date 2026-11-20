// Gold Coast Palava — Edition 2: "Why does Ghana send its cocoa away in sacks and buy it back in wrappers?"
// House style: gold-coast-palava-edit skill. Run with GCP_WORK=/home/user/gcp/ed2/work GCP_EDITION="EDITION 2".
// New in Ed2: the living Nest (nestlive.mjs) plays like a real shot whenever the Nest is on screen; denser, clearer SFX.
import fs from 'node:fs';
import path from 'node:path';
import { Part, cuer, SP } from '/home/user/gcp/build/lib.mjs';
import { banner, BANNER_CSS } from '/home/user/gcp/build/banner.mjs';
import { combo1 } from '/home/user/gcp/build/combo1.mjs';
import { livingNest } from './nestlive.mjs';

const WORK = '/home/user/gcp/ed2/work';
const plan = JSON.parse(fs.readFileSync(path.join(WORK, 'timeline.json'), 'utf8'));
const P = Object.fromEntries(plan.parts.map((p) => [p.id, p]));
const ORDER = plan.parts.filter((p) => !p.id.includes('~'));
const seg = (id, fromPart, label, toEnd = false) => {
  const i = ORDER.findIndex((p) => p.id === fromPart);
  const T0 = P[fromPart].T0, T1 = !toEnd && i + 1 < ORDER.length ? ORDER[i + 1].T0 : plan.total;
  const pieces = plan.parts.filter((p) => p.kind === 'vo' && p.T0 >= T0 - 1e-6 && p.T0 < T1 - 1e-6).map((p) => ({ vo_in: p.vo_in, vo_out: p.vo_out, local0: +(p.T0 - T0).toFixed(3) }));
  return { id, T0, dur: +(T1 - T0).toFixed(3), label, pieces };
};
export const SEGMENTS = {
  cold: seg('cold', 'cold-open', 'THE NEST · THIS EVENING'),
  combo1: seg('combo1', 'combo1', ''),
  nest: seg('nest', 'nest', 'THE NEST · THE PRICE'),
  front: seg('front', 'front-page', 'FRONT PAGE'),
  headlead: seg('headlead', 'head-lead', 'LEAD STORY'),
  lead: seg('lead', 'lead', 'LEAD STORY · BROWN GOLD'),
  wire: seg('wire', 'wire', 'THE WIRE · ACCRA, 2026'),
  palava: seg('palava', 'palava', 'THE PALAVA DESK'),
  thennow: seg('thennow', 'then-now', 'THEN v NOW'),
  headteam: seg('headteam', 'head-team', 'THE TEAM ASIDE'),
  team: seg('team', 'team', 'THE TEAM ASIDE'),
  editor: seg('editor', 'editor', "EDITOR'S NOTE"),
  headletters: seg('headletters', 'head-letters', 'LETTERS PAGE'),
  letters: seg('letters', 'letters', 'LETTERS PAGE'),
  dispatch: seg('dispatch', 'dispatch', 'DISPATCH', true),
};
SEGMENTS.dispatch.dur = +(P.credits.T0 - SEGMENTS.dispatch.T0).toFixed(3);
SEGMENTS.credits = { id: 'credits', T0: P.credits.T0, dur: +(plan.total - P.credits.T0).toFixed(3), label: '', pieces: [] };
{ const c0 = SEGMENTS.cold; const d = c0.T0; c0.T0 = 0; c0.dur = +(c0.dur + d).toFixed(3); c0.pieces = c0.pieces.map((q) => ({ ...q, local0: +(q.local0 + d).toFixed(3) })); }

const PILOT = '/home/user/gcp/project/media';
const STK = '/home/user/gcp/ed2/media/stickers_cut', STK1 = '/home/user/gcp/ed1/media/stickers_cut';
const SFX = '/home/user/gcp/ed2/media/sfx', SFX1 = '/home/user/gcp/ed1/media/sfx';
const DRAWN = '/home/user/gcp/ed2/media/drawn';
const FONTS = '/home/user/gcp/ed2/build/node_modules/@fontsource';
const r3 = (v) => +(+v).toFixed(3);
const make = (key) => { const s = SEGMENTS[key]; const p = new Part({ ...s }); fontCss(p); return [p, cuer(s.pieces), s]; };
// Caveat (handwriting on the sticky note / red ink) and Special Elite (the Wire's dateline)
function fontCss(p) {
  p.css.push(`@font-face { font-family:'Caveat'; src:url('${p.asset(FONTS + '/caveat/files/caveat-latin-700-normal.woff2')}') format('woff2'); font-weight:700; }
@font-face { font-family:'Special Elite'; src:url('${p.asset(FONTS + '/special-elite/files/special-elite-latin-400-normal.woff2')}') format('woff2'); }
.hand { font-family:'Caveat', cursive; font-weight:700; }
.elite { font-family:'Special Elite', 'IBM Plex Mono', monospace; }`);
}
const st = (p, name, at, o = {}) => p.icon(name, at, { dir: STK, sfx: o.sfx ?? SFX1 + '/pop-2.wav', ...o });
const st1 = (p, name, at, o = {}) => p.icon(name, at, { dir: STK1, sfx: o.sfx ?? SFX1 + '/pop-2.wav', ...o });
const fx = (p, file, at, db = -16, len) => p.sfx.push({ file: file.startsWith('/') ? file : path.join(SFX, file), T: r3(p.T0 + at), db, ...(len ? { len } : {}) });
const cs = (c, ...qs) => { for (const q of qs) { try { return c(q); } catch {} } throw new Error('no cue: ' + qs.join(' | ')); };
const COLX = 150, COLY = 400, PITCH = 92;
const stack = (p, items, { x = COLX, y = COLY, pitch = PITCH } = {}) => items.filter(Boolean).map(([t, at, kind = 'chip light'], i) => p.chip(t, at, { kind, x, y: y + i * pitch })).join('');
const head = (p, kick, kat, text, tat, { size = 80, w = 940, x = 150, y = 140 } = {}) => `<div class="hl" style="left:${x}px;top:${y}px;width:${w}px">${p.kicker(kick, kat)}<h1 style="font-size:${size}px">${p.words(p.id_('h'), text, tat, { stagger: 0.06 })}</h1></div>`;
const RIGHT = { x: 1150, y: 170, w: 620 };
const away = (p, html, t, { y = -1300, rot = -10, x = 0 } = {}) => { const id = p.id_('aw');
  p.tl.push(`tl.to("#${id}", {y:${y}, x:${x}, rotation:${rot}, duration:0.55, ease:"power3.in", immediateRender:false}, ${r3(t)});`); p.ev(t); p.sound('whoosh-1.mp3', t, -20);
  return `<div id="${id}" style="position:absolute;inset:0;pointer-events:none">${html}</div>`; };
const nameCard = (p, at, { x = 110, y = 640, role, name, note = '' }) => {
  const id = p.id_('nm');
  p.tl.push(`tl.fromTo("#${id}", {xPercent:-120}, {xPercent:0, duration:${SP.heavy}, ease:"sp-heavy"}, ${r3(at)});`); p.ev(at);
  p.sound(SFX1 + '/whip.wav', at, -17);
  return `<div style="position:absolute;left:0;top:${y}px;overflow:hidden;padding-right:40px"><div id="${id}" style="margin-left:${x}px;background:#FCF5E8;padding:20px 34px;border-left:12px solid var(--red);box-shadow:10px 12px 0 rgba(26,22,18,.85)"><div class="mono" style="font-size:22px;letter-spacing:.2em;color:var(--red);font-weight:700">${role}</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:56px;line-height:1.05">${name}</div>${note ? `<div class="mono" style="font-size:20px;margin-top:6px;color:var(--muted)">${note}</div>` : ''}</div></div>`;
};
// rolling counter (seek-safe GSAP innerText snap)
const counter = (p, at, to, { size = 170, color = 'var(--ink)', suffix = '', prefix = '', dur = 1.4, sfx = 'blip.wav' } = {}) => {
  const id = p.id_('ct');
  p.tl.push(`tl.fromTo("#${id}", {innerText:0}, {innerText:${to}, duration:${dur}, ease:"power2.out", snap:{innerText:1}}, ${r3(at)});`);
  p.ev(at); p.ev(at + dur);
  for (let k = 0; k < 5; k++) fx(p, sfx, at + k * dur / 6, -26);
  fx(p, 'register.wav', at + dur - 0.1, -22);
  return `<span style="font-family:'Playfair Display',serif;font-weight:900;font-size:${size}px;color:${color};white-space:nowrap">${prefix}<span id="${id}">0</span>${suffix}</span>`;
};
// a card that grows in (cream, ink border, hard shadow)
const card = (p, inner, at, { x, y, w, rot = 0, pad = '24px 30px', bg = '#FCF5E8', sfx = true } = {}) => { const id = p.id_('cd');
  if (at != null) { p.grow(id, at, { from: 0.8, dy: 30, rot }); if (sfx) fx(p, SFX1 + '/paper-slap.wav', at + 0.15, -18); }
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;background:${bg};border:4px solid var(--ink);box-shadow:10px 12px 0 var(--ink);padding:${pad};transform:rotate(${rot}deg)">${inner}</div>`; };
const mono = (t, { size = 22, color = 'var(--red)' } = {}) => `<div class="mono" style="font-size:${size}px;font-weight:700;letter-spacing:.2em;color:${color}">${t}</div>`;
const H = (p, t, at, size = 60, stagger = 0.06) => `<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:${size}px;line-height:1.05;margin-top:8px">${p.words(p.id_('w'), t, at, { stagger })}</div>`;
// the Nest's room sound under every living-Nest shot: room tone (fan, insects, lagoon) + the clock ticking each second
const nestBed = (p, t0, t1, db = -22) => {
  for (let t = t0; t < t1 - 0.5; t += 19) fx(p, 'nest-room.wav', t, db, Math.min(20, t1 - t));
  for (let t = Math.ceil(t0) + 0.02; t < t1; t += 1) fx(p, 'tick.wav', t, -33);
};
// a gold pin on a spot in the living Nest (label card beside it)
const pin = (p, txt, x, y, at, dx = 40, dy = -78) => { const id = p.id_('pin'); p.grow(id, at, { preset: 'snappy', dy: 20, from: 0.6 }); fx(p, SFX1 + '/pop-1.wav', at, -16);
  return `<div id="${id}" style="position:absolute;left:${x - 10}px;top:${y - 10}px"><div style="width:20px;height:20px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 7px rgba(201,150,47,.35)"></div><div style="position:absolute;left:${dx}px;top:${dy}px;white-space:nowrap;background:#FCF5E8;border:3px solid var(--ink);box-shadow:6px 7px 0 var(--ink);padding:8px 18px;font-family:'GCP Round',sans-serif;font-weight:700;font-size:28px">${txt}</div></div>`; };

// ---------------------------------------------------------------------------
// COLD OPEN — no music. The Nest this evening, the chocolate on the shared table, the sticky note, the question.
export function cold() {
  const [p, c, s] = make('cold');
  const aEnd = c('yet nobody') - 0.1, bEnd = c('why does ghana') - 0.25;
  // A — the living Nest: wide, then the camera finds the shared table as the voice names it
  const bar = p.id_('bar');
  p.tl.push(`tl.fromTo("#${bar}", {opacity:0, y:-40, scale:.6}, {opacity:1, y:0, scale:1, duration:${SP.playful}, ease:"sp-playful"}, ${r3(c('an open bar') - 0.1)});`);
  fx(p, 'crinkle.wav', c('an open bar'), -16);
  const N = livingNest(p, 0, aEnd, { grade: 'evening', truck: 46, seed: 3, start: { scale: 1.08, x: 0, y: 0 },
    bgExtra: `<img id="${bar}" src="${p.asset(STK + '/chocolate-note.png')}" style="position:absolute;left:872px;top:482px;width:40px;transform:rotate(-70deg) skewX(20deg);opacity:0;filter:drop-shadow(0 4px 4px rgba(0,0,0,.4))">` });
  N.aim([900, 500], 1.55, c('somebody has left') - 0.2);
  N.aim([960, 540], 1.12, c('every desk sits') - 0.2);
  N.aim([900, 500], 2.3, c('nothing on that table') - 0.2);
  p.scene(0, aEnd, `${N.html}
    ${card(p, `${mono(p.typed('THIS EVENING · THE NEST', 0.35, { cps: 18 }))}${H(p, 'The Nest smells of *chocolate.*', c('smells of') - 0.2, 64)}`, 0.2, { x: 110, y: 120, w: 760 })}
    <div style="position:absolute;left:110px;top:420px">${p.chip('an open bar · the shared table', c('an open bar'), { kind: 'chip red' })}</div>
    <div style="position:absolute;left:110px;top:510px">${p.chip('every desk in plain view', c('every desk sits'), { kind: 'chip light' })}</div>
    <div style="position:absolute;left:110px;top:600px">${p.chip('…nothing stays secret for long', c('stays secret'), { kind: 'chip gold' })}</div>`, { bg: 'none', enter: 'cut', drift: 0 });
  nestBed(p, 0, aEnd + 0.5, -20);
  for (let k = 0; k < 6; k++) fx(p, 'key.wav', 1.3 + k * 0.62 + (k % 2) * 0.17, -27);         // a slow typewriter somewhere in the room
  fx(p, 'thump.wav', 5.2, -26);                                                            // one rubber stamp
  // B — close-up: the bar, untouched, the sticky note under the wrapper
  p.scene(aEnd, bEnd, `<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 60% 45%, #6B4A2E 0%, #3B2A1C 70%)"></div>
    <div style="position:absolute;inset:0;background:repeating-linear-gradient(90deg, rgba(255,220,170,.05) 0 3px, transparent 3px 26px)"></div>
    ${st(p, 'chocolate-note', aEnd + 0.15, { x: 1060, y: 110, w: 520, rot: -8, life: 'bob', until: bEnd + 0.5, sfx: SFX + '/snap.wav', db: -16 })}
    ${card(p, `${mono('CLOSE-UP · THE SHARED TABLE')}${H(p, 'Nobody has touched *a square.*', aEnd + 0.3, 62)}`, aEnd + 0.1, { x: 110, y: 130, w: 820 })}
    <div style="position:absolute;left:110px;top:470px">${p.chip('tucked under the wrapper: a sticky note', c('tucked under'), { kind: 'chip gold' })}</div>
    <div style="position:absolute;left:110px;top:560px">${p.chip('small, careful handwriting', c('small and careful'), { kind: 'chip light' })}</div>
    <div style="position:absolute;left:110px;top:650px">${p.chip('the question this edition is built on', c('asking the question'), { kind: 'chip red' })}</div>`, { bg: 'none', enter: 'iris', drift: 0.06 });
  fx(p, 'crinkle.wav', c('tucked under'), -14); fx(p, 'riser.wav', bEnd - 2.0, -22);
  // C — the STICKY NOTE fills the screen; the question writes itself in her hand as it is spoken
  const q0 = c('why does ghana');
  const words = c.words(q0 - 0.1, s.dur);
  const note = words.map((w, i) => { const id = `qn${i}`, at = Math.max(q0 - 0.05, w.s - 0.04);
    p.tl.push(`tl.fromTo("#${id}", {opacity:0, y:12, rotation:-3}, {opacity:1, y:0, rotation:0, duration:${SP.snappy}, ease:"sp-snappy"}, ${r3(at)});`); p.ev(at);
    const red = /sacks|wrappers/i.test(w.w);
    return `<span id="${id}" style="display:inline-block;opacity:0${red ? ';color:#B3261E;text-decoration:underline;text-decoration-thickness:6px;text-underline-offset:10px' : ''}">${w.w}</span>`; }).join(' ');
  fx(p, 'scribble.wav', q0, -18, 2.2); fx(p, 'scribble.wav', q0 + 2.2, -20, 2.0); fx(p, 'hit.wav', words[words.length - 1].s, -12);
  p.scene(bEnd, s.dur, `<div style="position:absolute;inset:0;background:#3B2A1C"></div>
    <div id="stk" style="position:absolute;left:170px;top:70px;width:1580px;height:940px;background:linear-gradient(170deg,#FBE36A,#F3CF3C);box-shadow:0 40px 80px -20px rgba(0,0,0,.6);transform:rotate(-1.5deg);padding:110px 120px">
      <div style="position:absolute;left:0;right:0;top:0;height:70px;background:rgba(0,0,0,.06)"></div>
      <div class="hand" style="font-size:132px;line-height:1.12;color:#1F2A5C">${note}</div></div>`, { bg: 'none', enter: 'rise', drift: 0.035 });
  p.mast = true;
  return p;
}

export function combo() { return combo1(SEGMENTS.combo1); }

// ---------------------------------------------------------------------------
// THE NEST — My squad, how you dey? Kofi at his desk; the price (~50 MB); missed Edition 1? watch it first.
export function nest() {
  const [p, c, s] = make('nest');
  const aEnd = c('and the price') - 0.1, bEnd = c('if you have not') - 0.1;
  const N = livingNest(p, 0, aEnd, { grade: 'evening', truck: 36, seed: 5, start: { scale: 1.3, x: 160, y: -120 } });
  N.aim('typewriter', 1.7, 0.4); N.aim('laptop', 1.5, c('i am kofi') - 0.2); N.aim([960, 540], 1.1, c('this is the gold') - 0.1);
  p.scene(0, aEnd, `${N.html}
    ${card(p, `${H(p, 'My squad, how you *dey?*', 0.1, 84)}<div class="sub" style="font-size:46px;margin-top:14px">${p.words(p.id_('k'), 'I am *Kofi*, the Editor.', c('i am kofi'), { stagger: 0.08 })}</div>`, 0.05, { x: 110, y: 130, w: 980 })}
    <div style="position:absolute;left:110px;top:520px">${p.chip('THE GOLD COAST PALAVA', c('this is the gold'), { kind: 'chip red' })}</div>
    <div style="position:absolute;left:110px;top:610px">${p.chip('Edition No. 2', c('second edition'), { kind: 'chip gold' })}</div>
    ${pin(p, 'the editor’s desk', 760, 720, c('i am kofi') + 0.4, 40, 30)}`, { bg: 'none', enter: 'cut', drift: 0 });
  nestBed(p, 0, aEnd + 0.4, -22);
  const m50 = cs(c, 'about 50', '50 megabytes');
  const box = p.id_('pb');
  p.grow(box, m50 - 0.25, { rot: -1.5, preset: 'heavy', from: 0.7, dy: 40 });
  fx(p, 'thump.wav', m50 + 0.1, -10); fx(p, SFX1 + '/coins.wav', m50 + 0.5, -18);
  p.scene(aEnd, bEnd, `<div style="position:absolute;left:0;right:0;top:140px;display:flex;justify-content:center">${p.kicker('THE PRICE OF THIS SECOND EDITION', aEnd + 0.15)}</div>
    <div style="position:absolute;left:0;right:0;top:220px;display:flex;justify-content:center">
      <div id="${box}" style="border:8px solid var(--ink);padding:20px 60px 34px;background:#FCF5E8;box-shadow:16px 18px 0 var(--ink)">
        <div class="mono" style="font-size:28px;font-weight:700;letter-spacing:.3em;color:var(--red)">PRICE · EDITION No. 2</div>
        <div style="font-family:'Playfair Display',serif;font-weight:900;font-size:220px;line-height:1;white-space:nowrap">${p.words('price', '≈ 50 MB', m50 + 0.05, { stagger: 0.1 })}</div></div></div>
    ${p.stamp('PAID IN DATA', c('paid as always'), { x: 1290, y: 210, rot: 8, size: 46 })}
    ${st(p, 'chocolate-note', c('cheaper than'), { x: 1480, y: 590, w: 220, rot: 10, life: 'bob', until: bEnd + 0.5, sfx: SFX + '/snap.wav' })}
    ${p.chip('cheaper than that bar on the table', c('cheaper than'), { kind: 'chip light', x: 180, y: 680 })}
    ${p.chip('…and far more filling', c('far more filling'), { kind: 'chip gold', x: 180, y: 780 })}`, { enter: 'wipeU' });
  // missed Edition 1? — an end-screen style card to Edition 1
  const ec = p.id_('ec');
  p.grow(ec, bEnd + 0.4, { rot: 2, from: 0.7, preset: 'heavy' });
  fx(p, 'kachunk.wav', bEnd + 0.5, -14);
  const pl = p.id_('pl'); p.tl.push(`tl.fromTo("#${pl}", {scale:1}, {scale:1.12, duration:0.5, ease:"sine.inOut", repeat:${Math.max(1, Math.floor((s.dur - bEnd) / 0.5) - 1)}, yoyo:true}, ${r3(bEnd + 1.2)});`);
  p.scene(bEnd, s.dur, `${head(p, 'MISSED EDITION 1?', bEnd + 0.1, 'Pause here. *Watch it first.*', bEnd + 0.25, { size: 84 })}
    <div id="${ec}" style="position:absolute;left:1080px;top:180px;width:700px;background:#1A1612;padding:16px;box-shadow:0 40px 70px -24px rgba(60,40,10,.5)">
      <div style="position:relative;height:394px;background:url(${p.asset('/home/user/gcp/ed1/media/drawn/prempeh1-exile.jpg')}) center 30%/cover">
        <div style="position:absolute;left:0;right:0;bottom:0;padding:18px 22px;background:linear-gradient(transparent, rgba(0,0,0,.85))"><div class="mono" style="color:#C8962F;font-size:20px;letter-spacing:.2em;font-weight:700">GOLD COAST PALAVA · EDITION 1</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:40px;color:#FCF5E8;line-height:1.05">Why is Ghana a powerful nation?</div></div>
        <div id="${pl}" style="position:absolute;left:300px;top:130px;width:100px;height:100px;border-radius:50%;background:rgba(164,36,27,.92);display:flex;align-items:center;justify-content:center"><div style="width:0;height:0;border-left:38px solid #FCF5E8;border-top:24px solid transparent;border-bottom:24px solid transparent;margin-left:10px"></div></div></div></div>
    ${stack(p, [['pause here · go back for it', c('pause here'), 'chip red'], ['this story picks up the gold where it left off', c('picks up the gold'), 'chip gold'], ['…what Britain demanded at Fomena', c('what britain demanded'), 'chip light']], { y: 420 })}
    ${st1(p, 'gold-dust', c('the gold exactly'), { x: 870, y: 420, w: 160, rot: 6, life: 'pulse', until: s.dur, sfx: SFX + '/sparkle.wav', db: -16 })}
    ${p.stamp('FOMENA · 1874', cs(c, 'fomina in 1874', 'in 1874'), { x: 160, y: 740, rot: -4, size: 54 })}
    ${st1(p, 'treaty-paper', cs(c, 'fomina in 1874', 'in 1874') + 0.2, { x: 760, y: 640, w: 300, rot: -6, life: 'bob', until: s.dur, sfx: SFX1 + '/paper-slap.wav' })}`, { enter: 'push' });
  return p;
}

// ---------------------------------------------------------------------------
// FRONT PAGE — five cards slam in, one per question: the first larger, stamped LEAD STORY; the last a boxed classified.
const qcard = (p, at, { x, y, w, h, tag, q, rot = 0, lead = false, classified = false, fs = 40 }) => {
  const id = p.id_('qc');
  p.tl.push(`tl.fromTo("#${id}", {opacity:0}, {opacity:1, duration:0.08, ease:"none"}, ${r3(at)});`);
  p.tl.push(`tl.fromTo("#${id}", {y:-340, scale:1.25, rotation:${rot + (p.uid % 2 ? 14 : -14)}}, {y:0, scale:1, rotation:${rot}, duration:${SP.default}, ease:"sp-default"}, ${r3(at)});`);
  p.ev(at); p.sound('page-turn-3.mp3', at + 0.05, -18); fx(p, 'thump.wav', at + 0.3, lead ? -10 : -16);
  const style = classified ? 'background:#FCF5E8;border:3px dashed var(--ink);box-shadow:none' : '';
  return `<div id="${id}" class="card" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${style}"><div class="lbl"><span>${classified ? 'CLASSIFIED' : 'FRONT PAGE'}</span><b>${tag}</b></div><h3 style="font-size:${fs}px">${q}</h3></div>`;
};
export function front() {
  const [p, c, s] = make('front');
  const aEnd = c('our lead') - 0.1;
  p.scene(0, aEnd, `${head(p, 'FRONT PAGE · THE HOUSE RULE', 0.1, 'Every headline is a *question.*', c('every headline') - 0.1, { size: 104, w: 1500, y: 260 })}
    ${st1(p, 'folded-paper', 0.6, { x: 1450, y: 560, w: 300, rot: 5, life: 'bob', until: aEnd + 0.5, sfx: SFX1 + '/paper-slap.wav' })}
    ${p.chip('page one', 0.3, { kind: 'chip red', x: 150, y: 600 })}
    ${p.chip('and as the house rule goes…', c('as the house rule'), { kind: 'chip light', x: 150, y: 690 })}`, { enter: 'cut' });
  fx(p, 'swoop.wav', aEnd - 0.1, -18);
  const q1 = c('how did a man'), q2 = c('why did farmers'), q3 = c('how do you sell'), q4 = c('why has ghana just'), q5 = c('tucked in the corner');
  const fc = p.id_('fc');
  const foc = (x, y, sc, at) => p.move(`#${fc}`, { scale: sc, x: r3((960 - x) * (sc - 1)), y: r3((540 - y) * (sc - 1)) }, at, 'heavy');
  foc(550, 360, 1.18, q1 + 0.6); foc(1430, 275, 1.22, q2 + 0.3); fx(p, 'swoop.wav', q2 + 0.2, -22); foc(1430, 555, 1.22, q3 + 0.3); fx(p, 'swoop.wav', q3 + 0.2, -22);
  foc(550, 735, 1.2, q4 + 0.3); fx(p, 'swoop.wav', q4 + 0.2, -22); foc(960, 540, 1, q5 - 0.1); foc(1550, 800, 1.3, q5 + 1.3); fx(p, 'swoop.wav', q5 + 1.2, -20);
  p.ev(c('what did they win')); p.ev(c('keep our factories')); p.ev(c('the same machine'));
  foc(520, 330, 1.3, c('biggest cocoa')); fx(p, 'sparkle.wav', c('biggest cocoa'), -18); foc(1450, 260, 1.32, c('most famous'));
  p.scene(aEnd, s.dur, `<div id="${fc}" class="wrap" style="transform-origin:0 0"><div class="hl" style="left:110px;top:96px;width:900px">${p.kicker('OUR LEAD', aEnd + 0.1)}</div>
    ${qcard(p, q1 - 0.15, { x: 110, y: 150, w: 880, h: 420, tag: 'TESHIE · 1879', q: 'How did a handful of beans from an island make a small colony the <i style="color:var(--red)">biggest cocoa grower on earth?</i>', rot: -1.5, lead: true, fs: 50 })}
    ${p.stamp('LEAD STORY', q1 + 0.5, { x: 520, y: 470, rot: -7, size: 50 })}
    ${qcard(p, q2, { x: 1040, y: 150, w: 780, h: 250, tag: '1937', q: 'Why did farmers refuse to sell a single bag — and <i style="color:var(--red)">what did they win?</i>', rot: 1.2 })}
    ${qcard(p, q3, { x: 1040, y: 430, w: 780, h: 250, tag: '32 YEARS', q: 'How do you sell a harvest <i style="color:var(--red)">before it is picked?</i>', rot: -1 })}
    ${qcard(p, q4, { x: 110, y: 610, w: 880, h: 250, tag: '1947 → 2025', q: 'Why has Ghana built for its gold the <i style="color:var(--red)">same machine</i> it built for cocoa?', rot: 1 })}
    ${qcard(p, q5, { x: 1290, y: 712, w: 520, h: 170, tag: 'WESTERN BORDER', q: 'Which way are the smugglers carrying cocoa <i style="color:var(--red)">this year?</i>', rot: -2, classified: true, fs: 28 })}
    ${st(p, 'ship-island', q1 + 1.6, { x: 150, y: 400, w: 170, rot: 6, life: 'sail', until: s.dur, sfx: SFX + '/ship.wav', db: -18 })}
    ${st(p, 'shop-shutter', q2 + 1.4, { x: 1700, y: 290, w: 120, rot: -5, life: 'sway', until: s.dur, sfx: SFX + '/shutter.wav', db: -18 })}
    ${st(p, 'cocoa-pod', q3 + 1.2, { x: 1700, y: 560, w: 120, rot: 8, life: 'bob', until: s.dur })}
    ${st(p, 'gold-refine', q4 + 1.5, { x: 830, y: 760, w: 180, rot: -4, life: 'pulse', until: s.dur, sfx: SFX + '/sparkle.wav', db: -16 })}
    ${st(p, 'smuggler-bike', q5 + 1.0, { x: 1090, y: 730, w: 170, rot: 4, life: 'jiggle', until: s.dur, sfx: SFX + '/bike-bell.wav', db: -16 })}
    ${st(p, 'factory', c('keep our factories'), { x: 1060, y: 570, w: 110, rot: -4, life: 'jiggle', until: s.dur, sfx: SFX + '/grind.wav', db: -20, len: 1.2 })}
    ${p.stamp('WHAT DID THEY WIN?', c('what did they win'), { x: 1300, y: 330, rot: -4, size: 26 })}</div>`, { enter: 'wipeL', drift: 0 });
  return p;
}

// ---------------------------------------------------------------------------
// headings for the non-segments: title + red underline, whoosh + paper slap; the Lead Story lands with a BOOM.
const heading = (key, title, sub = '') => () => {
  const s = SEGMENTS[key]; const p = new Part({ ...s }); p.mast = false;
  const id = p.id_('hd'), sid = p.id_('hs');
  p.tl.push(`tl.fromTo("#${id}", {yPercent:120}, {yPercent:0, duration:${SP.heavy}, ease:"sp-heavy"}, 0.12);`);
  if (sub) p.tl.push(`tl.fromTo("#${sid}", {yPercent:120}, {yPercent:0, duration:${SP.default}, ease:"sp-default"}, 0.55);`);
  p.ev(0.12); p.sound('whoosh-1.mp3', 0.0, -14); p.sound(SFX1 + '/paper-slap.wav', 0.35, -16);
  if (key === 'headlead') { p.sound(SFX1 + '/boom.wav', 0.1, -4); p.tl.push(`tl.to("#${id}", {scale:1.06, duration:0.08, ease:"none", repeat:3, yoyo:true, immediateRender:false}, 0.42);`); }
  p.scene(0, s.dur, `<div class="kente top" style="position:absolute;left:0;right:0;top:0;height:14px"></div>
    <div style="position:absolute;left:0;right:0;top:120px;display:flex;justify-content:center"><span class="mk"><span id="${id}" class="wd" style="display:inline-block;font-family:'Playfair Display',serif;font-weight:900;font-size:110px;letter-spacing:.02em;border-bottom:8px solid var(--red);padding-bottom:6px">${title}</span></span></div>
    ${sub ? `<div style="position:absolute;left:0;right:0;top:300px;display:flex;justify-content:center"><span class="mk"><span id="${sid}" class="wd" style="font-family:'Playfair Display',serif;font-style:italic;font-size:56px;color:var(--muted)">${sub}</span></span></div>` : ''}`, { enter: 'wipeU' });
  return p;
};
export const headlead = heading('headlead', 'LEAD STORY', '“Brown gold”');
export const headteam = heading('headteam', 'THE TEAM ASIDE');
export const headletters = heading('headletters', 'LETTERS PAGE');

// ---------------------------------------------------------------------------
// THE COLOPHON (COMBO3) — after the closing montage, in silence, one block at a time, then black.
const COLOPHON = [
  ['THE COLOPHON', ['Edition No. 2 · Price: ~50MB']],
  ['CORRECTIONS &amp; CLARIFICATIONS', ['None this edition.']],
  ['SOURCES &amp; FURTHER READING', ['Ministry of Finance, Press Briefing on Cocoa (February 2026).', 'Graphic Online · African Arguments · MyJoyOnline · Reuters (2026).', 'FAO Investment Centre, EU cocoa &amp; chocolate value chain study.', 'Global Nonviolent Action Database: Gold Coast cocoa farmers, 1937.']],
  ['THE MASTHEAD', ['<span class="dl"><b>Editor</b><i></i><b>Kofi</b></span>', '<span class="dl"><b>The Restless</b><i></i><b>Aba</b></span>', '<span class="dl"><b>The Combative</b><i></i><b>Kwame</b></span>', '<span class="dl"><b>The Ascendant</b><i></i><b>Baaba</b></span>', '<span class="dl"><b>Empty desk</b><i></i><b>To be announced</b></span>', 'No desks assigned. Every story belongs to everyone at The Nest.']],
  ['PRODUCTION', ['Written, Edited and Narrated by Joshua Horlortu', 'Theme Music by Gonje Group, Legon']],
  ['FINE PRINT', ['The Nest newsroom is a fictional device.', 'Printed at The Nest, 266 Sandpiper Loop, Onipa Enclave. © 2026 Gold Coast Palava']],
];
export function credits() {
  const s = SEGMENTS.credits; const p = new Part({ ...s }); p.mast = false;
  p.css.push(`.colo { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; text-align:center; }
    .colo .slot { position:absolute; left:0; right:0; top:50%; transform:translateY(-50%); display:flex; justify-content:center; overflow:hidden; padding:6px 0; }
    .colo .blk { width:900px; }
    .colo h4 { font-family:'IBM Plex Mono',monospace; font-weight:700; font-size:22px; letter-spacing:.26em; color:var(--red); margin-bottom:12px; }
    .colo p { font-family:'Playfair Display',serif; font-size:24px; line-height:1.45; color:var(--ink); text-transform:uppercase; letter-spacing:.06em; }
    .colo .dl { display:flex; align-items:baseline; gap:8px; width:480px; margin:0 auto; }
    .colo .dl b { font-weight:400; } .colo .dl i { flex:1; border-bottom:2px dotted rgba(26,22,18,.55); position:relative; top:-5px; }
    .colo .blur { position:absolute; inset:-30px; background:url(assets/papers-bg.jpg) center/cover; filter:blur(11px); opacity:.6; }`);
  const n = COLOPHON.length, span = (s.dur - 0.8) / n;
  const blocks = COLOPHON.map(([h, lines], i) => {
    const id = `colo${i}`, t0 = 0.05 + i * span, t1 = t0 + span - 0.12;
    p.tl.push(`tl.fromTo("#${id}", {yPercent:140}, {yPercent:0, duration:0.32, ease:"sp-snappy"}, ${r3(t0)});`);
    if (i < n - 1) p.tl.push(`tl.to("#${id}", {yPercent:-140, duration:0.18, ease:"power2.in", immediateRender:false}, ${r3(t1)});`);
    p.ev(t0);
    return `<div class="slot"><div id="${id}" class="blk"><h4>${h}</h4>${lines.map((l) => `<p>${l}</p>`).join('')}</div></div>`;
  }).join('');
  const fadeAt = s.dur - 0.8;
  p.tl.push(`tl.fromTo("#colo-black", {opacity:0}, {opacity:1, duration:0.6, ease:"power1.inOut"}, ${r3(fadeAt)});`);
  p.scene(0, s.dur, `<div class="blur"></div><div class="colo">${blocks}</div><div id="colo-black" style="position:absolute;inset:0;background:#000;opacity:0"></div>`, { enter: 'cut', drift: 0.02, bg: 'paper' });
  p.sfx = [];
  return p;
}

export { stack, head, away, nameCard, counter, card, mono, H, nestBed, pin, st, st1, fx, cs, make, RIGHT, STK, STK1, SFX, SFX1, DRAWN, PILOT, r3 };
export const BUILDERS = { cold, combo1: combo, nest, front, headlead, headteam, headletters, credits };
