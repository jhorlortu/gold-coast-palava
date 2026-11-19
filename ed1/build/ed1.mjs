// Gold Coast Palava — Edition 1: "Why is Ghana a powerful nation?"
// Sections follow the house style (gold-coast-palava-edit skill). Run with GCP_WORK=/home/user/gcp/ed1/work.
import fs from 'node:fs';
import path from 'node:path';
import { Part, cuer, SP } from '/home/user/gcp/build/lib.mjs';
import { banner, BANNER_CSS } from '/home/user/gcp/build/banner.mjs';
import { combo1 } from '/home/user/gcp/build/combo1.mjs';

const WORK = '/home/user/gcp/ed1/work';
const plan = JSON.parse(fs.readFileSync(path.join(WORK, 'timeline.json'), 'utf8'));
const P = Object.fromEntries(plan.parts.map((p) => [p.id, p]));
const ORDER = plan.parts.filter((p) => !p.id.includes('~'));
// A segment runs from its first part to the next top-level part in ORDER (stings / headings are their own parts)
const seg = (id, fromPart, label, toEnd = false) => {
  const i = ORDER.findIndex((p) => p.id === fromPart);
  const T0 = P[fromPart].T0, T1 = !toEnd && i + 1 < ORDER.length ? ORDER[i + 1].T0 : plan.total;
  const pieces = plan.parts.filter((p) => p.kind === 'vo' && p.T0 >= T0 - 1e-6 && p.T0 < T1 - 1e-6).map((p) => ({ vo_in: p.vo_in, vo_out: p.vo_out, local0: +(p.T0 - T0).toFixed(3) }));
  return { id, T0, dur: +(T1 - T0).toFixed(3), label, pieces };
};
export const SEGMENTS = {
  cold: seg('cold', 'cold-open', 'THE NEST · ONIPA'),
  combo1: seg('combo1', 'combo1', ''),
  nest: seg('nest', 'nest', 'THE NEST · THE PRICE'),
  front: seg('front', 'front-page', 'FRONT PAGE'),
  headlead: seg('headlead', 'head-lead', 'LEAD STORY'),
  lead: seg('lead', 'lead', 'LEAD STORY · THE ASANTE'),
  wire: seg('wire', 'wire', 'THE WIRE · KUMASI, 1900'),
  palava: seg('palava', 'palava', 'THE PALAVA DESK'),
  thennow: seg('thennow', 'then-now', 'THEN v NOW'),
  headteam: seg('headteam', 'head-team', 'THE TEAM ASIDE'),
  team: seg('team', 'team', 'THE TEAM ASIDE'),
  editor: seg('editor', 'editor', "EDITOR'S NOTE"),
  headletters: seg('headletters', 'head-letters', 'LETTERS PAGE'),
  letters: seg('letters', 'letters', 'LETTERS PAGE'),
  dispatch: seg('dispatch', 'dispatch', 'DISPATCH', true),
};
// the dispatch (with the closing montage) ends where the colophon begins; the colophon runs to the end
SEGMENTS.dispatch.dur = +(P.credits.T0 - SEGMENTS.dispatch.T0).toFixed(3);
SEGMENTS.credits = { id: 'credits', T0: P.credits.T0, dur: +(plan.total - P.credits.T0).toFixed(3), label: '', pieces: [] };
// the cold open starts at frame 0 (the voice comes in 0.4 s later)
{ const c0 = SEGMENTS.cold; const d = c0.T0; c0.T0 = 0; c0.dur = +(c0.dur + d).toFixed(3); c0.pieces = c0.pieces.map((q) => ({ ...q, local0: +(q.local0 + d).toFixed(3) })); }
const STK = '/home/user/gcp/ed1/media/stickers_cut';
const DRAWN = '/home/user/gcp/ed1/media/drawn';
const SFX = '/home/user/gcp/ed1/media/sfx';
const make = (key) => { const s = SEGMENTS[key]; return [new Part({ ...s }), cuer(s.pieces), s]; };
// sticker from the Edition 1 set, with a pop sound
const st = (p, name, at, o = {}) => p.icon(name, at, { dir: STK, sfx: o.sfx ?? SFX + '/pop-2.wav', ...o });
// play a sound from the Edition 1 SFX folder
const fx = (p, file, at, db = -16, len) => p.sfx.push({ file: path.join(SFX, file), T: +(p.T0 + at).toFixed(3), db, ...(len ? { len } : {}) });
const hl = (p, text, at, { size = 96, x = 150, y = 300, w = 1620, style = '' } = {}) => `<div class="hl" style="left:${x}px;top:${y}px;width:${w}px;${style}"><h1 style="font-size:${size}px">${p.words(p.id_('w'), text, at)}</h1></div>`;

// ---------------------------------------------------------------------------
// COLD OPEN — no music. Dawn over Onipa, the open newsroom, the sticky note, the question.
export function cold() {
  const [p, c, s] = make('cold');
  p.mast = true;
  const NEST = PILOT + '/final/nest-light.png';
  // the camera aims at a point of the 1920x1080 Nest picture
  const aim = (x, y, sc) => { const mx = (sc - 1) * 960 - 4, my = (sc - 1) * 540 - 4; return { scale: sc, x: Math.max(-mx, Math.min(mx, (960 - x) * sc)), y: Math.max(-my, Math.min(my, (540 - y) * sc)) }; };
  const pin = (txt, x, y, at, dx = 40, dy = -78) => { const id = p.id_('pin'); p.grow(id, at, { preset: 'snappy', dy: 20, from: 0.6 }); p.sound(SFX + '/pop-1.wav', at, -18);
    return `<div id="${id}" style="position:absolute;left:${x - 10}px;top:${y - 10}px"><div style="width:20px;height:20px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 7px rgba(201,150,47,.35)"></div><div style="position:absolute;left:${dx}px;top:${dy}px;white-space:nowrap;background:#FCF5E8;border:3px solid var(--ink);box-shadow:6px 7px 0 var(--ink);padding:8px 18px;font-family:'GCP Round',sans-serif;font-weight:700;font-size:28px">${txt}</div></div>`; };
  const dawn = (id, t0, t1, a0, a1) => { p.tl.push(`tl.fromTo("#${id}", {opacity:${a0}}, {opacity:${a1}, duration:${(t1 - t0).toFixed(2)}, ease:"sine.inOut"}, ${t0.toFixed(2)});`);
    return `<div id="${id}" style="position:absolute;inset:0;background:radial-gradient(ellipse at 62% 12%, rgba(255,196,120,.95), rgba(255,170,90,.35) 45%, rgba(255,170,90,0) 75%);mix-blend-mode:soft-light;opacity:${a0}"></div>`; };
  const card = (inner, x, y, w, at) => { const id = p.id_('cd'); if (at != null) p.grow(id, at - 0.1, { from: 0.8, dy: 30 }); return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;background:rgba(252,245,232,.95);border:4px solid var(--ink);box-shadow:10px 12px 0 var(--ink);padding:24px 30px">${inner}</div>`; };
  // A — the Nest at dawn, moving: the camera rises over the desks to the windows as the light comes up
  const aEnd = c('which is the great') - 0.1;
  p.broll(0, aEnd, PILOT + '/broll/nest-windows.mp4', { rate: 0.95, dim: 0.12, opts: { enter: 'cut' }, overlay: `${dawn(p.id_('dw'), 0, aEnd, 0.1, 0.75)}
    ${card(`<div class="mono" style="font-size:24px;font-weight:700;letter-spacing:.2em;color:var(--red)">${p.typed('DAWN · ONIPA ENCLAVE', 0.4, { cps: 18 })}</div><h1 style="font-family:'Playfair Display',serif;font-weight:900;font-size:62px;line-height:1.05;margin-top:10px">${p.words(p.id_('bl'), 'Before the light has made up its mind about *Onipa*…', 0.6, { stagger: 0.06 })}</h1>`, 110, 130, 900)}
    <div style="position:absolute;left:110px;top:520px">${p.chip('THE NEST · 266 SANDPIPER LOOP', c('the nest is'), { kind: 'chip red' })}</div>
    <div style="position:absolute;left:110px;top:610px">${p.chip('…already awake', c('already awake'), { kind: 'chip light' })}</div>` });
  fx(p, 'wind.wav', 0, -26, 5); p.sound('ambience-1.mp3', 0, -18, 12); p.sound('ambience-2.mp3', 11.5, -18, 12); p.sound('ambience-1.mp3', 23, -20, 11);
  // B — the open newsroom: the camera travels to each part of the room as it is named
  const bEnd = c('and this morning') - 0.1;
  const cam = p.id_('nst');
  const k1 = c('open newsroom'), k2 = c('nobody hides'), k3 = c('every desk'), k4 = c('working harder'), k5 = c('in plain view');
  p.move(`#${cam}`, aim(930, 470, 1.5), k1 - 0.3, 'heavy');
  p.move(`#${cam}`, aim(520, 430, 1.65), k2 - 0.2, 'heavy');
  p.move(`#${cam}`, { scale: 1.06, x: 0, y: 0 }, k3 - 0.2, 'heavy');
  p.move(`#${cam}`, aim(1320, 440, 1.8), k4 - 0.3, 'heavy');
  p.move(`#${cam}`, aim(760, 720, 1.5), k5 - 0.3, 'heavy');
  p.scene(aEnd, bEnd, `<div id="${cam}" class="wrap" style="transform-origin:960px 540px"><div class="cover" style="background-image:url(${p.asset(NEST)})"></div>${dawn(p.id_('dw'), aEnd, bEnd, 0.75, 0.9)}
      ${pin('an open newsroom', 930, 470, k1 + 0.1)}${pin('no door to hide behind', 520, 430, k2 + 0.1, -330, -90)}
      ${pin('the desks meant to work harder', 1320, 440, k4 + 0.15, -500, 30)}${pin('the editor’s desk', 760, 720, k5 + 0.15, 40, 30)}</div>
    ${card(`<div class="mono" style="font-size:22px;font-weight:700;letter-spacing:.2em;color:var(--red)">THE NEST</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:44px;line-height:1.08;margin-top:6px">${p.words(p.id_('pv'), 'Every desk in *plain view.*', k3, { stagger: 0.07 })}</div>`, 110, 120, 620, k3)}`, { bg: 'none', enter: 'wipeL', drift: 0 });
  // C — this morning: push into the laptop on the editor's desk, where the sticky note waits
  const q = c('why is ghana');
  const cam2 = p.id_('nst');
  p.move(`#${cam2}`, aim(1200, 690, 2.3), bEnd + 0.1, 'heavy');
  p.scene(bEnd, s.dur, `<div id="${cam2}" class="wrap" style="transform-origin:960px 540px"><div class="cover" style="background-image:url(${p.asset(NEST)})"></div>${dawn(p.id_('dw'), bEnd, s.dur, 0.9, 0.9)}</div>
    ${card(`<div class="mono" style="font-size:22px;font-weight:700;letter-spacing:.2em;color:var(--red)">THIS MORNING, ONE QUESTION</div><div class="sub" style="font-size:40px;margin-top:8px">${p.words(p.id_('hm'), 'The whole room is *humming*…', bEnd + 0.3, { stagger: 0.07 })}</div>`, 110, 110, 700)}
    <div style="position:absolute;left:110px;top:330px">${p.chip('written in pen, pressed so hard it nearly tore', c('written on a sticky note'), { kind: 'chip light' })}</div>
    ${st(p, 'sticky-note', c('sticky note') - 0.1, { x: 1080, y: 150, w: 640, rot: -3, life: 'sway', until: s.dur, sfx: SFX + '/paper-slap.wav', db: -14 })}
    ${card(`<h1 style="font-family:'Playfair Display',serif;font-weight:900;font-size:104px;line-height:1.02">${p.words(p.id_('q'), 'Why is Ghana a *powerful nation?*', q, { stagger: 0.12 })}</h1>`, 110, 560, 960, q)}`, { bg: 'none', enter: 'iris', drift: 0 });
  fx(p, 'knock.wav', c('pressed so hard'), -14);
  fx(p, 'heartbeat.wav', q + 1.2, -12);
  return p;
}

// ---------------------------------------------------------------------------
export function combo() { const p = combo1(SEGMENTS.combo1); return p; }

// ---------------------------------------------------------------------------
// THE NEST — Kofi introduces himself and stamps the price: about 70 MB.
export function nest() {
  const [p, c, s] = make('nest');
  const aEnd = c('before the headlines') - 0.1;
  const desk = p.id_('dk');
  p.tl.push(`tl.fromTo("#${desk}", {scale:1.35}, {scale:1.55, duration:${(aEnd + 0.5).toFixed(2)}, ease:"none"}, 0);`);
  p.scene(0, aEnd, `<div id="${desk}" class="cover" style="background-image:url(${p.asset(PILOT + '/final/nest-light.png')});transform-origin:40% 70%"></div><div style="position:absolute;inset:0;background:linear-gradient(90deg, rgba(243,235,215,.97) 0%, rgba(243,235,215,.93) 52%, rgba(243,235,215,.25) 78%, rgba(243,235,215,0) 100%)"></div>
    <div style="position:absolute;right:70px;top:820px;background:#FCF5E8;border:3px solid var(--ink);box-shadow:6px 7px 0 var(--ink);padding:8px 18px;font-family:'GCP Round',sans-serif;font-weight:700;font-size:26px">the editor’s desk · The Nest</div>
    ${hl(p, 'Chale, how the thing dey go?', 0.15, { size: 120, y: 300 })}
    <div class="hl" style="left:150px;top:560px;width:1500px"><div class="sub" style="font-size:56px">${p.words(p.id_('k'), 'I am *Kofi*, the Editor.', c('i am kofi'), { stagger: 0.08 })}</div></div>
    ${p.chip('THE GOLD COAST PALAVA', c('this is the gold coast'), { kind: 'chip red', x: 150, y: 700 })}
    ${p.stamp('BEFORE THE HEADLINES: THE PRICE', c('before the headlines') - 0.2, { x: 160, y: 900, rot: -3, size: 40 })}
    ${p.chip('every paper has a price', c('every paper has one'), { kind: 'chip light', x: 700, y: 700 })}
    ${p.chip('…we all no dey hold', c('we all know'), { kind: 'chip gold', x: 150, y: 810 })}`, { enter: 'cut' });
  const m70 = c('about 70');
  const box = p.id_('pb');
  p.grow(box, m70 - 0.25, { rot: -1.5, preset: 'heavy', from: 0.7, dy: 40 });
  fx(p, 'coins.wav', m70 + 0.2, -16);
  const stamp = p.stamp('PAID IN DATA', c('paid in data'), { x: 0, y: 0, rot: -4, size: 46 }).replace('left:0px;top:0px;', 'position:relative;left:auto;top:auto;');
  p.scene(aEnd, s.dur, `
    <div style="position:absolute;left:0;right:0;top:150px;display:flex;justify-content:center">${p.kicker('THE PRICE OF THIS EDITION', aEnd + 0.15)}</div>
    <div style="position:absolute;left:0;right:0;top:230px;display:flex;justify-content:center">
      <div id="${box}" style="border:8px solid var(--ink);padding:20px 60px 34px;background:#FCF5E8;box-shadow:16px 18px 0 var(--ink)">
        <div class="mono" style="font-size:28px;font-weight:700;letter-spacing:.3em;color:var(--red)">PRICE</div>
        <div style="font-family:'Playfair Display',serif;font-weight:900;font-size:230px;line-height:1;white-space:nowrap">${p.words('price', '≈ 70 MB', m70 + 0.05, { stagger: 0.1 })}</div></div></div>
    ${st(p, 'data-phone', aEnd + 0.5, { x: 1430, y: 560, w: 360, rot: 6, life: 'bob', until: s.dur })}
    ${p.chip('every paper has a price', c('every paper has one'), { kind: 'chip light', x: 180, y: 610 })}
    ${p.chip('a fair fee', c('a fair fee'), { kind: 'chip gold', x: 700, y: 612 })}
    <div style="position:absolute;left:0;right:0;top:700px;display:flex;justify-content:center">${stamp}</div>
    ${p.chip('a story 77 years in the making', c('77 years'), { kind: 'chip gold', x: 180, y: 820 })}
    ${p.chip('…an empire much longer to forgive', c('an empire much longer'), { kind: 'chip red', x: 180, y: 920 })}
    ${p.chip('soak the story well, make e sweet you', c('soak the story'), { kind: 'chip light', x: 1000, y: 900 })}`, { enter: 'wipeU' });
  return p;
}


// ---------------------------------------------------------------------------
// FRONT PAGE — every headline is a question; four cards drop as they are asked, each with its own picture.
const qcard = (p, at, { x, y, w = 760, desk, q, rot = 0 }) => {
  const id = p.id_('qc');
  p.tl.push(`tl.fromTo("#${id}", {opacity:0}, {opacity:1, duration:0.08, ease:"none"}, ${at.toFixed(3)});`);
  p.tl.push(`tl.fromTo("#${id}", {y:-340, scale:1.2, rotation:${rot + (p.uid % 2 ? 16 : -16)}}, {y:0, scale:1, rotation:${rot}, duration:${SP.default}, ease:"sp-default"}, ${at.toFixed(3)});`);
  p.ev(at); p.sound('page-turn-3.mp3', at + 0.1, -19); p.sound('syn-thud.wav', at + 0.32, -17);
  return `<div id="${id}" class="card" style="left:${x}px;top:${y}px;width:${w}px;height:230px"><div class="lbl"><span>FRONT PAGE</span><b>${desk}</b></div><h3 style="font-size:40px">${q}</h3></div>`;
};
export function front() {
  const [p, c, s] = make('front');
  const aEnd = c('our lead this edition') - 0.1;
  p.scene(0, aEnd, `${hl(p, 'Page one is always a *mixed bag.*', 0.2, { size: 104, y: 260 })}
    ${p.chip('every headline is a question', c('every headline is a question'), { kind: 'chip red', x: 150, y: 520 })}
    ${p.chip('the answers live on the inside pages', c('the answers live'), { kind: 'chip light', x: 150, y: 620 })}
    ${p.stamp('SUSPENSE', c('firm believer in suspense'), { x: 1180, y: 600, rot: -8, size: 72 })}
    ${st(p, 'folded-paper', 1.2, { x: 1500, y: 200, w: 280, rot: 5, life: 'bob', until: aEnd, sfx: SFX + '/paper-slap.wav' })}
    ${p.chip('so make we start', c('so make we start'), { kind: 'chip gold', x: 150, y: 420 })}`, { enter: 'cut' });
  const q1 = c('what happened on the'), q2 = c('how did 50'), q3 = c("why did a governor's"), q4 = c('what object did');
  const ol = p.id_('ol');
  p.tl.push(`tl.to("#${ol}", {y:-900, duration:0.55, ease:"power2.in", immediateRender:false}, ${(q1 - 0.55).toFixed(3)});`); p.ev(q1 - 0.55);
  p.scene(aEnd, s.dur, `<div id="${ol}" class="hl" style="left:0;top:400px;width:1920px;text-align:center"><h1 style="font-size:110px">${p.words(p.id_('olw'), 'Our lead *this edition…*', aEnd + 0.2, { stagger: 0.08 })}</h1></div>
    <div class="hl" style="left:110px;top:110px;width:900px">${p.kicker('OUR LEAD THIS EDITION', aEnd + 0.1)}</div>
    ${qcard(p, q1, { x: 110, y: 180, w: 780, desk: '22 JAN 1824', q: 'Ten thousand warriors — and the reply was a <i style="color:var(--red)">brass band?</i>', rot: -2 })}
    ${qcard(p, q2, { x: 1010, y: 180, w: 780, desk: '1874 → 1896', q: 'How did 50,000 ounces of gold become an <i style="color:var(--red)">invasion?</i>', rot: 1.5 })}
    ${qcard(p, q3, { x: 110, y: 610, w: 780, desk: 'MARCH 1900', q: 'A complaint about a <i style="color:var(--red)">chair</i> set a country on fire?', rot: 1 })}
    ${qcard(p, q4, { x: 1010, y: 610, w: 780, desk: 'CLASSIFIED', q: 'What object did an empire dig for — and <i style="color:var(--red)">never hold?</i>', rot: -1.5 })}
    ${st(p, 'trumpet', q1 + 1.6, { dir: PILOT + '/icons/cut', x: 760, y: 330, w: 190, rot: 8, life: 'jiggle', until: s.dur, sfx: PILOT + '/sfx/syn-boop.wav' })}
    ${st(p, 'gold-dust', q2 + 1.4, { x: 1660, y: 340, w: 200, rot: -6, life: 'pulse', until: s.dur, sfx: SFX + '/coins.wav' })}
    ${st(p, 'awning-chair', q3 + 1.4, { x: 770, y: 760, w: 180, rot: 6, life: 'sway', until: s.dur, sfx: SFX + '/knock.wav' })}
    ${st(p, 'golden-stool-sky', q4 + 1.6, { x: 1660, y: 760, w: 210, rot: 4, life: 'float', until: s.dur, sfx: SFX + '/bell.wav' })}
    ${p.chip('a British governor vs 10,000 warriors', c('asante warriors'), { kind: 'chip red', x: 150, y: 450 })}
    ${p.chip('promised 1874 → the excuse, 22 years later', c('22 years later'), { kind: 'chip gold', x: 1050, y: 450 })}
    ${p.chip('a country on fire', c('set a country on fire'), { kind: 'chip red', x: 150, y: 880 })}
    ${p.chip('dug for under village huts', c('dig for under'), { kind: 'chip light', x: 1050, y: 880 })}`);
  return p;
}

// ---------------------------------------------------------------------------
// helpers for the history sections
const REAL = '/home/user/gcp/ed1/media/real', PILOT = '/home/user/gcp/project/media';
const ENGRAVINGS = new Set(['amoaful', 'burning-coomassie', 'mafeking', 'prempeh-submission', 'forest-fight-1900', 'congreve', 'map-ashanti-1900', 'kumasi-1900-03-28']);
// a drawn version of a real image if we have it (photos/paintings are inked; engravings are used as they are)
const img = (key) => {
  for (const f of [path.join(DRAWN, key + '.jpg'), path.join(REAL, key + '.jpg'), path.join(REAL, key + '.png')]) if (fs.existsSync(f)) return f;
  return null;
};
// tries several transcript spellings for one cue
const cs = (c, ...qs) => { for (const q of qs) { try { return c(q); } catch {} } throw new Error('no cue: ' + qs.join(' | ')); };
// a name card (for people with no authentic portrait) — slides in from the left on a red bar
const nameCard = (p, at, { x = 110, y = 640, role, name, note = '' }) => {
  const id = p.id_('nm');
  p.tl.push(`tl.fromTo("#${id}", {xPercent:-120}, {xPercent:0, duration:${SP.heavy}, ease:"sp-heavy"}, ${at.toFixed(3)});`); p.ev(at);
  p.sound(SFX + '/whip.wav', at, -19);
  return `<div style="position:absolute;left:0;top:${y}px;overflow:hidden;padding-right:40px"><div id="${id}" style="margin-left:${x}px;background:#FCF5E8;padding:20px 34px;border-left:12px solid var(--red);box-shadow:10px 12px 0 rgba(26,22,18,.85)"><div class="mono" style="font-size:22px;letter-spacing:.2em;color:var(--red);font-weight:700">${role}</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:56px;line-height:1.05">${name}</div>${note ? `<div class="mono" style="font-size:20px;margin-top:6px;color:var(--muted)">${note}</div>` : ''}</div></div>`;
};
// a portrait print (drawn) if available, else the name card
const portrait = (p, key, at, o) => { const f = img(key); return f ? p.print(f, at, { x: o.x, y: o.y, w: o.w || 420, rot: o.rot || 2, caption: o.caption || '' }) : ''; };
// counter that rolls up to a number
const counter = (p, at, to, { dur = 1.4, size = 200, color = 'var(--ink)', suffix = '' } = {}) => {
  const id = p.id_('ct');
  p.tl.push(`(function(){var o={v:0};tl.to(o,{v:${to},duration:${dur},ease:"power2.out",onUpdate:function(){var e=document.getElementById("${id}");if(e)e.textContent=Math.round(o.v).toLocaleString("en-GB")+"${suffix}";}},${at.toFixed(3)});tl.set({}, {onComplete:function(){}}, ${(at - 0.01).toFixed(3)});})();`);
  p.ev(at); p.ev(at + dur);
  p.sound(SFX + '/coins.wav', at + dur - 0.2, -22);
  return `<span id="${id}" style="font-family:'Playfair Display',serif;font-weight:900;font-size:${size}px;color:${color}">0${suffix}</span>`;
};

// ---------------------------------------------------------------------------
// Layout discipline for the history sections: headline top-left (≤ 940 px wide), chips stacked one per line in the
// left column, the picture / sticker in the right column, one stamp per scene at a fixed slot. Nothing overlaps.
const COLX = 150, COLY = 400, PITCH = 92;
const stack = (p, items, { x = COLX, y = COLY, pitch = PITCH } = {}) => items.filter(Boolean).map(([t, at, kind = 'chip light'], i) => p.chip(t, at, { kind, x, y: y + i * pitch })).join('');
const head = (p, kick, kat, text, tat, { size = 80, w = 940 } = {}) => `<div class="hl" style="left:150px;top:140px;width:${w}px">${p.kicker(kick, kat)}<h1 style="font-size:${size}px">${p.words(p.id_('h'), text, tat, { stagger: 0.06 })}</h1></div>`;
const RIGHT = { x: 1150, y: 170, w: 620 };
// wrap html so it can be swished out of the way (up and off) when something new takes its place
const away = (p, html, t, { y = -1300, rot = -10, x = 0 } = {}) => { const id = p.id_('aw');
  p.tl.push(`tl.to("#${id}", {y:${y}, x:${x}, rotation:${rot}, duration:0.55, ease:"power3.in", immediateRender:false}, ${t.toFixed(3)});`); p.ev(t); p.sound('whoosh-1.mp3', t, -20);
  return `<div id="${id}" style="position:absolute;inset:0;pointer-events:none">${html}</div>`; };
// a line that holds the screen while the voice sets up the scene, then flies away before the scene's headline lands
const pre = (p, text, at, until, { size = 72, w = 940 } = {}) => { const id = p.id_('pre');
  p.tl.push(`tl.to("#${id}", {y:-900, duration:0.6, ease:"power2.in", immediateRender:false}, ${(until - 0.65).toFixed(3)});`); p.ev(until - 0.65); p.sound('whoosh-2.mp3', until - 0.65, -22);
  return `<div id="${id}" class="hl" style="left:150px;top:205px;width:${w}px"><h1 style="font-size:${size}px">${p.words(p.id_('pw'), text, at, { stagger: 0.06 })}</h1></div>`; };
const counterG = (p, at, to, { size = 170, color = 'var(--ink)', suffix = '' } = {}) => {
  const id = p.id_('ct');
  p.tl.push(`tl.fromTo("#${id}", {innerText:0}, {innerText:${to}, duration:1.4, ease:"power2.out", snap:{innerText:1}}, ${at.toFixed(3)});`);
  p.ev(at); p.ev(at + 1.4); p.sound(SFX + '/coins.wav', at + 1.2, -22);
  return `<span style="font-family:'Playfair Display',serif;font-weight:900;font-size:${size}px;color:${color}"><span id="${id}">0</span>${suffix}</span>`;
};

const BOOK = '/home/user/gcp/ed1/media/book/manning-cover.jpg';
const bookCover = (p, at) => fs.existsSync(BOOK)
  ? p.print(BOOK, at, { x: 1380, y: 150, w: 380, rot: 3, caption: 'Pen & Sword, 2021' })
  : (() => { const id = p.id_('bk'); p.grow(id, at, { rot: 3 }); return `<div id="${id}" style="position:absolute;left:1380px;top:160px;width:380px;height:560px;background:#2B2A26;color:#F3EBD7;padding:40px 30px;box-shadow:0 40px 70px -24px rgba(60,40,10,.5);border-left:14px solid #1A1612"><div class="mono" style="font-size:18px;letter-spacing:.2em;color:#C8962F">STEPHEN MANNING</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:42px;line-height:1.05;margin-top:24px">Britain at War with the Asante Nation 1823–1900</div><div style="font-family:'Playfair Display',serif;font-style:italic;font-size:28px;margin-top:18px;color:#E4C98B">‘The White Man’s Grave’</div><div class="mono" style="position:absolute;bottom:30px;left:30px;font-size:16px;letter-spacing:.2em">PEN &amp; SWORD</div></div>`; })();

// LEAD STORY — Nsamankow; then why Ghana is powerful: the coast, the forest people, the symbol, the logistics, the sound;
// Dodowa; Wolseley and the debt that became a doorway; Prempeh's exile.
export function lead() {
  const [p, c, s] = make('lead');
  const b = (...q) => cs(c, ...q);
  const cut = [0, b('that was the battle'), b('stephen manning'), b('but to see why ghana'), b('elmina castle'), b('behind that shoreline'),
    b('the first thing a junior'), b('the priest'), b('called a golden stool', 'golden stool down'), b('ntim', 'beaten at'), b('the second ingredient'),
    b('ant column'), b('medical corps'), b('the third belongs'), b('ordered his band'), b('musket fire'), b('while in kumasi'),
    b('power is not invincibility'), b('nana'), b('a lesser nation'), b('and in 1874', 'in 1874'), b('dashed for'), b('59 in every'), b('the treaty'),
    b('in january 1896', 'january 1896'), b('pushed into a boat', 'into a boat'), b('and manning reads', "chamberlain's aim"), s.dur].map((t, i) => i ? t - 0.1 : 0);
  const sc = (i, html, o = {}) => p.scene(cut[i], cut[i + 1], html, o);
  // 0 — the question recalled
  sc(0, `${head(p, 'THE QUESTION AT THE TOP OF PAGE ONE', 0.1, 'Do you remember the *question?*', 0.3, { size: 92 })}
    ${stack(p, [['a governor vs 10,000 warriors', b('about a governor')], ['…and the reply: a brass band', b('with a brass band'), 'chip gold']])}
    ${st(p, 'trumpet', b('with a brass band'), { dir: PILOT + '/icons/cut', x: 1250, y: 220, w: 420, rot: -4, life: 'jiggle', until: cut[1], sfx: PILOT + '/sfx/syn-boop.wav' })}`, { enter: 'cut' });
  // 1 — Nsamankow and McCarthy
  sc(1, `${head(p, 'THE BATTLE OF NSAMANKOW', cut[1] + 0.1, 'The Battle of *Nsamankow.*', cut[1] + 0.25, { size: 96, w: 900 })}
    ${stack(p, [['22 JANUARY 1824', b('the 22nd of january', '22nd'), 'chip red'], ['beside the Bonsa River', b('beside the')]], { y: 440 })}
    ${nameCard(p, b('sir charles'), { y: 640, role: 'BRITISH GOVERNOR · KILLED IN BATTLE', name: 'Sir Charles McCarthy' })}
    ${p.print(PILOT + '/final/battle-light.png', b('killed along with') - 0.6, { ...RIGHT, rot: 3, caption: 'Nsamankow, 22 January 1824' })}`);
  fx(p, 'heartbeat.wav', b('killed along with'), -16);
  // 2 — the reference book: prestige, power, reach
  sc(2, `${head(p, 'OUR REFERENCE MATERIAL', cut[2] + 0.1, 'Stephen Manning, *Britain at War with the Asante Nation, 1823–1900*', cut[2] + 0.25, { size: 64, w: 1100 })}
    ${stack(p, [['“The White Man’s Grave”', b("the white man's grave", 'white man'), 'chip red']], { y: 470 })}
    ${p.stamp('THE HIGH POINT OF ASANTE PRESTIGE · POWER · REACH', b('high point of asante'), { x: 150, y: 790, rot: -3, size: 40 })}
    ${bookCover(p, cut[2] + 0.3)}`);
  // 3 — the gold coast and its forts
  sc(3, `${pre(p, 'To see why Ghana is *powerful*, see what stood behind that day.', cut[3] + 0.3, b('a coastline so rich'))}
    ${st(p, 'golden-stool-sky', cut[3] + 1.2, { x: 1300, y: 640, w: 300, rot: 4, life: 'float', until: b('a coastline so rich') - 0.1, sfx: SFX + '/bell.wav', db: -20 })}
    ${head(p, 'WHAT STOOD BEHIND THAT DAY', cut[3] + 0.1, 'A coast so rich they named it after its *gold.*', b('a coastline so rich'), { size: 80 })}
    <div style="position:absolute;left:150px;top:480px;display:flex;align-items:baseline;gap:26px">${counterG(p, b('roughly 110', '110 european'), 110, { size: 150 })}<span class="mono" style="font-size:28px;font-weight:700">EUROPEAN FORTS — ALL OF WEST AFRICA</span></div>
    <div style="position:absolute;left:150px;top:680px;display:flex;align-items:baseline;gap:26px">${counterG(p, b('about 100 stood', 'about 100'), 100, { size: 150, color: 'var(--red)' })}<span class="mono" style="font-size:28px;font-weight:700;color:var(--red)">ON THIS ONE STRETCH OF COAST</span></div>
    ${st(p, 'gold-dust', b('named it after its gold') + 0.2, { x: 1280, y: 220, w: 460, rot: 5, life: 'pulse', until: cut[4], sfx: SFX + '/coins.wav' })}`);
  // 4 — Elmina, 1482
  sc(4, `${head(p, 'ELMINA CASTLE', cut[4] + 0.1, 'The oldest European building in *tropical Africa.*', cut[4] + 0.3, { size: 76 })}
    ${stack(p, [['raised by the Portuguese, 1482', b('raised by the portuguese', 'by the portuguese'), 'chip gold']], { y: 470 })}
    ${p.print(img('elmina'), cut[4] + 0.2, { ...RIGHT, rot: 2, caption: 'Elmina Castle, Ghana' })}
    ${p.stamp('STILL STANDING', b('is still the oldest', 'still the oldest'), { x: 150, y: 600, rot: -5, size: 60 })}`);
  fx(p, 'wind.wav', cut[4], -30, 4);
  // 5 — the forest people and the red clay
  sc(5, `${head(p, 'IN A FOREST EUROPEANS DARED NOT ENTER', cut[5] + 0.1, 'A people named for the *red clay.*', b('taken their name', 'the red clay'), { size: 84 })}
    ${stack(p, [['not entered by Europeans until the 1800s', b('did not dare', 'until the 19th')], ['“asan” — red clay', b('asan'), 'chip red'], ['paid in tribute to the Denkyira', b('tribute to the')], ['“asan-tefo” — the clay diggers', b('the asantefo', 'clay diggers'), 'chip gold']])}
    ${st(p, 'red-clay', cut[5] + 0.4, { x: 1130, y: 190, w: 620, rot: 3, life: 'bob', until: cut[6], sfx: SFX + '/knock.wav' })}
    ${p.stamp("NOBODY'S TRIBUTARY AGAIN", b('tributary again', 'decided that they'), { x: 150, y: 900, rot: -4, size: 50 })}`);
  // 6 — a good symbol
  sc(6, `${head(p, 'INGREDIENT 1 · THE SYMBOL', cut[6] + 0.1, 'A good symbol can carry more weight than a *building.*', b('a good symbol'), { size: 78 })}
    ${stack(p, [['from a junior high design class', cut[6] + 0.5], ['long before I knew why it mattered', b('long before i understood', 'why it mattered')], ['the proof sits at the centre of this story', b('the proof sits'), 'chip gold']], { y: 450 })}
    ${st(p, 'design-class', cut[6] + 0.4, { x: 1250, y: 220, w: 480, rot: 6, life: 'bob', until: cut[7], sfx: SFX + '/pop-1.wav' })}`);
  // 7 — Okomfo Anokye, Osei Tutu, 24 states
  sc(7, `${head(p, 'AROUND 1701', cut[7] + 0.1, 'Twenty-four proud and quarrelsome *states.*', b('24 proud'), { size: 76 })}
    ${nameCard(p, b('the priest'), { y: 400, role: 'THE PRIEST', name: 'Okomfo Anokye' })}
    ${nameCard(p, b('the first king'), { y: 570, role: 'THE FIRST KING', name: 'Osei Tutu' })}
    ${st(p, 'twenty-four-states', b('24 proud'), { x: 1200, y: 220, w: 540, rot: -3, life: 'spin', until: cut[8], sfx: SFX + '/pop-3.wav' })}
    ${p.stamp('NEVER ONE NATION BY A LAW', b('because of a law', 'of a law'), { x: 150, y: 820, rot: -4, size: 46 })}`);
  // 8 — the Golden Stool from the sky
  sc(8, `${head(p, 'ACCORDING TO ASANTE TRADITION', cut[8] + 0.05, 'A Golden Stool from the *sky.*', cut[8] + 0.2, { size: 92 })}
    ${stack(p, [['onto the lap of Osei Tutu', b('onto the lap', 'the lap of')], ['it held the spirit of the whole nation', b('the spirit of'), 'chip gold']], { y: 450 })}
    ${st(p, 'golden-stool-sky', cut[8] + 0.1, { x: 1150, y: 150, w: 640, rot: 0, life: 'float', until: cut[9], sfx: SFX + '/bell.wav', db: -12 })}`);
  fx(p, 'glass.wav', cut[8] + 0.7, -18);
  // 9 — Feyiase; Asanteman; a spirit that could not be taxed, bribed or shot
  sc(9, `${head(p, 'FEYIASE · 1701', cut[9] + 0.1, '*Asanteman* steps onto the map.', b('onto the map'), { size: 84 })}
    ${stack(p, [['Ntim Gyakari of Denkyira — beaten', b('ntim', 'beaten at')], ['a spirit that could not be…', b('a spirit that'), 'chip gold']])}
    ${away(p, p.print('/home/user/gcp/ed1/media/scenes/ntim-gyakari.png', cut[9] + 0.15, { x: 1150, y: 140, w: 560, rot: -2, caption: 'Ntim Gyakari, king of Denkyira (illustration)' }), b('onto the map') - 0.1)}
    ${p.print(img('asante-flag'), b('onto the map') + 0.3, { x: 1200, y: 200, w: 560, rot: 3, caption: 'The Asante flag' })}
    ${p.stamp('TAXED · BRIBED · OR SHOT', b('could not be taxed', 'not be taxed'), { x: 150, y: 640, rot: -4, size: 46 })}`);
  // 10 — logistics: the quota army
  sc(10, `${head(p, 'INGREDIENT 2 · THE LOGISTICS', cut[10] + 0.1, 'A design is only as good as the *logistics* beneath it.', b('a design is only'), { size: 72 })}
    ${stack(p, [['technical drawing & building construction', b('technical drawing')], ['each state sends a share of its men', b('each state sending', 'a share of its men')], ['the rest stay home to farm', b('stayed home to farm', 'the rest stayed'), 'chip gold'], ['so the nation never starves itself', b('without starving'), 'chip red']], { y: 430 })}
    ${st(p, 'tech-drawing', cut[10] + 0.4, { x: 1540, y: 120, w: 240, rot: -5, life: 'bob', until: cut[11], sfx: SFX + '/pop-1.wav' })}
    ${st(p, 'quota-army', b('the asante army was', 'quota system'), { x: 1100, y: 380, w: 620, rot: 2, life: 'bob', until: cut[11], sfx: SFX + '/pop-2.wav' })}`);
  // 11 — the ant column: cartoon soldier-ants march along the line, unit by unit as each is named, legs walking
  const units = [['scouts', 'SCOUTS'], ['an advance guard', 'ADVANCE GUARD'], ['a main body', 'MAIN BODY · COMMANDER'], ['two wings', 'TWO WINGS'], ['and a home guard', 'HOME GUARD']];
  const uAt = units.map(([q, t]) => b(q, t.toLowerCase()));
  const antSVG = (id, { cmd = false } = {}) => `<svg viewBox="-6 -40 132 112" width="100%" height="100%" style="overflow:visible">
      ${cmd ? `<g><path d="M40 -6 Q62 -40 84 -6 Z" fill="#A4241B" stroke="#1A1612" stroke-width="3"/><line x1="62" y1="-6" x2="60" y2="30" stroke="#1A1612" stroke-width="3"/><path d="M42 -6 q5 6 10 0 q5 6 10 0 q5 6 10 0 q5 6 10 0" fill="none" stroke="#C8962F" stroke-width="3"/></g>` : `<line x1="48" y1="34" x2="92" y2="2" stroke="#5A3A1E" stroke-width="5" stroke-linecap="round"/><line x1="88" y1="5" x2="96" y2="-1" stroke="#1A1612" stroke-width="4"/>`}
      <g id="${id}-la" style="transform-origin:56px 44px">${[[44, 44, 30, 66], [58, 46, 60, 70], [66, 44, 88, 66]].map(([x1, y1, x2, y2]) => `<path d="M${x1} ${y1} L${(x1 + x2) / 2} ${y2 - 12} L${x2} ${y2}" fill="none" stroke="#1A1612" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</g>
      <g id="${id}-lb" style="transform-origin:56px 44px">${[[46, 44, 38, 68], [58, 46, 52, 70], [64, 44, 76, 68]].map(([x1, y1, x2, y2]) => `<path d="M${x1} ${y1} L${(x1 + x2) / 2 + 4} ${y2 - 14} L${x2} ${y2}" fill="none" stroke="#3A2416" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</g>
      <ellipse cx="24" cy="40" rx="24" ry="17" fill="#4A2C18" stroke="#1A1612" stroke-width="3"/>
      <path d="M8 34 q16 -6 32 0 M6 42 q18 -5 36 0" fill="none" stroke="#6E4527" stroke-width="3"/>
      <ellipse cx="56" cy="38" rx="13" ry="10" fill="#5A3A1E" stroke="#1A1612" stroke-width="3"/>
      <rect x="48" y="30" width="16" height="7" rx="2" fill="${cmd ? '#A4241B' : '#C8962F'}" stroke="#1A1612" stroke-width="2"/><rect x="53" y="30" width="3" height="7" fill="#2E6B3A"/>
      <circle cx="82" cy="30" r="14" fill="#5A3A1E" stroke="#1A1612" stroke-width="3"/>
      <circle cx="86" cy="26" r="5" fill="#FCF5E8" stroke="#1A1612" stroke-width="2"/><circle cx="88" cy="26" r="2.4" fill="#1A1612"/>
      <path d="M80 18 Q78 2 66 -4 M86 17 Q92 2 104 -2" fill="none" stroke="#1A1612" stroke-width="3" stroke-linecap="round"/>
      <path d="M94 36 q8 2 8 8" fill="none" stroke="#1A1612" stroke-width="3" stroke-linecap="round"/></svg>`;
  // [unit, x, y(top), width]
  const ANTS = [[0, 1560, 600, 100], [0, 1660, 610, 92],
    [1, 1230, 600, 110], [1, 1330, 606, 110], [1, 1430, 598, 104],
    [2, 760, 596, 112], [2, 860, 600, 112], [2, 965, 570, 150, true], [2, 1100, 604, 108],
    [3, 800, 470, 96], [3, 900, 476, 96], [3, 1000, 470, 96], [3, 800, 760, 96], [3, 900, 766, 96], [3, 1000, 760, 96],
    [4, 260, 600, 104], [4, 360, 606, 104], [4, 460, 600, 104]];
  const legsFrom = cut[11] + 0.2, legsTo = cut[12] + 0.5;
  const antHtml = ANTS.map(([u, x, y, w, cmd], i) => {
    const id = `ant${i}`, at = uAt[u] + (i % 3) * 0.12, cyc = 0.26 + (i % 3) * 0.03, reps = Math.max(1, Math.floor((legsTo - legsFrom) / cyc));
    p.tl.push(`tl.fromTo("#${id}", {opacity:0}, {opacity:1, duration:0.08, ease:"none"}, ${at.toFixed(3)});`);
    p.tl.push(`tl.fromTo("#${id}", {scale:0.3, y:-60}, {scale:1, y:0, duration:${SP.playful}, ease:"sp-playful"}, ${at.toFixed(3)});`);
    p.tl.push(`tl.fromTo("#${id}-la", {rotation:-14}, {rotation:14, duration:${cyc.toFixed(2)}, ease:"sine.inOut", repeat:${reps}, yoyo:true}, ${legsFrom.toFixed(3)});`);
    p.tl.push(`tl.fromTo("#${id}-lb", {rotation:14}, {rotation:-14, duration:${cyc.toFixed(2)}, ease:"sine.inOut", repeat:${reps}, yoyo:true}, ${legsFrom.toFixed(3)});`);
    p.tl.push(`tl.fromTo("#${id}-bd", {y:0}, {y:-4, duration:${(cyc / 2).toFixed(2)}, ease:"sine.inOut", repeat:${reps * 2}, yoyo:true}, ${legsFrom.toFixed(3)});`);
    return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${Math.round(w * 0.85)}px;opacity:0;transform-origin:50% 100%"><div id="${id}-bd" style="width:100%;height:100%">${antSVG(id, { cmd })}</div></div>`;
  }).join('');
  uAt.forEach((t, i) => p.sound(SFX + '/pop-' + (1 + i % 3) + '.wav', t, -18));
  p.sound(PILOT + '/sfx/drums-1.mp3', uAt[2], -26, 3);
  const LBL = [[1540, 520], [1230, 520], [700, 380], [1150, 880], [240, 520]];
  const col = units.map(([q, t], i) => { const id = p.id_('ac'); p.tl.push(`tl.fromTo("#${id}", {scale:0, opacity:0}, {scale:1, opacity:1, duration:${SP.snappy}, ease:"sp-snappy"}, ${uAt[i].toFixed(3)});`); p.ev(uAt[i]);
    return `<div id="${id}" style="position:absolute;left:${LBL[i][0]}px;top:${LBL[i][1]}px;background:${i === 2 ? 'var(--red)' : 'var(--ink)'};color:#FCF5E8;font-family:'IBM Plex Mono',monospace;font-weight:700;font-size:24px;padding:10px 18px;border-radius:8px;box-shadow:5px 6px 0 rgba(26,22,18,.3);white-space:nowrap">${t}</div>`; }).join('');
  const march = p.id_('mr'); p.tl.push(`tl.fromTo("#${march}", {x:-90}, {x:70, duration:${(cut[12] - cut[11]).toFixed(2)}, ease:"none"}, ${cut[11].toFixed(3)});`);
  const arrow = `<div style="position:absolute;left:200px;top:700px;width:1560px;height:8px;background:repeating-linear-gradient(90deg,var(--gold) 0 40px,transparent 40px 60px)"></div><div style="position:absolute;left:1770px;top:686px;width:0;height:0;border-left:44px solid var(--gold);border-top:18px solid transparent;border-bottom:18px solid transparent"></div>`;
  sc(11, `${head(p, 'ON THE MARCH', cut[11] + 0.1, 'It marched in the shape of an *ant column.*', cut[11] + 0.2, { size: 84, w: 1500 })}
    <div id="${march}" style="position:absolute;left:0;top:0;width:1920px;height:1080px">${arrow}${antHtml}${col}</div>`);
  fx(p, 'murmur.wav', cut[11] - 0.3, -28, 3);
  // 12 — the medical corps
  sc(12, `${head(p, 'UNIQUELY AMONG AFRICAN ARMIES', cut[12] + 0.1, 'A *medical corps:* the Esumankwafo.', cut[12] + 0.2, { size: 84 })}
    ${stack(p, [['treated the wounded', b('treated the wounded')], ['removed the dead', b('removed the dead')], ['…so the enemy could never count its losses', b('never count'), 'chip red']], { y: 450 })}
    ${st(p, 'medic-corps', cut[12] + 0.3, { x: 1150, y: 180, w: 620, rot: -3, life: 'bob', until: cut[13], sfx: SFX + '/pop-3.wav' })}`);
  // 13 — the sound: a drum in a forest is a weapon
  sc(13, `${head(p, 'INGREDIENT 3 · THE SOUND', cut[13] + 0.1, 'A drum in a forest is a *weapon.*', b('a drum in a forest', 'drum in a forest'), { size: 90 })}
    ${stack(p, [['my year of live & studio sound', b('live and studio sound', 'studio sound')], ['back to Nsamankow, the battle I opened with', b('the battle i opened', 'battle i opened'), 'chip gold'], ['McCarthy: ≈ 500 men in the firing line', b('about 500')], ['facing ≈ 10,000 warriors', b('something like 10'), 'chip red']], { y: 450 })}
    ${st(p, 'sound-desk', cut[13] + 0.4, { x: 1200, y: 200, w: 520, rot: 5, life: 'jiggle', until: cut[14], sfx: SFX + '/pop-1.wav' })}`);
  // 14 — the band against the drums
  const loud = b('the drums returned');
  sc(14, `${head(p, 'THE BAND PLAYS', cut[14] + 0.1, '“God Save the King” — to *surrender?*', cut[14] + 0.2, { size: 80 })}
    ${stack(p, [['the British national anthem', b('british national anthem', 'national anthem'), 'chip gold'], ['“the sound of home” → surrender', b('the sound of home', 'sound of home')], ['each time it ended, the drums came back louder', loud, 'chip red']], { y: 450 })}
    ${st(p, 'trumpet', cut[14] + 0.3, { dir: PILOT + '/icons/cut', x: 1080, y: 230, w: 340, rot: -4, life: 'jiggle', until: cut[15], sfx: PILOT + '/sfx/syn-boop.wav' })}
    ${st(p, 'drum', loud, { dir: PILOT + '/icons/cut', x: 1460, y: 230, w: 320, rot: 4, life: 'jiggle', until: cut[15], sfx: SFX + '/knock.wav', db: -12 })}`);
  p.sound('band-1.mp3', cut[14] + 0.2, -14, loud - cut[14]); p.sound('drums-2.mp3', loud, -10, 2.6);
  // 15 — musket fire; biscuits and macaroni
  const fire = cut[15] + 0.1;
  sc(15, `${head(p, 'THE ASANTE TIRE OF THE PERFORMANCE', cut[15] + 0.1, 'And answer with *musket fire.*', cut[15] + 0.2, { size: 88 })}
    ${stack(p, [['one storesman struggles in with ammunition boxes', b('ammunition boxes')], ['McCarthy did not survive the afternoon', b('did not survive'), 'chip red']], { y: 450 })}
    ${p.print(PILOT + '/final/crate-light.png', b('ammunition boxes') + 0.4, { ...RIGHT, rot: 3, caption: 'The boxes, opened…' })}
    ${p.stamp('BISCUITS & MACARONI', b('biscuits and macaroni'), { x: 150, y: 680, rot: -6, size: 64 })}`);
  p.sound('musket-1.mp3', fire, -6); p.sound('musket-2.mp3', fire + 0.35, -9); p.sound('crate-1.mp3', b('ammunition boxes') + 1.6, -10);
  // 16 — Osei Bonsu
  sc(16, `${head(p, 'THE SAME DAY, IN KUMASI', cut[16] + 0.1, 'The king dies in his bed.', cut[16] + 0.3, { size: 88 })}
    ${nameCard(p, b('osei bonsu', 'the asante king'), { y: 420, role: 'ASANTEHENE', name: 'Osei Bonsu' })}
    ${stack(p, [['his brother inherits the greatest victory of the age', b('leaving his brother', 'greatest victory'), 'chip gold']], { y: 640 })}
    ${st(p, 'drum', cut[16] + 0.4, { dir: PILOT + '/icons/cut', x: 1300, y: 260, w: 420, rot: 4, life: 'sway', until: cut[17], sfx: SFX + '/knock.wav' })}`);
  // 17 — Dodowa: the coalition
  sc(17, `${head(p, 'DODOWA · MONDAY 7 AUGUST 1826', cut[17] + 0.1, 'Power is not *invincibility.*', cut[17] + 0.25, { size: 92 })}
    ${stack(p, [['Monday, 7 August 1826', b('on monday', 'august, 1826'), 'chip gold'], ['beaten at Dodowa by a coalition', b('were beaten at', 'beaten at dodoa'), 'chip red'], ['British & Danish troops', b('british and danish')], ['coastal militias', b('coastal militias')], ['Akyem · Denkyira · Akim', b('and the achem', 'achem')]], { y: 420 })}
    ${p.print(img('map-ashanti-1900'), cut[17] + 0.5, { x: 1230, y: 160, w: 470, rot: 3, caption: 'Asante and its neighbours' })}`);
  // 18 — Nana Afia Dokuaa, open ground, Congreve rockets
  const rk = b('congreve rockets');
  sc(18, `${nameCard(p, cut[18] + 0.1, { y: 150, role: 'AKYEM QUEEN · THE ONLY WOMAN COMMANDER', name: 'Nana Afia Dokuaa' })}
    ${stack(p, [['she drew them onto open ground', b('onto open ground', 'open ground'), 'chip gold'], ['where drums and forest could not help', b('drums and forest', 'could not help')], ['rockets: “a new kind of thunder and lightning”', b('thunder and', 'new kind of'), 'chip red']], { y: 420 })}
    ${p.print(img('congreve') || PILOT + '/img/congreve.jpg', rk, { ...RIGHT, rot: 3, caption: 'Congreve rockets' })}`);
  fx(p, 'rocket.wav', rk + 0.3, -12); fx(p, 'rocket.wav', rk + 1.2, -16);
  // 19 — a lesser nation would have folded
  sc(19, `${head(p, 'AFTER DODOWA', cut[19] + 0.1, 'A lesser nation would have *folded.*', cut[19] + 0.2, { size: 88 })}
    ${p.stamp('INDEMNITY: 4,000 OZ OF GOLD', b('an indemnity'), { x: 150, y: 470, rot: -3, size: 44 })}
    ${stack(p, [['…and rebuilt', b('and rebuilt'), 'chip gold']], { y: 640 })}
    ${st(p, 'gold-dust', b('an indemnity') + 0.2, { x: 1330, y: 260, w: 420, rot: -4, life: 'pulse', until: cut[20], sfx: SFX + '/coins.wav' })}`);
  // 20 — 1874: Wolseley, Amoaful
  sc(20, `${head(p, '1874', cut[20] + 0.1, '≈ 40,000 Asante in the field.', cut[20] + 0.25, { size: 84 })}
    ${portrait(p, 'wolseley', b('sir garnet'), { x: 1250, y: 150, w: 460, rot: 3, caption: 'Sir Garnet Wolseley' })}
    ${stack(p, [['against Sir Garnet Wolseley', b('sir garnet')], ['Amoaful · 31 January 1874', b('fought them at', 'moirful'), 'chip red']], { y: 420 })}
    ${p.print(img('amoaful'), b('fought them at', 'moirful') + 0.3, { x: 150, y: 620, w: 520, rot: -2, caption: 'Amoaful, 1874' })}`);
  // 21 — the dash for Kumasi
  sc(21, `${head(p, 'THE DASH FOR KUMASI', cut[21] + 0.1, 'Four days of *rations.*', cut[21] + 0.2, { size: 92 })}
    ${stack(p, [['entering Kumasi on 4 February', b('entering on', 'the 4th of february'), 'chip gold']], { y: 430 })}
    ${p.print(img('burning-coomassie'), b('entering on', 'the 4th of february') + 0.3, { ...RIGHT, rot: 2, caption: 'Kumasi, February 1874' })}`);
  // 22 — the cost
  sc(22, `${head(p, 'THE COST', cut[22] + 0.1, 'Of 2,500 British soldiers…', cut[22] + 0.2, { size: 84 })}
    <div style="position:absolute;left:150px;top:420px;display:flex;align-items:baseline;gap:22px">${counterG(p, cut[22] + 0.4, 59, { size: 200, color: 'var(--red)', suffix: ' in 100' })}</div>
    ${stack(p, [['killed, wounded or invalided home', b('killed, wounded', 'invalided')], ['the king had left', b('the king had left'), 'chip gold'], ['nobody remained to sign a peace', b('nobody remained'), 'chip red']], { y: 680 })}`);
  // 23 — the treaty; a debt is a doorway
  sc(23, `${head(p, 'THE TREATY OF FOMENA', cut[23] + 0.1, 'A debt is a *doorway.*', b("it'll be a small", 'a debt, as'), { size: 96 })}
    ${stack(p, [['ratified in March — after Wolseley sailed', b('ratified in march', 'after wolseley')], ['50,000 oz of gold demanded', b('demanded 50', 'demanded'), 'chip gold'], ['never fully paid', b('never fully paid'), 'chip red'], ['…as your question card hinted', b('as your question card', 'question card')]], { y: 420 })}
    ${st(p, 'treaty-paper', cut[23] + 0.3, { x: 1200, y: 200, w: 560, rot: -4, life: 'bob', until: cut[24], sfx: SFX + '/paper-slap.wav' })}`);
  // 24 — 1896: the "bloodless" force; Prempeh
  sc(24, `${head(p, 'JANUARY 1896', cut[24] + 0.1, 'A *“bloodless”* force walks into Kumasi.', cut[24] + 0.25, { size: 78 })}
    ${stack(p, [['into Kumasi, without a shot', b('walked into kumasi', 'into kumasi'), 'chip gold'], ['King Prempeh I and his chiefs', b('and his chiefs'), 'chip red'], ['none had ever seen the sea', b('ever seen the', 'none of whom')]], { y: 440 })}
    ${p.print(img('prempeh-submission'), cut[24] + 1.0, { ...RIGHT, rot: 2, caption: 'The submission of King Prempeh, 1896' })}`);
  // 25 — into a boat: Elmina, Sierra Leone, the Seychelles
  sc(25, `${head(p, 'EXILE', cut[25] + 0.1, 'Pushed into a *boat.*', cut[25] + 0.2, { size: 92 })}
    ${stack(p, [['held at Elmina for a year', b('held at elmina')], ['→ Sierra Leone', b('sierra leone')], ['→ the Seychelles', b('the seychelles'), 'chip red']], { y: 420 })}
    ${st(p, 'exile-boat', cut[25] + 0.2, { x: 700, y: 640, w: 380, rot: 0, life: 'sail', until: cut[26], sfx: SFX + '/whip.wav' })}
    ${p.print(img('prempeh1-attendants') || img('prempeh1-exile'), b('the seychelles') - 0.2, { ...RIGHT, rot: 3, caption: 'King Prempeh I and his attendants, in exile' })}`);
  // 26 — Chamberlain and the French
  sc(26, `${head(p, 'MANNING’S READING', cut[26] + 0.1, 'Less humanitarian than a *race.*', cut[26] + 0.3, { size: 88 })}
    ${portrait(p, 'chamberlain', cut[26] + 0.2, { x: 1250, y: 150, w: 460, rot: 3, caption: 'Joseph Chamberlain, Colonial Secretary' })}
    ${p.stamp('A RACE TO BEAT THE FRENCH', b('beat the french'), { x: 150, y: 520, rot: -4, size: 50 })}`);
  return p;
}

// ---------------------------------------------------------------------------
// THE WIRE — Kumasi, Wednesday 28 March 1900: Hodgson asks for the Golden Stool; Yaa Asantewaa answers.
export function wire() {
  const [p, c, s] = make('wire');
  const b = (...q) => cs(c, ...q);
  const cut = [0, b('stepped out of the fort', 'stepped out'), b('he reminded them'), b('and then he asked'), b('and when ya', 'when ya'), b('tomorrow') - 1.2,
    b('that night'), b('three days later'), b('the fort was'), b('the asante had picked'), b('and by june', 'by june'), s.dur].map((t, i) => i ? t - 0.1 : 0);
  const sc = (i, html, o = {}) => p.scene(cut[i], cut[i + 1], html, o);
  sc(0, `${head(p, 'KUMASI · WEDNESDAY 28 MARCH 1900', 0.1, 'The Governor comes to *Kumasi.*', 0.3, { size: 84 })}
    ${nameCard(p, b('sir frederick'), { y: 400, role: 'GOVERNOR OF THE GOLD COAST', name: 'Sir Frederick Hodgson' })}
    ${stack(p, [['left Accra on the 13th', b('left accra')], ['an escort of only 30 Hausa soldiers', b('only 30', 'escort of'), 'chip red'], ['with his wife, Lady Mary Alice', b('lady mary alice', 'his wife')], ['the first European woman to enter Kumasi', b('first european woman'), 'chip gold']], { y: 580 })}
    ${portrait(p, 'lady-hodgson', b('lady mary alice', 'his wife'), { x: 1300, y: 150, w: 400, rot: 3, caption: 'Lady Mary Alice Hodgson' })}`, { enter: 'cut' });
  sc(1, `${head(p, 'UNDER THE AWNING', cut[1] + 0.1, 'Gold braid, an awning, a *semicircle* of kings.', cut[1] + 0.2, { size: 72 })}
    ${stack(p, [['a uniform dripping with gold braid', b('gold braid', 'dripped with')], ['he sits under an awning', b('sat under an awning', 'under an awning'), 'chip gold'], ['kings and chiefs in strict order of seniority', b('semicircle')]], { y: 440 })}
    ${p.print(img('kumasi-1900-03-28'), b('sat under an awning', 'under an awning'), { ...RIGHT, rot: 2, caption: 'Kumasi, 28 March 1900' })}`);
  fx(p, 'murmur.wav', b('semicircle') - 0.5, -24, 4);
  sc(2, `${head(p, 'HE REMINDED THEM…', cut[2] + 0.1, 'Three demands.', cut[2] + 0.2, { size: 96 })}
    ${stack(p, [['the 1874 indemnity is unpaid', b('the indemnity of'), 'chip red'], ['Prempeh will never return', b('would never return')], ['they will supply labour for roads', b('labour for roads', 'for roads'), 'chip gold']], { y: 430 })}
    ${st(p, 'treaty-paper', cut[2] + 0.3, { x: 1250, y: 220, w: 480, rot: -4, life: 'bob', until: cut[3], sfx: SFX + '/paper-slap.wav' })}`);
  sc(3, `${st(p, 'awning-chair', cut[3] + 0.3, { x: 1230, y: 170, w: 520, rot: -3, life: 'sway', until: cut[4], sfx: SFX + '/knock.wav' })}
    ${head(p, 'THE QUESTION', cut[3] + 0.15, 'Why an *ordinary chair?*', b('ordinary chair'), { size: 96 })}
    <div class="hl" style="left:150px;top:420px;width:960px"><div class="sub" style="font-size:44px">${p.words(p.id_('qr'), 'As the Queen’s representative, he should have the *Golden Stool* to sit on.', b("queen's representative", 'representative'), { stagger: 0.05 })}</div></div>
    ${p.stamp("LIKE SITTING ON THE NATION'S SOUL", b("the nation's soul", 'nation'), { x: 150, y: 700, rot: -4, size: 44 })}
    ${stack(p, [['the Stool is never sat upon', b('never sat upon'), 'chip red']], { y: 860 })}
    ${st(p, 'golden-stool-sky', b('golden stool to sit', 'the golden stool'), { x: 1380, y: 650, w: 330, rot: 3, life: 'float', until: cut[4], sfx: SFX + '/bell.wav', db: -18 })}`);
  fx(p, 'heartbeat.wav', b("the nation's soul", 'nation') - 0.3, -12);
  sc(4, `${nameCard(p, cut[4] + 0.2, { y: 150, role: 'QUEEN MOTHER OF EJISU · ACTING CHIEF', name: 'Yaa Asantewaa', note: 'the only Asante woman present' })}
    ${stack(p, [['her chief was exiled with Prempeh', b('exiled with prempe', 'had been exiled')], ['she asked about the king', b('asked about the king')], ['“he will not return”', b('would not return', 'not return'), 'chip red']], { y: 430 })}
    ${p.print(img('asantewaa-museum'), cut[4] + 1.0, { ...RIGHT, rot: 3, caption: 'Yaa Asantewaa Museum, Ejisu' })}
    ${p.stamp('A DECLARATION OF WAR', b('declaration of war'), { x: 150, y: 760, rot: -4, size: 52 })}`);
  sc(5, `<div class="hl" style="left:150px;top:300px;width:1620px"><div class="kicker" style="color:var(--red)"><i style="background:var(--red)"></i>A DECLARATION OF WAR</div>
      <h1 style="font-size:116px;font-style:italic;line-height:1.05">${p.words(p.id_('gw'), '“Tomorrow, ghost widows would get *husbands.*”', b('tomorrow'), { stagger: 0.16 })}</h1></div>
    ${p.chip('— Yaa Asantewaa, 28 March 1900', b('get husbands', 'husbands') + 0.4, { kind: 'chip gold', x: 150, y: 720 })}`, { enter: 'iris' });
  fx(p, 'heartbeat.wav', b('tomorrow') - 0.2, -10);
  sc(6, `${head(p, 'THAT NIGHT', cut[6] + 0.1, 'A secret meeting.', cut[6] + 0.2, { size: 96 })}
    ${stack(p, [['most chiefs agree to defend the Stool', b('most agreed'), 'chip gold'], ['some hold back — fear of putting it at risk', b('some held back')], ["Hodgson's own notes record the question", b("hodgson's own notes", 'own notes')], ["Lady Hodgson's memoir denies it", b('memoir denies', 'memoir')]], { y: 420 })}
    ${p.stamp('EVIDENCE STACKED AGAINST HER', b('stacked against'), { x: 150, y: 850, rot: -4, size: 44 })}
    ${portrait(p, 'chamberlain', b("hodgson's own notes", 'own notes') + 0.3, { x: 1300, y: 170, w: 400, rot: 3, caption: 'Notes to Chamberlain' })}`);
  fx(p, 'wind.wav', cut[6], -26, 4);
  sc(7, `${head(p, '31 MARCH 1900', cut[7] + 0.1, 'They dug for a stool that was *not there.*', cut[7] + 0.25, { size: 80 })}
    ${nameCard(p, b('captain armitage'), { y: 400, role: 'WITH 45 HAUSA SOLDIERS', name: 'Captain Armitage' })}
    ${stack(p, [['following a boy named Esumi', b('a boy named', 'esumi')], ['digging under hut floors', b('dug under hut'), 'chip gold'], ['…and an angry crowd waiting', b('an angry crowd', 'angry crowd'), 'chip red']], { y: 580 })}
    ${p.print(img('forest-fight-1900'), b('dug under hut') + 0.3, { x: 1280, y: 150, w: 440, rot: 2, caption: 'The war of 1900' })}`);
  fx(p, 'knock.wav', b('dug under hut') + 0.4, -14); fx(p, 'knock.wav', b('dug under hut') + 0.9, -16); fx(p, 'murmur.wav', b('an angry crowd', 'angry crowd'), -22, 3);
  sc(8, `${head(p, 'THE SIEGE', cut[8] + 0.1, 'The fort, besieged until *15 July.*', cut[8] + 0.2, { size: 84 })}
    ${stack(p, [['Yaa Asantewaa and 14 others → the Seychelles', b('and 14 others', '14 others'), 'chip red'], ['to join Prempeh in exile', b('to join')]], { y: 440 })}
    ${p.print(img('prempeh1-exile'), b('and 14 others', '14 others') + 0.3, { ...RIGHT, rot: 3, caption: 'Exiles in the Seychelles' })}
    ${p.stamp('THE STOOL: NEVER TAKEN', b('never came into'), { x: 150, y: 680, rot: -5, size: 60 })}`);
  fx(p, 'bell.wav', b('never came into'), -16);
  sc(9, `${head(p, 'THE SAME SEASON, ELSEWHERE', cut[9] + 0.1, 'The Asante picked their *moment.*', cut[9] + 0.25, { size: 84 })}
    ${stack(p, [['that season…', b('because that season', 'that season'), 'chip light'], ['Britain at war with the Boers', b('with the boers'), 'chip red'], ['Mafeking relieved only on 17 May', b('mafeking')], ['under Robert Baden-Powell', b('robert baden', 'baden'), 'chip gold'], ['who led the scouts to Kumasi in 1896', b('the same man')]], { y: 420 })}
    ${p.print(img('mafeking'), b('mafeking'), { x: 1150, y: 160, w: 380, rot: -2, caption: 'Mafeking, 1900' })}
    ${portrait(p, 'baden-powell', b('robert baden', 'baden'), { x: 1520, y: 560, w: 270, rot: 3, caption: 'Robert Baden-Powell' })}`);
  sc(10, `${head(p, 'AND BY JUNE', cut[10] + 0.1, 'No troops to *spare.*', b('could be spared', 'no british troops'), { size: 96 })}
    ${stack(p, [['the legations in Peking under siege', b('legations in peking', 'peking')], ['“an obscure little outpost”', b('obscure little outpost', 'obscure'), 'chip gold']], { y: 430 })}
    <div style="position:absolute;left:150px;top:700px;display:flex;gap:18px">${p.chip('KUMASI', b('the siege of kumasi', 'siege of kumasi'), { kind: 'chip red' })}${p.chip('LADYSMITH', b('ladysmith'), { kind: 'chip' })}${p.chip('PEKING', b('ladysmith') + 0.5, { kind: 'chip' })}</div>
    ${p.stamp('SIDE BY SIDE IN HISTORY', b('deserves to stand', 'stand beside'), { x: 150, y: 830, rot: -4, size: 44 })}
    ${p.print(img('kumasi-1900-03-28'), cut[10] + 0.3, { ...RIGHT, rot: 2, caption: 'Kumasi, 1900' })}`);
  return p;
}

// ---------------------------------------------------------------------------
// THE PALAVA DESK — two truths on the table; hold the pride and the cost in the same hand.
export function palava() {
  const [p, c, s] = make('palava');
  const b = (...q) => cs(c, ...q);
  const t1 = b('the first is that'), t2 = b('the second is that'), t3 = b('this was never', 'never one hero');
  const truth = (n, who, text, at, chips) => `<div class="card" style="left:150px;top:360px;width:1000px;padding:28px 34px"><div class="lbl"><span>TRUTH No. ${n}</span><b>${who}</b></div>
      <h3 style="font-size:50px">${p.words(p.id_('t'), text, at + 0.3, { stagger: 0.05 })}</h3></div>${stack(p, chips, { y: 700 })}`;
  p.scene(0, t1 - 0.1, `${head(p, 'THE PALAVA DESK', 0.1, 'Two truths on the table. *Neither removed.*', b('two truths'), { size: 84, w: 1500 })}
    ${p.stamp('A PALAVA DESK SHOULD BE UNCOMFORTABLE', 0.6, { x: 150, y: 520, rot: -3, size: 44 })}`, { enter: 'cut' });
  p.scene(t1 - 0.1, t2 - 0.1, `${head(p, 'TRUTH No. 1', t1, 'As Manning plainly writes…', t1 + 0.1, { size: 64 })}
    ${truth(1, 'MANNING', 'Expansion was driven largely by the demand for *captives to sell.*', t1, [['human sacrifice was real', b('human sacrifice'), 'chip red'], ['powerful — and still capable of the indefensible', b('still do things', 'would not defend')]])}
    ${st(p, 'scales-balance', t1 + 0.4, { x: 1300, y: 300, w: 420, rot: -6, life: 'sway', until: t2, sfx: SFX + '/bell.wav', db: -18 })}
    ${p.stamp('CAPTIVES TO SELL', b('captives to sell', 'captives'), { x: 1220, y: 800, rot: -5, size: 44 })}`);
  p.scene(t2 - 0.1, t3 - 0.1, `${head(p, 'TRUTH No. 2', t2, 'The empire’s costume…', t2 + 0.1, { size: 64 })}
    ${truth(2, 'THE EMPIRE', '“Humanitarian duty” was a convenient *costume for a scramble.*', t2, [['Fante · Akyem · Denkyira had their own reasons to fear Kumasi', b('the fante', 'fante')], ['…and fought beside the British', b('fought beside'), 'chip gold']])}
    ${st(p, 'scales-balance', t2 + 0.4, { x: 1300, y: 300, w: 420, rot: 6, life: 'sway', until: t3, sfx: SFX + '/bell.wav', db: -18 })}
    ${p.stamp('A COSTUME FOR A SCRAMBLE', b('convenient costume', 'costume'), { x: 1180, y: 800, rot: -5, size: 40 })}`);
  p.scene(t3 - 0.1, s.dur, `${pre(p, 'Never one hero and *one villain.*', t3 + 0.2, b('a neighbourhood argument', 'neighbourhood'), { size: 84 })}
    ${head(p, 'NEVER ONE HERO, ONE VILLAIN', t3, 'A neighbourhood argument an empire learned to *exploit.*', b('a neighbourhood argument', 'neighbourhood'), { size: 76 })}
    ${stack(p, [['Wahala dey everywhere.', b('wahaladeh', 'wahala'), 'chip red'], ['power and virtue are different things', b('power and virtue')], ['hold the pride and the cost in the same hand', b('pride and the', 'same hand'), 'chip gold']], { y: 470 })}
    ${st(p, 'scales-balance', b('power and virtue'), { x: 1250, y: 250, w: 480, rot: 0, life: 'sway', until: s.dur, sfx: SFX + '/bell.wav', db: -16 })}`);
  return p;
}

// ---------------------------------------------------------------------------
// HEADINGS — Lead Story, The Team Aside, Letters Page are not segments: the name lands at the top, then we delve in.
const heading = (key, title) => () => {
  const s = SEGMENTS[key]; const p = new Part({ ...s }); p.mast = false;
  const id = p.id_('hd');
  p.tl.push(`tl.fromTo("#${id}", {yPercent:120}, {yPercent:0, duration:${SP.heavy}, ease:"sp-heavy"}, 0.12);`);
  p.ev(0.12); p.sound('whoosh-1.mp3', 0.0, -14); p.sound(SFX + '/paper-slap.wav', 0.35, -16);
  if (key === 'headlead') { p.sound(SFX + '/boom.wav', 0.1, -4); p.tl.push(`tl.to("#${id}", {scale:1.06, duration:0.08, ease:"none", repeat:3, yoyo:true, immediateRender:false}, 0.42);`); }   // the Lead Story lands with a BOOM
  p.scene(0, s.dur, `<div class="kente top" style="position:absolute;left:0;right:0;top:0;height:14px"></div>
    <div style="position:absolute;left:0;right:0;top:120px;display:flex;justify-content:center"><span class="mk"><span id="${id}" class="wd" style="display:inline-block;font-family:'Playfair Display',serif;font-weight:900;font-size:110px;letter-spacing:.02em;border-bottom:8px solid var(--red);padding-bottom:6px">${title}</span></span></div>`, { enter: 'wipeU' });
  return p;
};
export const headlead = heading('headlead', 'Lead Story');
export const headteam = heading('headteam', 'The Team Aside');
export const headletters = heading('headletters', 'Letters Page');

// ---------------------------------------------------------------------------
// THEN v NOW
export function thennow() {
  const [p, c, s] = make('thennow');
  const b = (...q) => cs(c, ...q);
  const now = b('now, this june', 'this june'), t70 = b('in 2027') - 0.1, thr = b('between then and now') - 0.1, ww = b('and the gold coast regiment', 'gold coast regiment') - 0.1;
  p.scene(0, now - 0.1, `${head(p, 'THEN', 0.1, 'A defeated king owed an empire *50,000 ounces of gold.*', 0.3, { size: 80 })}
    ${st(p, 'gold-dust', 1.0, { x: 1250, y: 260, w: 480, rot: -4, life: 'pulse', until: now, sfx: SFX + '/coins.wav' })}`, { enter: 'cut' });
  p.scene(now - 0.1, t70, `${head(p, 'NOW · ACCRA, THIS JUNE', now, 'The treasures start coming *home.*', now + 0.2, { size: 80 })}
    ${stack(p, [['Netherlands: ≈2,000 objects to return', b('the netherlands')], ['Germany names its first items', b('germany named')], ['Denmark: Christiansborg, a place of remembrance', b('denmark pledged')], ['32 Asante treasures home from London (2024)', b('32 asante'), 'chip gold'], ['…on a three-year loan, renewable once', b('three -year loan', 'year loan'), 'chip red']], { y: 400 })}
    ${st(p, 'museum-return', now + 0.7, { x: 1250, y: 260, w: 480, rot: 3, life: 'bob', until: t70, sfx: SFX + '/glass.wav' })}
    ${p.stamp('WHO OWNS THE STORY? STILL ALIVE', b('who owns the story', 'still alive'), { x: 150, y: 900, rot: -3, size: 40 })}`);
  p.scene(t70, thr, `${head(p, '6 MARCH 2027', t70 + 0.1, 'Ghana turns *seventy.*', t70 + 0.25, { size: 100 })}
    ${stack(p, [['in Kumasi, the Asante flag flies beside the national one', b('the asante flag')]], { y: 440 })}
    ${away(p, `<div style="position:absolute;left:1250px;top:240px">${counterG(p, b('turned 70', 'ghana turned'), 70, { size: 260, color: 'var(--red)' })}</div>`, b('the asante flag') - 0.45)}
    ${p.print(img('asante-flag'), b('the asante flag'), { ...RIGHT, rot: 3, caption: 'The Asante flag — the Stool at its heart' })}
    ${p.stamp('THE STOOL NEVER CHANGED HANDS', b('never changed hands'), { x: 150, y: 600, rot: -4, size: 42 })}`);
  fx(p, 'bell.wav', b('never changed hands'), -16);
  const line = p.rule(thr + 0.3, { x: 120, y: 470, w: 1680, color: 'var(--ink)', h: 5 });
  const tick = (q, x, year, txt) => { const at = b(...q); const id = p.id_('tk'); p.grow(id, at, { preset: 'default', dy: 50, from: 0.7 }); p.sound(SFX + '/pop-' + (1 + (x % 3)) + '.wav', at, -19);
    return `<div id="${id}" style="position:absolute;left:${x - 160}px;top:430px;width:320px;text-align:center"><div style="width:30px;height:30px;border-radius:50%;background:var(--red);border:4px solid var(--ink);margin:0 auto"></div><div class="mono" style="font-size:42px;font-weight:700;margin-top:14px">${year}</div><div style="font-family:'Playfair Display',serif;font-size:32px;line-height:1.15;margin-top:8px">${txt}</div></div>`; };
  p.scene(thr, ww, `${head(p, 'BETWEEN THEN AND NOW RUNS A THREAD', thr + 0.1, 'Annexed — but never *absorbed.*', thr + 0.3, { size: 80, w: 1500 })}${line}
    ${tick(['annexed in 1901', 'annexed'], 360, '1901', 'Asante annexed, governed separately')}
    ${tick(['returned in 1925', 'prempe returned'], 960, '1925', 'Prempeh returns')}
    ${tick(['restored', 'as asantehene'], 1560, '1935', 'An Asantehene restored')}
    ${p.print(img('prempeh2'), b('restored', 'as asantehene') + 0.5, { x: 1380, y: 700, w: 230, rot: -2, caption: 'Prempeh II' })}`);
  p.scene(ww, s.dur, `${head(p, 'THE GOLD COAST REGIMENT', ww + 0.1, 'Burma. Abyssinia. Then *home.*', ww + 0.25, { size: 84 })}
    ${stack(p, [['grown out of these wars', b('grew out of', 'out of these wars')], ['veterans — my grandfather among them', b('my grandfather'), 'chip gold'], ['unpaid pensions, promised jobs', b('unpaid pensions'), 'chip red'], ['February 1948 — the crossroads in Accra', b('february 1948', 'a crossroads')]], { y: 440 })}
    ${p.print(img('attipoe'), b('exploded at', 'crossroads'), { ...RIGHT, rot: 3, caption: 'Cpl. Patrick Attipoe, 1948 crossroads march' })}`);
  return p;
}

// ---------------------------------------------------------------------------
// THE TEAM ASIDE — Kwame "The Combative"
export function team() {
  const [p, c, s] = make('team');
  const b = (...q) => cs(c, ...q);
  const q = b('asked one question') - 0.1;
  const kw = b('whom the nest', 'the combative') - 0.1, tk = p.id_('tk');
  p.tl.push(`tl.fromTo("#${tk}", {scale:1.05, x:0, y:0}, {scale:1.7, x:520, y:-60, duration:${kw.toFixed(2)}, ease:"power1.inOut"}, 0);`);
  p.scene(0, kw, `<div id="${tk}" class="cover" style="background-image:url(${p.asset(PILOT + '/final/nest-light.png')});transform-origin:50% 50%"></div>
    <div style="position:absolute;left:110px;top:120px;background:rgba(252,245,232,.96);border:4px solid var(--ink);box-shadow:10px 12px 0 var(--ink);padding:22px 30px"><div class="mono" style="font-size:22px;font-weight:700;letter-spacing:.2em;color:var(--red)">BACK AT THE NEST</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:56px;margin-top:6px">${p.words(p.id_('yk'), 'A young man named *Kwame…*', b('a young man', 'young man'), { stagger: 0.07 })}</div></div>`, { enter: 'cut', bg: 'none', drift: 0 });
  p.sound('ambience-2.mp3', 0, -22, kw + 0.5);
  p.scene(kw, q, `${head(p, 'BACK AT THE NEST', kw + 0.1, 'Kwame, *“The Combative.”*', kw + 0.2, { size: 96 })}
    ${p.stamp('BRITAIN WON', b('britan won', 'capital letters'), { x: 150, y: 470, rot: -6, size: 72 })}
    ${stack(p, [['“take come”', b('tikkom', 'when i said'), 'chip gold'], ['handed over like a trophy', b('like a man handing', 'a trophy')], ['FACT 1 · Kumasi taken, 1874', b('kumasi was taken'), 'chip'], ['FACT 2 · Prempeh exiled, 1896', b('exiled in 1896', 'was exiled'), 'chip']], { y: 640 })}
    ${p.chip('he had a point…', b('he had a point'), { kind: 'chip gold', x: 1250, y: 820 })}
    ${st(p, 'kwame-boxer', b('boxing match'), { x: 1200, y: 170, w: 560, rot: 3, life: 'jiggle', until: q, sfx: SFX + '/whip.wav' })}`, { enter: 'cut' });
  p.scene(q, s.dur, `${head(p, 'ONE QUESTION', q + 0.1, 'The *Golden Stool.*', q + 0.2, { size: 100 })}
    ${stack(p, [['“komot for there”', b('kumot', 'with a smile'), 'chip gold'], ['his keyboard stopped', b('keyboard stopped')], ['his chin lifted', b('chin lifted', 'his chin')], ['…did the British ever find it?', b('ever found it'), 'chip red']], { y: 420 })}
    ${p.stamp('NO.', b('when i said no', 'said no'), { x: 150, y: 740, rot: -8, size: 90 })}
    ${p.chip('“the thing pain me oo”', b('ting pin miu', 'the look on his face'), { kind: 'chip light', x: 470, y: 770 })}
    ${st(p, 'golden-stool-sky', q + 0.5, { x: 1280, y: 560, w: 300, rot: 3, life: 'float', until: b('folded the', 'folded') - 0.1, sfx: SFX + '/bell.wav', db: -20 })}
    ${p.stamp('MORE ABOUT KWAME — IN GOOD TIME', b('more about kwame', 'in good time'), { x: 150, y: 900, rot: -3, size: 40 })}
    ${st(p, 'folded-paper', b('folded the', 'folded'), { x: 1200, y: 200, w: 540, rot: -3, life: 'bob', until: s.dur, sfx: SFX + '/paper-slap.wav' })}`);
  fx(p, 'knock.wav', b('keyboard stopped'), -14);
  return p;
}

// ---------------------------------------------------------------------------
// THE EDITOR'S NOTE — the wrong order, on purpose: each room arrives as it is named; then the recap.
export function editor() {
  const [p, c, s] = make('editor');
  const b = (...q) => cs(c, ...q);
  const r1 = b('drawing and design') - 0.1, r2 = b('learn sound') - 0.1, r3 = b('psychology and philosophy') - 0.1, r4 = b('everything in this edition') - 0.1;
  const room = (q, n_, lbl, i, until) => { const at = b(...q); const x = 150 + i * 430;
    return st(p, n_, at, { x: x + 40, y: 420, w: 300, rot: [-4, 3, -2, 4][i], life: 'bob', until, sfx: SFX + '/pop-' + (1 + i % 3) + '.wav' }) + `<div class="chips-sm" style="position:absolute;left:${x}px;top:760px;width:400px">${p.chip(lbl, at + 0.25, { kind: 'chip light' })}</div>`; };
  p.scene(0, r1, `${head(p, "EDITOR'S NOTE", 0.1, 'I keep stepping into *other rooms.*', 0.3, { size: 88 })}
    ${stack(p, [['a design class here, a studio there', b('a design class here', 'design class')], ["the reason I sit in the Editor's chair", b('the reason i sit'), 'chip gold'], ['I did things in the wrong order — on purpose', b('wrong order'), 'chip red']], { y: 440 })}`, { enter: 'cut' });
  p.scene(r1, r2, `${head(p, 'ROOMS 1 & 2', r1 + 0.1, 'Every grand idea is only a *drawing…*', b('every grand idea'), { size: 76, w: 1500 })}
    ${room(['drawing and design'], 'design-class', 'drawing & design', 0, r2)}${room(['a year in visual art', 'visual art'], 'mind-books', 'a year of visual art', 1, r2)}
    ${p.chip('…until someone works out how to hold it up', b('how to hold it up', 'hold it up'), { kind: 'chip gold', x: 150, y: 880 })}
    ${room(['technical program', 'physics'], 'tech-drawing', 'physics · maths · building', 2, r2)}${room(['technical drawing, where', 'technical drawing'], 'twenty-four-states', 'technical drawing', 3, r2)}`);
  p.scene(r2, r3, `${head(p, 'ROOMS 3 & 4', r2 + 0.1, 'How a room listens — and how a body *fails.*', b('how a room listens'), { size: 72, w: 1500 })}
    ${room(['learn sound'], 'sound-desk', 'sound · live & studio', 0, r3)}${room(['as a medic'], 'medic-clinic', 'medic in a clinic', 1, r3)}`);
  p.scene(r3, r4, `${head(p, 'ROOMS 5 TO 8', r3 + 0.1, 'The best system is the one *nobody can find.*', b('nobody can find'), { size: 72, w: 1500 })}
    ${room(['psychology and philosophy'], 'mind-books', 'psychology & philosophy', 0, r4)}${room(['security systems'], 'security-cam', 'electronic security', 1, r4)}
    ${room(['one eye on'], 'football-globe', 'football & the world', 2, r4)}${room(['broadcasting and'], 'broadcast-mic', 'broadcasting & writing', 3, r4)}
    ${p.chip('…a lesson the Golden Stool taught an empire', b('a lesson the golden stool', 'great cost'), { kind: 'chip gold', x: 150, y: 880 })}
    ${p.chip('hands-on with every new technology', b('every new technology', 'new technology'), { kind: 'chip light', x: 1000, y: 880 })}
    ${p.chip('never able to refuse an adventure', b('refuse an adventure', 'an adventure'), { kind: 'chip red', x: 1000, y: 970 })}
    ${st(p, 'golden-stool-sky', b('a lesson the golden stool', 'great cost') + 0.4, { x: 830, y: 790, w: 170, rot: 4, life: 'float', until: r4, sfx: SFX + '/bell.wav', db: -20 })}`);
  const words5 = [['the symbol', 'THE SYMBOL', 'golden-stool-sky'], ['the logistics', 'THE LOGISTICS', 'quota-army'], ['the sound', 'THE SOUND', 'sound-desk'], ['the secrecy', 'THE SECRECY', 'security-cam'], ["the nation's mind", "THE NATION'S MIND", 'mind-books']];
  const recap = words5.map(([q, t, n_], i) => { const at = b(q); return st(p, n_, at, { x: 170 + i * 340, y: 360, w: n_ === 'quota-army' ? 170 : 250, rot: [-3, 3, -2, 2, -3][i], life: 'bob', until: s.dur, sfx: SFX + '/pop-' + (1 + i % 3) + '.wav' }) + `<div class="chips-sm" style="position:absolute;left:${170 + i * 340}px;top:640px;width:320px">${p.chip(t, at + 0.2, { kind: i === 4 ? 'chip gold' : 'chip' })}</div>`; }).join('');
  p.scene(r4, s.dur, `${head(p, 'EVERYTHING IN THIS EDITION', r4 + 0.1, '…I met first in some *other room.*', b('some other room', 'other room'), { size: 76, w: 1500 })}${recap}
    <div class="hl" style="left:150px;top:780px;width:1600px"><h1 style="font-size:64px">${p.words(p.id_('ed'), 'Not to know one thing — but where the *ideas are hiding.*', b('not to know one'), { stagger: 0.06 })}</h1></div>`);
  return p;
}

// ---------------------------------------------------------------------------
// LETTERS PAGE — a question of recall
export function letters() {
  const [p, c, s] = make('letters');
  p.scene(0, s.dur, `${pre(p, 'This week’s question is one of *recall.*', cs(c, 'this week', 'question is one'), cs(c, 'which single detail'), { size: 78, w: 1300 })}
    ${st(p, 'letters-pile', 0.5, { dir: PILOT + '/icons/cut', x: 1330, y: 150, w: 380, rot: -3, life: 'bob', until: s.dur, sfx: SFX + '/paper-slap.wav' })}
    <div class="hl" style="left:150px;top:150px;width:1300px">${p.kicker('THIS WEEK’S QUESTION · ONE OF RECALL', 0.1)}
      <h1 style="font-size:78px">${p.words(p.id_('lq'), 'Which single detail will you repeat *tomorrow* — and to *whom?*', cs(c, 'which single detail'), { stagger: 0.06 })}</h1></div>
    ${st(p, 'comments-pin', cs(c, 'write it in the comments'), { x: 1330, y: 520, w: 420, rot: 4, life: 'bob', until: s.dur, sfx: SFX + '/pop-3.wav' })}
    <div style="position:absolute;left:150px;top:620px;display:flex;gap:14px;align-items:center">${p.chip('write it in the comments', cs(c, 'write it in the comments'), { kind: 'chip' })}${p.chip('I will pin the best one', cs(c, 'pin the best'), { kind: 'chip red' })}</div>
    ${p.chip('…and who is that someone?', cs(c, 'who is that someone', 'that someone'), { kind: 'chip red', x: 150, y: 520 })}
    ${p.chip('the strongest letters — read in the next edition', cs(c, 'the strongest letters'), { kind: 'chip gold', x: 150, y: 730 })}`, { enter: 'cut' });
  return p;
}

// ---------------------------------------------------------------------------
// DISPATCH + outro — filed, signed, dispatched; the banner assembles once more and folds into the symbol.
export function dispatch() {
  const [p, c, s] = make('dispatch');
  p.css.push(BANNER_CSS);
  const vEnd = (({ local0, vo_in, vo_out }) => local0 + vo_out - vo_in)(s.pieces[s.pieces.length - 1]);
  const aEnd = cs(c, 'and dispatched to') - 0.1;
  const sig = p.id_('sg');
  p.tl.push(`tl.fromTo("#${sig}", {strokeDasharray:900, strokeDashoffset:900}, {strokeDashoffset:0, duration:1.3, ease:"power2.inOut"}, ${cs(c, 'filed and signed') + 0.3});`); p.ev(cs(c, 'filed and signed') + 0.3);
  p.sound('pen-2.mp3', cs(c, 'filed and signed') + 0.3, -10);
  p.scene(0, aEnd, `<div class="hl" style="left:150px;top:150px;width:1600px">${p.kicker('DISPATCH', 0.1)}<h1 style="font-size:96px">${p.words(p.id_('fe'), 'The *first edition*, complete.', 0.25, { stagger: 0.07 })}</h1></div>
    <div style="position:absolute;left:150px;top:420px;display:flex;gap:16px">${p.chip('CHECKED', cs(c, 'checked'), { kind: 'chip light' })}${p.chip('STAMPED', cs(c, 'stamped'), { kind: 'chip light' })}${p.chip('≈ 70 MB', cs(c, 'priced at'), { kind: 'chip gold' })}</div>
    <div class="mono" style="position:absolute;left:150px;top:560px;font-size:46px;font-weight:700;line-height:1.5">${p.typed('THE NEST · 266 SANDPIPER LOOP', cs(c, 'at the nest'), { cps: 24 })}<br>${p.typed('ONIPA ENCLAVE', cs(c, 'onipa enclave', 'enclave') - 0.6, { cps: 20, sfx: false })}</div>
    <svg style="position:absolute;left:1150px;top:560px" width="520" height="160" viewBox="0 0 460 140"><path id="${sig}" d="M10 90 C 40 20, 70 20, 80 80 S 120 120, 140 60 S 180 10, 200 70 S 240 110, 270 50 C 290 20, 320 100, 350 70 S 420 40, 450 60" fill="none" stroke="#1A1612" stroke-width="5" stroke-linecap="round"/></svg>
    ${p.print(PILOT + '/final/nest-light.png', cs(c, 'at the nest') - 0.2, { x: 1320, y: 110, w: 470, rot: 2, caption: 'The Nest · 266 Sandpiper Loop' })}
    ${p.stamp('FILED', cs(c, 'filed and signed') + 1.6, { x: 1250, y: 760, rot: -10, size: 80 })}`, { enter: 'cut' });
  const stops = [['to accra', 'ACCRA'], ['to kumasi', 'KUMASI'], ['to bungpurugu', 'BUNKPURUGU'], ['to half', 'HALF ASSINI'], ['and to the world', 'THE WORLD']];
  const route = stops.map(([q, t], i) => p.chip(t, cs(c, q), { kind: i === 4 ? 'chip gold' : 'chip', x: 150 + i * 340, y: 520 + (i % 2) * 120 })).join('');
  stops.forEach(([q]) => p.sound(SFX + '/pop-2.wav', cs(c, q), -18));
  const path_ = p.id_('rt');
  p.tl.push(`tl.fromTo("#${path_}", {strokeDasharray:1800, strokeDashoffset:1800}, {strokeDashoffset:0, duration:${(cs(c, 'and to the world') - cs(c, 'to accra') + 0.5).toFixed(2)}, ease:"none"}, ${cs(c, 'to accra')});`);
  p.scene(aEnd, vEnd + 0.6, `<div class="hl" style="left:150px;top:220px;width:1600px">${p.kicker('…AND DISPATCHED TO', aEnd + 0.1)}<h1 style="font-size:96px">${p.words(p.id_('dp'), 'Chale, I go see you for the *next one.*', cs(c, 'chale, i go', 'i go see you'), { stagger: 0.07 })}</h1></div>
    <svg style="position:absolute;left:0;top:0" width="1920" height="1080"><path id="${path_}" d="M230 560 L570 680 L910 560 L1250 680 L1590 560" fill="none" stroke="#A4241B" stroke-width="5" stroke-dasharray="14 10"/></svg>${route}`);
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

// ---------------------------------------------------------------------------
// THE COLOPHON — end credits after the closing montage: small, centred, on the blurred Gold Coast Palava papers;
// headings in red, text in ink; the blocks arrive one after the other, hold, then the picture fades to black.
const COLOPHON = [
  ['THE COLOPHON', ['Edition No. 1 · Price: ~70MB']],
  ['CORRECTIONS &amp; CLARIFICATIONS', ['None this edition.']],
  ['SOURCES &amp; FURTHER READING', ['Stephen Manning. <i>Britain at War with the Asante Nation, 1823–1900: ‘The White Man’s Grave’.</i> Pen &amp; Sword, 2021.', 'Archive photographs and engravings: Wikimedia Commons (full list in the description).']],
  ['THE MASTHEAD', ['<span class="dl"><b>Editor</b><i></i><b>Kofi</b></span>', '<span class="dl"><b>The Restless</b><i></i><b>Aba</b></span>', '<span class="dl"><b>The Combative</b><i></i><b>Kwame</b></span>', '<span class="dl"><b>Empty desk</b><i></i><b>To be announced</b></span>', 'No desks assigned. Every story belongs to everyone at The Nest.']],
  ['PRODUCTION', ['Written, Edited and Narrated by Joshua Horlortu', 'Theme Music by Gonje Group, Legon']],
  ['FINE PRINT', ['The Nest newsroom is a fictional device.', 'Printed at The Nest, 266 Sandpiper Loop, Onipa Enclave. © 2026 Gold Coast Palava']],
];
// COMBO3 — the colophon after the whole video, in silence: one block at a time, each alone on the page, then black.
export function credits() {
  const s = SEGMENTS.credits; const p = new Part({ ...s }); p.mast = false;
  p.css.push(`.colo { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; text-align:center; }
    .colo .slot { position:absolute; left:0; right:0; top:50%; transform:translateY(-50%); display:flex; justify-content:center; overflow:hidden; padding:6px 0; }
    .colo .blk { width:820px; }
    .colo h4 { font-family:'IBM Plex Mono',monospace; font-weight:700; font-size:19px; letter-spacing:.26em; color:var(--red); margin-bottom:10px; }
    .colo p { font-family:'Playfair Display',serif; font-size:21px; line-height:1.45; color:var(--ink); text-transform:uppercase; letter-spacing:.06em; }
    .colo .dl { display:flex; align-items:baseline; gap:8px; width:440px; margin:0 auto; }
    .colo .dl b { font-weight:400; } .colo .dl i { flex:1; border-bottom:2px dotted rgba(26,22,18,.55); position:relative; top:-5px; }
    .colo .blur { position:absolute; inset:-30px; background:url(assets/papers-bg.jpg) center/cover; filter:blur(11px); opacity:.6; }`);
  const n = COLOPHON.length, span = (s.dur - 0.8) / n;            // ~5 s of cards, then the fade to black
  const blocks = COLOPHON.map(([h, lines], i) => {
    const id = `colo${i}`, t0 = 0.05 + i * span, t1 = t0 + span - 0.12;
    p.tl.push(`tl.fromTo("#${id}", {yPercent:140}, {yPercent:0, duration:0.32, ease:"sp-snappy"}, ${t0.toFixed(3)});`);
    if (i < n - 1) p.tl.push(`tl.to("#${id}", {yPercent:-140, duration:0.18, ease:"power2.in", immediateRender:false}, ${t1.toFixed(3)});`);
    p.ev(t0);
    return `<div class="slot"><div id="${id}" class="blk"><h4>${h}</h4>${lines.map((l) => `<p>${l}</p>`).join('')}</div></div>`;
  }).join('');
  const fadeAt = s.dur - 0.8;
  p.tl.push(`tl.fromTo("#colo-black", {opacity:0}, {opacity:1, duration:0.6, ease:"power1.inOut"}, ${fadeAt.toFixed(2)});`);
  p.ev(fadeAt);
  p.scene(0, s.dur, `<div class="blur"></div><div class="colo">${blocks}</div><div id="colo-black" style="position:absolute;inset:0;background:#000;opacity:0"></div>`, { enter: 'cut', drift: 0.02, bg: 'paper' });
  p.sfx = [];                                                      // silence
  return p;
}

export const BUILDERS = { cold, combo1: combo, nest, front, headlead, lead, wire, palava, thennow, headteam, team, editor, headletters, letters, dispatch, credits };
