// Dry run: validate a project and print where each item lands, without rendering.
import fs from 'node:fs';
import path from 'node:path';
import { validateProject } from './schema.js';
import { probe, resolveTransition } from './ffmpeg/index.js';
import { normalizeDesign } from './design-to-motion/normalize.js';

export async function plan(specPath) {
  const file = path.resolve(specPath);
  const base = path.dirname(file);
  const spec = JSON.parse(fs.readFileSync(file, 'utf8'));
  validateProject(spec);
  const rows = [];
  let cursor = 0;
  for (const [i, it] of spec.timeline.entries()) {
    let dur;
    if (it.type === 'video') { const info = await probe(path.resolve(base, it.src)); dur = ((it.out ?? info.duration) - (it.in ?? 0)) / (it.speed ?? 1); }
    else if (it.type === 'design') {
      const raw = typeof it.design === 'string' ? JSON.parse(fs.readFileSync(path.resolve(base, it.design), 'utf8')) : it.design;
      dur = it.duration ?? normalizeDesign(raw).duration;
    } else dur = it.duration ?? (it.type === 'image' ? 4 : it.type === 'color' ? 2 : 4);
    const t = resolveTransition(it.transition);
    const d = i > 0 && t ? Math.min(t.duration, cursor - 0.05, dur - 0.05) : 0;
    const start = cursor - d;
    rows.push([it.id ?? `#${i}`, it.type + (it.engine ? `/${it.engine}` : ''), start.toFixed(2), (start + dur).toFixed(2), dur.toFixed(2), t ? `${t.type} ${t.duration}s` : 'cut']);
    cursor = start + dur;
  }
  const head = ['id', 'type', 'start', 'end', 'dur', 'enters with'];
  const w = head.map((h, c) => Math.max(h.length, ...rows.map((r) => String(r[c]).length)));
  const line = (r) => r.map((v, c) => String(v).padEnd(w[c])).join('  ');
  console.log(line(head));
  console.log(w.map((x) => '─'.repeat(x)).join('  '));
  rows.forEach((r) => console.log(line(r)));
  console.log(`\nTotal ≈ ${cursor.toFixed(2)}s · overlays: ${(spec.overlays || []).length} · outputs: ${(spec.outputs || []).map((o) => o.file).join(', ') || 'default'}`);
  return { duration: cursor, rows };
}
