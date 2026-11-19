# Builds the full soundtrack mix from timeline.json (+ sfx_cues.json if present).
import json, os, subprocess, sys
W = "/home/user/gcp/work"; SRC = "/home/user/gcp/src/INTRO"
plan = json.load(open(f"{W}/timeline.json")); TOTAL = plan["total"]
VO = f"{SRC}/Script/INTRO Voice Script.mp3"; ST = "/home/user/gcp/project/media/music/soundtrack.wav"
STINGS = {"Front Page": "Front Page.mp3", "The Wire": "The Wire.mp3", "Then v Now": "Then v Now.mp3",
          "The Palava Desk": "The Palava Desk.mp3", "Editor's Note": "Editor's Note.mp3", "Dispatch": "Dispatch.mp3"}
STING_GAIN = {"Front Page": -6.0, "The Wire": 2.0, "Then v Now": 9.0, "The Palava Desk": 5.5, "Editor's Note": -8.5, "Dispatch": 4.0}  # -> about -18 LUFS each
sfx = json.load(open(f"{W}/sfx_cues.json")) if os.path.exists(f"{W}/sfx_cues.json") else []

inputs, f, buses = [], [], []
def inp(path, *pre):
    inputs.extend([*pre, "-i", path]); return len(inputs_idx) if False else None
idx = 0
def add(path, pre=()):
    global idx
    inputs.extend([*pre, "-i", path]); idx += 1; return idx - 1

fmt = "aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo"
# Voice pieces
vo = add(VO)
vparts = [p for p in plan["parts"] if p["kind"] == "vo"]
f.append(f"[{vo}:a]{fmt},asplit={len(vparts)}" + "".join(f"[vs{i}]" for i in range(len(vparts))))
for i, p in enumerate(vparts):
    d = int(round(p["T0"] * 1000))
    f.append(f"[vs{i}]atrim={p['vo_in']}:{p['vo_out']},asetpts=PTS-STARTPTS,afade=t=in:d=0.03,afade=t=out:st={p['dur']-0.05:.3f}:d=0.05,adelay={d}|{d},apad=whole_dur={TOTAL}[v{i}]")
f.append("".join(f"[v{i}]" for i in range(len(vparts))) + f"amix=inputs={len(vparts)}:normalize=0,volume=2.0[voice]")  # +6 dB voice

# Soundtrack with envelope
st = add(ST)
segs = plan["soundtrack"]["segments"]
f.append(f"[{st}:a]{fmt},asplit={len(segs)}" + "".join(f"[ss{i}]" for i in range(len(segs))))
for i, s in enumerate(segs):
    d = int(round(s["T0"] * 1000))
    f.append(f"[ss{i}]atrim={s['src_in']}:{s['src_out']},asetpts=PTS-STARTPTS,adelay={d}|{d},apad=whole_dur={TOTAL}[st{i}]")
env = plan["soundtrack"]["envelope_db"]
expr = f"{env[-1][1]}"
for (t0, d0), (t1, d1) in reversed(list(zip(env, env[1:]))):
    expr = f"if(lt(t,{t1}),{d0}+({d1}-({d0}))*(t-{t0})/({t1}-{t0}+0.0001),{expr})"
expr = f"if(lt(t,{env[0][0]}),{env[0][1]},{expr})"
f.append("".join(f"[st{i}]" for i in range(len(segs))) + f"amix=inputs={len(segs)}:normalize=0,volume='pow(10,({expr})/20)':eval=frame[music]")

# Stings
sp = [p for p in plan["parts"] if p["kind"] == "sting"]
for i, p in enumerate(sp):
    k = add(f"{SRC}/Music/{STINGS[p['title']]}")
    d = int(round(p["sting_at"] * 1000))
    f.append(f"[{k}:a]{fmt},volume={STING_GAIN[p['title']]}dB,adelay={d}|{d},apad=whole_dur={TOTAL}[sg{i}]")
# SFX: every effect eases in and out (no hard starts or cut-offs)
_dur = {}
def flen(path):
    if path not in _dur:
        _dur[path] = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path], capture_output=True, text=True).stdout.strip() or 1)
    return _dur[path]
# room-tone bed under the main business, while the soundtrack is out
P_ = {p["id"]: p for p in plan["parts"]}
segs_ = plan["soundtrack"]["segments"]
bed0, bed1 = segs_[0]["T0"] + (segs_[0]["src_out"] - segs_[0]["src_in"]) - 2.5, segs_[1]["T0"] + 2.0
# every section sting: a swoosh as it appears and another as it swipes up and away
for p_ in plan["parts"]:
    if p_["kind"] == "sting":
        # heavy, prolonged swoosh: clearly heard and felt as the section card arrives and as it swipes up
        sfx.append({"file": "/home/user/gcp/project/media/sfx/heavy-swoosh.mp3", "T": round(p_["T0"] - 0.15, 3), "db": -5, "fade": 0.8})
        sfx.append({"file": "/home/user/gcp/project/media/sfx/heavy-swoosh.mp3", "T": round(p_["T0"] + p_["dur"] - 1.0, 3), "db": -3, "fade": 0.8})
sfx = sfx + [{"file": "/home/user/gcp/project/media/sfx/roomtone.wav", "T": round(bed0, 3), "db": -30, "len": round(bed1 - bed0, 3), "fade": 2.0, "fadein": 2.0}]
from collections import defaultdict
byfile = defaultdict(list)
for i, c in enumerate(sfx): byfile[c["file"]].append(i)
src = {}
for fpath, ids in byfile.items():
    k = add(fpath)
    f.append(f"[{k}:a]{fmt},asplit={len(ids)}" + "".join(f"[sx{i}]" for i in ids))
for i, c in enumerate(sfx):
    d = int(round(c["T"] * 1000))
    L = min(c.get("len") or 1e9, flen(c["file"]))
    # ease in quickly, ease out slowly on an S-curve so every effect melts into the mix; whole bus 3 dB lower
    fi = c.get("fadein", min(0.04, L / 6)); fo = c.get("fade", max(min(0.45 * L, 1.8), min(0.4, L * 0.6)))
    f.append(f"[sx{i}]atrim=0:{L:.3f},asetpts=PTS-STARTPTS,afade=t=in:d={fi:.3f}:curve=qsin,afade=t=out:st={max(0, L - fo):.3f}:d={fo:.3f}:curve=hsin,volume={c.get('db',-12) - 3}dB,adelay={d}|{d},apad=whole_dur={TOTAL}[fx{i}]")
labels = ["voice", "music"] + [f"sg{i}" for i in range(len(sp))] + [f"fx{i}" for i in range(len(sfx))]
f.append("".join(f"[{l}]" for l in labels) + f"amix=inputs={len(labels)}:normalize=0:duration=longest,atrim=0:{TOTAL},apad=whole_dur={TOTAL}[mix]")
raw = f"{W}/mix.raw.wav"
subprocess.run(["ffmpeg", "-hide_banner", "-y", "-loglevel", "error", *inputs, "-filter_complex", ";".join(f), "-map", "[" + os.environ.get("BUS", "mix") + "]", "-c:a", "pcm_s24le", raw], check=True)

# Two-pass loudness to -14 LUFS / -1.5 dBTP
sys.path.insert(0, "/home/user/video-studio")
r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", raw, "-af", "loudnorm=I=-13.7:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True)
m = json.loads(r.stderr[r.stderr.rindex("{"):r.stderr.rindex("}") + 1])
subprocess.run(["ffmpeg", "-hide_banner", "-y", "-loglevel", "error", "-i", raw, "-af",
    f"loudnorm=I=-13.7:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true,aresample=192000,alimiter=limit=0.70:attack=1:release=60:level=false,aresample=48000",
    "-c:a", "pcm_s24le", f"{W}/mix.wav"], check=True)
print(f"mix.wav: {TOTAL}s, measured {m['input_i']} LUFS -> -14, {len(sfx)} sfx")
