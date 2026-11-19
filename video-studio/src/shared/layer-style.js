// Static (non-animated) look of a design layer as a camelCase style object.
// Remotion uses it directly as React `style`; HyperFrames serialises it to CSS.

export function boxStyle(l) {
  return {
    position: 'absolute',
    left: `${l.x}px`,
    top: `${l.y}px`,
    width: `${l.width}px`,
    height: `${l.height}px`,
    transformOrigin: l.origin ?? '50% 50%',
  };
}

export function contentStyle(l) {
  const s = { position: 'absolute', inset: '0px', opacity: l.opacity };
  if (l.rotation) s.transform = `rotate(${l.rotation}deg)`;
  if (l.shadow) s.boxShadow = typeof l.shadow === 'string' ? l.shadow : `${l.shadow.x ?? 0}px ${l.shadow.y ?? 8}px ${l.shadow.blur ?? 24}px ${l.shadow.color ?? 'rgba(0,0,0,0.35)'}`;
  if (l.stroke && l.type !== 'line') s.border = `${l.strokeWidth ?? 2}px solid ${l.stroke}`;
  switch (l.type) {
    case 'rect':
      s.background = l.fill ?? '#ffffff';
      if (l.radius) s.borderRadius = `${l.radius}px`;
      break;
    case 'ellipse':
      s.background = l.fill ?? '#ffffff';
      s.borderRadius = '50%';
      break;
    case 'line':
      s.background = l.color;
      s.borderRadius = `${l.height / 2}px`;
      break;
    case 'image':
      if (l.radius) s.borderRadius = `${l.radius}px`;
      s.overflow = 'hidden';
      break;
    case 'text':
      Object.assign(s, {
        color: l.color,
        fontFamily: `'${l.fontFamily}', Inter, sans-serif`,
        fontSize: `${l.fontSize}px`,
        fontWeight: l.fontWeight,
        lineHeight: l.lineHeight,
        letterSpacing: typeof l.letterSpacing === 'number' ? `${l.letterSpacing}em` : l.letterSpacing,
        textAlign: l.align,
        whiteSpace: 'pre-wrap',
        textTransform: l.textTransform,
        fontStyle: l.italic ? 'italic' : undefined,
        background: l.fill,
      });
      break;
    default:
      break;
  }
  return s;
}

export function imageStyle(l) {
  return { width: '100%', height: '100%', objectFit: l.fit ?? 'cover', display: 'block' };
}

export function toCss(style) {
  return Object.entries(style)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`)
    .join(';');
}
