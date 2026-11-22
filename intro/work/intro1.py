# INTRO1 (opening beat, symbol draws, OPTIMUM DIGITAL PRESENTS types and leaves) and COMBO1 (the banner assembly).
# usage: python3 -I intro1.py INTRO1|COMBO1
import json, subprocess
import numpy as np
import sys
SR = 48000
CLIPS = {"INTRO1": (0.0, 7.0), "COMBO1": (7.0, 14.0)}          # INTRO1 + COMBO1 = the full opening
NAME = sys.argv[1] if len(sys.argv) > 1 else "INTRO1"; START, END = CLIPS[NAME]
OUT = f"/home/user/gcp/project/media/final/{NAME}_1080.mp4"
def load(f): return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32).reshape(-1, 2)
mix = load("/home/user/gcp/project/media/music/soundtrack.wav")[int(START * SR):int(END * SR)].copy()
for c in json.load(open("/home/user/gcp/build/sfx/intro.json")):
    if not (START - 0.3 <= c["T"] < END): continue
    x = load(c["file"]); L = min(c.get("len") or 1e9, len(x) / SR); x = x[:int(L * SR)] * 10 ** ((c.get("db", -12) - 3) / 20)
    i = int((c["T"] - START) * SR)
    if i < 0: x = x[-i:]; i = 0
    x = x[:max(0, len(mix) - i)]; mix[i:i + len(x)] += x
n = int(0.25 * SR); mix[-n:] *= np.linspace(1, 0, n)[:, None]
mix /= max(1.0, float(np.abs(mix).max()) / 0.89)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(START), "-i", "/home/user/gcp/build/renders/intro.mp4", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-",
                "-map", "0:v", "-map", "1:a", "-t", str(END - START), "-vf", "scale=1920:1080:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-crf", "16", "-preset", "slow",
                "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", OUT], input=mix.astype(np.float32).tobytes(), check=True)
print("wrote", OUT)
