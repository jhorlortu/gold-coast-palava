# Two people grumbling at each other: buzzy glottal sources with wandering pitch, syllable envelopes
# and vowel formants, panned apart. Seeded, deterministic.
import numpy as np, wave
from scipy.signal import butter, lfilter
SR = 48000; rng = np.random.default_rng(5)
def voice(dur, f0, formants, rate):
    n = int(SR * dur); t = np.arange(n) / SR
    walk = np.cumsum(rng.standard_normal(n)) / np.sqrt(SR) * 18
    f = f0 * (1 + 0.12 * np.sin(2 * np.pi * 0.7 * t + rng.uniform(0, 6))) + walk
    ph = np.cumsum(f) / SR
    src = 2 * (ph % 1) - 1 + 0.05 * rng.standard_normal(n)            # sawtooth-ish glottal buzz
    out = np.zeros(n)
    # vowel changes every syllable: interpolate between formant sets
    syl = np.clip(np.sin(2 * np.pi * rate * t + np.cumsum(rng.standard_normal(n)) / SR * 4), 0, 1) ** 1.5
    for (lo, hi, g) in formants:
        b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], btype='band'); out += g * lfilter(b, a, src)
    gaps = (rng.uniform(size=int(dur * 3) + 1) > 0.25).repeat(int(SR / 3) + 1)[:n]   # little pauses between phrases
    env = syl * gaps
    k = int(SR * .03); env = np.convolve(env, np.ones(k) / k, 'same')
    return out * env
dur = 2.8
a = voice(dur, 118, [(450, 800, 1.0), (950, 1400, .55), (2300, 2900, .18)], 4.6)   # lower, gruff
b = voice(dur, 165, [(550, 950, 1.0), (1200, 1800, .5), (2500, 3200, .15)], 5.4)   # higher, indignant
b = np.roll(b, int(.35 * SR))
fade = np.ones(len(a)); r = int(.6 * SR); fade[-r:] = np.cos(np.linspace(0, np.pi / 2, r)) ** 2; fade[:int(.05*SR)] = np.linspace(0, 1, int(.05*SR))
L = (a * 0.9 + b * 0.45) * fade; R = (a * 0.45 + b * 0.9) * fade
st = np.stack([L, R], 1); st = st / np.max(np.abs(st)) * 0.85
with wave.open("/home/user/gcp/project/media/sfx/syn-grumble.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
print("ok")
