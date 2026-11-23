// usage: GCP_WORK=/home/user/gcp/sp1/work GCP_EDITION="SPECIAL No. 1" node build.mjs [--render] [--quality draft|standard] [--end S] seg1 seg2 ...
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
process.env.GCP_CUE_LEAD ??= '0.4';   // client: voice ran slightly ahead of the graphics (Whisper starts measured ~0.38 s late)
const SP = await import('./sp1.mjs');
let QS = {}; try { QS = await import('./questions.mjs'); } catch (e) { if (!/Cannot find module/.test(e.message)) throw e; }
const BUILDERS = { ...SP.BUILDERS, ...(QS.BUILDERS || {}) };
const HF = '/home/user/video-studio/node_modules/hyperframes/bin/hyperframes.mjs';
const args = process.argv.slice(2);
const render = args.includes('--render');
const quality = args.includes('--quality') ? args[args.indexOf('--quality') + 1] : 'draft';
const end = args.includes('--end') ? args[args.indexOf('--end') + 1] : null;
const ids = args.filter((a, i) => !a.startsWith('--') && !['--quality', '--end'].includes(args[i - 1]));
const OUT = '/home/user/gcp/sp1/build';
for (const d of ['sfx', 'busy', 'renders', 'hf', 'phonewin']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
for (const id of ids.length ? ids : Object.keys(BUILDERS)) {
  const part = BUILDERS[id]();
  const dir = path.join(OUT, 'hf', id);
  const { sfx, busy } = part.write(dir);
  fs.copyFileSync('/home/user/gcp/sp1/media/fonts/SpecialElite-Regular.ttf', path.join(dir, 'assets', 'special-elite.ttf'));
  fs.copyFileSync('/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf', path.join(dir, 'assets', 'noto-emoji.ttf'));
  fs.writeFileSync(path.join(OUT, 'sfx', `${id}.json`), JSON.stringify(sfx, null, 1));
  fs.writeFileSync(path.join(OUT, 'busy', `${id}.json`), JSON.stringify(busy ?? []));
  fs.writeFileSync(path.join(OUT, 'phonewin', `${id}.json`), JSON.stringify(part.phoneWin ?? []));
  let lintOut; try { lintOut = execFileSync('node', [HF, 'lint', dir], { encoding: 'utf8', env: { ...process.env, DO_NOT_TRACK: '1', CI: '1' } }); } catch (e) { lintOut = (e.stdout || '') + (e.stderr || ''); }
  const bad = lintOut.split('\n').filter((l) => /✗/.test(l) && !/root_zoom_rescales_a_fixed_canvas/.test(l));
  if (bad.length) { console.log(bad.join('\n')); throw new Error(`${id}: lint errors`); }
  const g = part.gaps ? part.gaps() : null;
  console.log(`${id}: ${part.dur}s, ${sfx.length} sfx${g ? `, ${g.events} events, longest gap ${g.worst}s @${g.at}` : ''} (lint ok)`);
  if (render) {
    const t = Date.now();
    execFileSync('node', [HF, 'render', dir, '-o', path.join(OUT, 'renders', `${id}.mp4`), '--fps', '30', '--quality', quality, ...(end ? ['--end', end] : [])], { stdio: 'ignore', env: { ...process.env, DO_NOT_TRACK: '1', CI: '1' } });
    console.log(`  rendered in ${((Date.now() - t) / 1000).toFixed(0)}s`);
  }
}
