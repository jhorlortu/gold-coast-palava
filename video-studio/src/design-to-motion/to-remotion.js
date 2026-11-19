// Design-to-motion, target B: prepare a normalized scene as input props for the
// Remotion "DesignScene" composition. Images are copied into the Remotion public dir
// and referenced through staticFile().
import fs from 'node:fs';
import path from 'node:path';

export function compileToRemotion(scene, publicDir, { baseDir = process.cwd(), transparent = false, prefix = scene.name } = {}) {
  fs.mkdirSync(publicDir, { recursive: true });
  let i = 0;
  const fix = (l) => {
    const out = { ...l };
    if (l.type === 'image') {
      const abs = path.resolve(baseDir, l.src);
      if (!fs.existsSync(abs)) throw new Error(`Image not found: ${abs}`);
      const name = `${prefix}-${i++}-${path.basename(abs)}`.replace(/[^a-zA-Z0-9._-]/g, '_');
      fs.copyFileSync(abs, path.join(publicDir, name));
      out.src = name;
    }
    if (l.children) out.children = l.children.map(fix);
    return out;
  };
  return { ...scene, background: transparent ? 'transparent' : scene.background, layers: scene.layers.map(fix) };
}
