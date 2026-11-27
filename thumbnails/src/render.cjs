// Renders each thumbnail to thumbnails/<id>.jpg at 1920x1080 (YouTube: 16:9, < 2 MB).
// usage: node thumbnails/src/render.cjs [id ...]
const { chromium } = require('playwright');
const path = require('path');
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['intro', 'pilot', 'ed1', 'sp1'];
const names = { intro: 'GCP_thumb_00_The-Introduction', pilot: 'GCP_thumb_01_Headline-Edition',
  ed1: 'GCP_thumb_02_Edition-1', sp1: 'GCP_thumb_03_Special-No-1' };
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
  const file = 'file://' + path.resolve(__dirname, 'thumbs.html');
  for (const id of ids) {
    await p.goto(file + '?t=' + id, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    const out = path.resolve(__dirname, '..', names[id] + '.jpg');
    await p.screenshot({ path: out, type: 'jpeg', quality: 90 });
    console.log(out);
  }
  await b.close();
})();
