# Reel audio + final mux. Voice pieces, SFX (from sfx.json) and, for the pilot, the soundtrack with an envelope;
# mixed in float, normalised to -14 LUFS / -1.5 dBTP, muxed with the rendered video as a social-ready H.264 MP4.
# usage: python3 -I mix.py <reel> <out.mp4>
import json, subprocess, sys, os
import numpy as np
R_ = sys.argv[1]; OUT = sys.argv[2]; D = f"/home/user/gcp/reels/{R_}"
SR = 48000
R = json.load(open(f"{D}/reel.json")); S = json.load(open(f"{D}/spec.json")); SFX = json.load(open(f"{D}/sfx.json"))
TOTAL = R["total"]; N = int(TOTAL * SR) + SR
mix = np.zeros((N, 2), np.float32)
_cache = {}
def load(f):
    if f not in _cache:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
        _cache[f] = np.frombuffer(raw, np.float32).reshape(-1, 2)
    return _cache[f]
def put(x, t):
    i = int(round(t * SR)); i0 = max(0, i); x = x[i0 - i:]; x = x[:max(0, N - i0)]; mix[i0:i0 + len(x)] += x
def fades(x, fi, fo, curve=True):
    n = len(x); a = np.ones(n, np.float32)
    ki, ko = min(n, int(fi * SR)), min(n, int(fo * SR))
    if ki > 0: a[:ki] = np.sin(np.linspace(0, np.pi / 2, ki)) ** 2
    if ko > 0: a[n - ko:] *= (np.cos(np.linspace(0, np.pi / 2, ko)) ** 2 if curve else np.linspace(1, 0, ko))
    return x * a[:, None]
db = lambda v: 10 ** (v / 20)

# voice
V = load(S["vo"])
for p in R["pieces"]:
    seg = V[int(p["vo_in"] * SR):int(p["vo_out"] * SR)]
    put(fades(seg, 0.012, 0.03), p["T0"])
# effects: quick in, slow S-curve out, whole bus 3 dB down
for c in SFX:
    x = load(c["file"]); L = min(c.get("len") or 1e9, len(x) / SR); x = x[:int(L * SR)]
    fi = c.get("fadein", min(0.04, L / 6)); fo = c.get("fade", max(min(0.45 * L, 1.8), min(0.4, L * 0.6)))
    put(fades(x, fi, fo) * db(c.get("db", -12) - 3), c["T"])
# music (pilot): enters on the brand reveal, ducks under the voice, rises for the end card
M = S.get("music")
if M:
    B = {b["id"]: b for b in R["beats"]}; P = {p["id"]: p for p in R["pieces"]}
    t0 = B["brand"]["T0"] + M.get("offset", -0.25); src = M["src_in"]
    x = load(M["file"])[int(src * SR):int((src + TOTAL - t0 + 1) * SR)]
    ts = np.arange(len(x)) / SR + t0
    env_pts = [(t0, -30), (t0 + 0.35, 0), (P["thisis"]["T0"] - 0.25, 0), (P["thisis"]["T0"] + 0.15, M["duck"]),
               (B["endcard"]["T0"] - 0.6, M["duck"]), (B["endcard"]["T0"] + 0.4, -2), (TOTAL - 1.3, -2), (TOTAL, -60)]
    g = np.interp(ts, [a for a, _ in env_pts], [v for _, v in env_pts]).astype(np.float32)
    put(x * (10 ** (g / 20))[:, None], t0)
mix = mix[:int(TOTAL * SR)]
raw = f"{D}/mix.raw.wav"
pk = float(np.max(np.abs(mix))); mix = mix / max(1.0, pk / 0.9)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s24le", raw], input=mix.tobytes(), check=True)
r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", raw, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True)
m = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
norm = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,alimiter=limit=0.79:level=false"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{D}/video.mp4", "-i", raw, "-map", "0:v", "-map", "1:a", "-af", norm, "-ar", "48000",
                "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-maxrate", "12M", "-bufsize", "24M", "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", "30",
                "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-t", f"{TOTAL:.3f}", OUT], check=True)
print("wrote", OUT, f"{TOTAL:.1f}s, {len(SFX)} sfx, measured {m['input_i']} LUFS")
