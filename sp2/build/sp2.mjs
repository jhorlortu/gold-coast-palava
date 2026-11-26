// Gold Coast Palava Special No. 2 — "Nineteen Years: The Rawlings Question".
// Same device as Special No. 1: the team's late-night WhatsApp chat on Kofi's iPhone holds the right third; the left
// two-thirds carry the story. Data cards (timeline, charts, grid, ledger) are rendered by Remotion and placed as moving
// prints (rclip). Run with GCP_WORK=/home/user/gcp/sp2/work GCP_EDITION="SPECIAL No. 2".
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Part, cuer, SP, rich } from '/home/user/gcp/build/lib.mjs';
import { banner, BANNER_CSS } from '/home/user/gcp/build/banner.mjs';
import { combo1 } from '/home/user/gcp/build/combo1.mjs';
import { Phone, PHONE, SYMBOL_SVG, PHONE_CSS } from './phone.mjs';

const WORK = '/home/user/gcp/sp2/work';
const plan = JSON.parse(fs.readFileSync(path.join(WORK, 'timeline.json'), 'utf8'));
const P = Object.fromEntries(plan.parts.map((p) => [p.id, p]));
const ORDER = plan.parts.filter((p) => !p.id.includes('~'));
const seg = (id, fromPart, label, toPart = null) => {
  const i = ORDER.findIndex((p) => p.id === fromPart);
  const T0 = P[fromPart].T0, T1 = toPart ? P[toPart].T0 : i + 1 < ORDER.length ? ORDER[i + 1].T0 : plan.total;
  const pieces = plan.parts.filter((p) => p.kind === 'vo' && p.T0 >= T0 - 1e-6 && p.T0 < T1 - 1e-6).map((p) => ({ vo_in: p.vo_in, vo_out: p.vo_out, local0: +(p.T0 - T0).toFixed(3) }));
  return { id, T0, dur: +(T1 - T0).toFixed(3), label, pieces };
};
export const SEGMENTS = {
  cold: seg('cold', 'cold-open', ''), combo1: seg('combo1', 'combo1', ''), welcome: seg('welcome', 'welcome', ''),
  pinq1: seg('pinq1', 'pin-q1', ''), q1: seg('q1', 'q1', 'QUESTION ONE'), pinq2: seg('pinq2', 'pin-q2', ''), q2: seg('q2', 'q2', 'QUESTION TWO'),
  pinq3: seg('pinq3', 'pin-q3', ''), q3: seg('q3', 'q3', 'QUESTION THREE'), pinq4: seg('pinq4', 'pin-q4', ''), q4: seg('q4', 'q4', 'QUESTION FOUR'),
  pinlesson: seg('pinlesson', 'pin-lesson', ''), lesson: seg('lesson', 'lesson', 'THE LEDGER', 'close'),
  close: seg('close', 'close', ''), outro: seg('outro', 'outro', ''), credits: seg('credits', 'credits', ''),
};
{ const c0 = SEGMENTS.cold; const d = c0.T0; c0.T0 = 0; c0.dur = +(c0.dur + d).toFixed(3); c0.pieces = c0.pieces.map((q) => ({ ...q, local0: +(q.local0 + d).toFixed(3) })); }

const MEDIA = '/home/user/gcp/sp2/media';
const SFX = MEDIA + '/sfx', ED1SFX = '/home/user/gcp/ed1/media/sfx', PSFX = '/home/user/gcp/project/media/sfx';
const STK = MEDIA + '/stickers_cut', ED1STK = '/home/user/gcp/ed1/media/stickers_cut', ICONS = '/home/user/gcp/project/media/icons/cut';
const DRAWN = MEDIA + '/drawn', REAL = MEDIA + '/real';
const NEST = '/home/user/gcp/project/media/final/nest-light.png';
const make = (key) => { const s = SEGMENTS[key]; return [new Part({ ...s }), cuer(s.pieces), s]; };
const n3 = (v) => +(+v).toFixed(3);
const spr = (k) => ({ duration: SP[k], ease: `sp-${k}` });
// tries several transcript spellings for one cue
export const MISSES = [];
const cs = (c, ...qs) => { for (const q of qs) { try { return c(q); } catch {} } if (process.env.CUE_SOFT) { MISSES.push(qs.join(' | ')); return 1; } throw new Error('no cue: ' + qs.join(' | ')); };
const fx = (p, file, at, db = -16, len) => p.sfx.push({ file: path.isAbsolute(file) ? file : path.join(SFX, file), T: n3(p.T0 + at), db, ...(len ? { len } : {}) });
const efx = (p, file, at, db = -16, len) => fx(p, path.join(ED1SFX, file), at, db, len);

// ---------------------------------------------------------------------------
// Left-zone kit (x 110 … 1230; the phone owns 1330 … 1830)
const LX = 120, LW = 1090;
export const SP2_CSS = `
@font-face { font-family:'Special Elite'; src:url('assets/special-elite.ttf') format('truetype'); }
@font-face { font-family:'Noto Color Emoji'; src:url('assets/noto-emoji.ttf') format('truetype'); }
.tw { font-family:'Special Elite', 'IBM Plex Mono', monospace; }
.mast-r:empty { display:none; }
.ccard { position:absolute; background:#FCF5E8; border:5px solid var(--ink); box-shadow:12px 14px 0 var(--ink); padding:26px 34px; }
.qmark { font-family:'Playfair Display',serif; font-weight:900; color:var(--red); }
.dl { position:absolute; font-family:'Special Elite','IBM Plex Mono',monospace; color:var(--red); border:5px solid var(--red); padding:10px 26px; background:rgba(252,245,232,.94); letter-spacing:.06em; white-space:nowrap; }
.sign { position:absolute; font-family:'GCP Round',sans-serif; font-weight:700; font-size:40px; color:#FCF5E8; background:#2E6B3A; border:5px solid #FCF5E8; outline:4px solid #2E6B3A; padding:10px 30px 10px 26px; border-radius:8px; white-space:nowrap; box-shadow:0 14px 24px -10px rgba(40,25,10,.4); }
.sign.red { background:var(--red); outline-color:var(--red); }
.strike { position:relative; display:inline-block; }
.strike i { position:absolute; left:-4%; right:-4%; top:52%; height:9px; background:var(--red); transform-origin:0 50%; border-radius:4px; }
.fstrip { position:absolute; background:#1A1612; padding:26px 0; display:flex; gap:22px; }
.fstrip::before, .fstrip::after { content:''; position:absolute; left:0; right:0; height:12px; background:repeating-linear-gradient(90deg, transparent 0 14px, #F3EBD7 14px 30px); }
.fstrip::before { top:7px; } .fstrip::after { bottom:7px; }
.fframe { width:215px; height:150px; background:#F3EBD7; display:flex; align-items:center; justify-content:center; text-align:center; font-family:'Playfair Display',serif; font-weight:900; font-size:34px; line-height:1; color:var(--ink); border-radius:4px; }
.room { position:absolute; inset:0; background:radial-gradient(ellipse at 70% 55%, #2A221A 0%, #120E0B 55%, #070605 100%); }
.lock { position:absolute; inset:0; background:linear-gradient(160deg,#3A2A1C 0%,#1B1410 60%,#0B0806 100%); z-index:30; }
`;
const kick = (p, text, at, color = 'var(--red)') => { p.ev(at); return p.kicker(text, at, color); };
/** headline in the left zone */
const H = (p, text, at, { size = 84, x = LX, y = 130, w = LW, stagger = 0.06, color, kicker, kat, extra = '' } = {}) =>
  `<div class="hl" style="left:${x}px;top:${y}px;width:${w}px;${color ? `color:${color};` : ''}">${kicker ? kick(p, kicker, kat ?? at - 0.15) : ''}<h1 style="font-size:${size}px">${p.words(p.id_('h'), text, at, { stagger })}</h1>${extra}</div>`;
const chip = (p, text, at, x, y, kind = 'chip light') => p.chip(text, at, { kind, x, y });
const stack = (p, items, { x = LX, y = 430, pitch = 96 } = {}) => items.filter(Boolean).map(([t, at, kind = 'chip light'], i) => chip(p, t, at, x, y + i * pitch, kind)).join('');
const stamp = (p, text, at, o = {}) => p.stamp(text, at, { size: 56, ...o });
/** a sticker (cut-out illustration) with a pop sound and a life loop */
const stk = (p, name, at, o = {}) => {
  const dir = fs.existsSync(path.join(STK, name + '.png')) ? STK : fs.existsSync(path.join(ED1STK, name + '.png')) ? ED1STK : ICONS;
  return p.icon(name, at, { dir, sfx: o.sfx ?? path.join(ED1SFX, ['pop-1.wav', 'pop-2.wav', 'pop-3.wav'][p.uid % 3]), db: -16, until: o.until ?? at + 12, ...o });
};
/** a drawn photograph as a print on the page */
const prt = (p, key, at, o = {}) => {
  const f = [path.join(DRAWN, key + '.jpg'), path.join(REAL, key + '.jpg'), path.join(REAL, key + '.png'), key].find((x) => fs.existsSync(x));
  return p.print(f, at, { x: o.x ?? 640, y: o.y ?? 180, w: o.w ?? 520, rot: o.rot ?? 2, caption: o.caption || '' });
};
/** name card: slides in from the left on a red bar */
const nameCard = (p, at, { x = LX, y = 640, role, name, note = '' }) => {
  const id = p.id_('nm');
  p.tl.push(`tl.fromTo("#${id}", {xPercent:-130}, {xPercent:0, duration:${SP.heavy}, ease:"sp-heavy"}, ${n3(at)});`); p.ev(at);
  efx(p, 'whip.wav', at, -19);
  return `<div style="position:absolute;left:0;top:${y}px;overflow:hidden;padding:0 40px 20px 0"><div id="${id}" style="margin-left:${x}px;background:#FCF5E8;padding:18px 32px;border-left:12px solid var(--red);box-shadow:10px 12px 0 rgba(26,22,18,.85)"><div class="mono" style="font-size:21px;letter-spacing:.2em;color:var(--red);font-weight:700">${role}</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:54px;line-height:1.05">${name}</div>${note ? `<div class="mono" style="font-size:20px;margin-top:6px;color:var(--muted)">${note}</div>` : ''}</div></div>`;
};
/** a cream card that grows in */
const card = (p, inner, at, { x = LX, y = 300, w = 900, rot = 0, pad = '26px 34px', cls = '' } = {}) => {
  const id = p.id_('cd'); if (at != null) p.grow(id, at, { rot, from: 0.8, dy: 40 });
  return `<div id="${id}" class="ccard ${cls}" style="left:${x}px;top:${y}px;width:${w}px;padding:${pad}">${inner}</div>`;
};
/** a quotation on a card, words rising */
const quote = (p, text, at, { who = '', x = LX, y = 300, w = 1000, size = 64, stagger = 0.07, cardAt } = {}) => card(p,
  `${who ? `<div class="mono" style="font-size:22px;font-weight:700;letter-spacing:.2em;color:var(--red);margin-bottom:10px">${who}</div>` : ''}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:${size}px;line-height:1.08">${p.words(p.id_('q'), text, at, { stagger })}</div>`, cardAt ?? at - 0.12, { x, y, w });
/** dateline in typewriter type, boxed in red, with the suspense sting */
const dateline = (p, text, at, { x = LX, y = 150, size = 58, sting = true } = {}) => {
  const id = p.id_('dl'); p.grow(id, at - 0.05, { from: 0.7, dy: 20, preset: 'snappy' });
  if (sting) fx(p, path.join(PSFX, 'syn-suspense.wav'), at - 0.1, -14);
  return `<div id="${id}" class="dl" style="left:${x}px;top:${y}px;font-size:${size}px">${p.typed(text, at + 0.1, { cps: 22, cls: 'tw' })}</div>`;
};
/** a number that rolls up */
const counter = (p, at, to, { size = 200, color = 'var(--ink)', suffix = '', prefix = '', dur = 1.3, from = 0, fmt = true } = {}) => {
  const id = p.id_('ct');
  p.tl.push(`tl.fromTo("#${id}", {innerText:${from}}, {innerText:${to}, duration:${dur}, ease:"power2.out", snap:{innerText:1}${fmt ? `, onUpdate:function(){var e=document.getElementById("${id}");var v=parseInt(String(e.textContent).replace(/[^0-9]/g,""))||0;e.textContent=v.toLocaleString("en-GB");}` : ''}}, ${n3(at)});`);
  p.ev(at); p.ev(at + dur); efx(p, 'coins.wav', at + dur - 0.2, -22);
  return `<span style="font-family:'Playfair Display',serif;font-weight:900;font-size:${size}px;line-height:1;color:${color};white-space:nowrap">${prefix}<span id="${id}">${from}</span>${suffix}</span>`;
};
/** wrap html so it can be swished up and away when something new takes its place */
const away = (p, html, t, { y = -1300, rot = -8, x = 0 } = {}) => { const id = p.id_('aw');
  p.tl.push(`tl.to("#${id}", {y:${y}, x:${x}, rotation:${rot}, duration:0.55, ease:"power3.in", immediateRender:false}, ${n3(t)});`); p.ev(t); p.sound('whoosh-1.mp3', t, -21);
  return `<div id="${id}" style="position:absolute;inset:0;pointer-events:none">${html}</div>`; };
/** a strike-through bar drawn across a word */
const strikeWord = (p, text, at, { size = 72, color = 'var(--ink)' } = {}) => { const id = p.id_('sk');
  p.tl.push(`tl.fromTo("#${id}", {scaleX:0}, ${JSON.stringify({ scaleX: 1, ...spr('snappy') })}, ${n3(at)});`); p.ev(at); efx(p, 'whip.wav', at, -18);
  return `<span class="strike" style="font-family:'Playfair Display',serif;font-weight:900;font-size:${size}px;color:${color}">${text}<i id="${id}"></i></span>`; };
/** small Ghana flag (drawn) */
const ghanaFlag = (w = 300) => `<svg width="${w}" height="${w * 2 / 3}" viewBox="0 0 300 200" style="display:block;box-shadow:0 18px 30px -12px rgba(40,25,10,.45)"><rect width="300" height="67" fill="#CE1126"/><rect y="67" width="300" height="66" fill="#FCD116"/><rect y="133" width="300" height="67" fill="#006B3F"/><path d="M150 72l9.4 29h30.5l-24.7 18 9.4 29L150 130l-24.6 18 9.4-29-24.7-18h30.5z" fill="#000"/></svg>`;
const sceneP = (p, a, b, html, o = {}) => p.scene(a, b, html, { bg: 'paper', drift: 0.025, ...o });
// keeps time windows where the phone is on screen (for the captions' layout)
const done = (p) => { p.mast = p.mast ?? true; return p; };


// ---------------------------------------------------------------------------
// Remotion data cards: rclip() asks for a composition with props (times in seconds from the clip's start), renders
// it once (cached by a hash of the props) and places it on the page as a moving print.
export const RCLIPS = [];
const RDIR = '/home/user/gcp/sp2/build/remotion';
const rclip = (p, comp, start, end, props, { x = LX, y = 200, w = 1000, rot = -1.5, caption = '' } = {}) => {
  const dur = +(end - start + 0.6).toFixed(2);
  const full = { duration: dur, width: 1280, height: 720, fps: 30, ...props };
  const h = crypto.createHash('md5').update(comp + JSON.stringify(full)).digest('hex').slice(0, 10);
  const file = `${RDIR}/${comp}-${h}.mp4`;
  RCLIPS.push({ comp, props: full, file });
  if (!fs.existsSync(file)) return null;   // build.mjs renders missing clips, then builds again
  p.vprint(file, start, end, { x, y, w, rot, caption });
  return file;
};

// ---------------------------------------------------------------------------
// COLD OPEN — 11:12 pm, Thursday 12 November, six years since he died. Kwame drops a grenade into the group.
export function cold() {
  const [p, c, s] = make('cold');
  p.mast = false; p.css.push(SP2_CSS);
  const lit = 0.35, unlock = cs(c, 'at 12 minutes') + 1.6;
  const toRight = unlock + 0.55;
  const six = cs(c, 'six years to the day'), jj = cs(c, 'jerry john rawlings'), kb = cs(c, 'korle-bu'), kw = cs(c, 'kwame'), gren = cs(c, 'dropped a grenade'),
    yrs = cs(c, '19 years in power'), dey = cs(c, 'and ghana still dey', 'ghana still dey');
  p.scene(0, s.dur, `<div class="room"></div>`, { bg: 'none', enter: 'cut', drift: 0 });
  const ph = new Phone(p, { pinned: null, start: 0, enter: null, clock0: '11:12', x: 710, y: 25, rot: 0 });
  ph.divider('Today', lit + 0.05);
  ph.msg({ who: 'Kwame', text: 'Six years today since JJ died. My uncle’s status is all “Junior Jesus” 🙄', time: '11:12 pm', at: lit + 0.1 });
  ph.typing('Kwame', gren - 0.2, yrs - 0.3);
  ph.msg({ who: 'Kwame', text: '19 YEARS in power. 19!! And Ghana still dey like this?', time: '11:12 pm', at: yrs - 0.3 });
  ph.focus(yrs - 0.2, 3.0, { s: 1.12, dx: -120 });
  const pid = ph.build();
  p.tl.push(`tl.fromTo("#${pid}", {x:0}, ${JSON.stringify({ x: PHONE.x - 710, ...spr('heavy') })}, ${n3(toRight)});`); p.ev(toRight);
  p.tl.push(`tl.fromTo("#${pid}", {opacity:0}, {opacity:1, duration:0.1, ease:"none"}, 0.25);`);
  const lk = p.id_('lk');
  p.html.push(`<div id="${lk}" class="clip" data-start="0" data-duration="${n3(unlock + 0.6)}" data-track-index="6" style="position:absolute;left:${710 + 19}px;top:${25 + 19}px;width:${PHONE.w - 38}px;height:${PHONE.h - 38}px;border-radius:60px;overflow:hidden;z-index:760;font-family:'Inter','Noto Color Emoji',sans-serif;color:#fff">
    <div class="lock"></div>
    <div style="position:absolute;left:0;right:0;top:120px;text-align:center;z-index:31;font-size:22px;font-weight:600;opacity:.85">Thursday 12 November</div>
    <div style="position:absolute;left:0;right:0;top:146px;text-align:center;z-index:31;font-size:120px;font-weight:700;letter-spacing:-2px">11:12</div>
    <div id="${lk}-n" style="position:absolute;left:16px;right:16px;top:330px;z-index:32;background:rgba(60,52,46,.82);border-radius:26px;padding:16px 18px;display:flex;gap:14px">
      <div style="width:46px;height:46px;border-radius:12px;background:#25D366;flex:none;display:flex;align-items:center;justify-content:center"><svg width="30" height="30" viewBox="0 0 32 32"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3z" fill="#fff"/><path d="M11.5 9.5c.4-.9 1-.9 1.4-.9h1c.3 0 .7 0 1 .8l1.2 2.9c.1.3.1.6-.1.9l-.8 1c-.2.2-.3.5 0 .9a9 9 0 0 0 4.3 3.8c.4.2.7.1.9-.1l1-1.2c.3-.3.6-.3.9-.2l2.8 1.3c.4.2.6.3.6.6 0 .4 0 1.9-1.2 2.7-1 .7-2.6 1-4.9 0-3.4-1.5-6-4.5-6.8-5.8-.8-1.2-2-3.4-.3-6.7z" fill="#25D366"/></svg></div>
      <div style="min-width:0"><div style="font-size:17px;font-weight:700">GCP Team 🗞️ <span style="font-weight:400;opacity:.6;float:right;margin-left:20px">now</span></div><div style="font-size:18px;margin-top:3px;line-height:1.3">Kwame: Six years today since JJ died. My uncle’s status is all “Junior Jesus” 🙄</div></div></div>
  </div>`);
  p.tl.push(`tl.fromTo("#${lk}-n", {y:-260, scale:0.9}, ${JSON.stringify({ y: 0, scale: 1, ...spr('snappy') })}, ${n3(lit + 0.35)});`);
  p.tl.push(`tl.fromTo("#${lk}", {opacity:0}, {opacity:1, duration:0.1, ease:"none"}, ${n3(lit)});`);
  p.tl.push(`tl.to("#${lk}", {yPercent:-102, duration:0.5, ease:"power3.in", immediateRender:false}, ${n3(unlock)});`);
  p.ev(lit); p.ev(unlock);
  fx(p, 'vibrate.wav', lit + 0.3, -12); fx(p, 'wa-notify.wav', lit + 0.38, -12); fx(p, 'unlock.wav', unlock, -14);
  // left side: the hour and the date, the man (1947–2020), Kwame, the grenade, nineteen years
  p.scene(toRight + 0.4, jj - 0.3, `
    <div style="position:absolute;left:${LX}px;top:160px">${p.typed('11:12 PM · THURSDAY', toRight + 0.6, { cps: 18, cls: 'tw' }).replace('class="tw"', 'class="tw" style="font-size:70px;color:#F3EBD7"')}</div>
    ${chip(p, '12 NOVEMBER · SIX YEARS TO THE DAY', six, LX, 300, 'chip gold')}`, { bg: 'none', enter: 'cut', drift: 0 });
  p.scene(jj - 0.3, kw - 0.2, `
    ${prt(p, 'rawlings-civilian', jj - 0.2, { x: LX + 40, y: 110, w: 430, rot: -2.5 })}
    ${nameCard(p, jj, { x: 640, y: 250, role: '1947 – 2020', name: 'Jerry John Rawlings' })}
    ${chip(p, 'died at Korle-Bu, 12 November 2020', kb, 640, 470, 'chip light')}`, { bg: 'none', enter: 'wipeL', drift: 0 });
  p.scene(kw - 0.2, s.dur, `
    ${nameCard(p, kw, { y: 130, role: 'IN THE TEAM CHAT · GCP TEAM 🗞️', name: 'Kwame, The Combative' })}
    ${stk(p, 'kwame-boxer', gren - 0.1, { x: 940, y: 300, w: 280, rot: 4, life: 'jiggle', sfx: path.join(ED1SFX, 'boom.wav') })}
    ${(() => { const g = p.id_('yg'); p.grow(g, yrs - 0.3, { from: 0.4, dy: 80, preset: 'heavy' }); return `<div id="${g}" style="position:absolute;left:${LX}px;top:400px">${counter(p, yrs - 0.2, 19, { size: 200, suffix: ' years', fmt: false, color: '#F3EBD7' })}</div>`; })()}
    ${chip(p, '…and Ghana still dey like this?', dey, LX, 680, 'chip red')}`, { bg: 'none', enter: 'wipeU', drift: 0 });
  fx(p, 'crickets.wav', 0.2, -24, Math.min(24, s.dur));
  return p;
}

// ---------------------------------------------------------------------------
export function combo() { const p = combo1(SEGMENTS.combo1); return p; }


// ---------------------------------------------------------------------------
// The newsprint frame of the cards (title, pinned questions, closing).
const PLACES = 'NINETEEN YEARS · THE RAWLINGS QUESTION · BURMA CAMP · MAKOLA · KORLE-BU · OSU CASTLE · ACCRA · KUMASI · TAMALE';
const frameCard = (p, at, { stampText = 'A GOLD COAST PALAVA SPECIAL', band = true } = {}) => {
  const hd = p.id_('fh'), rl = p.id_('fr'), bd = p.id_('fb'), sym = p.id_('fs');
  p.tl.push(`tl.fromTo("#${hd}", {yPercent:-160}, ${JSON.stringify({ yPercent: 0, ...spr('default') })}, ${n3(at)});`);
  p.tl.push(`tl.fromTo("#${sym}", {scale:0.3, rotation:-25}, ${JSON.stringify({ scale: 1, rotation: 0, ...spr('heavy') })}, ${n3(at + 0.05)});`);
  p.tl.push(`tl.fromTo("#${rl}", {scaleX:0}, ${JSON.stringify({ scaleX: 1, ...spr('default') })}, ${n3(at + 0.15)});`);
  if (band) p.tl.push(`tl.fromTo("#${bd}", {yPercent:110}, ${JSON.stringify({ yPercent: 0, ...spr('default') })}, ${n3(at + 0.1)});`);
  if (band) p.tl.push(`tl.fromTo("#${bd}-t", {x:0}, {x:-260, duration:${n3(p.dur + 2)}, ease:"none"}, ${n3(at)});`);
  p.ev(at);
  return `<div class="mk" style="position:absolute;left:110px;top:70px;overflow:hidden;padding:20px 0"><div id="${hd}" style="display:flex;align-items:center;gap:28px"><div id="${sym}" style="width:96px;height:96px">${SYMBOL_SVG}</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:66px;letter-spacing:-.01em">Gold Coast Palava</div></div></div>
    ${p.stamp(stampText, at + 0.45, { x: stampText.length > 14 ? 1268 : 1530, y: 92, rot: -3, size: stampText.length > 14 ? 30 : 34, sfx: 'stamp-2.mp3' }).replace('class="stamp"', 'class="stamp tw"')}
    <div id="${rl}" style="position:absolute;left:110px;top:200px;width:1700px;height:7px;border-top:2px solid var(--ink);border-bottom:2px solid var(--ink);transform-origin:0 50%"></div>
    ${band ? `<div style="position:absolute;left:0;right:0;bottom:22px;height:104px;overflow:hidden"><div id="${bd}" style="position:absolute;inset:0;background:var(--ink);overflow:hidden"><div id="${bd}-t" class="tw" style="position:absolute;left:110px;top:30px;white-space:nowrap;font-size:34px;color:#F3EBD7;letter-spacing:.02em">${PLACES} · ${PLACES}</div></div></div><div class="kente" style="bottom:0;top:auto;height:22px;background-size:auto 22px"></div>` : ''}`;
};

// WELCOME — "My squad, how you dey?" The live title card, the shape of tonight, Special No. 1, the rule.
export function welcome() {
  const [p, c, s] = make('welcome');
  p.mast = false; p.css.push(SP2_CSS, PHONE_CSS);
  const title = cs(c, 'and this is a gold coast'), one = cs(c, 'one man'), chat = cs(c, 'and a chat that'), stands = cs(c, 'it stands on its own'),
    first = cs(c, 'our first special'), rule = cs(c, 'and one rule');
  // A — the title card, live: "My squad, how you dey?" holds, then THIS IS A GOLD COAST PALAVA SPECIAL types and the title rises
  const myp = p.id_('mp');
  p.tl.push(`tl.to("#${myp}", {y:-1150, duration:0.55, ease:"power3.in", immediateRender:false}, ${n3(title - 0.75)});`); p.ev(title - 0.75); p.sound('whoosh-2.mp3', title - 0.75, -20);
  p.scene(0, one - 0.15, `${frameCard(p, 0.05, { stampText: 'SPECIAL No. 2' })}
    <div id="${myp}" class="hl" style="left:110px;top:330px;width:1700px"><h1 style="font-size:150px">${p.words(p.id_('w'), 'My squad, how you dey?', 0.2, { stagger: 0.09 })}</h1>
      <div class="sub" style="font-size:58px">${p.words(p.id_('w'), 'I am *Kofi*, the Editor.', cs(c, 'i am kofi'), { stagger: 0.08 })}</div></div>
    <div style="position:absolute;left:110px;top:290px">${p.typed('THIS IS A GOLD COAST PALAVA SPECIAL', title - 0.3, { cps: 26, cls: 'tw' }).replace('class="tw"', 'class="tw" style="font-size:44px"')}</div>
    <div class="hl" style="left:110px;top:360px;width:1700px"><h1 style="font-size:132px;line-height:1.0">${p.words(p.id_('w'), 'Nineteen Years: *The Rawlings Question*', title + 0.3, { stagger: 0.1 })}</h1></div>`,
  { bg: 'paper', enter: 'cut', drift: 0.02 });
  // B — one man, four questions, and a chat that refused to sleep (phone: the group's five members)
  const qs = ['What exactly did he inherit?', 'People’s power, or one man’s power?', 'Did the revolution sell out to the IMF?', 'Then why didn’t nineteen years transform us?'];
  const four = cs(c, 'four questions');
  const qcards = qs.map((q, i) => { const id = p.id_('qc'); const at = four + 0.1 + i * 0.3; p.grow(id, at, { rot: [-4, 3, -2, 4][i], from: 0.5, dy: 120, preset: 'snappy' }); efx(p, ['pop-1.wav', 'pop-2.wav', 'pop-3.wav'][i % 3], at, -16);
    return `<div id="${id}" style="position:absolute;left:${LX + (i % 2) * 540}px;top:${360 + Math.floor(i / 2) * 250}px;width:500px;background:#FCF5E8;border:4px solid var(--ink);box-shadow:8px 10px 0 var(--ink);padding:18px 22px"><div class="tw" style="font-size:20px;color:var(--red)">QUESTION ${['ONE', 'TWO', 'THREE', 'FOUR'][i]} · PINNED</div><div style="font-family:'Playfair Display',serif;font-weight:900;font-size:36px;line-height:1.08;margin-top:6px">${q}</div></div>`; }).join('');
  p.scene(one - 0.15, stands - 0.1, `${H(p, 'One man. *Four questions.*', one, { size: 92, y: 130 })}${qcards}`, { enter: 'wipeU' });
  const gi = p.id_('gi');
  p.html.push(`<div id="${gi}" class="clip" data-start="${n3(chat - 0.3)}" data-duration="${n3(stands - chat + 1.2)}" data-track-index="7" style="position:absolute;left:${PHONE.x}px;top:${PHONE.y}px;width:${PHONE.w}px;height:${PHONE.h}px;z-index:700">
    <div id="${gi}-f" class="ph" style="left:0;top:0"><div class="ph-body"></div><div class="ph-bez"></div><div class="ph-scr" style="background:#0B141A">
      <div class="ph-island"></div><div class="ph-status"><div class="clk"><span style="opacity:1">1:40</span></div></div>
      <div style="position:absolute;left:0;right:0;top:80px;text-align:center"><div style="width:140px;height:140px;border-radius:50%;background:#F3EBD7;padding:20px;margin:0 auto">${SYMBOL_SVG}</div>
        <div style="font-size:34px;font-weight:600;margin-top:16px">GCP Team 🗞️</div><div style="font-size:19px;color:#8696A0;margin-top:6px">Group · 5 participants</div></div>
      <div style="position:absolute;left:18px;right:18px;top:380px;background:#111B21;border-radius:18px;padding:6px 0">
        ${[['Kofi', 'You · Editor', '#53BDEB'], ['Aba', 'The Restless', '#FFC86B'], ['Amo', 'The Discerning', '#C39BFF'], ['Baaba', 'The Ascendant', '#4FD1A5'], ['Kwame', 'The Combative', '#FF7C98']].map(([nm, t, col], i) => { const id = `${gi}-m${i}`; p.tl.push(`tl.fromTo("#${id}", {x:120, opacity:0}, ${JSON.stringify({ x: 0, opacity: 1, ...spr('snappy') })}, ${n3(chat + 0.4 + i * 0.3)});`); fx(p, i % 2 ? 'wa-in2.wav' : 'wa-in.wav', chat + 0.4 + i * 0.3, -18);
          return `<div id="${id}" style="display:flex;align-items:center;gap:16px;padding:12px 18px"><div style="width:56px;height:56px;border-radius:50%;background:${col};display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:#0B141A">${nm[0]}</div><div><div style="font-size:23px;font-weight:600">${nm}</div><div style="font-size:17px;color:#8696A0">${t}</div></div></div>`; }).join('')}
      </div><div class="ph-glass"></div><div class="ph-home"></div></div></div></div>`);
  p.tl.push(`tl.fromTo("#${gi}-f", {y:1250, rotation:6}, ${JSON.stringify({ y: 0, rotation: -1.2, ...spr('heavy') })}, ${n3(chat - 0.3)});`);
  p.tl.push(`tl.to("#${gi}-f", {y:1300, rotation:-9, duration:0.55, ease:"power3.in", immediateRender:false}, ${n3(stands + 0.3)});`);
  p.sound('whoosh-1.mp3', chat - 0.35, -16); p.sound('whoosh-2.mp3', stands + 0.3, -18); p.ev(chat - 0.3);
  p.phoneWin = [[n3(p.T0 + chat - 0.3), n3(p.T0 + stands + 0.9)]];
  // C — it stands on its own; our earlier editions and Special No. 1 on Chris Hesse
  p.scene(stands - 0.1, rule - 0.15, `${H(p, 'It stands on its own…', stands, { size: 84, w: 1000 })}
    ${chip(p, '…but watch our earlier editions', cs(c, 'earlier editions'), LX, 300, 'chip light')}
    ${prt(p, 'hesse-camera', first - 0.1, { x: 1150, y: 200, w: 480, rot: 3, caption: 'Special No. 1 · Rev. Chris Hesse' })}
    ${chip(p, 'the cameraman who filmed every government', cs(c, 'the cameraman'), LX, 400, 'chip gold')}
    ${chip(p, 'from Nkrumah to Rawlings', cs(c, 'from nkrumah'), LX, 496, 'chip light')}
    ${stk(p, 'comments-pin', cs(c, 'go back and watch'), { x: 150, y: 640, w: 250, rot: -6, life: 'bob' })}
    ${chip(p, 'they make tonight richer', cs(c, 'they make tonight'), 420, 720, 'chip red')}`, { enter: 'wipeL' });
  // D — the rule: not worship, not crucify; weigh
  p.scene(rule - 0.15, s.dur, `${H(p, 'One rule.', rule, { size: 96, kicker: 'BEFORE WE START' })}
    <div style="position:absolute;left:${LX}px;top:350px">${strikeWord(p, 'worship him', cs(c, 'worship this man') + 0.5, { size: 96 })}</div>
    <div style="position:absolute;left:${LX}px;top:490px">${strikeWord(p, 'crucify him', cs(c, 'crucify him') + 0.4, { size: 96 })}</div>
    <div style="position:absolute;left:${LX}px;top:650px;font-family:'Playfair Display',serif;font-weight:900;font-size:120px;color:var(--red)">${p.words(p.id_('w'), 'We will weigh him.', cs(c, 'we will weigh him'), { stagger: 0.1 })}</div>
    ${stk(p, 'scales-balance', cs(c, 'we will weigh him') + 0.2, { x: 1150, y: 300, w: 560, rot: 3, life: 'sway', until: s.dur + 1 })}`, { enter: 'wipeU' });
  p.sound('syn-boop.wav', 0.0, -30);
  return p;
}

// ---------------------------------------------------------------------------
// PINNED CARDS — each question lands as a big pinned message: frame assembles, kicker types, question rises, pin drops.
const PINS = {
  pinq1: { k: 'QUESTION ONE · PINNED 11:19 PM', q: 'What exactly did he inherit?', size: 160 },
  pinq2: { k: 'QUESTION TWO · PINNED 11:38 PM', q: 'People’s power, or one man’s power?', size: 140 },
  pinq3: { k: 'QUESTION THREE · PINNED 12:04 AM', q: 'Did the revolution sell out to the IMF?', size: 140 },
  pinq4: { k: 'QUESTION FOUR · PINNED 12:44 AM', q: 'Then why didn’t nineteen years transform us?', size: 126 },
  pinlesson: { k: 'THE LEDGER · PINNED 1:31 AM', q: 'Editor, verdict abeg.', size: 170 },
};
const pinned = (key) => () => {
  const s = SEGMENTS[key]; const p = new Part({ ...s }); p.mast = false; p.css.push(SP2_CSS);
  const { k, q, size } = PINS[key];
  const pin = p.id_('pn');
  p.tl.push(`tl.fromTo("#${pin}", {y:-500, rotation:-40}, ${JSON.stringify({ y: 0, rotation: -14, ...spr('playful') })}, 1.35);`); p.ev(1.35);
  fx(p, 'wa-pin.wav', 1.62, -10); fx(p, 'pin-thud.wav', 1.6, -12);
  p.scene(0, s.dur, `${frameCard(p, 0.05)}
    <div style="position:absolute;left:110px;top:296px">${p.typed(k, 0.35, { cps: 30, cls: 'tw' }).replace('class="tw"', 'class="tw" style="font-size:40px"')}</div>
    <div class="hl" style="left:110px;top:375px;width:1580px"><h1 style="font-size:${size}px;line-height:1.0">${p.words(p.id_('w'), q, 0.6, { stagger: 0.08 })}</h1></div>
    <svg id="${pin}" style="position:absolute;left:1700px;top:250px" width="110" height="110" viewBox="0 0 24 24"><path d="M16 3l5 5-3 1-4 4 1 5-2 2-4-4-5 5-1-1 5-5-4-4 2-2 5 1 4-4z" fill="#A4241B" stroke="#1A1612" stroke-width=".8"/></svg>`,
  { bg: 'paper', enter: 'wipeU', drift: 0.03 });
  fx(p, path.join(PSFX, 'heavy-swoosh.mp3'), -0.15, -6);
  fx(p, path.join(PSFX, 'heavy-swoosh.mp3'), s.dur - 0.7, -8);
  return p;
};

// ---------------------------------------------------------------------------
// CLOSE — the closing card, the Nest named, then COMBO2 and COMBO3.
export function close() {
  // no closing line in the client's recording: the card plays over the theme, timed by itself
  const s = SEGMENTS.close; const p = new Part({ ...s }); p.mast = false; p.css.push(SP2_CSS);
  p.scene(0, s.dur, `${frameCard(p, 0.0, { stampText: 'SPECIAL No. 2' })}
    <div style="position:absolute;left:110px;top:296px">${p.typed('THIS HAS BEEN', 0.1, { cps: 22, cls: 'tw' }).replace('class="tw"', 'class="tw" style="font-size:40px"')}</div>
    <div class="hl" style="left:110px;top:370px;width:1200px"><h1 style="font-size:150px;line-height:1.0">${p.words(p.id_('w'), 'A Gold Coast Palava Special', 0.7, { stagger: 0.09 })}</h1></div>
    <div class="hl" style="left:110px;top:720px;width:1200px"><div class="sub" style="font-size:52px;margin-top:0;color:var(--ink)">${p.words(p.id_('w'), 'We will meet you back at the Nest. *Cheers.*', 2.3, { stagger: 0.08 })}</div></div>
    ${p.print(NEST, 2.6, { x: 1270, y: 330, w: 540, rot: 3, caption: 'The Nest · 266 Sandpiper Loop' })}`, { bg: 'paper', enter: 'wipeU', drift: 0.025 });
  fx(p, path.join(PSFX, 'heavy-swoosh.mp3'), -0.15, -8);
  return p;
}
export function outro() {
  const s = SEGMENTS.outro; const p = new Part({ ...s }); p.mast = false; p.css.push(BANNER_CSS);
  const bn = banner(p, 'ob', { t0: 0.2, speed: 1.15, until: s.dur - 3.0 });
  const sub = p.chip('SUBSCRIBE — so the next one finds you', 3.2, { kind: 'chip red sub-sm' });
  const fold = s.dur - 3.0;
  p.tl.push(`tl.to("#ob-sym", ${JSON.stringify({ x: 494, y: -95, scale: 3.0, duration: SP.heavy, ease: 'sp-heavy', immediateRender: false })}, ${fold});`);
  p.tl.push(`tl.to("#ob > :not(#ob-sym)", {opacity:0, scale:0.6, duration:0.5, ease:"power2.in", immediateRender:false}, ${fold});`);
  p.ev(fold); p.ev(7); p.ev(10);
  p.sound('whoosh-2.mp3', fold, -12);
  p.scene(0, s.dur, `${bn}<div style="position:absolute;left:0;right:0;top:690px;text-align:center">${sub}</div>`, { drift: 0.03, bg: 'plain', enter: 'iris' });
  return p;
}
// COMBO3 — THE COLOPHON, one block at a time, in silence, then black.
const COLOPHON = [
  ['THE COLOPHON', ['SPECIAL No. 2', 'NINETEEN YEARS: THE RAWLINGS QUESTION']],
  ['CORRECTIONS &amp; CLARIFICATIONS', ['NONE THIS SPECIAL.']],
  ['SOURCES &amp; FURTHER READING', ['KWAMENA AHWOI. WORKING WITH RAWLINGS. DIGIBOOKS GHANA, 2020.', 'JEFFREY HAYNES. REVOLUTION AND DEMOCRACY IN GHANA. ROUTLEDGE, 2023.', 'KEVIN SHILLINGTON. GHANA AND THE RAWLINGS FACTOR. MACMILLAN, 1992.', 'WORLD BANK. GHANA: PROMOTING GROWTH, REDUCING POVERTY. 1995.', 'GRAPHIC · MYJOYONLINE · GHANAWEB · DAILY GUIDE · WIKIPEDIA.']],
  ['THE MASTHEAD', ['<span class="dl"><b>EDITOR</b><i></i><b>KOFI</b></span>', '<span class="dl"><b>THE RESTLESS</b><i></i><b>ABA</b></span>', '<span class="dl"><b>THE ASCENDANT</b><i></i><b>BAABA</b></span>', '<span class="dl"><b>THE COMBATIVE</b><i></i><b>KWAME</b></span>', '<span class="dl"><b>THE DISCERNING</b><i></i><b>AMO</b></span>']],
  ['PRODUCTION', ['WRITTEN, EDITED AND NARRATED BY JOSHUA HORLORTU', 'THEME MUSIC BY GONJE GROUP, LEGON']],
  ['FINE PRINT', ['THE NEST NEWSROOM AND THE GCP TEAM CHAT ARE FICTIONAL DEVICES.', 'PRINTED AT THE NEST, 266 SANDPIPER LOOP, ONIPA ENCLAVE.', '© 2026 GOLD COAST PALAVA.']],
];
export function credits() {
  const s = SEGMENTS.credits; const p = new Part({ ...s }); p.mast = false;
  p.css.push(`.colo { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; text-align:center; }
    .colo .slot { position:absolute; left:0; right:0; top:50%; transform:translateY(-50%); display:flex; justify-content:center; overflow:hidden; padding:6px 0; }
    .colo .blk { width:900px; }
    .colo h4 { font-family:'IBM Plex Mono',monospace; font-weight:700; font-size:19px; letter-spacing:.26em; color:var(--red); margin-bottom:10px; }
    .colo p { font-family:'Playfair Display',serif; font-size:21px; line-height:1.45; color:var(--ink); text-transform:uppercase; letter-spacing:.06em; }
    .colo .dl { display:flex; align-items:baseline; gap:8px; width:480px; margin:0 auto; }
    .colo .dl b { font-weight:400; } .colo .dl i { flex:1; border-bottom:2px dotted rgba(26,22,18,.55); position:relative; top:-5px; }
    .colo .blur { position:absolute; inset:-30px; background:url(assets/papers-bg.jpg) center/cover; filter:blur(11px); opacity:.6; }`);
  const nb = COLOPHON.length, span = (s.dur - 0.8) / nb;
  const blocks = COLOPHON.map(([h, lines], i) => {
    const id = `colo${i}`, t0 = 0.05 + i * span, t1 = t0 + span - 0.12;
    p.tl.push(`tl.fromTo("#${id}", {yPercent:140}, {yPercent:0, duration:0.32, ease:"sp-snappy"}, ${t0.toFixed(3)});`);
    if (i < nb - 1) p.tl.push(`tl.to("#${id}", {yPercent:-140, duration:0.18, ease:"power2.in", immediateRender:false}, ${t1.toFixed(3)});`);
    p.ev(t0);
    return `<div class="slot"><div id="${id}" class="blk"><h4>${h}</h4>${lines.map((l) => `<p>${l}</p>`).join('')}</div></div>`;
  }).join('');
  const fadeAt = s.dur - 0.8;
  p.tl.push(`tl.fromTo("#colo-black", {opacity:0}, {opacity:1, duration:0.6, ease:"power1.inOut"}, ${fadeAt.toFixed(2)});`);
  p.ev(fadeAt);
  p.scene(0, s.dur, `<div class="blur"></div><div class="colo">${blocks}</div><div id="colo-black" style="position:absolute;inset:0;background:#000;opacity:0"></div>`, { enter: 'cut', drift: 0.02, bg: 'paper' });
  p.sfx = [];
  return p;
}

export const BUILDERS = { cold, combo1: combo, welcome, pinq1: pinned('pinq1'), pinq2: pinned('pinq2'), pinq3: pinned('pinq3'), pinq4: pinned('pinq4'), pinlesson: pinned('pinlesson'), close, outro, credits };
export const HELPERS = { make, cs, fx, efx, H, chip, stack, stamp, stk, prt, nameCard, card, quote, dateline, counter, away, strikeWord, ghanaFlag, sceneP, kick, LX, LW, SP2_CSS, Phone, PHONE, n3, spr, MEDIA, SFX, ED1SFX, PSFX, NEST, rclip };
