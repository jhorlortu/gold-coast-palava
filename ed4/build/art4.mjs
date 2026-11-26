// Edition 4 code-drawn stickers — flat cartoon objects in the house style (bold ink outlines, warm flat colours,
// white sticker rim, soft drop shadow). Used unless a Canva sticker of the same name exists in media/stickers_cut.
const INK = '#1A1612', RIM = 16;
const sticker = (body, { vb = '0 0 400 400', w = 300 } = {}) => {
  const rim = body.replace(/stroke="[^"]*"/g, '').replace(/fill="[^"]*"/g, 'fill="#FFFFFF"').replace(/<(path|rect|circle|ellipse|polygon)/g, `<$1 stroke="#FFFFFF" stroke-width="${RIM * 2}" stroke-linejoin="round"`);
  return `<svg viewBox="${vb}" width="${w}" style="overflow:visible;filter:drop-shadow(0 14px 16px rgba(60,40,10,.3))"><g>${rim}</g><g>${body}</g></svg>`;
};
const s = (o) => Object.entries(o).map(([k, v]) => `${k}="${v}"`).join(' ');
const ink = { stroke: INK, 'stroke-width': 7, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
const thin = { stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' };
// a cowrie: glossy dome, toothed slit underneath (seen from the top, slightly tilted)
const cowrie = (cx, cy, r, rot = 0) => `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${r / 100})">
  <ellipse ${s({ ...ink, fill: '#F6EEDC' })} cx="0" cy="0" rx="78" ry="104"/>
  <path ${s({ fill: '#E7D6B4' })} d="M-60 30 C -40 90, 40 90, 60 30 C 40 70, -40 70, -60 30 Z"/>
  <ellipse ${s({ fill: '#FFFFFF', opacity: 0.85 })} cx="-24" cy="-46" rx="18" ry="30"/>
  <path ${s({ ...ink, fill: '#C9A878', 'stroke-width': 5 })} d="M0 -92 C 14 -40, 14 40, 0 92 C -14 40, -14 -40, 0 -92 Z"/>
  ${[-70, -46, -22, 2, 26, 50, 72].map((y) => `<path ${s({ ...thin, 'stroke-width': 4 })} d="M-9 ${y} L-2 ${y + 4} M9 ${y} L2 ${y + 4}"/>`).join('')}</g>`;
export const ART = {
  cowrie: (w) => sticker(cowrie(200, 200, 150, -18), { w }),
  'cowrie-pile': (w) => sticker([[120, 270, 70, -30], [270, 280, 74, 20], [200, 300, 70, 70], [150, 190, 66, 10], [255, 190, 66, -50], [200, 130, 70, -5]].map((a) => cowrie(...a)).join(''), { w }),
  wallet: (w) => sticker(`
    <path ${s({ ...ink, fill: '#6B4423' })} d="M40 110 L360 110 L360 310 L40 310 Z"/>
    <path ${s({ ...ink, fill: '#8A5A31' })} d="M40 110 L200 140 L360 110 L360 300 L200 330 L40 300 Z"/>
    <path ${s({ stroke: '#D8B07A', 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '9 7' })} d="M58 128 L200 156 L342 128 L342 288 L200 314 L58 288 Z"/>
    <path ${s({ ...ink, fill: '#5A381C' })} d="M200 140 L200 330"/>
    <rect ${s({ ...ink, fill: '#7A4D28' })} x="230" y="190" width="100" height="56" rx="8"/>`, { w }),
  'sack-pour': (w) => sticker(`
    <path ${s({ ...ink, fill: '#C9A46A' })} d="M60 60 C 140 40, 220 50, 250 90 L230 200 C 180 230, 110 220, 70 180 Z" transform="rotate(-24 150 130)"/>
    <path ${s({ ...thin })} d="M110 90 L190 120 M100 130 L170 160" transform="rotate(-24 150 130)"/>
    ${[[250, 210, 30, 10], [285, 250, 28, -40], [240, 280, 30, 60], [300, 300, 30, 20], [210, 330, 32, -20], [270, 345, 32, 80], [330, 340, 30, -60], [180, 360, 30, 30]].map((a) => cowrie(...a)).join('')}`, { w }),
  goldweight: (w) => sticker(`
    <path ${s({ ...ink, fill: '#C8962F' })} d="M90 300 L310 300 L300 270 L100 270 Z"/>
    <path ${s({ ...ink, fill: '#D9A93E' })} d="M120 270 C 110 190, 170 140, 230 150 C 280 130, 330 150, 320 190 C 300 180, 280 190, 280 210 C 290 240, 260 270, 230 270 Z"/>
    <path ${s({ ...ink, fill: '#D9A93E' })} d="M230 150 C 200 110, 230 80, 260 92 C 290 100, 285 130, 262 142"/>
    <circle cx="258" cy="110" r="7" fill="${INK}"/><path ${s({ ...ink, fill: '#E9C46A' })} d="M282 104 L318 112 L284 122 Z"/>
    <path ${s({ ...thin })} d="M150 210 C 180 200, 210 215, 240 205 M160 240 C 190 230, 215 245, 250 232"/>`, { w }),
  pesewa: (w) => sticker(`
    <circle ${s({ ...ink, fill: '#D7A24A' })} cx="200" cy="200" r="150"/>
    <circle ${s({ stroke: '#8A6020', 'stroke-width': 5, fill: 'none' })} cx="200" cy="200" r="122"/>
    <text x="200" y="200" text-anchor="middle" font-family="Playfair Display, serif" font-weight="900" font-size="120" fill="#5A3A10">1</text>
    <text x="200" y="262" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-weight="700" font-size="34" fill="#5A3A10" letter-spacing="4">PESEWA</text>`, { w }),
  'us-coins': (w) => sticker(`
    <circle ${s({ ...ink, fill: '#C9CCD1' })} cx="160" cy="210" r="120"/><circle ${s({ stroke: '#80858D', 'stroke-width': 5, fill: 'none' })} cx="160" cy="210" r="98"/>
    <text x="160" y="232" text-anchor="middle" font-family="Playfair Display, serif" font-weight="900" font-size="60" fill="#4A4E55">25¢</text>
    <circle ${s({ ...ink, fill: '#DADDE2' })} cx="285" cy="270" r="84"/><circle ${s({ stroke: '#80858D', 'stroke-width': 4, fill: 'none' })} cx="285" cy="270" r="66"/>
    <text x="285" y="288" text-anchor="middle" font-family="Playfair Display, serif" font-weight="900" font-size="44" fill="#4A4E55">10¢</text>`, { w }),
  'ink-drop': (w) => sticker(`
    <path ${s({ ...ink, fill: '#2E5FA8' })} d="M200 40 C 240 120, 310 190, 310 250 C 310 320, 260 360, 200 360 C 140 360, 90 320, 90 250 C 90 190, 160 120, 200 40 Z"/>
    <path ${s({ fill: '#FFFFFF', opacity: 0.7 })} d="M150 230 C 150 200, 170 170, 185 150 C 175 190, 170 220, 175 260 Z"/>
    <path ${s({ ...ink, fill: '#D9342B', 'stroke-width': 5 })} d="M240 260 h 40 v -16 h 18 v 16 h 16 v 18 h -16 v 16 h -18 v -16 h -40 Z" transform="translate(-40 10) scale(0.9)"/>`, { w }),
  'momo-phone': (w) => sticker(`
    <rect ${s({ ...ink, fill: '#1A1612' })} x="110" y="30" width="180" height="340" rx="28"/>
    <rect ${s({ fill: '#FFF6D0' })} x="124" y="60" width="152" height="280" rx="10"/>
    <rect ${s({ fill: '#F2C230' })} x="124" y="60" width="152" height="54" rx="10"/>
    <text x="200" y="96" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-weight="700" font-size="24" fill="#1A1612">MoMo</text>
    <circle ${s({ ...ink, fill: '#3E9A4E' })} cx="200" cy="180" r="38"/><path ${s({ stroke: '#FFFFFF', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' })} d="M182 180 L196 194 L220 166"/>
    <rect x="146" y="240" width="108" height="12" rx="6" fill="#C9B98A"/><rect x="158" y="266" width="84" height="12" rx="6" fill="#C9B98A"/>`, { w }),
  keypress: (w) => sticker(`
    <path ${s({ ...ink, fill: '#3A3A3E' })} d="M30 250 L370 250 L340 340 L60 340 Z"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect ${s({ ...ink, fill: '#5A5A60', 'stroke-width': 4 })} x="${62 + i * 58}" y="262" width="48" height="30" rx="5"/>`).join('')}
    <rect ${s({ ...ink, fill: '#C8962F', 'stroke-width': 5 })} x="178" y="300" width="48" height="26" rx="5"/>
    <path ${s({ ...ink, fill: '#7A4E2C' })} d="M215 300 C 210 230, 222 150, 236 90 C 244 60, 280 66, 274 100 L262 190 C 290 170, 330 180, 320 215 C 312 250, 270 290, 240 302 Z"/>
    <path ${s({ stroke: '#C8962F', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' })} d="M150 300 L120 280 M150 320 L112 322 M252 330 L290 344"/>`, { w }),
  plantain: (w) => sticker(`
    ${[[-22, '#E9C23A'], [-8, '#F0CB45'], [6, '#E2B832'], [20, '#EDC744']].map(([r, c]) => `<path ${s({ ...ink, fill: c })} transform="rotate(${r} 120 300)" d="M120 300 C 140 200, 200 110, 300 70 C 320 64, 330 80, 316 92 C 230 150, 190 230, 160 310 Z"/>`).join('')}
    <path ${s({ ...ink, fill: '#5A7A2E' })} d="M100 290 L150 280 L160 330 L110 340 Z"/>
    <path ${s({ fill: '#3B2A1C' })} d="M300 70 L318 66 L320 84 Z"/>`, { w }),
  tap: (w) => sticker(`
    <rect ${s({ ...ink, fill: '#8C8F96' })} x="60" y="40" width="200" height="56" rx="12"/>
    <path ${s({ ...ink, fill: '#A7AAB1' })} d="M220 70 L320 70 C 340 70, 350 84, 350 104 L350 150 L310 150 L310 112 L220 112 Z"/>
    <rect ${s({ ...ink, fill: '#A4241B' })} x="120" y="10" width="80" height="26" rx="8"/><rect ${s({ ...ink, fill: '#A4241B' })} x="150" y="28" width="20" height="18"/>`, { w, vb: '0 0 400 200' }),
  bucket: (w) => sticker(`
    <path ${s({ ...ink, fill: '#5F87B8' })} d="M60 40 L340 40 L310 300 L90 300 Z"/>
    <ellipse ${s({ ...ink, fill: '#3F6B9E' })} cx="200" cy="40" rx="140" ry="24"/>
    <path ${s({ stroke: INK, 'stroke-width': 6, fill: 'none' })} d="M62 44 C 70 -60, 330 -60, 338 44"/>`, { w, vb: '0 -60 400 380' }),
  bouquet: (w) => sticker(`
    <path ${s({ ...ink, fill: '#A4241B' })} d="M150 360 L250 360 L290 230 L110 230 Z"/>
    ${[[-40, '#E8A1A9'], [-20, '#B9D7A1'], [0, '#F4C2C7'], [20, '#A9CDE8'], [40, '#E8D3A1']].map(([r, c]) => `<g transform="rotate(${r} 200 250)"><rect ${s({ ...ink, fill: c, 'stroke-width': 5 })} x="160" y="60" width="80" height="170" rx="6"/><circle ${s({ stroke: INK, 'stroke-width': 3, fill: 'none' })} cx="200" cy="130" r="22"/></g>`).join('')}
    <path ${s({ ...ink, fill: '#F2C230' })} d="M200 250 L170 290 L200 280 L230 290 Z"/>`, { w }),
  stapler: (w) => sticker(`
    <path ${s({ ...ink, fill: '#8EC0A0' })} d="M60 250 C 60 220, 90 210, 120 210 L330 190 C 350 190, 356 210, 340 220 L130 270 L70 280 Z"/>
    <rect ${s({ ...ink, fill: '#4A4E55' })} x="50" y="270" width="300" height="34" rx="10"/>
    <path ${s({ ...ink, fill: '#D9342B', 'stroke-width': 9 })} d="M60 60 L340 340 M340 60 L60 340" opacity="0.92"/>`, { w }),
  jar: (w) => sticker(`
    <path ${s({ ...ink, fill: '#DCEBEF' })} d="M110 90 L290 90 L310 130 L310 340 C 310 360, 290 370, 270 370 L130 370 C 110 370, 90 360, 90 340 L90 130 Z"/>
    <rect ${s({ ...ink, fill: '#C8962F' })} x="104" y="56" width="192" height="40" rx="8"/>
    <rect ${s({ ...ink, fill: '#B9D7A1', 'stroke-width': 4 })} x="120" y="250" width="160" height="100" rx="6"/>
    <rect ${s({ ...ink, fill: '#A9CDE8', 'stroke-width': 4 })} x="130" y="200" width="140" height="56" rx="6" transform="rotate(-6 200 228)"/>`, { w }),
  tin: (w) => sticker(`
    <ellipse ${s({ ...ink, fill: '#B8BCC4' })} cx="200" cy="310" rx="140" ry="40"/>
    <path ${s({ ...ink, fill: '#C9CDD4' })} d="M60 200 L60 310 C 60 340, 340 340, 340 310 L340 200 Z"/>
    <ellipse ${s({ ...ink, fill: '#8C9098' })} cx="200" cy="200" rx="140" ry="40"/>
    <rect ${s({ ...ink, fill: '#E8A1A9', 'stroke-width': 5 })} x="130" y="110" width="150" height="80" rx="6" transform="rotate(-12 205 150)"/>
    <path ${s({ ...ink, fill: '#7A4E2C' })} d="M250 60 C 290 50, 330 70, 330 100 L300 150 C 280 160, 250 150, 246 130 Z"/>`, { w }),
  scissors: (w) => sticker(`
    <circle ${s({ ...ink, fill: '#A4241B' })} cx="100" cy="300" r="50"/><circle ${s({ fill: '#FCF5E8' })} cx="100" cy="300" r="24"/>
    <circle ${s({ ...ink, fill: '#A4241B' })} cx="190" cy="340" r="50"/><circle ${s({ fill: '#FCF5E8' })} cx="190" cy="340" r="24"/>
    <path ${s({ ...ink, fill: '#C9CCD1' })} d="M130 270 L350 60 L370 80 L160 300 Z"/><path ${s({ ...ink, fill: '#B5B9BF' })} d="M170 310 L380 120 L390 146 L200 330 Z"/>`, { w }),
  printer: (w) => sticker(`
    <rect ${s({ ...ink, fill: '#4A4E55' })} x="60" y="160" width="280" height="150" rx="14"/>
    <rect ${s({ ...ink, fill: '#6A6E76' })} x="90" y="110" width="220" height="60" rx="8"/>
    <rect ${s({ ...ink, fill: '#B9D7A1' })} x="110" y="40" width="180" height="90"/>
    <rect ${s({ ...ink, fill: '#E8A1A9' })} x="110" y="290" width="180" height="70"/>
    <circle cx="300" cy="200" r="10" fill="#3E9A4E"/>`, { w }),
  window: (w) => sticker(`
    <rect ${s({ ...ink, fill: '#FFF3C8' })} x="70" y="40" width="260" height="320" rx="6"/>
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect ${s({ ...ink, fill: '#C9A46A', 'stroke-width': 4 })} x="80" y="${56 + i * 44}" width="240" height="16" rx="3"/>`).join('')}`, { w }),
};
