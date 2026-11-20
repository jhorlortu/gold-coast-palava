// Gold Coast Palava — HyperFrames scene library (v2, motion-reel rules).
// Each section of the video is one HyperFrames project generated from a list of scenes.
// Motion follows the motion-reel kit: closed-form springs (lib/motion.js) registered as GSAP
// eases, masked rises instead of fades, scenes covered by the next scene's wipe instead of
// crossfades, a slow camera drift on every shot, and something new every 2–4 s (checked).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const HERE = path.dirname(new URL(import.meta.url).pathname);
const KIT_MOTION = '/home/user/gcp/.claude/skills/motion-reel/engine/lib/motion.js';
const Motion = require(KIT_MOTION);
// GCP_FORMAT=9x16 builds vertical (1080x1920) social reels with the same engine; default is the 16:9 YouTube layout
export const PORTRAIT = process.env.GCP_FORMAT === '9x16';
export const W = PORTRAIT ? 1080 : 1920, H = PORTRAIT ? 1920 : 1080, FPS = 30;
// Output size: the 1920x1080 layout is zoomed so text and vectors rasterise natively at 2K (2560x1440)
export const OUT_W = +(process.env.GCP_OUT_W || W), OUT_H = Math.round(OUT_W * H / W), ZOOM = OUT_W / W;
const MEDIA = '/home/user/gcp/project/media';

/** Settle time of each spring preset = the duration of a tween that uses it. */
export const SP = Object.fromEntries(['snappy', 'default', 'heavy', 'playful'].map((k) => [k, +Motion.settle(k, 0.002).toFixed(3)]));
const spr = (k) => ({ duration: SP[k], ease: `sp-${k}` });

// ---------------------------------------------------------------------------
// Voice cues
// ---------------------------------------------------------------------------
export const WORKDIR = process.env.GCP_WORK || '/home/user/gcp/work';   // per-edition work folder (transcript, timeline)
const transcript = JSON.parse(fs.readFileSync(path.join(WORKDIR, 'transcript.json'), 'utf8'));
const WORDS = transcript.segments.flatMap((s) => s.words);
const norm = (x) => x.toLowerCase().replace(/[^a-z0-9]/g, '');

export function cuer(pieces) {
  const toLocal = (t) => {
    const p = pieces.find((q) => t >= q.vo_in - 0.05 && t <= q.vo_out + 0.05);
    if (!p) throw new Error(`voice time ${t} is outside this segment`);
    return p.local0 + (t - p.vo_in);
  };
  const lo = Math.min(...pieces.map((q) => q.vo_in)), hi = Math.max(...pieces.map((q) => q.vo_out));
  const find = (phrase, { after = 0, end = false } = {}) => {
    const toks = phrase.split(/\s+/).map(norm).filter(Boolean);
    for (let i = 0; i < WORDS.length; i++) {
      const w = WORDS[i];
      if (w.s < lo - 0.05 || w.s > hi) continue;
      if (!pieces.some((q) => w.s >= q.vo_in - 0.05 && w.s <= q.vo_out + 0.05)) continue;   // reels: skip words that were cut out
      if (toLocal(w.s) < after) continue;
      if (toks.every((t, k) => WORDS[i + k] && norm(WORDS[i + k].w) === t)) {
        return +(end ? toLocal(WORDS[i + toks.length - 1].e) : toLocal(w.s)).toFixed(3);
      }
    }
    throw new Error(`cue not found: "${phrase}" (after ${after})`);
  };
  find.words = (from, to) => WORDS.filter((w) => w.s >= lo - 0.04 && w.s <= hi + 0.04).filter((w) => pieces.some((q) => w.s >= q.vo_in - 0.05 && w.s <= q.vo_out + 0.05)).map((w) => { const s0 = toLocal(w.s); let e0; try { e0 = toLocal(w.e); } catch { e0 = s0 + 0.3; } return { w: w.w.trim(), s: s0, e: e0 }; }).filter((w) => w.s >= from && w.s < to);
  return find;
}

// ---------------------------------------------------------------------------
const n = (v) => Number(Number(v).toFixed(3));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const allowTags = (h) => h.replace(/&lt;(\/?(?:s|b|i))((?: style=&quot;[^&]*&quot;)?)&gt;/g, (m, t, st) => `<${t}${st.replace(/&quot;/g, '"')}>`);
export const rich = (s) => allowTags(esc(s)).replace(/\*([^*]+)\*/g, '<em class="acc">$1</em>').replace(/_([^_]+)_/g, '<em class="gold">$1</em>');
const T = (sel, from, to, at) => `tl.fromTo(${JSON.stringify(sel)}, ${JSON.stringify(from)}, ${JSON.stringify(to)}, ${n(at)});`;
const TO = (sel, to, at) => `tl.to(${JSON.stringify(sel)}, ${JSON.stringify({ ...to, immediateRender: false })}, ${n(at)});`;
const SNAP = { duration: 0.1, ease: 'none' };          // opacity snaps in within 3 frames (never a fade)

const ENTERS = ['wipeL', 'rise', 'wipeR', 'push', 'wipeU', 'iris'];

export class Part {
  constructor({ id, dur, T0, label = '' }) {
    Object.assign(this, { id, dur, T0, label });
    this.html = []; this.tl = []; this.css = []; this.assets = new Map(); this.sfx = []; this.uid = 0;
    this.events = []; this.busy = []; this.z = 1; this.enterIx = 0; this.overlap = 0.55;
  }
  asset(src) {
    const abs = path.isAbsolute(src) ? src : path.join(MEDIA, src);
    if (!fs.existsSync(abs)) throw new Error(`missing asset ${abs}`);
    if (!this.assets.has(abs)) this.assets.set(abs, `assets/m${this.assets.size}-${path.basename(abs).replace(/[^a-zA-Z0-9._-]/g, '_')}`);
    return this.assets.get(abs);
  }
  id_(p) { return `${p}${++this.uid}`; }
  ev(t) { this.events.push(+t); }
  sound(file, at, db = -10, len) { this.sfx.push({ file: path.isAbsolute(file) ? file : path.join(MEDIA, 'sfx', file), T: n(this.T0 + at), db, ...(len ? { len } : {}) }); }

  /**
   * A scene: a timed clip [start, end + overlap). It enters by wiping/pushing OVER the previous
   * scene (never a crossfade) and is itself covered by the next one. Its camera drifts the whole time.
   */
  scene(start, end, inner, { bg = 'paper', enter, drift = 0.04, id, z, timed = true } = {}) {
    id ??= this.id_('s');
    enter ??= ENTERS[this.enterIx++ % ENTERS.length];
    const realEnd = Math.min(this.dur, end + this.overlap);
    const dur = Math.max(0.1, realEnd - start);
    const zz = z ?? ++this.z;
    const bgHtml = bg === 'paper' ? `<div class="bgp"></div>` : bg === 'plain' ? `<div class="bgp plain"></div>` : bg === 'ink' ? `<div class="bgi"></div>` : bg === 'none' ? '' : bg;
    const timing = timed ? `class="clip scene" data-start="${n(start)}" data-duration="${n(dur)}" data-track-index="${zz % 8}"` : `class="scene"`;
    this.html.push(`<div id="${id}" ${timing} style="z-index:${zz}"><div id="${id}-in" class="wrap">${bgHtml}<div id="${id}-cam" class="wrap cam">${inner}</div></div></div>`);
    const w = `#${id}-in`, cam = `#${id}-cam`;
    const H_ = spr('heavy');
    if (start > 0.01 && enter !== 'cut') {
      if (enter === 'wipeL') this.tl.push(T(w, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ...H_ }, start));
      if (enter === 'wipeR') this.tl.push(T(w, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ...H_ }, start));
      if (enter === 'wipeU') this.tl.push(T(w, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ...H_ }, start));
      if (enter === 'iris') this.tl.push(T(w, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', ...H_ }, start));
      if (enter === 'rise') this.tl.push(T(w, { y: H }, { y: 0, ...spr('default') }, start));
      if (enter === 'push') this.tl.push(T(w, { x: W }, { x: 0, ...spr('default') }, start));
      this.sound(this.enterIx % 2 ? 'whoosh-1.mp3' : 'whoosh-2.mp3', start - 0.08, -18);   // every swipe gets a swoosh
    }
    if (drift) this.tl.push(T(cam, { scale: 1 }, { scale: 1 + drift, duration: n(dur), ease: 'none' }, start));
    this.ev(start);
    return id;
  }

  // ----- elements ----------------------------------------------------------
  /** Masked words: each word rises through its own mask on a heavy spring. */
  words(sel, text, at, { stagger = 0.06, preset = 'heavy' } = {}) {
    let i = 0;
    this.ev(at);
    this.busy.push([at, at + text.split(/\s+/).length * stagger + 1.6]);
    if (text.split(/\s+/).length > 1) { this.sound('syn-swish.wav', at - 0.05, -21); this.sound('syn-tick.wav', at + 0.12, -25); }
    return rich(text).split(/(<em class="[a-z]+">[^<]+<\/em>|\s+)/).filter((x) => x !== '').map((tok) => {
      if (/^\s+$/.test(tok)) return ' ';
      const id = `${sel}-w${i}`;
      this.tl.push(T(`#${id}`, { yPercent: 118 }, { yPercent: 0, ...spr(preset) }, at + i++ * stagger));
      return `<span class="mk"><span id="${id}" class="wd">${tok}</span></span>`;
    }).join('');
  }
  stamp(text, at, { x = 1300, y = 640, rot = -8, color = 'var(--red)', size = 64, sfx = 'stamp-1.mp3' } = {}) {
    const id = this.id_('st');
    this.busy.push([at, at + 1.2]);
    this.tl.push(T(`#${id}`, { opacity: 0 }, { opacity: 0.92, ...SNAP }, at));
    this.tl.push(T(`#${id}`, { scale: 2.2, rotation: rot - 12 }, { scale: 1, rotation: rot, ...spr('snappy') }, at));
    if (sfx) this.sound(sfx, at + 0.12, -9);
    this.ev(at);
    return `<div id="${id}" class="stamp" style="left:${x}px;top:${y}px;color:${color};border-color:${color};font-size:${size}px">${esc(text)}</div>`;
  }
  chip(text, at, { kind = 'chip', x, y } = {}) {
    const id = this.id_('c');
    this.busy.push([at, at + 1.5]);
    this.sound('syn-pop.wav', at + 0.02, -21);
    this.tl.push(T(`#${id}`, { opacity: 0 }, { opacity: 1, ...SNAP }, at));
    this.tl.push(T(`#${id}`, { scale: 0.82, y: 26 }, { scale: 1, y: 0, ...spr('snappy') }, at));
    this.ev(at);
    const pos = x != null ? `position:absolute;left:${x}px;top:${y}px;` : '';
    return `<span id="${id}" class="${kind}" style="${pos}">${rich(text)}</span>`;
  }
  /** A cartoon sticker (cut-out illustration) that springs onto the page with its own sound. */
  icon(name, at, { x = 0, y = 0, w = 300, rot = 0, sfx = 'syn-boop.wav', db = -20, len, until, abs = true, cls = '', life = 'bob', dir = (process.env.GCP_ICONS || path.join(MEDIA, 'icons', 'cut')) } = {}) {
    const id = this.id_('ic');
    const src = this.asset(path.join(dir, name + '.png'));
    this.tl.push(T(`#${id}`, { opacity: 0 }, { opacity: 1, ...SNAP }, at));
    this.tl.push(T(`#${id}`, { scale: 0.2, rotation: rot + (this.uid % 2 ? -24 : 24), y: 40 }, { scale: 1, rotation: rot, y: 0, ...spr('playful') }, at));
    // after the landing, each sticker keeps living until `until`: a looping motion that suits what it shows
    if (until && until > at + 1.2) {
      const LIFE = { bob: [{ y: -10, rotation: rot + (this.uid % 2 ? 2 : -2) }, 1.6], sway: [{ rotation: rot + 6 }, 1.3], pulse: [{ scale: 1.06 }, 0.9],
        jiggle: [{ rotation: rot - 4, y: -4 }, 0.22], sail: [{ x: 40, y: -6, rotation: rot + 2 }, 2.4], float: [{ y: -22 }, 2.2], spin: [{ rotation: rot + 8 }, 1.8] };
      const [to, d] = LIFE[life] || LIFE.bob, reps = Math.max(1, Math.floor((until - at - 0.8) / d));
      this.tl.push(`tl.to("#${id}", ${JSON.stringify({ ...to, duration: d, ease: 'sine.inOut', repeat: reps - 1, yoyo: true, immediateRender: false })}, ${n(at + 0.8)});`);
    }
    if (sfx) this.sound(sfx, at + 0.03, db, len);
    this.ev(at); this.busy.push([at, at + 1.2]);
    const pos = abs ? `position:absolute;left:${x}px;top:${y}px;` : 'position:relative;display:inline-block;';
    return `<img id="${id}" class="sticker ${cls}" src="${src}" style="${pos}width:${w}px">`;
  }
  kicker(text, at, color = 'var(--red)') {
    this.sound('syn-tick.wav', at, -24);
    const id = this.id_('k');
    this.tl.push(T(`#${id}-bar`, { scaleX: 0 }, { scaleX: 1, ...spr('snappy') }, at));
    this.tl.push(T(`#${id}-t`, { yPercent: 120 }, { yPercent: 0, ...spr('default') }, at + 0.08));
    return `<div class="kicker" style="color:${color}"><i id="${id}-bar" style="background:${color};transform-origin:0 50%"></i><span class="mk"><span id="${id}-t" class="wd">${esc(text)}</span></span></div>`;
  }
  typed(text, at, { cps = 28, cls = 'mono', sfx = true } = {}) {
    const id = this.id_('ty');
    const chars = Array.from(text);
    this.busy.push([at, at + chars.length / cps + 0.8]);
    chars.forEach((c, i) => this.tl.push(`tl.set("#${id}-${i}", {opacity:1}, ${n(at + i / cps)});`));
    if (sfx) this.sound(chars.length / cps > 1.5 ? 'typewriter-2.mp3' : 'typewriter-1.mp3', at, -16, Math.min(3, chars.length / cps + 0.3));
    this.ev(at); this.ev(at + chars.length / cps);
    return `<span id="${id}" class="${cls}">${chars.map((c, i) => `<span id="${id}-${i}" style="opacity:0">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('')}</span>`;
  }
  /** Element that grows out of nothing (cards, prints, badges). */
  grow(id, at, { rot = 0, from = 0.86, preset = 'default', dy = 60 } = {}) {
    this.tl.push(T(`#${id}`, { opacity: 0 }, { opacity: 1, ...SNAP }, at));
    this.tl.push(T(`#${id}`, { scale: from, y: dy, rotation: rot + 5 }, { scale: 1, y: 0, rotation: rot, ...spr(preset) }, at));
    this.sound('syn-thud.wav', at + 0.18, -20);
    this.ev(at);
  }
  /** Retarget an element (camera moves, push-throughs) on a spring. */
  move(sel, to, at, preset = 'default') { this.tl.push(TO(sel, { ...to, ...spr(preset) }, at)); this.ev(at); }

  // ----- scene templates ------------------------------------------------------
  cover(start, end, src, { move = 'in', focus = '50% 50%', dim = 0.2, overlay = '', opts = {} } = {}) {
    const id = this.id_('cv');
    const [s0, s1, x0, x1] = { in: [1.0, 1.14, 0, 0], out: [1.16, 1.0, 0, 0], left: [1.12, 1.12, 60, -60], right: [1.12, 1.12, -60, 60], hold: [1.03, 1.08, 0, 0] }[move];
    this.tl.push(T(`#${id}`, { scale: s0, x: x0 }, { scale: s1, x: x1, duration: n(end - start + this.overlap), ease: 'none' }, start));
    const html = `<div id="${id}" class="cover" style="background-image:url(${this.asset(src)});transform-origin:${focus}"></div><div class="shade" style="opacity:${dim}"></div>${overlay}`;
    return this.scene(start, end, html, { bg: 'none', drift: 0, ...opts });
  }
  /** B-roll video, full bleed, with an optional credit line and overlay html. */
  broll(start, end, src, { mediaStart = 0, credit = '', overlay = '', dim = 0.15, rate = 1, opts = {} } = {}) {
    const id = this.id_('br');
    const realEnd = Math.min(this.dur, end + this.overlap);
    const vid = `<video id="${id}" class="clip broll" src="${this.asset(src)}" data-start="${n(start)}" data-duration="${n(realEnd - start)}" data-media-start="${n(mediaStart)}"${rate !== 1 ? ` data-playback-rate="${rate}"` : ''} muted playsinline></video>`;
    const cr = credit ? `<div class="bcredit mono">${esc(credit)}</div>` : '';
    // The wrapper only places/animates; the video and the overlay each carry their own timing.
    const ov = `<div id="${id}-ov" class="clip" data-start="${n(start)}" data-duration="${n(realEnd - start)}" style="position:absolute;inset:0"><div class="shade" style="opacity:${dim}"></div>${overlay}${cr}</div>`;
    return this.scene(start, end, `${vid}${ov}`, { bg: 'none', drift: 0.05, timed: false, ...opts });
  }
  print(src, at, { x = 1020, y = 120, w = 760, rot = 2, caption = '', credit = '', round = false } = {}) {
    const id = this.id_('pr');
    this.grow(id, at, { rot });
    this.sound('whoosh-1.mp3', at, -20);
    const img = round
      ? `<div class="roundimg" style="width:${w}px;height:${w}px;background-image:url(${this.asset(src)})"></div>`
      : `<img src="${this.asset(src)}" style="width:${w}px;display:block">`;
    return `<div id="${id}" class="print${round ? ' isround' : ''}" style="left:${x}px;top:${y}px">${img}${caption ? `<div class="cap">${rich(caption)}</div>` : ''}${credit ? `<div class="credit">${esc(credit)}</div>` : ''}</div>`;
  }
  headline(start, end, { kicker, text, sub, subAt, align = 'left', size = 120, bg = 'paper', x = 150, y = 300, width = 1620, extra = '', enter, color, tat } = {}) {
    const id = this.id_('h');
    const k = kicker ? this.kicker(kicker, tat != null ? tat : start + 0.1, bg === 'ink' ? 'var(--gold)' : 'var(--red)') : '';
    const h = this.words(id, text, tat ?? start + 0.2);
    let sb = '';
    if (sub) { const sid = this.id_('sb'); this.tl.push(T(`#${sid}`, { yPercent: 120 }, { yPercent: 0, ...spr('default') }, subAt ?? start + 0.9)); this.ev(subAt ?? start + 0.9); sb = `<div class="sub"><span class="mk"><span id="${sid}" class="wd">${rich(sub)}</span></span></div>`; }
    const col = color ?? (bg === 'ink' ? 'var(--paper)' : 'var(--ink)');
    return this.scene(start, end, `<div class="hl" style="left:${x}px;top:${y}px;width:${width}px;text-align:${align};color:${col}">${k}<h1 style="font-size:${size}px">${h}</h1>${sb}</div>${extra}`, { bg, enter });
  }
  rule(at, { x = 150, y = 600, w = 400, color = 'var(--gold)', h = 8 } = {}) {
    const id = this.id_('r');
    this.sound('syn-swish.wav', at, -27);
    this.tl.push(T(`#${id}`, { scaleX: 0 }, { scaleX: 1, ...spr('default') }, at));
    this.ev(at);
    return `<div id="${id}" class="rule" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${color}"></div>`;
  }
  /** Words that light up exactly as they are spoken. */
  spoken(cue, from, to, { accents = {}, dim = 0.16 } = {}) {
    const id = this.id_('sp');
    this.busy.push([from, to]);
    return cue.words(from, to).map((w, i) => {
      const key = w.w.toLowerCase().replace(/[^a-z0-9']/g, '');
      const cls = accents[key] ? ` ${accents[key]}` : '';
      const at = Math.max(from, w.s - 0.05);
      this.tl.push(T(`#${id}-${i}`, { opacity: dim }, { opacity: 1, ...SNAP }, at));
      this.tl.push(T(`#${id}-${i}`, { y: 10 }, { y: 0, ...spr('snappy') }, at));
      if (i % 3 === 0) this.ev(at);
      return `<span id="${id}-${i}" class="wd${cls}">${esc(w.w)}</span>`;
    }).join(' ');
  }
  numbered(start, end, num, title, chips = [], { extra = '', chipW = 1300, chipY = 520 } = {}) {
    const nid = this.id_('nb');
    this.tl.push(T(`#${nid}`, { yPercent: 110 }, { yPercent: 0, ...spr('heavy') }, start + 0.05));
    const ttl = this.words(this.id_('nt'), title, start + 0.25, { stagger: 0.05 });
    const cs = chips.map((c) => this.chip(c.text, c.at, { kind: c.kind || 'chip' })).join('');
    return this.scene(start, end, `<div class="mk" style="position:absolute;left:110px;top:130px"><div id="${nid}" class="big-num" style="font-size:430px">${num}</div></div>
      <div class="hl" style="left:520px;top:205px;width:1300px"><div class="kicker" style="color:var(--red)"><i style="background:var(--red)"></i>THING NO. ${num} OF 5</div><h1 style="font-size:96px">${ttl}</h1></div>
      <div class="${chipW < 1000 ? 'chips-sm' : ''}" style="position:absolute;left:520px;top:${chipY}px;width:${chipW}px">${cs}</div>${extra}`, {});
  }


  /**
   * A moving print: B-roll video inside a white print frame on the page, with a caption.
   * Frame and video are sibling clips at the stage root (a <video> may not sit inside a timed
   * element); both get the same spring "grow" so they move as one object.
   */
  vprint(src, start, end, { x = 1000, y = 160, w = 780, rot = 2, caption = '', credit = '', mediaStart = 0, rate = 1 } = {}) {
    const id = this.id_('vp');
    const h = Math.round(w * 9 / 16);
    const realEnd = Math.min(this.dur, end + this.overlap);
    const dur = n(realEnd - start);
    const zz = 600 + this.uid;
    this.html.push(`<div id="${id}-f" class="clip print" data-start="${n(start)}" data-duration="${dur}" style="left:${x - 18}px;top:${y - 18}px;width:${w + 36}px;height:${h + 36 + (caption ? 64 : 0)}px;z-index:${zz};transform-origin:${w / 2 + 18}px ${h / 2 + 18}px">${caption ? `<div class="cap" style="position:absolute;left:18px;top:${h + 30}px">${rich(caption)}</div>` : ''}${credit ? `<div class="credit" style="position:absolute;right:18px;top:${h + 34}px">${esc(credit)}</div>` : ''}</div>`);
    this.html.push(`<video id="${id}-v" class="clip" src="${this.asset(src)}" data-start="${n(start)}" data-duration="${dur}" data-media-start="${n(mediaStart)}"${rate !== 1 ? ` data-playback-rate="${rate}"` : ''} muted playsinline style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;object-fit:cover;z-index:${zz + 1};transform-origin:${w / 2}px ${h / 2}px"></video>`);
    for (const sel of [`#${id}-f`, `#${id}-v`]) {
      this.tl.push(T(sel, { scale: 0.8, y: 80, rotation: rot + 7 }, { scale: 1, y: 0, rotation: rot, ...spr('default') }, start));
      this.tl.push(TO(sel, { y: -1300, rotation: rot - 10, ...spr('default') }, Math.max(start + 0.5, end - 0.45)));
    }
    this.sound('whoosh-1.mp3', start, -18);
    this.ev(start); this.ev(end - 0.45);
    return id;
  }

  /** Longest stretch with nothing new on screen (the kit's 2–4 s rule). */
  gaps() {
    const ev = [...new Set(this.events.map((t) => Math.round(t * 10) / 10))].filter((t) => t >= 0 && t <= this.dur).sort((a, b) => a - b);
    const pts = [0, ...ev, this.dur];
    let worst = 0, at = 0;
    for (let i = 1; i < pts.length; i++) if (pts[i] - pts[i - 1] > worst) { worst = pts[i] - pts[i - 1]; at = pts[i - 1]; }
    return { worst: +worst.toFixed(2), at: +at.toFixed(2), events: ev.length };
  }

  // ----- output -----------------------------------------------------------
  write(outDir, { mast = this.mast ?? true } = {}) {
    fs.rmSync(outDir, { recursive: true, force: true });
    fs.mkdirSync(path.join(outDir, 'assets'), { recursive: true });
    for (const f of ['gsap.min.js', 'paper.jpg', 'ink.jpg', 'gcp-round.otf', 'papers-bg.jpg', 'kente.png']) fs.copyFileSync(path.join(HERE, 'assets', f), path.join(outDir, 'assets', f));
    fs.copyFileSync(KIT_MOTION, path.join(outDir, 'assets', 'motion.js'));
    for (const [abs, rel] of this.assets) fs.copyFileSync(abs, path.join(outDir, rel));
    const mastHtml = mast ? `<div id="mast" class="clip mast" data-start="${n(this.mastStart ?? 0)}" data-duration="${n((this.mastEnd ?? this.dur) - (this.mastStart ?? 0))}" data-track-index="9" style="z-index:900"><div class="kente top"></div><div class="mast-l">GOLD COAST PALAVA <b>·</b> ${esc(process.env.GCP_EDITION || "HEADLINE EDITION")}</div><div class="mast-r">${esc(this.label)}</div></div>` : '';
    const markDark = (h) => h.replace(/<div class="([^"]*)" style="([^"]*color:#FFF8EA[^"]*)"/g, '<div class="$1 ondark" style="$2"').replace(/<div style="([^"]*color:#FFF8EA[^"]*)"/g, '<div class="ondark" style="$1"');
    this.html = this.html.map(markDark);
    const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=${OUT_W}, height=${OUT_H}">
<script src="assets/gsap.min.js"></script>
<script src="assets/motion.js"></script>
<script>
// Closed-form springs from the motion-reel kit, used as GSAP eases. Tween duration = settle time.
['snappy','default','heavy','playful'].forEach(function (k) { var S = Motion.settle(k, 0.002); gsap.registerEase('sp-' + k, function (p) { return Motion.step(p * S, k); }); });
</script>
<style>
@font-face { font-family: 'GCP Round'; src: url('assets/gcp-round.otf') format('opentype'); font-weight: 700; }
:root { --paper:#F3EBD7; --paper2:#FCF5E8; --ink:#1A1612; --gold:#C8962F; --red:#A4241B; --muted:#6B6253; --green:#2E6B3A; }
* { margin:0; padding:0; box-sizing:border-box; }
html { width:${OUT_W}px; height:${OUT_H}px; overflow:hidden; background:#F3EBD7; }
body { width:${W}px; height:${H}px; overflow:hidden; background:#F3EBD7; zoom:${ZOOM}; }
#root { position:relative; width:${W}px !important; height:${H}px !important; max-width:${W}px;  overflow:hidden; font-family:'GCP Round', 'Inter', sans-serif; color:var(--ink); background:var(--paper); }
.scene { position:absolute; inset:0; overflow:hidden; }
.wrap { position:absolute; inset:0; }
.cam { transform-origin:50% 50%; }
.bgp { position:absolute; inset:0; background:url(assets/paper.jpg) center/cover; }
.bgp::after { content:''; position:absolute; inset:0; background:url(assets/papers-bg.jpg) center/cover; opacity:.10; }
.bgp.plain::after { display:none; }
.bgi { position:absolute; inset:0; background:url(assets/ink.jpg) center/cover; }
.cover { position:absolute; inset:-1%; background-size:cover; background-position:center; }
.broll { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.bcredit, .credit { display:none !important; }
.ondark .acc, .ondark em.acc { color:#FFC94A; }
.bcredit { position:absolute; right:40px; bottom:28px; font-size:15px; color:#fff; background:rgba(26,22,18,.55); padding:4px 10px; }
.shade { position:absolute; inset:0; background:linear-gradient(180deg, rgba(20,14,8,.32) 0%, rgba(20,14,8,0) 30%, rgba(20,14,8,0) 70%, rgba(20,14,8,.28) 100%); }
.hl { position:absolute; }
.hl h1 { font-family:'Playfair Display', serif; font-weight:900; line-height:1.04; letter-spacing:-0.02em; }
.mk { display:inline-block; overflow:hidden; vertical-align:bottom; padding:0.06em 0.03em 0.14em; margin:-0.06em -0.03em -0.14em; }
.wd { display:inline-block; }
em { font-style:normal; }
.acc { color:var(--red); }
.gold { color:var(--gold); }
.sub { font-family:'Playfair Display', serif; font-style:italic; font-size:44px; margin-top:28px; color:var(--muted); }
.kicker { font-family:'IBM Plex Mono', monospace; font-weight:700; font-size:26px; letter-spacing:.22em; text-transform:uppercase; display:flex; align-items:center; gap:18px; margin-bottom:22px; }
.kicker i { display:block; width:56px; height:6px; }
.mono { font-family:'IBM Plex Mono', monospace; }
.stamp { position:absolute; font-family:'IBM Plex Mono', monospace; font-weight:700; letter-spacing:.12em; text-transform:uppercase; border:6px solid; padding:8px 26px; border-radius:6px; white-space:nowrap; background:rgba(255,253,247,.9); box-shadow:0 14px 30px -12px rgba(40,25,10,.45); }
.chip { display:inline-block; font-family:'GCP Round', sans-serif; font-weight:700; font-size:40px; background:var(--ink); color:var(--paper2); padding:14px 30px; border-radius:999px; margin:0 14px 18px 0; box-shadow:0 10px 24px -10px rgba(26,22,18,.35); }
.chip.tiny { font-size:24px; padding:8px 18px; width:180px; text-align:center; box-sizing:border-box; }
.chip.sub-sm { font-size:30px; padding:10px 26px; margin:0; }
.chips-sm .chip { font-size:32px; padding:10px 22px; margin:0 10px 12px 0; }
.chip.light { background:#FCF5E8; color:var(--ink); border:3px solid var(--ink); }
.chip.gold { background:var(--gold); color:var(--ink); }
.chip.red { background:var(--red); color:#FCF5E8; }
.print { position:absolute; background:#FCF5E8; padding:18px 18px 22px; box-shadow:0 2px 6px rgba(0,0,0,.06), 0 40px 70px -24px rgba(60,40,10,.4); }
.print.isround { background:none; box-shadow:none; padding:0; }
.roundimg { border-radius:50%; background-size:cover; background-position:center 25%; box-shadow:0 30px 60px -20px rgba(60,40,10,.45); border:10px solid #FCF5E8; }
.print img { filter:saturate(1.2) contrast(1.06); }
.sticker { filter:drop-shadow(0 14px 18px rgba(60,40,10,.28)); transform-origin:50% 80%; }
.cover, video, .roundimg, .bn-sheet { filter:saturate(1.22) contrast(1.06) brightness(.98); }
.cap { font-family:'IBM Plex Mono', monospace; font-size:22px; margin-top:14px; color:var(--ink); max-width:100%; }
.credit { font-family:'IBM Plex Mono', monospace; font-size:14px; color:var(--muted); margin-top:6px; }
.rule { position:absolute; transform-origin:0 50%; }
.card { position:absolute; background:#FCF5E8; border:3px solid var(--ink); box-shadow:10px 12px 0 var(--ink); padding:26px 30px; }
.card .lbl { display:flex; justify-content:space-between; font-family:'IBM Plex Mono', monospace; font-size:18px; font-weight:700; letter-spacing:.08em; }
.card .lbl b { color:var(--red); }
.card h3 { font-family:'Playfair Display', serif; font-weight:900; font-size:46px; line-height:1.05; margin:16px 0 18px; }
.card .dots { height:46px; border:2px solid var(--ink); background-image:radial-gradient(var(--ink) 1.6px, transparent 1.8px); background-size:9px 9px; opacity:.45; }
.mast { position:absolute; inset:0; pointer-events:none; }
.kente { position:absolute; left:0; right:0; height:14px; background:url(assets/kente.png) repeat-x; background-size:auto 14px; }
.kente.top { top:0; }
.mast-l, .mast-r { position:absolute; top:34px; font-family:'IBM Plex Mono', monospace; font-weight:700; font-size:20px; letter-spacing:.2em; color:var(--ink); background:rgba(251,248,239,.94); padding:6px 14px; }
.mast-l { left:48px; } .mast-l b { color:var(--red); }
.mast-r { right:48px; color:var(--red); }
.big-num { font-family:'Playfair Display', serif; font-weight:900; color:var(--gold); line-height:1.02; padding:0 .06em .1em; }
${this.css.join('\n')}
</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${n(this.dur)}" data-fps="${FPS}" data-width="${OUT_W}" data-height="${OUT_H}">
${this.html.join('\n')}
${mastHtml}
</div>
<script>
const tl = gsap.timeline({ paused: true });
${this.tl.join('\n')}
window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
tl.seek(0);
</script>
</body></html>`;
    fs.writeFileSync(path.join(outDir, 'index.html'), html);
    fs.writeFileSync(path.join(outDir, 'hyperframes.json'), JSON.stringify({ paths: { blocks: 'compositions', components: 'compositions/components', assets: 'assets' } }));
    return { sfx: this.sfx, busy: this.busy.map(([a, b]) => [n(this.T0 + a), n(this.T0 + Math.min(b, this.dur))]) };
  }
}
