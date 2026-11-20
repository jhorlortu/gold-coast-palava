# "The Introduction" v2. Cut timeline:
#   C1  COMBO1 (pilot 0–14); "This is the Gold Coast Palava." spoken as the banner assembles on the downbeat
#   C2  "In our part of the world…" → "…light about everything else." (paper section, scene B onward), chopped exactly
#   C3  Dispatch: "This is the introduction to the Gold Coast Palava…" → COMBO2 (identical timing to the pilot)
# One continuous soundtrack: starts with COMBO1 and never restarts; under the narration it melts (4 s equal-power)
# into the soundtrack's closing passage, aligned so its ending lands on COMBO2 exactly as in the pilot.
import json, subprocess, os, glob
import numpy as np
W = "/home/user/gcp/intro/work"; R = "/home/user/gcp/build/renders"; OUT = "/home/user/gcp/project/out/intro"
SR = 48000
plan = json.load(open(f"{W}/timeline.json")); P = {p["id"]: p for p in plan["parts"]}
PAPER0 = P["paper"]["T0"]; DISP0 = P["dispatch"]["T0"]; PTOTAL = plan["total"]
B_IN, B_OUT = 5.63, 77.47                       # paper-local: scene B ("In our part of the world") .. just after "else."
MAST_AT = 7.62                                  # cut time for the masthead line's piece start ("This" lands ~7.9)
C1, C2, C3 = 14.0, B_OUT - B_IN, PTOTAL - DISP0
C2_0, C3_0 = C1, C1 + C2; TOTAL = C1 + C2 + C3
def to_cut(Tp):                                 # pilot global time -> cut time (None if not in the cut)
    if Tp < C1: return Tp
    if PAPER0 + B_IN <= Tp < PAPER0 + B_OUT: return C2_0 + (Tp - PAPER0 - B_IN)
    if Tp >= DISP0: return C3_0 + (Tp - DISP0)
    return None
run = lambda *a: subprocess.run(["ffmpeg", "-hide_banner", "-y", "-loglevel", "error", *a], check=True)
# ---- picture
lst = []
for i, (sec, a, d) in enumerate([("intro", 0.0, C1), ("paper", B_IN, C2), ("dispatch", 0.0, C3)]):
    dst = f"{W}/d{i}.mp4"
    run("-ss", f"{a:.3f}", "-i", f"{R}/{sec}.mp4", "-an", "-vf", "fps=30,scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p,tpad=stop_mode=clone:stop_duration=1",
        "-frames:v", str(round(d * 30)), "-c:v", "libx264", "-preset", "veryfast", "-crf", "14", dst); lst.append(f"file '{dst}'")
open(f"{W}/d.txt", "w").write("\n".join(lst)); run("-f", "concat", "-safe", "0", "-i", f"{W}/d.txt", "-c", "copy", f"{W}/cut2_picture.mp4")
# ---- audio
N = int(TOTAL * SR) + SR; mix = np.zeros((N, 2), np.float32); cache = {}
def load(f):
    if f not in cache: cache[f] = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32).reshape(-1, 2)
    return cache[f]
def put(x, t, buf=mix):
    i = int(round(t * SR)); x = x[max(0, -i):]; i = max(0, i); x = x[:max(0, len(buf) - i)]; buf[i:i + len(x)] += x
def fades(x, fi, fo):
    n = len(x); a = np.ones(n, np.float32); ki, ko = min(n, int(fi * SR)), min(n, int(fo * SR))
    if ki: a[:ki] = np.sin(np.linspace(0, np.pi / 2, ki)) ** 2
    if ko: a[n - ko:] *= np.cos(np.linspace(0, np.pi / 2, ko)) ** 2
    return x * a[:, None]
db = lambda v: 10 ** (v / 20)
V = load(f"{W}/vo_intro.wav")
for p in [q for q in plan["parts"] if q["kind"] == "vo"]:
    if p["id"] == "paper": t0 = MAST_AT; vin, vout = p["vo_in"], p["vo_out"]
    else:
        t0 = to_cut(p["T0"]); vin, vout = p["vo_in"], p["vo_out"]
        if t0 is None: continue
        if p["id"].startswith("paper") and p["T0"] + p["dur"] > PAPER0 + B_OUT: vout = vin + (PAPER0 + B_OUT - p["T0"])
    put(fades(V[int(vin * SR):int(vout * SR)], 0.012, 0.04) * 2.0, t0)            # voice +6 dB, as in the pilot mix
cues = []
for sec in ("intro", "paper", "dispatch"): cues += json.load(open(f"/home/user/gcp/build/sfx/{sec}.json"))
for c in cues:
    t = to_cut(c["T"])
    if t is None or (c["T"] >= PAPER0 + B_OUT - 0.05 and c["T"] < DISP0): continue
    x = load(c["file"]); L = min(c.get("len") or 1e9, len(x) / SR); x = x[:int(L * SR)]
    fi = c.get("fadein", min(0.04, L / 6)); fo = c.get("fade", max(min(0.45 * L, 1.8), min(0.4, L * 0.6)))
    if t >= C3_0 - 0.01 or t < C1 or t + L <= C3_0: put(fades(x, fi, fo) * db(c.get("db", -12) - 3), t)
    else: put(fades(x[:int((C3_0 - t) * SR)], fi, 0.05) * db(c.get("db", -12) - 3), t)     # nothing from the paper spills over the cut
# music: A from the soundtrack's start, B aligned to end exactly as the pilot's ending (COMBO2)
ST = load("/home/user/gcp/project/media/music/soundtrack.wav")
seg2 = plan["soundtrack"]["segments"][1]; src_end = seg2["src_out"] - (seg2["T0"] + (seg2["src_out"] - seg2["src_in"]) - PTOTAL)
XF0, XF1 = 52.0, 56.0                                  # the melt, under narration
tt = np.arange(int(TOTAL * SR)) / SR
srcA = tt; srcB = src_end - (TOTAL - tt)
A = ST[np.clip((srcA * SR).astype(int), 0, len(ST) - 1)]; Bm = ST[np.clip((srcB * SR).astype(int), 0, len(ST) - 1)]
w = np.clip((tt - XF0) / (XF1 - XF0), 0, 1); ga, gb = np.cos(w * np.pi / 2), np.sin(w * np.pi / 2)
music = A * ga[:, None] + Bm * gb[:, None]
env_p = [(t, d) for t, d in plan["soundtrack"]["envelope_db"] if t >= DISP0 + 10]          # pilot ending envelope (COMBO2)
env = [(0, 0), (7.45, 0), (7.85, -13), (10.2, -13), (10.7, -5), (C1 - 0.5, -5), (C1 + 0.15, -21), (C3_0 - 1.0, -21), (C3_0 + 0.5, -24)] + [(C3_0 + (t - DISP0), d) for t, d in env_p]
g = np.interp(tt, [a for a, _ in env], [d for _, d in env]).astype(np.float32)
mix[:len(music)] += music * (10 ** (g / 20))[:, None]
mix = mix[:int(TOTAL * SR)]; mix /= max(1.0, float(np.abs(mix).max()) / 0.9)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s24le", f"{W}/cut2_audio.wav"], input=mix.tobytes(), check=True)
# ---- subtitles from the full-timeline ASS
ts = lambda s: (lambda h, m, x: int(h) * 3600 + int(m) * 60 + float(x))(*s.split(":"))
fmt = lambda t: f"{int(t // 3600)}:{int(t % 3600 // 60):02d}:{t % 60:05.2f}"
maps = [(PAPER0, PAPER0 + 3.0, MAST_AT - PAPER0), (PAPER0 + B_IN, PAPER0 + B_OUT, C2_0 - PAPER0 - B_IN), (DISP0, PTOTAL, C3_0 - DISP0)]
out = []
for ln in open(f"{W}/subs.ass").read().split("\n"):
    if not ln.startswith("Dialogue:"): out.append(ln); continue
    f = ln.split(",", 9); s0, s1 = ts(f[1]), ts(f[2])
    for a, b, o in maps:
        if a - 0.01 <= s0 < b: f[1], f[2] = fmt(s0 + o), fmt(min(s1, b) + o); out.append(",".join(f)); break
open(f"{W}/cut2_subs.ass", "w").write("\n".join(out))
# ---- final
os.makedirs(OUT, exist_ok=True); name = f"{OUT}/GoldCoastPalava_TheIntroduction_v2_1080.mp4"
r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", f"{W}/cut2_audio.wav", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True)
m = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
norm = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,alimiter=limit=0.7:level=false"
run("-i", f"{W}/cut2_picture.mp4", "-i", f"{W}/cut2_audio.wav", "-vf", f"ass={W}/cut2_subs.ass:fontsdir=/home/user/gcp/src/INTRO/Font", "-af", norm, "-ar", "48000",
    "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-profile:v", "high", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", "-t", f"{TOTAL:.3f}", name)
print("wrote", name, f"{TOTAL:.2f}s; music melt {XF0}-{XF1}s; join at {C3_0:.2f}s")
