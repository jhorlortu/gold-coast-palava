import json, sys, time, urllib.request, urllib.parse, os
UA={"User-Agent":"video-studio/1.0 (research script)"}
OUT="/home/user/gcp/project/media/img"
files={
 "mccarthy":"Charles Justin MacCarthy portrait.png",
 "asante-captain":"Ashanteewarcaptain.jpg",
 "asante-soldier":"Ashantee soldier2.jpg",
 "bowdich-mission":"BOWDICH(1819) Mission from Cape Coast Castle to Ashantee.jpg",
 "coomassie-street":"BOWDICH(1819) p344 PLATE 9 - COOMASSIE, PART OF ADAM STREET.jpg",
 "monroe":"James Monroe White House portrait 1819.jpg",
 "monroe-doctrine":"Monroe doctrine.jpg",
 "beethoven":"Ludwig van Beethoven (Stieler, 1820).jpg",
 "ninth-manuscript":"Ninth Symphony original.png",
 "rangoon":"Kemmendine attack 1824.jpg",
 "golden-stool-1935":"Golden stool 31 January 1935.jpg",
 "golden-stool-nara":"The Coming of the Ashanti Golden Stool - NARA - 558798.jpg",
 "congreve":"Congreve rocket start.jpg",
 "asantewaa-museum":"Yaa Asantewaa Museum 01.jpg",
}
def get(url, tries=5):
    for i in range(tries):
        try: return urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=60).read()
        except urllib.error.HTTPError as e:
            if e.code==429: time.sleep(10*(i+1)); continue
            raise
    raise RuntimeError("rate limited: "+url)
credits={}
titles=[f"File:{t}" for t in files.values()]
info={}
for i in range(0,len(titles),7):
    q=urllib.parse.urlencode({"action":"query","format":"json","titles":"|".join(titles[i:i+7]),"prop":"imageinfo","iiprop":"url|size|extmetadata","iiextmetadatafilter":"LicenseShortName|Artist|Credit"})
    r=json.loads(get("https://commons.wikimedia.org/w/api.php?"+q))
    norm={n["to"]:n["from"] for n in r["query"].get("normalized",[])}
    for p in r["query"]["pages"].values():
        if "imageinfo" not in p: print("MISSING",p["title"]); continue
        info[p["title"]]=p["imageinfo"][0]
    time.sleep(3)
import re
for key,t in files.items():
    ii=info.get("File:"+t) or next((v for k,v in info.items() if k.replace("_"," ")=="File:"+t),None)
    if not ii: print("no info",t); continue
    std=[w for w in (250,330,500,960,1280,1920) if w<ii["width"]] or [250]
    q2=urllib.parse.urlencode({"action":"query","format":"json","titles":"File:"+t,"prop":"imageinfo","iiprop":"url","iiurlwidth":std[-1]})
    r2=json.loads(get("https://commons.wikimedia.org/w/api.php?"+q2)); url=list(r2["query"]["pages"].values())[0]["imageinfo"][0]["thumburl"]
    ext=os.path.splitext(url.split("?")[0])[1].lower() or ".jpg"
    data=get(url); open(f"{OUT}/{key}{ext}","wb").write(data)
    md=ii["extmetadata"]; strip=lambda s: re.sub("<[^>]+>","",s or "").strip()
    credits[key]={"file":t,"license":md.get("LicenseShortName",{}).get("value"),"author":strip(md.get("Artist",{}).get("value")),"source":ii["descriptionurl"]}
    print(f"{key:18} {len(data)//1024:5}KB  {credits[key]['license']}  {credits[key]['author'][:50]}")
    time.sleep(6)
json.dump(credits,open(f"{OUT}/CREDITS.json","w"),indent=1)
