# Slow, polite Commons search: one query every ~8 s, backs off on 429.
import json, sys, time, urllib.request, urllib.parse, urllib.error
UA = {"User-Agent": "video-studio/1.0 (research script; personal non-commercial edit)"}
def api(**p):
    p.update(format="json")
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(p)
    for i in range(6):
        try: return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))
        except urllib.error.HTTPError as e:
            if e.code == 429: time.sleep(30 * (i + 1)); continue
            raise
    return {}
out = {}
for q in sys.argv[2:]:
    r = api(action="query", generator="search", gsrsearch=q, gsrnamespace=6, gsrlimit=8,
            prop="imageinfo", iiprop="url|size|extmetadata", iiextmetadatafilter="LicenseShortName|Artist|ImageDescription")
    rows = []
    for pg in sorted(r.get("query", {}).get("pages", {}).values(), key=lambda x: x["index"]):
        ii = pg["imageinfo"][0]; md = ii.get("extmetadata", {})
        rows.append({"title": pg["title"], "w": ii["width"], "h": ii["height"], "url": ii["url"], "lic": md.get("LicenseShortName", {}).get("value", "?"),
                     "artist": md.get("Artist", {}).get("value", "")[:120]})
    out[q] = rows
    print(f"\n## {q}", flush=True)
    for x in rows: print(f"  {x['title'][:90]:90} {x['w']}x{x['h']} [{x['lic']}]", flush=True)
    json.dump(out, open(sys.argv[1], "w"), indent=1)
    time.sleep(8)
