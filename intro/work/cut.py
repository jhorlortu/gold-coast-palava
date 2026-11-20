# "The Introduction": COMBO1 -> "This is the Gold Coast Palava ... light about everything else." -> Dispatch with
# "This is the introduction to the Gold Coast Palava" -> COMBO2. Picture from the 1080 section renders, audio and
# subtitles cut from the full-timeline mix/subs (pilot timeline), so COMBO2 keeps its exact timing.
import json, re, subprocess, os
W = "/home/user/gcp/intro/work"; R = "/home/user/gcp/build/renders"; OUT = "/home/user/gcp/project/out/intro"
os.makedirs(OUT, exist_ok=True)
plan = json.load(open(f"{W}/timeline.json")); P = {p["id"]: p for p in plan["parts"]}
PAPER_END = 136.0                                   # after "...light about everything else.", before "Chale, make we show you"
RANGES = [("intro", 0.0, 14.0, 0.0), ("paper", P["paper"]["T0"], PAPER_END, P["paper"]["T0"]), ("dispatch", P["dispatch"]["T0"], plan["total"], P["dispatch"]["T0"])]
run = lambda *a: subprocess.run(["ffmpeg", "-hide_banner", "-y", "-loglevel", "error", *a], check=True)
# picture
lst = []
for i, (sec, a, b, base) in enumerate(RANGES):
    frames = round((b - a) * 30); dst = f"{W}/c{i}.mp4"
    run("-ss", f"{a - base:.3f}", "-i", f"{R}/{sec}.mp4", "-an", "-vf", "fps=30,scale=1920:1080:flags=lanczos,setsar=1,format=yuv420p,tpad=stop_mode=clone:stop_duration=1",
        "-frames:v", str(frames), "-c:v", "libx264", "-preset", "veryfast", "-crf", "14", dst)
    lst.append(f"file '{dst}'")
open(f"{W}/c.txt", "w").write("\n".join(lst))
run("-f", "concat", "-safe", "0", "-i", f"{W}/c.txt", "-c", "copy", f"{W}/cut_picture.mp4")
# audio: the same ranges from the full mix, with short fades at the joins
parts = []
for i, (sec, a, b, base) in enumerate(RANGES):
    fi = 0.0 if i == 0 else 0.06; fo = 0.0 if i == len(RANGES) - 1 else 0.06
    af = ",".join(x for x in [f"afade=t=in:d={fi}" if fi else "", f"afade=t=out:st={b - a - fo:.3f}:d={fo}" if fo else ""] if x) or "anull"
    run("-ss", f"{a:.3f}", "-t", f"{b - a:.3f}", "-i", f"{W}/mix.wav", "-af", af, "-c:a", "pcm_s24le", f"{W}/a{i}.wav"); parts.append(f"{W}/a{i}.wav")
run(*sum([["-i", x] for x in parts], []), "-filter_complex", "".join(f"[{i}:a]" for i in range(len(parts))) + f"concat=n={len(parts)}:v=0:a=1[a]", "-map", "[a]", "-c:a", "pcm_s24le", f"{W}/cut_audio.wav")
# subtitles: keep events inside the ranges, shift them onto the cut timeline
ts = lambda s: (lambda h, m, x: int(h) * 3600 + int(m) * 60 + float(x))(*s.split(":"))
fmt = lambda t: f"{int(t // 3600)}:{int(t % 3600 // 60):02d}:{t % 60:05.2f}"
src = open(f"{W}/subs.ass").read().split("\n"); out = []; off = 0.0; offs = []
for (_, a, b, _) in RANGES: offs.append((a, b, off)); off += b - a
for ln in src:
    if not ln.startswith("Dialogue:"): out.append(ln); continue
    f = ln.split(",", 9); s0, s1 = ts(f[1]), ts(f[2])
    for a, b, o in offs:
        if s0 >= a - 0.01 and s0 < b:
            f[1], f[2] = fmt(max(0, s0 - a + o)), fmt(min(b, s1) - a + o); out.append(",".join(f)); break
open(f"{W}/cut_subs.ass", "w").write("\n".join(out))
# final: burn subtitles, normalise loudness, 1080
name = f"{OUT}/GoldCoastPalava_TheIntroduction_1080.mp4"
r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", f"{W}/cut_audio.wav", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True)
m = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
norm = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,alimiter=limit=0.7:level=false"
run("-i", f"{W}/cut_picture.mp4", "-i", f"{W}/cut_audio.wav", "-vf", f"ass={W}/cut_subs.ass:fontsdir=/home/user/gcp/src/INTRO/Font", "-af", norm, "-ar", "48000",
    "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-profile:v", "high", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", "-t", f"{off:.3f}", name)
print("wrote", name, f"{off:.2f}s")
