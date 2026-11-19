import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProject } from '../src/schema.js';
import { resolveTransition } from '../src/ffmpeg/index.js';

test('valid project passes', () => {
  validateProject({ timeline: [{ type: 'color', duration: 1 }, { type: 'motion', composition: 'TitleCard', transition: 'crossfade' }] });
});

test('errors are collected and specific', () => {
  assert.throws(() => validateProject({ timeline: [
    { id: 'a', type: 'video' },
    { id: 'a', type: 'motion', engine: 'hyperframes' },
    { type: 'gif' },
  ], overlays: [{ type: 'image', src: 'x.png' }] }), (e) => {
    assert.match(e.message, /timeline\[0\] \(a\): "src" is required/);
    assert.match(e.message, /duplicate id "a"/);
    assert.match(e.message, /HyperFrames motion needs "project"/);
    assert.match(e.message, /timeline\[2\]: type must be one of/);
    assert.match(e.message, /overlays\[0\]: needs "start"/);
    return true;
  });
});

test('transitions: aliases, raw xfade names, cut, unknown', () => {
  assert.deepEqual(resolveTransition('crossfade'), { type: 'fade', duration: 0.5 });
  assert.deepEqual(resolveTransition({ type: 'circleopen', duration: 1 }), { type: 'circleopen', duration: 1 });
  assert.equal(resolveTransition('cut'), null);
  assert.equal(resolveTransition(undefined), null);
  assert.throws(() => resolveTransition('spin'), /Unknown transition "spin"/);
});
