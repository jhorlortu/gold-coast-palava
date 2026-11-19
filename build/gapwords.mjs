// Lists every stretch longer than 4 s with nothing new on screen, plus the words spoken in it.
import * as S from './sections.mjs';
import * as P from './parts.mjs';
import { cuer } from './lib.mjs';
for (const id of process.argv.slice(2)) {
  const p = (S[id] || P[id])();
  const pc = P.SEGMENTS[id].pieces; const c = pc.length ? cuer(pc) : { words: () => [] };
  const ev = [...new Set(p.events.map((t) => Math.round(t * 10) / 10))].filter((t) => t <= p.dur).sort((a, b) => a - b);
  const pts = [0, ...ev, p.dur];
  for (let i = 1; i < pts.length; i++) {
    if (pts[i] - pts[i - 1] <= 4) continue;
    let ws = '';
    try { ws = c.words(pts[i - 1], pts[i]).map((w) => w.w).join(' '); } catch (e) { ws = `(${e.message})`; }
    console.log(`${id} ${pts[i - 1]}→${pts[i]} (${(pts[i] - pts[i - 1]).toFixed(1)}s): ${ws}`);
  }
}
