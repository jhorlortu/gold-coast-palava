// Lightweight validation of project.json with messages that point at the problem.
const ITEM_TYPES = ['video', 'image', 'color', 'motion', 'design'];
const OVERLAY_TYPES = ['motion', 'design', 'image', 'video'];
const ENGINES = ['remotion', 'hyperframes'];

export function validateProject(spec) {
  const errors = [];
  const err = (where, msg) => errors.push(`${where}: ${msg}`);
  if (!Array.isArray(spec.timeline) || !spec.timeline.length) err('timeline', 'must be a non-empty array');
  const ids = new Set();
  const checkMotion = (where, it) => {
    if (it.engine && !ENGINES.includes(it.engine)) err(where, `engine must be one of ${ENGINES.join(', ')}`);
    if (it.type === 'design' && !it.design) err(where, '"design" (path to a design JSON, or an inline design object) is required');
    if (it.type === 'motion') {
      if ((it.engine ?? 'remotion') === 'remotion' && !it.composition) err(where, 'Remotion motion needs "composition" (DesignScene, TitleCard, LowerThird, StatCounter, or your own)');
      if (it.engine === 'hyperframes' && !it.project) err(where, 'HyperFrames motion needs "project" (a HyperFrames project directory)');
    }
  };
  (spec.timeline || []).forEach((it, i) => {
    const where = `timeline[${i}]${it.id ? ` (${it.id})` : ''}`;
    if (!ITEM_TYPES.includes(it.type)) return err(where, `type must be one of ${ITEM_TYPES.join(', ')}`);
    if (it.id) { if (ids.has(it.id)) err(where, `duplicate id "${it.id}"`); ids.add(it.id); }
    if ((it.type === 'video' || it.type === 'image') && !it.src) err(where, '"src" is required');
    if (it.in != null && it.out != null && it.out <= it.in) err(where, '"out" must be greater than "in"');
    if (it.speed != null && !(it.speed > 0)) err(where, '"speed" must be > 0');
    if (it.duration != null && !(it.duration > 0)) err(where, '"duration" must be > 0');
    if (i === 0 && it.transition && it.transition !== 'cut') err(where, 'the first item cannot have a transition (it has nothing to transition from)');
    checkMotion(where, it);
  });
  (spec.overlays || []).forEach((o, i) => {
    const where = `overlays[${i}]${o.id ? ` (${o.id})` : ''}`;
    if (!OVERLAY_TYPES.includes(o.type)) return err(where, `type must be one of ${OVERLAY_TYPES.join(', ')}`);
    if (o.start == null && o.at == null) err(where, 'needs "start" (seconds) or "at" (a timeline item id, optionally "+seconds")');
    if ((o.type === 'image' || o.type === 'video') && !o.src) err(where, '"src" is required');
    checkMotion(where, o);
  });
  if (spec.audio?.music && !spec.audio.music.src) err('audio.music', '"src" is required');
  (spec.audio?.tracks || []).forEach((t, i) => { if (!t.src) err(`audio.tracks[${i}]`, '"src" is required'); });
  if (spec.captions && !spec.captions.src && !spec.captions.cues) err('captions', 'needs "src" (an .srt/.ass file) or "cues"');
  if (errors.length) throw new Error(`Invalid project:\n  - ${errors.join('\n  - ')}`);
}
