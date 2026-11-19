// HyperFrames engine: renders a HyperFrames project directory with the local CLI.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const CLI = path.join(path.dirname(require.resolve('hyperframes/package.json')), 'bin', 'hyperframes.mjs');

export function runHyperFrames(args, { cwd, log = console.log, quiet = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [CLI, ...args], {
      cwd, env: { ...process.env, HYPERFRAMES_TELEMETRY: '0', DO_NOT_TRACK: '1', CI: '1' },
    });
    let out = '';
    const onData = (d) => { out += d; if (!quiet) for (const line of String(d).split('\n')) if (/%|error|✗|warn/i.test(line) && line.trim()) log(`  [hyperframes] ${line.trim().slice(0, 160)}`); };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('close', (code) => (code === 0 ? resolve(out) : reject(new Error(`hyperframes ${args[0]} failed (exit ${code}):\n${out.slice(-3000)}`))));
  });
}

/**
 * @param projectDir HyperFrames project (has index.html)
 * @param outFile    .mp4 (opaque) or .mov (ProRes 4444 with alpha)
 */
export async function renderHyperFrames({ projectDir, outFile, fps = 30, quality = 'looks', variables, log }) {
  if (!fs.existsSync(path.join(projectDir, 'index.html'))) throw new Error(`No index.html in HyperFrames project ${projectDir}`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const format = outFile.endsWith('.mov') ? 'mov' : outFile.endsWith('.webm') ? 'webm' : 'mp4';
  const args = ['render', path.resolve(projectDir), '-o', path.resolve(outFile), '--fps', String(fps), '--quality', quality, '--format', format];
  if (variables && Object.keys(variables).length) args.push('--variables', JSON.stringify(variables));
  log?.(`  [hyperframes] rendering ${path.basename(projectDir)} → ${path.basename(outFile)}`);
  await runHyperFrames(args, { log, quiet: true });
  if (!fs.existsSync(outFile)) throw new Error(`hyperframes render reported success but ${outFile} is missing`);
  return outFile;
}

export const lintHyperFrames = (projectDir, log) => runHyperFrames(['lint', path.resolve(projectDir)], { log, quiet: true });
