import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { normalizeDesign } from '../src/design-to-motion/normalize.js';
import { compileToHyperFrames } from '../src/design-to-motion/to-hyperframes.js';

const design = {
  name: 't', duration: 4, style: 'minimal',
  tokens: { colors: { brand: '#ff0000' } },
  layers: [
    { id: 'body', type: 'text', text: 'second', x: 100, y: 500, fontSize: 40 },
    { id: 'bg', type: 'rect', x: 0, y: 0, width: 1920, height: 1080, fill: '$brand' },
    { id: 'head', type: 'text', text: 'first line', x: 100, y: 200, fontSize: 100 },
    { id: 'custom', type: 'ellipse', x: 900, y: 200, width: 50, height: 50, motion: { preset: 'pop', delay: 2 } },
  ],
};

test('auto-choreography: roles, reading order, tokens, explicit overrides', () => {
  const s = normalizeDesign(design);
  const by = Object.fromEntries(s.layers.map((l) => [l.id, l]));
  assert.equal(by.bg.role, 'background');
  assert.equal(by.bg.fill, '#ff0000');
  assert.equal(by.bg.motion.delay, 0);
  assert.equal(by.head.role, 'headline');
  assert.equal(by.body.role, 'body');
  assert.ok(by.head.motion.delay < by.body.motion.delay, 'top layer enters first');
  assert.equal(by.custom.motion.preset, 'pop');
  assert.equal(by.custom.motion.delay, 2);
  assert.equal(by.head.motion.exit.name, 'fade', 'style exit applied');
});

test('styles change the choreography', () => {
  const s = normalizeDesign({ ...design, style: 'energetic' });
  const head = s.layers.find((l) => l.id === 'head');
  assert.equal(head.motion.preset, 'pop');
  assert.equal(head.motion.split, 'words');
});

test('unknown token and style fail clearly', () => {
  assert.throws(() => normalizeDesign({ ...design, layers: [{ type: 'rect', fill: '$nope' }] }), /Unknown design token "\$nope"/);
  assert.throws(() => normalizeDesign({ ...design, style: 'wild' }), /Unknown design style "wild"/);
});

test('HyperFrames compile: scene sub-composition with registered timeline', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'd2m-'));
  compileToHyperFrames(normalizeDesign({ ...design, style: 'energetic' }), dir);
  const index = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  const scene = fs.readFileSync(path.join(dir, 'compositions/scene.html'), 'utf8');
  assert.match(index, /data-composition-src="compositions\/scene.html"/);
  assert.match(scene, /window.__timelines\["scene"\] = tl/);
  assert.match(scene, /id="head-p0"/, 'headline split into words');
  assert.doesNotMatch(scene, /repeat:\s*-1|Math.random|Date.now/);
  assert.ok(fs.existsSync(path.join(dir, 'assets/gsap.min.js')));
  fs.rmSync(dir, { recursive: true });
});
