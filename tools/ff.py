#!/usr/bin/env python3
"""FFmpeg recipes used across the studio (ffmpeg.org). One subcommand per job:

  probe <file>                         streams, size, fps, duration, start times (A/V offset check)
  loudness <file>                      integrated LUFS + true peak (delivery: -14 LUFS, <= -1 dBTP)
  sheet <video> <out.jpg> [--every 4]  contact sheet, one frame every N s, timestamps burned in
  strip <video> <out.jpg> <t> [--n 8 --fps 2]   N consecutive frames from t (motion / sync checks)
  audio <in> <out.wav> [--sr 48000]    extract/convert audio
  cut <in> <out> <start> <end>         frame-accurate re-encoded cut (H.264 CRF 16 / AAC)
  deliver <in> <out> [--w 1920 --h 1080]   H.264 yuv420p high profile, CRF 18, faststart (YouTube/social)
  blanks <video>                       near-black runs (dead screens) with times"""
import argparse, json, subprocess, sys
def ff(*a): subprocess.run(["ffmpeg", "-hide_banner", "-y", "-loglevel", "error", *a], check=True)
ap = argparse.ArgumentParser(); sp = ap.add_subparsers(dest="cmd", required=True)
for name, args in {"probe": ["file"], "loudness": ["file"], "sheet": ["video", "out"], "strip": ["video", "out", "t"], "audio": ["src", "out"],
                   "cut": ["src", "out", "start", "end"], "deliver": ["src", "out"], "blanks": ["video"]}.items():
    p = sp.add_parser(name); [p.add_argument(x) for x in args]
    if name == "sheet": p.add_argument("--every", type=float, default=4)
    if name == "strip": p.add_argument("--n", type=int, default=8); p.add_argument("--fps", type=float, default=2)
    if name == "audio": p.add_argument("--sr", type=int, default=48000)
    if name == "deliver": p.add_argument("--w", type=int, default=1920); p.add_argument("--h", type=int, default=1080)
a = ap.parse_args()
if a.cmd == "probe":
    j = json.loads(subprocess.run(["ffprobe", "-v", "error", "-show_format", "-show_streams", "-of", "json", a.file], capture_output=True, text=True, check=True).stdout)
    for s in j["streams"]: print(f"{s['codec_type']:5} {s.get('codec_name')} {s.get('width', '')}x{s.get('height', '')} fps={s.get('r_frame_rate')} start={s.get('start_time')} dur={s.get('duration')}")
    print(f"size {int(j['format']['size']) / 1e6:.1f} MB, duration {float(j['format']['duration']):.2f} s")
elif a.cmd == "loudness":
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", a.file, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    print("\n".join([l.strip() for l in r.splitlines() if l.strip().startswith(("I:", "LRA:", "Peak:"))][-3:]))
elif a.cmd == "sheet":
    ff("-i", a.video, "-vf", f"fps=1/{a.every},scale=480:-2,drawtext=text='%{{pts\\:hms}}':x=8:y=8:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6,tile=6x6", "-frames:v", "1", a.out)
elif a.cmd == "strip":
    ff("-ss", a.t, "-i", a.video, "-vf", f"fps={a.fps},scale=480:-2,tile={a.n}x1", "-frames:v", "1", a.out)
elif a.cmd == "audio":
    ff("-i", a.src, "-vn", "-ac", "2", "-ar", str(a.sr), a.out)
elif a.cmd == "cut":
    ff("-ss", a.start, "-to", a.end, "-i", a.src, "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k", a.out)
elif a.cmd == "deliver":
    ff("-i", a.src, "-vf", f"scale={a.w}:{a.h}:flags=lanczos,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-profile:v", "high", "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", a.out)
elif a.cmd == "blanks":
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", a.video, "-vf", "blackdetect=d=0.3:pix_th=0.06", "-an", "-f", "null", "-"], capture_output=True, text=True).stderr
    print("\n".join(l.split("] ")[-1] for l in r.splitlines() if "black_start" in l) or "no blank runs")
