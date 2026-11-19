process.env.GCP_WORK = process.env.GCP_WORK || '/home/user/gcp/ed1/work';
const ED = await import('./ed1.mjs'); const L = await import('/home/user/gcp/build/lib.mjs');
for (const id of process.argv.slice(2)) {
  const p = ED.BUILDERS[id](); const sg = ED.SEGMENTS[id === 'combo1' ? 'combo1' : id];
  const c = sg.pieces.length ? L.cuer(sg.pieces) : null;
  const ev = [...new Set(p.events.map((t) => Math.round(t * 10) / 10))].filter((t) => t <= p.dur).sort((a, b) => a - b);
  const pts = [0, ...ev, p.dur];
  for (let i = 1; i < pts.length; i++) if (pts[i] - pts[i - 1] > 5) {
    let ws = ''; try { ws = c.words(pts[i - 1], pts[i]).map((w) => w.w).join(' '); } catch {}
    console.log(`${id} ${pts[i - 1]}→${pts[i]} (${(pts[i] - pts[i - 1]).toFixed(1)}s): ${ws.slice(0, 160)}`);
  }
}
