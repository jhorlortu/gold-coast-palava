import cv2, numpy as np, json
im = cv2.imread("/home/user/gcp/src/banner2/banner-hires-refined.png")
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
# card fill is the brightest surface (#FCF5E8); cream ground (#F3EBD7) and sheets are darker
m = (g > 240).astype(np.uint8)
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
n, lab, stats, cent = cv2.connectedComponentsWithStats(m)
cards = []
for i in range(1, n):
    if stats[i, cv2.CC_STAT_AREA] < 200000: continue
    ys, xs = np.where(lab == i)
    rect = cv2.minAreaRect(np.c_[xs, ys].astype(np.float32))
    cards.append({"cx": rect[0][0], "cy": rect[0][1], "w": rect[1][0], "h": rect[1][1], "a": rect[2], "area": int(stats[i, cv2.CC_STAT_AREA])})
cards.sort(key=lambda c: (round(c["cy"] / 700), c["cx"]))
for c in cards: print({k: round(v, 1) if isinstance(v, float) else v for k, v in c.items()})
json.dump(cards, open("/home/user/gcp/work/banner2/cards.json", "w"), indent=1)
