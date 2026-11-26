# Download specific Commons files (by title) as ~1600px thumbnails, slowly, and record attribution.
import json, sys, time, urllib.request, urllib.parse, urllib.error, os
UA = {"User-Agent": "video-studio/1.0 (research script; personal non-commercial edit)"}
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
want = json.load(open(sys.argv[2]))          # {key: "File title.jpg"}
cred_path = os.path.join(OUT, "CREDITS.json"); credits = json.load(open(cred_path)) if os.path.exists(cred_path) else {}
def get(url, tries=6):
    for i in range(tries):
        try: return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()
        except urllib.error.HTTPError as e:
            if e.code == 429: time.sleep(45 * (i + 1)); continue
            raise
    raise RuntimeError("rate limited " + url)
for key, title in want.items():
    if os.path.exists(os.path.join(OUT, key + ".jpg")): continue
    q = urllib.parse.urlencode({"action": "query", "format": "json", "titles": "File:" + title, "prop": "imageinfo", "iiprop": "url|size|extmetadata", "iiurlwidth": 1600, "iiextmetadatafilter": "LicenseShortName|Artist"})
    r = json.loads(get("https://commons.wikimedia.org/w/api.php?" + q))
    pg = next(iter(r["query"]["pages"].values()))
    if "imageinfo" not in pg: print("MISSING", key, title, flush=True); continue
    ii = pg["imageinfo"][0]; md = ii.get("extmetadata", {})
    url = (ii.get("thumburl") or ii["url"]).split("?")[0].replace("upload.wikimedia.org", "thumb.wikimedia.org" if "/thumb/" in (ii.get("thumburl") or "") else "upload.wikimedia.org")
    try: data = get(url, tries=8)
    except Exception as e: print("SKIP", key, e, flush=True); time.sleep(60); continue
    open(os.path.join(OUT, key + ".jpg"), "wb").write(data)
    import re
    credits[key] = {"file": title, "license": md.get("LicenseShortName", {}).get("value", "?"), "author": re.sub("<[^>]+>", "", md.get("Artist", {}).get("value", ""))[:120], "source": "https://commons.wikimedia.org/wiki/File:" + title.replace(" ", "_")}
    json.dump(credits, open(cred_path, "w"), indent=1)
    print("got", key, len(data), flush=True); time.sleep(20)
