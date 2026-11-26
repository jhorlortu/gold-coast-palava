# Suspense score for Special No. 2, synthesized in code (house rule: score and SFX made in code unless a track is
# supplied; client: no ElevenLabs for music or SFX). D minor, 72 bpm. Every bed is a pure function of its length and
# seed, so a re-plan re-renders identical music.
#   bed(kind, seconds) -> stereo float32 at 48 kHz
#   kinds: 'cold' (drone + clock + breath), 'tense' (pulse, low strings, kalimba ostinato), 'dark' (slower, lower,
#          heartbeat), 'resolve' (ledger: lifts to F major and B-flat, kalimba brighter)
# Also writes stingers: riser (3 s noise/pitch sweep into a hit) and hit (sub boom + metallic tail).
import numpy as np, subprocess, sys, json, os
SR = 48000
BPM = 72; BEAT = 60 / BPM
def rng(seed): return np.random.default_rng(seed)
def env_adsr(n, a, r):
    e = np.ones(n, np.float32); a = int(a * SR); r = int(r * SR)
    if a: e[:a] = np.linspace(0, 1, a)
    if r: e[-r:] *= np.linspace(1, 0, r)
    return e
def lp(x, cutoff):
    # one-pole low-pass (cutoff can be an array)
    a = np.exp(-2 * np.pi * np.asarray(cutoff, np.float64) / SR) * np.ones(len(x))
    y = np.zeros_like(x); s = 0.0
    for i in range(len(x)): s = (1 - a[i]) * x[i] + a[i] * s; y[i] = s
    return y
def lp_fast(x, cutoff):
    # fixed-cutoff one-pole via scipy for speed
    from scipy.signal import lfilter
    a = np.exp(-2 * np.pi * cutoff / SR)
    return lfilter([1 - a], [1, -a], x).astype(np.float32)
def hp_fast(x, cutoff): return (x - lp_fast(x, cutoff)).astype(np.float32)
def midi(m): return 440.0 * 2 ** ((m - 69) / 12)
def saw(f, n, ph=0.0):
    t = np.arange(n) / SR; return (2 * ((f * t + ph) % 1.0) - 1).astype(np.float32)
def sine(f, n, ph=0.0):
    t = np.arange(n) / SR; return np.sin(2 * np.pi * f * t + ph).astype(np.float32)
def pluck(f, dur, bright=0.5, seed=0):
    # Karplus-Strong: a kalimba/thumb-piano like pluck
    n = int(dur * SR); p = max(2, int(SR / f)); r = rng(seed)
    buf = (r.random(p) * 2 - 1).astype(np.float32); out = np.zeros(n, np.float32)
    damp = 0.996 - (1 - bright) * 0.01
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = damp * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    tine = sine(f * 2, n) * np.exp(-np.arange(n) / SR * 7) * 0.35
    return (out + tine) * np.exp(-np.arange(n) / SR * 2.2)
def place(dst, src, at, gain=1.0):
    i = int(at * SR)
    if i >= len(dst): return
    m = min(len(src), len(dst) - i); dst[i:i + m] += src[:m] * gain
def reverb(x, wet=0.25, seed=3):
    # small feedback-delay network for room
    out = x.copy(); r = rng(seed)
    for d, g in [(0.031, 0.5), (0.047, 0.45), (0.071, 0.4), (0.113, 0.35), (0.173, 0.3), (0.241, 0.25)]:
        k = int(d * SR); y = np.zeros_like(x); y[k:] = x[:-k] * g; out += lp_fast(y, 3500) * wet
    return out

PROG = {  # chords as MIDI notes, one per 2 bars
    'tense': [[50, 53, 57], [46, 50, 53], [43, 46, 50], [45, 49, 52]],      # Dm Bb Gm A
    'dark': [[38, 41, 45], [39, 43, 46], [38, 41, 45], [37, 40, 45]],       # Dm Eb Dm A/C#
    'resolve': [[50, 53, 57], [46, 50, 53], [41, 45, 48], [48, 52, 55]],    # Dm Bb F C
    'cold': [[38, 45, 50]],
}
OST = {'tense': [62, 69, 65, 64, 62, 69, 65, 67], 'dark': [62, 63, 62, 61], 'resolve': [65, 69, 72, 69, 67, 70, 69, 65], 'cold': [74]}

PLUCKS = {}
def bed(kind, secs, seed=1):
    n = int(secs * SR); L = np.zeros(n, np.float32); R = np.zeros(n, np.float32); r = rng(seed)
    bar = BEAT * 4; chord_len = bar * 2
    prog = PROG[kind]
    # 1) drone: root an octave down, slow beating
    root = midi(prog[0][0] - 12)
    dr = (sine(root, n) * 0.5 + sine(root * 1.5, n, 1.0) * 0.18 + sine(root * 1.003, n, 0.3) * 0.4)
    dr *= (0.75 + 0.25 * sine(0.07, n))
    L += dr * 0.22; R += dr * 0.22
    # 2) pad: detuned saws per chord, low-passed, slow swell
    if kind != 'cold':
        t = 0.0; k = 0
        while t < secs:
            ch = prog[k % len(prog)]; m = int(min(chord_len, secs - t) * SR) + int(1.5 * SR)
            pad = np.zeros(m, np.float32)
            for j, note in enumerate(ch):
                f = midi(note - (12 if kind == 'dark' else 0))
                pad += saw(f * 0.997, m, r.random()) + saw(f * 1.004, m, r.random())
            pad = lp_fast(pad, 700 if kind == 'dark' else 1100) * env_adsr(m, 1.2, 1.5) * 0.06
            place(L, pad, t, 1.0); place(R, np.roll(pad, 240), t, 1.0)
            t += chord_len; k += 1
    # 3) pulse: soft low "heartbeat" (two thumps) or clock tick
    t = 0.6 if kind != 'cold' else 0.3
    while t < secs:
        if kind in ('dark', 'cold'):
            th = sine(48, int(0.25 * SR)) * np.exp(-np.arange(int(0.25 * SR)) / SR * 18)
            place(L, th, t, 0.5); place(R, th, t, 0.5); place(L, th, t + 0.28, 0.32); place(R, th, t + 0.28, 0.32)
            t += BEAT * 2
        else:
            kick = sine(55, int(0.3 * SR)) * np.exp(-np.arange(int(0.3 * SR)) / SR * 14)
            place(L, kick, t, 0.42); place(R, kick, t, 0.42); t += BEAT
    # clock ticks (cold open, tense): high woodblock
    if kind in ('cold', 'tense'):
        t = 0.3
        while t < secs:
            tk = hp_fast((r.random(int(0.03 * SR)) * 2 - 1).astype(np.float32), 2500) * np.exp(-np.arange(int(0.03 * SR)) / SR * 160)
            place(L, tk, t, 0.12 if kind == 'tense' else 0.18); place(R, tk, t + 0.004, 0.10)
            t += BEAT / (2 if kind == 'tense' else 1)
    # 4) kalimba ostinato (eighth notes), enters after 4 bars, rests every 4th bar
    if kind != 'cold':
        seq = OST[kind]; step = BEAT / 2 if kind != 'dark' else BEAT; t = bar * (2 if kind == 'resolve' else 4); i = 0
        while t < secs:
            if int(t / bar) % 4 != 3:
                note = seq[i % len(seq)] + (12 if kind == 'resolve' else 0); pl = PLUCKS.setdefault(note, pluck(midi(note), 1.6, 0.6, note))
                pan = 0.5 + 0.3 * np.sin(i * 0.7)
                place(L, pl, t, 0.10 * (1 - pan) * 2); place(R, pl, t, 0.10 * pan * 2)
            t += step; i += 1
    # 5) breath: filtered noise swell
    nz = lp_fast((r.random(n) * 2 - 1).astype(np.float32), 400) * (0.5 + 0.5 * sine(0.05, n, 2.0)) * 0.05
    L += nz; R += np.roll(nz, 4000)
    L = reverb(L); R = reverb(R, seed=5)
    fade = env_adsr(n, 1.5, 2.5); L *= fade; R *= fade
    st = np.stack([L, R], 1); st /= max(1e-6, np.abs(st).max()) / 0.7
    return st

def riser(secs=3.0, seed=9):
    n = int(secs * SR); r = rng(seed); t = np.arange(n) / SR
    nz = (r.random(n) * 2 - 1).astype(np.float32)
    sweep = np.sin(2 * np.pi * np.cumsum(80 + 600 * (t / secs) ** 2) / SR).astype(np.float32)
    x = hp_fast(nz, 1500) * (t / secs) ** 2 * 0.5 + sweep * (t / secs) ** 3 * 0.35
    return np.stack([x, np.roll(x, 300)], 1) / 0.9
def hit(seed=11):
    n = int(3.0 * SR); r = rng(seed); t = np.arange(n) / SR
    f = 70 * np.exp(-t * 3) + 32
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    metal = sum(np.sin(2 * np.pi * fr * t + r.random() * 6) for fr in [523, 787, 1131, 1709, 2297]) * np.exp(-t * 2.2) * 0.06
    burst = (r.random(n) * 2 - 1) * np.exp(-t * 25) * 0.3
    x = (sub * 0.9 + metal + burst).astype(np.float32)
    x = reverb(x, 0.35)
    return np.stack([x, np.roll(x, 200)], 1) / max(1e-6, np.abs(x).max()) * 0.9

def write(path, st):
    pcm = (np.clip(st, -1, 1) * 32767).astype(np.int16)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-", path], input=pcm.tobytes(), check=True)

if __name__ == "__main__":
    out = sys.argv[1]; os.makedirs(out, exist_ok=True)
    spec = json.loads(sys.argv[2]) if len(sys.argv) > 2 else [["tense", 30]]
    for name, kind, secs in spec: write(f"{out}/{name}.wav", bed(kind, secs, seed=sum(map(ord, name)))); print("bed", name, kind, secs)
    write(f"{out}/riser.wav", riser()); write(f"{out}/hit.wav", hit()); print("riser, hit")
