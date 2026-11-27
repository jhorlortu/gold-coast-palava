# YouTube thumbnails

- `editions/`: The Introduction, The Headline Edition and every numbered edition. Built on the client's front-page
  template (tilted front page with masthead, all-caps headline with a red last line and a Ghana line map, a red pill,
  a feature card with an oval print, and a card showing the Nest's five desks). Source: `src/editions.html`.
  Render with `node thumbnails/src/render-editions.cjs [intro pilot ed1 …]`. Maps: `node thumbnails/src/edmaps.mjs <dir with world-atlas + topojson-client>`.
- `specials/`: Specials (cream newsprint, print cards, stamp, WhatsApp chat bubble). Source: `src/thumbs.html`
  (sp1, sp2 blocks). Render with `node thumbnails/src/render.cjs [sp1 sp2]`.

1920×1080 JPG, under 2 MB. New edition: add an entry to `T` in `editions.html` (and a map in `edmaps.mjs`).
