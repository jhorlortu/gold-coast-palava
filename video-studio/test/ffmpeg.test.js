// Integration tests against the real ffmpeg binary, at small sizes so they run fast.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import * as ff from '../src/ffmpeg/index.js';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vs-ff-'));
const F = { W: 320, H: 180, fps: 30 };
test.after(() => fs.rmSync(dir, { recursive: true, force: true }));

test('conform + join: transitions overlap, cuts add up', async () => {
  const a = await ff.conformColor({ ...F, color: 'red', duration: 2, out: path.join(dir, 'a.mp4') });
  const b = await ff.conformColor({ ...F, color: 'blue', duration: 2, out: path.join(dir, 'b.mp4') });
  const c = await ff.conformColor({ ...F, color: 'green', duration: 1, out: path.join(dir, 'c.mp4') });
  const len = await ff.joinSegments([
    { file: a, duration: 2 },
    { file: b, duration: 2, transition: { type: 'fade', duration: 0.5 } },
    { file: c, duration: 1 },
  ], path.join(dir, 'j.mp4'));
  assert.equal(len, 4.5);
  const info = await ff.probe(path.join(dir, 'j.mp4'));
  assert.ok(Math.abs(info.duration - 4.5) < 0.1, `duration ${info.duration}`);
  assert.equal(info.width, 320);
  assert.ok(info.hasAudio, 'silent audio track kept so audio transitions work');
});

test('conformVideo: trim + speed + fit to target size', async () => {
  const src = path.join(dir, 'src.mp4');
  await ff.ffmpeg(['-f', 'lavfi', '-i', 'testsrc2=s=640x480:r=25:d=4', '-f', 'lavfi', '-i', 'sine=d=4', '-shortest', '-pix_fmt', 'yuv420p', src]);
  const out = await ff.conformVideo({ ...F, src, out: path.join(dir, 'v.mp4'), inPoint: 1, outPoint: 3, speed: 2 });
  const info = await ff.probe(out);
  assert.ok(Math.abs(info.duration - 1) < 0.1, `2s at 2x is 1s, got ${info.duration}`);
  assert.deepEqual([info.width, info.height, Math.round(info.fps)], [320, 180, 30]);
});

test('mixAudio: music ducks under the voice and output hits target loudness', async () => {
  const program = await ff.conformColor({ ...F, duration: 6, out: path.join(dir, 'p.mp4') });
  const music = path.join(dir, 'm.wav');
  const voice = path.join(dir, 'vo.wav');
  await ff.ffmpeg(['-f', 'lavfi', '-i', 'sine=f=200:d=6:sample_rate=48000', '-ac', '2', music]);
  await ff.ffmpeg(['-f', 'lavfi', '-i', 'sine=f=2000:d=2:sample_rate=48000', '-ac', '2', voice]);
  const { file } = await ff.mixAudio({ program, duration: 6, audio: { tracks: [{ file: voice, start: 3 }], music: { file: music, volume: 0.5, fadeIn: 0.01, fadeOut: 0.01 } }, loudness: -16, out: path.join(dir, 'mix.wav') });
  // Level of the music band (lowpass) before vs during the voice.
  const rms = async (ss) => {
    const out = await new Promise((res) => {
      import('node:child_process').then(({ spawn }) => {
        const p = spawn('ffmpeg', ['-hide_banner', '-ss', String(ss), '-t', '1', '-i', file, '-af', 'lowpass=f=400,astats=metadata=0', '-f', 'null', '-']);
        let e = ''; p.stderr.on('data', (d) => { e += d; }); p.on('close', () => res(e));
      });
    });
    return Number(out.match(/Overall[\s\S]*?RMS level dB:\s*(-?[\d.]+)/)[1]);
  };
  const before = await rms(1.5), during = await rms(3.8);
  assert.ok(before - during > 6, `music should duck >6 dB (before ${before}, during ${during})`);
  const lufs = await ff.loudnessOf(file);
  assert.ok(Math.abs(lufs - -16) < 1, `loudness ${lufs}`);
});

test('writeSrt formats timestamps', () => {
  const f = ff.writeSrt([{ start: 61.5, end: 3725.042, text: 'hi' }], path.join(dir, 'c.srt'));
  assert.equal(fs.readFileSync(f, 'utf8'), '1\n00:01:01,500 --> 01:02:05,042\nhi\n');
});
