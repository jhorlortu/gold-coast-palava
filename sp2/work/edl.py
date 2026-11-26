# Voiceover edit list for Special No. 2 (Rawlings), the client's own recording: which spans to keep.
# The spoken section labels and read-out timestamps ("1. Cold Open. 0-0-0", "Question 1 … 050", "2.15",
# "4 o'clock", "Five-twenty", "6. The Ledger. 6.45") are cut; boundaries snap to measured silence.
# The recording has no Twi proverb (only its English meaning) and no closing line.
import json, subprocess, numpy as np
VO = "/home/user/gcp/sp2/src/vo.mp3"
pcm = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", VO, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout, np.int16).astype(np.float32)
fr = 160
rms = np.sqrt(np.convolve(pcm ** 2, np.ones(fr) / fr, "same")[::fr] + 1e-9)
thr = np.percentile(rms, 20) * 2.5
def onset(a, b):
    """first speech onset after the last silence run (>=120 ms) in [a, b]"""
    i0, i1 = int(a * 100), int(b * 100); quiet = rms[i0:i1] < thr; best = None; run = 0
    for k, q in enumerate(quiet):
        run = run + 1 if q else 0
        if run >= 12: best = k
    return round((i0 + (best if best is not None else 0)) / 100 - 0.04, 3)
def offset(a, b):
    """end of speech: first silence run (>=120 ms) after a, before b"""
    i0, i1 = int(a * 100), int(b * 100); run = 0
    for k in range(i0, i1):
        run = run + 1 if rms[k] < thr else 0
        if run >= 12: return round((k - run + 1) / 100 + 0.06, 3)
    return b
def quietest(a, b):
    i0, i1 = int(a * 100), int(b * 100); return round((i0 + int(np.argmin(rms[i0:i1]))) / 100, 3)
dur = len(pcm) / 16000
seam = quietest(21.9, 22.5)                 # "…still dey like this?" | "My squad, how you dey?" (spoken straight on)
SPANS = [  # (id, vo_in, vo_out, gap after)
    ("cold-open", onset(3.0, 5.0), seam, "combo1"),
    ("welcome",   seam,             offset(53.15, 54.4), "pin:q1"),
    ("q1",        onset(61.0, 63.4), offset(141.65, 143.2), "pin:q2"),
    ("q2",        onset(149.6, 152.1), offset(240.75, 242.7), "pin:q3"),
    ("q3",        onset(249.2, 251.5), offset(334.2, 335.5), "pin:q4"),
    ("q4",        onset(342.5, 344.9), offset(446.2, 448.2), "pin:lesson"),
    ("lesson",    onset(451.4, 454.1), round(dur - 0.02, 3), "close"),
]
out = [{"id": n, "vo_in": a, "vo_out": b, "gap_after": g} for n, a, b, g in SPANS]
for e in out: print(f"{e['id']:10} {e['vo_in']:8.2f} -> {e['vo_out']:8.2f}  ({e['vo_out'] - e['vo_in']:6.1f}s)  then {e['gap_after']}")
json.dump(out, open("/home/user/gcp/sp2/work/edl.json", "w"), indent=1)
