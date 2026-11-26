// Lists scenes whose first element arrives late (screen near-empty while the voice runs) and static gaps.
// usage: node empties.mjs [sections…]   (LATE=0.9 GAP=4.5)
process.env.GCP_WORK ||= '/home/user/gcp/sp2/work'; process.env.GCP_CUE_LEAD ??= '0.1';
const L = await import('/home/user/gcp/build/lib.mjs');
const orig = L.Part.prototype.scene;
L.Part.prototype.scene = function (start, ...r) { (this._sc ??= []).push(start); const n = this.events.length; const id = orig.call(this, start, ...r); this.events.splice(n, 1); return id; };
const PH = await import('./phone.mjs');   // phone pops do not count: the left two-thirds must hold something
for (const m of ['typing', 'divider', 'msg', 'focus', 'build']) { const o = PH.Phone.prototype[m]; PH.Phone.prototype[m] = function (...a) { const n = this.p.events.length; const r = o.apply(this, a); this.p.events.splice(n); return r; }; }
const S = await import('./sp2.mjs'); const Q = await import('./questions.mjs');
const B = { ...S.BUILDERS, ...Q.BUILDERS };
const LATE = +(process.env.LATE || 0.9), GAP = +(process.env.GAP || 4.5);
for (const id of process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(B)) {
  const p = B[id](); const ev = [...new Set(p.events.map((t) => Math.round(t * 10) / 10))].sort((a, b) => a - b);
  for (const s0 of p._sc || []) { const f = ev.find((t) => t >= s0 - 0.05); if (s0 > 0.05 && (f == null || f - s0 > LATE)) console.log(`${id} LATE scene@${s0.toFixed(1)} first element +${((f ?? p.dur) - s0).toFixed(1)}s  next: ${ev.filter((t) => t >= s0 - 0.3).slice(0, 4).join(" ")}`); }
  const pts = [0, ...ev.filter((t) => t <= p.dur), p.dur];
  for (let i = 1; i < pts.length; i++) if (pts[i] - pts[i - 1] > GAP) console.log(`${id} GAP ${pts[i - 1]}→${pts[i]} (${(pts[i] - pts[i - 1]).toFixed(1)}s)`);
}
