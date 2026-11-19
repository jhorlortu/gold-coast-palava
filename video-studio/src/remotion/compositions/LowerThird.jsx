// Transparent lower-third, meant to be rendered with alpha and overlaid by FFmpeg.
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

export const LowerThird = ({ name, role, accent, transparent = true, background = '#000' }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const ease = Easing.bezier(0.16, 1, 0.3, 1);
  const inK = interpolate(frame, [0, 0.7 * fps], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const textK = interpolate(frame, [0.25 * fps, 0.9 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });
  const outK = interpolate(frame, [durationInFrames - 0.5 * fps, durationInFrames - 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const s = height / 1080;
  return (
    <AbsoluteFill style={{ background: transparent ? 'transparent' : background, fontFamily: 'Inter, sans-serif' }}>
      <div style={{ position: 'absolute', left: width * 0.07, bottom: height * 0.12, opacity: outK, display: 'flex', alignItems: 'stretch' }}>
        <div style={{ width: 10 * s, background: accent, borderRadius: 5 * s, transform: `scaleY(${inK})` }} />
        <div style={{ background: 'rgba(10,10,18,0.82)', padding: `${18 * s}px ${32 * s}px`, marginLeft: 14 * s, borderRadius: 10 * s, clipPath: `inset(0 ${(1 - inK) * 100}% 0 0)` }}>
          <div style={{ color: '#fff', fontSize: 52 * s, fontWeight: 700, transform: `translateX(${(1 - textK) * -30}px)`, opacity: textK }}>{name}</div>
          <div style={{ color: accent, fontSize: 30 * s, fontWeight: 500, marginTop: 4 * s, opacity: textK }}>{role}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
