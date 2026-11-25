// Edition 3 code-drawn stickers (Canva/Gamma AI credits were exhausted): flat cartoon objects in the house style —
// bold ink outlines, warm flat colours, a white sticker rim and a soft drop shadow. Each returns an SVG string.
const INK = '#1A1612', RIM = 16;
// draw the same shapes twice: a white rim underneath (thick white stroke), then the coloured art on top
const sticker = (body, { vb = '0 0 400 400', w = 300 } = {}) => {
  const rim = body.replace(/stroke="[^"]*"/g, '').replace(/fill="[^"]*"/g, 'fill="#FFFFFF"').replace(/<(path|rect|circle|ellipse|polygon)/g, `<$1 stroke="#FFFFFF" stroke-width="${RIM * 2}" stroke-linejoin="round"`);
  return `<svg viewBox="${vb}" width="${w}" style="overflow:visible;filter:drop-shadow(0 14px 16px rgba(60,40,10,.3))"><g>${rim}</g><g>${body}</g></svg>`;
};
const s = (o) => Object.entries(o).map(([k, v]) => `${k}="${v}"`).join(' ');
const ink = { stroke: INK, 'stroke-width': 7, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };

export const ART = {
  ballot: (w) => sticker(`
    <path ${s({ ...ink, fill: '#B07A45' })} d="M70 170 L330 170 L350 340 L50 340 Z"/>
    <path ${s({ ...ink, fill: '#C98E55' })} d="M60 140 L340 140 L330 170 L70 170 Z"/>
    <rect ${s({ ...ink, fill: '#3B2A1C' })} x="150" y="148" width="100" height="14" rx="6"/>
    <path ${s({ ...ink, fill: '#FCF5E8' })} d="M168 60 L238 46 L252 150 L182 162 Z"/>
    <path ${s({ stroke: '#A4241B', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' })} d="M195 92 L208 108 L232 76"/>
    <path ${s({ stroke: '#7A5230', 'stroke-width': 5, fill: 'none' })} d="M90 240 L310 240 M85 290 L315 290"/>`, { w }),
  pencil: (w) => sticker(`
    <path ${s({ stroke: '#8A8072', 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '10 8' })} d="M40 330 C 120 300, 200 330, 360 290"/>
    <g transform="rotate(-38 200 200)">
      <rect ${s({ ...ink, fill: '#F2C230' })} x="70" y="170" width="220" height="54"/>
      <path ${s({ ...ink, fill: '#F0D9B0' })} d="M290 170 L350 197 L290 224 Z"/><path ${s({ ...ink, fill: INK })} d="M330 188 L350 197 L330 206 Z"/>
      <rect ${s({ ...ink, fill: '#B8B8B0' })} x="44" y="170" width="30" height="54"/><rect ${s({ ...ink, fill: '#E98A9A' })} x="14" y="172" width="34" height="50" rx="10"/>
      <path ${s({ stroke: '#C99A16', 'stroke-width': 4, fill: 'none' })} d="M80 188 L285 188 M80 206 L285 206"/></g>
    <rect ${s({ ...ink, fill: '#E98A9A' })} x="250" y="300" width="96" height="52" rx="12" transform="rotate(12 298 326)"/>
    <circle cx="230" cy="352" r="6" fill="#E98A9A"/><circle cx="214" cy="344" r="4" fill="#E98A9A"/>`, { w }),
  nib: (w) => sticker(`
    <path ${s({ stroke: INK, 'stroke-width': 14, fill: 'none', 'stroke-linecap': 'round' })} d="M40 330 C 120 300, 200 330, 300 300"/>
    <g transform="rotate(35 230 170)"><rect ${s({ ...ink, fill: '#5A3A22' })} x="205" y="20" width="50" height="170" rx="10"/>
      <path ${s({ ...ink, fill: '#C9A55A' })} d="M200 185 L260 185 L248 250 L230 300 L212 250 Z"/><path ${s({ stroke: INK, 'stroke-width': 5, fill: 'none' })} d="M230 230 L230 298"/><circle cx="230" cy="228" r="7" fill="${INK}"/></g>
    <path ${s({ ...ink, fill: '#2B2D42' })} d="M40 230 L120 230 L130 300 L30 300 Z"/><rect ${s({ ...ink, fill: '#1A1612' })} x="58" y="206" width="44" height="26" rx="4"/>`, { w }),
  islands: (w) => sticker(`
    <ellipse ${s({ ...ink, fill: '#3E86C9' })} cx="200" cy="270" rx="185" ry="90"/>
    <path ${s({ ...ink, fill: '#E8C77A' })} d="M70 280 C 90 230, 170 230, 190 280 Z"/><path ${s({ ...ink, fill: '#4E9A45' })} d="M90 270 C 110 210, 160 215, 175 268 Z"/>
    <path ${s({ ...ink, fill: '#E8C77A' })} d="M220 300 C 240 260, 310 262, 330 300 Z"/><path ${s({ ...ink, fill: '#4E9A45' })} d="M235 292 C 255 245, 300 250, 318 292 Z"/>
    <path ${s({ ...ink, fill: 'none' })} d="M130 230 L138 150"/><path ${s({ ...ink, fill: '#3F8A3A' })} d="M138 150 C 110 140, 95 150, 90 165 C 112 150, 128 152, 138 150 C 150 125, 170 125, 185 140 C 165 140, 150 145, 138 150 C 160 150, 178 160, 185 178 C 165 160, 150 155, 138 150 Z"/>
    <path ${s({ stroke: '#FFFFFF', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' })} d="M60 320 q20 -12 40 0 q20 12 40 0 M240 330 q20 -12 40 0 q20 12 40 0"/>`, { w }),
  roadblock: (w) => sticker(`
    <path ${s({ ...ink, fill: '#B5452A' })} d="M30 330 L370 330 L330 250 L70 250 Z"/>
    <rect ${s({ ...ink, fill: '#8A5A33' })} x="60" y="200" width="280" height="44" rx="22"/><rect ${s({ ...ink, fill: '#9C6A3E' })} x="90" y="150" width="230" height="44" rx="22"/>
    <circle ${s({ ...ink, fill: '#2B2B2B' })} cx="95" cy="290" r="40"/><circle cx="95" cy="290" r="16" fill="#555"/>
    <circle ${s({ ...ink, fill: '#2B2B2B' })} cx="300" cy="295" r="36"/><circle cx="300" cy="295" r="14" fill="#555"/>
    <path ${s({ ...ink, fill: '#E8B23A' })} d="M190 60 L250 140 L130 140 Z"/><path ${s({ stroke: INK, 'stroke-width': 8, 'stroke-linecap': 'round' })} d="M190 88 L190 112"/><circle cx="190" cy="126" r="5" fill="${INK}"/>`, { w }),
  school: (w) => sticker(`
    <path ${s({ ...ink, fill: '#A4241B' })} d="M40 170 L200 70 L360 170 Z"/>
    <rect ${s({ ...ink, fill: '#F2E6C6' })} x="60" y="170" width="280" height="170"/>
    <rect ${s({ ...ink, fill: '#5A3A22' })} x="175" y="250" width="50" height="90"/>
    <rect ${s({ ...ink, fill: '#8FC1E3' })} x="85" y="200" width="60" height="50"/><rect ${s({ ...ink, fill: '#8FC1E3' })} x="255" y="200" width="60" height="50"/>
    <path ${s({ ...ink, fill: 'none' })} d="M200 70 L200 30"/><path ${s({ ...ink, fill: '#C8962F' })} d="M200 30 L245 42 L200 54 Z"/>
    <circle ${s({ ...ink, fill: '#FCF5E8' })} cx="200" cy="135" r="20"/><path ${s({ stroke: INK, 'stroke-width': 4, fill: 'none' })} d="M200 135 L200 123 M200 135 L209 140"/>`, { w }),
  curfew: (w) => sticker(`
    <circle ${s({ ...ink, fill: '#2B2D42' })} cx="200" cy="200" r="170"/>
    <path ${s({ ...ink, fill: '#F3E3A0' })} d="M120 90 A 70 70 0 1 0 170 200 A 56 56 0 1 1 120 90 Z"/>
    <circle ${s({ ...ink, fill: '#FCF5E8' })} cx="250" cy="230" r="90"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((k) => { const a = k * Math.PI / 6; return `<path stroke="${INK}" stroke-width="5" d="M${250 + 74 * Math.sin(a)} ${230 - 74 * Math.cos(a)} L${250 + 82 * Math.sin(a)} ${230 - 82 * Math.cos(a)}"/>`; }).join('')}
    <path ${s({ stroke: INK, 'stroke-width': 9, 'stroke-linecap': 'round' })} d="M250 230 L210 207"/><path ${s({ stroke: '#A4241B', 'stroke-width': 7, 'stroke-linecap': 'round' })} d="M250 230 L250 165"/><circle cx="250" cy="230" r="8" fill="${INK}"/>
    <circle cx="70" cy="300" r="4" fill="#F3E3A0"/><circle cx="110" cy="330" r="3" fill="#F3E3A0"/><circle cx="330" cy="90" r="4" fill="#F3E3A0"/>`, { w }),
  report: (w) => sticker(`
    <rect ${s({ ...ink, fill: '#FCF5E8' })} x="80" y="40" width="240" height="310" rx="8"/>
    <path ${s({ stroke: '#8A8072', 'stroke-width': 6, 'stroke-linecap': 'round' })} d="M115 100 L285 100 M115 135 L285 135 M115 170 L260 170 M115 205 L285 205 M115 240 L230 240"/>
    <circle ${s({ ...ink, fill: '#A4241B' })} cx="270" cy="300" r="44"/><path ${s({ stroke: '#F3B8B0', 'stroke-width': 5, fill: 'none' })} d="M270 274 L278 292 L298 294 L282 306 L288 326 L270 314 L252 326 L258 306 L242 294 L262 292 Z"/>
    <path ${s({ ...ink, fill: '#C8962F' })} d="M250 336 L240 380 L262 368 L272 386 L280 340 Z"/>`, { w }),
  palm: (w) => sticker(`
    <path ${s({ ...ink, fill: '#7A4A2C' })} d="M150 360 C 120 300, 105 250, 110 200 L95 110 C 92 92, 118 86, 122 104 L140 180 L140 70 C 140 50, 168 50, 168 70 L172 170 L185 60 C 188 40, 216 42, 214 62 L206 172 L230 82 C 236 62, 262 68, 256 88 L236 190 L270 140 C 282 122, 306 136, 294 154 L240 250 C 228 290, 220 330, 225 360 Z"/>
    <path ${s({ stroke: '#5A3420', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' })} d="M150 250 C 175 265, 200 262, 222 248 M160 290 C 180 300, 200 298, 215 290"/>`, { w }),
  finger: (w) => sticker(`
    <path ${s({ ...ink, fill: '#7A4A2C' })} d="M380 140 L250 150 C 230 152, 215 160, 200 168 L70 176 C 40 178, 40 214, 70 214 L190 210 C 200 240, 230 262, 270 262 L380 260 Z"/>
    <path ${s({ ...ink, fill: '#D9B49A' })} d="M58 182 C 48 186, 48 206, 58 208 L86 207 L84 181 Z"/>
    <path ${s({ stroke: '#5A3420', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' })} d="M130 182 C 134 192, 134 200, 130 208"/>`, { vb: '0 0 400 400', w }),
};
