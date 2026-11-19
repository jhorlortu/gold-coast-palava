# Final assembly: video segments + audio mix + burned subtitles -> deliverable.
import json, glob, os, subprocess, sys
B = "/home/user/gcp/build"; W = "/home/user/gcp/work"; OUT = "/home/user/gcp/project/out"
plan = json.load(open(f"{W}/timeline.json")); P = {p["id"]: p for p in plan["parts"]}
ORDER = [("intro", "intro"), ("coldopen", "cold-open"), ("paper", "paper"), ("sting-lead", "sting-lead"), ("lead", "lead"),
         ("sting-wire", "sting-wire"), ("wire", "wire"), ("sting-walk-away", "sting-walk-away"), ("walk", "walk-away"),
         ("sting-nest", "sting-nest"), ("nest", "nest"), ("sting-editors-note", "sting-editors-note"), ("editor", "editors-note"),
         ("letters", "letters"), ("sting-dispatch", "sting-dispatch"), ("dispatch", "dispatch")]
starts = [P[pid]["T0"] for _, pid in ORDER] + [plan["total"]]
run = lambda *a: subprocess.run(["ffmpeg", "-hide_banner", "-y", "-loglevel", "error", *a], check=True)
os.makedirs(f"{W}/conf", exist_ok=True); os.makedirs(OUT, exist_ok=True)
lst = []
for i, (rid, pid) in enumerate(ORDER):
    frames = round(starts[i + 1] * 30) - round(starts[i] * 30)
    src = f"{B}/renders/{rid}.mp4"
    if not os.path.exists(src): sys.exit(f"missing render: {src}")
    dst = f"{W}/conf/{i:02d}-{rid}.mp4"
    run("-i", src, "-an", "-vf", f"fps=30,scale=2560:1440:flags=lanczos,setsar=1,format=yuv420p,tpad=stop_mode=clone:stop_duration=2", "-frames:v", str(frames), "-c:v", "libx264", "-preset", "veryfast", "-crf", "14", dst)
    lst.append(f"file '{dst}'")
open(f"{W}/conf/list.txt", "w").write("\n".join(lst))
run("-f", "concat", "-safe", "0", "-i", f"{W}/conf/list.txt", "-c", "copy", f"{W}/picture.mp4")
# Sound effects from every section -> mix
cues = []
for f in sorted(glob.glob(f"{B}/sfx/*.json")): cues += json.load(open(f))
json.dump(cues, open(f"{W}/sfx_cues.json", "w"), indent=1)
subprocess.run([sys.executable, "-I", f"{W}/build_audio.py"], check=True)
subprocess.run([sys.executable, "-I", f"{W}/subs.py"], check=True, stdout=subprocess.DEVNULL)
name = sys.argv[1] if len(sys.argv) > 1 else "GoldCoastPalava_HeadlineEdition_draft"
run("-i", f"{W}/picture.mp4", "-i", f"{W}/mix.wav", "-vf", f"ass={W}/subs.ass:fontsdir=/home/user/gcp/src/INTRO/Font",
    "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-profile:v", "high",
    "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", "-t", str(plan["total"]), f"{OUT}/{name}.mp4")
print("wrote", f"{OUT}/{name}.mp4", len(cues), "sfx cues")
