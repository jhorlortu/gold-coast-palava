// Gold Coast Palava data cards (Special No. 2 onward): a cream newsprint card that fills the frame, with a
// chart that builds on cue. Each element enters on a spring at its own time (props, seconds from clip start);
// values that change target more than once (the balance beam) sum one spring per change (track rule).
import React, { useState } from 'react';
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, delayRender, continueRender } from 'remotion';

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
const FONTS = [{ family: 'Playfair', file: 'pf900.woff2', weight: 900 }, { family: 'PlayfairI', file: 'pf400i.woff2', weight: 400, style: 'italic' }, { family: 'Plex', file: 'plex700.woff2', weight: 700 }, { family: 'Elite', file: 'special-elite.ttf', weight: 400 }];
const C = { ink: '#1A1612', paper: '#F3EBD7', card: '#FCF5E8', red: '#A4241B', gold: '#C8962F', muted: '#6E6253' };
const PRESET = { snappy: { damping: 26, stiffness: 320, mass: 1 }, default: { damping: 22, stiffness: 180, mass: 1 }, heavy: { damping: 30, stiffness: 140, mass: 1.6 }, playful: { damping: 12, stiffness: 170, mass: 1 } };
function useT() {
  const f = useCurrentFrame(); const { fps, width, height, durationInFrames } = useVideoConfig();
  const sp = (at, preset = 'default') => (at == null ? 0 : spring({ frame: f - Math.round(at * fps), fps, config: PRESET[preset] }));
  return { f, fps, t: f / fps, dur: durationInFrames / fps, sp, s: width / 1280, width, height };
}
const typed = (text, at, t, cps = 26) => (t < at ? '' : text.slice(0, Math.floor((t - at) * cps)));
const fmt = (v) => Math.round(v).toLocaleString('en-GB');

/** the card itself: cream sheet, ink border, kicker + title rising through a mask, slow camera drift */
const Card = ({ kicker, title, titleAt = 0.1, children, drift = 0.03 }) => {
  useFonts(FONTS);
  const { t, dur, sp, s } = useT();
  const k = sp(titleAt, 'snappy'), h = sp(titleAt + 0.12, 'heavy');
  const z = 1 + drift * (t / Math.max(1, dur));
  return (
    <AbsoluteFill style={{ background: C.card, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: `url(${staticFile('papers-bg.jpg')}) center/cover`, opacity: 0.07 }} />
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: '50% 60%' }}>
        <div style={{ position: 'absolute', left: 64 * s, top: 46 * s, right: 64 * s, overflow: 'hidden' }}>
          <div style={{ fontFamily: 'Plex', fontSize: 22 * s, letterSpacing: '.22em', color: C.red, transform: `translateY(${(1 - k) * 120}%)` }}>{kicker}</div>
        </div>
        <div style={{ position: 'absolute', left: 64 * s, top: 80 * s, right: 64 * s, overflow: 'hidden', paddingBottom: 8 * s }}>
          <div style={{ fontFamily: 'Playfair', fontSize: 54 * s, lineHeight: 1.08, color: C.ink, transform: `translateY(${(1 - h) * 115}%)` }}>{title}</div>
        </div>
        <div style={{ position: 'absolute', left: 64 * s, right: 64 * s, top: 160 * s, height: 4 * s, background: C.ink, transformOrigin: '0 50%', transform: `scaleX(${sp(titleAt + 0.2)})` }} />
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{ border: `${8 * s}px solid ${C.ink}`, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
/** Timeline: the line draws, dots spring on with dates above and labels below, spans fill between two dots. */
export const GcpTimeline = ({ kicker = '', title = '', items = [], spans = [] }) => {
  const { t, sp, s } = useT();
  const y = 455 * s, x0 = 90 * s, x1 = 1190 * s;
  const lineK = interpolate(t, [0.2, 1.2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const X = (u) => x0 + (x1 - x0) * u;
  return (
    <Card kicker={kicker} title={title}>
      <div style={{ position: 'absolute', left: x0, top: y - 3 * s, width: (x1 - x0) * lineK, height: 6 * s, background: C.ink }} />
      {spans.map((sp_, i) => {
        const k = sp(sp_.at, 'default'); const a = X(sp_.from), b = X(sp_.to);
        const n = interpolate(t, [sp_.at, sp_.at + 1.2], [0, sp_.count ?? 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (<React.Fragment key={'s' + i}>
          <div style={{ position: 'absolute', left: a, top: y - 18 * s, width: (b - a) * k, height: 36 * s, background: C.gold, border: `${4 * s}px solid ${C.ink}`, boxSizing: 'border-box' }} />
          <div style={{ position: 'absolute', left: a, width: b - a, top: y - 92 * s, textAlign: 'center', overflow: 'hidden' }}>
            <div style={{ fontFamily: 'Playfair', fontSize: 50 * s, color: C.ink, transform: `translateY(${(1 - sp(sp_.at + 0.15, 'heavy')) * 110}%)` }}>{sp_.count != null ? `${fmt(n)} ${sp_.label}` : sp_.label}</div>
          </div>
        </React.Fragment>);
      })}
      {items.map((it, i) => {
        const k = sp(it.at, 'playful'), kl = sp(it.at + 0.1, 'snappy'), x = X(it.x); const up = it.up ?? i % 2 === 0;
        const col = it.red ? C.red : C.ink;
        return (<React.Fragment key={i}>
          <div style={{ position: 'absolute', left: x - 22 * s, top: y - 22 * s, width: 44 * s, height: 44 * s, borderRadius: '50%', background: it.red ? C.red : C.card, border: `${7 * s}px solid ${C.ink}`, boxSizing: 'border-box', transform: `scale(${k})` }} />
          <div style={{ position: 'absolute', left: x - 6 * s, top: up ? y - 122 * s : y + 22 * s, width: 4 * s, height: 100 * s, background: col, transformOrigin: up ? '50% 100%' : '50% 0', transform: `scaleY(${kl})` }} />
          <div style={{ position: 'absolute', left: Math.min(Math.max(x - 170 * s, 20 * s), 1260 * s - 340 * s), width: 340 * s, top: up ? y - 252 * s : y + 126 * s, textAlign: 'center', overflow: 'hidden', padding: `0 0 ${6 * s}px` }}>
            <div style={{ transform: `translateY(${(1 - kl) * 120}%)` }}>
              <div style={{ fontFamily: 'Elite', fontSize: 30 * s, color: col, letterSpacing: '.04em' }}>{it.date}</div>
              <div style={{ fontFamily: 'Playfair', fontSize: 34 * s, lineHeight: 1.05, color: C.ink, marginTop: 4 * s }}>{it.label}</div>
              {it.note && <div style={{ fontFamily: 'Plex', fontSize: 18 * s, letterSpacing: '.12em', color: C.muted, marginTop: 6 * s }}>{it.note}</div>}
            </div>
          </div>
        </React.Fragment>);
      })}
    </Card>
  );
};

// ---------------------------------------------------------------------------
/** Bars: vertical (inflation) or horizontal (vote share); values roll up as each bar grows. */
export const GcpBars = ({ kicker = '', title = '', bars = [], max = 100, unit = '%', horizontal = false, notes = [] }) => {
  const { t, sp, s } = useT();
  const N = bars.length;
  return (
    <Card kicker={kicker} title={title}>
      {!horizontal && <div style={{ position: 'absolute', left: 90 * s, right: 90 * s, top: 640 * s, height: 5 * s, background: C.ink }} />}
      {bars.map((b, i) => {
        const k = sp(b.at, 'default'); const v = interpolate(t, [b.at, b.at + 1.0], [0, b.value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const col = b.color === 'gold' ? C.gold : b.color === 'ink' ? C.ink : b.color === 'muted' ? '#B9AD97' : C.red;
        if (horizontal) {
          const top = 210 * s + i * (440 * s / N), H = Math.min(78 * s, 440 * s / N - 40 * s), W = 760 * s * b.value / max;
          return (<React.Fragment key={i}>
            <div style={{ position: 'absolute', left: 90 * s, top: top, width: 1100 * s, overflow: 'hidden' }}><div style={{ fontFamily: 'Plex', fontSize: 22 * s, letterSpacing: '.14em', color: C.ink, transform: `translateY(${(1 - sp(b.at - 0.05, 'snappy')) * 120}%)` }}>{b.label}</div></div>
            <div style={{ position: 'absolute', left: 90 * s, top: top + 34 * s, width: W * k, height: H, background: col, border: `${4 * s}px solid ${C.ink}`, boxSizing: 'border-box' }} />
            <div style={{ position: 'absolute', left: 90 * s + W * k + 18 * s, top: top + 34 * s + H / 2 - 34 * s, fontFamily: 'Playfair', fontSize: 58 * s, color: C.ink, transform: `scale(${sp(b.at + 0.1, 'snappy')})`, transformOrigin: '0 50%' }}>{b.prefix ?? ''}{fmt(v)}{unit}</div>
          </React.Fragment>);
        }
        const slot = 1100 * s / N, w = Math.min(190 * s, slot * 0.55), cx = 90 * s + slot * (i + 0.5), Hh = 400 * s * b.value / max;
        return (<React.Fragment key={i}>
          <div style={{ position: 'absolute', left: cx - w / 2, top: 640 * s - Hh * k, width: w, height: Hh * k, background: col, border: `${4 * s}px solid ${C.ink}`, borderBottom: 'none', boxSizing: 'border-box' }} />
          <div style={{ position: 'absolute', left: cx - 150 * s, width: 300 * s, top: 640 * s - Hh * k - 84 * s, textAlign: 'center', fontFamily: 'Playfair', fontSize: 66 * s, color: C.ink, transform: `scale(${sp(b.at + 0.1, 'snappy')})` }}>{fmt(v)}{unit}</div>
          <div style={{ position: 'absolute', left: cx - 150 * s, width: 300 * s, top: 656 * s, textAlign: 'center', overflow: 'hidden' }}><div style={{ fontFamily: 'Elite', fontSize: 34 * s, color: C.ink, transform: `translateY(${(1 - sp(b.at - 0.05, 'snappy')) * 120}%)` }}>{b.label}</div></div>
        </React.Fragment>);
      })}
      {notes.map((n, i) => {
        const k = sp(n.at, 'playful');
        return <div key={'n' + i} style={{ position: 'absolute', left: (n.x ?? 760) * s, top: (n.y ?? 200) * s, background: n.red ? C.red : C.gold, color: n.red ? C.card : C.ink, border: `${4 * s}px solid ${C.ink}`, padding: `${10 * s}px ${22 * s}px`, fontFamily: 'Plex', fontSize: 24 * s, letterSpacing: '.1em', transform: `scale(${k}) rotate(${n.rot ?? -3}deg)`, boxShadow: `${6 * s}px ${7 * s}px 0 ${C.ink}`, whiteSpace: 'nowrap' }}>{n.text}</div>;
      })}
    </Card>
  );
};

// ---------------------------------------------------------------------------
/** Grid of small tiles (seats, assemblies): tiles cascade in, then a share of them changes colour. */
export const GcpGrid = ({ kicker = '', title = '', total = 110, cols = 22, at = 0.4, cascade = 1.4, fill = { at: 2, count: 73, label: '', color: 'red' }, rest = { label: '' }, counter }) => {
  const { t, sp, s } = useT();
  const rows = Math.ceil(total / cols), gap = 8 * s, size = Math.min((1100 * s - gap * (cols - 1)) / cols, (360 * s - gap * (rows - 1)) / rows);
  const W = cols * size + (cols - 1) * gap, left = (1280 * s - W) / 2;
  const fc = fill.color === 'gold' ? C.gold : C.red;
  const nFill = Math.floor(interpolate(t, [fill.at, fill.at + 1.0], [0, fill.count], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const cnt = counter ? interpolate(t, [counter.at, counter.at + 1.2], [0, counter.value], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
  return (
    <Card kicker={kicker} title={title}>
      {Array.from({ length: total }, (_, i) => {
        const r = Math.floor(i / cols), c = i % cols; const k = sp(at + (i / total) * cascade, 'snappy');
        const on = i < nFill;
        return <div key={i} style={{ position: 'absolute', left: left + c * (size + gap), top: 210 * s + r * (size + gap), width: size, height: size, background: on ? fc : C.card, border: `${3 * s}px solid ${C.ink}`, boxSizing: 'border-box', borderRadius: 4 * s, transform: `scale(${k})` }} />;
      })}
      {counter && <div style={{ position: 'absolute', left: 90 * s, top: 600 * s, fontFamily: 'Playfair', fontSize: 70 * s, color: C.ink, transform: `scale(${sp(counter.at, 'snappy')})`, transformOrigin: '0 50%' }}>{fmt(cnt)}<span style={{ fontFamily: 'Plex', fontSize: 24 * s, letterSpacing: '.16em', marginLeft: 16 * s }}>{counter.label}</span></div>}
      <div style={{ position: 'absolute', right: 90 * s, top: 610 * s, display: 'flex', gap: 30 * s, fontFamily: 'Plex', fontSize: 22 * s, letterSpacing: '.12em', color: C.ink, transform: `translateY(${(1 - sp(fill.at, 'snappy')) * 60 * s}px)`, opacity: t > fill.at ? 1 : 0 }}>
        <span><i style={{ display: 'inline-block', width: 22 * s, height: 22 * s, background: fc, border: `${3 * s}px solid ${C.ink}`, marginRight: 10 * s, verticalAlign: '-3px' }} />{fill.label}</span>
        {rest.label && <span><i style={{ display: 'inline-block', width: 22 * s, height: 22 * s, background: C.card, border: `${3 * s}px solid ${C.ink}`, marginRight: 10 * s, verticalAlign: '-3px' }} />{rest.label}</span>}
      </div>
    </Card>
  );
};

// ---------------------------------------------------------------------------
/** The ledger: two columns typed in on cue, a balance beam above that tips with every entry (one spring per entry). */
export const GcpLedger = ({ kicker = 'THE LEDGER', title = 'Weighing nineteen years', left = 'THE CURSE', right = 'THE PRECIOUS THING', rows = [], level = null }) => {
  const { t, sp, s } = useT();
  // beam angle = sum of springs: each entry nudges it toward its side; `level` (time) brings it back to even
  let ang = 0;
  for (const r of rows) ang += (r.side === 'L' ? -1 : 1) * 2.6 * sp(r.at, 'playful');
  if (level != null) ang -= ang * sp(level, 'heavy');
  const L = rows.filter((r) => r.side === 'L'), R = rows.filter((r) => r.side === 'R');
  const col = (list, x, color) => list.map((r, i) => {
    const k = sp(r.at, 'snappy');
    return (<div key={x + i} style={{ position: 'absolute', left: x, width: 540 * s, top: 400 * s + i * 52 * s, display: 'flex', gap: 12 * s, alignItems: 'baseline', transform: `translateX(${(1 - k) * -40 * s}px)`, opacity: t >= r.at ? 1 : 0 }}>
      <span style={{ fontFamily: 'Plex', fontSize: 20 * s, color: color, width: 70 * s, flex: 'none' }}>{r.year ?? ''}</span>
      <span style={{ fontFamily: 'Elite', fontSize: 27 * s, color: C.ink, whiteSpace: 'nowrap' }}>{typed(r.text, r.at, t, 34)}</span>
    </div>);
  });
  const pivot = { x: 640 * s, y: 250 * s };
  return (
    <Card kicker={kicker} title={title}>
      {/* balance */}
      <div style={{ position: 'absolute', left: pivot.x - 6 * s, top: pivot.y, width: 12 * s, height: 70 * s, background: C.ink }} />
      <div style={{ position: 'absolute', left: pivot.x - 50 * s, top: pivot.y + 66 * s, width: 100 * s, height: 12 * s, background: C.ink, borderRadius: 6 * s }} />
      <div style={{ position: 'absolute', left: pivot.x - 300 * s, top: pivot.y - 6 * s, width: 600 * s, height: 12 * s, background: C.ink, borderRadius: 6 * s, transform: `rotate(${ang}deg)`, transformOrigin: '50% 50%' }}>
        {[0, 1].map((j) => <div key={j} style={{ position: 'absolute', left: j ? 540 * s : 0, top: 6 * s, width: 60 * s, height: 50 * s, transform: `rotate(${-ang}deg)`, transformOrigin: '50% 0' }}>
          <div style={{ position: 'absolute', left: 28 * s, top: 0, width: 4 * s, height: 30 * s, background: C.ink }} />
          <div style={{ position: 'absolute', left: -10 * s, top: 28 * s, width: 80 * s, height: 18 * s, background: j ? C.gold : C.red, border: `${3 * s}px solid ${C.ink}`, borderRadius: `0 0 ${40 * s}px ${40 * s}px` }} />
        </div>)}
      </div>
      <div style={{ position: 'absolute', left: pivot.x - 9 * s, top: pivot.y - 9 * s, width: 18 * s, height: 18 * s, borderRadius: '50%', background: C.gold, border: `${3 * s}px solid ${C.ink}` }} />
      {/* column heads + rule */}
      {[[90 * s, left, C.red, 0.3], [680 * s, right, C.gold, 0.45]].map(([x, h, c, a], i) => (
        <div key={'h' + i} style={{ position: 'absolute', left: x, top: 330 * s, overflow: 'hidden' }}><div style={{ fontFamily: 'Plex', fontSize: 26 * s, letterSpacing: '.22em', color: c === C.gold ? '#8E6A1E' : c, transform: `translateY(${(1 - sp(a, 'snappy')) * 120}%)` }}>{h}</div></div>))}
      <div style={{ position: 'absolute', left: 640 * s - 2 * s, top: 330 * s, width: 4 * s, height: 340 * s, background: C.ink, transformOrigin: '50% 0', transform: `scaleY(${sp(0.4)})` }} />
      <div style={{ position: 'absolute', left: 90 * s, right: 90 * s, top: 378 * s, height: 3 * s, background: C.ink, transformOrigin: '0 50%', transform: `scaleX(${sp(0.5)})` }} />
      {col(L, 90 * s, C.red)}{col(R, 680 * s, '#8E6A1E')}
    </Card>
  );
};
