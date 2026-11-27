// Ink line-art Ghana maps for the edition thumbnails (client template: hatched country, dots, typewriter labels).
// Writes thumbnails/src/edmaps.js (window.EDMAPS = { id: '<svg…>' }), inlined so labels use the page's web fonts.
// usage: node thumbnails/src/edmaps.mjs <dir holding node_modules/world-atlas + topojson-client>
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const base = process.argv[2];
const require = createRequire(path.join(base, 'x.js'));
const { feature } = require('topojson-client');
const C = JSON.parse(fs.readFileSync(path.join(base, 'node_modules/world-atlas/countries-50m.json'), 'utf8'));
const gh = feature(C, C.objects.countries).features.find((f) => f.properties.name === 'Ghana');
const W = 230, H = 300, BOX = [-3.35, 4.6, 1.3, 11.25];
const k = Math.cos(((BOX[1] + BOX[3]) / 2) * Math.PI / 180);
const s = Math.min((W - 20) / ((BOX[2] - BOX[0]) * k), (H - 20) / (BOX[3] - BOX[1]));
const ox = (W - (BOX[2] - BOX[0]) * k * s) / 2, oy = (H - (BOX[3] - BOX[1]) * s) / 2;
const P = ([lon, lat]) => [+(ox + (lon - BOX[0]) * k * s).toFixed(1), +(oy + (BOX[3] - lat) * s).toFixed(1)];
const polys = gh.geometry.type === 'Polygon' ? [gh.geometry.coordinates] : gh.geometry.coordinates;
const ghana = polys.map((p) => p.map((r) => 'M' + r.map((q) => P(q).join(' ')).join('L') + 'Z').join('')).join('');
const line = (pts) => 'M' + pts.map((q) => P(q).join(' ')).join('L');
// approximate historical traces, as in ed3/build/maps.mjs
const BT_WEST = [[0.3, 5.9], [0.05, 6.5], [0.0, 7.0], [-0.05, 7.6], [-0.1, 8.1], [-0.35, 8.6], [-0.45, 9.2], [-0.5, 9.8], [-0.45, 10.4], [-0.3, 10.8], [-0.15, 11.2]];
const NT = [[-2.75, 8.2], [-1.6, 8.05], [-0.6, 8.2], [0.25, 8.3]];
const PL = { Bunkpurugu: [0.1, 10.52], Kumasi: [-1.62, 6.69], Accra: [-0.2, 5.56], 'Half Assini': [-2.88, 5.05],
  'Cape Coast': [-1.25, 5.1], Mampong: [-0.13, 5.92], Takoradi: [-1.76, 4.9], Bawku: [-0.24, 11.06], Ho: [0.47, 6.6],
  Yendi: [-0.01, 9.44], Tamale: [-0.85, 9.4] };
// label offsets [dx, dy, anchor]
const map = (places, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="overflow:visible">
<defs><pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" stroke="#1A1612" stroke-width="1.4"/></pattern></defs>
<path d="${ghana}" fill="#FAF5E8" stroke="none"/><path d="${ghana}" fill="url(#hatch)" opacity=".85"/>
<path d="${ghana}" fill="none" stroke="#1A1612" stroke-width="4" stroke-linejoin="round"/>
${extra}
${places.map(([n, dx, dy, a = 'start']) => { const [x, y] = P(PL[n]);
  return `<circle cx="${x}" cy="${y}" r="6" fill="#1A1612"/><text x="${x + dx}" y="${y + dy}" text-anchor="${a}" font-family="Special Elite" font-size="15" fill="#1A1612" paint-order="stroke" stroke="#FAF5E8" stroke-width="5">${n.toUpperCase()}</text>`; }).join('')}
</svg>`;
const string = (pts, c) => `<path d="${line(pts)}" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
const EDMAPS = {
  pilot: map([['Bunkpurugu', -6, -10, 'end'], ['Kumasi', 10, -6], ['Accra', 8, -12, 'end'], ['Half Assini', 8, -6]]),
  ed1: map([['Kumasi', 10, -6], ['Cape Coast', -8, 16, 'middle'], ['Accra', 10, -8]]),
  ed2: map([['Mampong', 10, -6], ['Kumasi', -10, -8, 'end'], ['Takoradi', 8, 16]]),
  ed3: map([['Bawku', -10, 4, 'end'], ['Yendi', 10, 5], ['Ho', 10, 5]], string(NT, '#1A1612') + string(BT_WEST, '#A4241B')),
  ed4: map([['Kumasi', 10, -6], ['Tamale', 10, -6], ['Accra', 10, -8]]),
};
fs.writeFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), 'edmaps.js'), 'window.EDMAPS = ' + JSON.stringify(EDMAPS) + ';\n');
console.log('ok');
