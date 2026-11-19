// Exact stills of a reel composition at 1080x1920. usage: node snap.cjs <reel> <outprefix> t1 t2 ...
const { chromium } = require('playwright');
(async () => {
  const [name, out, ...ts] = process.argv.slice(2);
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await pg.goto(`file:///home/user/gcp/reels/${name}/hf/index.html`); await pg.waitForTimeout(800);
  for (const t of ts) {
    await pg.evaluate((t) => { const T = +t;
      document.querySelectorAll('.clip').forEach((el) => { const s = +el.dataset.start, d = +el.dataset.duration; el.style.visibility = (T >= s && T < s + d) ? 'visible' : 'hidden'; });
      document.querySelectorAll('video').forEach((v) => { const s = +v.dataset.start; try { v.currentTime = Math.max(0, T - s); } catch (e) {} });
      window.__timelines.main.seek(T); }, t);
    await pg.waitForTimeout(150);
    await pg.screenshot({ path: `${out}-${String(t).padStart(6, '0')}.png` });
  }
  await b.close();
})();
