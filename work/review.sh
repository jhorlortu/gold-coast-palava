#!/bin/bash
# Critique kit for one round: contact sheets, phone strip, fast strips, blank frames, loudness.
# usage: review.sh <round> <video>
R=$1; V=$2; OUT=/home/user/gcp/review/r$R; mkdir -p $OUT
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
# 1 frame every 4 s, 6 per row
ffmpeg -v error -y -i "$V" -vf "fps=1/4,scale=480:-2,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6,tile=6x6" -frames:v 5 $OUT/contact_%d.jpg
# phone test: 360 px wide, 1 frame every 6 s
ffmpeg -v error -y -i "$V" -vf "fps=1/6,scale=360:-2,tile=8x4" -frames:v 2 $OUT/phone_%d.jpg
# fast strips: 12 consecutive frames at the banner assembly and the musket shot
ffmpeg -v error -y -ss 7.6 -i "$V" -vf "scale=320:-2,tile=6x2" -frames:v 1 $OUT/strip_fast.jpg
ffmpeg -v error -y -ss ${3:-196} -i "$V" -vf "scale=320:-2,tile=6x2" -frames:v 1 $OUT/strip_fast2.jpg
# near-blank frames (uniform picture) and loudness
ffmpeg -hide_banner -i "$V" -vf "blackdetect=d=0.1:pix_th=0.06" -an -f null - 2>&1 | grep -o "black_start:[0-9.]* black_end:[0-9.]*" > $OUT/blank.txt
ffmpeg -hide_banner -i "$V" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tail -2 > $OUT/loudness.txt
echo "duration $D"; echo "blank runs: $(wc -l < $OUT/blank.txt)"; cat $OUT/blank.txt | head; cat $OUT/loudness.txt
