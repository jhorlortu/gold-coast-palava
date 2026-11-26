# Download Commons files as standard-size thumbnails (1280/960/500 px), which Wikimedia serves without throttling.
import json, sys, os, time, hashlib, subprocess, urllib.parse
OUT = sys.argv[1]; want = json.load(open(sys.argv[2])); os.makedirs(OUT, exist_ok=True)
cred_path = os.path.join(OUT, 'CREDITS.json'); credits = json.load(open(cred_path)) if os.path.exists(cred_path) else {}
UA = "video-studio/1.0 (personal non-commercial edit)"
for key, title in want.items():
    dst = os.path.join(OUT, key + '.jpg')
    if os.path.exists(dst) and os.path.getsize(dst) > 5000: continue
    f = title.replace(' ', '_'); h = hashlib.md5(f.encode()).hexdigest()
    ok = False
    for w in (1280, 960, 500, 330):
        name = f + ('.png' if f.lower().endswith('.svg') else '')
        url = f"https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{urllib.parse.quote(f)}/{w}px-{urllib.parse.quote(name)}"
        r = subprocess.run(['curl', '-sS', '-o', dst, '-w', '%{http_code}', '-A', UA, url], capture_output=True, text=True)
        typ = subprocess.run(['file', '-b', dst], capture_output=True, text=True).stdout
        if r.stdout == '200' and ('JPEG' in typ or 'PNG' in typ):
            ok = True; print('got', key, w, flush=True); break
        time.sleep(2)
    if not ok:
        print('FAIL', key, flush=True); os.path.exists(dst) and os.remove(dst); continue
    credits.setdefault(key, {"file": title, "source": "https://commons.wikimedia.org/wiki/File:" + f})
    json.dump(credits, open(cred_path, 'w'), indent=1); time.sleep(2)
