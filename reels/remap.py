# Spread a reel layout over the taller safe area: anything placed at y >= 450 moves down and frame heights grow 15%.
import re, sys
f = sys.argv[1]; s = open(f).read()
Y = lambda v: round(500 + (v - 450) * 1.15) if v >= 450 else v
s = re.sub(r"\by: (\d+)", lambda m: f"y: {Y(int(m.group(1)))}", s)
s = re.sub(r"top:(\d+)px", lambda m: f"top:{Y(int(m.group(1)))}px", s)
s = re.sub(r"\bh: (\d+)", lambda m: f"h: {round(int(m.group(1)) * 1.15)}", s)
open(f, "w").write(s); print("remapped", f)
