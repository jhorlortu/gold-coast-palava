// Social reel (9:16) — Special No. 1, "The Eyes of Ghana: Rev. Chris Hesse": voice + SFX, no music, ~2:10.
// Opens on the walking stick, then Aba's late-night question on Kofi's phone, the vertical montage, and the story's
// catchiest beats in order; ends on Kofi's own closing line and the end card ("Watch the full Special on YouTube").
import fs from 'node:fs';
import { loadReel, captions, hl, kick, nameCard, counter, tallPic, endCard, bannerP, enrichSfx, X0, SP } from './rlib.mjs';
import { Phone, PHONE_CSS } from '/home/user/gcp/sp1/build/phone.mjs';
const M = '/home/user/gcp/sp1/media', E1 = '/home/user/gcp/ed1/media';
const img = (k) => [`${M}/drawn/${k}.jpg`, `${M}/real/${k}.jpg`, `${M}/real/${k}.png`].find((f) => fs.existsSync(f));
const n3 = (v) => +(+v).toFixed(3);
const spr = (k) => ({ duration: SP[k], ease: `sp-${k}` });

export function build() {
  const { R, p, c, at, win } = loadReel('/home/user/gcp/reels/sp1', 'FULL SPECIAL ON YOUTUBE');
  p.css.push(PHONE_CSS, `@font-face { font-family:'Special Elite'; src:url('assets/special-elite.ttf') format('truetype'); }
    @font-face { font-family:'Noto Color Emoji'; src:url('assets/noto-emoji.ttf') format('truetype'); }
    .tw { font-family:'Special Elite','IBM Plex Mono',monospace; }
    .rcard { position:absolute; background:#FCF5E8; border:6px solid var(--ink); box-shadow:14px 16px 0 var(--ink); padding:34px 40px; }`);
  const fx = (f, t, db = -16, len) => p.sfx.push({ file: f.startsWith('/') ? f : `${M}/sfx/${f}`, T: n3(t), db, ...(len ? { len } : {}) });
  const e1 = (f, t, db = -16, len) => fx(`${E1}/sfx/${f}`, t, db, len);
  const st = (name, t, o = {}) => { const dir = fs.existsSync(`${M}/stickers_cut/${name}.png`) ? `${M}/stickers_cut` : fs.existsSync(`${E1}/stickers_cut/${name}.png`) ? `${E1}/stickers_cut` : '/home/user/gcp/project/media/icons/cut';
    return p.icon(name, t, { dir, sfx: o.sfx ?? `${E1}/sfx/pop-2.wav`, db: -14, ...o }); };
  const tw = (text, t, size = 54, color = 'var(--red)', cps = 20) => p.typed(text, t, { cps, cls: 'tw' }).replace('class="tw"', `class="tw" style="font-size:${size}px;color:${color}"`);
  const card = (inner, t, { y = 700, x = X0, w = 940 } = {}) => { const id = p.id_('rc'); p.grow(id, t, { from: 0.8, dy: 60 }); return `<div id="${id}" class="rcard" style="left:${x}px;top:${y}px;width:${w}px">${inner}</div>`; };
  const quote = (text, t, { who = '', y = 700, size = 72, cardAt } = {}) => card(`${who ? `<div class="mono" style="font-size:26px;font-weight:700;letter-spacing:.2em;color:var(--red);margin-bottom:12px">${who}</div>` : ''}<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:${size}px;line-height:1.06">${p.words(p.id_('q'), text, t, { stagger: 0.07 })}</div>`, cardAt ?? t - 0.12, { y });
  const phone = (opts) => new Phone(p, { x: 290, y: 352, scale: 1.16, rot: -1, ...opts });   // header at ~250, input bar just above the captions

  // HOOK — Nkrumah's walking stick: roll / stop
  let [a, b] = win('hook');
  const roll = c('when to roll'), stop = c('when to stop');
  p.scene(0, b, `${kick(p, 'NKRUMAH’S CAMERAMAN', 0.1)}
    ${hl(p, 'Nkrumah’s walking stick wasn’t for a *bad leg.*', 0.15, { size: 92, y: 290 })}
    ${st('walking-stick', 0.5, { x: 300, y: 660, w: 82, rot: -10, life: 'sway', until: b + 0.4, sfx: `${E1}/sfx/knock.wav` })}
    ${p.chip('▶ ROLL', roll, { kind: 'chip', x: 520, y: 860 })}${p.chip('■ STOP', stop, { kind: 'chip red', x: 520, y: 1010 })}`, { enter: 'cut' });
  fx('shutter.wav', roll + 0.1, -14); fx('projector.wav', roll + 0.2, -20, 1.2); fx('shutter.wav', stop + 0.1, -14);

  // THE QUESTION — 11:47 PM, Aba's message on Kofi's phone
  [a, b] = win('question');
  const who = c('she wanted to know'), hesse = c('chris hesse');
  p.scene(a, b, `${kick(p, '11:47 PM · ABA, IN THE TEAM CHAT', a + 0.1, { y: 170, color: 'var(--gold)' })}`, { enter: 'wipeU', bg: 'ink' });
  { const ph = phone({ start: a, end: b + 0.35, enter: a + 0.05, clock0: '11:47' });
    ph.divider('Today', a + 0.3);
    ph.msg({ who: 'Aba', text: "Just finished The Eyes of Ghana on Speed's channel 😭", time: '11:47 pm', at: c('the eyes of ghana') });
    ph.typing('Aba', who - 1.0, hesse); ph.msg({ who: 'Aba', text: 'Who exactly is Chris Hesse?? And why am I only hearing his name now?', time: '11:47 pm', at: hesse });
    ph.focus(c('documentary about'), 2.2, { s: 1.04, dx: 0, dy: -10 });
    ph.build(); }
  p.html.push(`<div class="clip" data-start="${n3(a)}" data-duration="${n3(b - a + 0.3)}" data-track-index="6" style="position:absolute;inset:0;z-index:720">
    ${p.chip('the documentary about Nkrumah’s cameraman', c('documentary about') + 0.1, { kind: 'chip light sub-sm', x: 120, y: 560 })}
    ${p.chip('on IShowSpeed’s YouTube channel', c('eyeshowspeed', 'speed put on'), { kind: 'chip red sub-sm', x: 120, y: 650 })}
    ${p.stamp('FREE', c('free'), { x: 560, y: 760, rot: -8, size: 80 })}</div>`);
  fx('wa-notify.wav', a + 0.1, -14); fx('vibrate.wav', a + 0.15, -16);

  // THE MONTAGE — vertical banner assembly
  [a, b] = win('brand');
  p.scene(a, b, bannerP(p, 'bnr', { t0: a + 0.1, until: b + 0.4, lockY: 800 }).html, { enter: 'iris', bg: 'paper' });

  // CAMERA TWO — Independence Day; "this chap"
  [a, b] = win('camera2');
  p.scene(a, b, `${kick(p, '6 MARCH 1957 · INDEPENDENCE DAY', a + 0.1)}
    ${hl(p, 'Behind *Camera Two*', a + 0.15, { size: 110, y: 290 })}
    ${tallPic(p, img('hesse-young-crowd'), a + 0.5, { y: 560, h: 560, until: b, pos: '50% 35%' })}
    ${p.stamp('CAMERA 2', c('camera two') + 0.2, { x: 600, y: 440, rot: -6, size: 60 })}
    ${p.chip('always the best angle', c('best angle'), { kind: 'chip light', x: X0, y: 1180 })}
    ${p.chip('“Who is this chap?”', c('this chap') - 0.1, { kind: 'chip gold', x: X0, y: 1290 })}
    ${p.chip('how much is he paid?', c('how much he was paid', 'how much'), { kind: 'chip red', x: 540, y: 1290 })}`, { enter: 'wipeL' });

  // KULUNGUGU — 1 August 1962; a bomb went off
  [a, b] = win('kulungugu');
  const bomb = c('a bomb went off');
  p.scene(a, b, `<div style="position:absolute;left:${X0}px;top:280px;border:5px solid var(--red);padding:12px 24px;background:rgba(252,245,232,.95)">${tw('KULUNGUGU · 1 AUGUST 1962', a + 0.2, 50)}</div>
    ${st('film-camera', a + 0.5, { x: 300, y: 500, w: 480, life: 'jiggle', until: b + 0.3 })}
    ${p.chip('a border village in the Upper East', c('upper east', 'border village'), { kind: 'chip gold', x: X0, y: 400 })}
    ${p.chip('filming schoolchildren for the President', c('filming schoolchildren'), { kind: 'chip light', x: X0, y: 940 })}
    ${card(`<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:120px;line-height:1;color:var(--red)">${p.words(p.id_('w'), 'A bomb went off.', bomb, { stagger: 0.07 })}</div>`, bomb - 0.1, { y: 1060 })}`, { enter: 'iris', bg: 'ink' });
  fx(`${M}/../../project/media/sfx/syn-suspense.wav`.replace('/sp1/media/../../', '/'), a, -14); e1('boom.wav', bomb + 0.15, -8);

  // THE CURTAIN — don't be afraid, keep on filming
  [a, b] = win('curtain');
  const keep = c('dont be afraid'), cur = p.id_('cu'), curT = a + 0.3;
  p.tl.push(`tl.fromTo("#${cur}-l", {xPercent:-100}, ${JSON.stringify({ xPercent: 0, ...spr('heavy') })}, ${n3(curT)});`, `tl.fromTo("#${cur}-r", {xPercent:100}, ${JSON.stringify({ xPercent: 0, ...spr('heavy') })}, ${n3(curT + 0.05)});`);
  p.tl.push(`tl.to("#${cur}-l", {xPercent:-100, duration:0.5, ease:"power2.in", immediateRender:false}, ${n3(keep - 0.5)});`, `tl.to("#${cur}-r", {xPercent:100, duration:0.5, ease:"power2.in", immediateRender:false}, ${n3(keep - 0.5)});`);
  p.ev(curT); p.ev(keep - 0.5); fx('curtain.wav', curT - 0.05, -12); fx('curtain.wav', keep - 0.55, -14); fx('cabin.wav', a, -22, Math.min(6, b - a));
  const drape = (side) => `<div id="${cur}-${side}" style="position:absolute;top:0;${side === 'l' ? 'left:0' : 'right:0'};width:50%;height:100%;background:repeating-linear-gradient(90deg,#7E1B14 0 34px,#A4241B 34px 60px,#8E1F17 60px 80px);border:5px solid #1A1612"></div>`;
  p.scene(a, b, `${kick(p, 'THE FLIGHT TO MOSCOW · 1966', a + 0.1)}
    ${hl(p, 'Nkrumah drew a *curtain*…', a + 0.15, { size: 96, y: 290 })}
    <div style="position:absolute;left:${X0}px;top:560px;width:940px;height:560px;overflow:hidden;border:6px solid var(--ink);box-shadow:14px 16px 0 var(--ink);background:#2B2A26">
      ${st('film-camera', a + 0.2, { x: 300, y: 80, w: 340, life: 'bob', until: b })}${drape('l')}${drape('r')}</div>
    ${p.chip('to his cameraman’s corner', c('came to the corner'), { kind: 'chip light', x: X0, y: 1200 })}
    ${p.chip('“coups will go on across Africa…”', c('coups would go on', 'coups would'), { kind: 'chip red', x: X0, y: 1310 })}
    ${p.chip('“Don’t be afraid. Keep on filming.”', keep, { kind: 'chip gold', x: 110, y: 1000 })}`, { enter: 'wipeU' });

  // THE NLC BURNS — but the negatives were in London
  [a, b] = win('nlc');
  const london = c('negatives in london', 'in london');
  p.scene(a, b, `${nameCard(p, a + 0.2, 'National Liberation Council', 'The order, 1966', { y: 270 })}
    ${p.stamp('DESTROY', c('destroyed') - 0.1, { x: 80, y: 560, rot: -7, size: 96 })}
    ${p.chip('records · books · films', c('records'), { kind: 'chip light', x: X0, y: 760 })}
    ${p.chip('they burned what they could find', c('and they burned'), { kind: 'chip red', x: X0, y: 870 })}
    ${tallPic(p, img('cold-vault'), london - 0.6, { x: 520, y: 990, w: 480, h: 320, until: b })}
    ${p.stamp('SAFE IN LONDON', london + 0.3, { x: 60, y: 1080, rot: -6, size: 52 })}`, { enter: 'wipeL' });
  fx('fire.wav', c('and they burned'), -16, 3); e1('wind.wav', london, -20, 2);

  // THE 1% — no colour lab, so every colour reel flew to London (Baaba: what saved our history)
  [a, b] = win('lab');
  p.scene(a, b, `${kick(p, 'THE 1% · NO COLOUR LAB IN GHANA', a + 0.1, { y: 170, color: 'var(--gold)' })}`, { enter: 'iris', bg: 'ink' });
  { const ph = phone({ start: a, end: b + 0.4, enter: a + 0.05, clock0: '12:46',
      prior: [{ who: 'Aba', text: 'Wait. If the coup people burned everything, how are we even watching these films??', time: '12:38 am' }] });
    const end = c('laboratory in london', { end: true });
    p.html.push(`<div class="clip" data-start="${n3(a)}" data-duration="${n3(b - a + 0.3)}" data-track-index="6" style="position:absolute;inset:0;z-index:720">
      ${p.stamp('NO COLOUR LAB', c('no laboratory') , { x: 300, y: 520, rot: -6, size: 60 })}
      ${p.chip('☀ the heat was hard on film', c('the heat'), { kind: 'chip light sub-sm', x: 290, y: 700 })}
      ${p.chip('✈ every colour reel flew to London', c('flown to', 'was flown'), { kind: 'chip gold sub-sm', x: 290, y: 790 })}</div>`);
    ph.typing('Baaba', end - 2.2, end + 0.1); ph.msg({ who: 'Baaba', text: 'So Ghana not having a colour lab is what saved our history?? 😮', time: '12:46 am', at: end + 0.1 });
    ph.build(); }

  // 94 — the eye chart, glaucoma, more work to be done
  [a, b] = win('eyes');
  const refuse = c('but refuses');
  p.scene(a, refuse - 0.1, `${counter(p, 94, c('94') - 0.3, { size: 240, color: 'var(--red)', y: 260, label: 'YEARS OLD TODAY', dur: 0.9 })}
    ${tallPic(p, img('hesse-reels'), c('whole life') - 0.2, { y: 640, h: 500, until: refuse })}
    ${p.chip('sits before an eye chart', c('eye chart'), { kind: 'chip light', x: 420, y: 320 })}
    ${p.chip('struggles with the letters', c('struggles'), { kind: 'chip gold', x: 420, y: 430 })}
    ${p.stamp('GLAUCOMA', c('glaucoma'), { x: 90, y: 1190, rot: -6, size: 70 })}`, { enter: 'wipeU' });
  p.scene(refuse - 0.1, b, `${quote('There is more work to be done *while we are alive.*', c('because there is', 'more work') - 0.2, { who: 'HE REFUSES TO ACCEPT HE WILL BE BLIND', y: 520, size: 84, cardAt: refuse })}`, { enter: 'push' });

  // GHANA IS WHAT WE HAVE
  [a, b] = win('ghana');
  p.scene(a, b, `${hl(p, 'Ghana is what we have.', a + 0.1, { size: 112, y: 300 })}
    ${quote('You can live in London or anywhere else, but *you do not belong there.*', c('you can live') - 0.1, { who: 'REV. CHRIS TSUI HESSE', y: 640, size: 66, cardAt: a + 0.6 })}`, { enter: 'wipeR' });

  // CLOSE — the chat signs off; back at the Nest
  [a, b] = win('close');
  const meet = c('we will meet');
  p.scene(a, meet - 0.1, `${kick(p, 'THIS HAS BEEN A SPECIAL', a + 0.1, { y: 170 })}`, { enter: 'iris', bg: 'paper' });
  { const ph = phone({ start: a, end: meet + 0.3, enter: a + 0.05, clock0: '1:57',
      prior: [{ who: 'Aba', text: 'Ok Editor. What’s the lesson? Then I’ll sleep 😴', time: '1:54 am' }] });
    ph.msg({ who: 'Aba', text: 'ok that last line was for me 😶', time: '1:57 am', at: a + 0.4 });
    ph.msg({ who: 'Kofi', text: 'Create intentionally. Document relentlessly. Preserve for posterity. Goodnight, squad.', time: '1:58 am', at: a + 1.6 });
    ph.build(); }
  p.scene(meet - 0.1, b, `${hl(p, 'We will meet you back at *the Nest.* Cheers.', meet, { size: 96, y: 290 })}
    ${tallPic(p, '/home/user/gcp/project/media/final/nest-light.png', meet + 0.1, { y: 640, h: 560, until: b + 0.4 })}`, { enter: 'push' });

  endCard(p, at.endcard.T0 - 0.1, R.total, 'GOLD COAST PALAVA · SPECIAL No. 1', { what: 'Special' });
  captions(p, R);
  enrichSfx(p);
  p.html.push('<div class="bottomdeco"></div>');
  return { p, R };
}
