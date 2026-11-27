// Exact stills: open a section's composition at 2560x1440 (layout 1920x1080 zoomed), seek the GSAP timeline, screenshot.
// usage: node snap.cjs <section> <out.png> t1 t2 ...   (writes out-<t>.png)
const { chromium } = require('playwright');
(async () => {
  const [sec, out, ...ts] = process.argv.slice(2);
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await pg.goto(`file:///home/user/gcp/ed2/build/hf/${sec}/index.html`); await pg.waitForTimeout(800);
  for (const t of ts) {
    await pg.evaluate((t) => {
      const T = +t;
      document.querySelectorAll('.clip').forEach((el) => { const s = +el.dataset.start, d = +el.dataset.duration; el.style.visibility = (T >= s && T < s + d) ? 'visible' : 'hidden'; });
      window.__timelines.main.seek(T);
    }, t);
    await pg.waitForTimeout(120);
    await pg.screenshot({ path: out.replace('.png', `-${t}.png`) });
  }
  await b.close();
})();
