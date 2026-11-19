#!/bin/bash
# For each section: snapshot just before every scene ends (everything on screen), tile into a sheet.
for sec in "$@"; do
  ts=$(grep -o 'class="clip scene" data-start="[0-9.]*" data-duration="[0-9.]*"' hf/$sec/index.html | awk -F'"' '{e=$4+$6-0.75; if (e<0.2) e=0.2; printf "%.2f ", e}')
  node snap.cjs $sec /tmp/claude-0/gcp/rs_$sec.png $ts
  python3 - "$sec" $ts <<'P'
import sys
from PIL import Image
sec, ts = sys.argv[1], sys.argv[2:]
ims = [Image.open(f'/tmp/claude-0/gcp/rs_{sec}-{t}.png').resize((640, 360)) for t in ts]
cols = 3; rows = (len(ims) + cols - 1) // cols
o = Image.new('RGB', (640 * cols, 360 * rows), (255, 255, 255))
for i, im in enumerate(ims): o.paste(im, ((i % cols) * 640, (i // cols) * 360))
o.save(f'/tmp/claude-0/gcp/sheet_{sec}.jpg', quality=85)
P
done
