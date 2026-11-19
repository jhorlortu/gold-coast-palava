import test from 'node:test';
import assert from 'node:assert/strict';
import { bezierEase, EASES, resolveMotion, stateAt, IDENTITY } from '../src/shared/motion.js';

test('bezier eases start at 0, end at 1, linear is identity', () => {
  for (const [name, e] of Object.entries(EASES)) {
    assert.equal(bezierEase(e.bezier, 0), 0, name);
    assert.equal(bezierEase(e.bezier, 1), 1, name);
  }
  assert.ok(Math.abs(bezierEase(EASES.linear.bezier, 0.37) - 0.37) < 1e-4);
  assert.ok(bezierEase(EASES['out-back'].bezier, 0.6) > 1, 'out-back overshoots');
});

test('stateAt: before, during, after entrance, then exit', () => {
  const m = resolveMotion({ preset: 'rise', delay: 1, duration: 1, exit: 'fade' });
  assert.deepEqual(stateAt(m, 0.5, 5), { ...IDENTITY, opacity: 0, y: 60 });
  const mid = stateAt(m, 1.5, 5);
  assert.ok(mid.opacity > 0 && mid.opacity < 1 && mid.y > 0 && mid.y < 60);
  assert.deepEqual(stateAt(m, 3, 5), IDENTITY);
  const o = (t) => stateAt(m, t, 5).opacity;
  assert.equal(o(4.6), 1, 'exit starts 0.4s before the end');
  assert.ok(o(4.7) < 1 && o(4.9) < o(4.7), 'opacity falls through the exit');
  assert.ok(o(4.999) < 0.02, 'gone by the last instant');
});

test('resolveMotion rejects unknown presets with a helpful list', () => {
  assert.throws(() => resolveMotion('wobble'), /Unknown entrance preset "wobble". Known: fade, rise/);
  assert.throws(() => resolveMotion({ preset: 'fade', ease: 'bouncy' }), /Unknown ease/);
});
