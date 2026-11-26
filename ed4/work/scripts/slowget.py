# Patient Commons downloader for small originals: one file every ~20 s, long back-off on 429. Uses search JSON urls.
import json, sys, os, time, subprocess, glob
OUT = sys.argv[1]; want = json.load(open(sys.argv[2])); os.makedirs(OUT, exist_ok=True)
urls = {}
for f in glob.glob('/home/user/gcp/ed4/work/search*.json'):
    for rows in json.load(open(f)).values():
        for r in rows: urls[r['title']] = r
cred_path = os.path.join(OUT, 'CREDITS.json'); credits = json.load(open(cred_path)) if os.path.exists(cred_path) else {}
UA = "video-studio/1.0 (personal non-commercial edit)"
for key, title in want.items():
    if title not in urls: print('no url', key, flush=True); continue
    ext = '.png' if title.lower().endswith('.png') else '.jpg'
    dst = os.path.join(OUT, key + ext)
    if os.path.exists(dst) and os.path.getsize(dst) > 5000: continue
    for i in range(8):
        r = subprocess.run(['curl', '-sS', '-o', dst + '.part', '-w', '%{http_code}', '-A', UA, urls[title]['url'].split('?')[0]], capture_output=True, text=True)
        if r.stdout == '200': os.replace(dst + '.part', dst); print('got', key, flush=True); break
        print(key, r.stdout, 'wait', 40 * (i + 1), flush=True); time.sleep(40 * (i + 1))
    else: os.path.exists(dst) and os.remove(dst); continue
    credits[key] = {"file": title, "source": "https://commons.wikimedia.org/wiki/" + title.replace(' ', '_'), "licence": urls[title]['lic'], "author": urls[title]['artist']}
    json.dump(credits, open(cred_path, 'w'), indent=1); time.sleep(20)
