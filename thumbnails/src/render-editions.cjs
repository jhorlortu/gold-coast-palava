// Renders the edition thumbnails (client front-page template) to thumbnails/editions/<name>.jpg at 1920x1080.
// usage: node thumbnails/src/render-editions.cjs [id ...]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const names = { intro: 'GCP_thumb_00_The-Introduction', pilot: 'GCP_thumb_01_Headline-Edition', ed1: 'GCP_thumb_02_Edition-1',
  ed2: 'GCP_thumb_03_Edition-2', ed3: 'GCP_thumb_04_Edition-3', ed4: 'GCP_thumb_05_Edition-4' };
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(names);
(async () => {
  const outDir = path.resolve(__dirname, '..', 'editions');
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
  const file = 'file://' + path.resolve(__dirname, 'editions.html');
  for (const id of ids) {
    await p.goto(file + '?t=' + id, { waitUntil: 'networkidle' });
    await p.waitForFunction(() => document.body.dataset.ready === '1');
    await p.waitForTimeout(300);
    const out = path.join(outDir, names[id] + '.jpg');
    await p.screenshot({ path: out, type: 'jpeg', quality: 90 });
    console.log(out);
  }
  await b.close();
})();
