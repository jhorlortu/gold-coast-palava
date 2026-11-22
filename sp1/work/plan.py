# Master timeline for Gold Coast Palava Special No. 1 — "The Eyes of Ghana: Rev. Chris Hesse".
# Cold open (phone lights up, no music) -> INTRO1 + COMBO1 -> "My people, what dey go on?" -> four questions and the
# lesson, each opened by its pinned card -> close -> COMBO2 (closing montage on the soundtrack's ending) -> COMBO3.
import json, subprocess, numpy as np
W = "/home/user/gcp/sp1/work"
EDL = json.load(open(f"{W}/edl.json"))
VOF = "/home/user/gcp/sp1/src/vo.mp3"
COLD_IN = 1.4                 # black, the phone lights up with a notification, then the voice
COMBO1 = 14.0                 # INTRO1 (0-7 s) + COMBO1 (7-14 s)
PIN = 4.2                     # a pinned question card lands, holds, swipes away
CLOSE_GAP = 5.2             # the chat signs off (Aba, Kofi, three 🙏🏾), then the phone drops away before the closing line
OUTRO = 17.0                  # COMBO2
CREDITS = 5.8                 # COMBO3, in silence
SENT_PAUSE, PARA_PAUSE = 0.8, 1.2

pcm = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", VOF, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout, np.int16).astype(np.float32)
def quiet(a, b):
    i0, i1 = int(a * 16000), int(b * 16000); best, bt = 1e18, (a + b) / 2
    for i in range(i0, max(i0 + 1, i1 - 320), 80):
        e = float(np.mean(pcm[i:i + 320] ** 2))
        if e < best: best, bt = e, (i + 160) / 16000
    return round(bt, 3)
TR = json.load(open(f"{W}/transcript.json")); WD = [w for sg in TR["segments"] for w in sg["words"]]
splits = []
for a, b in zip(WD, WD[1:]):
    if a["w"].strip()[-1:] not in ".?!": continue
    g = b["s"] - a["e"]
    splits.append((quiet(a["e"] + 0.03, max(b["s"], a["e"] + 0.25) + 0.06), PARA_PAUSE if g >= 0.5 else SENT_PAUSE))

parts, T = [], COLD_IN
for k, sp in enumerate(EDL):
    a, b, name = sp["vo_in"], sp["vo_out"], sp["id"]
    cuts = [(t, pz) for t, pz in splits if a + 0.6 < t < b - 0.6]
    edges = [a] + [t for t, _ in cuts] + [b]
    for j in range(len(edges) - 1):
        parts.append({"id": name if j == 0 else f"{name}~{j}", "kind": "vo", "T0": round(T, 3), "dur": round(edges[j + 1] - edges[j], 3), "vo_in": edges[j], "vo_out": edges[j + 1]})
        T += edges[j + 1] - edges[j]
        if j < len(cuts): T += cuts[j][1]
    gap = sp["gap_after"]
    if gap == "combo1":
        T += 0.5
        parts.append({"id": "combo1", "kind": "intro", "T0": round(T, 3), "dur": COMBO1}); T += COMBO1
        T += 0.3
    elif gap.startswith("pin:"):
        T += 0.5
        parts.append({"id": f"pin-{gap[4:]}", "kind": "pin", "T0": round(T, 3), "dur": PIN}); T += PIN
    elif gap == "close":
        T += 0.6
        parts.append({"id": "pre-close", "kind": "gap", "T0": round(T, 3), "dur": CLOSE_GAP}); T += CLOSE_GAP
    elif gap == "outro":
        T += 0.5
        parts.append({"id": "outro", "kind": "outro", "T0": round(T, 3), "dur": OUTRO}); T += OUTRO
        parts.append({"id": "credits", "kind": "credits", "T0": round(T, 3), "dur": CREDITS}); T += CREDITS
TOTAL = round(T, 3)
P = {p["id"]: p for p in parts}

# Soundtrack: none under the cold open; plays from INTRO1 (built-in silence and all), ducks under "My people…",
# leaves before the first pinned card, returns quietly under the lesson, rises for the closing montage (COMBO2,
# the track's ending aligned to the outro's end), then COMBO3 in silence.
ST_LEN_END = 387.30
c1 = P["combo1"]["T0"]
out_at = P["pin-q1"]["T0"]
back_at = P["pin-lesson"]["T0"] + 1.0
END = P["credits"]["T0"]
seg2_src = ST_LEN_END - (END - back_at)
DUCK, QUIET = -21.0, -24.0
end_vo = P["outro"]["T0"]
env = [(0, -60), (c1 - 0.05, -60), (c1, 0), (c1 + COMBO1 - 1.0, 0), (c1 + COMBO1 + 0.6, DUCK),
       (out_at - 2.0, DUCK), (out_at + 0.6, -60),
       (back_at, -60), (back_at + 2.5, QUIET), (end_vo - 0.5, QUIET), (end_vo + 2.5, 0), (end_vo + 10.0, 0), (END - 0.2, -60), (TOTAL, -60)]
plan = {"total": TOTAL, "parts": parts, "soundtrack": {
    "segments": [{"T0": c1, "src_in": 0, "src_out": out_at - c1 + 1.0}, {"T0": back_at, "src_in": round(seg2_src, 3), "src_out": ST_LEN_END}],
    "envelope_db": [(round(a, 3), b) for a, b in env]}}
json.dump(plan, open(f"{W}/timeline.json", "w"), indent=1)
for p in parts:
    if p["kind"] != "vo" or "~" not in p["id"]:
        print(f"{p['T0']:7.2f} +{p['dur']:6.2f}  {p['kind']:6} {p['id']}")
print(f"TOTAL {TOTAL:.2f}s = {int(TOTAL // 60)}:{TOTAL % 60:04.1f}   VO pieces: {sum(1 for p in parts if p['kind'] == 'vo')}")
