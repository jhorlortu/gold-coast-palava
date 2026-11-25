// Special No. 2 — the four questions and the ledger. Each section: the phone (the team chat) holds the right third,
// the left two-thirds change every few seconds with the story. Data cards come from Remotion (rclip).
// Cues are keyed to the corrected transcript (work/fix_transcript.py).
import path from 'node:path';
import { HELPERS as K } from './sp2.mjs';
const { make, cs, fx, efx, H, chip, stack, stk, prt, nameCard, card, quote, dateline, counter, strikeWord, sceneP, LX, SP2_CSS, Phone, n3, spr, PSFX, ED1SFX, rclip } = K;

const tw = (p, text, at, size = 60, color = 'var(--ink)', cps = 20) => p.typed(text, at, { cps, cls: 'tw' }).replace('class="tw"', `class="tw" style="font-size:${size}px;color:${color}"`);
const at_ = (x, y, html) => `<div style="position:absolute;left:${x}px;top:${y}px">${html}</div>`;
/** a speech bubble */
const bubble = (p, text, at, { x, y, w = 360, size = 44 } = {}) => { const id = p.id_('bb'); p.grow(id, at, { from: 0.3, dy: 20, preset: 'playful' }); efx(p, 'pop-3.wav', at, -14);
  return `<div id="${id}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;background:#FCF5E8;border:5px solid var(--ink);border-radius:36px;padding:20px 28px;font-family:'Playfair Display',serif;font-style:italic;font-weight:700;font-size:${size}px;line-height:1.1;box-shadow:8px 10px 0 var(--ink)">${text}<div style="position:absolute;left:46px;bottom:-34px;width:0;height:0;border-left:22px solid transparent;border-right:22px solid transparent;border-top:34px solid var(--ink)"></div></div>`; };
/** a number that springs in on its cue (no "0" waiting on screen) */
const bigCount = (p, at, to, o = {}) => { const g = p.id_('bc'); p.grow(g, at - 0.1, { from: 0.4, dy: 80, preset: 'heavy' });
  return `<div id="${g}" style="position:absolute;left:${o.x ?? LX}px;top:${o.y ?? 300}px">${counter(p, at, to, { fmt: false, ...o })}</div>`; };
const time = (p, text, at = 0.3) => at_(LX, 150, tw(p, text, at, 84, 'var(--red)'));
const solemn = (p, at) => efx(p, 'bell.wav', at, -24);

// ---------------------------------------------------------------------------
// QUESTION ONE — What exactly did he inherit?
export function q1() {
  const [p, c, s] = make('q1'); p.css.push(SP2_CSS); p.label = '';
  const t = (...q) => cs(c, ...q);
  const ask = t('asked the fair question'), may = t('on the 15th of may'), june = t('on the 4th of june'), ruled = t('which ruled for'), exec = t('executed eight'),
    three = t('three former heads'), handed = t('handed power'), last = t('on the last day'), stayed = t('this time'),
    one = t('now the one per cent'), infl = t('inflation reached'), drought = t('the worst drought'), bush = t('bushfires'), jan = t('and in january'),
    million = t('so more than a million'), bags = t('the checked bags'), before = t('so before anybody'), job = t('his first job'), stop = t('it was stopping');
  const ph = new Phone(p, { pinned: 'What exactly did he inherit?', enter: 0.0, clock0: '11:19',
    prior: [{ kind: 'day', text: 'Today' }, { who: 'Kwame', text: 'Six years today since JJ died. My uncle’s status is all “Junior Jesus” 🙄', time: '11:12 pm' }, { who: 'Kwame', text: '19 YEARS in power. 19!! And Ghana still dey like this?', time: '11:12 pm' }] });
  ph.typing('Aba', 0.4, ask); ph.msg({ who: 'Aba', text: 'Before we judge, what did he actually take over? I only know the June 4 songs 😅', time: '11:19 pm', at: ask });
  ph.focus(ask + 0.3, 3.2);
  ph.typing('Aba', s.dur - 3.2, s.dur - 1.6); ph.msg({ who: 'Aba', text: 'Ei. So the house was on fire before the man entered 😳', time: '11:31 pm', at: s.dur - 1.6 });
  ph.build();
  // A — Aba, The Restless
  sceneP(p, 0, may - 0.2, `${time(p, '11:19 PM')}
    ${nameCard(p, 0.25, { y: 300, role: 'IN THE CHAT', name: 'Aba, The Restless' })}
    ${chip(p, 'asked the fair question first', ask - 0.1, LX, 520, 'chip gold')}
    ${chip(p, 'what exactly did he take over?', t('what exactly'), LX, 616, 'chip light')}`, { enter: 'cut' });
  // B — 15 May 1979: the failed mutiny
  sceneP(p, may - 0.2, june - 0.2, `${dateline(p, 'ACCRA · 15 MAY 1979', may, { y: 140, size: 58 })}
    ${chip(p, 'a young flight lieutenant', t('a young flight'), LX, 290, 'chip light')}
    ${chip(p, 'a handful of soldiers · a failed mutiny', t('a handful'), LX, 386, 'chip light')}
    ${stk(p, 'coup', t('tried to overthrow'), { x: 800, y: 260, w: 340, rot: 4, life: 'jiggle', until: june })}
    ${chip(p, 'against General Akuffo’s government… and failed', t('general akuffos'), LX, 482, 'chip gold')}
    ${p.stamp('SENTENCED TO DEATH', t('sentenced to death'), { x: 140, y: 600, rot: -5, size: 44 })}
    ${chip(p, '…and locked up', t('locked up'), LX, 760, 'chip red')}`, { enter: 'wipeL' });
  // C — 4 June: broken out, chairman of the AFRC within hours (the 1979 photograph on the armoured car)
  sceneP(p, june - 0.2, ruled - 0.3, `${dateline(p, '4 JUNE 1979', june, { y: 140, size: 58, sting: false })}
    ${prt(p, 'rawlings-1979', t('soldiers broke') - 0.1, { x: 640, y: 250, w: 560, rot: 2, caption: 'Rawlings addresses a crowd, 1979' })}
    ${chip(p, 'soldiers broke him out', t('soldiers broke'), LX, 290, 'chip light')}
    ${chip(p, 'within hours…', t('within hours'), LX, 386, 'chip gold')}
    ${nameCard(p, t('chairman of'), { y: 500, role: 'CHAIRMAN', name: 'Armed Forces Revolutionary Council' })}`, { enter: 'wipeR' });
  // D — the Remotion timeline: 112 days, the executions, the handover, and the return on 31 December 1981
  const r0 = ruled - 0.3, r1 = one - 0.3, L = (x) => +(x - r0).toFixed(2);
  rclip(p, 'GcpTimeline', r0, r1, { kicker: 'THE AFRC · 1979', title: 'One hundred and twelve days',
    items: [{ at: 0.4, x: 0.05, date: '15 MAY 1979', label: 'Failed mutiny', up: true }, { at: 0.7, x: 0.25, date: '4 JUNE 1979', label: 'Freed. AFRC in power', up: false },
      { at: L(handed), x: 0.6, date: '24 SEPT 1979', label: 'Hands over to Limann', up: true }, { at: L(last), x: 0.95, date: '31 DEC 1981', label: 'He comes back', red: true, up: false }],
    spans: [{ at: L(ruled) + 0.6, from: 0.25, to: 0.6, count: 112, label: 'DAYS' }] }, { y: 110, w: 1080 });
  sceneP(p, r0, three - 0.1, `${chip(p, 'eight senior officers executed', exec, LX, 840, 'chip red')}`, { enter: 'cut' });
  sceneP(p, three - 0.1, handed - 0.1, `${chip(p, 'incl. three former heads of state: Acheampong, Akuffo, Afrifa', three, LX, 840, 'chip red')}`, { enter: 'cut' });
  sceneP(p, handed - 0.1, stayed - 0.3, `${chip(p, 'power handed to the elected President Hilla Limann', handed + 0.2, LX, 840, 'chip light')}`, { enter: 'cut' });
  sceneP(p, stayed - 0.3, r1, `${chip(p, '…and this time, he stayed', stayed, LX, 840, 'chip gold')}`, { enter: 'cut' });
  // E — 1983: three storms at once
  sceneP(p, one - 0.3, jan - 0.2, `${H(p, '1983: *three storms at once*', one + 0.2, { size: 84, kicker: 'THE ONE PER CENT MOST OF US FORGET' })}
    ${chip(p, 'inflation', infl - 0.1, LX, 330, 'chip light')}
    ${bigCount(p, infl + 0.2, 123, { y: 400, size: 190, suffix: '%', color: 'var(--red)' })}
    ${stk(p, 'drought', drought - 0.1, { x: 680, y: 330, w: 520, rot: 2, life: 'pulse', until: jan })}
    ${chip(p, 'the worst drought in decades', drought + 0.3, LX, 660, 'chip gold')}
    ${chip(p, 'bushfires burned what was left', bush, LX, 756, 'chip red')}`, { enter: 'iris' });
  // F — Nigeria's expulsion order: a million Ghanaians home with the checked bags
  sceneP(p, jan - 0.2, before - 0.2, `${dateline(p, 'JANUARY 1983', jan, { y: 140, size: 58, sting: false })}
    ${chip(p, 'Nigeria orders “illegal migrants” out', t('nigeria ordered'), LX, 290, 'chip light')}
    ${bigCount(p, million + 0.2, 1000000, { y: 390, size: 150, suffix: '+', fmt: true })}
    ${chip(p, 'Ghanaians came home', t('came home'), LX, 590, 'chip gold')}
    ${stk(p, 'ghana-must-go', bags - 0.2, { x: 830, y: 330, w: 360, rot: -5, life: 'bob', until: before + 0.5 })}
    ${chip(p, '“Ghana Must Go”', t('ghana must go'), LX, 690, 'chip red')}`, { enter: 'wipeU' });
  // G — his first job: stop the collapse
  sceneP(p, before - 0.2, s.dur, `${H(p, 'Before anybody talks *transformation*…', before, { size: 76, w: 1080 })}
    ${chip(p, 'his first job was not…', job, LX, 340, 'chip light')}
    <div style="position:absolute;left:${LX}px;top:430px">${strikeWord(p, 'building a new Ghana', t('building a new') + 0.6, { size: 84 })}</div>
    <div style="position:absolute;left:${LX}px;top:580px;font-family:'Playfair Display',serif;font-weight:900;font-size:96px;color:var(--red);width:1080px;line-height:1.02">${p.words(p.id_('w'), 'It was stopping the old one collapsing.', stop, { stagger: 0.07 })}</div>`, { enter: 'push' });
  fx(p, path.join(PSFX, 'syn-suspense.wav'), one - 0.4, -18);
  return p;
}

// ---------------------------------------------------------------------------
// QUESTION TWO — People's power, or one man's power?
export function q2() {
  const [p, c, s] = make('q2'); p.css.push(SP2_CSS); p.label = '';
  const t = (...q) => cs(c, ...q);
  const promised = t('the revolution promised'), set = t('it set up'), renamed = t('later renamed'), watch = t('watch prices'), beside = t('but beside that'),
    trib = t('public tribunals'), mak = t('makola'), same = t('and that same year'), abd = t('abducted and murdered'), haunts = t('still haunts'),
    evenso = t('even so'), ask = t('to ask ghanaians'), conv = t('and that slow conversation'), cons = t('1992 constitution'),
    haynes = t('the british scholar'), interviewed = t('who interviewed'), never = t('never clearly defined'), lacked = t('and lacked'),
    brill = t('he was brilliant'), lessSure = t('and far less sure'), yet = t('yet one piece'), in88 = t('in 1988'), twoth = t('two thirds'), yours = t('and the assembly in your'), grand = t('grandchild');
  const ph = new Phone(p, { pinned: 'People’s power, or one man’s power?', enter: 0.0, clock0: '11:38',
    prior: [{ who: 'Aba', text: 'Before we judge, what did he actually take over? I only know the June 4 songs 😅', time: '11:19 pm' }, { who: 'Aba', text: 'Ei. So the house was on fire before the man entered 😳', time: '11:31 pm' }] });
  const kw = t('kwame was not done');
  ph.typing('Kwame', 0.3, kw + 0.4); ph.msg({ who: 'Kwame', text: 'Rescue, fine. But “power to the people”? Abeg. Soldiers, curfews, tribunals 🤨', time: '11:38 pm', at: kw + 0.4 });
  ph.focus(kw + 0.6, 3.0);
  ph.typing('Baaba', grand - 1.4, grand + 0.6); ph.msg({ who: 'Baaba', text: 'So the committees died but the district assemblies stayed. Interesting.', time: '11:52 pm', at: grand + 0.6 });
  ph.msg({ who: 'Kwame', text: 'hmm 🤔', time: '11:53 pm', at: grand + 1.8 });
  ph.build();
  sceneP(p, 0, promised - 0.2, `${time(p, '11:38 PM')}
    ${nameCard(p, 0.25, { y: 300, role: 'IN THE CHAT', name: 'Kwame, The Combative' })}
    ${bubble(p, 'Power to the people… <i>abeg?</i>', t('power to the people'), { x: LX, y: 520, w: 560, size: 50 })}
    ${stk(p, 'kwame-boxer', t('with soldiers'), { x: 800, y: 420, w: 300, rot: -4, life: 'jiggle', until: promised + 0.5 })}`, { enter: 'cut' });
  sceneP(p, promised - 0.2, beside - 0.2, `${H(p, 'Power to the people', promised, { size: 88, kicker: 'THE PROMISE' })}
    ${stack(p, [['People’s & Workers’ Defence Committees', set + 0.3, 'chip light'], ['in neighbourhoods and workplaces', t('in neighbourhoods'), 'chip light'], ['later: Committees for the Defence of the Revolution', renamed, 'chip light'], ['watch prices · expose corruption · hold power to account', watch, 'chip gold']], { y: 300 })}
    ${p.stamp('CDRs', t('of the revolution'), { x: 840, y: 470, rot: -7, size: 60 })}
    ${stk(p, 'argument', set + 0.6, { x: 780, y: 620, w: 300, rot: 3, life: 'sway', until: beside })}`, { enter: 'wipeL' });
  sceneP(p, beside - 0.2, same - 0.2, `${H(p, 'Beside it, *a hard state*', beside, { size: 84 })}
    ${prt(p, 'rawlings-throne', beside + 0.4, { x: 770, y: 300, w: 420, rot: 3 })}
    ${chip(p, 'public tribunals', trib, LX, 330, 'chip red')}
    ${stk(p, 'market-stall', mak - 0.2, { x: 130, y: 470, w: 470, rot: -3, life: 'jiggle', until: same, sfx: path.join(PSFX, 'crate-1.mp3') })}
    ${chip(p, 'Makola Market demolished · 1982', mak + 0.4, LX, 830, 'chip light')}`, { enter: 'wipeR' });
  sceneP(p, same - 0.2, evenso - 0.2, `${stk(p, 'judges-chairs', same, { x: 560, y: 260, w: 620, rot: 0, life: 'float', until: evenso, sfx: path.join(ED1SFX, 'bell.wav') })}
    ${chip(p, '1982 · three High Court judges and a retired army major', t('three high court'), LX, 150, 'chip light')}
    ${chip(p, 'abducted and murdered', abd, LX, 246, 'chip red')}
    ${chip(p, 'a crime that still haunts that era’s memory', haunts, LX, 820, 'chip light')}`, { enter: 'iris' });
  solemn(p, abd);
  sceneP(p, evenso - 0.2, haynes - 0.2, `${H(p, 'Even so…', evenso, { size: 84 })}
    ${nameCard(p, t('national commission'), { y: 280, role: 'SET UP BY THE SAME REGIME', name: 'National Commission on Democracy' })}
    ${chip(p, 'asked Ghanaians what government they wanted', ask, LX, 500, 'chip gold')}
    ${chip(p, 'a slow conversation, through the eighties…', conv, LX, 596, 'chip light')}
    ${stk(p, 'treaty-paper', cons - 0.4, { x: 820, y: 600, w: 300, rot: 5, life: 'bob', until: haynes })}
    ${p.stamp('1992 CONSTITUTION', cons, { x: 140, y: 720, rot: -5, size: 50 })}`, { enter: 'wipeU' });
  sceneP(p, haynes - 0.2, brill - 0.2, `${nameCard(p, haynes + 0.1, { y: 140, role: 'BRITISH SCHOLAR · REVOLUTION AND DEMOCRACY IN GHANA (2023)', name: 'Jeffrey Haynes' })}
    ${chip(p, 'interviewed the key players over 30 years', interviewed, LX, 360, 'chip light')}
    ${quote(p, 'Never clearly defined *the new system.*', never - 0.1, { who: 'HAYNES ON RAWLINGS’ POPULAR DEMOCRACY', y: 470, size: 70, w: 1050 })}
    ${chip(p, 'lacked the capacity to build it', lacked + 0.3, LX, 790, 'chip red')}`, { enter: 'push' });
  sceneP(p, brill - 0.2, yet - 0.2, `${H(p, 'Brilliant at pulling an old order *down*…', brill, { size: 88, w: 1080 })}
    ${stk(p, 'coup', brill + 0.6, { x: 820, y: 520, w: 300, rot: -4, life: 'jiggle', until: yet })}
    ${chip(p, '…far less sure what to put in its place', lessSure, LX, 560, 'chip gold')}`, { enter: 'wipeL' });
  // Remotion grid: 110 District Assemblies, two-thirds elected
  const g0 = yet - 0.2, g1 = yours - 0.25;
  rclip(p, 'GcpGrid', g0, g1, { kicker: 'PNDC LAW 207 · 1988', title: 'One piece did survive', total: 110, cols: 22, at: +(in88 - g0).toFixed(2), cascade: 1.4,
    fill: { at: +(twoth - g0).toFixed(2), count: 73, label: 'TWO-THIRDS ELECTED', color: 'red' }, rest: { label: 'ONE-THIRD APPOINTED' },
    counter: { at: +(t('110') - g0).toFixed(2), value: 110, label: 'DISTRICT ASSEMBLIES' } }, { y: 150, w: 1080 });
  sceneP(p, g0, g1, '', { enter: 'cut' });
  sceneP(p, yours - 0.25, s.dur, `${H(p, 'The assembly in *your* district', yours, { size: 88, w: 1080 })}
    ${stk(p, 'assembly-hall', yours + 0.3, { x: 560, y: 380, w: 620, rot: 2, life: 'float', until: s.dur + 1 })}
    ${chip(p, 'a grandchild of that law', grand, LX, 380, 'chip gold')}`, { enter: 'wipeU' });
  return p;
}

// ---------------------------------------------------------------------------
// QUESTION THREE — Did the revolution sell out to the IMF?
export function q3() {
  const [p, c, s] = make('q3'); p.css.push(SP2_CSS); p.label = '';
  const t = (...q) => cs(c, ...q);
  const spotted = t('spotted the contradiction'), how = t('how does a revolutionary'), april = t('in april 1983'), deep = t('deep devaluation'), lifted = t('price controls lifted'),
    trimmed = t('state firms trimmed'), foreign = t('and foreign money'), wb = t('by the world banks'), grew = t('and the economy grew'), west = t('until ghana became'),
    remember = t('and remember how far'), ind = t('at independence'), korea = t('south koreas'), queue = t('by 1983 we were'), rescue = t('was that a rescue'), both = t('both'),
    shelves = t('the shelves filled'), urban = t('but urban workers'), dream = t('and the dream'), soldier = t('run by a soldier'), shill = t('kevin shillington'),
    asked = t('asked how real'), decades = t('three decades on');
  const ph = new Phone(p, { pinned: 'Did the revolution sell out to the IMF?', enter: 0.0, clock0: '12:04',
    prior: [{ who: 'Baaba', text: 'So the committees died but the district assemblies stayed. Interesting.', time: '11:52 pm' }, { who: 'Kwame', text: 'hmm 🤔', time: '11:53 pm' }] });
  ph.divider('Friday', 0.2);
  ph.typing('Baaba', 0.4, spotted); ph.msg({ who: 'Baaba', text: 'Wait. The anti-imperialist revolutionary went to the IMF and World Bank?? How?', time: '12:04 am', at: spotted });
  ph.focus(spotted + 0.3, 3.0);
  ph.typing('Baaba', decades - 0.6, s.dur - 1.6); ph.msg({ who: 'Baaba', text: 'So he saved the economy by abandoning his own ideology 😶', time: '12:21 am', at: s.dur - 1.6 });
  ph.build();
  sceneP(p, 0, how - 0.2, `${time(p, '12:04 AM')}
    ${nameCard(p, 0.25, { y: 300, role: 'IN THE CHAT', name: 'Baaba, The Ascendant' })}
    ${chip(p, 'spotted the contradiction', spotted, LX, 520, 'chip gold')}
    ${chip(p, 'every serious study of this man wrestles with', t('every serious'), LX, 616, 'chip light')}`, { enter: 'cut' });
  sceneP(p, how - 0.2, april - 0.2, `${quote(p, 'A revolutionary… *with the IMF and the World Bank?*', how, { who: 'THE CONTRADICTION', y: 180, size: 84, w: 1050 })}
    ${chip(p, 'who came to fight the old order', t('came to fight'), LX, 600, 'chip red')}
    ${stk(p, 'currency', t('the world bank'), { x: 820, y: 560, w: 300, rot: 4, life: 'bob', until: april })}`, { enter: 'wipeU' });
  sceneP(p, april - 0.2, wb - 0.2, `${dateline(p, 'APRIL 1983', april, { y: 140, size: 58 })}
    ${nameCard(p, april + 0.6, { y: 260, role: 'WITH THE COUNTRY STARVING', name: 'Economic Recovery Programme' })}
    ${stk(p, 'devaluation', deep - 0.2, { x: 840, y: 460, w: 340, rot: 4, life: 'jiggle', until: wb, sfx: path.join(ED1SFX, 'coins.wav') })}
    ${chip(p, 'with the country starving', t('with the country'), LX, 410, 'chip light')}
    ${stack(p, [['deep devaluation', deep, 'chip red'], ['price controls lifted', lifted, 'chip light'], ['state firms trimmed', trimmed, 'chip light'], ['foreign money flowing in', foreign, 'chip gold']], { y: 520 })}`, { enter: 'wipeL' });
  // Remotion bars: inflation 1983 → 1986 → 1991
  const b0 = wb - 0.2, b1 = remember - 0.2, B = (x) => +(x - b0).toFixed(2);
  rclip(p, 'GcpBars', b0, b1, { kicker: 'BY THE WORLD BANK’S FIGURES', title: 'Inflation, after the Recovery Programme', max: 130,
    bars: [{ at: B(t('from 123%', '123%')) , label: '1983', value: 123 }, { at: B(t('to 40%', '40%')), label: '1986', value: 40, color: 'gold' }, { at: B(t('and 18%', '18%')), label: '1991', value: 18, color: 'gold' }],
    notes: [{ at: B(grew + 0.4), text: 'GROWTH ≈ 5% A YEAR', x: 780, y: 230 }] }, { y: 120, w: 1080 });
  sceneP(p, b0, west - 0.2, '', { enter: 'cut' });
  sceneP(p, west - 0.2, b1, `${chip(p, 'the West’s favourite example of adjustment that worked', west + 0.2, LX, 860, 'chip gold')}`, { enter: 'cut' });
  sceneP(p, remember - 0.2, rescue - 0.2, `${H(p, 'How far we had fallen', remember, { size: 84 })}
    ${bigCount(p, ind + 0.1, 1957, { from: 1940, y: 290, size: 170 })}
    ${chip(p, 'Ghana’s income per head ≈ South Korea’s', korea - 0.3, LX, 500, 'chip gold')}
    ${p.stamp('1983: QUEUEING FOR BASIC ESSENTIALS', queue, { x: 140, y: 660, rot: -4, size: 38 })}`, { enter: 'iris' });
  sceneP(p, rescue - 0.2, shill - 0.2, `${H(p, 'A rescue, or a retreat?', rescue, { size: 88 })}
    ${p.stamp('BOTH.', both, { x: 820, y: 360, rot: -8, size: 72 })}
    ${stack(p, [['the shelves filled', shelves, 'chip gold'], ['urban workers swallowed the pain', urban, 'chip red'], ['a self-reliant people’s economy…', dream, 'chip light'], ['…gave way to a market economy run by a soldier', soldier - 0.6, 'chip light']], { y: 330 })}`, { enter: 'wipeR' });
  sceneP(p, shill - 0.2, s.dur, `${prt(p, 'shillington-book', shill, { x: 910, y: 150, w: 290, rot: 3 })}
    ${nameCard(p, shill + 0.1, { y: 150, role: 'GHANA AND THE RAWLINGS FACTOR · 1992', name: 'Kevin Shillington' })}
    ${chip(p, 'writing in 1992, before the Fourth Republic', t('writing in 1992'), LX, 370, 'chip light')}
    ${quote(p, 'How real did the recovery feel *to the ordinary Ghanaian?*', asked, { who: 'HIS QUESTION', y: 520, size: 56, w: 700 })}
    ${p.stamp('STILL STANDS', t('still stands'), { x: 560, y: 900, rot: -5, size: 48 })}`, { enter: 'push' });
  return p;
}

// ---------------------------------------------------------------------------
// QUESTION FOUR — Then why didn't nineteen years transform us?
export function q4() {
  const [p, c, s] = make('q4'); p.css.push(SP2_CSS); p.label = '';
  const t = (...q) => cs(c, ...q);
  const asked = t('asked the question this'), wit = t('one witness'), pub = t('and published'), calls = t('he calls him'), noplan = t('no plan'), meet = t('and that in meetings'),
    planes = t('toy planes'), office = t('rawlings office', 'rawlings'), econ = t('generously economical'), insider = t('so take it as'),
    trap = t('there is also the trap'), outsider = t('the outsider became'), won92 = t('he won the 1992'), boycott = t('and when the opposition'), every = t('almost every seat'),
    y95 = t('in 1995'), four = t('four people'), won96 = t('he won again'), two = t('the two term'), irony = t('here is the irony'), jan = t('on the 7th of january'),
    first = t('the first peaceful'), once = t('had once served'), move = t('a move ahwoi'), oil = t('for oil');
  const ph = new Phone(p, { pinned: 'Then why didn’t nineteen years transform us?', enter: 0.0, clock0: '12:44',
    prior: [{ who: 'Baaba', text: 'Wait. The anti-imperialist revolutionary went to the IMF and World Bank?? How?', time: '12:04 am' }, { who: 'Baaba', text: 'So he saved the economy by abandoning his own ideology 😶', time: '12:21 am' }] });
  ph.typing('Amo', 0.4, asked); ph.msg({ who: 'Amo', text: 'Aba read me everything. Let me ask the real one. Why didn’t 19 years change us for good? 🧐', time: '12:44 am', at: asked });
  ph.focus(asked + 0.3, 3.2);
  ph.typing('Amo', oil - 2.6, s.dur - 2.6); ph.msg({ who: 'Amo', text: 'So: no blueprint, a broken economy, and then power got comfortable. That’s three reasons, not one.', time: '1:12 am', at: s.dur - 2.6 });
  ph.msg({ who: 'Kwame', text: 'ok fine. it’s complicated 😤', time: '1:13 am', at: s.dur - 1.0 });
  ph.build();
  sceneP(p, 0, wit - 0.2, `${time(p, '12:44 AM')}
    ${nameCard(p, 0.25, { y: 300, role: 'IN THE CHAT · NEW AT THE NEST', name: 'Amo, The Discerning' })}
    ${chip(p, 'had Aba reading the whole chat to him', t('who had aba', 'reading the whole'), LX, 520, 'chip light')}
    ${chip(p, 'asked the question this Special exists for', asked, LX, 616, 'chip gold')}`, { enter: 'cut' });
  sceneP(p, wit - 0.2, calls - 0.2, `${prt(p, 'ahwoi-book', wit + 0.2, { x: 860, y: 140, w: 290, rot: 3 })}
    ${nameCard(p, t('kwamena'), { y: 150, role: 'ONE WITNESS', name: 'Kwamena Ahwoi' })}
    ${chip(p, 'with Rawlings from the PNDC to the NDC', t('who worked beside'), LX, 370, 'chip light')}
    ${chip(p, 'Working with Rawlings · Digibooks, 2020', pub, LX, 466, 'chip gold')}`, { enter: 'wipeL' });
  sceneP(p, calls - 0.2, office - 0.3, `${quote(p, 'A born leader… *mesmerising charisma.*', calls, { who: 'AHWOI ON RAWLINGS', y: 130, size: 62, w: 1050 })}
    ${chip(p, 'but: no plan, no strategy to materially develop Ghana', noplan - 0.2, LX, 420, 'chip red')}
    ${chip(p, 'in meetings: looked out of the window…', meet + 0.3, LX, 516, 'chip light')}
    ${stk(p, 'toy-plane', planes - 0.4, { x: 700, y: 560, w: 420, rot: -4, life: 'sail', until: office, sfx: path.join(PSFX, 'syn-takeoff.wav') })}
    ${chip(p, '…or played with his toy planes', planes - 0.2, LX, 640, 'chip gold')}`, { enter: 'wipeU' });
  sceneP(p, office - 0.3, trap - 0.2, `${quote(p, '“Generously economical *with the truth.*”', econ - 0.3, { who: 'THE OFFICE OF FORMER PRESIDENT RAWLINGS · AUG 2020', y: 170, size: 74, w: 1050, cardAt: office })}
    ${chip(p, 'rejected many of its claims', t('rejected many'), LX, 500, 'chip light')}
    ${p.stamp('ONE INSIDER’S ACCOUNT', insider + 0.3, { x: 140, y: 640, rot: -5, size: 46 })}`, { enter: 'wipeR' });
  sceneP(p, trap - 0.2, won92 - 0.2, `${H(p, 'The trap of *success*', trap, { size: 96, y: 180 })}
    ${chip(p, 'the outsider became the establishment', outsider, LX, 470, 'chip gold')}
    ${prt(p, 'rawlings-civilian', outsider + 0.2, { x: 880, y: 400, w: 300, rot: 3 })}`, { enter: 'iris' });
  // Remotion bars: the 1992 vote
  const e0 = won92 - 0.2, e1 = y95 - 0.2, E = (x) => +(x - e0).toFixed(2);
  rclip(p, 'GcpBars', e0, e1, { kicker: 'PRESIDENTIAL ELECTION · 1992', title: 'He won with about sixty per cent', horizontal: true, max: 100,
    bars: [{ at: E(t('about 60%', '60%')) - 0.3, label: 'RAWLINGS · NDC', value: 60, prefix: '≈' }, { at: E(t('about 60%', '60%')) + 0.6, label: 'ADU BOAHEN · NPP', value: 31, color: 'muted', prefix: '≈' }],
    notes: [{ at: E(boycott + 0.3), text: 'OPPOSITION BOYCOTTS PARLIAMENT', x: 640, y: 560 }, { at: E(every), text: 'NDC: 189 OF 200 SEATS', x: 700, y: 640, red: true, rot: 2 }] }, { y: 150, w: 1080 });
  sceneP(p, e0, e1, '', { enter: 'cut' });
  sceneP(p, y95 - 0.2, won96 - 0.2, `${dateline(p, 'ACCRA · 11 MAY 1995', y95, { y: 140, size: 58 })}
    ${H(p, '*Kume Preko*', t('kume'), { size: 110, y: 240 })}
    ${chip(p, 'crowds march against the new VAT', t('when crowds'), LX, 450, 'chip light')}
    ${chip(p, 'four people shot dead by unidentified gunmen', four, LX, 546, 'chip red')}`, { enter: 'wipeL' });
  solemn(p, four);
  const v0 = won96 - 0.2, v1 = irony - 0.2, V = (x) => +(x - v0).toFixed(2);
  rclip(p, 'GcpBars', v0, v1, { kicker: 'PRESIDENTIAL ELECTION · 1996', title: 'He won again', horizontal: true, max: 100,
    bars: [{ at: V(t('with 57%', '57%')), label: 'RAWLINGS · NDC', value: 57 }, { at: V(t('against kufuors', 'kufuors')), label: 'KUFUOR · NPP', value: 40, color: 'muted' }],
    notes: [{ at: V(two), text: 'THEN HE OBEYED THE TWO-TERM LIMIT', x: 560, y: 600 }] }, { y: 150, w: 1080 });
  sceneP(p, v0, v1, '', { enter: 'cut' });
  sceneP(p, irony - 0.2, move - 0.2, `${dateline(p, '7 JANUARY 2001', jan, { y: 140, size: 58 })}
    ${H(p, 'Here is the *irony*', irony, { size: 80, y: 250 })}
    ${chip(p, 'he handed power to John Kufuor', t('he handed power'), LX, 400, 'chip gold')}
    ${chip(p, 'the first peaceful transfer to the opposition in our history', first, LX, 496, 'chip light')}
    ${stk(p, 'election', first + 1.4, { x: 900, y: 300, w: 280, rot: 4, life: 'bob', until: move })}
    ${nameCard(p, once, { y: 620, role: 'ONCE ABOUT 8 MONTHS A SECRETARY IN THE FIRST PNDC GOVERNMENT', name: 'John Kufuor' })}
    ${p.stamp('IRONY', t('pndc government'), { x: 960, y: 820, rot: -7, size: 56 })}`, { enter: 'push' });
  sceneP(p, move - 0.2, s.dur, `${H(p, 'Why put Kufuor in?', move, { size: 84 })}
    ${chip(p, 'Ahwoi: partly to keep Nigeria’s President Shagari on side', t('keeping nigerias', 'nigerias'), LX, 320, 'chip light')}
    ${chip(p, 'Shagari: a friend of Kufuor’s', t('a friend of'), LX, 416, 'chip gold')}
    ${p.stamp('…FOR OIL', oil, { x: 140, y: 560, rot: -6, size: 72 })}`, { enter: 'wipeU' });
  return p;
}

// ---------------------------------------------------------------------------
// THE LEDGER — the nightjar proverb, the man in one line, the lesson, and the question for the viewer.
export function lesson() {
  const [p, c, s] = make('lesson'); p.css.push(SP2_CSS); p.label = '';
  const t = (...q) => cs(c, ...q);
  const verdict = t('aba asked for a verdict', 'asked for a verdict'), ahwoi = t('and ahwoi himself'), proverb = t('an old akan proverb'), santro = t('santrofi'),
    catchIt = t('catch it and'), letGo = t('let it go and'), man = t('that is the man'), rev = t('the revolutionary who'), prag = t('the pragmatist'), strong = t('the strongman'),
    lesson_ = t('so here is the lesson'), anger = t('anger can diagnose'), only = t('but only a plan'), nineteen = t('and 19 years', '19 years of power'),
    turn = t('now it is your turn'), write = t('write it in the comments'), L = c('with respect', { end: true });
  const ph = new Phone(p, { pinned: 'Editor, verdict abeg.', enter: 0.0, clock0: '1:31', exit: s.dur - 0.7,
    prior: [{ who: 'Amo', text: 'So: no blueprint, a broken economy, and then power got comfortable. That’s three reasons, not one.', time: '1:12 am' }, { who: 'Kwame', text: 'ok fine. it’s complicated 😤', time: '1:13 am' }] });
  ph.typing('Aba', 0.3, verdict + 0.2); ph.msg({ who: 'Aba', text: 'Editor, verdict abeg. Then I’ll sleep 😴', time: '1:31 am', at: verdict + 0.2 });
  ph.focus(verdict + 0.4, 3.0);
  const k1 = L + 0.8, r0 = L + 2.2;
  ph.msg({ who: 'Kofi', text: 'Diagnose boldly. Build patiently. Hand over gracefully. Goodnight, squad.', time: '1:39 am', at: k1 });
  ['Aba', 'Baaba', 'Kwame', 'Amo'].forEach((w, i) => ph.msg({ who: w, text: '🙏🏾', big: true, time: '1:40 am', at: r0 + i * 0.35 }));
  ph.focus(k1 - 0.1, s.dur - k1 - 1.0, { s: 1.1 });
  ph.build();
  sceneP(p, 0, proverb - 0.2, `${time(p, '1:31 AM')}
    ${chip(p, 'close to half past one', 0.6, LX, 300, 'chip light')}
    ${chip(p, 'Aba asks for a verdict', verdict, LX, 396, 'chip gold')}
    ${prt(p, 'ahwoi-book', ahwoi, { x: 760, y: 300, w: 300, rot: 3, caption: 'the best verdict: Ahwoi’s' })}`, { enter: 'cut' });
  sceneP(p, proverb - 0.2, catchIt - 0.2, `${H(p, 'Santrofi anomaa', santro - 0.2, { size: 120, kicker: 'AN OLD AKAN PROVERB · THE NIGHTJAR' })}
    ${stk(p, 'nightjar', proverb + 0.4, { x: 640, y: 560, w: 540, rot: -3, life: 'bob', until: catchIt + 6, sfx: path.join(ED1SFX, 'wind.wav') })}
    <div style="position:absolute;left:${LX}px;top:330px">${tw(p, 'wokye no a, wakye mmusuo;', santro + 1.0, 50, 'var(--ink)', 14)}</div>
    <div style="position:absolute;left:${LX}px;top:400px">${tw(p, 'wogyae no a, wagyae adeɛ.', santro + 3.0, 50, 'var(--ink)', 14)}</div>
    ${chip(p, 'catch it… or let it go?', t('wagyae') - 0.2, LX, 500, 'chip gold')}`, { enter: 'iris' });
  sceneP(p, catchIt - 0.2, man - 0.2, `${card(p, `<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:72px;line-height:1.05">Catch it: <span style="color:var(--red)">a curse.</span></div>`, catchIt, { y: 150, w: 980, rot: -1.5 })}
    ${card(p, `<div style="font-family:'Playfair Display',serif;font-weight:900;font-size:72px;line-height:1.05">Let it go: <span style="color:#8E6A1E">something precious.</span></div>`, letGo, { y: 360, w: 980, rot: 1.2 })}
    ${stk(p, 'nightjar', catchIt + 0.2, { x: 700, y: 620, w: 420, rot: 2, life: 'bob', until: man })}`, { enter: 'wipeU' });
  // Remotion ledger, part one: the man in one line — each phrase tips the balance
  const l0 = man - 0.2, l1 = lesson_ - 0.2, D = (x) => +(x - l0).toFixed(2);
  rclip(p, 'GcpLedger', l0, l1, { kicker: 'THE MAN IN ONE LINE', title: 'Santrofi anomaa', rows: [
    { at: D(rev), side: 'L', text: 'The unfinished revolution' }, { at: D(prag), side: 'R', text: 'Pulled Ghana back from collapse' },
    { at: D(strong), side: 'L', text: 'The strongman' }, { at: D(t('the constitution')), side: 'R', text: 'The 1992 Constitution' },
    { at: D(t('the term limits')), side: 'R', text: 'Term limits, obeyed' }, { at: D(t('and the handover')), side: 'R', text: 'The 2001 handover' }] }, { y: 150, w: 1080 });
  sceneP(p, l0, l1, '', { enter: 'cut' });
  sceneP(p, lesson_ - 0.2, turn - 0.2, `${H(p, 'Anger can diagnose a nation.', anger, { size: 92, w: 1080, kicker: 'THE LESSON, SQUAD', kat: lesson_ })}
    <div style="position:absolute;left:${LX}px;top:420px;font-family:'Playfair Display',serif;font-weight:900;font-size:92px;color:var(--red);width:1080px;line-height:1.02">${p.words(p.id_('w'), 'Only a plan can heal it.', only + 0.2, { stagger: 0.08 })}</div>
    ${chip(p, '19 years of power ≠ one good blueprint', nineteen, LX, 680, 'chip gold')}
    ${stk(p, 'tech-drawing', t('one good blueprint') - 0.2, { x: 900, y: 600, w: 300, rot: 4, life: 'sway', until: turn })}`, { enter: 'push' });
  // Remotion ledger, part two: the full ledger, the balance levels — your turn
  const m0 = turn - 0.2, m1 = s.dur, M = (x) => +(x - m0).toFixed(2), Le = Math.min(m1 - 0.5, L + 4.6);
  rclip(p, 'GcpLedger', m0, Le, { kicker: 'YOUR TURN', title: 'Which column weighs more?', level: M(t('which column')), rows: [
    { at: 0.3, side: 'L', year: '1979', text: 'AFRC executions' }, { at: 0.45, side: 'R', year: '1983', text: 'Stopped the collapse' },
    { at: 0.6, side: 'L', year: '1982', text: 'Judges abducted, killed' }, { at: 0.75, side: 'R', year: '1983', text: 'Economic Recovery Programme' },
    { at: 0.9, side: 'L', year: '1982', text: 'Makola demolished' }, { at: 1.05, side: 'R', year: '1988', text: 'District Assemblies' },
    { at: 1.2, side: 'L', year: '1995', text: 'Kume Preko deaths' }, { at: 1.35, side: 'R', year: '1992', text: 'The Constitution' },
    { at: 1.5, side: 'L', year: '—', text: 'No blueprint' }, { at: 1.65, side: 'R', year: '2001', text: 'The peaceful handover' }] }, { y: 120, w: 1080 });
  sceneP(p, m0, Le, `${stk(p, 'comments-pin', write - 0.1, { x: 860, y: 790, w: 200, rot: -6, life: 'bob', until: Le + 0.5 })}`, { enter: 'cut' });
  sceneP(p, Le, m1, `${H(p, 'Diagnose boldly. Build patiently. *Hand over gracefully.*', Le + 0.1, { size: 84, w: 1080, y: 260 })}`, { enter: 'wipeU' });
  fx(p, 'crickets.wav', L + 0.2, -26, s.dur - L);
  return p;
}

export const BUILDERS = { q1, q2, q3, q4, lesson };
