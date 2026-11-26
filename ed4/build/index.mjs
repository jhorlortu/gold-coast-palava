import * as A from './ed4.mjs';
let B2 = {};
try { B2 = (await import('./ed4b.mjs')).BUILDERS2; } catch (e) { if (!/Cannot find module|ERR_MODULE_NOT_FOUND/.test(String(e))) throw e; }
export const SEGMENTS = A.SEGMENTS;
const B = { ...A.BUILDERS, ...B2 };
export const BUILDERS = Object.fromEntries(['cold', 'combo1', 'nest', 'front', 'headlead', 'lead', 'wire', 'palava', 'thennow', 'headteam', 'team', 'editor', 'headletters', 'letters', 'dispatch', 'credits'].filter((k) => B[k]).map((k) => [k, B[k]]));
