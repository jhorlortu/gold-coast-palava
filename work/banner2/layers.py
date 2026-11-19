# Cut the refined banner into animatable layers (at 2560-wide resolution) and write their layout positions.
import cv2, numpy as np, json, os
HI = cv2.imread("/home/user/gcp/src/banner2/banner-hires-refined.png")          # 5120x2880
OUT = "/home/user/gcp/build/assets/banner2"; os.makedirs(OUT, exist_ok=True)
K = 0.5                      # 5120 -> 2560 image pixels
L = 0.375                    # 5120 -> 1920 layout pixels
R = 2.56                     # 2000-wide reference coords -> 5120
cream = np.array([215, 235, 243], np.float32)    # BGR of #F3EBD7
ink = np.array([19, 22, 26], np.float32)
spec = {"cards": [], "plate": [], "text": {}}
# ---- cards
cards = json.load(open("/home/user/gcp/work/banner2/cards.json"))
B = 9                        # border thickness to include (hi-res px)
mask = np.zeros(HI.shape[:2], np.uint8)
for i, c in enumerate(cards):
    w, h, a = c["w"], c["h"], c["a"]
    if w < h: w, h, a = h, w, a + 90
    W_, H_ = int(w + 2 * B), int(h + 2 * B)
    M = cv2.getRotationMatrix2D((c["cx"], c["cy"]), a, 1.0)
    rot = cv2.warpAffine(HI, M, (HI.shape[1], HI.shape[0]), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    x0, y0 = int(c["cx"] - W_ / 2), int(c["cy"] - H_ / 2)
    crop = rot[y0:y0 + H_, x0:x0 + W_]
    crop = cv2.resize(crop, (int(W_ * K), int(H_ * K)), interpolation=cv2.INTER_AREA)
    cv2.imwrite(f"{OUT}/card{i}.png", crop)
    spec["cards"].append({"cx": c["cx"] * L, "cy": c["cy"] * L, "w": W_ * L, "h": H_ * L, "rot": a})
    box = cv2.boxPoints(((c["cx"] + 10, c["cy"] + 14), (w + 2 * B + 50, h + 2 * B + 50), a - 0)).astype(np.int32)   # incl. shadow
    cv2.fillPoly(mask, [box], 255)
# ---- plate: cards painted out, lockup cleared to cream
small = cv2.resize(HI, (2560, 1440), interpolation=cv2.INTER_AREA)
msmall = cv2.resize(mask, (2560, 1440), interpolation=cv2.INTER_NEAREST)
# fill the card holes with real newspaper texture (a clean sheet patch, tiled), not a smear
patch = small[60:330, 690:1010]
tile = np.tile(patch, (1440 // patch.shape[0] + 1, 2560 // patch.shape[1] + 1, 1))[:1440, :2560]
plate = small.copy(); plate[msmall > 0] = tile[msmall > 0]
edge = cv2.GaussianBlur(msmall, (9, 9), 0) / 255.0
plate = (plate * edge[..., None] + small * (1 - edge[..., None])).astype(np.uint8)
plate[msmall > 0] = tile[msmall > 0]
lx0, ly0, lx1, ly1 = [int(v * R * K) for v in (225, 355, 1770, 815)]
plate[ly0:ly1, lx0:lx1] = cream.astype(np.uint8)
cv2.imwrite(f"{OUT}/plate.png", plate)
# ring pieces (2000-coords), each flies in from its nearest edge
xs = [0, 520, 1000, 1500, 2000]
pieces = [(xs[i], 0, xs[i + 1], 355) for i in range(4)] + [(xs[i], 815, xs[i + 1], 1125) for i in range(4)] + [(0, 355, 225, 815), (1770, 355, 2000, 815)]
for j, (x0, y0, x1, y1) in enumerate(pieces):
    X0, Y0, X1, Y1 = [int(v * R * K) for v in (x0, y0, x1, y1)]
    cv2.imwrite(f"{OUT}/sheet{j}.png", plate[Y0:Y1, X0:X1])
    spec["plate"].append({"x": X0 / K / R * R * L / 1 * 1, "y": Y0 / K * L, "w": (X1 - X0) / K * L, "h": (Y1 - Y0) / K * L})
for p in spec["plate"]: p["x"] = round(p["x"] / 1 * 1, 2)
# fix x (computed above via the same formula as y)
for j, (x0, y0, x1, y1) in enumerate(pieces):
    spec["plate"][j]["x"] = int(x0 * R * K) / K * L
# ---- lockup text: unmix ink from cream -> alpha, colour = ink
def text_layer(name, x0, y0, x1, y1):
    X0, Y0, X1, Y1 = [int(v * R) for v in (x0, y0, x1, y1)]
    reg = HI[Y0:Y1, X0:X1].astype(np.float32)
    lum = reg.mean(-1); cl = cream.mean(); il = ink.mean()
    alpha = np.clip((cl - lum) / (cl - il), 0, 1)
    rgba = np.zeros((*alpha.shape, 4), np.float32); rgba[..., :3] = ink; rgba[..., 3] = alpha * 255
    rgba = cv2.resize(rgba, (int((X1 - X0) * K), int((Y1 - Y0) * K)), interpolation=cv2.INTER_AREA)
    cv2.imwrite(f"{OUT}/{name}.png", rgba.astype(np.uint8))
    spec["text"][name] = {"x": X0 * L, "y": Y0 * L, "w": (X1 - X0) * L, "h": (Y1 - Y0) * L}
    return alpha
text_layer("places", 600, 472, 1200, 503)
wa = text_layer("word", 600, 508, 1350, 600)
text_layer("rule", 600, 600, 1350, 610)
text_layer("tag", 600, 610, 1290, 650)
# wordmark glyph slices (for the letter-by-letter rise)
col = wa.max(0) > 0.08
cuts, inside, start = [], False, 0
for x, v in enumerate(col):
    if v and not inside: inside, start = True, x
    if not v and inside: inside = False; cuts.append((start, x))
if inside: cuts.append((start, len(col)))
spec["text"]["word_glyphs"] = [[a * L, b * L] for a, b in cuts]
# symbol region (we keep the vector symbol; this is its box in layout px)
spec["symbol"] = {"x": 425 * R * L, "y": 487 * R * L, "w": 122 * R * L, "h": 146 * R * L}
# kente strips
top = HI[0:int(22 * R)]; bot = HI[HI.shape[0] - int(22 * R):]
cv2.imwrite(f"{OUT}/kente-top.png", cv2.resize(top, (2560, int(top.shape[0] * K)), interpolation=cv2.INTER_AREA))
cv2.imwrite(f"{OUT}/kente-bot.png", cv2.resize(bot, (2560, int(bot.shape[0] * K)), interpolation=cv2.INTER_AREA))
spec["kente_h"] = 22 * R * L
json.dump(spec, open(f"{OUT}/spec.json", "w"), indent=1)
print(len(spec["cards"]), "cards,", len(spec["plate"]), "sheet pieces,", len(cuts), "glyph groups")
# ---- sheet pieces: cream keyed out so they sit on any cream page; and a full-frame paper texture
for j, (x0, y0, x1, y1) in enumerate(pieces):
    X0, Y0, X1, Y1 = [int(v * R * K) for v in (x0, y0, x1, y1)]
    X0, Y0, X1, Y1 = max(0, X0 - 6), max(0, Y0 - 6), min(2560, X1 + 6), min(1440, Y1 + 6)
    spec['plate'][j] = {'x': X0 / K * L, 'y': Y0 / K * L, 'w': (X1 - X0) / K * L, 'h': (Y1 - Y0) / K * L}
    piece = plate[Y0:Y1, X0:X1].astype(np.float32)
    d = np.sqrt(((piece - cream) ** 2).sum(-1))
    a = np.clip((d - 7) / 13, 0, 1)
    cv2.imwrite(f"{OUT}/sheet{j}.png", np.dstack([piece, a * 255]).astype(np.uint8))
tb = plate[int(24 * R * K):int(355 * R * K)]; bb = plate[int(815 * R * K):int(1100 * R * K)]
tex = np.vstack([tb, bb, tb, bb])[:1440]
cv2.imwrite(f"{OUT}/papers-bg.jpg", tex, [cv2.IMWRITE_JPEG_QUALITY, 88])
json.dump(spec, open(f"{OUT}/spec.json", "w"), indent=1)
print("papers-bg", tex.shape)
