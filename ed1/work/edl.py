# Voiceover edit list for Edition 1: which spans of the recording to keep, and what sits in each gap.
# Spoken section numbers, titles and read-out timestamps are cut; boundaries snap to measured silence.
import json, subprocess, numpy as np
VO = "/home/user/gcp/ed1/src/vo.mp3"
pcm = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", VO, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout, np.int16).astype(np.float32)
fr = 160                                                    # 10 ms frames
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
# (keep_from_after, real_start_word_end, keep_until_word_end, next gap)
SPANS = [
    ("cold-open",  (2.74, 3.9),     33.5,   "combo1"),        # Before the light ... why is Ghana a powerful nation?
    ("nest",       (33.4, 34.2),    62.46,  "sting:Front Page"),
    ("front-page", (66.74, 69.5),   118.89, "head:LEAD STORY"),
    ("lead",       (122.97, 125.8), 431.83, "sting:The Wire"),
    ("wire",       (435.91, 438.7), 579.80, "sting:The Palava Desk"),
    ("palava",     (584.38, 586.0), 636.95, "sting:Then v Now"),
    ("then-now",   (642.23, 645.1), 717.02, "head:THE TEAM ASIDE"),
    ("team",       (720.60, 724.3), 780.17, "sting:Editor's Note"),
    ("editor",     (785.09, 788.1), 872.92, "head:LETTERS PAGE"),
    ("letters",    (878.21, 881.0), 897.13, "sting:Dispatch"),
    ("dispatch",   (901.77, 904.3), None,   "outro"),
]
dur = len(pcm) / 16000
out = []
for name, (a, b), until, gap in SPANS:
    s = onset(a, b)
    e = offset(until - 0.15, until + 1.5) if until else round(dur - 0.05, 3)
    out.append({"id": name, "vo_in": s, "vo_out": e, "gap_after": gap})
    print(f"{name:11} {s:8.2f} -> {e:8.2f}  ({e - s:6.1f}s)  then {gap}")
json.dump(out, open("/home/user/gcp/ed1/work/edl.json", "w"), indent=1)
