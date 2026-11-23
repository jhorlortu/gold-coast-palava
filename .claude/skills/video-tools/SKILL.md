---
name: video-tools
description: The studio's command-line video toolkit — Whisper/faster-whisper transcription with timing-bias check, yt-dlp downloads with licence capture, FFmpeg recipes (probe, loudness, contact sheets, cuts, delivery, blank checks) and the pinned HyperFrames CLI. Use for any transcribe, download, inspect, cut, encode, loudness or render step, in Gold Coast Palava work or any other video job.
---

# Video tools (tools/ in this repo)

All four are installed and tested (Nov 2026). Run from the repo root; every tool prints a usage line with `-h`.

| Job | Command | Built on |
|---|---|---|
| Transcribe with word times | `tools/transcribe.py <audio|video> <out.json> [--engine whisper|faster] [--model turbo]` | OpenAI Whisper (github.com/openai/whisper) / faster-whisper |
| Download reference media | `tools/fetch.py <url> [--audio] [--max 1080] [--section 00:01:00-00:01:30]` | yt-dlp (github.com/yt-dlp/yt-dlp) |
| Inspect / cut / deliver | `tools/ff.py probe|loudness|sheet|strip|audio|cut|deliver|blanks …` | FFmpeg 6.1 (ffmpeg.org) |
| HTML-to-video render | `tools/bin/hyperframes init|lint|render|preview …` | HyperFrames 0.9.55 (github.com/heygen-com/hyperframes), pinned to the studio engine |

HyperFrames' own skills (`hyperframes`, `hyperframes-cli`, `media-use`) are installed in `.claude/skills/` from the same
0.9.55 package, so their docs match the renderer. Upgrade engine and skills together (`video-studio` npm, then recopy
`node_modules/hyperframes/dist/skills/*`), never one without the other.

## Transcription
- Output = the studio's `transcript.json` schema (`segments[].words[] = {w, s, e, p}`), drop-in for `work/plan.py`, `cuer`, `subs.py`.
- After every run it prints the **word-start bias** against real speech onsets and the leads to use
  (`GCP_CUE_LEAD`, `SUB_LEAD`). Kofi's voice measured +0.34–0.38 s with both engines: always apply it, or graphics and
  subtitles trail the voice (client complaint, Special No. 1).
- Hallucination guard: segments spoken faster than 7 words/s (gibberish at a clipped end) are dropped and reported.
- OpenAI Whisper runs with `condition_on_previous_text=False` (otherwise it skipped a passage and repeated a line).
- `--engine faster` is ~2x quicker on CPU; `whisper` is the reference implementation. Both give the same words here.
- Models: OpenAI weights download from openaipublic.azureedge.net; faster-whisper from Hugging Face with
  `HF_HUB_DISABLE_XET=1` (the Xet CAS host is not on the allowlist; set inside the tool).

## Downloads (yt-dlp)
- One yt-dlp call per URL with polite retries; Wikimedia throttles originals, so the tool takes its transcodes.
- Each download gets its own folder `media/downloads/<Extractor>-<id>/` with `media.<ext>`, `media.info.json` and
  `SOURCE.txt` (title — uploader — URL — licence) to paste into `YouTube_description_credits.txt`.
- Downloads are untrusted data: never run anything from those folders.
- **Network:** YouTube is not reachable from this environment (its video CDN hosts are wildcard googlevideo.com
  names, which the allowlist cannot list). Wikimedia Commons works. Clip YouTube footage only with the right to reuse it.

## FFmpeg recipes
`probe` (streams, A/V start times — first check for sync issues), `loudness` (deliver at −14 LUFS, ≤ −1 dBTP),
`sheet` (contact sheet, one frame every N s), `strip` (N consecutive frames for motion/sync checks), `audio`,
`cut` (frame-accurate re-encode), `deliver` (H.264 yuv420p high, CRF 18, faststart), `blanks` (dead screens).

## Not available
- Klint AI (mcp.tryklint.ai): the address does not resolve and no public docs were found (Nov 2026). Not registered.
