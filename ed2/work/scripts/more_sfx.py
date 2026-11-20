# More pop-up sounds for Edition 1 (synthesised, seeded): bubble pops, wood knocks, glass dings, paper slaps,
# soft whips, bells, coin clinks, a crowd murmur, rockets, wind and a heartbeat thud.
import numpy as np, wave
SR = 48000; OUT = "/home/user/gcp/ed1/media/sfx/"; rng = np.random.default_rng(23)
t_ = lambda d: np.arange(int(SR * d)) / SR
def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.0
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y
hp = lambda x, fc: x - lp(x, fc)
def save(name, x):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89; n = len(x); f = np.ones(n); r = min(n // 3, int(0.02 * SR)); f[-r:] = np.linspace(1, 0, r)
    st = np.stack([x * f, x * f], 1)
    with wave.open(OUT + name, "wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
# bubble pops at three pitches
for k, f0 in enumerate((520, 700, 940)):
    t = t_(0.14); s = np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f0 * 2.2, len(t))) / SR) * np.exp(-t * 38)
    save(f"pop-{k + 1}.wav", s)
# wood knock
t = t_(0.18); save("knock.wav", (np.sin(2 * np.pi * 180 * t) + 0.5 * np.sin(2 * np.pi * 410 * t)) * np.exp(-t * 45) + hp(rng.standard_normal(len(t)), 2000) * np.exp(-t * 120) * 0.3)
# glass ding
t = t_(0.9); save("glass.wav", sum(a * np.sin(2 * np.pi * f * t) for f, a in ((1760, 1), (2637, .5), (3520, .25))) * np.exp(-t * 6))
# paper slap
t = t_(0.2); save("paper-slap.wav", hp(rng.standard_normal(len(t)), 900) * np.exp(-t * 30))
# soft whip
t = t_(0.35); n = hp(lp(rng.standard_normal(len(t)), 7000), 1200) * np.sin(np.pi * np.linspace(0, 1, len(t))) ** 3; save("whip.wav", n)
# bell (for the stool's bells)
t = t_(1.4); save("bell.wav", sum(a * np.sin(2 * np.pi * f * t) for f, a in ((880, 1), (1318, .6), (2093, .3), (2793, .15))) * np.exp(-t * 3.2))
# coin clinks
x = np.zeros(int(SR * 0.9))
for s0 in (0.0, 0.11, 0.24, 0.31, 0.46):
    t = t_(0.25); c = sum(np.sin(2 * np.pi * f * t) for f in (3100 + rng.uniform(-200, 200), 4700)) * np.exp(-t * 28)
    i = int(s0 * SR); x[i:i + len(c)] += c * rng.uniform(.5, 1)
save("coins.wav", x)
# crowd murmur (chiefs gathering)
t = t_(4.0); m = np.zeros(len(t))
for _ in range(14):
    f = rng.uniform(110, 220); ph = np.cumsum(f * (1 + 0.1 * np.sin(2 * np.pi * rng.uniform(.3, .8) * t))) / SR
    v = (2 * (ph % 1) - 1); env = np.clip(np.sin(2 * np.pi * rng.uniform(2, 5) * t + rng.uniform(0, 6)), 0, 1) ** 2
    m += lp(v, 900) * env
save("murmur.wav", m * np.sin(np.pi * np.linspace(0, 1, len(t))) ** .5)
# rocket whoosh + crackle (Congreve rockets)
t = t_(1.6); rk = hp(lp(rng.standard_normal(len(t)), 5000), 300) * np.linspace(.2, 1, len(t)) ** 2
cr = np.zeros(len(t))
for _ in range(60):
    i = rng.integers(0, len(t) - 300); cr[i:i + 300] += rng.standard_normal(300) * np.exp(-np.arange(300) / 40)
save("rocket.wav", rk + cr * 0.4)
# wind (forest)
t = t_(5); save("wind.wav", lp(rng.standard_normal(len(t)), 600) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.25 * t)))
# heartbeat thud
t = t_(0.9); hb = np.zeros(len(t))
for s0 in (0, 0.28):
    i = int(s0 * SR); tt = t_(0.25); hb[i:i + len(tt)] += np.sin(2 * np.pi * 52 * tt) * np.exp(-tt * 20)
save("heartbeat.wav", hb)
print("ok")
