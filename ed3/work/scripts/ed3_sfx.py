# Edition 3 sound design (synthesised, seeded): one rifle shot, rain bed, pencil sketching, eraser, pen nib, string peel,
# ballot drop, distant fire with a long tail, map pin, rubber-stamp, queue murmur.
import numpy as np, wave
from scipy.signal import butter, lfilter
SR = 48000; OUT = "/home/user/gcp/ed3/media/sfx/"; rng = np.random.default_rng(1956)
t_ = lambda d: np.arange(int(SR * d)) / SR
N = lambda d: rng.standard_normal(int(SR * d))
def bp(x, lo=None, hi=None, o=2):
    if lo and hi: b, a = butter(o, [lo / (SR / 2), hi / (SR / 2)], 'band')
    elif lo: b, a = butter(o, lo / (SR / 2), 'high')
    else: b, a = butter(o, hi / (SR / 2), 'low')
    return lfilter(b, a, x)
def save(name, x, peak=0.89):
    x = np.asarray(x, float); x = x / (np.max(np.abs(x)) + 1e-9) * peak; n = len(x); f = np.ones(n)
    r = min(n // 3, int(0.02 * SR)); f[-r:] = np.linspace(1, 0, r); f[:64] = np.linspace(0, 1, 64)
    with wave.open(OUT + name, "wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.stack([x * f, x * f], 1) * 32767).astype(np.int16).tobytes())
def place(buf, s, at): i = int(at * SR); j = min(len(buf), i + len(s)); buf[i:j] += s[:j - i]; return buf
# one rifle shot: sharp crack + body + long outdoor tail
t = t_(2.6); crack = bp(N(2.6), 800, 9000) * np.exp(-t * 60); body = bp(N(2.6), 80, 900) * np.exp(-t * 9)
tail = bp(N(2.6), 150, 1500) * np.exp(-t * 2.2) * 0.25
save("rifle.wav", crack * 1.2 + body + tail)
# rain bed (loop 8 s): hiss + drops
t = t_(8); x = bp(N(8), 1500, 9000) * 0.25 + bp(N(8), 200, 1200) * 0.12
for _ in range(900):
    d = bp(N(.01), 2000, 8000) * np.exp(-np.arange(int(SR * .01)) / 50); place(x, d * rng.uniform(.1, .6), rng.uniform(0, 7.99))
save("rain.wav", x, 0.6)
# pencil sketching: graphite scratch in strokes
t = t_(1.6); env = np.abs(np.sin(2 * np.pi * 3.2 * t)) ** 1.5; save("pencil.wav", bp(N(1.6), 2500, 9000) * env * (0.6 + 0.4 * rng.random(len(t))))
# eraser: rubbery low scrub
t = t_(1.0); save("eraser.wav", bp(N(1.0), 200, 1400) * np.abs(np.sin(2 * np.pi * 5 * t)) ** 2)
# pen nib: fine scratchy line
t = t_(1.2); save("nib.wav", bp(N(1.2), 3500, 11000) * (0.5 + 0.5 * np.sin(2 * np.pi * 1.7 * t) ** 2) * np.sin(np.pi * t / 1.2) ** .4)
# string peeled off card (tape peel)
t = t_(0.7); x = np.zeros(len(t))
for k in range(120):
    c = bp(N(.004), 1500, 9000) * np.exp(-np.arange(int(SR * .004)) / 40); place(x, c * rng.uniform(.3, 1), k * 0.0055 + rng.uniform(0, .002))
save("peel.wav", x + bp(N(.7), 300, 2000) * np.sin(np.pi * t / .7) * .15)
# ballot dropping into a box: paper slide + wooden knock
x = np.zeros(int(SR * .7)); place(x, bp(N(.25), 1500, 7000) * np.sin(np.pi * t_(.25) / .25), 0)
place(x, (np.sin(2 * np.pi * 160 * t_(.3)) + bp(N(.3), 200, 2000) * .5) * np.exp(-t_(.3) * 22), .3); save("ballot.wav", x)
# distant fire, swelling then cut to silence (Adibo dali)
t = t_(4.0); x = bp(N(4), 60, 600) * np.clip(t / 1.5, 0, 1) * 0.6
for _ in range(220):
    c = bp(N(.01), 1200, 7000) * np.exp(-np.arange(int(SR * .01)) / 70); place(x, c * rng.uniform(.2, .9), rng.uniform(0, 3.4))
x[int(3.4 * SR):] *= np.linspace(1, 0, len(x) - int(3.4 * SR)) ** 3
save("fire-far.wav", bp(x, None, 3500))
# map pin push
t = t_(.15); save("pin.wav", np.sin(2 * np.pi * 900 * t) * np.exp(-t * 60) + bp(N(.15), 2000, 6000) * np.exp(-t * 90) * .4)
# queue murmur (many voices, low)
t = t_(5); m = np.zeros(len(t))
for _ in range(18):
    f = rng.uniform(100, 240); ph = np.cumsum(f * (1 + 0.1 * np.sin(2 * np.pi * rng.uniform(.3, .9) * t))) / SR
    m += bp(2 * (ph % 1) - 1, 150, 1000) * np.clip(np.sin(2 * np.pi * rng.uniform(.5, 2) * t + rng.uniform(0, 6)), 0, 1) ** 2
save("queue.wav", m, 0.6)
print("ok")
