// Renders a design-to-motion scene. Motion comes from the same shared presets the
// HyperFrames compiler uses, evaluated per frame with stateAt().
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { IDENTITY, stateAt, stateToCss } from '../../shared/motion.js';
import { boxStyle, contentStyle, imageStyle } from '../../shared/layer-style.js';
import { textGroups } from '../../design-to-motion/normalize.js';

const Layer = ({ layer: l, t, duration }) => {
  const m = l.motion;
  const boxSpec = m.split ? { ...m, from: { ...IDENTITY } } : m;
  const pieceSpec = { ...m, idle: null, exit: { ...m.exit, duration: 0 } };
  const state = stateAt(boxSpec, t, duration);

  let inner = null;
  if (l.type === 'text') {
    if (m.split) {
      let i = 0;
      inner = textGroups(l.text, m.split).map((g, k) => {
        if (g.space != null) return <React.Fragment key={k}>{g.space}</React.Fragment>;
        const spans = g.pieces.map((piece, j) => {
          const s = stateAt(pieceSpec, t, duration, i++ * m.stagger);
          return <span key={j} style={{ display: 'inline-block', ...stateToCss(s) }}>{piece}</span>;
        });
        return g.pieces.length > 1 ? <span key={k} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>{spans}</span> : <React.Fragment key={k}>{spans}</React.Fragment>;
      });
    } else inner = l.text;
  } else if (l.type === 'image') {
    inner = <Img src={staticFile(l.src)} style={imageStyle(l)} />;
  } else if (l.type === 'group') {
    inner = l.children.map((c) => <Layer key={c.id} layer={c} t={t} duration={duration} />);
  }

  return (
    <div style={{ ...boxStyle(l), ...stateToCss(state) }}>
      <div style={contentStyle(l)}>{inner}</div>
    </div>
  );
};

export const DesignScene = ({ layers, background, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ background, overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      {layers.map((l) => <Layer key={l.id} layer={l} t={t} duration={duration} />)}
    </AbsoluteFill>
  );
};
