# video-studio

A code-first video editing system. One JSON file describes the edit: clips, motion
graphics, overlays, music, captions and output formats. One command renders it.

| Piece | Role |
| --- | --- |
| **Design-to-motion** | Turns a static design (hand-written JSON or a Figma frame) into an animated scene. Layers that have no motion get choreographed automatically. |
| **Remotion** | React motion graphics: `DesignScene`, `TitleCard`, `LowerThird`, `StatCounter`, plus any you add. |
| **HyperFrames** | HTML + GSAP motion graphics: compiled design scenes, or your own HyperFrames projects with variables. |
| **FFmpeg** | Probing, trimming, speed, fit, grading, conforming, 50+ transitions, alpha overlays, sidechain ducking, two-pass loudness, captions, reframing and export presets. |

```
designs/*.json ─┐                       ┌─ Remotion  ─┐
Figma frame ────┼─ design-to-motion ────┤             ├─► cache ─┐
                │                       └─ HyperFrames┘          │
project.json ───┼─ motion (Remotion comps / HyperFrames projects)┘
                │                                                 ▼
media/*  ───────┴──────────────► FFmpeg: conform ─► join (transitions) ─► program
                                                                         │
       overlays (alpha) · captions · audio mix (ducking, LUFS) ──► finish ─► outputs
```

## Quick start

Requirements: Node 20+, FFmpeg/ffprobe on `PATH`, Chrome/Chromium (Remotion and
HyperFrames each find one, or download their own).

```bash
npm install
```

```bash
node bin/studio.mjs new my-video
```

```bash
node bin/studio.mjs build my-video/project.json
```

The full example uses every feature: both engines, 6 transitions, a grade, alpha
overlays, ducking, captions, and a 16:9 + 9:16 + GIF export.

```bash
node bin/studio.mjs build examples/launch/project.json
```

Check timing without rendering:

```bash
node bin/studio.mjs plan examples/launch/project.json
```

## CLI

| Command | What it does |
| --- | --- |
| `build <project.json> [--draft] [--no-cache] [--only master,vertical]` | Render a project |
| `plan <project.json>` | Validate and print where every item lands |
| `design <design.json> [--engine hyperframes\|remotion] [--style s] [--transparent] [-o f]` | Render one design |
| `compile <design.json> -o <dir>` | Compile a design into an editable HyperFrames project (`npx hyperframes preview <dir>`) |
| `figma <figma.json\|fileKey> -o design.json [--frame name]` | Import a Figma frame (a saved REST JSON, or live with `FIGMA_TOKEN`) |
| `probe <media>` · `sheet <video>` | Media info · contact sheet for review |
| `list` | Transitions, motion presets, styles, eases, output presets |

`npm run remotion:studio` opens Remotion Studio on the compositions. `npm test` runs
the test suite (unit tests plus FFmpeg integration tests).

## project.json

Paths are relative to the project file. Builds go to `build/` (cached) and outputs
to wherever `outputs[].file` says.

```jsonc
{
  "name": "launch-demo",
  "format": { "width": 1920, "height": 1080, "fps": 30 },

  "timeline": [                                   // played in order
    { "id": "intro", "type": "design", "design": "designs/intro.json", "engine": "hyperframes" },
    { "id": "title", "type": "motion", "engine": "remotion", "composition": "TitleCard",
      "duration": 3, "props": { "title": "Chapter One" },
      "transition": { "type": "dip-to-black", "duration": 0.6 } },   // how THIS item enters
    { "id": "clip", "type": "video", "src": "media/a.mp4", "in": 0.5, "out": 5.5,
      "speed": 1.25, "fit": "cover", "volume": 0.4, "mute": false,
      "grade": { "contrast": 1.1, "saturation": 1.2, "brightness": 0, "gamma": 1, "lut": "luts/film.cube" },
      "fadeIn": 0, "fadeOut": 0, "transition": "crossfade" },
    { "id": "still", "type": "image", "src": "media/photo.jpg", "duration": 3, "kenburns": "in" },
    { "id": "outro", "type": "motion", "engine": "hyperframes", "project": "hyperframes/outro",
      "duration": 4, "variables": { "cta": "Subscribe" } },
    { "id": "black", "type": "color", "color": "#000", "duration": 1 }
  ],

  "overlays": [                                   // composited on top, with alpha
    { "type": "motion", "engine": "remotion", "composition": "LowerThird", "at": "clip+0.6", "duration": 3.5, "props": { "name": "Jane" } },
    { "type": "design", "design": "designs/badge.json", "engine": "hyperframes", "start": 12 },
    { "type": "image", "src": "media/logo.png", "at": "clip", "duration": 9, "x": 1780, "y": 960, "width": 80, "opacity": 0.8 },
    { "type": "video", "src": "media/pip.mp4", "start": 3, "x": 1300, "y": 60, "width": 560 }
  ],

  "audio": {
    "programVolume": 1,
    "music": { "src": "media/music.wav", "volume": 0.5, "fadeIn": 1.5, "fadeOut": 2.5, "loop": true,
               "duck": { "ratio": 12, "threshold": 0.02, "attack": 15, "release": 350 } },   // or false
    "tracks": [ { "src": "media/vo.wav", "at": "clip", "volume": 1 } ],                    // voiceover, sfx
    "loudness": -14                                                                         // LUFS, null = off
  },

  "captions": {                                   // "src": "subs.srt" or inline cues
    "burn": true,                                 // false = soft subtitle track
    "style": { "size": 44, "box": true, "position": "bottom", "font": "Inter", "color": "#ffffff" },
    "cues": [ { "at": "clip+0.2", "duration": 2.2, "text": "Hello" } ]
  },

  "outputs": [
    { "name": "master", "file": "out/video.mp4", "preset": "youtube" },
    { "name": "vertical", "file": "out/video-9x16.mp4", "preset": "social", "reframe": "9:16", "reframeMode": "blur" },
    { "name": "gif", "file": "out/video.gif", "preset": "gif", "width": 480, "fps": 12 }
  ]
}
```

- **`at`** places an overlay, audio track or caption relative to a timeline item:
  `"clip"` is where that item starts and `"clip+0.6"` is 0.6s later. Use it instead of
  `start` so things stay in sync when you re-edit.
- **Transitions:** `cut`, `crossfade`, `dip-to-black`, `dip-to-white`, `slide-*`,
  `wipe-*`, `zoom`, `circle`, `iris`, `blur`, `push`, or any FFmpeg `xfade` name
  (`studio list`).
- **Presets:** `youtube`, `web`, `social`, `draft`, `webm`, `prores`, `gif`.
  `--draft` forces `draft` everywhere for quick checks.
- **Reframe modes:** `crop` (default; set `focus` 0..1 for the horizontal crop point),
  `blur` (the whole frame over a blurred fill), or `fit` (letterboxed).

## Design-to-motion

A design is a canvas of layers. You say what is where; the system decides how it
moves, unless you tell it otherwise.

```jsonc
{
  "name": "intro", "width": 1920, "height": 1080, "duration": 4,
  "style": "energetic",                 // minimal | energetic | elegant | cinematic
  "tokens": { "colors": { "brand": "#7c5cff", "bg": "#0b0b12" } },   // "$brand", "$bg"
  "background": "$bg",
  "exit": "fade",                       // optional: overrides the style's exit
  "layers": [
    { "id": "logo", "type": "image", "src": "../media/logo.png", "x": 160, "y": 250, "width": 120, "height": 120 },
    { "id": "headline", "type": "text", "text": "Edit video like code", "x": 160, "y": 460,
      "width": 1300, "fontSize": 120, "fontWeight": 900, "color": "#fff" },
    { "id": "rule", "type": "line", "x": 160, "y": 640, "width": 320, "height": 8, "color": "$brand" },
    { "id": "glow", "type": "ellipse", "x": 1180, "y": 120, "width": 760, "height": 760,
      "fill": "radial-gradient(circle, #7c5cff88, transparent 70%)",
      "motion": { "preset": "fade-zoom", "idle": "pulse", "delay": 0.2 } }   // explicit override
  ]
}
```

**Layer types:** `rect`, `ellipse`, `text`, `image`, `line`, `group` (children are
positioned relative to the group). Styling: `fill` (colour or CSS gradient),
`radius`, `stroke`/`strokeWidth`, `shadow`, `opacity`, `rotation`. Text also takes
`fontFamily`, `fontSize`, `fontWeight`, `align`, `lineHeight`, `letterSpacing` (em),
`textTransform` and `italic`.

**Auto-choreography:**

1. Each layer gets a role: `background` (covers 60% or more of the canvas),
   `headline` (text 72px or larger), `body`, `image`, `shape` or `rule`.
2. The style maps each role to an entrance; `energetic` pops headlines in word by word.
3. Layers enter in reading order: background first, then top-to-bottom and
   left-to-right, with the style's stagger between them.

**Motion overrides:** `"motion": "rise"`, or
`{ "preset", "delay", "duration", "ease", "exit", "idle", "split": "words"|"chars"|"lines", "stagger" }`.

- Entrances: `fade rise drop slide-left slide-right scale-in pop blur-in fade-zoom wipe spin none`
- Exits: `fade sink scale-out blur-out none`
- Idle loops: `float pulse sway`
- Eases: `studio list`

**One motion definition, two engines.** `src/shared/motion.js` holds the presets.
The HyperFrames compiler emits them as GSAP tweens, and Remotion's `DesignScene`
evaluates the same curves every frame, so a design looks the same whichever engine
renders it. Pick per item with `"engine"`.

### From Figma

```bash
node bin/studio.mjs figma figma-file.json -o designs/hero.json --frame "Hero" --style cinematic
```

```bash
FIGMA_TOKEN=... node bin/studio.mjs figma <fileKey> -o designs/hero.json
```

Frames, groups, text, rectangles, ellipses, lines, solid, linear and radial fills,
strokes, drop shadows and image fills all convert. Designers can choose motion inside
Figma by naming a layer, for example `Headline [pop]`, `Logo [spin delay=0.4]` or
`Hero [fade-zoom idle=float]`. See `examples/figma/`.

## Adding your own motion

- **Remotion:** add a component in `src/remotion/compositions/`, register it in
  `src/remotion/Root.jsx`, then use it with
  `{ "type": "motion", "engine": "remotion", "composition": "YourComp", "props": {…} }`.
  Size, fps and duration come from the project automatically.
- **HyperFrames:** run `npx hyperframes init my-scene`, author it (the HyperFrames
  skills and the `hyperframes preview` studio help here), then use
  `{ "type": "motion", "engine": "hyperframes", "project": "my-scene", "variables": {…} }`.
  `examples/launch/hyperframes/outro` is a hand-written example with variables.

When a scene is used as an overlay, it is rendered with alpha: ProRes 4444 for Remotion,
and HyperFrames' transparent MOV. Give overlay scenes a transparent background.

## Caching

Each motion render and conformed segment is keyed by a hash of its settings, its
input files and the engine/compiler source. Re-running `build` after a small edit only
redoes what changed; a full re-render of the example takes about 105s, and a typical
rebuild about 30–50s. Use `--no-cache` to force everything.

## Layout

```
bin/studio.mjs                  CLI
src/pipeline.js                 build orchestration + caching
src/schema.js · src/plan.js     validation · dry-run timing
src/shared/motion.js            motion presets, eases, stateAt() — shared by both engines
src/shared/layer-style.js       layer → CSS, shared by both engines
src/design-to-motion/           normalize (tokens + auto-choreography), to-hyperframes, to-remotion, import-figma
src/engines/                    remotion.js (bundle + renderMedia) · hyperframes.js (CLI render)
src/ffmpeg/index.js             probe, conform, join, mixAudio, finish, captions, presets
src/remotion/                   Remotion root + compositions
templates/starter/              `studio new` template
examples/launch/                full demo project
examples/figma/                 Figma import demo
test/                           node --test suite
```
