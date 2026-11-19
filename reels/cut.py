# Reel cutter: picks voice lines by phrase from an edition's transcript, cuts them at the quietest point next to
# the words, lays them on a tight social-reel timeline (short gaps, inserted beats) and writes caption phrases.
# usage: python3 -I cut.py <reel dir with spec.json>   -> reel.json (+ voice.wav)
import json, re, subprocess, sys, os
import numpy as np
D = sys.argv[1]; S = json.load(open(f"{D}/spec.json"))
TR = json.load(open(S["transcript"])); WD = [w for sg in TR["segments"] for w in sg["words"]]
for w in WD: w["w"] = w["w"].strip()
# glue split numbers/contractions back on ("10" ",000." -> "10,000.")
_m = []
for w in WD:
    if _m and w["w"][:1] in ",'.%" and len(w["w"]) > 1 and w["s"] - _m[-1]["e"] < 0.15: _m[-1] = {**_m[-1], "w": _m[-1]["w"] + w["w"], "e": w["e"]}
    else: _m.append(w)
WD = _m
norm = lambda x: re.sub(r"[^a-z0-9]", "", x.lower())
NW = [norm(w["w"]) for w in WD]
# spelling fixes from the edition's subtitle script (FIX = [...] block only)
src = open(S["subs"]).read(); i = src.index("FIX = ["); j = src.index("]\n", i) + 1
ns = {"re": re}; exec(src[i:j], ns); FIX = ns["FIX"] + [tuple(x) for x in S.get("fix_extra", [])]
def fix(s):
    for a, b in FIX: s = re.sub(a, b, s)
    return s
pcm = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", S["vo"], "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout, np.int16).astype(np.float32)
def quiet(a, b):
    i0, i1 = int(a * 16000), int(b * 16000); best, bt = 1e18, (a + b) / 2
    for k in range(i0, max(i0 + 1, i1 - 320), 80):
        e = float(np.mean(pcm[k:k + 320] ** 2))
        if e < best: best, bt = e, (k + 160) / 16000
    return round(bt, 3)
def find(phrase, after=0.0):
    t = [norm(x) for x in phrase.split() if norm(x)]
    for k in range(len(WD)):
        if WD[k]["s"] >= after - 0.01 and NW[k:k + len(t)] == t: return k, k + len(t) - 1
    raise SystemExit(f"not found: {phrase!r} after {after}")
T, pieces, beats, caps = S.get("lead_in", 0.25), [], [], []
for it in S["items"]:
    if "beat" in it:
        beats.append({"id": it["id"], "kind": it["beat"], "T0": round(T, 3), "dur": it["dur"]}); T += it["dur"]; continue
    a0, _ = find(it["vo"][0], it.get("near", 0)); _, b1 = find(it["vo"][1], WD[a0]["s"])
    prev_e = WD[a0 - 1]["e"] if a0 else 0; nxt_s = WD[b1 + 1]["s"] if b1 + 1 < len(WD) else WD[b1]["e"] + 0.4
    vin = quiet(max(prev_e, WD[a0]["s"] - 0.25), WD[a0]["s"] - 0.01) if WD[a0]["s"] - prev_e > 0.04 else WD[a0]["s"] - 0.01
    vout = quiet(WD[b1]["e"] + 0.01, min(nxt_s, WD[b1]["e"] + 0.3)) if nxt_s - WD[b1]["e"] > 0.04 else WD[b1]["e"]
    p = {"id": it["id"], "kind": "vo", "T0": round(T, 3), "vo_in": round(vin, 3), "vo_out": round(vout, 3), "dur": round(vout - vin, 3)}
    pieces.append(p)
    # captions: fix spellings on the whole line, align fixed words back to spoken times, then cut into phrases
    import difflib
    ws = WD[a0:b1 + 1]
    fx = fix(" ".join(w["w"] for w in ws)).split(); fx[0] = fx[0][:1].upper() + fx[0][1:]
    sm = difflib.SequenceMatcher(None, [norm(w["w"]) for w in ws], [norm(x) for x in fx], autojunk=False)
    tim = [None] * len(fx)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        for q in range(j2 - j1):
            src_i = min(i1 + (q * max(1, i2 - i1)) // max(1, j2 - j1), max(i1, i2 - 1)) if i2 > i1 else max(0, i1 - 1)
            tim[j1 + q] = (ws[src_i]["s"], ws[min(src_i, len(ws) - 1)]["e"])
    toks = [{"w": x, "s": t[0], "e": t[1]} for x, t in zip(fx, tim)]
    cur = []
    def flush():
        if not cur: return
        caps.append({"T0": round(T + cur[0]["s"] - vin, 3), "T1": round(T + cur[-1]["e"] - vin, 3), "words": [{"w": w["w"], "t": round(T + w["s"] - vin, 3)} for w in cur]}); cur.clear()
    for w in toks:
        if cur and (len(cur) >= 4 or len(" ".join(x["w"] for x in cur + [w])) > 22): flush()
        cur.append(w)
        if w["w"][-1:] in ".,?!;:": flush()
    flush()
    T += p["dur"] + it.get("gap", S.get("gap", 0.35))
total = round(T + S.get("tail", 0.0), 3)
# captions hold until the next one starts (max 0.6 s after the last word)
for a, b in zip(caps, caps[1:]): a["T1"] = round(min(b["T0"], a["T1"] + 0.6), 3)
caps[-1]["T1"] = round(caps[-1]["T1"] + 0.6, 3)
json.dump({"total": total, "pieces": pieces, "beats": beats, "captions": caps}, open(f"{D}/reel.json", "w"), indent=1)
for p in pieces + beats: print(f"{p['T0']:7.2f} +{p['dur']:5.2f} {p['id']}")
print(f"TOTAL {total:.1f}s = {int(total // 60)}:{total % 60:04.1f}, {len(caps)} caption phrases")
