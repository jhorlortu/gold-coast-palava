// Finds text that clashes with other text or covers/is covered by pictures, by sampling a section's composition.
// usage: node clash.cjs <section> [step=0.4]  -> lines "t  A <-> B  (overlap%)" for overlaps lasting >= 2 samples
const { chromium } = require('playwright');
(async () => {
  const [sec, stepArg] = process.argv.slice(2); const step = +(stepArg || 0.4);
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await pg.goto(`file:///home/user/gcp/ed2/build/hf/${sec}/index.html`); await pg.waitForTimeout(600);
  const dur = await pg.evaluate(() => window.__timelines.main.duration());
  const hits = new Map();
  for (let t = 0.2; t < dur; t += step) {
    const found = await pg.evaluate((T) => {
      document.querySelectorAll('.clip').forEach((el) => { const s = +el.dataset.start, d = +el.dataset.duration; el.style.visibility = (T >= s && T < s + d) ? 'visible' : 'hidden'; });
      window.__timelines.main.seek(T);
      const vis = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < 0.35) return false; if (e.style.clipPath && e.style.clipPath !== 'none' && !/inset\(0(%|px)? 0(%|px)? 0(%|px)? 0(%|px)?\)|circle\(75%/.test(e.style.clipPath)) return false; } return true; };
      const clipRect = (el) => { let r = el.getBoundingClientRect(); r = { l: r.left, t: r.top, r: r.right, b: r.bottom };
        for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.overflow === 'hidden') { const q = e.getBoundingClientRect(); r = { l: Math.max(r.l, q.left), t: Math.max(r.t, q.top), r: Math.min(r.r, q.right), b: Math.min(r.b, q.bottom) }; } }
        r.l = Math.max(r.l, 0); r.t = Math.max(r.t, 0); r.r = Math.min(r.r, 1920); r.b = Math.min(r.b, 1080); return r; };
      const area = (r) => Math.max(0, r.r - r.l) * Math.max(0, r.b - r.t);
      const blockOf = (el) => el.closest('.cap, .chip, .stamp, .card, .namecard, .quote, .print, .hl, .kicker, .mast-l, .mast-r, [id^="cd"], [id^="pin"]') || el.parentElement;
      const sceneOf = (el) => el.closest('.scene') || document.body;
      // text blocks: union of visible text-bearing leaves
      const blocks = new Map();
      const walker = document.createTreeWalker(document.getElementById('root'), NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (!n.textContent.trim()) continue; const el = n.parentElement; if (!vis(el)) continue;
        if (el.closest('.mast') || el.closest('[id^="colo"]')) continue;
        const r = clipRect(el); if (area(r) < 60) continue;
        const bl = blockOf(el); const k = blocks.get(bl) || { r: { ...r }, txt: '', sc: sceneOf(bl) };
        k.r = { l: Math.min(k.r.l, r.l), t: Math.min(k.r.t, r.t), r: Math.max(k.r.r, r.r), b: Math.max(k.r.b, r.b) }; k.txt += ' ' + n.textContent.trim(); blocks.set(bl, k);
      }
      const pics = [...document.querySelectorAll('.sticker, .print, .tframe, video, img.bn-card')].filter(vis).map((el) => ({ r: clipRect(el), el, sc: sceneOf(el), name: (el.getAttribute('src') || el.className || el.tagName).split('/').pop().slice(0, 30) })).filter((p) => area(p.r) > 400);
      const B = [...blocks.entries()].map(([el, v]) => ({ el, ...v, txt: v.txt.trim().replace(/\s+/g, ' ').slice(0, 44) }));
      const inter = (a, c) => area({ l: Math.max(a.l, c.l), t: Math.max(a.t, c.t), r: Math.min(a.r, c.r), b: Math.min(a.b, c.b) });
      const out = [];
      for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
        if (B[i].el.contains(B[j].el) || B[j].el.contains(B[i].el)) continue;
        const ov = inter(B[i].r, B[j].r), sm = Math.min(area(B[i].r), area(B[j].r)); if (sm && ov / sm > 0.05) out.push(`TEXT  "${B[i].txt}"  <->  "${B[j].txt}"  ${Math.round(100 * ov / sm)}%`);
      }
      for (const a of B) for (const p of pics) {
        if (p.el.contains(a.el) || a.el.contains(p.el)) continue;
        const ov = inter(a.r, p.r), ar = area(a.r); if (ar && ov / ar > 0.05) out.push(`PIC   "${a.txt}"  <->  [${p.name}]  ${Math.round(100 * ov / ar)}%`);
      }
      return out;
    }, t);
    for (const f of found) { const h = hits.get(f) || []; h.push(+t.toFixed(1)); hits.set(f, h); }
  }
  for (const [f, ts] of hits) { if (ts.length < 2) continue; console.log(`${sec} ${ts[0].toFixed(1)}–${ts[ts.length - 1].toFixed(1)}s  ${f}`); }
  await b.close();
})();
