#!/bin/bash
# usage: sheet.sh <section> <name> t1 t2 ... -> scratch snaps/<name>.jpg (2 columns, in time order)
S=/tmp/claude-0/-home-user-gold-coast-palava/9db7b626-2366-5e90-baaf-51e680459bd1/scratchpad/snaps; mkdir -p $S
sec=$1; name=$2; shift 2
rm -f $S/_${name}-*.png
node /home/user/gcp/sp2/build/snap.cjs $sec $S/_${name}.png "$@"
python3 -I - "$S" "$name" "$@" <<'P'
import sys
from PIL import Image
S, name, ts = sys.argv[1], sys.argv[2], sys.argv[3:]
ims = [Image.open(f'{S}/_{name}-{t}.png').resize((960, 540)) for t in ts]
W = Image.new('RGB', (1920, 540 * ((len(ims) + 1) // 2)), 'white')
for i, im in enumerate(ims): W.paste(im, ((i % 2) * 960, (i // 2) * 540))
W.save(f'{S}/{name}.jpg', quality=82)
P
