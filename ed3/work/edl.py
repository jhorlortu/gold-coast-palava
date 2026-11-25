# Voiceover edit list for Edition 3: the voice was generated section by section (ElevenLabs, Joshua Horlortu voice,
# Multilingual v2) and joined with 3 s silences (sections.txt), so spans are the sections themselves; the only cut
# inside a section is before "My people, what dey go on?", where COMBO1 goes.
import json
S = {l.split()[0]: (float(l.split()[1]), float(l.split()[2])) for l in open('/home/user/gcp/ed3/work/sections.txt')}
SPLIT_END, SPLIT_START = 28.75, 29.22          # measured silence 28.67-29.28
SP = [("cold-open", 0.0, SPLIT_END, "combo1"), ("nest", SPLIT_START, S['01'][1], "sting:Front Page"),
      ("front-page", *S['02'], "head:LEAD STORY"), ("lead", *S['03'], "sting:The Wire"), ("wire", *S['04'], "sting:The Palava Desk"),
      ("palava", *S['05'], "sting:Then v Now"), ("then-now", *S['06'], "head:THE TEAM ASIDE"), ("team", *S['07'], "sting:Editor's Note"),
      ("editor", *S['08'], "head:LETTERS PAGE"), ("letters", *S['09'], "sting:Dispatch"), ("dispatch", *S['10'], "outro")]
out = [{"id": a, "vo_in": round(b, 3), "vo_out": round(c, 3), "gap_after": g} for a, b, c, g in SP]
json.dump(out, open('/home/user/gcp/ed3/work/edl.json', 'w'), indent=1)
for o in out: print(o)
