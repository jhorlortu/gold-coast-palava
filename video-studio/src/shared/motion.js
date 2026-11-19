// Shared motion vocabulary used by BOTH render engines.
// Design-to-motion compiles layers into these presets; the HyperFrames compiler
// turns them into GSAP tweens and the Remotion DesignScene interpolates them, so a
// design animates identically whichever engine renders it.

/** Named eases, each with its GSAP name and a cubic-bezier for Remotion. */
export const EASES = {
  linear: { gsap: 'none', bezier: [0, 0, 1, 1] },
  'out-quad': { gsap: 'power1.out', bezier: [0.5, 1, 0.89, 1] },
  'out-cubic': { gsap: 'power2.out', bezier: [0.33, 1, 0.68, 1] },
  'out-quart': { gsap: 'power3.out', bezier: [0.25, 1, 0.5, 1] },
  'out-expo': { gsap: 'expo.out', bezier: [0.16, 1, 0.3, 1] },
  'out-back': { gsap: 'back.out(1.6)', bezier: [0.34, 1.56, 0.64, 1] },
  'in-cubic': { gsap: 'power2.in', bezier: [0.32, 0, 0.67, 0] },
  'in-out-cubic': { gsap: 'power2.inOut', bezier: [0.65, 0, 0.35, 1] },
  'in-out-expo': { gsap: 'expo.inOut', bezier: [0.87, 0, 0.13, 1] },
};

// Animatable properties: opacity, x, y (px offsets), scale, rotation (deg), blur (px),
// clip (0..1 reveal from left, via clip-path inset).
export const IDENTITY = { opacity: 1, x: 0, y: 0, scale: 1, rotation: 0, blur: 0, clip: 1 };

/** Entrance presets: `from` state animates to IDENTITY. */
export const ENTRANCES = {
  fade: { from: { opacity: 0 }, duration: 0.6, ease: 'out-cubic' },
  rise: { from: { opacity: 0, y: 60 }, duration: 0.8, ease: 'out-expo' },
  drop: { from: { opacity: 0, y: -60 }, duration: 0.8, ease: 'out-expo' },
  'slide-left': { from: { opacity: 0, x: 120 }, duration: 0.8, ease: 'out-expo' },
  'slide-right': { from: { opacity: 0, x: -120 }, duration: 0.8, ease: 'out-expo' },
  'scale-in': { from: { opacity: 0, scale: 0.6 }, duration: 0.7, ease: 'out-back' },
  pop: { from: { opacity: 0, scale: 0.2 }, duration: 0.55, ease: 'out-back' },
  'blur-in': { from: { opacity: 0, blur: 24, scale: 1.08 }, duration: 0.9, ease: 'out-cubic' },
  'fade-zoom': { from: { opacity: 0, scale: 1.15 }, duration: 1.0, ease: 'out-cubic' },
  wipe: { from: { clip: 0 }, duration: 0.8, ease: 'in-out-expo' },
  spin: { from: { opacity: 0, rotation: -90, scale: 0.5 }, duration: 0.8, ease: 'out-back' },
  none: { from: {}, duration: 0, ease: 'linear' },
};

/** Exit presets: IDENTITY animates to `to`. */
export const EXITS = {
  fade: { to: { opacity: 0 }, duration: 0.4, ease: 'in-cubic' },
  sink: { to: { opacity: 0, y: 40 }, duration: 0.45, ease: 'in-cubic' },
  'scale-out': { to: { opacity: 0, scale: 0.85 }, duration: 0.45, ease: 'in-cubic' },
  'blur-out': { to: { opacity: 0, blur: 16 }, duration: 0.5, ease: 'in-cubic' },
  none: { to: {}, duration: 0, ease: 'linear' },
};

/** Looping "while visible" behaviours, all pure functions of time (seek-safe). */
export const IDLES = {
  float: { prop: 'y', amplitude: 10, period: 3 },
  pulse: { prop: 'scale', amplitude: 0.03, period: 2 },
  sway: { prop: 'rotation', amplitude: 2, period: 4 },
};

/** Normalise a layer's motion field ("rise" | {preset, delay, ...}) into a full spec. */
export function resolveMotion(motion, defaults = {}) {
  const m = typeof motion === 'string' ? { preset: motion } : { ...(motion || {}) };
  const preset = ENTRANCES[m.preset || defaults.preset || 'fade'];
  if (!preset) throw new Error(`Unknown entrance preset "${m.preset}". Known: ${Object.keys(ENTRANCES).join(', ')}`);
  const exitName = m.exit ?? defaults.exit ?? 'none';
  const exit = EXITS[exitName];
  if (!exit) throw new Error(`Unknown exit preset "${exitName}". Known: ${Object.keys(EXITS).join(', ')}`);
  if (m.idle && !IDLES[m.idle]) throw new Error(`Unknown idle "${m.idle}". Known: ${Object.keys(IDLES).join(', ')}`);
  const ease = m.ease || preset.ease;
  if (!EASES[ease]) throw new Error(`Unknown ease "${ease}". Known: ${Object.keys(EASES).join(', ')}`);
  return {
    preset: m.preset || defaults.preset || 'fade',
    from: { ...IDENTITY, ...preset.from },
    delay: m.delay ?? defaults.delay ?? 0,
    duration: m.duration ?? preset.duration,
    ease,
    exit: { name: exitName, to: { ...IDENTITY, ...exit.to }, duration: m.exitDuration ?? exit.duration, ease: exit.ease },
    idle: m.idle ? IDLES[m.idle] : null,
    // Text-only: split into words/chars and stagger each piece.
    split: m.split || null,
    stagger: m.stagger ?? 0.06,
  };
}

/** Evaluate cubic-bezier easing at t (0..1) — used by the Remotion engine and tests. */
export function bezierEase([x1, y1, x2, y2], t) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (u) => ((ax * u + bx) * u + cx) * u;
  const sy = (u) => ((ay * u + by) * u + cy) * u;
  const dx = (u) => (3 * ax * u + 2 * bx) * u + cx;
  let u = t;
  for (let i = 0; i < 8; i++) {
    const err = sx(u) - t;
    const d = dx(u);
    if (Math.abs(err) < 1e-6 || Math.abs(d) < 1e-6) break;
    u -= err / d;
  }
  let lo = 0, hi = 1;
  for (let i = 0; i < 20 && Math.abs(sx(u) - t) > 1e-6; i++) {
    if (sx(u) < t) lo = u; else hi = u;
    u = (lo + hi) / 2;
  }
  return sy(u);
}

/**
 * The exact animated state of a layer at time t (seconds, relative to scene start).
 * Remotion calls this every frame; HyperFrames gets the same curve through GSAP.
 */
export function stateAt(spec, t, sceneDuration, offset = 0) {
  const mix = (a, b, k) => {
    const o = {};
    for (const key of Object.keys(IDENTITY)) o[key] = a[key] + (b[key] - a[key]) * k;
    return o;
  };
  const start = spec.delay + offset;
  let s;
  if (t <= start) s = { ...spec.from };
  else if (spec.duration <= 0 || t >= start + spec.duration) s = { ...IDENTITY };
  else s = mix(spec.from, IDENTITY, bezierEase(EASES[spec.ease].bezier, (t - start) / spec.duration));

  if (spec.idle && t > start) {
    const { prop, amplitude, period } = spec.idle;
    s[prop] += amplitude * Math.sin(((t - start) / period) * Math.PI * 2);
  }

  if (spec.exit.duration > 0) {
    const exitStart = sceneDuration - spec.exit.duration;
    if (t >= exitStart) {
      const k = bezierEase(EASES[spec.exit.ease].bezier, Math.min(1, (t - exitStart) / spec.exit.duration));
      s = mix(s, { ...s, ...pickChanged(spec.exit.to) }, k);
    }
  }
  return s;
}

function pickChanged(to) {
  const o = {};
  for (const [k, v] of Object.entries(to)) if (v !== IDENTITY[k]) o[k] = v;
  return o;
}

/** CSS for a state — shared by Remotion (inline style) and HyperFrames (initial state). */
export function stateToCss(s) {
  const css = {
    opacity: s.opacity,
    transform: `translate(${s.x}px, ${s.y}px) scale(${s.scale}) rotate(${s.rotation}deg)`,
  };
  if (s.blur > 0.01) css.filter = `blur(${s.blur}px)`;
  if (s.clip < 0.999) css.clipPath = `inset(0 ${(1 - s.clip) * 100}% 0 0)`;
  return css;
}
