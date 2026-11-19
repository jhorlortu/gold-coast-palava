#!/bin/bash
# usage: dl.sh <name> <url>...   -> name-1.ext, name-2.ext ...
name=$1; shift; i=1
for u in "$@"; do ext=$(echo "$u" | sed -E 's/\?.*//; s/.*\.//'); curl -sS --retry 3 -o "$name-$i.$ext" "$u" && echo "$name-$i.$ext $(stat -c %s "$name-$i.$ext")"; i=$((i+1)); done
