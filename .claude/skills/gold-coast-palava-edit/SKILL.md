---
name: gold-coast-palava-edit
description: House style and production pipeline for Gold Coast Palava (Optimum Digital) editions — the bright-newsprint motion-graphics look, cartoon B-roll and sticker icons, word-by-word subtitles, soundtrack ducking, stings and SFX rules. Use whenever editing, building or revising a Gold Coast Palava video or a new edition of it.
---

# Gold Coast Palava — house style and pipeline

Pilot final: v8 (2K), "The Headline Edition" (9:29). Edition 1 first delivery: 17:05, 2K (`ed1/`); 1080p final + 720p preview from now on. 16:9 YouTube. Every rule below was asked for by the
client; keep them unless the client changes them. New editions should reuse this pipeline and only swap content.

## Look
- **Delivery resolution (client rule from Ed1 onward, to save time): final = 1080p (1920×1080), preview = 720p.**
  No 2K renders unless the client asks again. Sections and stings default to 1920×1080 (`GCP_OUT_W` default 1920 in
  `lib.mjs`/`stings.mjs`, zoom 1); `assemble.py` defaults `GCP_RES=1920:1080`. (2K is still possible: `GCP_OUT_W=2560`,
  `GCP_RES=2560:1440` — the 1920 layout is zoomed ×1.333.)
  `#root` is pinned to `1920px × 1080px !important`: HyperFrames resizes the root to data-width at render time, which
  pushes every centred element (left:0;right:0 / flex centring) off-centre. Never remove that pin. Stamps and long text must
  stay inside 1920 layout px.
  Deliver the 1080p final (H.264, keep under 400 MB) plus a 720p preview.
- **Refined channel banner** (`src/banner2/banner-refined.png`): the 5120-px original recoloured to it with a 3D LUT
  (`work/banner2/recolour.py`), cut into real layers (`work/banner2/layers.py` → `build/assets/banner2`: 10 overlapping sheet
  pieces, 8 cards, kente strips, wordmark glyphs, places, rule, tagline). It assembles in the intro, at the masthead
  ("This is the Gold Coast Palava", 1:00) and in the outro.
- **Palette (from the refined banner):** cream `#F3EBD7`, card `#FCF5E8`, ink `#1A1612`, red `#A4241B`, gold `#C8962F`;
  the top kente strip uses the banner's real kente.
- **Depth:** every cream screen (and the stings) carries the banner's newspapers at 10% opacity (`papers-bg.jpg`);
  banner screens use `bg: 'plain'` so the papers never double up.
- **Bright newsprint.** Paper `#F7F1E3`, ink `#1A1612`, one accent red `#A3242B`, banner gold `#C9962F`, kente strip on top.
  Fonts: Playfair Display (display), IBM Plex Mono (labels), GCP Round (chips). Imagery gets a light colour boost
  (`saturate(1.22) contrast(1.06)`) — vibrant, never washed out.
- **Opening:** symbol draws on paper during the soundtrack's built-in silence, "OPTIMUM DIGITAL PRESENTS" types under it,
  then the channel banner assembles live: newspaper sheets fly in, the 8 desk cards fly in on wide arcs and keep drifting,
  wordmark rises letter by letter. Banner holds ~2 s longer at start and end. Outro reverses it and folds into the symbol.
- **Text over footage always sits on a cream card** (dark ink, 5 px ink border, hard shadow). Never white text on imagery.
- **Show, don't write.** Anything the narrator lists becomes a **cartoon sticker** (cut-out illustration that springs in
  with its own sound), not a word chip. Keep on-screen words to headlines, kickers and a few chips. If a stretch has more
  than ~3 chips, redesign it as pictures (e.g. the band-vs-drums duel with loudness meters).
- **All B-roll is cartoon**, never raw real-world footage (real footage looked shaky). Real footage is redrawn as a
  16:9 illustration and animated with a smooth eased camera move (`work`'s `mk` ffmpeg recipe), optionally freezing
  part-way; weather is baked in (falling rain overlay). Archive engravings/portraits from Wikimedia Commons are fine as prints.
- **No credit labels or watermarks on screen.** Attribution goes in `YouTube_description_credits.txt`.
- Section stings (Remotion `SectionSting`, light theme): icon iris, masked letter rise on springs, no big numerals,
  title upper-case except a lower-case "v" (THEN v NOW).
- Big numbers / masked text need room: `.big-num` line-height ≥ 1 with bottom padding, so glyphs are never clipped.
- Nothing appears before it is said: every element is keyed to a transcript cue `c('phrase')`.

## Motion (from the motion-reel kit)
Springs only (`sp-snappy/default/heavy/playful`), no fades as enters/exits, no crossfades; something new every 2–4 s;
camera drift on every shot; every screen change is a swipe/push/iris. Timelines move: line drifts, ticks scroll,
events slide in along the line with a travelling pulse (keep drift small enough that labels stay on screen).

## Voiceover, music, subtitles
- Voiceover is cut at sentence ends at the quietest 20 ms: +0.8 s per sentence, +1.2 s at paragraph breaks,
  3 s hold after "This is the Gold Coast Palava." (`work/plan.py`).
- Soundtrack: plays its opening to the built-in silence, ducks to −21 dB under narration (must not compete), lifts to
  −4 dB in the 3 s breath after the masthead, out for the main business, returns at −24 dB (quiet) under the
  Editor's Note/Letters/Dispatch, rises to full for the outro banner, then fades low to the end.
- Section stings: brief pause, sting, pause, voice continues.
- Subtitles run the whole video, small (40 px), low, words revealed as spoken in short phrases with fixed positions
  (unspoken words transparent). UK spellings and name fixes live in `work/subs.py`.
- Loudness −14 LUFS, true peak ≤ −1 dBTP after AAC (limiter at −3 dBFS before encode).

## Sound effects
- Every visual hit has a sound: chips pop, stickers boop/thematic sound (phone ring, horns, message dings, rain,
  take-off, printing press, generator, mud squelch, paper tear on reveals), cards thud as they land, headlines
  swish+tick, rules swish, every swipe swooshes, section stings get the **heavy swoosh** (`heavy-swoosh.mp3`, loud,
  prolonged) in and out.
- Effects are subtle under the voice: whole SFX bus −3 dB; fade in ≈40 ms, fade out on an S-curve over up to ~2 s.
- Real recorded effects (Masonry `elevenlabs-sfx-v2`, ~0.5–1.2 credits) for anything human or organic (e.g. the
  two-man grumble); synthesized ones (`work/synth/make_sfx.py`) are fine for UI hits.
- Suspense sting (4 s) under dramatic dates.

## Pipeline (paths)
- `work/transcribe.py` (faster-whisper large-v3-turbo, word timestamps) → `work/transcript.json`
- `work/plan.py` → `work/timeline.json` (parts, pauses, stings, soundtrack envelope)
- `build/lib.mjs` (Part class: scene, words, chip, stamp, icon/sticker, vprint, broll, numbered, spoken, gaps),
  `build/banner.mjs`, `build/parts.mjs` (intro, cold open), `build/sections.mjs` (all sections)
- `node build/build.mjs [--render --quality draft|looks] <sections>` → HyperFrames render per section in `build/renders/`
  (lints first; HyperFrames forbids inline-style attribute selectors and CSS transforms on GSAP-animated elements)
- `node build/stings.mjs` → Remotion stings
- `python3 -I work/assemble.py <name>` → conform, concat, SFX mix (`build_audio.py`), subtitles (`subs.py`), final MP4
- `bash work/review.sh <round> <video>` → contact sheets, phone sheets, blank-frame and loudness checks
- Deliver: 1080p final (under 400 MB) + 720p preview.

## Asset sources and accounts
- Cartoon stickers and scenes: Masonry `gpt-image-2.5-flare` (~0.75 credit each), prompt prefix
  "Flat cartoon sticker illustration, bold dark ink outlines, warm saturated colours, centred on a plain flat cream
  background (#F7F1E3), no text"; cut out with the border flood-fill script into `media/icons/cut/`.
- **From Edition 1: do NOT use ElevenLabs for anything** (client keeps its credits for voiceovers) unless told otherwise.
- **Canva AI** (client's choice at Ed1) for stickers: `generate-image` → `create-design` (one page per pick) →
  `export-design` PNG 1400 px from export-download.canva.com (get-assets only gives 200 px thumbs). Multi-page
  exports can come back reordered/duplicated — match to previews by eye or export singly. Moderation blocks some
  colonial-violence scenes; use archive engravings instead. Cut out to 1000 px into `media/stickers_cut/`.
  Allowlist: `media.canva.com`, `export-download.canva.com`.
- Masonry ran out of credits (0.59) at Ed1.
- ElevenLabs (images/video/SFX) was out of credits at v3. `masonry.so` must be on the environment allowlist to download.
- Wikimedia Commons: use thumbnails / transcodes (originals rate-limit), and list attribution in the credits file.

## Edition structure (from Edition 1)
- Editions are numbered from 1 after the pilot. Each edition lives in its own tree `gcp/ed<N>/` (`src/vo.mp3`,
  `work/`, `media/`, `build/`) and reuses the shared engine `gcp/build/lib.mjs`, `banner.mjs`, `combo1.mjs`, `stings.mjs`.
  Point the shared code at the edition with env vars: `GCP_WORK=/home/user/gcp/ed<N>/work` (transcript, timeline),
  `GCP_RENDERS` and `GCP_STING_META` (sting renders + per-edition sting kickers JSON) for `stings.mjs`.
  **Set `GCP_EDITION="EDITION <N>"`** when building — it is the masthead strip label (defaults to the pilot's
  "HEADLINE EDITION"; Ed1 shipped a first assembly with the wrong label).
- Long SFX lists (600+ cues) overflow the ffmpeg command line: `build_audio.py` writes the graph to
  `mix.filter` and uses `-filter_complex_script`.
- **Order:** cold open — the voice starts at once with NO music, up to the hook question (Ed1: "…why is Ghana a powerful
  nation?") — then **COMBO1** — then "Chale, how things dey go…" and the segments.
- **COMBO1** (client's name for it) = "Optimum Digital presents" + the opening banner montage, 14 s, the soundtrack's
  identity (`build/combo1.mjs`, `combo1(seg)`). When the client says COMBO1, this is it.
- **Traditional segments** (get a Remotion sting with pauses): The Nest (no sting, follows COMBO1), Front Page, The Wire,
  The Palava Desk, Then v Now, The Editor's Note, The Dispatch.
- **Not segments:** Lead Story, The Team Aside, Letters Page. No sting — just a big heading written at the top
  (`heading()` in `ed1.mjs`: title + red underline, whoosh + paper slap, 1.6 s breath) and the content continues.
- Chop the spoken segment titles/timestamps out of the voiceover (`work/edl.py` → `edl.json`: VO spans with
  `gap_after` = `combo1` | `sting:<title>` | `head:<title>` | `outro`, cut at RMS silence points).
- Soundtrack: silent under the cold open, starts with COMBO1, ducks −21 under "Chale…", out before Front Page,
  returns at −24 under the Editor's Note onward, full for the outro.

## Layout discipline (Ed1 review lessons)
- Many short scenes per section (Lead Story had 27), never one long screen that accumulates clutter.
- Headline top-left, max 940 px wide; chips stacked one per line in the left column (x 150, y 400, 92 px pitch,
  `stack()`); the picture or sticker in the right column (`RIGHT = {x:1150, y:170, w:620}`). Stamps ≤ ~44–72 px so they
  never collide; small labels go in `chips-sm` divs.
- Stickers get a **life loop** after landing (`icon(..., {life:'bob'|'sway'|'pulse'|'jiggle'|'sail'|'float'|'spin'})`)
  so images feel alive during holds. Static gaps ≤ ~8 s (`build/gaps.mjs` lists them with the words spoken).
- Counters: GSAP `innerText` tween with `snap:{innerText:1}`. Lint: no IDs starting with a digit.
- Review with exact stills, not low-res renders: `build/snap.cjs` / `review_snaps.sh` open `hf/<sec>/index.html` in
  Playwright at 2560×1440, seek `window.__timelines.main`, screenshot each scene end. (Never render below 1920: under 1920 output
  the root pin crops the frame — use the 720p downscale of the 1080p assembly for previews.)
- More SFX on every pop-up (client ask): pop-1/2/3, knock, glass, paper slap, whip, bell, coins, murmur, rocket,
  wind, heartbeat (synthesized WAVs in `ed<N>/media/sfx/`, `fx()` helper).

## People images (client rule)
- Search comprehensively (Wikimedia Commons first) for every named person; render them **drawn but extremely close to
  the real photo**: `work/scripts/drawn.py` (NLM denoise → mean-shift paint + bilateral → XDoG ink lines,
  sigma 1.2, p 30, eps 0.04, phi 18; sepia wash on B/W archive photos). Engravings and maps stay as prints.
- Never invent a face. If no authentic image exists (Ed1: Osei Tutu, Okomfo Anokye, Osei Bonsu, McCarthy, Nana Afia
  Dokuaa, Hodgson, Armitage), use a name card. Check every download is the right subject (Ed1 had a staircase filed as
  "Osu Castle" and a crowd filed as "Hodgson").
- Commons downloads: only standard thumbnail widths (1280/960/500/330 px, `work/scripts/getthumbs.py`) avoid HTTP 429;
  originals and the API rate-limit. Record file/author/licence in `media/real/CREDITS.json` as you go.

## Signature combos (client names — never change them)
- **COMBO1** = "Optimum Digital presents" + the opening banner montage (soundtrack identity), after the cold open.
- **COMBO2** = the closing montage meeting the soundtrack's ending: the banner assembles for the outro and the
  soundtrack's final beat drop lands on it, exactly as in the pilot and Edition 1 v1. In `plan.py` the second
  soundtrack segment is aligned so it ENDS where the outro ends (`END = credits.T0`): `seg2_src = ST_LEN_END − (END −
  back_at)`, envelope full from `end_vo + 2.5` to `end_vo + 10`, fade to −60 at `END − 0.2`. Anything appended after
  the outro must not move this alignment (Ed1 v2 broke it by aligning to TOTAL after adding credits — fixed in v3).
- **COMBO3** = the end credits (THE COLOPHON) after COMBO2, **in silence**: one block at a time, each alone on the
  page (rise in through a mask, swish out), all within ~5 s, then fade to black. ALL CAPS; headings red (IBM Plex
  Mono), lines black (Playfair). No typeface line. © year = the year of publication (Ed1: 2026).

## Clash check (client: no text clashing or hiding under other text/pictures)
- `node ed1/build/clash.cjs <section>` samples the composition every 0.5 s and lists text-vs-text and
  text-vs-picture overlaps (captions of prints count as text) lasting ≥ 2 samples. Fix every hit before rendering;
  prefer motion: swish the older element away (`away()` helper) when a new one takes its place.
- Voice cuts must never fall before a word's end (`plan.py` searches the quiet point from word end + 30 ms; whisper
  ends sibilants early — Ed1 "suspen|se").
- Dynamise the Nest into short video moves more often in future editions (moving clips + camera travel on the still).

## The Nest team (client, canonical titles — use in mastheads and on-screen labels)
- Kofi — the Editor (narrator)
- Aba — **The Restless** (introduced in the pilot)
- Baaba — **The Ascendant** (not yet introduced as of Edition 1)
- Kwame — **The Combative** (introduced in Edition 1)
- Amo — **The Discerning** (not yet introduced as of Edition 1)
Masthead lists only members already introduced; the rest stay "Empty desk … To be announced" until their edition.

## The Nest (client rule — very important)
- **The Nest's authentic image is the pilot's illustration `project/media/final/nest-light.png`** (+ its moving versions
  `broll/nest-windows.mp4`, `broll/nest-push.mp4`). Bring it in **every time The Nest is mentioned**, in every edition.
- Tell stories with the camera on it: zoom in and out to specific objects/desks as they are named (pilot: jacket,
  tea, headphones; Ed1: open newsroom → no doors → the desks meant to work harder → the editor's desk → push into the
  laptop for the sticky note). Use the moving clip for a brief "video" of the room, then let the camera travel the
  still. Points on the 1920×1080 picture: back desks (930,470), left desks/chair (520,430), back-right lamp desk
  (1320,440), editor's typewriter desk (760,720), laptop (1200,690), jacket (430,640), tea (1575,790), headphones
  (1340,875). The picture is a night scene; grade it warm (soft-light dawn glow) for morning scripts.

## Every edition (client rules from Ed1 revisions)
- **No plain screens.** While the voice sets up a scene, hold the screen with an early line (`pre()`: a headline that
  flies off before the scene's own headline lands), a sticker or a chip. Check every section with
  `node build/empties.mjs <sections>` (late-starting scenes + gaps > 4.5 s, with the words spoken) and fix them.
- **The Lead Story heading lands with a BOOM** (`ed1/media/sfx/boom.wav`, synthesized: pitch-dropping sub + noise
  burst + room tail) and a small shake.
- **Section numbers count only the traditional segments with a sting sound**, in order (Ed1: Front Page 01, The Wire
  02, The Palava Desk 03, Then v Now 04, Editor's Note 05, Dispatch 06). Lead Story, Team Aside, Letters Page and The
  Nest are not numbered. Set them in `work/sting_meta.json`.
- **Show the reference book's cover** beside the line that names it (Ed1: Stephen Manning, *Britain at War with the
  Asante Nation 1823–1900*, Pen & Sword 2021 — `ed1/media/book/manning-cover.jpg`; a typeset stand-in is used until
  the real cover file exists).
- People with no authentic image may get a **cartoon representation when the client asks** (Ed1: Ntim Gyakari, Canva
  AI, labelled "(illustration)"); otherwise a name card.
- **End credits = THE COLOPHON**, after the closing montage: blocks roll in one after the other (~5 s), small, centred,
  on the blurred newspapers background; headings red (IBM Plex Mono), text ink (Playfair); then fade to black (see COMBO3 below: now one block at a time, in silence).
  Template (fill every placeholder from the edition):
  THE COLOPHON — Edition No. [#] · Price: ~[N]MB / CORRECTIONS & CLARIFICATIONS [None this edition. / Last edition we
  said X; it was Y.] / SOURCES & FURTHER READING [Author. Title. Publisher, year.] [Publication, "headline" (date).] /
  THE MASTHEAD Editor … Kofi; The [Adjective] … [Name] (only team members already introduced; Ed1: The Combative …
  Kwame); [Empty desk] … To be announced; "No desks assigned. Every story belongs to everyone at The Nest." /
  PRODUCTION Written, Edited and Narrated by Joshua Horlortu; Theme Music by Gonje Group, Legon / FINE PRINT The Nest
  newsroom is a fictional device. Set in Playfair Display, Libre Baskerville and Special Elite. Printed at The Nest,
  266 Sandpiper Loop, Onipa Enclave. © [year] Gold Coast Palava. (`credits()` in `ed1/build/ed1.mjs`; `plan.py` adds a
  6.6 s `credits` part after the outro.)

## Social reels (Instagram / TikTok / X — one file for all three)
- **From the next edition on (client): reels run ~2:00** and end with a spoken YouTube call to action in Kofi's voice,
  e.g. "Chale, check our YouTube channel for the full video" or "Chale, we go see for the next one, but go spy the
  YouTube channel, inside everything dey there" — cut it from that edition's voiceover (ask for the line if the VO lacks
  it), then the end card. The pilot and Edition 1 reels (v2, 2:04 / 2:54) are final as delivered — do not change them.
- **One 1080×1920 (9:16) H.264 MP4 per edition** (Instagram's Reel limit; X free accounts cap at 2:20 —
  the pilot reel is 2:04 so it fits everywhere). **Max resolution is 1080** (client rule). Never a cropped 16:9:
  every scene is re-blocked for portrait with the same engine (`GCP_FORMAT=9x16` in `build/lib.mjs`, zoom 1).
- **NO MUSIC on any social version** (client rule). Voice + SFX only, with extra SFX for engagement (`enrichSfx`:
  three alternating pop sounds on chips, paper slaps on landings, ticking counters, slap on name cards).
- **The opening montage is kept, re-designed for portrait** (`reels/bannerP.mjs`): same banner layers — newspaper
  sheets drop in top and bottom, side strips slide in, the eight desk cards arc in (four above, four below the lockup)
  and drift, symbol, places, wordmark glyph by glyph, rule, tagline. Edition reels: hook → question → montage → story.
  The end card is the montage (top cards) + "Watch the full edition on YouTube".
- **Pilot reel = an introduction to the initiative** (client): hook "A country that does not know its own story…",
  montage, what palava means, the segments (Lead Story, The Wire, Then v Now, four desks, Front Page), the tone, the
  five things in it for you, the Letters Page, subscribe. Edition reels: straight content, catchiest beats in order,
  opening on the most arresting line.
- **Spacing (client: no bunching or clashing):** single-line masthead at y 108; kicker 220; headline 280; picture /
  stickers spread 500–1450 (`reels/remap.py` spreads a layout drafted in the old zones: y ≥ 450 → 500 + 1.15·(y−450),
  frame heights ×1.15); captions at 1490; platform UI below. Check every scene with `snap.cjs` sheets for overlaps.
- **Pipeline (`gcp/reels/`):** `<reel>/spec.json` (voice lines by first/last phrase, gaps, beats `brand`/`endcard`) →
  `python3 -I cut.py <reel>` → `<reel>.mjs` (helpers in `rlib.mjs`: `hl`, `kick`, `sub`, `nameCard`, `counter`,
  `tallVid`, `tallPic`, `bannerP`, `endCard`, `captions`, `enrichSfx`) → `GCP_FORMAT=9x16 GCP_WORK=<edition work>
  GCP_EDITION=… node build.mjs <reel> --render` → `python3 -I mix.py <reel> <out.mp4>` (−14 LUFS, ≤ −1 dBTP, H.264).
- Videos sit above scene content: keep stamps/stickers out from under video frames. ≤ 5.5 s without a new element.
- **Reel captions:** whole phrase visible (upcoming words dimmed), spoken word in red, cream card, 60 px.

## Edition 2 (cocoa) — what changed (client asks)
- **Everything stays at 1080p**, COMBO3 included (client: "just keep everything at 1080").
- **COMBO1 comes after the Nest intro**: cold open (the Nest scene + the hook question) → COMBO1 → "My squad, how you dey?…".
- **The living Nest** (`ed2/build/nestlive.mjs`, `livingNest(p, t0, t1, opts)`): the Nest still plays like a real shot. Layers
  in `ed2/media/nest/`: `nest-bg.jpg` (fan blades painted out), `nest-fg.png` (desk, separate layer → parallax truck),
  `fan-hub.png`, `glass-alpha.png` (window mask), `clouds.png`. Pure GSAP: ceiling fan turning (SVG blades in a squashed
  circle), clock second hand ticking, clouds drifting behind the louvres, moon glow, lagoon glints, tea steam, lamp
  breathing + seeded flickers, dust in the lamplight, handheld breathing, warm evening grade; `aim(spot, scale, at)`
  moves the camera on springs. Pair it with `nestBed()` (room tone + clock tick each second). Use it every time the Nest
  is on screen for more than a beat; a still print is fine for a passing mention.
- **Canva stickers, full size without a design export:** generate-image → open ONE scratch design transaction
  (read-design open_transaction) → add a 1024² page → `insert_fill` the media once → then `update_fill` the same element
  with each media id: every edit-design result returns a 600 px render that is saved under tool-results; copy those,
  then `cancel` the transaction (nothing saved). create-design with references ignores them (stock template).
  Canva rate limits: ~5 generations per burst, then a cooldown. Cut-outs: `ed2/work/scripts/cutout.py` (fixed-range
  flood fill keeps the white sticker outline).
- **Whisper drifts after long digital silences** (first word after a spoken title starts 1–2 s early, and it invents
  "7." / "8." over silence): snap word starts to energy onsets and delete invented tokens before planning.
- **SFX:** `ed2/work/scripts/ed2_sfx.py` (synth: nest room tone, tick, typewriter key, snap, crinkle, shutter, register,
  ship, waves, fire, chant, drop, snip, bike bell, grind, thump, blip, kachunk, riser, crackle, hit, sparkle, scribble,
  bundle, swoop) + raw-take / mastered pair cut from the theme. SFX bus raised to −1 dB (was −3) for clearer effects.
- Masthead from Ed2: Kofi, Aba (The Restless), Kwame (The Combative), Baaba (The Ascendant, introduced Ed2), one empty desk.

## Edition 3 notes
- Voiceover: the client supplies the voiceover file. Respell "Ewe" as "Ay-vay" if it is ever synthesised. When the
  voice is generated from a known script, take words from the script and times from Whisper (ed3/work/align.py).
- Canva: generate in **Olahub's Team** (the connector must be connected with that team selected; the old team's AI
  credits are used up). Ed3 shipped with code-drawn stickers (ed3/build/art.mjs); Canva stickers resume from Ed4.
  Saved for the next edition: media_next/canva_stickers.json.
- Maps: ed3/build/maps.mjs (Natural Earth shapes, string-map look). Never paste flat graphics onto the Nest photo
  (client: no artificial-looking objects on the table); show such objects as full-frame close-ups instead.

## Open items carried forward
- Subtitles still use the trial font "Haas Grot Disp R Trial" — swap for a licensed or free font before publishing.
- Each new edition: expect iterative client notes; build, run review sheets, fix, then deliver master + preview.
