# Joins the chosen ElevenLabs takes (Joshua Horlortu voice) into one voiceover, trims each take's own head/tail
# silence, and writes the edit list (one span per section) for plan.py.
import json, subprocess, numpy as np
V = "/home/user/gcp/sp2/src/vo"; SR = 48000
PICK = {"s1a": 2, "s1b": 1, "s2a": 1, "s2b": 1, "s3a": 2, "s3b": 1, "s4a": 2, "s4b": 1, "s5a": 1, "s5b": 2, "s6a": 2, "s6b": 1, "s7": 3}
SECTIONS = [("cold-open", ["s1a"], "combo1"), ("welcome", ["s1b"], "pin:q1"), ("q1", ["s2a", "s2b"], "pin:q2"), ("q2", ["s3a", "s3b"], "pin:q3"),
            ("q3", ["s4a", "s4b"], "pin:q4"), ("q4", ["s5a", "s5b"], "pin:lesson"), ("lesson", ["s6a", "s6b"], "close"), ("close", ["s7"], "outro")]
PARA, SECT = 1.0, 2.5
def load(k):
    x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f"{V}/{k}_t{PICK[k]}.mp3", "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True).stdout, np.int16).astype(np.float32)
    e = np.sqrt(np.convolve(x ** 2, np.ones(480) / 480, "same")); thr = max(e) * 0.02
    on = np.where(e > thr)[0]; a, b = max(0, on[0] - 2400), min(len(x), on[-1] + 4800)
    return x[a:b]
out, edl, t = [], [], 0.5
out.append(np.zeros(int(0.5 * SR), np.float32))
for name, keys, gap in SECTIONS:
    s0 = t
    for i, k in enumerate(keys):
        a = load(k); out.append(a); t += len(a) / SR
        if i < len(keys) - 1: out.append(np.zeros(int(PARA * SR), np.float32)); t += PARA
    edl.append({"id": name, "vo_in": round(max(0.02, s0 - 0.45), 3), "vo_out": round(t + 0.05, 3), "gap_after": gap, "paras": keys})
    out.append(np.zeros(int(SECT * SR), np.float32)); t += SECT
pcm = np.clip(np.concatenate(out), -32768, 32767).astype(np.int16)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", "-c:a", "libmp3lame", "-b:a", "256k", "/home/user/gcp/sp2/src/vo.mp3"], input=pcm.tobytes(), check=True)
json.dump(edl, open("/home/user/gcp/sp2/work/edl.json", "w"), indent=1)
for e in edl: print(f"{e['id']:10} {e['vo_in']:7.2f} -> {e['vo_out']:7.2f} ({e['vo_out'] - e['vo_in']:5.1f}s) then {e['gap_after']}")
print("total", round(t, 2))
