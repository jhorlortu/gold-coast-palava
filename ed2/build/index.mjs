import * as A from './ed2.mjs';
import { BUILDERS2 } from './ed2b.mjs';
export const SEGMENTS = A.SEGMENTS;
const B = { ...A.BUILDERS, ...BUILDERS2 };
// running order
export const BUILDERS = Object.fromEntries(['cold', 'combo1', 'nest', 'front', 'headlead', 'lead', 'wire', 'palava', 'thennow', 'headteam', 'team', 'editor', 'headletters', 'letters', 'dispatch', 'credits'].map((k) => [k, B[k]]));
