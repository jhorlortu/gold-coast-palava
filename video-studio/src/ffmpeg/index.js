// FFmpeg layer: probe, conform every source to one format, join with transitions,
// composite overlays, mix audio (music ducking + loudness), captions and export.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';
const FFPROBE = process.env.FFPROBE_PATH || 'ffprobe';

export function run(bin, args, { cwd, label } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { cwd });
    let err = '';
    child.stderr.on('data', (d) => { err += d; if (err.length > 200000) err = err.slice(-100000); });
    let out = '';
    child.stdout.on('data', (d) => { out += d; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve(out);
      else reject(new Error(`${label || path.basename(bin)} failed (exit ${code})\n  cmd: ${bin} ${args.map(q).join(' ')}\n${err.split('\n').slice(-25).join('\n')}`));
    });
  });
}
const q = (a) => (/[\s;'"[\]()]/.test(a) ? `'${a.replace(/'/g, `'\\''`)}'` : a);
export const ffmpeg = (args, opts) => run(FFMPEG, ['-hide_banner', '-y', '-loglevel', 'error', ...args], { label: 'ffmpeg', ...opts });

export async function probe(file) {
  if (!fs.existsSync(file)) throw new Error(`File not found: ${file}`);
  const json = JSON.parse(await run(FFPROBE, ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', file], { label: 'ffprobe' }));
  const v = json.streams.find((s) => s.codec_type === 'video' && !s.disposition?.attached_pic);
  const a = json.streams.find((s) => s.codec_type === 'audio');
  const [num, den] = (v?.avg_frame_rate || v?.r_frame_rate || '0/1').split('/').map(Number);
  return {
    file,
    duration: Number(json.format.duration ?? v?.duration ?? a?.duration ?? 0),
    width: v?.width ?? 0,
    height: v?.height ?? 0,
    fps: den ? num / den : 0,
    hasVideo: !!v,
    hasAudio: !!a,
    videoCodec: v?.codec_name,
    audioCodec: a?.codec_name,
    pixFmt: v?.pix_fmt,
    sampleRate: a ? Number(a.sample_rate) : 0,
  };
}

// ---------------------------------------------------------------------------
// Conform: every timeline segment becomes the same format (size, fps, pix_fmt,
// 48k stereo AAC, exact duration) so transitions and concat are frame-accurate.
// ---------------------------------------------------------------------------
const SEG_VIDEO = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '14', '-pix_fmt', 'yuv420p', '-g', '30'];
const SEG_AUDIO = ['-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-ac', '2'];

function fitFilter(fit, W, H, bg = 'black') {
  if (fit === 'cover') return `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}`;
  if (fit === 'stretch') return `scale=${W}:${H}`;
  return `scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=${bg}`;
}

function gradeFilter(g) {
  if (!g) return [];
  const f = [];
  const eq = [];
  if (g.brightness != null) eq.push(`brightness=${g.brightness}`);
  if (g.contrast != null) eq.push(`contrast=${g.contrast}`);
  if (g.saturation != null) eq.push(`saturation=${g.saturation}`);
  if (g.gamma != null) eq.push(`gamma=${g.gamma}`);
  if (eq.length) f.push(`eq=${eq.join(':')}`);
  if (g.lut) f.push(`lut3d=file=${escapeFilterPath(g.lut)}`);
  if (g.vignette) f.push('vignette=PI/5');
  if (g.sharpen) f.push('unsharp=5:5:0.6');
  return f;
}

function atempoChain(speed) {
  const parts = [];
  let s = speed;
  while (s > 2) { parts.push('atempo=2'); s /= 2; }
  while (s < 0.5) { parts.push('atempo=0.5'); s /= 0.5; }
  parts.push(`atempo=${s.toFixed(5)}`);
  return parts.join(',');
}

/** Conform a video clip: trim, speed, fit, grade, fades. Returns the output path. */
export async function conformVideo({ src, out, W, H, fps, inPoint = 0, outPoint, speed = 1, fit = 'contain', volume = 1, mute = false, grade, fadeIn = 0, fadeOut = 0, background }) {
  const info = await probe(src);
  const end = outPoint ?? info.duration;
  const srcLen = end - inPoint;
  if (srcLen <= 0) throw new Error(`Clip ${src}: out (${end}) must be after in (${inPoint})`);
  const dur = srcLen / speed;
  const vf = [`setpts=(PTS-STARTPTS)/${speed}`, fitFilter(fit, W, H, background), ...gradeFilter(grade), `fps=${fps}`, 'format=yuv420p', 'setsar=1'];
  if (fadeIn > 0) vf.push(`fade=t=in:st=0:d=${fadeIn}`);
  if (fadeOut > 0) vf.push(`fade=t=out:st=${Math.max(0, dur - fadeOut)}:d=${fadeOut}`);
  const args = ['-ss', String(inPoint), '-t', String(srcLen), '-i', src];
  let af;
  if (info.hasAudio && !mute) {
    af = ['aresample=48000', 'aformat=channel_layouts=stereo', 'asetpts=PTS-STARTPTS'];
    if (speed !== 1) af.push(atempoChain(speed));
    if (volume !== 1) af.push(`volume=${volume}`);
    if (fadeIn > 0) af.push(`afade=t=in:st=0:d=${fadeIn}`);
    if (fadeOut > 0) af.push(`afade=t=out:st=${Math.max(0, dur - fadeOut)}:d=${fadeOut}`);
    af.push('apad');
  } else {
    args.push('-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo');
  }
  const filter = `[0:v]${vf.join(',')}[v];${af ? `[0:a]${af.join(',')}[a]` : `[1:a]anull[a]`}`;
  await ffmpeg([...args, '-filter_complex', filter, '-map', '[v]', '-map', '[a]', '-t', dur.toFixed(4), ...SEG_VIDEO, ...SEG_AUDIO, out]);
  return out;
}

/** Still image -> segment, optionally with a Ken Burns push ("in", "out", "left", "right"). */
export async function conformImage({ src, out, W, H, fps, duration, fit = 'cover', kenburns = 'in', background }) {
  const frames = Math.round(duration * fps);
  let vf;
  if (kenburns) {
    const dir = kenburns === true ? 'in' : kenburns;
    const k = 0.12; // total zoom amount
    const z = dir === 'out' ? `${1 + k}-${k}*on/${frames}` : dir === 'in' ? `1+${k}*on/${frames}` : `${1 + k}`;
    const x = dir === 'left' ? `(iw-iw/zoom)*(1-on/${frames})` : dir === 'right' ? `(iw-iw/zoom)*on/${frames}` : 'iw/2-(iw/zoom/2)';
    // Upscale first so the push is smooth (zoompan rounds to whole pixels).
    vf = `${fitFilter(fit, W * 2, H * 2, background)},zoompan=z='${z}':x='${x}':y='ih/2-(ih/zoom/2)':d=${frames}:s=${W}x${H}:fps=${fps},format=yuv420p,setsar=1`;
    await ffmpeg(['-i', src, '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-filter_complex', `[0:v]${vf}[v]`, '-map', '[v]', '-map', '1:a', '-frames:v', String(frames), '-t', String(duration), ...SEG_VIDEO, ...SEG_AUDIO, out]);
  } else {
    vf = `${fitFilter(fit, W, H, background)},fps=${fps},format=yuv420p,setsar=1`;
    await ffmpeg(['-loop', '1', '-i', src, '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-filter_complex', `[0:v]${vf}[v]`, '-map', '[v]', '-map', '1:a', '-t', String(duration), ...SEG_VIDEO, ...SEG_AUDIO, out]);
  }
  return out;
}

export async function conformColor({ color = 'black', out, W, H, fps, duration }) {
  await ffmpeg(['-f', 'lavfi', '-i', `color=c=${color}:s=${W}x${H}:r=${fps}:d=${duration}`, '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-t', String(duration), '-map', '0:v', '-map', '1:a', ...SEG_VIDEO, ...SEG_AUDIO, out]);
  return out;
}

// ---------------------------------------------------------------------------
// Join with transitions (xfade / acrossfade) or straight cuts (concat).
// ---------------------------------------------------------------------------
export const XFADE = ['fade', 'fadeblack', 'fadewhite', 'fadegrays', 'dissolve', 'pixelize', 'distance', 'radial', 'wipeleft', 'wiperight', 'wipeup', 'wipedown', 'slideleft', 'slideright', 'slideup', 'slidedown', 'smoothleft', 'smoothright', 'smoothup', 'smoothdown', 'circlecrop', 'rectcrop', 'circleopen', 'circleclose', 'vertopen', 'vertclose', 'horzopen', 'horzclose', 'diagtl', 'diagtr', 'diagbl', 'diagbr', 'hlslice', 'hrslice', 'vuslice', 'vdslice', 'hblur', 'squeezeh', 'squeezev', 'zoomin', 'coverleft', 'coverright', 'coverup', 'coverdown', 'revealleft', 'revealright', 'revealup', 'revealdown'];
export const TRANSITION_ALIASES = {
  crossfade: 'fade', 'dip-to-black': 'fadeblack', 'dip-to-white': 'fadewhite', 'slide-left': 'slideleft', 'slide-right': 'slideright',
  'slide-up': 'slideup', 'slide-down': 'slidedown', 'wipe-left': 'wipeleft', 'wipe-right': 'wiperight', 'wipe-up': 'wipeup',
  'wipe-down': 'wipedown', zoom: 'zoomin', circle: 'circleopen', iris: 'circleclose', blur: 'hblur', push: 'smoothleft',
};
export function resolveTransition(t) {
  if (!t || t.type === 'cut' || t === 'cut') return null;
  const tt = typeof t === 'string' ? { type: t } : t;
  const name = TRANSITION_ALIASES[tt.type] ?? tt.type;
  if (!XFADE.includes(name)) throw new Error(`Unknown transition "${tt.type}". Use one of: cut, ${Object.keys(TRANSITION_ALIASES).join(', ')}, or an ffmpeg xfade name (${XFADE.join(', ')})`);
  return { type: name, duration: tt.duration ?? 0.5 };
}

/**
 * @param segments [{file, duration, transition}]  transition = how this segment enters
 * @returns total program duration
 */
export async function joinSegments(segments, out) {
  if (!segments.length) throw new Error('Timeline is empty');
  const inputs = segments.flatMap((s) => ['-i', s.file]);
  const f = [];
  segments.forEach((_, i) => {
    f.push(`[${i}:v]settb=AVTB,setpts=PTS-STARTPTS,format=yuv420p[v${i}]`);
    f.push(`[${i}:a]asetpts=PTS-STARTPTS[a${i}]`);
  });
  let vl = 'v0', al = 'a0', len = segments[0].duration;
  for (let i = 1; i < segments.length; i++) {
    const t = segments[i].transition;
    const nv = `vj${i}`, na = `aj${i}`;
    if (t) {
      const d = Math.min(t.duration, len - 0.05, segments[i].duration - 0.05);
      if (d <= 0) throw new Error(`Transition into segment ${i} is longer than the clips around it`);
      f.push(`[${vl}][v${i}]xfade=transition=${t.type}:duration=${d.toFixed(4)}:offset=${(len - d).toFixed(4)}[${nv}]`);
      f.push(`[${al}][a${i}]acrossfade=d=${d.toFixed(4)}:c1=tri:c2=tri[${na}]`);
      len += segments[i].duration - d;
    } else {
      f.push(`[${vl}][v${i}]concat=n=2:v=1:a=0[${nv}]`);
      f.push(`[${al}][a${i}]concat=n=2:v=0:a=1[${na}]`);
      len += segments[i].duration;
    }
    vl = nv; al = na;
  }
  await ffmpeg([...inputs, '-filter_complex', f.join(';'), '-map', `[${vl}]`, '-map', `[${al}]`, ...SEG_VIDEO, ...SEG_AUDIO, out]);
  return len;
}

// ---------------------------------------------------------------------------
// Finishing: overlays + audio mix + captions + encode, in one pass per output.
// ---------------------------------------------------------------------------
export const PRESETS = {
  youtube: { ext: 'mp4', v: ['-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high'], a: ['-c:a', 'aac', '-b:a', '320k'], extra: ['-movflags', '+faststart'] },
  web: { ext: 'mp4', v: ['-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-pix_fmt', 'yuv420p'], a: ['-c:a', 'aac', '-b:a', '160k'], extra: ['-movflags', '+faststart'] },
  social: { ext: 'mp4', v: ['-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-maxrate', '12M', '-bufsize', '24M'], a: ['-c:a', 'aac', '-b:a', '256k'], extra: ['-movflags', '+faststart'] },
  draft: { ext: 'mp4', v: ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '30', '-pix_fmt', 'yuv420p'], a: ['-c:a', 'aac', '-b:a', '128k'], extra: [] },
  webm: { ext: 'webm', v: ['-c:v', 'libvpx-vp9', '-crf', '32', '-b:v', '0', '-row-mt', '1'], a: ['-c:a', 'libopus', '-b:a', '160k'], extra: [] },
  prores: { ext: 'mov', v: ['-c:v', 'prores_ks', '-profile:v', '3', '-pix_fmt', 'yuv422p10le'], a: ['-c:a', 'pcm_s16le'], extra: [] },
  gif: { ext: 'gif' },
};

/**
 * @param o.program   joined timeline (.mp4)
 * @param o.duration  program duration
 * @param o.overlays  [{file, start, duration, x, y, width, alpha}]
 * @param o.captions  { file (srt/ass), burn, style }
 * @param o.audioFile final mix from mixAudio() (else the program's own audio)
 * @param o.output    { file, preset, reframe, width, height, fps }
 */
export async function finish({ program, duration, overlays = [], audioFile, captions, output, W, H, workDir }) {
  const preset = PRESETS[output.preset ?? 'youtube'];
  if (!preset) throw new Error(`Unknown output preset "${output.preset}". Known: ${Object.keys(PRESETS).join(', ')}`);
  const inputs = ['-i', program];
  const f = [];
  let n = 1;

  // Video: overlays in order, each shifted to its start time.
  let v = '0:v';
  overlays.forEach((o, i) => {
    if (o.still) inputs.push('-loop', '1', '-t', String(o.duration));
    inputs.push('-i', o.file);
    const idx = n++;
    const scale = o.width ? `,scale=${o.width}:-2` : '';
    const opacity = o.opacity != null && o.opacity < 1 ? `,colorchannelmixer=aa=${o.opacity}` : '';
    f.push(`[${idx}:v]format=yuva444p${scale}${opacity},setpts=PTS-STARTPTS+${o.start}/TB[ov${i}]`);
    const end = o.start + o.duration;
    f.push(`[${v}][ov${i}]overlay=x=${o.x ?? 0}:y=${o.y ?? 0}:eof_action=pass:enable='between(t,${o.start},${end.toFixed(4)})':format=auto[vo${i}]`);
    v = `vo${i}`;
  });

  // Captions (burned in).
  if (captions?.file && captions.burn !== false) {
    const style = captionStyle(captions.style, H);
    f.push(`[${v}]subtitles=filename=${escapeFilterPath(captions.file)}:force_style='${style}'[vsub]`);
    v = 'vsub';
  }

  // Output reframing (e.g. 9:16 cut-down from a 16:9 master).
  const outW = output.width ?? W, outH = output.height ?? H;
  if (output.reframe) {
    const [rw, rh] = output.reframe.split(':').map(Number);
    const tw = output.width ?? (rw > rh ? 1920 : 1080);
    const th = output.height ?? Math.round((tw * rh) / rw / 2) * 2;
    const focus = output.focus ?? 0.5; // horizontal focus point 0..1 for the crop
    if (output.reframeMode === 'blur') {
      // Whole frame fitted inside the new shape, over a blurred, darkened copy of itself.
      f.push(`[${v}]split=2[rb][rf]`);
      f.push(`[rb]scale=${tw}:${th}:force_original_aspect_ratio=increase,crop=${tw}:${th},boxblur=40:2,eq=brightness=-0.08[rbg]`);
      f.push(`[rf]scale=${tw}:${th}:force_original_aspect_ratio=decrease[rfs]`);
      f.push(`[rbg][rfs]overlay=(W-w)/2:(H-h)/2,setsar=1[vr]`);
    } else if (output.reframeMode === 'fit') {
      f.push(`[${v}]${fitFilter('contain', tw, th)},setsar=1[vr]`);
    } else {
      f.push(`[${v}]crop='min(iw,ih*${rw}/${rh})':'min(ih,iw*${rh}/${rw})':'(iw-min(iw,ih*${rw}/${rh}))*${focus}':'(ih-min(ih,iw*${rh}/${rw}))/2',scale=${tw}:${th},setsar=1[vr]`);
    }
    v = 'vr';
  } else if (outW !== W || outH !== H) {
    f.push(`[${v}]${fitFilter('contain', outW, outH)},setsar=1[vr]`);
    v = 'vr';
  }
  if (output.fps) { f.push(`[${v}]fps=${output.fps}[vf]`); v = 'vf'; }

  if (v === '0:v') { f.push('[0:v]null[vout]'); v = 'vout'; } // nothing to composite
  const isGif = output.preset === 'gif';
  let audioIdx = 0;
  if (!isGif && audioFile) { inputs.push('-i', audioFile); audioIdx = n++; }

  fs.mkdirSync(path.dirname(output.file), { recursive: true });

  if (isGif) {
    const gw = output.width ?? 640;
    f.push(`[${v}]fps=${output.fps ?? 15},scale=${gw}:-1:flags=lanczos,split[g1][g2];[g1]palettegen=stats_mode=diff[pal];[g2][pal]paletteuse=dither=sierra2_4a[gif]`);
    await ffmpeg([...inputs, '-filter_complex', f.join(';'), '-map', '[gif]', '-t', duration.toFixed(4), '-loop', '0', output.file], { cwd: workDir });
    return output.file;
  }

  const subArgs = [];
  if (captions?.file && captions.burn === false) {
    inputs.push('-i', captions.file);
    const idx = n++;
    subArgs.push('-map', `${idx}:s`, '-c:s', preset.ext === 'webm' ? 'webvtt' : 'mov_text', '-metadata:s:s:0', `language=${captions.language ?? 'eng'}`);
  }
  await ffmpeg([...inputs, '-filter_complex', f.join(';'), '-map', `[${v}]`, '-map', audioFile ? `${audioIdx}:a` : '0:a', ...subArgs, '-t', duration.toFixed(4), ...preset.v, ...preset.a, '-ar', '48000', ...preset.extra, output.file], { cwd: workDir });
  return output.file;
}

/**
 * Mix the final soundtrack to a WAV: program audio + extra tracks (voiceover, sfx)
 * + music ducked under them, then two-pass EBU R128 loudness normalisation.
 * @param audio { programVolume, tracks: [{file, start, volume, inPoint, duration, fadeIn, fadeOut}],
 *               music: {file, volume, fadeIn, fadeOut, duck, start, end, loop} }
 */
export async function mixAudio({ program, duration, audio = {}, loudness = -14, out }) {
  const inputs = ['-i', program];
  const f = [];
  let n = 1;
  const voices = [];
  f.push(`[0:a]volume=${audio.programVolume ?? 1}[prog]`);
  voices.push('prog');
  (audio.tracks || []).forEach((t, i) => {
    if (t.inPoint) inputs.push('-ss', String(t.inPoint));
    inputs.push('-i', t.file);
    const idx = n++;
    const delay = Math.round((t.start ?? 0) * 1000);
    const fades = [t.fadeIn ? `afade=t=in:st=0:d=${t.fadeIn}` : '', t.fadeOut && t.duration ? `afade=t=out:st=${t.duration - t.fadeOut}:d=${t.fadeOut}` : ''].filter(Boolean);
    f.push(`[${idx}:a]aresample=48000,aformat=channel_layouts=stereo,${t.duration ? `atrim=0:${t.duration},` : ''}${fades.length ? fades.join(',') + ',' : ''}volume=${t.volume ?? 1},adelay=${delay}|${delay}[tr${i}]`);
    voices.push(`tr${i}`);
  });
  let voiceBus = voices[0];
  if (voices.length > 1) {
    f.push(`${voices.map((x) => `[${x}]`).join('')}amix=inputs=${voices.length}:normalize=0:duration=first[voice]`);
    voiceBus = 'voice';
  }
  let mix = voiceBus;
  if (audio.music?.file) {
    const m = audio.music;
    if (m.loop !== false) inputs.push('-stream_loop', '-1');
    inputs.push('-i', m.file);
    const idx = n++;
    const start = m.start ?? 0;
    const len = (m.end ?? duration) - start;
    const fadeOut = m.fadeOut ?? 2;
    const d = Math.round(start * 1000);
    f.push(`[${idx}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${len.toFixed(3)},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=${m.fadeIn ?? 1},afade=t=out:st=${Math.max(0, len - fadeOut).toFixed(3)}:d=${fadeOut},volume=${m.volume ?? 0.35},adelay=${d}|${d}[mus]`);
    if (m.duck !== false) {
      // Sidechain: the music dips whenever the voice bus has signal.
      const dk = typeof m.duck === 'object' ? m.duck : {};
      f.push(`[${voiceBus}]asplit=2[vmix][vkey]`);
      f.push(`[mus][vkey]sidechaincompress=threshold=${dk.threshold ?? 0.02}:ratio=${dk.ratio ?? 10}:attack=${dk.attack ?? 15}:release=${dk.release ?? 350}:makeup=1[mduck]`);
      f.push(`[vmix][mduck]amix=inputs=2:normalize=0:duration=first[mixed]`);
    } else f.push(`[${voiceBus}][mus]amix=inputs=2:normalize=0:duration=first[mixed]`);
    mix = 'mixed';
  }
  f.push(`[${mix}]atrim=0:${duration.toFixed(4)},aresample=48000[aout]`);
  const raw = out.replace(/\.wav$/, '.raw.wav');
  await ffmpeg([...inputs, '-filter_complex', f.join(';'), '-map', '[aout]', '-c:a', 'pcm_s24le', raw]);
  if (loudness == null) { fs.renameSync(raw, out); return { file: out }; }

  // Pass 1: measure. Pass 2: apply with the measured values (linear, accurate).
  const target = `I=${loudness}:TP=-1.5:LRA=11`;
  const measured = await measureLoudness(raw, target);
  const silent = !Number.isFinite(Number(measured.input_i)) || Number(measured.input_i) < -70;
  const af = silent ? 'anull' : `loudnorm=${target}:measured_I=${measured.input_i}:measured_TP=${measured.input_tp}:measured_LRA=${measured.input_lra}:measured_thresh=${measured.input_thresh}:offset=${measured.target_offset}:linear=true,aresample=48000`;
  await ffmpeg(['-i', raw, '-af', af, '-c:a', 'pcm_s24le', out]);
  fs.rmSync(raw);
  return { file: out, measured: silent ? null : measured };
}

function measureLoudness(file, target) {
  return new Promise((resolve, reject) => {
    const child = spawn(FFMPEG, ['-hide_banner', '-nostats', '-i', file, '-af', `loudnorm=${target}:print_format=json`, '-f', 'null', '-']);
    let err = '';
    child.stderr.on('data', (d) => { err += d; });
    child.on('error', reject);
    child.on('close', () => {
      const m = err.match(/\{[\s\S]*?"target_offset"[\s\S]*?\}/);
      if (!m) return reject(new Error(`Could not measure loudness of ${file}:\n${err.slice(-1500)}`));
      resolve(JSON.parse(m[0]));
    });
  });
}

/** Integrated loudness (LUFS) of a file — for checks. */
export async function loudnessOf(file) {
  return Number((await measureLoudness(file, 'I=-14:TP=-1.5:LRA=11')).input_i);
}

function captionStyle(s = {}, H) {
  const hex = (c, a = 0) => { const m = c.replace('#', ''); return `&H${a.toString(16).padStart(2, '0')}${m.slice(4, 6)}${m.slice(2, 4)}${m.slice(0, 2)}`.toUpperCase(); };
  // libass scales from PlayResY=288 by default, so convert pixel sizes.
  const px = (p) => Math.round((p * 288) / H);
  const parts = [
    `FontName=${s.font ?? 'Inter'}`,
    `FontSize=${px(s.size ?? Math.round(H * 0.045))}`,
    `PrimaryColour=${hex(s.color ?? '#FFFFFF')}`,
    `OutlineColour=${hex(s.outlineColor ?? '#000000')}`,
    `BackColour=${hex(s.boxColor ?? '#000000', s.box ? 0x60 : 0x80)}`,
    `Bold=${s.bold === false ? 0 : 1}`,
    `BorderStyle=${s.box ? 3 : 1}`,
    `Outline=${s.box ? 2 : s.outline ?? 2}`,
    `Shadow=${s.shadow ?? 0}`,
    `Alignment=${s.position === 'top' ? 8 : s.position === 'middle' ? 5 : 2}`,
    `MarginV=${px(s.margin ?? Math.round(H * 0.07))}`,
  ];
  return parts.join(',');
}

export function escapeFilterPath(p) {
  return p.replace(/\\/g, '/').replace(/:/g, '\\:').replace(/'/g, "\\'").replace(/,/g, '\\,');
}

/** Write SRT from [{start, end, text}] cues. */
export function writeSrt(cues, file) {
  const ts = (t) => {
    const ms = Math.round(t * 1000);
    const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
  };
  fs.writeFileSync(file, cues.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text}\n`).join('\n'));
  return file;
}

/** Grab still frames for review: returns the PNG paths. */
export async function contactSheet(video, out, { times, cols = 3, width = 640 }) {
  const tiles = [];
  for (const [i, t] of times.entries()) {
    const p = `${out}.${i}.png`;
    await ffmpeg(['-ss', String(t), '-i', video, '-frames:v', '1', '-vf', `scale=${width}:-2,drawtext=text='${t.toFixed(1)}s':x=12:y=12:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=6`, p]);
    tiles.push(p);
  }
  const rows = Math.ceil(tiles.length / cols);
  const layout = tiles.map((_, i) => `${(i % cols) === 0 ? '0' : Array.from({ length: i % cols }, (_, k) => `w${k}`).join('+')}_${Math.floor(i / cols) === 0 ? '0' : Array.from({ length: Math.floor(i / cols) }, (_, k) => `h${k * cols}`).join('+')}`).join('|');
  if (tiles.length === 1) fs.copyFileSync(tiles[0], out);
  else await ffmpeg([...tiles.flatMap((t) => ['-i', t]), '-filter_complex', `xstack=inputs=${tiles.length}:layout=${layout}:fill=black`, out]);
  tiles.forEach((t) => fs.rmSync(t));
  void rows;
  return out;
}
