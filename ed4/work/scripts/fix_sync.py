# Edition 4 caption sync (client rule: captions never late, never early).
# 1) every true speech onset (voice after >=0.15 s silence) pulls the nearest word start onto it (-0.02 s);
# 2) words inside phrases: Whisper starts run ~0.08 s late on this recording (raw median vs onsets) -> shift -0.06 s,
#    never before the previous word's start. Writes transcript.json in place (keeps transcript_aligned.json).
import json, shutil, numpy as np
W = '/home/user/gcp/ed4/work'
import os
if not os.path.exists(f'{W}/transcript_aligned.json'): shutil.copy(f'{W}/transcript.json', f'{W}/transcript_aligned.json')
p = np.fromfile(f'{W}/vo16k.raw', np.int16).astype(np.float32)
rms = np.sqrt(np.convolve(p ** 2, np.ones(160) / 160, 'same')[::160] + 1e-9); thr = np.percentile(rms[rms > 1], 20) * 2.5   # same detector as verify_sync.py
on = rms > thr
onsets = [j / 100 for j in range(15, len(on)) if on[j] and on[j:j + 5].all() and not on[j - 15:j].any()]
TR = json.load(open(f'{W}/transcript_aligned.json')); WD = [w for s in TR['segments'] for w in s['words']]
S = np.array([w['s'] for w in WD]); snapped = set()
E = np.array([w['e'] for w in WD])
for o in onsets:
    # the word that spans the onset: it ends after the onset and the previous word ended (about) before it
    cand = [k for k in range(len(WD)) if E[k] > o + 0.02 and S[k] < o + 0.5 and (k == 0 or E[k - 1] <= o + 0.2)]
    k = min(cand, key=lambda k: abs(S[k] - o)) if cand else int(np.argmin(abs(S - o)))
    if abs(S[k] - o) < 0.6 and k not in snapped:
        WD[k]['s'] = round(o - 0.02, 3); snapped.add(k)
        if k and WD[k - 1]['e'] > o: WD[k - 1]['e'] = round(o - 0.03, 3)
for k, w in enumerate(WD):
    if k in snapped: continue
    lo = WD[k - 1]['s'] + 0.05 if k else 0
    w['s'] = round(max(lo, w['s'] - 0.06), 3)
for k in range(1, len(WD)):
    if WD[k]['s'] <= WD[k - 1]['s']: WD[k]['s'] = round(WD[k - 1]['s'] + 0.03, 3)
    WD[k]['e'] = max(WD[k]['e'], WD[k]['s'] + 0.06)
for s in TR['segments']: s['start'] = s['words'][0]['s']; s['end'] = s['words'][-1]['e']
json.dump(TR, open(f'{W}/transcript.json', 'w'), indent=1)
print(len(snapped), 'phrase starts snapped of', len(onsets), 'onsets')
