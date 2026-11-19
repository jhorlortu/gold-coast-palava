// Section sting: a full-screen section card timed around a short musical sting.
// Enters before the sting, holds while it plays, then wipes to paper for the next section.
import React, { useState } from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, delayRender, continueRender } from 'remotion';

const loaded = {};
function useFonts(fonts) {
  const [handle] = useState(() => (fonts?.length ? delayRender('fonts') : null));
  useState(() => {
    if (!fonts?.length) return;
    Promise.all(fonts.map(({ family, file, weight = 400, style = 'normal' }) => {
      const key = `${family}-${weight}-${style}`;
      if (!loaded[key]) loaded[key] = new FontFace(family, `url(${staticFile(file)})`, { weight: String(weight), style }).load().then((f) => document.fonts.add(f));
      return loaded[key];
    })).then(() => continueRender(handle)).catch(() => continueRender(handle));
  });
}

export const SectionSting = ({ title = 'SECTION', kicker = '', subtitle = '', icon = null, number = '', stingAt = 0.8, stingDur = 5, fonts = [], palette = {}, theme = 'dark' }) => {
  const light = theme === 'light';
  useFonts(fonts);
  const f = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const t = f / fps, dur = durationInFrames / fps;
  const ink = palette.ink ?? '#1A1612', paper = palette.paper ?? '#EFE6CF', gold = palette.gold ?? '#C9962F', red = palette.red ?? '#A3242B';
  // Springs only (no eased fades): sp(at, preset) -> 0..1 settling spring starting at time `at`
  const P = { snappy: { damping: 26, stiffness: 320, mass: 1 }, default: { damping: 22, stiffness: 180, mass: 1 }, heavy: { damping: 30, stiffness: 140, mass: 1.6 } };
  const sp = (at, preset = 'default') => spring({ frame: f - Math.round(at * fps), fps, config: P[preset] });
  const band = sp(0, 'heavy');
  const iconIn = sp(0.05, 'default');
  const kick = sp(Math.max(0.15, stingAt - 0.1), 'snappy');
  const sub = sp(stingAt + 0.9, 'default');
  const numIn = sp(0, 'heavy');
  const push = interpolate(t, [0, dur], [1.04, 1], { extrapolateRight: 'clamp' });
  const wipe = interpolate(t, [dur - 0.55, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  const letters = Array.from(title);
  const s = height / 1080;
  return (
    <AbsoluteFill style={{ background: `url(${staticFile(light ? 'paper.jpg' : 'ink.jpg')}) center/cover`, overflow: 'hidden' }}>
      {light && <AbsoluteFill style={{ background: `url(${staticFile('papers-bg.jpg')}) center/cover`, opacity: 0.1 }} />}
      <AbsoluteFill style={{ transform: `translateY(${light ? -wipe * height * 1.1 : 0}px) scale(${push})` }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 735 * s, height: 22 * s, transformOrigin: '0 50%', transform: `scaleX(${band})`,
          background: `repeating-linear-gradient(90deg, ${gold} 0 ${46 * s}px, ${red} ${46 * s}px ${70 * s}px, ${ink} ${70 * s}px ${86 * s}px, ${gold} ${86 * s}px ${120 * s}px, #2E6B3A ${120 * s}px ${132 * s}px, ${paper} ${132 * s}px ${136 * s}px)` }} />
        {icon && <Img src={staticFile(icon)} style={{ position: 'absolute', left: 150 * s, top: 300 * s, width: 330 * s, height: 330 * s, borderRadius: '50%', clipPath: `circle(${Math.max(0, iconIn) * 52}% at 50% 50%)`, boxShadow: light ? '0 24px 50px -18px rgba(60,40,10,.5)' : 'none', border: light ? '4px solid #1A1612' : 'none', transform: `scale(${0.7 + 0.3 * iconIn}) rotate(${(1 - iconIn) * -25}deg)` }} />}
        <div style={{ position: 'absolute', left: (icon ? 540 : 150) * s, top: 300 * s, right: 120 * s }}>
          <div style={{ fontFamily: 'Plex', fontWeight: 700, fontSize: 28 * s, letterSpacing: '0.3em', color: light ? red : gold, clipPath: `inset(0 ${(1 - Math.min(1, kick)) * 100}% 0 0)`, transform: `translateX(${(1 - kick) * -40}px)` }}>{number ? `SECTION ${number} · ` : ''}{kicker}</div>
          <div style={{ fontFamily: 'Playfair', fontWeight: 900, fontSize: Math.min(150, 1700 / letters.length) * s, lineHeight: 1, color: light ? ink : paper, marginTop: 18 * s, whiteSpace: 'nowrap' }}>
            {letters.map((ch, i) => { const a = sp(stingAt + 0.05 + i * 0.04, 'heavy'); return <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: 8 * s }}><span style={{ display: 'inline-block', transform: `translateY(${(1 - a) * 118}%)` }}>{ch === ' ' ? '\u00a0' : ch}</span></span>; })}
          </div>
          <div style={{ fontFamily: 'PlayfairI', fontStyle: 'italic', fontSize: 52 * s, color: light ? '#6B6253' : '#B8AE98', marginTop: 24 * s, overflow: 'hidden' }}><div style={{ transform: `translateY(${(1 - sub) * 110}%)` }}>{subtitle}</div></div>
        </div>
      </AbsoluteFill>
      {!light && <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: width * wipe, background: light ? ink : `url(${staticFile('paper.jpg')}) left/cover`, boxShadow: '0 0 60px rgba(0,0,0,.35)' }} />}
    </AbsoluteFill>
  );
};
