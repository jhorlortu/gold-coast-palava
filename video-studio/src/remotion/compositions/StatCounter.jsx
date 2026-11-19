import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

export const StatCounter = ({ value, prefix, suffix, label, accent, background, decimals = 0 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const k = interpolate(frame, [0.2 * fps, Math.min(durationInFrames - 1, 2.2 * fps)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const labelK = interpolate(frame, [0.8 * fps, 1.4 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const shown = (value * k).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <AbsoluteFill style={{ background, justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ color: accent, fontSize: 180, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.04em' }}>{prefix}{shown}{suffix}</div>
      <div style={{ color: '#fff', fontSize: 48, opacity: labelK, transform: `translateY(${(1 - labelK) * 20}px)` }}>{label}</div>
    </AbsoluteFill>
  );
};
