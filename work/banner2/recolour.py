# Transfer the refined banner's colours onto the 5120x2880 original (same layout) with a 3D LUT,
# so the 2K film gets the deeper, livelier palette at full resolution.
import numpy as np, cv2
SRC = "/home/user/gcp/src/INTRO/Icons and Theme/Channel banner@2x.png"
REF = "/home/user/gcp/src/banner2/banner-refined.png"
OUT = "/home/user/gcp/src/banner2/banner-hires-refined.png"
hi = cv2.imread(SRC, cv2.IMREAD_COLOR)                      # BGR
ref = cv2.imread(REF, cv2.IMREAD_COLOR)
lo = cv2.resize(hi, (ref.shape[1], ref.shape[0]), interpolation=cv2.INTER_AREA)
B = 24                                                       # LUT bins per channel
q = (lo.astype(np.int32) * B) // 256
idx = (q[..., 0] * B + q[..., 1]) * B + q[..., 2]
lut = np.zeros((B ** 3, 3)); cnt = np.zeros(B ** 3)
np.add.at(lut, idx.ravel(), ref.reshape(-1, 3).astype(np.float64)); np.add.at(cnt, idx.ravel(), 1)
# global fallback: per-channel linear fit for bins never seen
A = np.c_[lo.reshape(-1, 3), np.ones(lo.shape[0] * lo.shape[1])]
coef, *_ = np.linalg.lstsq(A, ref.reshape(-1, 3).astype(np.float64), rcond=None)
centers = (np.stack(np.meshgrid(np.arange(B), np.arange(B), np.arange(B), indexing='ij'), -1).reshape(-1, 3) + 0.5) * 256 / B
fallback = np.c_[centers, np.ones(len(centers))] @ coef
lut = np.where(cnt[:, None] > 3, lut / np.maximum(cnt[:, None], 1), fallback)
lut = np.clip(lut, 0, 255).astype(np.float32).reshape(B, B, B, 3)
# trilinear sample of the LUT for every hi-res pixel (in chunks to save memory)
out = np.empty_like(hi)
for y0 in range(0, hi.shape[0], 256):
    p = hi[y0:y0 + 256].astype(np.float32) * B / 256 - 0.5
    p = np.clip(p, 0, B - 1.0001); i = np.floor(p).astype(int); f = p - i
    acc = 0
    for dx in (0, 1):
        for dy in (0, 1):
            for dz in (0, 1):
                w = (f[..., 0] if dx else 1 - f[..., 0]) * (f[..., 1] if dy else 1 - f[..., 1]) * (f[..., 2] if dz else 1 - f[..., 2])
                acc = acc + w[..., None] * lut[np.minimum(i[..., 0] + dx, B - 1), np.minimum(i[..., 1] + dy, B - 1), np.minimum(i[..., 2] + dz, B - 1)]
    out[y0:y0 + 256] = np.clip(acc, 0, 255).astype(np.uint8)
cv2.imwrite(OUT, out)
chk = cv2.resize(out, (ref.shape[1], ref.shape[0]), interpolation=cv2.INTER_AREA)
print("mean abs diff vs refined:", float(np.mean(np.abs(chk.astype(int) - ref.astype(int)))))
