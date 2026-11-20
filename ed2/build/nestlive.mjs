// The living Nest — the pilot's Nest illustration made to play like a real video shot (Edition 2 client ask).
// Layers (all 1920x1080 space): back room (blades painted out) → drifting night clouds behind the louvres,
// moon glow, glints on the lagoon, a ceiling fan that really turns, a clock whose second hand ticks →
// foreground desk (separate layer, so the camera truck gives parallax) → tea steam, lamp flicker, dust in
// the lamplight → warm evening grade. Everything is a pure GSAP tween (seek-safe), noise is seeded (mulberry32).
// The camera: slow truck across the room (fg moves more than bg), handheld breathing, and spring moves (aim)
// to the objects the voice names.
import { SP } from '/home/user/gcp/build/lib.mjs';
const NM = '/home/user/gcp/ed2/media/nest';
const r3 = (v) => +(+v).toFixed(3);
export function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
// points of the 1920x1080 picture
export const SPOT = { back: [930, 470], left: [520, 430], lampdesk: [1320, 440], typewriter: [760, 720], laptop: [1200, 690], jacket: [430, 640],
  tea: [1575, 790], headphones: [1340, 875], fan: [914, 100], clock: [1280, 197], window: [1560, 260], map: [470, 300], shared: [900, 540], globe: [130, 200] };
export const aimAt = (x, y, sc) => { const mx = (sc - 1) * 960 - 4, my = (sc - 1) * 540 - 4; return { scale: sc, x: r3(Math.max(-mx, Math.min(mx, (960 - x) * sc))), y: r3(Math.max(-my, Math.min(my, (540 - y) * sc))) }; };

/**
 * livingNest(p, t0, t1, opts) → { html, cam, aim(spot|[x,y], scale, at, preset) }
 * opts.grade: 'evening' (warm dusk, default) | 'night' | 'haze'; opts.truck: px of lateral camera travel;
 * opts.start: initial aim {x,y,scale}; opts.seed
 */
export function livingNest(p, t0, t1, { grade = 'evening', truck = 40, start = null, seed = 1, fan = true, steam = true, bgExtra = '', fgExtra = '' } = {}) {
  const id = p.id_('ln'), D = r3(t1 - t0 + 0.6), rnd = mulberry32(seed * 977 + 13);
  const tl = (s) => p.tl.push(s);
  const A = (f) => p.asset(`${NM}/${f}`);
  // --- camera: truck + breathing ------------------------------------------------
  tl(`tl.fromTo("#${id}-bg", {x:${truck * 0.5}}, {x:${-truck * 0.5}, duration:${D}, ease:"none"}, ${r3(t0)});`);
  tl(`tl.fromTo("#${id}-fg", {x:${truck * 1.35}}, {x:${-truck * 1.35}, duration:${D}, ease:"none"}, ${r3(t0)});`);
  const br = Math.max(1, Math.floor(D / 3.1));
  tl(`tl.fromTo("#${id}-hh", {y:-3, rotation:-0.12}, {y:3, rotation:0.12, duration:3.1, ease:"sine.inOut", repeat:${br - 1}, yoyo:true}, ${r3(t0)});`);
  if (start) tl(`tl.set("#${id}-cam", ${JSON.stringify(start)}, ${r3(t0)});`);
  // --- clouds behind the louvres ---------------------------------------------------
  tl(`tl.fromTo("#${id}-cl", {x:0}, {x:-${Math.round(24 * D)}, duration:${D}, ease:"none"}, ${r3(t0)});`);
  // moon glow breathes as clouds pass
  tl(`tl.fromTo("#${id}-mn", {opacity:.55}, {opacity:.95, duration:2.7, ease:"sine.inOut", repeat:${Math.max(0, Math.floor(D / 2.7) - 1)}, yoyo:true}, ${r3(t0)});`);
  // glints on the lagoon: short dashes that flicker with seeded periods
  const glints = Array.from({ length: 16 }, (_, i) => {
    const gx = 1470 + rnd() * 200 + (i % 4) * 4, gy = 398 + rnd() * 34, w = 6 + rnd() * 16, per = 0.35 + rnd() * 0.6, gid = `${id}-g${i}`;
    tl(`tl.fromTo("#${gid}", {opacity:0.05, x:0}, {opacity:${r3(0.6 + rnd() * 0.4)}, x:${r3(rnd() * 6 - 3)}, duration:${r3(per)}, ease:"sine.inOut", repeat:${Math.max(0, Math.floor(D / per) - 1)}, yoyo:true}, ${r3(t0 + rnd() * 0.5)});`);
    return `<i id="${gid}" style="position:absolute;left:${r3(gx)}px;top:${r3(gy)}px;width:${r3(w)}px;height:2px;background:#E9EEF2;border-radius:2px;opacity:.1"></i>`;
  }).join('');
  // --- ceiling fan: three blades turning in a squashed (perspective) circle -------------------
  const blade = (deg) => `<g transform="rotate(${deg})"><path d="M42 -13 L212 -26 Q224 0 212 26 L42 13 Z" fill="#9C8962" stroke="#2A241C" stroke-width="3.5"/>
      <path d="M70 -6 L200 -12 M70 4 L202 9 M120 -16 L190 18" stroke="#5E5038" stroke-width="3" fill="none"/></g>`;
  const ghost = (deg, o) => `<g opacity="${o}" transform="rotate(${deg})"><path d="M42 -13 L212 -26 Q224 0 212 26 L42 13 Z" fill="#8A7856"/></g>`;
  const blades = [0, 120, 240].map((d) => ghost(d - 9, 0.32) + ghost(d - 18, 0.18) + ghost(d - 27, 0.08) + blade(d)).join('');
  if (fan) tl(`tl.fromTo("#${id}-fan", {rotation:0}, {rotation:${Math.round(D * 300)}, duration:${D}, ease:"none", svgOrigin:"0 0"}, ${r3(t0)});`);
  const fanSvg = fan ? `<svg style="position:absolute;left:0;top:0;overflow:visible" width="1920" height="1080"><g transform="translate(914 101) rotate(-6) scale(1 0.27)"><g id="${id}-fan">${blades}</g></g></svg>
    <img src="${A('fan-hub.png')}" style="position:absolute;left:860px;top:0;width:110px;height:130px">` : '';
  // --- clock: the second hand ticks --------------------------------------------------------------
  const ticks = Math.ceil(D);
  tl(`tl.fromTo("#${id}-sec", {rotation:${Math.round(rnd() * 60) * 6}}, {rotation:"+=${ticks * 6}", duration:${ticks}, ease:"steps(${ticks})"}, ${r3(t0)});`);
  const clock = `<svg style="position:absolute;left:0;top:0" width="1920" height="1080"><g transform="translate(1280 197)"><g id="${id}-sec"><line x1="0" y1="6" x2="0" y2="-30" stroke="#A4241B" stroke-width="2.4" stroke-linecap="round"/></g><circle r="3" fill="#1A1612"/></g></svg>`;
  // --- tea steam: three wisps rising and fading on loops --------------------------------------
  const steamHtml = steam ? [0, 1, 2].map((k) => {
    const sid = `${id}-st${k}`, per = 2.6 + k * 0.45, reps = Math.max(0, Math.floor(D / per) - 1);
    tl(`tl.fromTo("#${sid}", {y:10, opacity:0, scaleX:0.8}, {keyframes:[{y:-30, opacity:.75, scaleX:1, duration:${r3(per * 0.4)}, ease:"sine.out"}, {y:-95, opacity:0, scaleX:1.4, duration:${r3(per * 0.6)}, ease:"sine.in"}], repeat:${reps}}, ${r3(t0 + k * 0.85)});`);
    return `<svg id="${sid}" style="position:absolute;left:${1528 + k * 14}px;top:640px;opacity:0;transform-origin:20px 110px;filter:blur(1.2px)" width="44" height="120"><path d="M22 118 C 6 92, 38 76, 20 52 S 30 18, 18 2" fill="none" stroke="#F4EEE2" stroke-width="${5 - k}" stroke-linecap="round" opacity=".9"/></svg>`;
  }).join('') : '';
  // --- lamp: warm pool that breathes, with two seeded flickers ----------------------------------
  tl(`tl.fromTo("#${id}-lp", {opacity:.55}, {opacity:.8, duration:1.9, ease:"sine.inOut", repeat:${Math.max(0, Math.floor(D / 1.9) - 1)}, yoyo:true}, ${r3(t0)});`);
  for (let k = 0; k < Math.max(1, Math.floor(D / 9)); k++) { const ft = t0 + 2 + rnd() * (D - 3); tl(`tl.to("#${id}-lpf", {keyframes:[{opacity:.35, duration:.05}, {opacity:0, duration:.07}, {opacity:.25, duration:.04}, {opacity:0, duration:.12}], ease:"none", immediateRender:false}, ${r3(ft)});`); }
  // --- dust motes drifting in the lamplight ---------------------------------------------------
  const dust = Array.from({ length: 18 }, (_, i) => {
    const did = `${id}-d${i}`, x = 1560 + rnd() * 260, y = 600 + rnd() * 230, per = 3 + rnd() * 3;
    tl(`tl.fromTo("#${did}", {x:0, y:0, opacity:${r3(0.2 + rnd() * 0.3)}}, {x:${r3(rnd() * 40 - 20)}, y:${r3(-20 - rnd() * 40)}, opacity:${r3(0.5 + rnd() * 0.4)}, duration:${r3(per)}, ease:"sine.inOut", repeat:${Math.max(0, Math.floor(D / per) - 1)}, yoyo:true}, ${r3(t0)});`);
    return `<i id="${did}" style="position:absolute;left:${r3(x)}px;top:${r3(y)}px;width:${r3(2 + rnd() * 3)}px;height:${r3(2 + rnd() * 3)}px;border-radius:50%;background:#FFE7B0;opacity:.3"></i>`;
  }).join('');
  const GR = { evening: `<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 70% 30%, rgba(255,170,90,.55), rgba(255,140,60,.18) 55%, rgba(80,40,20,.12) 100%);mix-blend-mode:soft-light"></div>`,
    night: '', haze: `<div style="position:absolute;inset:0;background:rgba(232,196,140,.30);mix-blend-mode:screen"></div><div style="position:absolute;inset:0;background:rgba(214,170,110,.25);mix-blend-mode:soft-light"></div>` }[grade];
  const html = `<div id="${id}-cam" class="wrap" style="transform-origin:960px 540px"><div id="${id}-hh" class="wrap" style="transform-origin:960px 540px">
    <div id="${id}-bg" style="position:absolute;left:-40px;top:-24px;width:2000px;height:1128px"><div style="position:absolute;left:40px;top:24px;width:1920px;height:1080px">
      <img src="${A('nest-bg.jpg')}" style="position:absolute;inset:0;width:1920px;height:1080px">
      <div style="position:absolute;inset:0;-webkit-mask-image:url(${A('glass-alpha.png')});-webkit-mask-size:1920px 1080px;mask-image:url(${A('glass-alpha.png')});mask-size:1920px 1080px">
        <div id="${id}-mn" style="position:absolute;left:1443px;top:75px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle, rgba(255,250,230,.9), rgba(255,250,230,0) 65%)"></div>
        <div id="${id}-cl" style="position:absolute;left:600px;top:60px;width:4800px;height:360px;background:url(${A('clouds.png')}) repeat-x;background-size:1600px 360px"></div>
        ${glints}</div>
      ${fanSvg}${clock}${bgExtra}</div></div>
    <div id="${id}-fg" style="position:absolute;left:0;top:0;width:1920px;height:1080px">
      <img src="${A('nest-fg.png')}" style="position:absolute;inset:0;width:1920px;height:1080px">
      <div id="${id}-lp" style="position:absolute;left:1380px;top:440px;width:620px;height:560px;background:radial-gradient(ellipse at 52% 30%, rgba(255,214,140,.65), rgba(255,190,100,0) 62%);mix-blend-mode:screen;opacity:.6"></div>
      <div id="${id}-lpf" style="position:absolute;inset:0;background:rgba(20,12,4,.9);mix-blend-mode:multiply;opacity:0"></div>
      ${steamHtml}${dust}${fgExtra}</div>
    ${GR}</div></div>`;
  const cam = `${id}-cam`;
  const aim = (spot, sc, at, preset = 'heavy') => { const [x, y] = Array.isArray(spot) ? spot : SPOT[spot]; p.tl.push(`tl.to("#${cam}", ${JSON.stringify({ ...aimAt(x, y, sc), duration: SP[preset], ease: `sp-${preset}`, immediateRender: false })}, ${r3(at)});`); p.ev(at); };
  return { html, cam, aim, id };
}
