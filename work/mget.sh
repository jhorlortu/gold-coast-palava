#!/bin/bash
# usage: mget.sh name url  -> media/icons/name.png
cd /home/user/gcp/project/media/icons && for i in 1 2 3; do curl -sS -f -o "$1.png" "$2" && break; sleep 20; done; file "$1.png" | cut -c1-80
