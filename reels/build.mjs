// usage: GCP_FORMAT=9x16 GCP_WORK=<edition work> GCP_EDITION="..." node build.mjs <pilot|ed1> [--render] [--quality draft|looks]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const HF = '/home/user/video-studio/node_modules/hyperframes/bin/hyperframes.mjs';
const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith('--') && !['draft', 'looks'].includes(a));
const quality = args.includes('--quality') ? args[args.indexOf('--quality') + 1] : 'looks';
const M = await import(`./${name}.mjs`);
const { p } = M.build();
const dir = path.join('/home/user/gcp/reels', name, 'hf');
const { sfx } = p.write(dir);
fs.writeFileSync(path.join('/home/user/gcp/reels', name, 'sfx.json'), JSON.stringify(sfx, null, 1));
let lintOut; try { lintOut = execFileSync('node', [HF, 'lint', dir], { encoding: 'utf8', env: { ...process.env, DO_NOT_TRACK: '1', CI: '1' } }); } catch (e) { lintOut = (e.stdout || '') + (e.stderr || ''); }
const bad = lintOut.split('\n').filter((l) => /✗/.test(l));
if (bad.length) { console.log(bad.join('\n')); throw new Error('lint errors'); }
const g = p.gaps();
{ const ev = [...new Set(p.events.map((t) => Math.round(t * 10) / 10))].sort((a, b) => a - b); const pts = [0, ...ev, p.dur]; const big = []; for (let i = 1; i < pts.length; i++) if (pts[i] - pts[i - 1] > 5.5) big.push(`${pts[i - 1]}→${pts[i]}`); if (big.length) console.log('gaps > 5.5s:', big.join('  ')); }
console.log(`${name}: ${p.dur}s, ${sfx.length} sfx, ${g.events} events, longest gap ${g.worst}s @${g.at} (lint ok)`);
if (args.includes('--render')) {
  const t = Date.now();
  execFileSync('node', [HF, 'render', dir, '-o', path.join('/home/user/gcp/reels', name, 'video.mp4'), '--fps', '30', '--quality', quality], { stdio: 'ignore', env: { ...process.env, DO_NOT_TRACK: '1', CI: '1' } });
  console.log(`  rendered in ${((Date.now() - t) / 1000).toFixed(0)}s`);
}
