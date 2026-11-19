// COMBO1 — "Optimum Digital presents" + the opening banner montage. Shared by every edition.
// The symbol draws on the soundtrack's opening phrase, OPTIMUM DIGITAL PRESENTS types under it, the track's built-in
// silence (6.74 s) is held, and on the downbeat (7.67 s) the refined channel banner assembles; it holds, then pushes through.
import { Part } from './lib.mjs';
import { banner, BANNER_CSS } from './banner.mjs';
export function combo1(seg) {
  const p = new Part({ ...seg }); p.mast = false; p.css.push(BANNER_CSS);
  const placesId = p.id_('pl');
  const places = p.typed('OPTIMUM DIGITAL PRESENTS', 3.6, { cps: 14 });
  const bn = banner(p, 'bn', { t0: 7.67, symbolFrom: { x: 494, y: -95, s: 3.85 }, drawSymbol: [0.35, 3.1], until: seg.dur - 0.85 });
  p.tl.push(`tl.to("#${placesId}", {yPercent:-130, duration:${0.35}, ease:"power2.in", immediateRender:false}, 6.55);`);
  p.tl.push(`tl.to("#bn-sym", {scale:3.1, duration:0.9, ease:"sine.inOut", immediateRender:false}, 6.74);`);
  p.tl.push(`tl.fromTo("#intro-cam", {scale:1}, {scale:1.06, duration:3.0, ease:"none"}, 8.4);`);
  p.tl.push(`tl.to("#intro-cam", {scale:3.2, duration:0.85, ease:"expo.in", immediateRender:false}, ${seg.dur - 0.85});`);
  p.ev(seg.dur - 0.85); p.ev(10.4);
  p.sound('whoosh-2.mp3', seg.dur - 0.55, -10);
  p.html.push(`<div id="introsc" class="clip scene" data-start="0" data-duration="${seg.dur}" data-track-index="1" style="z-index:2"><div class="bgp plain"></div>
    <div id="intro-cam" class="wrap" style="transform-origin:960px 540px">${bn}
      <div style="position:absolute;left:0;right:0;top:760px;text-align:center"><span class="mk"><span id="${placesId}" class="wd mono" style="font-size:38px;font-weight:700;letter-spacing:.22em;color:var(--red)">${places}</span></span></div>
    </div></div>`);
  return p;
}
