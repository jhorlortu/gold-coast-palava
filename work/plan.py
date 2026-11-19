# Master timeline for the Gold Coast Palava headline video.
# Output time T (seconds) <- voiceover pieces, sting gaps, pauses; plus the soundtrack plan.
import json
VO_CUTS = [0, 37.33, 108.54, 185.23, 188.43, 243.22, 327.40, 398.87, 409.12, 426.45, 440.19]
NAMES   = ["cold-open", "paper", "lead", "wire-line", "wire", "walk-away", "nest", "editors-note", "letters", "dispatch"]
STING = {  # sting played in a gap BEFORE this VO piece
  "lead": ("Front Page", 5.04), "wire": ("The Wire", 6.552), "walk-away": ("Then v Now", 6.552),
  "nest": ("The Palava Desk", 6.024), "editors-note": ("Editor's Note", 5.04), "dispatch": ("Dispatch", 7.032)}
PAUSE_BEFORE = {"paper": 1.4, "wire-line": 0.5, "letters": 1.2}      # cinematic beats without stings
PRE, POST = 0.8, 0.9          # silence before a sting / after it before the voice resumes
INTRO = 14.0                  # soundtrack identity build + banner hold before the first word
OUTRO = 17.0                  # banner returns and holds, soundtrack swell + fade after the last word

# Sentence pauses: split each VO part at sentence ends, cutting at the quietest 20 ms in the gap.
import subprocess, numpy as np
VOF = "/home/user/gcp/src/INTRO/Script/INTRO Voice Script.mp3"
pcm = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", VOF, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout, np.int16).astype(np.float32)
def quiet(a, b):
    i0, i1 = int(a * 16000), int(b * 16000); best, bt = 1e18, (a + b) / 2
    for i in range(i0, max(i0 + 1, i1 - 320), 80):
        e = float(np.mean(pcm[i:i + 320] ** 2))
        if e < best: best, bt = e, (i + 160) / 16000
    return round(bt, 3)
TR = json.load(open("transcript.json")); WD = [w for sg in TR["segments"] for w in sg["words"]]
SENT_PAUSE, PARA_PAUSE = 0.8, 1.2
SPECIAL = {"palava.": 3.0}            # "This is the Gold Coast Palava." -> 3 s before "In our part of the world"
splits = []                            # (vo_time, pause)
for a, b in zip(WD, WD[1:]):
    if a["w"].strip()[-1:] not in ".?!": continue
    if any(abs(a["e"] - c) < 1.0 or abs(b["s"] - c) < 1.0 for c in VO_CUTS): continue
    g = b["s"] - a["e"]
    t = quiet(a["e"] - 0.06, max(b["s"], a["e"] + 0.2) + 0.04)
    pause = SPECIAL.get(a["w"].strip().lower(), PARA_PAUSE if g >= 0.5 else SENT_PAUSE)
    if a["w"].strip().lower() == "palava." and not (37 < a["e"] < 60): pause = PARA_PAUSE if g >= 0.5 else SENT_PAUSE
    splits.append((t, pause))

parts, T = [], 0.0
parts.append({"id": "intro", "kind": "intro", "T0": 0.0, "dur": INTRO}); T = INTRO
for i, name in enumerate(NAMES):
    if name in STING:
        title, sd = STING[name]
        gap = PRE + sd + POST
        parts.append({"id": f"sting-{name}", "kind": "sting", "title": title, "T0": T, "dur": gap, "sting_at": T + PRE, "sting_dur": sd})
        T += gap
    elif name in PAUSE_BEFORE:
        parts.append({"id": f"pause-{name}", "kind": "pause", "T0": T, "dur": PAUSE_BEFORE[name]})
        T += PAUSE_BEFORE[name]
    a, b = VO_CUTS[i], VO_CUTS[i + 1]
    cuts = [(t, pz) for t, pz in splits if a < t < b]
    edges = [a] + [t for t, _ in cuts] + [b]
    for k in range(len(edges) - 1):
        pid = name if k == 0 else f"{name}~{k}"
        parts.append({"id": pid, "kind": "vo", "T0": round(T, 3), "dur": round(edges[k + 1] - edges[k], 3), "vo_in": edges[k], "vo_out": edges[k + 1]})
        T += edges[k + 1] - edges[k]
        if k < len(cuts): T += cuts[k][1]
parts.append({"id": "outro", "kind": "outro", "T0": T, "dur": OUTRO}); T += OUTRO
TOTAL = round(T, 3)
P = {p["id"]: p for p in parts}

# Soundtrack: plays from source 0 at T=0 (intro, built-in silence at 6.74-7.67, then the rest),
# ducked under the voice, gone for the main business, then its final section returns so the
# track's natural ending lands on the last frame.
ST_LEN_END = 387.30
out_at = P["sting-lead"]["T0"]                     # music gone before the Front Page sting
back_at = P["sting-editors-note"]["T0"] + PRE + 2.0 # rises under the Editor's Note sting tail
seg2_src = ST_LEN_END - (TOTAL - back_at)
# Envelope keypoints (T, dB). -60 = silent.
DUCK, SWELL = -21.0, -8.0
INTRO_DUCK = -21.0
env = [(0, 0), (INTRO - 1.0, 0), (INTRO + 0.6, DUCK)]
for pid in ("pause-paper",):
    p = P[pid]; env += [(p["T0"] - 0.2, DUCK), (p["T0"] + 0.5, SWELL), (p["T0"] + p["dur"], DUCK)]
# lift the soundtrack in the 3 s breath after "This is the Gold Coast Palava.", duck as the voice returns
_e = P["paper"]["T0"] + P["paper"]["dur"]; _n = P["paper~1"]["T0"]
env += [(_e, DUCK), (_e + 0.45, -4.0), (_n - 0.45, -4.0), (_n + 0.05, DUCK)]
env += [(out_at - 2.5, DUCK), (out_at + 0.3, -60)]
QUIET = -24.0
end_vo = P["outro"]["T0"]
env += [(back_at, -60), (back_at + 2.5, QUIET), (end_vo - 0.5, QUIET), (end_vo + 2.5, 0), (end_vo + 9.0, 0), (TOTAL - 0.2, -60)]

plan = {"total": TOTAL, "parts": parts, "soundtrack": {
    "segments": [{"T0": 0, "src_in": 0, "src_out": out_at + 0.5}, {"T0": back_at, "src_in": round(seg2_src, 3), "src_out": ST_LEN_END}],
    "envelope_db": [(round(a, 3), b) for a, b in env]}}
json.dump(plan, open("timeline.json", "w"), indent=1)
for p in parts: print(f"{p['T0']:7.2f} +{p['dur']:6.2f}  {p['kind']:6} {p['id']}" + (f"  [{p['title']} @ {p['sting_at']:.2f}]" if p['kind']=='sting' else ""))
print(f"TOTAL {TOTAL:.2f}s = {int(TOTAL//60)}:{TOTAL%60:04.1f}   soundtrack back at {back_at:.2f} from source {seg2_src:.2f}")
