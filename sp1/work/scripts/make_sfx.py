# Chat and story sounds for Special No. 1, synthesised and seeded (no third-party audio services).
import numpy as np, wave
from scipy.signal import butter, lfilter
SR = 48000; OUT = "/home/user/gcp/sp1/media/sfx/"; rng = np.random.default_rng(1932)
t_ = lambda d: np.arange(int(SR * d)) / SR
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], "band"); return lfilter(b, a, x)
def lp(x, fc): b, a = butter(2, fc / (SR / 2)); return lfilter(b, a, x)
def hp(x, fc): b, a = butter(2, fc / (SR / 2), "high"); return lfilter(b, a, x)
def save(name, x, peak=0.89, stereo=None):
    if stereo is None:
        x = np.asarray(x, float); x = x / (np.max(np.abs(x)) + 1e-9) * peak
        n = len(x); r = min(n // 3, int(0.015 * SR)); x[-r:] *= np.linspace(1, 0, r)
        st = np.stack([x, x], 1)
    else: st = stereo / (np.max(np.abs(stereo)) + 1e-9) * peak
    with wave.open(OUT + name, "wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
def blip(f0, f1, d, dec):
    t = t_(d); return np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, len(t))) / SR) * np.exp(-t * dec) * np.minimum(1, t / 0.003)
def place(x, s, at):
    i = int(at * SR); x[i:i + len(s)] += s[:max(0, len(x) - i)]
# incoming message: a soft woody double "bloop"
x = np.zeros(int(SR * 0.28)); place(x, blip(620, 900, 0.12, 34), 0); place(x, 0.8 * blip(980, 1320, 0.14, 30), 0.07); save("wa-in.wav", x)
# second incoming variant (a touch higher) so runs of messages do not sound mechanical
x = np.zeros(int(SR * 0.28)); place(x, blip(700, 1000, 0.12, 34), 0); place(x, 0.8 * blip(1100, 1480, 0.14, 30), 0.065); save("wa-in2.wav", x)
# sent message: short air swoosh then a high pop
t = t_(0.32); sw = bp(rng.standard_normal(len(t)), 900, 5000) * np.sin(np.pi * np.clip(t / 0.18, 0, 1)) ** 2 * (t < 0.18)
x = 0.5 * sw; place(x, blip(1200, 1900, 0.12, 40), 0.15); save("wa-out.wav", x)
# typing: soft key taps (about 1.6 s)
x = np.zeros(int(SR * 1.7)); tt = 0.03
while tt < 1.6:
    k = t_(0.03); c = hp(rng.standard_normal(len(k)), 1800) * np.exp(-k * 260) + 0.4 * np.sin(2 * np.pi * rng.uniform(380, 520) * k) * np.exp(-k * 180)
    place(x, c * rng.uniform(0.5, 1.0), tt); tt += rng.uniform(0.07, 0.17)
save("wa-typing.wav", x, peak=0.6)
# notification chime: three bright ascending tones
x = np.zeros(int(SR * 1.1))
for i, f in enumerate((1046.5, 1318.5, 1568.0)):
    t = t_(0.7); place(x, (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)) * np.exp(-t * 7) * np.minimum(1, t / 0.004), i * 0.09)
save("wa-notify.wav", x)
# pin: metallic click + low thunk
t = t_(0.35); x = 0.9 * np.sin(2 * np.pi * 140 * t) * np.exp(-t * 30) + hp(rng.standard_normal(len(t)), 3000) * np.exp(-t * 160) + 0.4 * np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 40); save("wa-pin.wav", x)
# phone vibrating on a table: two buzzes
x = np.zeros(int(SR * 1.3))
for s0 in (0.0, 0.65):
    t = t_(0.42); b = np.sign(np.sin(2 * np.pi * 170 * t)) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * t)); b = lp(b, 900) * np.sin(np.pi * t / 0.42) ** 0.5
    place(x, b, s0)
save("vibrate.wav", x, peak=0.7)
# unlock click
t = t_(0.12); save("unlock.wav", hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 200) + 0.5 * blip(1800, 1500, 0.06, 80)[:len(t)] if len(blip(1800, 1500, 0.06, 80)) >= len(t) else hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 200))
# read receipt: two tiny ticks
x = np.zeros(int(SR * 0.2)); place(x, blip(2600, 2600, 0.03, 160), 0); place(x, blip(3000, 3000, 0.03, 160), 0.06); save("ticks.wav", x, peak=0.5)
# clock flip
t = t_(0.08); save("clock.wav", hp(rng.standard_normal(len(t)), 4000) * np.exp(-t * 300) + 0.6 * np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 120), peak=0.5)
# night crickets bed, 24 s, stereo, loopable-ish
d = 24.0; t = t_(d); L = np.zeros(len(t)); R = np.zeros(len(t))
for k in range(9):
    f = rng.uniform(3900, 5200); rate = rng.uniform(2.2, 3.6); ph = rng.uniform(0, 6.28); pan = rng.uniform(0.15, 0.85)
    chirp = (np.sin(2 * np.pi * rate * t + ph) > 0.55).astype(float); pulses = (np.sin(2 * np.pi * 52 * t) > 0).astype(float)
    s = np.sin(2 * np.pi * f * t) * lp(chirp * pulses, 400) * rng.uniform(0.3, 1)
    L += s * (1 - pan); R += s * pan
bed = lp(rng.standard_normal(len(t)), 300) * 0.25
L += bed; R += bed
fade = np.minimum(1, np.minimum(t, d - t) / 1.5); save("crickets.wav", None, stereo=np.stack([L * fade, R * fade], 1) * 1.0)
# film projector rattle, 6 s
t = t_(6.0); x = np.zeros(len(t))
for i in range(int(6.0 * 24)):
    k = t_(0.02); place(x, hp(rng.standard_normal(len(k)), 1500) * np.exp(-k * 300) * (1 if i % 2 else 0.6), i / 24)
x += 0.3 * lp(rng.standard_normal(len(t)), 220) + 0.15 * np.sin(2 * np.pi * 96 * t)
x *= np.minimum(1, np.minimum(t, 6 - t) / 0.4); save("projector.wav", x, peak=0.7)
# camera shutter / film camera start
t = t_(0.25); save("shutter.wav", hp(rng.standard_normal(len(t)), 1500) * (np.exp(-t * 90) + 0.7 * np.exp(-np.maximum(0, t - 0.09) * 90) * (t > 0.09)))
# fire crackle, 5 s
t = t_(5.0); x = 0.5 * lp(rng.standard_normal(len(t)), 500)
for _ in range(160):
    k = t_(0.015); place(x, hp(rng.standard_normal(len(k)), 2000) * np.exp(-k * 400) * rng.uniform(0.3, 1.5), rng.uniform(0, 4.9))
x *= np.minimum(1, np.minimum(t, 5 - t) / 0.6); save("fire.wav", x, peak=0.7)
# plane cabin hum, 6 s
t = t_(6.0); x = lp(rng.standard_normal(len(t)), 260) + 0.4 * np.sin(2 * np.pi * 118 * t) + 0.2 * bp(rng.standard_normal(len(t)), 600, 1200)
x *= np.minimum(1, np.minimum(t, 6 - t) / 1.0); save("cabin.wav", x, peak=0.6)
# curtain draw: rings sliding
t = t_(0.7); x = bp(rng.standard_normal(len(t)), 1500, 6000) * np.sin(np.pi * t / 0.7) * (0.7 + 0.3 * np.sin(2 * np.pi * 31 * t)); save("curtain.wav", x, peak=0.6)
# car door + engine pull-away (Kremlin car), 3 s
t = t_(3.0); x = np.zeros(len(t)); k = t_(0.2); place(x, np.sin(2 * np.pi * 90 * k) * np.exp(-k * 25) + hp(rng.standard_normal(len(k)), 800) * np.exp(-k * 60) * 0.5, 0.0)
e = t_(2.5); eng = lp(np.sign(np.sin(2 * np.pi * np.cumsum(np.linspace(38, 70, len(e))) / SR)), 500) * np.sin(np.pi * e / 2.5) * 0.6; place(x, eng, 0.45); save("car.wav", x)
# stamp-ish deep thud for the pinned cards' landing
t = t_(0.6); save("pin-thud.wav", np.sin(2 * np.pi * np.cumsum(np.linspace(110, 48, len(t))) / SR) * np.exp(-t * 9) + 0.3 * hp(rng.standard_normal(len(t)), 1200) * np.exp(-t * 50))
print("ok")
