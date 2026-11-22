# Voiceover edit list for Gold Coast Palava Special No. 1 (Chris Hesse): which spans of the recording to keep.
# Spoken section labels ("Cold open", "Question one …", "The lesson", "Close") and read-out timestamps are cut;
# boundaries snap to measured silence. gap_after = what sits in the cut.
import json, subprocess, numpy as np
VO = "/home/user/gcp/sp1/src/vo.mp3"
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
# (id, (search window for the first word's onset), last kept word end, next gap)
SPANS = [
    ("cold-open", (2.10, 3.9),     27.88,  "combo1"),        # At eleven forty-seven … only now hearing his name.
    ("welcome",   (27.95, 28.9),   54.02,  "pin:q1"),        # My people, what dey go on? … with the eyes of Ghana.
    ("q1",        (61.30, 63.9),   173.36, "pin:q2"),        # Baaba, The Ascendant … choose it first.
    ("q2",        (179.10, 181.4), 283.17, "pin:q3"),        # Kwame, The Combative … a concession speech.
    ("q3",        (289.20, 291.4), 414.42, "pin:q4"),        # Aba came back … said to be underway.
    ("q4",        (420.70, 423.3), 453.51, "pin:lesson"),    # Then Baaba asked … nobody can tell.
    ("lesson",    (458.20, 459.9), 517.97, "close"),         # Close to two o'clock … you do not belong there.
    ("close",     (521.20, 523.7), None,   "outro"),         # This has been a Gold Coast Palava Special … Cheers.
]
dur = len(pcm) / 16000
out = []
for name, (a, b), until, gap in SPANS:
    s = onset(a, b)
    e = offset(until - 0.15, until + 1.2) if until else min(round(dur - 0.05, 3), offset(528.45, 529.5))
    out.append({"id": name, "vo_in": s, "vo_out": e, "gap_after": gap})
    print(f"{name:10} {s:8.2f} -> {e:8.2f}  ({e - s:6.1f}s)  then {gap}")
json.dump(out, open("/home/user/gcp/sp1/work/edl.json", "w"), indent=1)
