// The build pipeline: project.json -> rendered video(s).
//
//   1. load + validate the spec, resolve paths relative to the spec file
//   2. prepare: compile design-to-motion scenes for their target engine
//   3. render motion scenes (Remotion / HyperFrames), cached by content hash
//   4. conform every timeline item to one format with FFmpeg (cached)
//   5. join with transitions -> program
//   6. finish each output: overlays, captions, audio mix + ducking + loudness, encode
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { normalizeDesign } from './design-to-motion/normalize.js';
import { compileToHyperFrames } from './design-to-motion/to-hyperframes.js';
import { compileToRemotion } from './design-to-motion/to-remotion.js';
import { RemotionEngine } from './engines/remotion.js';
import { renderHyperFrames } from './engines/hyperframes.js';
import * as ff from './ffmpeg/index.js';
import { validateProject } from './schema.js';

export async function build(specPath, opts = {}) {
  const t0 = Date.now();
  const log = opts.log ?? console.log;
  const specFile = path.resolve(specPath);
  const baseDir = path.dirname(specFile);
  const spec = JSON.parse(fs.readFileSync(specFile, 'utf8'));
  validateProject(spec);

  const fmt = { width: spec.format?.width ?? 1920, height: spec.format?.height ?? 1080, fps: spec.format?.fps ?? 30 };
  const W = fmt.width, H = fmt.height, fps = fmt.fps;
  const buildDir = path.resolve(baseDir, spec.buildDir ?? 'build');
  const dirs = { cache: path.join(buildDir, 'cache'), hf: path.join(buildDir, 'hyperframes'), pub: path.join(buildDir, 'remotion-public'), seg: path.join(buildDir, 'segments') };
  Object.values(dirs).forEach((d) => fs.mkdirSync(d, { recursive: true }));
  const abs = (p) => path.resolve(baseDir, p);
  const remotion = new RemotionEngine({ publicDir: dirs.pub, log });

  log(`▶ ${spec.name ?? path.basename(specFile)} — ${W}x${H} @ ${fps}fps, ${spec.timeline.length} timeline items, ${(spec.overlays || []).length} overlays`);

  // ---- 2. prepare motion jobs -------------------------------------------------
  const prepareMotion = (item, { alpha }) => {
    const engine = item.engine ?? 'remotion';
    if (item.type === 'design') {
      const designPath = typeof item.design === 'string' ? abs(item.design) : null;
      const raw = designPath ? JSON.parse(fs.readFileSync(designPath, 'utf8')) : item.design;
      const design = { width: W, height: H, fps, ...raw, ...(item.style ? { style: item.style } : {}) };
      const scene = normalizeDesign(design, { durationOverride: item.duration });
      const assetBase = designPath ? path.dirname(designPath) : baseDir;
      const imageFiles = collectImages(scene.layers).map((s) => path.resolve(assetBase, s));
      const key = hash({ engine, scene, alpha, W, H, fps }, [...imageFiles, ...engineSourceFiles()]);
      if (engine === 'hyperframes') {
        const projectDir = path.join(dirs.hf, item.id);
        return { key, engine, duration: scene.duration, prepare: () => compileToHyperFrames(scene, projectDir, { baseDir: assetBase, transparent: alpha }), projectDir };
      }
      return { key, engine, duration: scene.duration, compositionId: 'DesignScene', propsFn: () => compileToRemotion(scene, dirs.pub, { baseDir: assetBase, transparent: alpha, prefix: item.id }) };
    }
    // type: motion
    if (engine === 'hyperframes') {
      const projectDir = abs(item.project);
      const key = hash({ engine, variables: item.variables, alpha, fps }, listFiles(projectDir));
      return { key, engine, duration: item.duration, projectDir, variables: item.variables };
    }
    const props = { width: W, height: H, fps, duration: item.duration ?? 4, ...(item.props || {}), ...(alpha ? { transparent: true } : {}) };
    return { key: hash({ engine, c: item.composition, props, alpha }, engineSourceFiles()), engine, duration: props.duration, compositionId: item.composition, props };
  };

  const items = spec.timeline.map((it, i) => ({ ...it, id: safeId(it.id ?? `${it.type}-${i + 1}`) }));
  const overlays = (spec.overlays || []).map((o, i) => ({ ...o, id: safeId(o.id ?? `overlay-${i + 1}`) }));
  const jobs = new Map();
  for (const it of items) if (it.type === 'design' || it.type === 'motion') jobs.set(it.id, { ...prepareMotion(it, { alpha: false }), alpha: false });
  for (const o of overlays) if (o.type === 'design' || o.type === 'motion') jobs.set(o.id, { ...prepareMotion(o, { alpha: true }), alpha: true });

  // Compile everything first: Remotion bundles its public dir once, so all images
  // must be in place before the first Remotion render.
  for (const j of jobs.values()) {
    j.file = path.join(dirs.cache, `${j.key}.${j.alpha ? 'mov' : 'mp4'}`);
    if (j.propsFn) j.props = j.propsFn();
    if (j.prepare && (!fs.existsSync(j.file) || opts.noCache)) j.prepare();
  }

  // ---- 3. render motion ---------------------------------------------------------
  for (const [id, j] of jobs) {
    if (fs.existsSync(j.file) && !opts.noCache) { log(`  ✓ ${id} (${j.engine}, cached)`); continue; }
    log(`  ● ${id}: rendering with ${j.engine}${j.alpha ? ' (alpha)' : ''}`);
    const tmp = j.file.replace(/(\.\w+)$/, '.part$1');
    if (j.engine === 'hyperframes') await renderHyperFrames({ projectDir: j.projectDir, outFile: tmp, fps, quality: opts.draft ? 'draft' : 'looks', variables: j.variables, log });
    else await remotion.render({ compositionId: j.compositionId, props: j.props, outFile: tmp, alpha: j.alpha });
    fs.renameSync(tmp, j.file);
  }

  // ---- 4. conform ---------------------------------------------------------------
  const segments = [];
  for (const it of items) {
    const transition = ff.resolveTransition(it.transition);
    const common = { W, H, fps, background: spec.format?.background };
    let key, make;
    if (it.type === 'video') {
      const src = abs(it.src);
      const p = { inPoint: it.in ?? 0, outPoint: it.out, speed: it.speed ?? 1, fit: it.fit ?? 'contain', volume: it.volume ?? 1, mute: !!it.mute, grade: it.grade, fadeIn: it.fadeIn ?? 0, fadeOut: it.fadeOut ?? 0 };
      if (p.grade?.lut) p.grade = { ...p.grade, lut: abs(p.grade.lut) };
      key = hash({ t: 'video', p, common }, [src]);
      make = (out) => ff.conformVideo({ src, out, ...common, ...p });
    } else if (it.type === 'image') {
      const src = abs(it.src);
      const p = { duration: it.duration ?? 4, fit: it.fit ?? 'cover', kenburns: it.kenburns ?? 'in' };
      key = hash({ t: 'image', p, common }, [src]);
      make = (out) => ff.conformImage({ src, out, ...common, ...p });
    } else if (it.type === 'color') {
      const p = { color: it.color ?? 'black', duration: it.duration ?? 2 };
      key = hash({ t: 'color', p, common });
      make = (out) => ff.conformColor({ out, ...common, ...p });
    } else {
      const j = jobs.get(it.id);
      const p = { fadeIn: it.fadeIn ?? 0, fadeOut: it.fadeOut ?? 0, grade: it.grade };
      key = hash({ t: 'motion', k: j.key, p, common });
      make = (out) => ff.conformVideo({ src: j.file, out, ...common, ...p, fit: 'contain' });
    }
    const out = path.join(dirs.seg, `${it.id}-${key}.mp4`);
    if (!fs.existsSync(out) || opts.noCache) {
      log(`  ● ${it.id}: conforming (${it.type})`);
      await make(out + '.part.mp4');
      fs.renameSync(out + '.part.mp4', out);
    }
    const info = await ff.probe(out);
    segments.push({ id: it.id, file: out, duration: info.duration, transition });
  }

  // Timeline map (where each item lands in program time) — used for overlays/captions "at".
  const placed = [];
  let cursor = 0;
  segments.forEach((s, i) => {
    const d = i > 0 && s.transition ? Math.min(s.transition.duration, cursor - 0.05, s.duration - 0.05) : 0;
    const start = cursor - d;
    placed.push({ id: s.id, start, end: start + s.duration });
    cursor = start + s.duration;
  });

  // ---- 5. join --------------------------------------------------------------------
  const program = path.join(buildDir, 'program.mp4');
  log(`  ● joining ${segments.length} segments`);
  const duration = await ff.joinSegments(segments, program);
  log(`    program: ${duration.toFixed(2)}s`);

  // ---- 6. finish ----------------------------------------------------------------
  const resolveAt = (o) => {
    if (o.at == null) return o.start ?? 0;
    const target = placed.find((p) => p.id === safeId(String(o.at).split('+')[0]));
    if (!target) throw new Error(`Overlay "${o.id}": "at" references unknown timeline item "${o.at}"`);
    const extra = Number(String(o.at).split('+')[1] ?? 0);
    return target.start + extra;
  };
  const overlayInputs = [];
  for (const o of overlays) {
    const start = resolveAt(o);
    if (o.type === 'design' || o.type === 'motion') {
      const j = jobs.get(o.id);
      const dur = o.duration ?? j.duration ?? (await ff.probe(j.file)).duration;
      overlayInputs.push({ file: j.file, start, duration: dur, opacity: o.opacity });
    } else if (o.type === 'image' || o.type === 'video') {
      const file = abs(o.src);
      const dur = o.duration ?? (o.type === 'video' ? (await ff.probe(file)).duration : 3);
      overlayInputs.push({ file, start, duration: dur, x: o.x ?? 0, y: o.y ?? 0, width: o.width, opacity: o.opacity, still: o.type === 'image' });
    } else throw new Error(`Overlay "${o.id}" has unsupported type "${o.type}"`);
  }

  const audio = { programVolume: spec.audio?.programVolume ?? 1, tracks: [], music: null };
  for (const t of spec.audio?.tracks || []) audio.tracks.push({ ...t, file: abs(t.src), start: t.at != null ? resolveAt(t) : t.start ?? 0 });
  if (spec.audio?.music) audio.music = { ...spec.audio.music, file: abs(spec.audio.music.src) };

  let captions = null;
  if (spec.captions) {
    let file;
    if (spec.captions.src) file = abs(spec.captions.src);
    else if (spec.captions.cues) {
      const cues = spec.captions.cues.map((c) => {
        const s = c.at != null ? resolveAt(c) : c.start;
        return { start: s, end: c.end ?? s + (c.duration ?? 2.5), text: c.text };
      });
      file = ff.writeSrt(cues, path.join(buildDir, 'captions.srt'));
    }
    captions = { ...spec.captions, file };
  }

  log('  ● mixing audio');
  const mixed = await ff.mixAudio({ program, duration, audio, loudness: spec.audio?.loudness === undefined ? -14 : spec.audio.loudness, out: path.join(buildDir, 'mix.wav') });
  if (mixed.measured) log(`    loudness: ${Number(mixed.measured.input_i).toFixed(1)} → ${spec.audio?.loudness ?? -14} LUFS`);

  const outputs = (spec.outputs?.length ? spec.outputs : [{ file: `out/${safeId(spec.name ?? 'video')}.mp4`, preset: 'youtube' }])
    .filter((o) => !opts.only || opts.only.includes(o.name ?? o.preset));
  if (!outputs.length) throw new Error(`--only ${opts.only.join(',')} matches no output. Outputs: ${(spec.outputs || []).map((o) => o.name ?? o.preset).join(', ')}`);
  const results = [];
  for (const o of outputs) {
    const preset = opts.draft ? 'draft' : o.preset ?? 'youtube';
    const file = abs(o.file);
    log(`  ● exporting ${path.relative(baseDir, file)} (${preset}${o.reframe ? `, reframe ${o.reframe}` : ''})`);
    await ff.finish({ program, duration, overlays: overlayInputs, audioFile: mixed.file, captions: o.captions === false ? null : captions, output: { ...o, file, preset }, W, H, workDir: buildDir });
    results.push(file);
  }
  log(`✔ done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  return { outputs: results, duration, timeline: placed, program };
}

/** Render a single design file straight to video (no project needed). */
export async function renderDesign(designPath, { engine = 'hyperframes', out, transparent = false, duration, style, log = console.log } = {}) {
  const file = path.resolve(designPath);
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (style) raw.style = style;
  const scene = normalizeDesign(raw, { durationOverride: duration });
  const outFile = path.resolve(out ?? file.replace(/\.json$/, transparent ? '.mov' : '.mp4'));
  const work = path.join(path.dirname(outFile), `.${path.basename(outFile)}.work`);
  if (engine === 'hyperframes') {
    compileToHyperFrames(scene, work, { baseDir: path.dirname(file), transparent });
    await renderHyperFrames({ projectDir: work, outFile, fps: scene.fps, log });
  } else {
    const pub = path.join(work, 'public');
    const props = compileToRemotion(scene, pub, { baseDir: path.dirname(file), transparent });
    await new RemotionEngine({ publicDir: pub, log }).render({ compositionId: 'DesignScene', props, outFile, alpha: transparent });
  }
  fs.rmSync(work, { recursive: true, force: true });
  return { outFile, scene };
}

// ---- helpers -------------------------------------------------------------------
function hash(obj, files = []) {
  const h = crypto.createHash('sha1').update(JSON.stringify(obj));
  for (const f of files) {
    const st = fs.statSync(f);
    h.update(`${f}:${st.size}:${st.mtimeMs}`);
  }
  return h.digest('hex').slice(0, 12);
}
const safeId = (s) => String(s).replace(/[^a-zA-Z0-9_-]/g, '-');
function collectImages(layers, out = []) {
  for (const l of layers) { if (l.type === 'image') out.push(l.src); if (l.children) collectImages(l.children, out); }
  return out;
}
function listFiles(dir, out = []) {
  if (!fs.existsSync(dir)) throw new Error(`Directory not found: ${dir}`);
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'renders' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listFiles(p, out); else out.push(p);
  }
  return out.sort();
}
// Source of the engines/compilers: editing a composition or preset invalidates the cache.
let _engineFiles;
function engineSourceFiles() {
  _engineFiles ??= ['./remotion', './shared', './design-to-motion'].flatMap((d) => listFiles(new URL(d, import.meta.url).pathname));
  return _engineFiles;
}
