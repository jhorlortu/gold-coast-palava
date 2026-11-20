# Builds "This is the introduction to the Gold Coast Palava." from Kofi's own recordings (no TTS).
import subprocess, numpy as np, json, sys
SR = 48000
PV = "/home/user/gcp/src/INTRO/Script/INTRO Voice Script.mp3"; EV = "/home/user/gcp/ed1/src/vo.mp3"
def load(f):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).copy()
P, E = load(PV), load(EV)
def quiet(x, a, b):
    i0, i1 = int(a * SR), int(b * SR); n = int(0.006 * SR); best, bt = 1e9, a
    for i in range(i0, i1 - n, int(0.001 * SR)):
        e = float(np.mean(x[i:i + n] ** 2))
        if e < best: best, bt = e, (i + n / 2) / SR
    return bt
def seg(x, a, b): return x[int(a * SR):int(b * SR)].copy()
def rms(v): return float(np.sqrt(np.mean(v ** 2)) + 1e-9)
def join(parts, xf=0.008):
    n = int(xf * SR); out = parts[0]
    for q in parts[1:]:
        r = np.linspace(0, 1, n, dtype=np.float32)
        out = np.concatenate([out[:-n], out[-n:] * (1 - r) + q[:n] * r, q[n:]])
    return out
a_head = quiet(P, 427.04, 427.12)                       # end of "the", before "headline"
b_gold = quiet(P, 428.18, 428.28)                       # just before "Gold"
lead = seg(P, 426.45, a_head)                            # "This is the"
intro = seg(P, 328.335, 328.578)                         # "intro" from "introduce"
dd = seg(P, 328.578, 328.636)                            # the d (closure + burst)
uction = seg(E, 254.088, 254.48)      # "-uction" from "construction"
uction *= rms(seg(P, 328.39, 328.45)) / rms(seg(E, 254.09, 254.13))   # match the vowel level to Kofi's pilot take
to_the = seg(P, 439.335, quiet(P, 439.56, 439.62))   # "to the" from "and to the world"
tail = seg(P, b_gold, 429.335)                           # "Gold Coast Palava."
gap = np.zeros(int(0.02 * SR), np.float32)
new = join([lead, intro, dd, uction, gap, to_the, tail])
orig_len = int((429.335 - 426.45) * SR)
print(f"cut at {a_head:.3f}/{b_gold:.3f}; new {len(new)/SR:.3f}s vs original {orig_len/SR:.3f}s")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-c:a", "pcm_s24le", "line.wav"], input=new.astype(np.float32).tobytes(), check=True)
json.dump({"a_head": a_head, "b_gold": b_gold, "len": len(new) / SR, "lens": {k: len(v) / SR for k, v in [("lead", lead), ("intro", intro), ("dd", dd), ("uction", uction), ("to_the", to_the), ("tail", tail)]}}, open("splice.json", "w"), indent=1)
