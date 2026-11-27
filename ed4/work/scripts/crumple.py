# Crumple a banknote image (seeded): random straight creases make a height field; its gradient shades the paper
# (light from the top-left) and slightly displaces it; a faint ink-stain blot and worn, softened colour finish it.
import sys, numpy as np, cv2
src, dst = sys.argv[1], sys.argv[2]; rng = np.random.default_rng(int(sys.argv[3]) if len(sys.argv) > 3 else 7)
im = cv2.imread(src).astype(np.float32) / 255; h, w = im.shape[:2]
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
H = np.zeros((h, w), np.float32)
for _ in range(26):
    a = rng.uniform(0, np.pi); cx, cy = rng.uniform(0, w), rng.uniform(0, h)
    d = (xx - cx) * np.cos(a) + (yy - cy) * np.sin(a)
    H += rng.uniform(4, 14) * np.abs(np.tanh(d / rng.uniform(8, 30))) * rng.choice([-1, 1])
H = cv2.GaussianBlur(H, (0, 0), 1.6)
gx, gy = np.gradient(H)
shade = np.clip(1 + (-gx - gy) * 0.16, 0.62, 1.25)[..., None]
dx = cv2.GaussianBlur(gx, (0, 0), 6) * 5; dy = cv2.GaussianBlur(gy, (0, 0), 6) * 5
out = cv2.remap(im, xx + dx, yy + dy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT) * shade
# worn: a little desaturated and warmer, with a faint ink stain
g = out.mean(2, keepdims=True); out = out * 0.82 + g * 0.18; out[..., 0] *= 0.94
blot = np.exp(-(((xx - w * 0.72) / (w * 0.07)) ** 2 + ((yy - h * 0.7) / (h * 0.12)) ** 2))[..., None]
out = out * (1 - 0.22 * blot) + np.array([0.35, 0.25, 0.2]) * 0.22 * blot
cv2.imwrite(dst, np.clip(out * 255, 0, 255).astype(np.uint8)); print(dst)
