# Edition 2 sound design (synthesised, seeded): clear, distinct effects for every new picture and the living Nest.
# Room tone of the Nest (fan + night insects + distant lagoon), clock tick, typewriter key, chocolate snap, wrapper
# crinkle, shop shutter, cash register, ship horn + waves, fire crackle, crowd chant, slide-down (price cut),
# scissors snip, bicycle bell, machine grind, stamp thump, chart tick, ka-chunk lever, rising riser, vinyl crackle,
# hit (bass stinger), sparkle (gold), pen scribble, string tie, paper bundle drop, map whoosh-arrow.
import numpy as np, wave
from scipy.signal import butter, lfilter
SR = 48000; OUT = "/home/user/gcp/ed2/media/sfx/"; rng = np.random.default_rng(2026)
t_ = lambda d: np.arange(int(SR * d)) / SR
def bp(x, lo=None, hi=None, o=2):
    if lo and hi: b, a = butter(o, [lo / (SR / 2), hi / (SR / 2)], 'band')
    elif lo: b, a = butter(o, lo / (SR / 2), 'high')
    else: b, a = butter(o, hi / (SR / 2), 'low')
    return lfilter(b, a, x)
N = lambda d: rng.standard_normal(int(SR * d))
def save(name, x, peak=0.89, st=None):
    x = np.asarray(x, float); x = x / (np.max(np.abs(x)) + 1e-9) * peak
    n = len(x); f = np.ones(n); r = min(n // 3, int(0.02 * SR)); f[-r:] = np.linspace(1, 0, r); f[:min(64, n)] = np.linspace(0, 1, min(64, n))
    L = x * f; R = (st if st is not None else x) * f
    with wave.open(OUT + name, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.stack([L, R], 1) * 32767).astype(np.int16).tobytes())
def place(buf, s, at):
    i = int(at * SR); j = min(len(buf), i + len(s)); buf[i:j] += s[:j - i]; return buf

# --- the Nest at night: fan whoosh cycle + crickets + distant lagoon, 20 s, loopable bed
t = t_(20); fan = bp(N(20), 80, 900) * (0.55 + 0.45 * np.sin(2 * np.pi * 3.2 * t) ** 2) * 0.35
cr = np.zeros(len(t))
for k in range(5):
    f0 = rng.uniform(3800, 5200); rate = rng.uniform(14, 22); ph = rng.uniform(0, 6)
    chirp = np.sin(2 * np.pi * f0 * t) * (np.sin(2 * np.pi * rate * t + ph) > 0.6) * (np.sin(2 * np.pi * rng.uniform(.15, .35) * t + ph) > -0.2)
    cr += chirp * rng.uniform(.05, .1)
lag = bp(N(20), 60, 400) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.09 * t)) * 0.5
L = fan + cr + lag; R = fan + np.roll(cr, 900) + np.roll(lag, 3000)
save("nest-room.wav", L, 0.6, R / (np.max(np.abs(L)) + 1e-9) * np.max(np.abs(L)))
# clock tick (one tick; the builder lays one per second)
t = t_(0.06); save("tick.wav", bp(N(0.06), 2500, 7000) * np.exp(-t * 160) + 0.4 * np.sin(2 * np.pi * 2100 * t) * np.exp(-t * 90))
# typewriter key + carriage bell
t = t_(0.09); save("key.wav", bp(N(0.09), 1200, 6000) * np.exp(-t * 90) + 0.6 * np.sin(2 * np.pi * 220 * t) * np.exp(-t * 70))
t = t_(1.0); save("carriage-bell.wav", sum(a * np.sin(2 * np.pi * f * t) for f, a in ((2400, 1), (4810, .4), (7300, .15))) * np.exp(-t * 5))
# chocolate snap: sharp crack + short woody body
t = t_(0.25); save("snap.wav", bp(N(0.25), 1500, 9000) * np.exp(-t * 70) + 0.7 * np.sin(2 * np.pi * 620 * t) * np.exp(-t * 55))
# wrapper crinkle: bursts of filtered clicks
x = np.zeros(int(SR * 0.9))
for _ in range(70):
    c = bp(N(0.012), 2500, 11000) * np.exp(-np.arange(int(SR * .012)) / 90); place(x, c * rng.uniform(.2, 1), rng.uniform(0, .85))
save("crinkle.wav", x)
# shop shutter rolling down: ratchet clicks speeding up + metal rumble, slam at the end
d = 1.4; x = np.zeros(int(SR * (d + .6))); tt = 0.0; k = 0
while tt < d:
    c = bp(N(0.02), 1500, 6000) * np.exp(-np.arange(int(SR * .02)) / 120); place(x, c * (0.5 + 0.5 * tt / d), tt); tt += 0.09 * (1 - 0.6 * tt / d); k += 1
x[:int(SR * d)] += bp(N(d), 100, 900) * np.linspace(.2, .6, int(SR * d)) * 0.5
t = t_(0.6); place(x, (bp(N(0.6), 60, 2500) + 1.5 * np.sin(2 * np.pi * 95 * t)) * np.exp(-t * 9), d)
save("shutter.wav", x)
# cash register: bell + drawer
t = t_(1.0); bell = sum(a * np.sin(2 * np.pi * f * t) for f, a in ((1568, 1), (2093, .7), (3136, .3))) * np.exp(-t * 4)
x = np.zeros(int(SR * 1.2)); place(x, bp(N(.08), 800, 5000) * np.exp(-t_(.08) * 60), 0); place(x, bell, .05); place(x, bp(N(.3), 200, 2000) * np.exp(-t_(.3) * 12) * .6, .35)
save("register.wav", x)
# ship horn + waves
t = t_(2.6); horn = sum(a * np.sin(2 * np.pi * f * t) for f, a in ((110, 1), (220, .6), (330, .35), (440, .2))) * np.clip(t / .15, 0, 1) * np.clip((2.4 - t) / .4, 0, 1)
waves = bp(N(2.6), 150, 2500) * (0.4 + 0.6 * np.sin(2 * np.pi * 0.5 * t) ** 2)
save("ship.wav", horn * 0.7 + waves * 0.5)
t = t_(4); save("waves.wav", bp(N(4), 120, 3000) * (0.3 + 0.7 * np.sin(np.pi * t / 2) ** 4))
# fire crackle with a roar underneath
t = t_(3); x = bp(N(3), 80, 700) * 0.5 * np.sin(np.pi * t / 3)
for _ in range(160):
    c = bp(N(.01), 1500, 9000) * np.exp(-np.arange(int(SR * .01)) / 60); place(x, c * rng.uniform(.3, 1.2), rng.uniform(0, 2.95))
save("fire.wav", x)
# crowd chant: rhythmic shouted 'hey' formants
t = t_(3.2); x = np.zeros(len(t))
for b in np.arange(0.1, 3.0, 0.62):
    for v in range(10):
        f0 = rng.uniform(140, 260); d = .32; tt = t_(d); sw = np.sin(2 * np.pi * np.cumsum(np.full(len(tt), f0)) / SR)
        voice = bp(np.sign(sw) * 0.5 + bp(N(d), 600, 2500) * .4, 300, 2600) * np.sin(np.pi * tt / d) ** 2
        place(x, voice * rng.uniform(.4, 1), b + rng.uniform(0, .06))
save("chant.wav", x)
# price cut: descending slide + low thud
t = t_(0.9); f = np.linspace(900, 140, len(t)); slide = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.5)
x = np.zeros(int(SR * 1.3)); place(x, slide * .7, 0); place(x, np.sin(2 * np.pi * 60 * t_(.4)) * np.exp(-t_(.4) * 10), .85)
save("drop.wav", x)
# scissors snip
x = np.zeros(int(SR * .3)); place(x, bp(N(.03), 3000, 10000) * np.exp(-t_(.03) * 140), 0); place(x, bp(N(.04), 2500, 9000) * np.exp(-t_(.04) * 100), .12)
save("snip.wav", x)
# bicycle bell (two rings)
t = t_(.5); ring = sum(a * np.sin(2 * np.pi * f * t) for f, a in ((2800, 1), (3700, .6), (5600, .25))) * np.exp(-t * 9) * (1 + .3 * np.sin(2 * np.pi * 30 * t))
x = np.zeros(int(SR * .9)); place(x, ring, 0); place(x, ring, .22); save("bike-bell.wav", x)
# machine grind (factory)
t = t_(2.5); save("grind.wav", (bp(N(2.5), 80, 1200) * (0.6 + 0.4 * np.sin(2 * np.pi * 6 * t)) + 0.5 * np.sign(np.sin(2 * np.pi * 47 * t)) * .3) * np.clip(t / .3, 0, 1) * np.clip((2.5 - t) / .5, 0, 1))
# heavy stamp thump
t = t_(.35); save("thump.wav", (np.sin(2 * np.pi * np.cumsum(np.linspace(140, 50, len(t))) / SR) + bp(N(.35), 200, 3000) * .4) * np.exp(-t * 14))
# chart tick (soft high blip)
t = t_(.08); save("blip.wav", np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 50))
# lever ka-chunk
x = np.zeros(int(SR * .5)); place(x, bp(N(.05), 600, 4000) * np.exp(-t_(.05) * 80), 0); place(x, (np.sin(2 * np.pi * 120 * t_(.2)) + bp(N(.2), 300, 3000) * .5) * np.exp(-t_(.2) * 25), .12)
save("kachunk.wav", x)
# riser (tension into a reveal)
t = t_(2.0); f = np.linspace(200, 1400, len(t)); save("riser.wav", (np.sin(2 * np.pi * np.cumsum(f) / SR) * .4 + bp(N(2.0), 1000, 8000) * .5) * (t / 2) ** 2)
# vinyl crackle bed
t = t_(4); x = bp(N(4), 300, 3000) * 0.05
for _ in range(220):
    c = bp(N(.004), 2000, 12000) * np.exp(-np.arange(int(SR * .004)) / 30); place(x, c * rng.uniform(.2, 1), rng.uniform(0, 3.99))
save("crackle.wav", x)
# bass hit (low stinger for big reveals)
t = t_(1.6); save("hit.wav", (np.sin(2 * np.pi * np.cumsum(np.linspace(90, 38, len(t))) / SR) + .25 * bp(N(1.6), 60, 400)) * np.exp(-t * 3.5) + bp(N(1.6), 2000, 9000) * np.exp(-t * 30) * .3)
# sparkle (gold): rising glints
x = np.zeros(int(SR * 1.0))
for k, f0 in enumerate((2637, 3136, 3520, 4186, 5274)):
    place(x, np.sin(2 * np.pi * f0 * t_(.5)) * np.exp(-t_(.5) * 9) * .7, k * .08)
save("sparkle.wav", x)
# pen scribble
t = t_(1.0); save("scribble.wav", bp(N(1.0), 1500, 7000) * (0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 7 * t))) * np.sin(np.pi * t) ** .5)
# bundle tied: string pull + thud
x = np.zeros(int(SR * 1.0)); place(x, bp(N(.35), 800, 5000) * np.sin(np.pi * t_(.35) / .35), 0); place(x, (np.sin(2 * np.pi * 80 * t_(.3)) + bp(N(.3), 200, 2000) * .6) * np.exp(-t_(.3) * 16), .5)
save("bundle.wav", x)
# arrow whoosh across a map
t = t_(.8); save("swoop.wav", bp(N(.8), 500, 6000) * np.sin(np.pi * t / .8) ** 2 * np.linspace(.4, 1, len(t)))
print("ok")
