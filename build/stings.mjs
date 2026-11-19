import fs from 'node:fs';
import { RemotionEngine } from '/home/user/video-studio/src/engines/remotion.js';
const plan = JSON.parse(fs.readFileSync((process.env.GCP_WORK || '/home/user/gcp/work') + '/timeline.json', 'utf8'));
const META = {
  'Front Page': { n: '03', sub: 'A sample from the archive', icon: 'gcp-highlight-issues-1080x1080.png' },
  'The Wire': { n: '03', sub: 'Same week, elsewhere', icon: 'gcp-highlight-issues-1080x1080.png' },
  'Then v Now': { n: '04', sub: 'What you walk away with', icon: 'gcp-highlight-team-1080x1080.png' },
  'The Palava Desk': { n: '05', sub: 'The Nest: one desk', icon: 'gcp-highlight-nest-1080x1080.png' },
  "Editor's Note": { n: '06', sub: 'From the editor', icon: 'gcp-highlight-letters-1080x1080.png' },
  'Dispatch': { n: '08', sub: 'Filed, signed and sent', icon: 'gcp-highlight-letters-1080x1080.png' },
};
if (process.env.GCP_STING_META) Object.assign(META, JSON.parse(fs.readFileSync(process.env.GCP_STING_META, 'utf8')));
const fonts = [{ family: 'Playfair', file: 'pf900.woff2', weight: 900 }, { family: 'PlayfairI', file: 'pf400i.woff2', weight: 400, style: 'italic' }, { family: 'Plex', file: 'plex700.woff2', weight: 700 }];
const eng = new RemotionEngine({ publicDir: '/home/user/gcp/build/remotion-public', log: () => {} });
const only = process.argv.slice(2);
for (const p of plan.parts.filter((x) => x.kind === 'sting')) {
  if (only.length && !only.includes(p.id)) continue;
  const frames = Math.round((p.T0 + p.dur) * 30) - Math.round(p.T0 * 30);
  const m = META[p.title];
  await eng.render({ compositionId: 'SectionSting', outFile: `${process.env.GCP_RENDERS || '/home/user/gcp/build/renders'}/${p.id}.mp4`, concurrency: 2,
    props: { width: +(process.env.GCP_OUT_W || 1920), height: Math.round(+(process.env.GCP_OUT_W || 1920) * 9 / 16), fps: 30, palette: { paper: '#F3EBD7', gold: '#C8962F', red: '#A4241B' }, duration: frames / 30, title: p.title.toUpperCase().replace(' V ', ' v '), kicker: 'GOLD COAST PALAVA', subtitle: m.sub, number: m.n, icon: m.icon, stingAt: p.sting_at - p.T0, stingDur: p.sting_dur, fonts, theme: 'light' } });
  console.log(p.id, frames, 'frames');
}
