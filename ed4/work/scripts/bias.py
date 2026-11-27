# Caption-sync check: every true speech onset in the audio (voice after >=0.15 s of silence) is matched to the nearest
# transcript word start; prints median offset (positive = transcript LATE) and spread.
import json, sys, numpy as np
W = sys.argv[1] if len(sys.argv) > 1 else '/home/user/gcp/ed4/work'
TRF = sys.argv[2] if len(sys.argv) > 2 else 'transcript.json'
p = np.fromfile(f'{W}/vo16k.raw', np.int16).astype(np.float32)
rms = np.sqrt(np.convolve(p ** 2, np.ones(160) / 160, 'same')[::160] + 1e-9); thr = np.percentile(rms, 20) * 2.5
on = rms > thr
onsets = [j / 100 for j in range(15, len(on)) if on[j] and on[j:j + 5].all() and not on[j - 15:j].any()]
TR = json.load(open(f'{W}/{TRF}')); S = np.array([w['s'] for s in TR['segments'] for w in s['words']])
d = []
for o in onsets:
    k = np.argmin(abs(S - o))
    if abs(S[k] - o) < 0.6: d.append(S[k] - o)
d = np.array(d); m = np.median(d)
print(f'{len(onsets)} onsets, {len(d)} matched; median {m:+.3f}s, IQR {np.percentile(d,25):+.3f}..{np.percentile(d,75):+.3f}, off >0.1 from median: {np.mean(abs(d-m)>0.1)*100:.0f}%')
if len(sys.argv) > 3: json.dump([float(x) for x in d], open(sys.argv[3], 'w'))
