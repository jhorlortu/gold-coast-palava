#!/bin/bash
# Slow-paced Commons video fetcher: one file at a time, waits out 429s.
cd /home/user/gcp/project/media/broll
UA="video-studio/1.0 (personal non-commercial video edit)"
get() { # name file transcode
  local out=$1 f=$2 v=$3
  [ -s "$out" ] && { echo "have $out"; return; }
  local h=$(printf "%s" "$f" | md5sum | cut -c1-2)
  local u="https://upload.wikimedia.org/wikipedia/commons/transcoded/${h:0:1}/$h/$f/$f.$v"
  for i in 1 2 3; do
    code=$(curl -sS -o "$out.part" -w "%{http_code}" -A "$UA" "$u")
    if [ "$code" = 404 ]; then echo "$out: 404 $v"; rm -f "$out.part"; return; fi; if [ "$code" = 200 ]; then mv "$out.part" "$out"; echo "got $out $(stat -c %s $out)"; sleep 75; return; fi
    echo "$out: $code, waiting"; rm -f "$out.part"; sleep 240
  done
  echo "FAILED $out"
}




get rain-street.webm "Runoff_water_on_a_street_in_Shiashie.webm" 720p.vp9.webm
get jera-dance.webm "Jera,_dance_of_the_dagomba_people.webm" 720p.vp9.webm
get kumasi-market.webm "Market_in_Kumasi_(Ghana).webm" 480p.vp9.webm
echo DONE
get rain-street.webm "Runoff_water_on_a_street_in_Shiashie.webm" 480p.vp9.webm
get rain-street.webm "Runoff_water_on_a_street_in_Shiashie.webm" 1080p.vp9.webm
get jera-dance.webm "Jera,_dance_of_the_dagomba_people.webm" 480p.vp9.webm
echo DONE2
