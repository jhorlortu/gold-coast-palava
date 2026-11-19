# Review log

Every check is made from the rendered MP4s (`python3 scripts/review.py <round>`) plus the per-beat contact sheets
(`node scripts/render.mjs --sheet`). Nothing is judged from the page. Critic prompt: the skill's `reference/CRITIQUE.md`.

Scores 1–10. Ship only when EVERY score is ≥ 8, after at least 3 rounds.

---

## Round 1: v2 full draft (GoldCoastPalava_v2_round1.mp4, 8:36, draft quality)

| Criterion | Score | Evidence (timestamps, frames, metrics) |
|---|---|---|
| Hook (first 2 s) | 7 | f0 shows the symbol already drawing on paper; the promise (banner) only lands at 7.7 s, by design (soundtrack silence). |
| Readability at phone size | 7 | phone_1: headlines and chips read; walk chips at 5:00 run into the subtitle band; mono kickers ~6 px at 360 wide. |
| Motion quality | 7 | Springs throughout, banner assembly strip clean; desk labels slide under the fixed headline at 0:28–0:32 as the camera zooms. |
| Variety / pacing | 6 | Dead paper at 1:44–1:46 (front page cards wait for the words) and 7:40–7:41 (editor scene ends before the render). Cap: static run > 2 s. |
| Brand accuracy | 8 | Real symbol, banner, kente, palette (paper/ink/one red, gold as banner colour); trial font used in subs (draft only). |
| Sound sync | 6 | Integrated −14.2 LUFS OK; peak −0.4 dBFS > −1 dBTP. Cap: loudness off target. |
| Composition | 7 | Walk thing 1/3 chips wrap into 7 rows and collide with subtitles (5:00, 5:28); otherwise re-blocked per scene. |
| Polish | 7 | No blackdetect runs; near-blank paper frames at 1:45 and 7:41; nest plate kicker hidden under masthead (6:20). |

**3 worst problems**
1. Dead blank paper at 1:44 (paper scene G cards keyed to "front page", ~2 s late) and 7:41 (editor scene ends at s.dur, render runs 1.2 s longer).
2. True peak −0.4 dBFS after AAC; spec ≤ −1 dBTP.
3. Walk chips overflow into subtitles (5:00, 5:28) and cold-open labels collide with fixed text (0:28, 0:32).

**Fixes for round 2**
1. Front page cards drop from fEnd+0.35; editor scene spans p.dur. Verify: frames at 105 s and 461 s show content.
2. 4× oversampled alimiter at −2 dBFS after loudnorm. Verify: ebur128 peak ≤ −1.
3. Walk chips column 860 px from y 420, prints 420 px at x 1430; cold-open headline lifts out before the tea move and chips move top-left. Nest kicker gets a paper backing. Verify on sheets.

**Verdict:** ANOTHER ROUND

## Round 2: v2 full draft (GoldCoastPalava_v2_round2.mp4)

| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 7 | Unchanged by design: symbol drawing from f0; banner promise at 7.7 s. |
| Readability at phone size | 7 | Walk thing 1 still runs 7 chip rows; last row touches subtitles at 5:00. |
| Motion quality | 7 | Cold-open collisions fixed (0:28/0:32 clear). Stings: letters and icon fade in (opacity) — kit cap 6–7. |
| Variety / pacing | 7 | Front page and editor fixed (frames 105 s, 461 s show content). Blank paper remains at 0:40 (price box waits ~1.5 s for words) and every sting's first 0.6 s. |
| Brand accuracy | 8 | As round 1. |
| Sound sync | 7 | Mix −1.9 dBFS, but AAC overshoot took the file to −0.3. |
| Composition | 7 | Walk chips column now right of number, prints no longer overlap. |
| Polish | 7 | Nest kicker now readable on paper backing. Sting openers near-blank. |

**3 worst problems**
1. Stings: ~0.6 s of blank paper then opacity fades on icon/letters (kit: no fade enters).
2. AAC true peak −0.3 dBFS.
3. Walk chips still crowd subtitles; cold-open price scene opens empty (0:40).

**Fixes for round 3**
1. SectionSting rewritten: Remotion springs, masked letter rises, clip-path icon iris, kente band and a big section numeral moving from f0.
2. Limiter at −3 dBFS and loudnorm target −13.7 → AAC test −14.4 LUFS / −1.2 dBFS.
3. Walk chips at 32 px in a 860 px column from y 420; price kicker and box enter with the scene.

**Verdict:** ANOTHER ROUND

## Round 3: v2 full draft (GoldCoastPalava_v2_round3.mp4)

| Criterion | Score | Evidence |
|---|---|---|
| Hook (first 2 s) | 8 | f0: the channel symbol is already on screen and drawing; places type by 1.5 s; banner assembles 7.7 s on the soundtrack's built-in silence (client brief). |
| Readability at phone size | 8 | Headlines, chips and subtitles read in phone_1/2; walk chips now 2–3 rows per thing, clear of the subtitle band (4:48–6:00). |
| Motion quality | 8 | Springs throughout incl. stings (masked rises, iris icon); no opacity enters on stings; cold-open labels never cross fixed type. |
| Variety / pacing | 8 | Max gap 4.1 s (nest open), all others ≤ 4.0 s; no blank paper frames at 0:40, 1:45, 7:41; stings move from f0. |
| Brand accuracy | 8 | Real symbol, banner pieces, kente, paper/ink/red with banner gold; real Commons footage and portraits. Trial font in subs (draft-only, flagged). |
| Sound sync | 8 | −14.4 LUFS, −1.2 dBFS after AAC; stings land on their hits; SFX keyed to the same cue times as their visuals. |
| Composition | 8 | 16:9 only (YouTube brief). Every scene re-blocked; prints and chips no longer overlap. |
| Polish | 8 | blackdetect 0 runs; no orphan captions; nest kicker readable. |

**Remaining nits (not blocking):** chair label partly off-frame left during the tea move (0:28); "Chale" dancers clip sits behind type briefly.

**Verdict:** SHIP (every score ≥ 8, round 3)
