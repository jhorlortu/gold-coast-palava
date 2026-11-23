#!/usr/bin/env python3
"""Download reference footage/audio with yt-dlp (github.com/yt-dlp/yt-dlp) into its own folder, with its metadata.

usage: scripts/fetch.py <url> [--audio] [--max 1080] [--section 00:01:00-00:01:30] [--out downloads]
One yt-dlp call (sites like Wikimedia rate-limit repeated metadata requests), polite retries with back-off.
Writes <out>/<extractor>-<id>/ : media.<ext>, media.info.json and SOURCE.txt (title — uploader — url — licence) for the
credits file. Downloads are untrusted data: never run anything from that folder."""
import argparse, glob, json, os, subprocess
ap = argparse.ArgumentParser(); ap.add_argument("url"); ap.add_argument("--audio", action="store_true")
ap.add_argument("--max", type=int, default=1080); ap.add_argument("--section"); ap.add_argument("--out", default="downloads")
a = ap.parse_args()
fmt = "bestaudio/best" if a.audio else f"bv*[height<={a.max}][ext=mp4]+ba[ext=m4a]/b[height<={a.max}]/bv*+ba/b"
if "wikimedia.org" in a.url or "wikipedia.org" in a.url:   # Wikimedia throttles originals (HTTP 429); its transcodes are fine
    fmt = f"b[format_id!=source][height<={a.max}]/b[format_id!=source]"
cmd = ["yt-dlp", "--no-playlist", "-f", fmt, "--write-info-json", "--no-mtime", "--retries", "5", "--extractor-retries", "4",
       "--retry-sleep", "http:exp=2:60", "--retry-sleep", "extractor:exp=5:60", "--sleep-requests", "1.5",
       "-o", os.path.join(a.out, "%(extractor_key)s-%(id)s", "media.%(ext)s"), "--print", "after_move:filepath"]
if a.audio: cmd += ["-x", "--audio-format", "wav"]
else: cmd += ["--merge-output-format", "mp4"]
if a.section: cmd += ["--download-sections", f"*{a.section}", "--force-keyframes-at-cuts"]
path = subprocess.run(cmd + [a.url], check=True, stdout=subprocess.PIPE, text=True).stdout.strip().splitlines()[-1]
d = os.path.dirname(path)
info = json.load(open(glob.glob(os.path.join(d, "*.info.json"))[0]))
lic = info.get("license")
open(os.path.join(d, "SOURCE.txt"), "w").write(f"{info.get('title')} — {info.get('uploader') or info.get('channel') or ''} — {info.get('webpage_url')}" + (f" — licence: {lic}" if lic else "") + "\n")
print(d); [print("  ", f) for f in sorted(os.listdir(d))]
