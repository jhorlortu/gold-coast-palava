# Master timeline for Gold Coast Palava Special No. 2 — "Nineteen Years: The Rawlings Question".
# Cold open (phone lights up, no music) -> INTRO1 + COMBO1 -> "My people, what dey go on?" -> four questions and the
# lesson, each opened by its pinned card -> close -> COMBO2 (closing montage on the soundtrack's ending) -> COMBO3.
import json, subprocess, numpy as np
W = "/home/user/gcp/sp2/work"
EDL = json.load(open(f"{W}/edl.json"))
VOF = "/home/user/gcp/sp2/src/vo.mp3"   # the client's own recording
COLD_IN = 1.4                 # black, the phone lights up with a notification, then the voice
COMBO1 = 14.0                 # INTRO1 (0-7 s) + COMBO1 (7-14 s)
PIN = 4.2                     # a pinned question card lands, holds, swipes away
CLOSE_GAP = 5.2             # the chat signs off (Aba, Kofi, three 🙏🏾), then the phone drops away before the closing line
OUTRO = 17.0                  # COMBO2
CLOSE_CARD = 5.5               # closing card without voice (no closing line in the recording)
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
        if k == len(EDL) - 1:   # the client's recording has no closing line: the closing card plays over the theme alone
            parts.append({"id": "close", "kind": "card", "T0": round(T, 3), "dur": CLOSE_CARD}); T += CLOSE_CARD
            T += 0.3
            parts.append({"id": "outro", "kind": "outro", "T0": round(T, 3), "dur": OUTRO}); T += OUTRO
            parts.append({"id": "credits", "kind": "credits", "T0": round(T, 3), "dur": CREDITS}); T += CREDITS
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

# ---------------------------------------------------------------------------
# Suspense score (synthesized, scripts/make_score.py): a low drone + clock under the cold open, a bed under each
# question (mood per question), a riser into a hit on every pinned card. The Gonje theme keeps its own slots.
MOOD = {"q1": "tense", "q2": "dark", "q3": "tense", "q4": "dark"}
score, spec = [], []
c0 = P["cold-open"]
spec.append(["cold", "cold", round(P["combo1"]["T0"] - 0.0 + 0.5, 2)])
score.append({"file": f"{W}/score/cold.wav", "T": 0.0, "db": -17, "len": round(P["combo1"]["T0"] + 0.4, 3), "fadein": 1.0, "fade": 1.2})
order = [p["id"] for p in parts if p["kind"] != "vo" or "~" not in p["id"]]
for q, mood in MOOD.items():
    a = P[q]["T0"]; nxt = [p for p in parts if p["T0"] > a + 1 and p["kind"] in ("pin", "gap", "outro")][0]; b = nxt["T0"] + 0.6
    spec.append([q, mood, round(b - a + 0.5, 2)])
    score.append({"file": f"{W}/score/{q}.wav", "T": round(a - 0.2, 3), "db": -21, "len": round(b - a + 0.2, 3), "fadein": 2.5, "fade": 2.0})
for p in parts:
    if p["kind"] == "pin":
        score.append({"file": f"{W}/score/riser.wav", "T": round(p["T0"] + 1.35 - 3.0, 3), "db": -14, "len": 3.0, "fadein": 0.5, "fade": 0.1})
        score.append({"file": f"{W}/score/hit.wav", "T": round(p["T0"] + 1.35, 3), "db": -10, "len": 2.8, "fadein": 0.01, "fade": 1.6})
json.dump(score, open(f"{W}/score_cues.json", "w"), indent=1)
json.dump(spec, open(f"{W}/score_spec.json", "w"))
print("score:", len(score), "cues;", spec)
