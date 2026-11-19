#!/usr/bin/env node
// video-studio CLI
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const HELP = `video-studio — Remotion + HyperFrames + FFmpeg + design-to-motion

Usage: studio <command> [options]

  build <project.json>         Render a project (timeline, overlays, audio, captions, outputs)
      --draft                  fast low-quality encode for checking edits
      --no-cache               re-render everything
      --only <name,...>        only these outputs (by "name" or preset)
  plan <project.json>          Validate and print where every item lands (no rendering)
  design <design.json>         Render one design with design-to-motion
      --engine hyperframes|remotion   (default hyperframes)
      --style minimal|energetic|elegant|cinematic
      --duration <s>  --transparent  -o <file>
  compile <design.json> -o <dir>      Compile a design to an editable HyperFrames project
  figma <figma.json|fileKey> -o <design.json> [--frame <name>] [--style s] [--duration s]
                               Import a Figma frame (saved REST JSON, or a file key + FIGMA_TOKEN)
  probe <media>                Show duration, size, fps, audio of a media file
  sheet <video> [-o out.png] [--count 6]   Contact sheet of frames for review
  new <dir>                    Scaffold a new project from the starter template
  list                         Transitions, motion presets, styles, Remotion compositions
`;

const [cmd, ...rest] = process.argv.slice(2);
const { values: o, positionals: pos } = parseArgs({
  args: rest,
  allowPositionals: true,
  options: {
    draft: { type: 'boolean' }, 'no-cache': { type: 'boolean' }, only: { type: 'string' },
    engine: { type: 'string' }, style: { type: 'string' }, duration: { type: 'string' },
    transparent: { type: 'boolean' }, output: { type: 'string', short: 'o' }, frame: { type: 'string' },
    count: { type: 'string' }, help: { type: 'boolean', short: 'h' },
  },
});

const need = (v, what) => { if (!v) { console.error(`Missing ${what}\n\n${HELP}`); process.exit(1); } return v; };

try {
  switch (cmd) {
    case 'build': {
      const { build } = await import('../src/pipeline.js');
      const r = await build(need(pos[0], 'project.json'), { draft: o.draft, noCache: o['no-cache'], only: o.only?.split(',') });
      r.outputs.forEach((f) => console.log(`  → ${path.relative(process.cwd(), f)}`));
      break;
    }
    case 'plan': {
      const { plan } = await import('../src/plan.js');
      await plan(need(pos[0], 'project.json'));
      break;
    }
    case 'design': {
      const { renderDesign } = await import('../src/pipeline.js');
      const { outFile, scene } = await renderDesign(need(pos[0], 'design.json'), { engine: o.engine, out: o.output, transparent: o.transparent, duration: o.duration ? Number(o.duration) : undefined, style: o.style });
      console.log(`  choreography (${scene.style}):`);
      for (const l of scene.layers) console.log(`    ${l.id.padEnd(18)} ${l.role.padEnd(10)} ${l.motion.preset}${l.motion.split ? `/${l.motion.split}` : ''} @ ${l.motion.delay.toFixed(2)}s`);
      console.log(`  → ${path.relative(process.cwd(), outFile)}`);
      break;
    }
    case 'compile': {
      const { normalizeDesign } = await import('../src/design-to-motion/normalize.js');
      const { compileToHyperFrames } = await import('../src/design-to-motion/to-hyperframes.js');
      const file = path.resolve(need(pos[0], 'design.json'));
      const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (o.style) raw.style = o.style;
      const out = path.resolve(o.output ?? file.replace(/\.json$/, '-hyperframes'));
      compileToHyperFrames(normalizeDesign(raw, { durationOverride: o.duration ? Number(o.duration) : undefined }), out, { baseDir: path.dirname(file), transparent: o.transparent });
      console.log(`  → ${path.relative(process.cwd(), out)}  (preview: npx hyperframes preview ${path.relative(process.cwd(), out)})`);
      break;
    }
    case 'figma': {
      const { figmaToDesign, fetchFigma } = await import('../src/design-to-motion/import-figma.js');
      const src = need(pos[0], 'Figma JSON file or file key');
      const out = path.resolve(need(o.output, '-o <design.json>'));
      const imageDir = path.join(path.dirname(out), 'images');
      const json = fs.existsSync(src) ? JSON.parse(fs.readFileSync(src, 'utf8')) : await fetchFigma(src, { imageDir });
      const design = figmaToDesign(json, { frame: o.frame, imageDir: 'images', style: o.style, duration: o.duration ? Number(o.duration) : undefined });
      fs.writeFileSync(out, JSON.stringify(design, null, 2));
      console.log(`  → ${path.relative(process.cwd(), out)} (${design.layers.length} top-level layers, ${design.width}x${design.height})`);
      break;
    }
    case 'probe': {
      const { probe } = await import('../src/ffmpeg/index.js');
      console.log(JSON.stringify(await probe(need(pos[0], 'media file')), null, 2));
      break;
    }
    case 'sheet': {
      const { probe, contactSheet } = await import('../src/ffmpeg/index.js');
      const file = need(pos[0], 'video');
      const { duration } = await probe(file);
      const count = Number(o.count ?? 6);
      const times = Array.from({ length: count }, (_, i) => (duration * (i + 0.5)) / count);
      const out = o.output ?? file.replace(/\.\w+$/, '-sheet.png');
      await contactSheet(file, out, { times });
      console.log(`  → ${out}`);
      break;
    }
    case 'new': {
      const dir = path.resolve(need(pos[0], 'directory'));
      if (fs.existsSync(dir) && fs.readdirSync(dir).length) throw new Error(`${dir} is not empty`);
      fs.cpSync(path.join(ROOT, 'templates', 'starter'), dir, { recursive: true });
      console.log(`  → ${path.relative(process.cwd(), dir)}\n  Next: add media to ${path.relative(process.cwd(), dir)}/media, edit project.json, then: studio build ${path.relative(process.cwd(), dir)}/project.json`);
      break;
    }
    case 'list': {
      const { ENTRANCES, EXITS, IDLES, EASES } = await import('../src/shared/motion.js');
      const { STYLES } = await import('../src/design-to-motion/normalize.js');
      const { XFADE, TRANSITION_ALIASES, PRESETS } = await import('../src/ffmpeg/index.js');
      console.log(`Transitions (aliases): cut, ${Object.keys(TRANSITION_ALIASES).join(', ')}`);
      console.log(`Transitions (ffmpeg xfade): ${XFADE.join(', ')}`);
      console.log(`Entrances: ${Object.keys(ENTRANCES).join(', ')}`);
      console.log(`Exits: ${Object.keys(EXITS).join(', ')}`);
      console.log(`Idle loops: ${Object.keys(IDLES).join(', ')}`);
      console.log(`Eases: ${Object.keys(EASES).join(', ')}`);
      console.log(`Design styles: ${Object.keys(STYLES).join(', ')}`);
      console.log(`Output presets: ${Object.keys(PRESETS).join(', ')}`);
      console.log('Remotion compositions: DesignScene, TitleCard, LowerThird, StatCounter (add yours in src/remotion/Root.jsx)');
      break;
    }
    default:
      console.log(HELP);
      if (cmd && cmd !== 'help' && !o.help) process.exit(1);
  }
} catch (e) {
  console.error(`\n✖ ${e.message}`);
  if (process.env.DEBUG) console.error(e.stack);
  process.exit(1);
}
