# Cut stickers out of their flat cream background: flood-fill from the border, feather, trim, upscale 1.6x (Lanczos).
import cv2, numpy as np, sys, os, glob
src, dst = sys.argv[1], sys.argv[2]; os.makedirs(dst, exist_ok=True)
for f in sorted(glob.glob(src + '/*.png')):
    im = cv2.imread(f); h, w = im.shape[:2]
    m = np.zeros((h + 2, w + 2), np.uint8)
    for seed in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        cv2.floodFill(im.copy(), m, seed, 0, (9, 9, 9), (9, 9, 9), cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE | (255 << 8) | 8)
    bg = m[1:-1, 1:-1] > 0
    a = (~bg).astype(np.uint8) * 255
    a = cv2.morphologyEx(a, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    a = cv2.GaussianBlur(a, (0, 0), 0.8)
    ys, xs = np.where(a > 10); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    rgba = np.dstack([im, a])[y0:y1, x0:x1]
    rgba = cv2.resize(rgba, None, fx=1.6, fy=1.6, interpolation=cv2.INTER_LANCZOS4)
    cv2.imwrite(os.path.join(dst, os.path.basename(f)), rgba)
    print(os.path.basename(f), rgba.shape[1], rgba.shape[0], f'{(~bg).mean():.2f}')
