import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

export const TitleCard = ({ title, subtitle, accent, background, color }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const bar = interpolate(frame, [8, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.exp) });
  const sub = interpolate(frame, [18, 38], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const scale = width / 1920;
  return (
    <AbsoluteFill style={{ background, justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, sans-serif', opacity: out }}>
      <div style={{ textAlign: 'center', transform: `scale(${scale})` }}>
        <div style={{ color, fontSize: 128, fontWeight: 800, letterSpacing: '-0.03em', transform: `translateY(${(1 - enter) * 60}px)`, opacity: enter }}>{title}</div>
        <div style={{ height: 8, width: 240 * bar, background: accent, margin: '28px auto', borderRadius: 4 }} />
        <div style={{ color, opacity: 0.75 * sub, fontSize: 44, fontWeight: 400 }}>{subtitle}</div>
      </div>
    </AbsoluteFill>
  );
};
