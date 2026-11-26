# Caption-sync verification on the FINAL MP4 (client rule: captions never late, never early).
# 1) rebuild the voice-only track from timeline.json (same placement as build_audio) and cross-correlate it with the
#    final file's audio -> the voice in the deliverable sits where the plan says (offset ~0);
# 2) every voice onset after a pause (>=0.15 s silence) on that track is matched to the caption event that reveals the
#    next word (subs.ass); report median / worst error. Pass: |median| <= 0.04 s and no word beyond 0.1 s.
import json, re, subprocess, sys, numpy as np
W = '/home/user/gcp/ed4/work'; FINAL = sys.argv[1]; SR = 16000
plan = json.load(open(f'{W}/timeline.json')); TOTAL = plan['total']
dec = lambda f: np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout, np.int16).astype(np.float32)
vo = dec('/home/user/gcp/ed4/src/vo.mp3'); track = np.zeros(int(TOTAL * SR) + SR, np.float32)
for p in plan['parts']:
    if p['kind'] != 'vo': continue
    a, b = int(p['vo_in'] * SR), int(p['vo_out'] * SR); t = int(round(p['T0'] * SR)); seg = vo[a:b]; track[t:t + len(seg)] += seg
fin = dec(FINAL)
# 1) offset by cross-correlation of energy envelopes (10 ms hops)
env = lambda x: np.sqrt(np.convolve(x ** 2, np.ones(160) / 160, 'same')[::160] + 1e-9)
A, B = env(track), env(fin); n = min(len(A), len(B)); A, B = A[:n] - A[:n].mean(), B[:n] - B[:n].mean()
lags = range(-50, 51); cc = [np.dot(A[max(0, l):n + min(0, l)], B[max(0, -l):n - max(0, l)]) for l in lags]
off = list(lags)[int(np.argmax(cc))] / 100
print(f'voice placement in final MP4: offset {off:+.2f} s (positive = final audio late)')
# 2) caption reveal times vs voice onsets
rms = env(track); thr = np.percentile(rms[rms > 1], 20) * 2.5; on = rms > thr
onsets = [j / 100 for j in range(15, len(on) - 5) if on[j] and on[j:j + 5].all() and not on[j - 15:j].any()]
ts = lambda s: (lambda h, m, x: int(h) * 3600 + int(m) * 60 + float(x))(*s.split(':'))
reveal = []
for line in open(f'{W}/subs.ass'):
    if not line.startswith('Dialogue:'): continue
    f = line.split(',', 9); reveal.append(ts(f[1]))
reveal = np.array(sorted(set(reveal)))
d = np.array([reveal[np.argmin(abs(reveal - o))] - o for o in onsets if np.min(abs(reveal - o)) < 0.6]) + off
m = np.median(d); worst = d[np.argmax(abs(d))]
print(f'{len(onsets)} phrase onsets, {len(d)} matched: caption minus voice median {m:+.3f} s, IQR {np.percentile(d,25):+.3f}..{np.percentile(d,75):+.3f}, worst {worst:+.3f} s, beyond 0.1 s: {int(np.sum(abs(d) > 0.1))}')
print('PASS' if abs(m) <= 0.04 and np.sum(abs(d) > 0.1) == 0 else 'CHECK')
