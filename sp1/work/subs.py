# Word-timed subtitles (ASS) on the final timeline, in the show's font.
import json, re
SUB_LEAD = 0.35
plan = json.load(open("/home/user/gcp/sp1/work/timeline.json")); t = json.load(open("/home/user/gcp/sp1/work/transcript.json"))
words = [w for s in t["segments"] for w in s["words"]]
# Rejoin tokens Whisper split (e.g. " 10" + ",000.")
merged = []
for w in words:
    if merged and not w["w"].startswith(" "):
        merged[-1] = {**merged[-1], "w": merged[-1]["w"] + w["w"], "e": w["e"]}
    else:
        merged.append(dict(w))
# word-level fix: "Loop or Nipah Enclave" -> "Loop, Onipa Enclave"
for i in range(len(merged) - 2):
    if merged[i]["w"].strip() == "Loop" and merged[i+1]["w"].strip() == "or" and merged[i+2]["w"].strip().startswith("Nipah"):
        merged[i]["w"] = " Loop,"; merged[i+2]["w"] = " Onipa"; merged[i+2]["s"] = merged[i+1]["s"]; merged[i+1]["w"] = ""
merged = [w for w in merged if w["w"].strip()]
FIX = [(r"\bPallava\b", "Palava"), (r"\bOssu\b", "Osu"), (r"\bBaba\b", "Baaba"), (r"\bAbba\b", "Aba"), (r"\bEyeshowSpeed\b", "IShowSpeed"),
       (r"\bChui\b", "Tsui"), (r"\bKulongugu\b", "Kulungugu"), (r"\bAnkara\b", "Ankrah"), (r"\bYao Amponsa\b", "Yaw Amponsah"), (r"\bKafui Day\b", "Kafui Dey"),
       (r"\bChali\b", "Chale"), (r"\bI beg,", "abeg,"), (r"\bYou know be small\b", "E no be small"), (r"\b11\.47\b", "11:47"), (r"\borganized\b", "organised"),
       (r"\bdigitize\b", "digitise"), (r"\bprogram\b", "programme"), (r"\b2 o'clock\b", "two o'clock"), (r"\bthe Restless\b", "The Restless"), (r"\bthe ascendant\b", "The Ascendant"),
       (r"\bthe combative\b", "The Combative"), (r"\bthe editor\b", "the Editor"), (r"\b24-hour economy\b", "24-Hour Economy"), (r"\bthe nest\b", "the Nest"), (r"\bThe Nest\b", "the Nest"),
       (r"\bspecial\b", "Special"), (r"\bcamera two\b", "Camera Two"), (r"\bLodz\b", "Łódź"), (r"\bthe 1%", "the one per cent"), (r"\bthe 90s\b", "the nineties")]
def fix(s):
    for a, b in FIX: s = re.sub(a, b, s)
    return s
vo = [p for p in plan["parts"] if p["kind"] == "vo"]
def toT(time):
    for p in vo:
        if p["vo_in"] - 0.05 <= time <= p["vo_out"] + 0.05: return p["T0"] + (time - p["vo_in"]), p["id"]
    return None, None
GLUE = {('Chris','Hesse'), ('Kafui','Day'), ('Anita','Afonu'), ('Captain','Buckman'), ('Mother','Ghana'), ('Ben','Proudfoot'), ('Gold','Coast'), ('Coast','Palava'), ('Coast','Palava.'), ('Sandpiper','Loop'), ('Sandpiper','Loop,'), ('Half','Assini'), ('Sir','Charles'), ('Charles','McCarthy')}
glued = lambda a, b: (a.strip(',.'), b) in GLUE or (a, b) in GLUE
cues, cur = [], []
def flush():
    if cur: cues.append(cur.copy()); cur.clear()
prev = None
for w in merged:
    T, pid = toT(w["s"])
    if T is None: continue
    Te, _ = toT(min(w["e"], next(p["vo_out"] for p in vo if p["id"] == pid)))
    T -= SUB_LEAD; Te -= SUB_LEAD   # Whisper word starts run ~0.38 s late (measured); client saw the voice ahead of the subtitles
    text = w["w"].strip()
    if cur:
        gap = T - cur[-1]["e"]; length = len(" ".join(x["w"] for x in cur) + " " + text)
        if pid != cur[-1]["pid"] or gap > 0.45 or (length > 30 and not glued(cur[-1]["w"], text)) or length > 40 or re.search(r"[.?!]$", cur[-1]["w"]): flush()
    cur.append({"w": text, "s": T, "e": Te, "pid": pid})
    if re.search(r"[,;:]$", text) and len(" ".join(x["w"] for x in cur)) > 14: flush()
flush()
def ts(x):
    cs = int(round(x * 100)); h, cs = divmod(cs, 360000); m, cs = divmod(cs, 6000); s, cs = divmod(cs, 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"
# On-screen text windows (from the section builders): captions step aside while the page itself is talking.
import glob, os
busy = []
for fn in glob.glob("/home/user/gcp/sp1/build/busy/*.json"): busy += json.load(open(fn))
# while the phone holds the right third, captions sit centred under the left two-thirds
pw = []
for fn in glob.glob("/home/user/gcp/sp1/build/phonewin/*.json"): pw += json.load(open(fn))
def margins(a):
    return (100, 700) if any(x - 0.05 <= a <= y for x, y in pw) else (260, 260)
def covered(a, b):
    tot = sum(max(0, min(b, y) - max(a, x)) for x, y in busy)
    return tot / max(0.01, b - a)
lines, shown, hidden = [], 0, 0
for i, c in enumerate(cues):
    start = c[0]["s"] - 0.03
    end = c[-1]["e"] + 0.45
    if i + 1 < len(cues): end = min(end, cues[i + 1][0]["s"] - 0.04)
    shown += 1
    # words appear as they are spoken: one event per word, each adding the next word
    for k, w in enumerate(c):
        a0 = start if k == 0 else w["s"] - 0.02
        a1 = c[k + 1]["s"] - 0.02 if k + 1 < len(c) else end
        if a1 - a0 < 0.02: continue
        txt = fix(" ".join(x["w"] for x in c[:k + 1])) + ("{\\alpha&HFF&} " + fix(" ".join(x["w"] for x in c[k + 1:])) if k + 1 < len(c) else "")
        ml, mr = margins(c[0]["s"]); lines.append(f"Dialogue: 0,{ts(a0)},{ts(a1)},Sub,,{ml},{mr},0,,{txt}")
print(f"captions shown {shown}, hidden behind on-screen text {hidden}")
head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Haas Grot Disp R Trial,40,&H00FFFDF7,&H00FFFDF7,&H0012161A,&H8012161A,0,0,0,0,100,100,0.4,0,1,3,1.5,2,260,260,30,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
open("/home/user/gcp/sp1/work/subs.ass", "w").write(head + "\n".join(lines) + "\n")
print(len(lines), "caption events")
