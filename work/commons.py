import json, sys, urllib.request, urllib.parse
UA = {"User-Agent": "video-studio/1.0 (research script)"}
def api(**p):
    p.update(format="json")
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(p)
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))
for q in sys.argv[1:]:
    r = api(action="query", generator="search", gsrsearch=q, gsrnamespace=6, gsrlimit=6,
            prop="imageinfo", iiprop="url|size|extmetadata", iiextmetadatafilter="LicenseShortName|Artist")
    print(f"\n## {q}")
    for pg in sorted(r.get("query", {}).get("pages", {}).values(), key=lambda x: x["index"]):
        ii = pg["imageinfo"][0]; md = ii.get("extmetadata", {})
        print(f"  {pg['title'][:80]:80} {ii['width']}x{ii['height']}  [{md.get('LicenseShortName',{}).get('value','?')}]")
