# Script-to-audio alignment for Edition 3. The voice was read from known text, so the transcript's WORDS come
# from the script (correct spellings, no Whisper hallucinations or drops) and only the TIMES come from Whisper:
# difflib matches script tokens to Whisper tokens per section; unmatched script words get times interpolated
# between their matched neighbours; then any word start that sits in silence snaps to the next speech onset.
import json, re, difflib, numpy as np
W_ = '/home/user/gcp/ed4/work'
RAW = json.load(open(f'{W_}/transcript_raw.json'))
WH = [w for s in RAW['segments'] for w in s['words']]
SEC = [(l.split()[0], float(l.split()[1]), float(l.split()[2])) for l in open(f'{W_}/sections.txt')]
FILES = {'01': '01-nest', '02': '02-front', '03': '03-lead', '04': '04-wire', '05': '05-palava', '06': '06-thennow', '07': '07-team', '08': '08-editor', '09': '09-letters', '10': '10-dispatch'}
# spoken respellings -> written spellings (longest first)
SPELL = [('Agnes Tagwe Kwakupome', 'Agnes Tagoe-Quarcoopome'), ('Peter Poreku Deri', 'Peter Porekuu Dery'), ('Kwejir Aggrey', 'Kwegyir Aggrey'),
  ('Annie Jagge', 'Annie Jiagge'), ('Ah-see-edu Mante', 'Asiedu-Mante'), ('Orell Fussli', 'Orell Füssli'), ('Sikpa', 'SICPA'),
  ('Boonk-puru-gu', 'Bunkpurugu'), ('Half Aseeni', 'Half Assini'), ('pe-seh-was', 'pesewas'), ('pe-seh-wa', 'pesewa'), ('see-ka', 'sika'),
  ('seh-deh', 'sedie'), ('two six six', '266'), ('Doctor Letitia', 'Dr Letitia')]
def written(s):
    for a, b in SPELL: s = s.replace(a, b)
    return s
norm = lambda x: re.sub(r'[^a-z0-9]', '', x.lower())
p = np.fromfile(f'{W_}/vo16k.raw', np.int16).astype(np.float32)
rms = np.sqrt(np.convolve(p ** 2, np.ones(160) / 160, 'same')[::160] + 1e-9); thr = np.percentile(rms, 20) * 2.5
segs = []
for sid, a, b in SEC:
    text = written(open(f'{W_}/vo_sections/{FILES[sid]}.txt').read())
    toks = text.split()
    wh = [w for w in WH if a - 0.6 <= w['s'] <= b + 0.2]
    sm = difflib.SequenceMatcher(None, [norm(t) for t in toks], [norm(w['w']) for w in wh], autojunk=False)
    tim = [None] * len(toks)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            for q in range(i2 - i1): tim[i1 + q] = (wh[j1 + q]['s'], wh[j1 + q]['e'])
        elif tag == 'replace' and j2 > j1:     # spread the replaced span's time over the script words
            s0, e0 = wh[j1]['s'], wh[j2 - 1]['e']; n = i2 - i1
            for q in range(n): tim[i1 + q] = (s0 + (e0 - s0) * q / n, s0 + (e0 - s0) * (q + 1) / n)
    # interpolate the rest between known neighbours
    known = [i for i, t in enumerate(tim) if t]
    for i in range(len(toks)):
        if tim[i]: continue
        lo = max([k for k in known if k < i], default=None); hi = min([k for k in known if k > i], default=None)
        t0 = tim[lo][1] if lo is not None else a; t1 = tim[hi][0] if hi is not None else b
        nl = (lo if lo is not None else -1); nh = (hi if hi is not None else len(toks)); fr = (i - nl) / (nh - nl)
        s_ = t0 + (t1 - t0) * fr; tim[i] = (s_, s_ + max(0.12, (t1 - t0) / (nh - nl)))
    words = []
    for t, (s_, e_) in zip(toks, tim):
        s_ = max(a, min(s_, b - 0.05)); i = int(s_ * 100)
        if (rms[i:i + 12] < thr).all():                     # starts in silence -> snap to the next onset
            j = i
            while j < len(rms) - 1 and rms[j] < thr and j < int(b * 100): j += 1
            s_ = j / 100 - 0.03
        words.append({'w': ' ' + t, 's': round(s_, 3), 'e': round(max(e_, s_ + 0.08), 3), 'p': 1.0})
    for k in range(1, len(words)):                          # keep starts monotonic
        if words[k]['s'] < words[k - 1]['s']: words[k]['s'] = words[k - 1]['s'] + 0.01
    segs.append({'start': words[0]['s'], 'end': words[-1]['e'], 'text': text, 'words': words})
    print(sid, len(toks), 'words,', sum(1 for t in tim if t), 'timed')
json.dump({'duration': RAW['duration'], 'segments': segs}, open(f'{W_}/transcript.json', 'w'), indent=1)
