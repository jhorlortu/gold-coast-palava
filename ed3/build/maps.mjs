// Edition 3 map engine — real country shapes (Natural Earth via world-atlas) projected into SVG.
// Equirectangular with cos(lat0) scaling inside a lon/lat box. Historical lines (neutral zone, 1899 split,
// British Togoland, plebiscite districts) are approximate hand-traced lon/lat polylines, drawn as glued string.
import fs from 'node:fs';
import { feature } from 'topojson-client';
const WA = '/home/user/gcp/ed3/build/node_modules/world-atlas';
const load = (f) => JSON.parse(fs.readFileSync(`${WA}/${f}`, 'utf8'));
const C10 = load('countries-10m.json'), C50 = load('countries-50m.json'), C110 = load('countries-110m.json');
const FC = { 10: feature(C10, C10.objects.countries), 50: feature(C50, C50.objects.countries), 110: feature(C110, C110.objects.countries) };
const r1 = (v) => Math.round(v * 10) / 10;

/** A projection for a lon/lat box into a w x h pixel box (keeps aspect; centred). */
export function projection([lon0, lat0, lon1, lat1], w, h) {
  const k = Math.cos(((lat0 + lat1) / 2) * Math.PI / 180);
  const sx = w / ((lon1 - lon0) * k), sy = h / (lat1 - lat0), s = Math.min(sx, sy);
  const ox = (w - (lon1 - lon0) * k * s) / 2, oy = (h - (lat1 - lat0) * s) / 2;
  const P = ([lon, lat]) => [r1(ox + (lon - lon0) * k * s), r1(oy + (lat1 - lat) * s)];
  P.scale = s; return P;
}
const ringPath = (P, ring) => 'M' + ring.map((pt) => P(pt).join(' ')).join('L') + 'Z';
/** SVG path data for a country (by Natural Earth name). */
export function countryPath(P, name, res = 10) {
  const f = FC[res].features.find((x) => x.properties.name === name);
  if (!f) throw new Error('no country ' + name);
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  return polys.map((poly) => poly.map((ring) => ringPath(P, ring)).join('')).join('');
}
export const linePath = (P, pts) => 'M' + pts.map((pt) => P(pt).join(' ')).join('L');
export const polyPath = (P, pts) => linePath(P, pts) + 'Z';

// places (lon, lat)
export const PLACE = {
  Bawku: [-0.24, 11.06], Nalerigu: [-0.36, 10.53], Yendi: [-0.01, 9.44], Salaga: [-0.52, 8.55], Tamale: [-0.85, 9.40],
  Ho: [0.47, 6.60], Kpandu: [0.29, 7.00], Nuatja: [1.17, 6.95], Mepe: [0.47, 6.05], Aveyime: [0.42, 6.12], Accra: [-0.20, 5.56],
  'Cape Coast': [-1.25, 5.10], Axim: [-2.24, 4.87], Lome: [1.22, 6.13], Kumasi: [-1.62, 6.69], Bolgatanga: [-0.85, 10.79],
};
// approximate historical lines
export const NEUTRAL_ZONE = [[-1.05, 8.15], [0.32, 8.15], [0.38, 9.05], [0.3, 10.1], [-0.85, 10.1], [-1.15, 9.1]];
export const LINE_1899 = [[-0.22, 8.15], [-0.25, 8.8], [-0.18, 9.3], [-0.3, 9.75], [-0.28, 10.1]];
// British Togoland = Ghana east of this line (west edge, south → north); the east edge is Ghana's border with Togo
export const BT_WEST = [[0.3, 5.9], [0.05, 6.5], [0.0, 7.0], [-0.05, 7.6], [-0.1, 8.1], [-0.35, 8.6], [-0.45, 9.2], [-0.5, 9.8], [-0.45, 10.4], [-0.3, 10.8], [-0.15, 11.2]];
export const btClip = (P) => polyPath(P, [...BT_WEST, [3, 11.3], [3, 5.5], [0.3, 5.5]]);
// plebiscite districts as latitude bands inside British Togoland (north → south), vote share for union (UN table, rounded)
export const DISTRICTS = [
  { name: 'Mamprusi', lat: [10.25, 11.3], union: true }, { name: 'Dagomba', lat: [9.2, 10.25], union: true },
  { name: 'Gonja', lat: [8.45, 9.2], union: true }, { name: 'Buem-Krachi', lat: [7.35, 8.45], union: true },
  { name: 'Kpandu', lat: [6.85, 7.35], union: false }, { name: 'Ho', lat: [5.5, 6.85], union: false },
];
export const band = (P, [a, b]) => polyPath(P, [[-2, a], [3, a], [3, b], [-2, b]]);

/** The string look: a thick coloured cord with a lighter twist dash, a soft shadow, drawing on with dashoffset. */
export const STRING_DEFS = `<defs>
  <filter id="strsh" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="2" dy="3" stdDeviation="1.6" flood-color="#2a1a0a" flood-opacity=".45"/></filter>
  <filter id="cardgrain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .38  0 0 0 0 .25  0 0 0 .18 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
</defs>`;
export const COL = { red: '#B3261E', blue: '#2350A0', black: '#1A1612' };
export function stringPath(d, color, { id, w = 7, twist = true } = {}) {
  return `<g filter="url(#strsh)"><path ${id ? `id="${id}"` : ''} d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" pathLength="1000"/>${twist ? `<path ${id ? `id="${id}-t"` : ''} d="${d}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="${w * 0.35}" stroke-dasharray="3 6" stroke-linecap="round" pathLength="1000"/>` : ''}</g>`;
}
