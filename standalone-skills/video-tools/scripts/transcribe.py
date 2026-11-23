#!/usr/bin/env python3
"""Word-timed transcript of a voiceover/video, as JSON: segments[].words[] = {w, s, e, p}.

usage: scripts/transcribe.py <audio-or-video> <out.json> [--engine whisper|faster] [--model turbo] [--prompt "names…"]

- engine whisper = OpenAI Whisper (github.com/openai/whisper), the reference implementation.
- engine faster  = faster-whisper (same weights, CTranslate2), ~3x faster on CPU.
After transcribing it measures how late the word starts run against the real speech onsets (energy rise after
a pause) and prints the lead to use for graphics/subtitles (word starts typically run 0.3-0.4 s late)."""
import argparse, json, os, subprocess, sys, time
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")   # plain LFS downloads work through restrictive proxies; the Xet CAS host often does not
import numpy as np
ap = argparse.ArgumentParser(); ap.add_argument("src"); ap.add_argument("out")
ap.add_argument("--engine", default="whisper", choices=["whisper", "faster"]); ap.add_argument("--model", default="turbo")
ap.add_argument("--prompt", default="", help="names and spellings to bias recognition, e.g. people and places in the recording")
ap.add_argument("--language", default="en"); a = ap.parse_args()
pcm = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", a.src, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True, check=True).stdout, np.int16)
audio = pcm.astype(np.float32) / 32768.0; t0 = time.time(); segs = []
if a.engine == "whisper":
    import whisper
    m = whisper.load_model(a.model)
    r = m.transcribe(audio, language=a.language, word_timestamps=True, initial_prompt=a.prompt or None, fp16=False, condition_on_previous_text=False)   # avoids skipped passages and repeated lines
    for s in r["segments"]:
        segs.append({"start": s["start"], "end": s["end"], "text": s["text"].strip(), "words": [{"w": w["word"], "s": float(w["start"]), "e": float(w["end"]), "p": float(w.get("probability", 0))} for w in s["words"]]})
else:
    from faster_whisper import WhisperModel
    name = {"turbo": "large-v3-turbo"}.get(a.model, a.model)
    m = WhisperModel(name, device="cpu", compute_type="int8")
    ss, _ = m.transcribe(audio, language=a.language, word_timestamps=True, vad_filter=True, beam_size=5, initial_prompt=a.prompt or None)
    for s in ss:
        segs.append({"start": s.start, "end": s.end, "text": s.text.strip(), "words": [{"w": w.word, "s": w.start, "e": w.end, "p": w.probability} for w in s.words]})
# guard: drop hallucinated segments (impossible speech rate, e.g. gibberish packed into a clipped last second)
kept = []
for s in segs:
    n = len(s["words"]); dur = max(0.05, s["end"] - s["start"])
    if n >= 4 and n / dur > 7.0: print(f"dropped hallucinated segment @{s['start']:.1f}s ({n} words in {dur:.1f}s): {s['text'][:60]}…"); continue
    kept.append(s)
segs = kept
json.dump({"duration": len(audio) / 16000, "engine": a.engine, "model": a.model, "segments": segs}, open(a.out, "w"), indent=1)
# timing bias: word starts after a pause vs the energy onset
x = pcm.astype(np.float32); rms = np.sqrt(np.convolve(x ** 2, np.ones(160) / 160, "same")[::160] + 1e-9); thr = np.percentile(rms, 20) * 2.5
W = [w for s in segs for w in s["words"]]; d = []
for p, q in zip(W, W[1:]):
    if q["s"] - p["e"] < 0.25: continue
    seg = rms[int(p["e"] * 100):int(q["e"] * 100)]
    k = next((k for k in range(len(seg) - 3) if (seg[k:k + 3] > thr * 1.5).all()), None)
    if k is not None: d.append(q["s"] - (int(p["e"] * 100) + k) / 100)
bias = float(np.median(d)) if d else 0.0
print(f"{len(W)} words in {time.time() - t0:.0f}s -> {a.out}")
print(f"word-start bias vs speech onsets: {bias:+.2f} s over {len(d)} words" + (f"  => trigger graphics ≈{max(0, bias) + 0.05:.2f} s and subtitle words ≈{max(0, bias):.2f} s earlier than the word times" if d else ""))
