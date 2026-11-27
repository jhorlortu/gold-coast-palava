# Turn a real photo/portrait into a drawn illustration that keeps the exact likeness.
# Fills: mean-shift paint regions (flat, painterly, faithful shapes). Lines: XDoG ink contours from the original.
# Archive B&W photos get a warm sepia ink-wash; colour paintings keep their colours, slightly richer.
import sys, cv2, numpy as np
def xdog(gray, sigma=0.9, k=1.6, p=19, eps=-0.08, phi=9):
    g = gray.astype(np.float32) / 255
    a = cv2.GaussianBlur(g, (0, 0), sigma); b = cv2.GaussianBlur(g, (0, 0), sigma * k)
    d = (1 + p) * a - p * b
    out = np.where(d >= eps, 1.0, 1 + np.tanh(phi * (d - eps)))
    return out.clip(0, 1)
def drawn(src, dst, width=1400):
    im = cv2.imread(src, cv2.IMREAD_COLOR)
    h, w = im.shape[:2]; s = width / w
    im = cv2.resize(im, (width, int(h * s)), interpolation=cv2.INTER_CUBIC if s > 1 else cv2.INTER_AREA)
    mono = float(np.mean(np.abs(im[..., 0].astype(int) - im[..., 2].astype(int)))) < 8
    den = cv2.fastNlMeansDenoisingColored(im, None, 6, 6, 7, 21)          # kill film grain / scan noise first
    paint = cv2.pyrMeanShiftFiltering(den, 12, 28, maxLevel=2)
    paint = cv2.bilateralFilter(paint, 9, 30, 9)
    gray = cv2.cvtColor(den, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 9, 40, 7)
    ink = xdog(gray, sigma=1.2 * width / 1000, p=30, eps=0.04, phi=18)
    ink = cv2.GaussianBlur(ink, (0, 0), 0.5)
    if mono:
        g = cv2.cvtColor(paint, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
        g = np.clip((g - 0.08) / 0.84, 0, 1) ** 0.9
        col = np.dstack([g * 165 + 50, g * 190 + 48, g * 212 + 40])         # warm sepia wash (BGR)
    else:
        hsv = cv2.cvtColor(paint, cv2.COLOR_BGR2HSV).astype(np.float32)
        hsv[..., 1] = np.clip(hsv[..., 1] * 1.18, 0, 255)
        col = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR).astype(np.float32)
    out = col * (0.05 + 0.95 * ink[..., None])
    cv2.imwrite(dst, out.clip(0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 93])
if __name__ == "__main__":
    drawn(sys.argv[1], sys.argv[2])
