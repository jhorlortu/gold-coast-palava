# Split each Heritage Series image (front above back) into two notes, trim the white page, upscale x4 (Lanczos),
# denoise lightly, sharpen (unsharp mask), keep full colour with a gentle vibrance lift. Out: ed4/media/notes/ghsN-{front,back}.png
import sys, os, numpy as np, cv2
SRC, OUT = '/home/user/gcp/ed4/src/notes', '/home/user/gcp/ed4/media/notes'
os.makedirs(OUT, exist_ok=True)
for f in sorted(os.listdir(SRC)):
    im = cv2.imread(os.path.join(SRC, f)); g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    ink = (g < 235).astype(np.uint8)
    rows = ink.mean(1) > 0.25
    # find the two biggest runs of "note" rows
    runs, s = [], None
    for i, v in enumerate(list(rows) + [False]):
        if v and s is None: s = i
        if not v and s is not None: runs.append((s, i)); s = None
    runs = sorted(sorted(runs, key=lambda r: r[1] - r[0])[-2:])
    for name, (a, b) in zip(['front', 'back'], runs):
        band = ink[a:b]; cols = np.where(band.mean(0) > 0.25)[0]; x0, x1 = cols[0], cols[-1] + 1
        n = im[a:b, x0:x1]
        n = n[2:-2, 2:-2]                                   # drop the anti-aliased edge
        n = cv2.fastNlMeansDenoisingColored(n, None, 3, 3, 7, 21)
        n = cv2.resize(n, None, fx=4, fy=4, interpolation=cv2.INTER_LANCZOS4)
        bl = cv2.GaussianBlur(n, (0, 0), 2.2); n = cv2.addWeighted(n, 1.7, bl, -0.7, 0)
        bl = cv2.GaussianBlur(n, (0, 0), 0.8); n = cv2.addWeighted(n, 1.35, bl, -0.35, 0)
        hsv = cv2.cvtColor(n, cv2.COLOR_BGR2HSV).astype(np.float32); hsv[..., 1] = np.clip(hsv[..., 1] * 1.12, 0, 255)
        n = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
        o = os.path.join(OUT, f"{f[:-4]}-{name}.png"); cv2.imwrite(o, n); print(o, n.shape[1], 'x', n.shape[0])
