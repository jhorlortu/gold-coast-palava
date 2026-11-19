# Gold Coast Palava — restoring the studio in a new Claude Code session

Everything for the show lives in this repository: the house-style skill (`.claude/skills/gold-coast-palava-edit` —
all client rules, COMBO1/2/3, the Nest team, the colophon), the build engine, the media library and each edition's
sources. Renders, finished videos and audio mixes are not stored; they rebuild from here.

## One-time setup at the start of a session (run from the clone)
```bash
# the code uses absolute paths under /home/user/gcp and /home/user/video-studio
ln -sfn "$PWD" /home/user/gcp
ln -sfn /home/user/gcp/video-studio /home/user/video-studio
git lfs install --local && git lfs pull
(cd video-studio && npm ci)        # HyperFrames + Remotion render engine
(cd build && npm ci)               # fonts
pip install faster-whisper numpy pillow opencv-python-headless pypdf
```
ffmpeg and Playwright/Chromium are preinstalled in Claude Code cloud sessions.

## Layout
- `.claude/skills/gold-coast-palava-edit/SKILL.md` — read first; the house style and every client rule.
- `build/` — shared engine: `lib.mjs` (scenes, captions, stickers, 9:16 mode), `banner.mjs`, `combo1.mjs`, `stings.mjs`.
- `work/` — pilot ("The Headline Edition") planning/audio/subtitle scripts; `src/INTRO` pilot sources, fonts, music.
- `ed1/` — Edition 1: `src/vo.mp3`, `work/` (edl, plan, timeline, transcript, subs, build_audio, assemble),
  `build/` (`ed1.mjs` sections, `build.mjs`, `clash.cjs`, `empties.mjs`, `snap.cjs`), `media/` (stickers, drawn
  portraits, archive images, SFX incl. boom, Ntim Gyakari illustration, book cover slot).
- `reels/` — 9:16 social reels (pilot + Edition 1): `cut.py`, `rlib.mjs`, `bannerP.mjs`, `build.mjs`, `mix.py`.
- `project/media/` — shared library: the Nest (`final/nest-light.png`, `broll/nest-*.mp4`), cartoon B-roll, icons,
  SFX, soundtrack.
- `video-studio/` — render engine source (node_modules restored by `npm ci`).

## Starting a new edition
Copy `ed1/` to `ed<N>/` (keep the code, replace `src/vo.mp3`, the script-specific `work/edl.py`, sting kickers, media
and `ed<N>.mjs` sections), set `GCP_WORK=/home/user/gcp/ed<N>/work` and `GCP_EDITION="EDITION <N>"`, and follow the
skill. Deliver 1080p + 720p preview; reels ~2:00, 1080×1920, no music, ending with Kofi's spoken YouTube line.
