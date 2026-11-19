# Synthesised sound effects (deterministic, seeded). Writes 48 kHz stereo WAVs into media/sfx.
import numpy as np, wave
SR = 48000; OUT = "/home/user/gcp/project/media/sfx/"
rng = np.random.default_rng(11)
t_ = lambda d: np.arange(int(SR * d)) / SR
def env(n, a=0.005, r=0.05):
    e = np.ones(n); A = int(SR * a); R = int(SR * r)
    if A: e[:A] = np.linspace(0, 1, A)
    if R: e[-R:] *= np.linspace(1, 0, R)
    return e
def lp(x, fc):  # one-pole low-pass
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); s = 0.0
    for i, v in enumerate(x): s = (1 - a) * v + a * s; y[i] = s
    return y
def hp(x, fc): return x - lp(x, fc)
def save(name, x, pan=0.0):
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.89
    st = np.stack([x * (1 - max(0, pan)), x * (1 + min(0, pan))], 1)
    with wave.open(OUT + name, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
noise = lambda d: rng.standard_normal(int(SR * d))
# 1. landline ring: two 0.4 s bursts of 440+480 Hz bell, tremolo at 20 Hz
t = t_(0.4); burst = (np.sin(2*np.pi*440*t) + np.sin(2*np.pi*480*t)) * (0.6 + 0.4*np.sign(np.sin(2*np.pi*20*t))) * env(len(t), .005, .03)
save("syn-phone-ring.wav", np.concatenate([burst, np.zeros(int(SR*.2)), burst, np.zeros(int(SR*.3))]))
# 2. traffic horns: three short honks at different pitches (square-ish, low-passed)
def honk(f, d):
    t = t_(d); x = np.tanh(3*np.sin(2*np.pi*f*t)) + 0.6*np.tanh(3*np.sin(2*np.pi*f*1.26*t)); return lp(x, 2200) * env(len(t), .01, .04)
seq = [honk(392, .22), np.zeros(int(SR*.12)), honk(330, .35), np.zeros(int(SR*.18)), honk(415, .16), np.zeros(int(SR*.06)), honk(415, .16)]
save("syn-horns.wav", np.concatenate(seq) + 0.05*lp(noise(sum(len(s) for s in seq)/SR), 300))
# 3. message ding: generic two-note chime, three times
def chime(f):
    t = t_(.32); return (np.sin(2*np.pi*f*t) + .35*np.sin(2*np.pi*2*f*t)) * np.exp(-t*14)
d = np.concatenate([chime(1175), chime(1568)])
save("syn-dings.wav", np.concatenate([d, np.zeros(int(SR*.15)), d*0.8, np.zeros(int(SR*.12)), chime(1568)*0.7]))
save("syn-ding.wav", chime(1568))
# 4. rain: filtered noise bed plus random droplets, 10 s
n = hp(lp(noise(10), 6000), 400) * 0.5
drops = np.zeros_like(n)
for _ in range(900):
    i = rng.integers(0, len(n) - 2000); tt = np.arange(1500)/SR; drops[i:i+1500] += np.sin(2*np.pi*rng.uniform(1800, 4200)*tt) * np.exp(-tt*120) * rng.uniform(.1, .4)
save("syn-rain.wav", (n + drops) * env(len(n), .8, 1.2))
# 5. airplane take-off: rising rumble + jet whine sweep, 4.5 s
t = t_(4.5); rum = lp(noise(4.5), 180) * np.linspace(.4, 1, len(t)) * 3
whine = np.sin(2*np.pi*np.cumsum(np.linspace(600, 2400, len(t)))/SR) * np.linspace(0, .25, len(t))
roar = hp(lp(noise(4.5), 2500), 300) * np.linspace(.1, .8, len(t))
save("syn-takeoff.wav", (rum + whine + roar) * env(len(t), .6, 1.2))
# 6. suspense sting, 4 s: low D drone, two heartbeats, rising tense cluster
t = t_(4.0)
drone = sum(np.sin(2*np.pi*f*t) for f in (73.4, 73.9, 110)) * 0.5
hb = np.zeros_like(t)
for s0 in (0.5, 0.78, 1.9, 2.18, 3.2, 3.45):
    i = int(s0*SR); tt = np.arange(int(.25*SR))/SR; hb[i:i+len(tt)] += np.sin(2*np.pi*55*tt) * np.exp(-tt*22) * 1.6
gl = sum(np.sin(2*np.pi*np.cumsum(np.linspace(f, f*1.12, len(t)))/SR) for f in (587, 622, 880)) * np.linspace(0, .22, len(t))
save("syn-suspense.wav", (drone*np.linspace(.3, 1, len(t)) + hb + gl) * env(len(t), .3, .5))
# 7. mud squelch
t = t_(.45); sq = lp(noise(.45), 700) * np.sin(2*np.pi*np.cumsum(np.linspace(140, 60, len(t)))/SR) * 3
save("syn-mud.wav", sq * env(len(t), .01, .2))
# 8. paper tear / reveal
t = t_(.35); tear = hp(noise(.35), 1500) * (np.abs(np.sin(2*np.pi*35*t)) ** 3) * np.linspace(1, .3, len(t))
save("syn-tear.wav", tear * env(len(t), .005, .08))
# 9. soft character pop ("boop"), subtle
t = t_(.22); boop = np.sin(2*np.pi*np.cumsum(np.linspace(520, 780, len(t)))/SR) * np.exp(-t*16)
save("syn-boop.wav", boop * env(len(t), .004, .05))
# 10. tick (for text hits)
t = t_(.06); tick = hp(noise(.06), 2500) * np.exp(-t*90)
save("syn-tick.wav", tick)
# 11. water splash / waves short
t = t_(1.6); wv = lp(noise(1.6), 1800) * np.sin(np.pi*np.linspace(0, 1, len(t)))**2
save("syn-splash.wav", wv)
print("ok")
