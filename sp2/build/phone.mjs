// iPhone 17 Pro Max (cosmic orange) running WhatsApp in dark mode: the GCP Team group chat, seen from Kofi's end.
// The phone is one clip per section that sits above the section's scenes (left two-thirds stay free for pictures).
// Messages pop in on springs as the narrator reaches them: the new row grows (pushing older messages up) while the
// bubble springs out of its corner; typing… bubbles and the header's "X is typing…" precede key questions; the
// status-bar clock follows the chat's timestamps. Every pop has its own WhatsApp-style sound.
import path from 'node:path';
import { SP } from '/home/user/gcp/build/lib.mjs';

const SFX = '/home/user/gcp/sp2/media/sfx';
const n3 = (v) => +(+v).toFixed(3);
const spr = (k) => ({ duration: SP[k], ease: `sp-${k}` });
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const PHONE = { x: 1330, y: 30, w: 500, h: 1030 };
const COLOR = { Aba: '#FFC86B', Baaba: '#4FD1A5', Kwame: '#FF7C98', Amo: '#C39BFF' };
export const SYMBOL_SVG = `<svg viewBox="-10 -10 220 220" width="100%" height="100%"><path d="M100 172C38 132 24 76 64 56c22-10 36 4 36 18 0-14 14-28 36-18 40 20 26 76-36 116z" fill="#FBF6EA" stroke="#1A1612" stroke-width="10" stroke-linejoin="round"/><path d="M100 74v90M58 84h32M60 100h30M68 116h22M80 132h10M110 84h32M110 100h30M110 116h22M110 132h10" stroke="#1A1612" stroke-width="4.5" stroke-linecap="round" fill="none"/><path d="M100 22l12 14-12 14-12-14z" fill="#C9962F" stroke="#1A1612" stroke-width="4"/></svg>`;

export const PHONE_CSS = `
.ph { position:absolute; width:${PHONE.w}px; height:${PHONE.h}px; font-family:'Inter','Noto Color Emoji',sans-serif; }
.ph-body { position:absolute; inset:0; border-radius:78px; background:linear-gradient(135deg,#F0975A 0%,#D9692D 38%,#B9521C 70%,#E2803F 100%); box-shadow:0 50px 90px -30px rgba(40,20,5,.65), 0 18px 30px -12px rgba(40,20,5,.4), inset 0 0 0 2px rgba(255,220,190,.55); }
.ph-btn { position:absolute; width:6px; border-radius:3px; background:linear-gradient(90deg,#9C4515,#E58748); }
.ph-bez { position:absolute; inset:10px; border-radius:68px; background:#050505; }
.ph-scr { position:absolute; inset:19px; border-radius:60px; overflow:hidden; background:#0B141A; color:#E9EDEF; }
.ph-island { position:absolute; left:50%; top:13px; width:128px; height:38px; margin-left:-64px; border-radius:20px; background:#000; z-index:9; }
.ph-status { position:absolute; left:0; right:0; top:0; height:58px; z-index:8; font-weight:600; font-size:19px; color:#fff; }
.ph-status .clk { position:absolute; left:46px; top:19px; }
.ph-status .clk span { position:absolute; left:0; top:0; white-space:nowrap; opacity:0; }
.ph-status .ico { position:absolute; right:34px; top:21px; display:flex; gap:7px; align-items:center; }
.wa-head { position:absolute; left:0; right:0; top:58px; height:76px; background:#1F2C34; display:flex; align-items:center; gap:12px; padding:0 16px 0 10px; z-index:6; }
.wa-av { width:50px; height:50px; border-radius:50%; background:#F3EBD7; padding:7px; flex:none; }
.wa-title { flex:1; min-width:0; }
.wa-title b { display:block; font-size:21px; font-weight:600; color:#fff; white-space:nowrap; }
.wa-sub { position:relative; height:20px; font-size:15px; color:#8696A0; }
.wa-sub span { position:absolute; left:0; top:1px; white-space:nowrap; }
.wa-sub .ty { color:#00A884; opacity:0; }
.wa-pin { position:absolute; left:0; right:0; top:134px; height:62px; background:#18242B; border-bottom:1px solid #26353D; display:flex; align-items:center; gap:12px; padding:0 18px; z-index:6; }
.wa-pin small { display:block; font-size:13px; color:#8696A0; }
.wa-pin div { font-size:16.5px; color:#E9EDEF; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:370px; }
.wa-chat { position:absolute; left:0; right:0; bottom:92px; overflow:hidden; background-color:#0B141A; background-image:radial-gradient(rgba(255,255,255,.035) 1.4px, transparent 1.6px); background-size:22px 22px; }
.wa-col { position:absolute; left:0; right:0; bottom:10px; display:flex; flex-direction:column; }
.wa-row { overflow:hidden; display:flex; padding:0 12px; flex:none; }
.wa-row.out { justify-content:flex-end; }
.wa-row.mid { justify-content:center; }
.wa-b { position:relative; max-width:82%; margin:4px 0 5px; padding:8px 12px 7px; border-radius:16px; background:#202C33; font-size:23px; line-height:1.3; box-shadow:0 1px 1px rgba(0,0,0,.25); transform-origin:0% 100%; }
.wa-row.in .wa-b { border-top-left-radius:5px; }
.wa-row.out .wa-b { background:#005C4B; border-top-right-radius:5px; transform-origin:100% 100%; }
.wa-b .who { display:block; font-size:17px; font-weight:600; margin-bottom:2px; }
.wa-b .tm { display:block; text-align:right; font-size:14px; color:rgba(233,237,239,.6); margin-top:2px; white-space:nowrap; }
.wa-b .tm i { font-style:normal; position:relative; display:inline-block; width:22px; height:14px; margin-left:4px; vertical-align:-1px; }
.wa-b .tm i svg { position:absolute; inset:0; }
.wa-b.big { background:none; box-shadow:none; padding:2px 4px; }
.wa-b.big .txt { font-size:60px; line-height:1.1; }
.wa-day { margin:10px 0 8px; padding:5px 14px; border-radius:9px; background:#1D282F; font-size:15px; color:#8696A0; transform-origin:50% 50%; }
.wa-dots { display:flex; gap:6px; padding:8px 4px 6px; }
.wa-dots span { width:11px; height:11px; border-radius:50%; background:#8696A0; display:block; }
.wa-in { position:absolute; left:0; right:0; bottom:0; height:92px; background:#0B141A; display:flex; align-items:flex-start; gap:10px; padding:10px 12px 0; z-index:6; }
.wa-field { flex:1; height:50px; border-radius:25px; background:#1F2C34; display:flex; align-items:center; gap:12px; padding:0 16px; color:#8696A0; font-size:19px; }
.wa-mic { width:50px; height:50px; border-radius:50%; background:#00A884; display:flex; align-items:center; justify-content:center; flex:none; }
.ph-glass { position:absolute; inset:0; border-radius:60px; background:linear-gradient(115deg, rgba(255,255,255,.07) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 100%); pointer-events:none; z-index:20; }
.ph-home { position:absolute; left:50%; bottom:9px; width:150px; height:5px; margin-left:-75px; border-radius:3px; background:rgba(255,255,255,.75); z-index:21; }
`;

const ICONS = `<svg width="20" height="13" viewBox="0 0 20 13"><rect x="0" y="9" width="3.4" height="4" rx="1" fill="#fff"/><rect x="5.5" y="6" width="3.4" height="7" rx="1" fill="#fff"/><rect x="11" y="3" width="3.4" height="10" rx="1" fill="#fff"/><rect x="16.5" y="0" width="3.4" height="13" rx="1" fill="#fff"/></svg>
  <svg width="18" height="13" viewBox="0 0 18 13"><path d="M9 12.5l2.6-2.9a3.6 3.6 0 0 0-5.2 0zM4.3 7.4a6.6 6.6 0 0 1 9.4 0l1.6-1.7a9 9 0 0 0-12.6 0zM1.1 4.1a11.2 11.2 0 0 1 15.8 0L18.4 2.5a13.5 13.5 0 0 0-18.8 0z" fill="#fff"/></svg>
  <svg width="30" height="14" viewBox="0 0 30 14"><rect x="0.5" y="0.5" width="25" height="13" rx="4" fill="none" stroke="rgba(255,255,255,.5)"/><rect x="2.5" y="2.5" width="19" height="9" rx="2.4" fill="#fff"/><rect x="27" y="4.5" width="2" height="5" rx="1" fill="rgba(255,255,255,.5)"/></svg>`;
const TICKS = (id) => `<svg viewBox="0 0 22 14" width="22" height="14"><path id="${id}" d="M1.5 7.5l3.4 3.4L11.6 3M8.8 10.2l1.2 1.2L17.6 3" fill="none" stroke="#8696A0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// rough height of a message row (layout px) — used as the spring target for the row's growth (overshoot is harmless)
const estH = (m) => {
  if (m.big) return 110;
  const lines = m.text.split('\n').reduce((a, l) => a + Math.max(1, Math.ceil((l.length + 2) / 25)), 0);
  return Math.round((m.who && m.who !== 'Kofi' ? 23 : 0) + lines * 30 + 24 + 26);
};

export class Phone {
  /**
   * p: the Part; pinned: pinned-message text (or null); prior: messages already in the chat (shown from the start);
   * enter / exit: part-local times the phone springs in from below / drops away; x, y: position (defaults right third).
   */
  constructor(p, { pinned = null, prior = [], enter = 0, exit = null, x = PHONE.x, y = PHONE.y, clock0 = '11:47', start = 0, end = null, z = 700, scale = 1, rot = -1.2 } = {}) {
    Object.assign(this, { p, pinned, prior, enter, exit, x, y, start, end: end ?? p.dur, z, scale, rot });
    this.id = p.id_('ph'); this.items = []; this.clocks = [[start, clock0]]; this.typers = []; this.extraTl = [];
    if (!p.css.includes(PHONE_CSS)) p.css.push(PHONE_CSS);
  }
  sound(file, at, db = -14, len) { this.p.sfx.push({ file: path.isAbsolute(file) ? file : path.join(SFX, file), T: n3(this.p.T0 + at), db, ...(len ? { len } : {}) }); }
  clock(at, t) { this.clocks.push([at, t]); }
  /** "X is typing…": header subtitle + a typing bubble from t0 until the message lands at t1 */
  typing(who, t0, t1) { this.typers.push({ who, t0, t1 }); this.items.push({ kind: 'typing', who, at: t0, until: t1 }); this.p.ev(t0); }
  divider(text, at) { this.items.push({ kind: 'day', text, at }); this.p.ev(at); }
  msg(m) { this.items.push({ kind: 'msg', ...m }); if (m.time) this.clock(m.at, m.time.replace(/\s*[ap]m$/i, '')); this.p.ev(m.at); return this; }
  /** push in on the phone ("up close"): it grows and slides toward the centre, then settles back */
  focus(at, hold = 3.0, { s = 1.1, dx = -120, dy = 40 } = {}) {
    this.extraTl.push(`tl.to("#${this.id}-z", ${JSON.stringify({ scale: s, x: dx, y: dy, ...spr('default'), immediateRender: false })}, ${n3(at)});`);
    this.extraTl.push(`tl.to("#${this.id}-z", ${JSON.stringify({ scale: 1, x: 0, y: 0, ...spr('default'), immediateRender: false })}, ${n3(at + hold)});`);
    this.p.ev(at); this.p.ev(at + hold);
    this.sound('/home/user/gcp/project/media/sfx/whoosh-2.mp3', at - 0.05, -24);
  }
  // ---------------------------------------------------------------------------
  rowHtml(m, rid, shown) {
    const st = shown ? '' : 'max-height:0px;';
    if (m.kind === 'day') return `<div id="${rid}" class="wa-row mid" style="${st}"><div id="${rid}-b" class="wa-day">${esc(m.text)}</div></div>`;
    if (m.kind === 'typing') return `<div id="${rid}" class="wa-row in" style="${st}"><div id="${rid}-b" class="wa-b"><div class="wa-dots"><span id="${rid}-d0"></span><span id="${rid}-d1"></span><span id="${rid}-d2"></span></div></div></div>`;
    const out = m.who === 'Kofi';
    const name = !out && m.who ? `<span class="who" style="color:${COLOR[m.who] || '#53BDEB'}">${esc(m.who)}</span>` : '';
    const ticks = out ? `<i>${TICKS(rid + '-tk')}</i>` : '';
    return `<div id="${rid}" class="wa-row ${out ? 'out' : 'in'}" style="${st}"><div id="${rid}-b" class="wa-b${m.big ? ' big' : ''}">${name}<span class="txt">${esc(m.text).replace(/\n/g, '<br>')}</span><span class="tm">${esc(m.time || '')}${ticks}</span></div></div>`;
  }
  build() {
    const p = this.p, id = this.id, tl = [];
    const rows = [];
    this.items.sort((a, b) => a.at - b.at);
    for (const m of this.prior) rows.push(this.rowHtml({ kind: m.kind || 'msg', ...m }, p.id_('wr'), true));
    let inN = 0;
    for (const m of this.items) {
      const rid = p.id_('wr');
      rows.push(this.rowHtml(m, rid, false));
      const H = m.kind === 'day' ? 60 : m.kind === 'typing' ? 72 : estH(m);
      tl.push(`tl.fromTo("#${rid}", {maxHeight:0}, ${JSON.stringify({ maxHeight: H, ...spr('default') })}, ${n3(m.at)});`);
      tl.push(`tl.fromTo("#${rid}-b", {opacity:0}, {opacity:1, duration:0.1, ease:"none"}, ${n3(m.at)});`);
      tl.push(`tl.fromTo("#${rid}-b", {scale:0.45}, ${JSON.stringify({ scale: 1, ...spr('snappy') })}, ${n3(m.at)});`);
      if (m.kind === 'typing') {
        for (let k = 0; k < 3; k++) {
          const reps = Math.max(1, Math.floor((m.until - m.at) / 0.36));
          tl.push(`tl.fromTo("#${rid}-d${k}", {y:0, opacity:0.45}, {y:-6, opacity:1, duration:0.18, ease:"sine.inOut", yoyo:true, repeat:${reps * 2 - 1}}, ${n3(m.at + 0.1 + k * 0.12)});`);
        }
        // the typing bubble folds away as the message lands
        tl.push(`tl.to("#${rid}", {maxHeight:0, duration:0.16, ease:"power2.in", immediateRender:false}, ${n3(m.until - 0.02)});`);
        tl.push(`tl.to("#${rid}-b", {scale:0.5, opacity:0, duration:0.14, ease:"power2.in", immediateRender:false}, ${n3(m.until - 0.02)});`);
        this.sound('wa-typing.wav', m.at + 0.05, -24, Math.min(1.6, m.until - m.at));
      } else if (m.kind === 'day') {
        this.sound('/home/user/gcp/project/media/sfx/syn-tick.wav', m.at, -24);
      } else if (m.who === 'Kofi') {
        this.sound('wa-out.wav', m.at - 0.05, -11);
        tl.push(`tl.set("#${rid}-tk", {attr:{stroke:"#53BDEB"}}, ${n3(m.at + 1.3)});`);
        this.sound('ticks.wav', m.at + 1.3, -22);
      } else {
        this.sound(inN++ % 2 ? 'wa-in2.wav' : 'wa-in.wav', m.at, -10);
      }
    }
    // header subtitle: "Aba, Amo, Baaba, Kwame, You" <-> "X is typing…"
    const subs = [`<span id="${id}-sub0">Aba, Amo, Baaba, Kwame, You</span>`];
    this.typers.forEach((t, k) => {
      subs.push(`<span id="${id}-ty${k}" class="ty">${esc(t.who)} is typing…</span>`);
      tl.push(`tl.set("#${id}-ty${k}", {opacity:1}, ${n3(t.t0)});`, `tl.set("#${id}-sub0", {opacity:0}, ${n3(t.t0)});`);
      tl.push(`tl.set("#${id}-ty${k}", {opacity:0}, ${n3(t.t1)});`, `tl.set("#${id}-sub0", {opacity:1}, ${n3(t.t1)});`);
    });
    // status-bar clock
    const clocks = this.clocks.sort((a, b) => a[0] - b[0]);
    const clk = clocks.map(([at, t], k) => {
      tl.push(`tl.set("#${id}-c${k}", {opacity:1}, ${n3(Math.max(0, at))});`);
      if (k + 1 < clocks.length) tl.push(`tl.set("#${id}-c${k}", {opacity:0}, ${n3(Math.max(0, clocks[k + 1][0]))});`);
      return `<span id="${id}-c${k}">${esc(t)}</span>`;
    }).join('');
    const pinBar = this.pinned ? `<div class="wa-pin"><svg width="20" height="20" viewBox="0 0 24 24"><path d="M16 3l5 5-3 1-4 4 1 5-2 2-4-4-5 5-1-1 5-5-4-4 2-2 5 1 4-4z" fill="#8696A0"/></svg><div><small>Pinned message</small><div>${esc(this.pinned)}</div></div></div>` : '';
    const chatTop = this.pinned ? 196 : 134;
    const html = `<div id="${id}" class="clip" data-start="${n3(this.start)}" data-duration="${n3(this.end - this.start)}" data-track-index="7" style="position:absolute;left:${this.x}px;top:${this.y}px;width:${PHONE.w}px;height:${PHONE.h}px;z-index:${this.z}">
  <div id="${id}-f" class="ph" style="left:0;top:0;transform-origin:50% 60%"><div id="${id}-z" class="ph" style="left:0;top:0;transform-origin:50% 50%">
    <div class="ph-btn" style="left:-4px;top:200px;height:44px"></div><div class="ph-btn" style="left:-4px;top:280px;height:80px"></div><div class="ph-btn" style="left:-4px;top:380px;height:80px"></div><div class="ph-btn" style="right:-4px;top:300px;height:120px"></div>
    <div class="ph-body"></div><div class="ph-bez"></div>
    <div class="ph-scr">
      <div class="ph-island"></div>
      <div class="ph-status"><div class="clk">${clk}</div><div class="ico">${ICONS}</div></div>
      <div class="wa-head"><svg width="14" height="24" viewBox="0 0 14 24"><path d="M12 2L3 12l9 10" fill="none" stroke="#E9EDEF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <div class="wa-av">${SYMBOL_SVG}</div>
        <div class="wa-title"><b>GCP Team 🗞️</b><div class="wa-sub">${subs.join('')}</div></div>
        <svg width="28" height="20" viewBox="0 0 28 20"><rect x="1.5" y="3" width="17" height="14" rx="3" fill="none" stroke="#E9EDEF" stroke-width="2"/><path d="M19 8l7-4v12l-7-4z" fill="none" stroke="#E9EDEF" stroke-width="2" stroke-linejoin="round"/></svg>
        <svg width="24" height="24" viewBox="0 0 24 24" style="margin-left:14px"><path d="M6.6 2.5l3 .4 1.3 4.3-2.2 1.6a12 12 0 0 0 6.5 6.5l1.6-2.2 4.3 1.3.4 3c0 1.2-1 2.1-2.2 2.1C10.4 19.4 4.6 13.6 4.5 4.7c0-1.2.9-2.2 2.1-2.2z" fill="none" stroke="#E9EDEF" stroke-width="1.9" stroke-linejoin="round"/></svg>
        <svg width="6" height="24" viewBox="0 0 6 24" style="margin-left:12px"><circle cx="3" cy="5" r="2.3" fill="#E9EDEF"/><circle cx="3" cy="12" r="2.3" fill="#E9EDEF"/><circle cx="3" cy="19" r="2.3" fill="#E9EDEF"/></svg></div>
      ${pinBar}
      <div class="wa-chat" style="top:${chatTop}px"><div class="wa-col">${rows.join('')}</div></div>
      <div class="wa-in"><div class="wa-field"><svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="none" stroke="#8696A0" stroke-width="1.8"/><circle cx="8.6" cy="10" r="1.3" fill="#8696A0"/><circle cx="15.4" cy="10" r="1.3" fill="#8696A0"/><path d="M8 14.2c2.2 2.4 5.8 2.4 8 0" fill="none" stroke="#8696A0" stroke-width="1.8" stroke-linecap="round"/></svg>Message<span style="flex:1"></span><svg width="22" height="22" viewBox="0 0 24 24"><path d="M16.5 6.5l-8 8a2 2 0 0 0 2.8 2.8l8.5-8.5a3.8 3.8 0 0 0-5.4-5.4L5.6 12.2a5.6 5.6 0 0 0 7.9 7.9l6.5-6.5" fill="none" stroke="#8696A0" stroke-width="1.8" stroke-linecap="round"/></svg></div>
        <div class="wa-mic"><svg width="18" height="24" viewBox="0 0 18 24"><rect x="5" y="1" width="8" height="14" rx="4" fill="#0B141A"/><path d="M2 11a7 7 0 0 0 14 0M9 18v4" fill="none" stroke="#0B141A" stroke-width="2.2" stroke-linecap="round"/></svg></div></div>
      <div class="ph-glass"></div><div class="ph-home"></div>
    </div></div></div></div>`;
    // entrance / exit / gentle hand-held float
    const f = `#${id}-f`;
    tl.unshift(`tl.set("${f}", {rotation:${this.rot}, scale:${this.scale}}, 0);`);
    if (this.enter != null && this.enter > this.start - 0.01) {
      tl.push(`tl.fromTo("${f}", {y:1250, rotation:${this.rot + 8}}, ${JSON.stringify({ y: 0, rotation: this.rot, ...spr('heavy') })}, ${n3(this.enter)});`);
      this.sound('/home/user/gcp/project/media/sfx/whoosh-1.mp3', this.enter - 0.05, -16);
      p.ev(this.enter);
    }
    const t0 = (this.enter ?? this.start) + 1.4, t1 = (this.exit ?? this.end) - 0.2;
    if (t1 - t0 > 3) { const reps = Math.floor((t1 - t0) / 3.2); tl.push(`tl.to("${f}", {yPercent:-0.7, rotation:${this.rot + 0.6}, duration:3.2, ease:"sine.inOut", yoyo:true, repeat:${reps - 1}, immediateRender:false}, ${n3(t0)});`); }
    if (this.exit != null) {
      tl.push(`tl.to("${f}", ${JSON.stringify({ y: 1300, rotation: this.rot - 8, duration: 0.6, ease: 'power3.in', immediateRender: false })}, ${n3(this.exit)});`);
      this.sound('/home/user/gcp/project/media/sfx/whoosh-2.mp3', this.exit, -16); p.ev(this.exit);
    }
    p.html.push(html); p.tl.push(...tl, ...this.extraTl);
    (p.phoneWin ??= []).push([n3(p.T0 + (this.enter ?? this.start)), n3(p.T0 + (this.exit ?? this.end))]);
    return id;
  }
}
