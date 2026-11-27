// Lists (a) scenes whose first element arrives late (screen near-empty while the voice runs) and (b) static gaps.
process.env.GCP_WORK = process.env.GCP_WORK || '/home/user/gcp/ed3/work';
const L = await import('/home/user/gcp/build/lib.mjs');
const orig = L.Part.prototype.scene;
L.Part.prototype.scene = function (start, ...r) { (this._sc ??= []).push(start); const n = this.events.length; const id = orig.call(this, start, ...r); this.events.splice(n, 1); return id; };
const ED = await import('./index.mjs');
const LATE = +(process.env.LATE || 1.6), GAP = +(process.env.GAP || 4.5);
for (const id of process.argv.slice(2)) {
  const p = ED.BUILDERS[id](); const sg = ED.SEGMENTS[id];
  const c = sg.pieces?.length ? L.cuer(sg.pieces) : null;
  const words = (a, b) => { try { return c.words(a, b).map((w) => w.w).join(' ').slice(0, 110); } catch { return ''; } };
  const ev = [...new Set(p.events.map((t) => Math.round(t * 10) / 10))].sort((a, b) => a - b);
  for (const s0 of p._sc || []) { const f = ev.find((t) => t >= s0 - 0.05); if (f == null || f - s0 > LATE) console.log(`${id} LATE scene@${s0.toFixed(1)} first element +${((f ?? p.dur) - s0).toFixed(1)}s: ${words(s0, f ?? p.dur)}`); }
  const pts = [0, ...ev.filter((t) => t <= p.dur), p.dur];
  for (let i = 1; i < pts.length; i++) if (pts[i] - pts[i - 1] > GAP) console.log(`${id} GAP ${pts[i - 1]}→${pts[i]} (${(pts[i] - pts[i - 1]).toFixed(1)}s): ${words(pts[i - 1], pts[i])}`);
}
