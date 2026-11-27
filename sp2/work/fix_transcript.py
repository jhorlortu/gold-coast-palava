# Corrects Whisper's spellings in transcript.json at word level (names, Twi, UK spelling) while keeping timings:
# a run of recognised words is replaced by the script's words, spread over the same time span.
# Input: transcript_raw.json (Whisper) -> output: transcript.json (used by graphics cues and subtitles).
import json, re
W = "/home/user/gcp/sp2/work"
T = json.load(open(f"{W}/transcript_user.json"))   # the client's own recording
norm = lambda s: re.sub(r"[^a-z0-9%]", "", s.lower())
RULES = [  # (what Whisper heard, what was said)
    ("Korle-Bu,", "Korle-Bu,"), ("the combative,", "The Combative,"),
    ("Abba, the Restless,", "Aba, The Restless,"), ("Abba", "Aba"),
    ("Akufu's", "Akuffo's"), ("Ateampong, Akufu, and Afrifa,", "Acheampong, Akuffo and Afrifa,"), ("Hila Liman.", "Hilla Limann."),
    ("the 1%", "the one per cent"), ("Ghana must go.", "Ghana Must Go."), ("I beg.", "abeg."),
    ("defence committees", "Defence Committees"), ("Emekwala Market", "Makola Market"), ("Price Control War", "price-control war"),
    ("high court", "High Court"), ("national commission on democracy", "National Commission on Democracy"),
    ("the 80s,", "the eighties,"), ("1992 constitution.", "1992 Constitution."), ("Geoffrey", "Jeffrey"),
    ("district assemblies,", "District Assemblies,"), ("two-thirds", "two-thirds"),
    ("Baba, the ascendant,", "Baaba, The Ascendant,"), ("economic recovery program.", "Economic Recovery Programme:"),
    ("favorite", "favourite"), ("queuing", "queueing"), ("Amu, the discerning,", "Amo, The Discerning,"),
    ("this special", "this Special"), ("first special", "first Special"), ("Kwamina Ahwe,", "Kwamena Ahwoi,"),
    ("mesmerizing", "mesmerising"), ("Kufor's", "Kufuor's"), ("Kufor", "Kufuor"), ("Aoi", "Ahwoi"), ("Ahui", "Ahwoi"),
    ("half-past", "half-past"), ("57%", "57%"),
]
words = [dict(w) for s in T["segments"] for w in s["words"]]
for si, s in enumerate(T["segments"]):
    for w in s["words"]: pass
seg_of = [si for si, s in enumerate(T["segments"]) for _ in s["words"]]
for heard, said in RULES:
    target = norm(heard); new = said.split(); i = 0
    while i < len(words):
        acc, j = "", i
        while j < len(words) and len(acc) < len(target):
            acc += norm(words[j]["w"]); j += 1
        if acc == target and norm(words[i]["w"]) and target.startswith(norm(words[i]["w"])):
            s0, e0 = words[i]["s"], words[j - 1]["e"]; step = (e0 - s0) / len(new)
            rep = [{"w": " " + t, "s": round(s0 + k * step, 3), "e": round(s0 + (k + 1) * step, 3), "p": 1.0} for k, t in enumerate(new)]
            words[i:j] = rep; seg_of[i:j] = [seg_of[i]] * len(new); i += len(new)
        else: i += 1
segs = []
for si, s in enumerate(T["segments"]):
    ws = [w for w, k in zip(words, seg_of) if k == si]
    if ws: segs.append({"start": ws[0]["s"], "end": ws[-1]["e"], "text": "".join(w["w"] for w in ws).strip(), "words": ws})
T["segments"] = segs
# timing: Whisper's word starts run ~0.15 s early on this recording (median vs energy onsets); the first word of each
# kept span starts even earlier, so it is clamped into the span (otherwise cues and subtitles would drop it)
EDL = json.load(open(f"{W}/edl.json"))
for sg in segs:
    for w in sg["words"]:
        w["s"] = round(w["s"] + 0.15, 3); w["e"] = round(w["e"] + 0.15, 3)
        for e in EDL:
            if e["vo_in"] - 1.0 <= w["s"] < e["vo_in"] and w["e"] > e["vo_in"]: w["s"] = round(e["vo_in"] + 0.02, 3)
    sg["start"], sg["end"] = sg["words"][0]["s"], sg["words"][-1]["e"]
json.dump(T, open(f"{W}/transcript.json", "w"), indent=1)
print("\n".join(f"{s['start']:7.2f} {s['text']}" for s in segs))
