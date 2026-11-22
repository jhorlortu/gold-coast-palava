# INTRO1: the first seconds of COMBO1 (opening beat, symbol draws, OPTIMUM DIGITAL PRESENTS types and leaves).
import json, subprocess
import numpy as np
END, SR = 7.0, 48000
OUT = "/home/user/gcp/project/media/final/INTRO1_1080.mp4"
def load(f): return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32).reshape(-1, 2)
mix = load("/home/user/gcp/project/media/music/soundtrack.wav")[:int(END * SR)].copy()
for c in json.load(open("/home/user/gcp/build/sfx/intro.json")):
    if c["T"] >= END: continue
    x = load(c["file"]); L = min(c.get("len") or 1e9, len(x) / SR); x = x[:int(L * SR)] * 10 ** ((c.get("db", -12) - 3) / 20)
    i = int(c["T"] * SR); x = x[:max(0, len(mix) - i)]; mix[i:i + len(x)] += x
n = int(0.25 * SR); mix[-n:] *= np.linspace(1, 0, n)[:, None]
mix /= max(1.0, float(np.abs(mix).max()) / 0.89)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "/home/user/gcp/build/renders/intro.mp4", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-",
                "-map", "0:v", "-map", "1:a", "-t", str(END), "-vf", "scale=1920:1080:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-crf", "16", "-preset", "slow",
                "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", OUT], input=mix.astype(np.float32).tobytes(), check=True)
print("wrote", OUT)
