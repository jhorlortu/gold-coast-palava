import test from 'node:test';
import assert from 'node:assert/strict';
import { figmaToDesign, motionFromName } from '../src/design-to-motion/import-figma.js';
import { normalizeDesign } from '../src/design-to-motion/normalize.js';

const c = (r, g, b, a = 1) => ({ r, g, b, a });
const file = {
  document: { type: 'DOCUMENT', children: [{ type: 'CANVAS', children: [{
    id: '1:1', type: 'FRAME', name: 'Hero', absoluteBoundingBox: { x: 1000, y: 500, width: 1920, height: 1080 },
    fills: [{ type: 'SOLID', color: c(0.05, 0.05, 0.1) }],
    children: [
      { id: '1:2', type: 'TEXT', name: 'Title [pop delay=0.4]', characters: 'Hello', absoluteBoundingBox: { x: 1100, y: 700, width: 800, height: 120 },
        style: { fontFamily: 'Inter', fontSize: 100, fontWeight: 800, textAlignHorizontal: 'CENTER', lineHeightPx: 120, letterSpacing: -2 }, fills: [{ type: 'SOLID', color: c(1, 1, 1) }] },
      { id: '1:3', type: 'RECTANGLE', name: 'Card', absoluteBoundingBox: { x: 1200, y: 900, width: 300, height: 200 }, cornerRadius: 16,
        fills: [{ type: 'GRADIENT_LINEAR', gradientStops: [{ position: 0, color: c(1, 0, 0) }, { position: 1, color: c(0, 0, 1) }], gradientHandlePositions: [{ x: 0, y: 0.5 }, { x: 1, y: 0.5 }] }],
        effects: [{ type: 'DROP_SHADOW', offset: { x: 0, y: 4 }, radius: 12, color: c(0, 0, 0, 0.5) }] },
      { id: '1:4', type: 'ELLIPSE', name: 'Hidden', visible: false, absoluteBoundingBox: { x: 0, y: 0, width: 1, height: 1 } },
    ],
  }] }] },
};

test('motion hints in layer names', () => {
  assert.deepEqual(motionFromName('Logo [spin delay=0.4 idle=float]'), { preset: 'spin', delay: 0.4, idle: 'float' });
  assert.equal(motionFromName('Plain'), undefined);
});

test('Figma frame converts to a design that normalizes', () => {
  const d = figmaToDesign(file);
  assert.equal(d.width, 1920);
  assert.equal(d.background, '#0d0d1a');
  assert.equal(d.layers.length, 2, 'hidden layer skipped');
  const [title, card] = d.layers;
  assert.equal(title.id, 'Title');
  assert.deepEqual([title.x, title.y], [100, 200], 'positions relative to frame');
  assert.deepEqual(title.motion, { preset: 'pop', delay: 0.4 });
  assert.equal(title.align, 'center');
  assert.equal(title.lineHeight, 1.2);
  assert.match(card.fill, /^linear-gradient\(90deg, #ff0000 0%, #0000ff 100%\)$/);
  assert.equal(card.shadow.blur, 12);
  const s = normalizeDesign(d);
  assert.equal(s.layers[0].motion.preset, 'pop');
});
