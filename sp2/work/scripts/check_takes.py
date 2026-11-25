# Transcribe each ElevenLabs take and score it against the script (word error rate), so the better take is picked.
import glob, json, os, re, subprocess, sys, difflib
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
import numpy as np
from faster_whisper import WhisperModel
V = "/home/user/gcp/sp2/src/vo"; T = "/home/user/gcp/sp2/src/vo_text"; O = "/home/user/gcp/sp2/work/takes"
PLAIN = {"KOR-leh BOO": "Korle-Bu", "AH-koo-foh": "Akuffo", "ah-chee-AHM-pong": "Acheampong", "ah-FREE-fah": "Afrifa", "HEE-lah lee-MAHN": "Hilla Limann",
         "MAH-koh-lah": "Makola", "kwah-MEH-nah": "Kwamena", "AH-hwoy": "Ahwoi", "KOO-meh PREH-koh": "Kume Preko", "KOO-fwor": "Kufuor", "SHAH-gah-ree": "Shagari",
         "I-M-F": "IMF", "P-N-D-C": "PNDC", "N-D-C": "NDC", "V-A-T": "VAT"}
PROMPT = "Gold Coast Palava Special. Kofi, the Editor. Aba, Baaba, Kwame, Amo. Jerry John Rawlings. Korle-Bu. Akuffo, Acheampong, Afrifa, Hilla Limann. Makola. Kwamena Ahwoi. PNDC, NDC, IMF, VAT. Kume Preko. Kufuor. Shagari. Jeffrey Haynes. Kevin Shillington. Chris Hesse. Nkrumah. Abeg. My squad, how you dey."
m = WhisperModel("large-v3-turbo", device="cpu", compute_type="int8", cpu_threads=4)
norm = lambda s: re.sub(r"[^a-z0-9' ]", " ", s.lower().replace("-", " ")).split()
files = sorted(glob.glob(f"{V}/*_t*.mp3")) if len(sys.argv) < 2 else sys.argv[1:]
for f in files:
    k = os.path.basename(f).split("_")[0]; out = f"{O}/{os.path.basename(f)[:-4]}.json"
    if os.path.exists(out): continue
    ref = open(f"{T}/{k}.txt").read()
    for a, b in PLAIN.items(): ref = ref.replace(a, b)
    pcm = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout, np.int16).astype(np.float32) / 32768
    ss, _ = m.transcribe(pcm, language="en", word_timestamps=True, vad_filter=False, beam_size=5, initial_prompt=PROMPT)
    segs = [{"start": s.start, "end": s.end, "text": s.text.strip(), "words": [{"w": w.word, "s": w.start, "e": w.end, "p": w.probability} for w in s.words]} for s in ss]
    hyp = " ".join(s["text"] for s in segs)
    r, h = norm(ref), norm(hyp); sm = difflib.SequenceMatcher(a=r, b=h, autojunk=False)
    diffs = [(op, " ".join(r[i1:i2]), " ".join(h[j1:j2])) for op, i1, i2, j1, j2 in sm.get_opcodes() if op != "equal"]
    # longest internal silence
    W = [w for s in segs for w in s["words"]]; gaps = sorted(((b["s"] - a["e"], round(a["e"], 2)) for a, b in zip(W, W[1:])), reverse=True)[:3]
    res = {"file": f, "dur": len(pcm) / 16000, "ratio": round(sm.ratio(), 3), "diffs": diffs, "gaps": gaps, "segments": segs}
    json.dump(res, open(out, "w"), indent=1)
    print(f"{os.path.basename(f):12} ratio {res['ratio']:.3f}  gaps {[(round(g,2),t) for g,t in gaps]}\n   " + "\n   ".join(f"{op}: [{a}] -> [{b}]" for op, a, b in diffs), flush=True)
