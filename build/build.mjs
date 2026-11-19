// usage: node build.mjs [--render] [--quality draft|looks] seg1 seg2 ...
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { BUILDERS as B1 } from './parts.mjs';
import * as SEC from './sections.mjs';
const BUILDERS = { ...B1, paper: SEC.paper, lead: SEC.lead, wire: SEC.wire, walk: SEC.walk, nest: SEC.nest, editor: SEC.editor, letters: SEC.letters, dispatch: SEC.dispatch };
const args = process.argv.slice(2);
const render = args.includes('--render');
const quality = args.includes('--quality') ? args[args.indexOf('--quality') + 1] : 'draft';
const ids = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--quality');
const HF = '/home/user/video-studio/node_modules/hyperframes/bin/hyperframes.mjs';
fs.mkdirSync('sfx', { recursive: true }); fs.mkdirSync('busy', { recursive: true }); fs.mkdirSync('renders', { recursive: true });
for (const id of ids.length ? ids : Object.keys(BUILDERS)) {
  const part = BUILDERS[id]();
  const dir = path.resolve('hf', id);
  const { sfx, busy } = part.write(dir);
  fs.writeFileSync(`sfx/${id}.json`, JSON.stringify(sfx, null, 1));
  fs.mkdirSync('busy', { recursive: true }); fs.writeFileSync(`busy/${id}.json`, JSON.stringify(busy ?? [[part.T0, part.T0 + part.dur]]));
  // The 2K zoom (1920 layout x 1.333 = exactly 2560x1440) trips root_zoom_rescales_a_fixed_canvas; that rule is expected here.
  let lintOut;
  try { lintOut = execFileSync('node', [HF, 'lint', dir], { encoding: 'utf8', env: { ...process.env, DO_NOT_TRACK: '1', CI: '1' } }); }
  catch (e) { lintOut = (e.stdout || '') + (e.stderr || ''); }
  const bad = lintOut.split('\n').filter((l) => /✗/.test(l) && !/root_zoom_rescales_a_fixed_canvas/.test(l));
  if (bad.length) { console.log(lintOut); throw new Error(`${id}: lint errors`); }
  const lint = '';
  const g = part.gaps ? part.gaps() : null;
  console.log(`${id}: ${part.dur}s, ${part.html.length} scenes, ${sfx.length} sfx${g ? `, ${g.events} events, longest gap ${g.worst}s @${g.at}` : ''} ${lint ? '\n' + lint : '(lint ok)'}`);
  if (render) {
    const t = Date.now();
    execFileSync('node', [HF, 'render', dir, '-o', path.resolve(`renders/${id}.mp4`), '--fps', '30', '--quality', quality], { stdio: 'ignore', env: { ...process.env, DO_NOT_TRACK: '1', CI: '1' } });
    console.log(`  rendered in ${((Date.now() - t) / 1000).toFixed(0)}s`);
  }
}
