# Cut a sticker out of its flat cream background: flood-fill from the border, feather the edge, trim, resize.
import sys, cv2, numpy as np
src, dst = sys.argv[1], sys.argv[2]; tol = int(sys.argv[3]) if len(sys.argv) > 3 else 22
im = cv2.imread(src, cv2.IMREAD_COLOR); h, w = im.shape[:2]
mask = np.zeros((h + 2, w + 2), np.uint8)
flags = 4 | (255 << 8) | cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE
for x in range(0, w, 7):
    for y in (0, h - 1):
        if mask[y + 1, x + 1] == 0: cv2.floodFill(im, mask, (x, y), 0, (tol,) * 3, (tol,) * 3, flags)
for y in range(0, h, 7):
    for x in (0, w - 1):
        if mask[y + 1, x + 1] == 0: cv2.floodFill(im, mask, (x, y), 0, (tol,) * 3, (tol,) * 3, flags)
bg = mask[1:-1, 1:-1] > 0
a = (~bg).astype(np.uint8) * 255
a = cv2.morphologyEx(a, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
a = cv2.GaussianBlur(a, (0, 0), 1.0)
out = np.dstack([im, a]); ys, xs = np.where(a > 20)
out = out[max(0, ys.min() - 6):ys.max() + 7, max(0, xs.min() - 6):xs.max() + 7]
s = 1000 / max(out.shape[:2]); out = cv2.resize(out, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
cv2.imwrite(dst, out)
