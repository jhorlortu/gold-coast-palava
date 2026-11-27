// Specials thumbnails (Specials style). Renders to thumbnails/specials/<name>.jpg at 1920x1080 (YouTube: 16:9, < 2 MB).
// usage: node thumbnails/src/render.cjs [id ...]
const { chromium } = require('playwright');
const path = require('path');
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ['sp1', 'sp2'];
const names = { intro: 'GCP_thumb_00_The-Introduction', pilot: 'GCP_thumb_01_Headline-Edition',
  ed1: 'GCP_thumb_02_Edition-1', ed2: 'GCP_thumb_03_Edition-2', ed3: 'GCP_thumb_04_Edition-3',
  ed4: 'GCP_thumb_05_Edition-4', sp1: 'GCP_thumb_S1_Special-No-1', sp2: 'GCP_thumb_S2_Special-No-2' };
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
  const file = 'file://' + path.resolve(__dirname, 'thumbs.html');
  for (const id of ids) {
    await p.goto(file + '?t=' + id, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(300);
    const out = path.resolve(__dirname, '..', 'specials', names[id] + '.jpg');
    await p.screenshot({ path: out, type: 'jpeg', quality: 90 });
    console.log(out);
  }
  await b.close();
})();
