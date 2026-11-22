import json, sys, time
import numpy as np
from faster_whisper import WhisperModel
src, out = sys.argv[1], sys.argv[2]
t0 = time.time()
model = WhisperModel("/root/whisper-turbo", device="cpu", compute_type="int8", cpu_threads=4)
audio = np.fromfile(src, dtype=np.int16).astype(np.float32) / 32768.0
segs, info = model.transcribe(audio, language="en", word_timestamps=True, vad_filter=True, beam_size=5,
                              initial_prompt="Gold Coast Palava Special. Kofi, the Editor. Aba, Baaba, Kwame. Chris Hesse, Christian Tsui Hesse. The Eyes of Ghana. IShowSpeed. Ben Proudfoot. Nkrumah. Osu. Kanda. TV3. Lodz, Poland. James Fort. Kulungugu. Captain Buckman. Ankrah, Afrifa, Busia, Rawlings. Anita Afonu. Yaw Amponsah. Hanoi. Moscow. Kremlin. National Liberation Council. Mother Ghana. Kafui Dey. Chale. Abeg. E no be small question. My people, what dey go on.")
res = []
for s in segs:
    res.append({"start": s.start, "end": s.end, "text": s.text.strip(),
                "words": [{"w": w.word, "s": w.start, "e": w.end, "p": w.probability} for w in s.words]})
    print(f"[{s.start:7.2f}-{s.end:7.2f}] {s.text.strip()}", flush=True)
json.dump({"duration": info.duration, "segments": res}, open(out, "w"), indent=1)
print(f"done in {time.time()-t0:.0f}s", flush=True)
