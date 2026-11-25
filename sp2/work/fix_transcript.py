# Corrects Whisper's spellings in transcript.json at word level (names, Twi, UK spelling) while keeping timings:
# a run of recognised words is replaced by the script's words, spread over the same time span.
# Input: transcript_raw.json (Whisper) -> output: transcript.json (used by graphics cues and subtitles).
import json, re
W = "/home/user/gcp/sp2/work"
T = json.load(open(f"{W}/transcript_raw.json"))
norm = lambda s: re.sub(r"[^a-z0-9%]", "", s.lower())
RULES = [  # (what Whisper heard, what was said)
    ("garner still day like this.", "Ghana still dey like this?"),
    ("the combative,", "The Combative,"),
    ("112 years. In the 12 days,", "112 days,"),
    ("112 years. In the last 12 days,", "112 days,"),
    ("Pallava special.", "Palava Special."),
    ("the nest.", "the Nest."),
    ("our first special", "our first Special"),
    ("A-Chi, A-M-Pong, A-Kufo, and A-Fri-Fa,", "Acheampong, Akuffo and Afrifa,"),
    ("Chila Lee Mahan.", "Hilla Limann."),
    ("Akufo's", "Akuffo's"),
    ("Abba, the Restless,", "Aba, The Restless,"),
    ("Abba", "Aba"),
    ("the 1%", "the one per cent"),
    ("Ghanians", "Ghanaians"),
    ("Ghana must go.", "Ghana Must Go."),
    ("a beg,", "abeg,"),
    ("Defense", "Defence"),
    ("neighborhoods", "neighbourhoods"),
    ("MAH Kola", "Makola"),
    ("Price Control War", "price-control war"),
    ("high court", "High Court"),
    ("the 80s,", "the eighties,"),
    ("Geoffrey", "Jeffrey"),
    ("district assemblies,", "District Assemblies,"),
    ("Baba, the ascendant,", "Baaba, The Ascendant,"),
    ("economic recovery program.", "Economic Recovery Programme:"),
    ("favorite", "favourite"),
    ("queuing", "queueing"),
    ("Amo, the discerning,", "Amo, The Discerning,"),
    ("this special", "this Special"),
    ("Kwa Mehna Ahwoi,", "Kwamena Ahwoi,"),
    ("mesmerizing", "mesmerising"),
    ("Kufwar's", "Kufuor's"), ("Kufwar", "Kufuor"),
    ("Achwoi", "Ahwoi"),
    ("Shaga Ri,", "Shagari,"),
    ("Santro fi ano ma, wo che no a, wa che mamu su o, wo jaye no a, wa jaye ade.", "Santrofi anomaa, wokye no a, wakye mmusuo; wogyae no a, wagyae adeɛ."),
    ("strong man", "strongman"),
    ("lesson squad.", "lesson, squad:"),
    ("Palava special.", "Palava Special."),
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
json.dump(T, open(f"{W}/transcript.json", "w"), indent=1)
print("\n".join(f"{s['start']:7.2f} {s['text']}" for s in segs))
