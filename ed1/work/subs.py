# Word-timed subtitles (ASS) on the final timeline, in the show's font.
import json, re
plan = json.load(open("timeline.json")); t = json.load(open("transcript.json"))
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
FIX = [(r"\bPallava\b", "Palava"), (r"\bhow de ting de go\b", "how the thing dey go"), (r"\bde ting bise, we all know de hold\b", "the thing be say we all no dey hold"),
       (r"\bIf it accost you data\b", "If e dey cost you data"), (r"\bmake it sweet you\b", "make e sweet you"), (r"\bNsamank\w*", "Nsamankow"), (r"\bBonsar River\b", "Bonsa River"),
       (r"\bdenchira\b", "Denkyira"), (r"\bDenchira\b", "Denkyira"), (r"\bTenchira\b", "Denkyira"), (r"\basantefo\b", "asan-tefo"), (r"\bNogodi's\b", "nobody's"),
       (r"\bOkonfu Anoche\b", "Okomfo Anokye"), (r"\bAnoche\b", "Anokye"), (r"\bOseitutu\b", "Osei Tutu"), (r"\bNtim Jakari\b", "Ntim Gyakari"), (r"\bFease\b", "Feyiase"),
       (r"\bAsante man\b", "Asanteman"), (r"\bEsumangkwafo\b", "Esumankwafo"), (r"\bDodoa\b", "Dodowa"), (r"\bAchem\b", "Akyem"), (r"\bAchim\b", "Akyem"),
       (r"\bNana 'afia Dukwa\b", "Nana Afia Dokuaa"), (r"\ba moirful\b", "Amoaful"), (r"\bFomenna\b", "Fomena"), (r"\bIt'll be a small thing\b", "E no be small thing"),
       (r"\bPrempe\b", "Prempeh"), (r"\bHauser\b", "Hausa"), (r"\bYa Asantewa\b", "Yaa Asantewaa"), (r"\bAjisu\b", "Ejisu"), (r"\bBRITAN WON\b", "BRITAIN WON"),
       (r"\bTIKKOM\b", "take come"), (r"\bKUMOT FODE\b", "komot for there"), (r"\bTING PIN MIU\b", "thing pain me oo"), (r"\bWahaladeh\b", "Wahala dey"),
       (r"\bBungpurugu\b", "Bunkpurugu"), (r"\bHalf Asini\b", "Half Assini"), (r"\bthe nest\b", "The Nest"), (r"\bthe Nest\b", "The Nest"), (r"\bAt 266\b", "at 266"),
       (r"\bprogram\b", "programme"), (r"\bcenter\b", "centre"), (r"\bpage 1\b", "page one"), (r"\bPage 1\b", "Page one")]
def fix(s):
    for a, b in FIX: s = re.sub(a, b, s)
    return s
vo = [p for p in plan["parts"] if p["kind"] == "vo"]
def toT(time):
    for p in vo:
        if p["vo_in"] - 0.05 <= time <= p["vo_out"] + 0.05: return p["T0"] + (time - p["vo_in"]), p["id"]
    return None, None
GLUE = {('Gold','Coast'), ('Coast','Palava'), ('Coast','Palava.'), ('Sandpiper','Loop'), ('Sandpiper','Loop,'), ('Half','Assini'), ('Sir','Charles'), ('Charles','McCarthy')}
glued = lambda a, b: (a.strip(',.'), b) in GLUE or (a, b) in GLUE
cues, cur = [], []
def flush():
    if cur: cues.append(cur.copy()); cur.clear()
prev = None
for w in merged:
    T, pid = toT(w["s"])
    if T is None: continue
    Te, _ = toT(min(w["e"], next(p["vo_out"] for p in vo if p["id"] == pid)))
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
for fn in glob.glob("/home/user/gcp/ed1/build/busy/*.json"): busy += json.load(open(fn))
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
        lines.append(f"Dialogue: 0,{ts(a0)},{ts(a1)},Sub,,0,0,0,,{txt}")
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
open("subs.ass", "w").write(head + "\n".join(lines) + "\n")
print(len(lines), "caption events")
