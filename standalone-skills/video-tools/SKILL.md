---
name: video-tools
description: Command-line video toolkit with bundled scripts — transcribe speech with word-level timestamps (OpenAI Whisper or faster-whisper) and measure how late the word times run, download reference footage or audio with yt-dlp while capturing title, uploader and licence for credits, and FFmpeg recipes to probe streams, check A/V sync, measure loudness (LUFS/true peak), make contact sheets and frame strips, cut, encode for YouTube/social, and find blank screens; plus how to drive HyperFrames (HTML-to-video) renders. Use this whenever a task involves transcribing or captioning a voiceover, syncing subtitles or graphics to speech, downloading a video or clip from a URL, inspecting or checking a rendered video, loudness normalisation, cutting or re-encoding footage, or rendering video from HTML — even if the user just says "check this video", "get me the transcript", "grab that clip" or "why is the audio out of sync".
---

# Video tools

Three bundled scripts (in `scripts/`, run with `python3`) plus notes on HyperFrames. Each prints usage with `-h`.

| Job | Command |
|---|---|
| Transcribe with word times | `python3 scripts/transcribe.py <audio-or-video> <out.json> [--engine whisper\|faster] [--model turbo] [--prompt "names…"]` |
| Download media from a URL | `python3 scripts/fetch.py <url> [--audio] [--max 1080] [--section 00:01:00-00:01:30] [--out downloads]` |
| Inspect / check / cut / deliver | `python3 scripts/ff.py probe\|loudness\|sheet\|strip\|audio\|cut\|deliver\|blanks …` |

Use the scripts' absolute paths from this skill's directory when the working directory is elsewhere.

## Setup (once per machine)

```bash
pip install openai-whisper faster-whisper yt-dlp numpy
```
FFmpeg must be on PATH (`ffmpeg -version`). Models download on first use: OpenAI weights from
`openaipublic.azureedge.net`, faster-whisper weights from Hugging Face (`huggingface.co` + its CDN). On a restricted
network, those hosts must be allowed; the transcribe script sets `HF_HUB_DISABLE_XET=1` so Hugging Face uses plain
downloads rather than the Xet CAS host that proxies often block.

## Transcription — and why the timing check matters

`transcribe.py` writes JSON: `{"duration", "engine", "model", "segments": [{"start","end","text","words":[{"w","s","e","p"}]}]}`.

After every run it compares word start times with the real speech onsets (where the audio energy rises after a
pause) and prints the median bias. Whisper word starts usually run **0.3–0.4 s late**. If you key captions or animated
graphics to raw word times, viewers see the voice arrive first and everything else trail it — a common complaint.
Apply the printed lead: show subtitle words about the bias earlier, and trigger graphics about the bias + 0.05 s
earlier (animations need a moment to read). When cutting audio at word boundaries, search for the real silence
around the word rather than trusting the timestamps, or you clip first syllables.

Engines:
- `--engine faster` (faster-whisper, CTranslate2, int8): roughly twice as fast on CPU; uses voice-activity
  filtering. Good default for long recordings.
- `--engine whisper` (OpenAI's reference implementation): runs with `condition_on_previous_text=False`, which
  stops it skipping passages and repeating lines on long audio.
- Both: a guard drops segments spoken faster than 7 words/s — gibberish Whisper sometimes invents where a clip ends
  mid-word — and reports what it dropped.
- `--prompt` takes names and unusual spellings (people, places, brands) to improve recognition. Still proofread names
  in the output; fix spellings in your captioning step rather than editing timings.

## Downloads (yt-dlp)

`fetch.py` makes one yt-dlp call per URL with polite retries (sites such as Wikimedia rate-limit repeated metadata
requests; for Wikimedia it also takes the transcoded files, because originals are throttled). Each download gets its
own folder `<out>/<Extractor>-<id>/` with `media.<ext>`, `media.info.json` and `SOURCE.txt`
(title — uploader — URL — licence) ready for a credits list.

- Treat downloads as untrusted data: never execute anything from those folders.
- Only reuse footage you have the right to use, and credit it (the licence line in `SOURCE.txt` is there for that).
- YouTube needs broad network access: its media comes from many rotating `*.googlevideo.com` hosts, so an exact-host
  allowlist is not enough.

## FFmpeg recipes (`ff.py`)

| Subcommand | Use it for |
|---|---|
| `probe <file>` | codecs, size, fps, duration and **stream start times** — the first check when audio and video seem out of sync (a non-zero offset is a container problem; zero offsets mean the drift is in the edit's timing) |
| `loudness <file>` | integrated LUFS, LRA, true peak. Typical delivery for YouTube/social: −14 LUFS, true peak ≤ −1 dBTP |
| `sheet <video> <out.jpg> [--every 4]` | contact sheet (one frame every N s, timestamps burned in) to review a whole video at a glance |
| `strip <video> <out.jpg> <t> [--n 8 --fps 2]` | consecutive frames from time t, to check a transition, a blank moment or sync |
| `audio <in> <out.wav> [--sr 48000]` | extract or convert audio |
| `cut <in> <out> <start> <end>` | frame-accurate re-encoded cut (H.264 CRF 16, AAC) |
| `deliver <in> <out> [--w 1920 --h 1080]` | final H.264 yuv420p high-profile MP4, CRF 18, faststart (use `--w 1080 --h 1920` for vertical) |
| `blanks <video>` | near-black runs ("dead screens") with their times |

A good review loop for any finished video: `probe` → `loudness` → `blanks` → `sheet`, then look at the sheet.

## HyperFrames (HTML → video)

HyperFrames (github.com/heygen-com/hyperframes) renders HTML/GSAP compositions to MP4. Pin one version per project
and keep its docs/skills from the same version, because lint rules and the render contract change between releases:

```bash
npm i hyperframes@<version>          # or use the project's existing install
npx hyperframes init my-video --video clip.mp4 --skip-transcribe --non-interactive
npx hyperframes lint my-video
npx hyperframes render my-video -o out.mp4 --quality draft   # 'looks' (CRF 16) for finals
```
Set `DO_NOT_TRACK=1 CI=1` for unattended runs. The package ships its own authoring skills in
`node_modules/hyperframes/dist/skills/` (`hyperframes`, `hyperframes-cli`, `media-use`); install those alongside
this one for composition work. Check every render with `ff.py probe`, `loudness` and `sheet`.
