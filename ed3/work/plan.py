# Master timeline for Gold Coast Palava, Edition 3.
# Cold open (no music) -> COMBO1 (Optimum Digital presents + banner montage, soundtrack identity) -> "Chale..." ->
# six traditional segments with stings; Lead Story / Team Aside / Letters Page are headings only (a breath, no sting).
import json, subprocess, numpy as np
W = "/home/user/gcp/ed3/work"
EDL = json.load(open(f"{W}/edl.json"))
VOF = "/home/user/gcp/ed3/src/vo_user.mp3"
STING = {"Front Page": 5.04, "The Wire": 6.552, "The Palava Desk": 6.024, "Then v Now": 6.552, "Editor's Note": 5.04, "Dispatch": 7.032}
PRE, POST = 0.8, 0.9          # silence before a sting / after it before the voice resumes
HEAD = 1.6                    # breath while a heading (Lead Story, Team Aside, Letters Page) lands
COLD_IN = 0.4                 # the voice starts right away
COMBO1 = 14.0                 # Optimum Digital presents + opening montage
OUTRO = 17.0
CREDITS = 5.8                 # COMBO3: the colophon, one block at a time (~5 s), in silence, then black
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
    # never cut before the word has ended (whisper often ends sibilants early: "suspen|se")
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
    elif gap.startswith("sting:"):
        title = gap[6:]; sd = STING[title]; g = PRE + sd + POST
        parts.append({"id": f"sting-{EDL[k + 1]['id']}", "kind": "sting", "title": title, "T0": round(T, 3), "dur": g, "sting_at": round(T + PRE, 3), "sting_dur": sd}); T += g
    elif gap.startswith("head:"):
        parts.append({"id": f"head-{EDL[k + 1]['id']}", "kind": "head", "title": gap[5:], "T0": round(T, 3), "dur": HEAD}); T += HEAD
    elif gap == "outro":
        T += 0.4
        parts.append({"id": "outro", "kind": "outro", "T0": round(T, 3), "dur": OUTRO}); T += OUTRO
        parts.append({"id": "credits", "kind": "credits", "T0": round(T, 3), "dur": CREDITS}); T += CREDITS
TOTAL = round(T, 3)
P = {p["id"]: p for p in parts}

# Soundtrack: none under the cold open; plays from COMBO1 (built-in silence and all), ducks under "Chale...",
# leaves before the Front Page sting, returns quietly under the Editor's Note, rises for the outro banner, fades low.
ST_LEN_END = 387.30
c1 = P["combo1"]["T0"]
out_at = P["sting-front-page"]["T0"]
back_at = P["sting-editor"]["T0"] + PRE + 2.0
# COMBO2: the soundtrack's ending (the beat drop) lands on the closing montage exactly as in the pilot — it ends where
# the outro ends; the colophon (COMBO3) follows in silence.
END = P["credits"]["T0"] if "credits" in P else TOTAL
seg2_src = ST_LEN_END - (END - back_at)
DUCK, QUIET = -21.0, -24.0
end_vo = P["outro"]["T0"]
env = [(0, -60), (c1 - 0.05, -60), (c1, 0), (c1 + COMBO1 - 1.0, 0), (c1 + COMBO1 + 0.6, DUCK),
       (out_at - 2.5, DUCK), (out_at + 0.3, -60),
       (back_at, -60), (back_at + 2.5, QUIET), (end_vo - 0.5, QUIET), (end_vo + 2.5, 0), (end_vo + 10.0, 0), (END - 0.2, -60), (TOTAL, -60)]
plan = {"total": TOTAL, "parts": parts, "soundtrack": {
    "segments": [{"T0": c1, "src_in": 0, "src_out": out_at - c1 + 0.5}, {"T0": back_at, "src_in": round(seg2_src, 3), "src_out": ST_LEN_END}],
    "envelope_db": [(round(a, 3), b) for a, b in env]}}
json.dump(plan, open(f"{W}/timeline.json", "w"), indent=1)
for p in parts:
    if p["kind"] != "vo" or "~" not in p["id"]:
        print(f"{p['T0']:7.2f} +{p['dur']:6.2f}  {p['kind']:6} {p['id']}" + (f"  [{p.get('title', '')}]" if p['kind'] in ('sting', 'head') else ""))
print(f"TOTAL {TOTAL:.2f}s = {int(TOTAL // 60)}:{TOTAL % 60:04.1f}   VO pieces: {sum(1 for p in parts if p['kind'] == 'vo')}")
