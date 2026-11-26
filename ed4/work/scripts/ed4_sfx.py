# Edition 4 synthesized effects (seeded): shells poured onto a wooden floor (long), a single shell set down,
# a light paper rustle, a soft glass "glint" for light through a note, a water drip and a tap squeak.
import numpy as np, wave, os
SR = 48000; OUT = '/home/user/gcp/ed4/media/sfx'; rng = np.random.default_rng(4)
def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
def click(f, d=0.025, sharp=1.0):
    t = np.arange(int(SR * d)) / SR
    return (np.sin(2 * np.pi * f * t) * 0.6 + rng.standard_normal(len(t)) * 0.4 * sharp) * np.exp(-t * 180)
def shells(dur, rate):
    x = np.zeros(int(SR * (dur + 0.3)))
    n = int(dur * rate); ts = np.sort(rng.uniform(0, dur, n))
    for t0 in ts:
        dens = 1.0 if t0 < dur * 0.8 else (dur - t0) / (dur * 0.2)
        c = click(rng.uniform(2200, 5200), rng.uniform(0.012, 0.03)) * rng.uniform(0.2, 1.0) * dens
        i = int(t0 * SR); x[i:i + len(c)] += c[:len(x) - i]
    # wooden floor body
    b = np.convolve(x, np.exp(-np.arange(int(SR * 0.04)) / SR * 60) * 0.02, 'same'); return x + b
save('shells-pour.wav', shells(4.5, 260))
save('shell-set.wav', np.concatenate([click(3400, 0.04), np.zeros(1200), click(2800, 0.03) * 0.5]))
t = np.arange(int(SR * 0.6)) / SR
save('rustle.wav', rng.standard_normal(len(t)) * np.exp(-((t - 0.25) / 0.15) ** 2) * (0.5 + 0.5 * np.sin(2 * np.pi * 23 * t)))
t = np.arange(int(SR * 1.2)) / SR
save('glint.wav', sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in [(2093, 3), (3136, 4), (4186, 6)]))
t = np.arange(int(SR * 0.35)) / SR
save('drip.wav', np.sin(2 * np.pi * (900 + 1400 * t) * t) * np.exp(-t * 18))
save('squeak.wav', np.sin(2 * np.pi * (1300 + 300 * np.sin(2 * np.pi * 9 * t)) * t) * np.exp(-((t - 0.17) / 0.12) ** 2) * 0.6)
print('ok')
