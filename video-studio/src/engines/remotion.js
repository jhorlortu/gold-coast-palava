// Remotion engine: bundles src/remotion once per build, then renders any of its
// compositions with the given props (opaque H.264, or ProRes 4444 with alpha for overlays).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ENTRY = fileURLToPath(new URL('../remotion/index.js', import.meta.url));

export function findBrowser() {
  if (process.env.REMOTION_BROWSER) return process.env.REMOTION_BROWSER;
  const root = '/opt/pw-browsers';
  if (!fs.existsSync(root)) return undefined; // let Remotion download its own
  for (const d of fs.readdirSync(root).filter((x) => x.startsWith('chromium_headless_shell')).sort().reverse()) {
    for (const sub of fs.readdirSync(path.join(root, d))) {
      const p = path.join(root, d, sub, 'chrome-headless-shell');
      if (fs.existsSync(p)) return p;
    }
  }
  return undefined;
}

export class RemotionEngine {
  constructor({ publicDir, log = console.log }) {
    this.publicDir = publicDir;
    this.log = log;
    this.serveUrl = null;
  }

  async bundle() {
    if (this.serveUrl) return this.serveUrl;
    const { bundle } = await import('@remotion/bundler');
    fs.mkdirSync(this.publicDir, { recursive: true });
    this.log('  [remotion] bundling compositions…');
    this.serveUrl = await bundle({ entryPoint: ENTRY, publicDir: this.publicDir, onProgress: () => {} });
    return this.serveUrl;
  }

  /** Render `compositionId` with `props` to `outFile`. alpha=true -> ProRes 4444 .mov */
  async render({ compositionId, props, outFile, alpha = false, concurrency }) {
    const { selectComposition, renderMedia } = await import('@remotion/renderer');
    const serveUrl = await this.bundle();
    const browserExecutable = findBrowser();
    const composition = await selectComposition({ serveUrl, id: compositionId, inputProps: props, browserExecutable });
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    let last = -1;
    await renderMedia({
      composition, serveUrl, inputProps: props, outputLocation: outFile, browserExecutable,
      concurrency: concurrency ?? null,
      ...(alpha
        ? { codec: 'prores', proResProfile: '4444', pixelFormat: 'yuva444p10le', imageFormat: 'png' }
        : { codec: 'h264', crf: 16, imageFormat: 'jpeg', jpegQuality: 95 }),
      muted: true,
      onProgress: ({ progress }) => {
        const pct = Math.floor(progress * 10) * 10;
        if (pct !== last) { last = pct; process.stdout.write(`\r  [remotion] ${compositionId} ${pct}%   `); }
      },
    });
    process.stdout.write('\n');
    return outFile;
  }
}
