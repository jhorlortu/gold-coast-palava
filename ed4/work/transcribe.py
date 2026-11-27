import json, sys, time
import numpy as np
from faster_whisper import WhisperModel
src, out = sys.argv[1], sys.argv[2]
t0 = time.time()
model = WhisperModel("large-v3-turbo", device="cpu", compute_type="int8", cpu_threads=4)
audio = np.fromfile(src, dtype=np.int16).astype(np.float32) / 32768.0
segs, info = model.transcribe(audio, language="en", word_timestamps=True, vad_filter=True, beam_size=5,
                              initial_prompt="Gold Coast Palava. Kofi, the Editor. The Nest, Onipa Enclave, Sandpiper Loop. Chale, sika, sedie, pesewa, pesewas, cedi, cedis, cowrie, Maldives, Akan, Twi, Asante, Nkrumah, Mahama, De La Rue, Asiedu-Mante, Crane Currency, Orell Fussli, SICPA, Lausanne, Dominic Owusu, GoldBod, Agnes Tagoe-Quarcoopome, Makola, Porekuu Dery, Kwegyir Aggrey, Annie Jiagge, Ephraim Amu, Theodosia Okoh, Letitia Obeng, Kofi Annan, Kwame, Baaba, Amo, Bunkpurugu, Half Assini, susu, machay.")
res = []
for s in segs:
    res.append({"start": s.start, "end": s.end, "text": s.text.strip(),
                "words": [{"w": w.word, "s": w.start, "e": w.end, "p": w.probability} for w in s.words]})
    print(f"[{s.start:7.2f}-{s.end:7.2f}] {s.text.strip()}", flush=True)
json.dump({"duration": info.duration, "segments": res}, open(out, "w"), indent=1)
print(f"done in {time.time()-t0:.0f}s", flush=True)
