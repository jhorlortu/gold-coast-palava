// Edition 3 thumbnail map: Ghana (Natural Earth) with the edition's historical lines as red string.
// Lines are the same approximate traces as ed3/build/maps.mjs. Usage:
//   node thumbnails/src/ed3map.mjs <dir with node_modules/world-atlas + topojson-client>  > thumbnails/src/ed3-map.svg
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const base = process.argv[2];
const require = createRequire(path.join(base, 'x.js'));
const { feature } = require('topojson-client');
const C = JSON.parse(fs.readFileSync(path.join(base, 'node_modules/world-atlas/countries-10m.json'), 'utf8'));
const FC = feature(C, C.objects.countries);
const W = 620, H = 760, BOX = [-3.6, 4.55, 1.55, 11.35];
const k = Math.cos(((BOX[1] + BOX[3]) / 2) * Math.PI / 180);
const s = Math.min(W / ((BOX[2] - BOX[0]) * k), H / (BOX[3] - BOX[1]));
const ox = (W - (BOX[2] - BOX[0]) * k * s) / 2, oy = (H - (BOX[3] - BOX[1]) * s) / 2;
const P = ([lon, lat]) => [(ox + (lon - BOX[0]) * k * s).toFixed(1), (oy + (BOX[3] - lat) * s).toFixed(1)];
const ring = (r) => 'M' + r.map((p) => P(p).join(' ')).join('L') + 'Z';
const country = (n) => { const f = FC.features.find((x) => x.properties.name === n);
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  return polys.map((p) => p.map(ring).join('')).join(''); };
const line = (pts) => 'M' + pts.map((p) => P(p).join(' ')).join('L');
const BT_WEST = [[0.3, 5.9], [0.05, 6.5], [0.0, 7.0], [-0.05, 7.6], [-0.1, 8.1], [-0.35, 8.6], [-0.45, 9.2], [-0.5, 9.8], [-0.45, 10.4], [-0.3, 10.8], [-0.15, 11.2]];
const NT = [[-2.95, 8.15], [-1.6, 8.05], [-0.6, 8.2], [0.2, 8.3]]; // Northern Territories' southern edge (approx.)
const str = (d, c) => `<g filter="url(#sh)"><path d="${d}" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-dasharray="5 9" stroke-linecap="round"/></g>`;
const pin = ([x, y]) => `<g filter="url(#sh)"><circle cx="${x}" cy="${y}" r="13" fill="#A4241B" stroke="#1A1612" stroke-width="4"/><circle cx="${+x - 4}" cy="${+y - 4}" r="4" fill="#fff" opacity=".7"/></g>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><filter id="sh" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="2" dy="3" stdDeviation="1.6" flood-color="#2a1a0a" flood-opacity=".45"/></filter></defs>
<rect width="${W}" height="${H}" fill="#E9DFC6"/>
${['Togo', 'Burkina Faso', "Côte d'Ivoire"].map((n) => `<path d="${country(n)}" fill="#DCD0B2" stroke="#8C7E62" stroke-width="2"/>`).join('')}
<path d="${country('Ghana')}" fill="#FCF5E8" stroke="#1A1612" stroke-width="5" stroke-linejoin="round"/>
${str(line(NT), '#1A1612')}
${str(line(BT_WEST), '#A4241B')}
${pin(P([-0.24, 11.06]))}${pin(P([0.47, 6.6]))}
</svg>`;
process.stdout.write(svg);
