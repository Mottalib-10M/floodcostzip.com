import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const N = K.N;
const C = N.claims;
const POL = N.policies!;
const [y0, y1] = N.claimYears;
const BY = Object.entries(N.claimsByYear).map(([y, v]) => ({ y: Number(y), ...v }));
const byCount = [...BY].sort((a, b) => b.n - a.n);
const byMedian = [...BY].sort((a, b) => b.median - a.median);
const lastY = BY.find((b) => b.y === y1);
const quiet = [...BY].filter((b) => b.y !== y1).sort((a, b) => a.n - b.n)[0];
const yearsOfBill = C.median / POL.median;
const big = K.STATES.filter((s) => s.claims && s.claims.n >= 1000);
const ranked = [...big].sort((a, b) => b.claims!.median - a.claims!.median);
const low = ranked[ranked.length - 1];
const ev = new Map<string, { n: number; total: number; year: number }>();
for (const s of K.STATES) for (const e of s.events) { const x = ev.get(e.event) ?? { n: 0, total: 0, year: e.year }; x.n += e.n; x.total += e.total; ev.set(e.event, x); }
const events = [...ev.entries()].map(([name, v]) => ({ name, ...v })).sort((a, b) => b.n - a.n);
const topEv = events[0];
const ev2 = events.find((e) => e.year !== topEv.year);
const evLast = events.find((e) => e.year === y1);
const lim = K.P.limits;

export default defineGuide({
  id: 'average-flood-insurance-claim',
  group: 'cost',
  order: 6,
  slug: 'average-flood-insurance-claim',
  nav: 'Average claim',
  card: `What the federal program paid per flooded house from ${y0} to ${y1}, by year and by state.`,
  title: 'Average Flood Insurance Claim 2026: Paid Claims by State',
  description: `Average flood insurance claim in 2026 data: the average and median paid single-family claim from ${y0} to ${y1}, by year of loss, by state, and the policy limits.`,
  h1: 'Average flood insurance claim: what the federal program pays per flooded house',
  intro: `${K.num(C.n)} single-family claims were paid for floods from ${y0} to ${y1}. Pick a state below to set its median claim against your yearly bill.`,
  resume: `From ${y0} to ${y1}, the federal flood program paid ${K.num(C.n)} claims on single-family homes, about $${K.dec(C.total / 1e9, 1)} billion in all, for building and contents together. The average paid claim was ${K.usd(C.avg)} and the median ${K.usd(C.median)}: half of the flooded houses received less than that. The gap between the two comes from a minority of very large losses in deep, long floods. Year by year the median moves with the floods of that year, from ${K.usd(byMedian[byMedian.length - 1].median)} in ${byMedian[byMedian.length - 1].y} to ${K.usd(byMedian[0].median)} in ${byMedian[0].y}. Among states with at least ${K.num(1000)} paid claims, ${ranked[0].name} had the highest median, ${K.usd(ranked[0].claims!.median)}, and ${low.name} the lowest, ${K.usd(low.claims!.median)}. A single median claim equals about ${K.num(Math.round(yearsOfBill))} years of the median yearly bill. A policy pays at most ${K.usd(lim.building)} for the building and ${K.usd(lim.contents)} for belongings, after the deductibles.`,
  body: (h) => `
<h2>Average and median: two different answers</h2>
<p>The question "what is the average flood claim" has two honest answers, and they are far apart. Across the ${K.num(C.n)} single-family claims the program paid for losses between ${y0} and ${y1}, the mean was ${K.usd(C.avg)}. The median, the claim in the middle of the list, was ${K.usd(C.median)}. Flood damage is lopsided: a few inches of water in a living room means new flooring, drywall and appliances, while a house under several feet of seawater can be a near total loss. The large claims pull the mean up, and the median is the better picture of an ordinary flooded house.</p>
<p>These amounts are building and contents together, in the dollars of the year they were paid, with no adjustment for inflation. They count only claims that ended in a payment: claims closed without payment are left out. The source is the OpenFEMA ${h.src('openfema_claims', 'claims file')}, which lists every claim with its date of loss and the amounts paid.</p>
<h2>A year is only as large as its floods</h2>
<p>The claim count swings with the weather far more than with the number of policies. The busiest year of the period was ${byCount[0].y}, with ${K.num(byCount[0].n)} paid single-family claims; the quietest full year was ${quiet.y}, with ${K.num(quiet.n)}. A single storm can make the year. In the event lists of the ${h.a('flood-insurance-by-state', 'state pages')}, ${topEv.name} (${topEv.year}) alone accounts for at least ${K.num(topEv.n)} paid single-family claims${ev2 ? `, and ${ev2.name} (${ev2.year}) for at least ${K.num(ev2.n)}` : ''}.</p>
<p>The median per claim moves too, and not always with the count. A year dominated by a major hurricane tends to produce high medians, because so many houses take deep water at once: ${byMedian[0].y} had the highest of the period, ${K.usd(byMedian[0].median)}. A year made of smaller, scattered floods tends to produce smaller claims: the lowest median, ${K.usd(byMedian[byMedian.length - 1].median)}, belongs to ${byMedian[byMedian.length - 1].y}.</p>
<h2>Why ${y1} looks small</h2>
<p>${lastY ? `The file shows only ${K.num(lastY.n)} paid single-family claims for losses in ${y1}, with a median of ${K.usd(lastY.median)}.` : `The file has few paid claims for losses in ${y1}.`} Two reasons combine. First, claims take months to adjust and pay, and the last loss in this extract is dated ${K.day(N.claimsLastLoss)}, so floods late in ${y1} are still being settled and more payments will be added. Second, the year had no event on the scale of the large hurricanes above${evLast ? `: the largest ${y1} event in the state lists, ${evLast.name}, accounts for ${K.num(evLast.n)} paid claims` : ''}. Treat ${y1} as provisional, and compare full years with each other.</p>
<h2>The states where claims are largest</h2>
${h.table(['State', 'Paid claims', 'Median claim', 'Average claim', 'Median bill, years'], ranked.slice(0, 8).map((s) => [h.a(`state:${s.slug}`, s.name), K.num(s.claims!.n), K.usd(s.claims!.median), K.usd(s.claims!.avg), s.pol ? K.num(Math.round(s.claims!.median / s.pol.median)) : 'n/a']), `Single-family claims paid for losses from ${y0} to ${y1} (OpenFEMA), states with at least ${K.num(1000)} paid claims. Last column: median claim divided by the state's median bill on ${K.day(N.policiesDate!)}.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The three Gulf states at the top are the ones where hurricanes caused the longest and deepest floods of the period. When a hurricane stalls over a city or drives a surge inland, houses stay under water for days and the repairs reach the walls, the wiring and the heating system. At the other end, ${h.a(`state:${low.slug}`, low.name)} had a median paid claim of ${K.usd(low.claims!.median)}, ${K.pct(low.claims!.median / ranked[0].claims!.median, 0)} of the leader's. The calculator at the top of the page shows the median of every state, small ones included.</p>
<p>The last column of the table turns the claim into years of premium. It is not a measure of whether a policy is worth buying, since a policy is bought against the chance of a flood, not its average, but it shows how quickly one flood outweighs many years of bills.</p>
<h2>What a single claim can pay at most</h2>
<p>However large the loss, a federal policy on a house has two ceilings: ${K.usd(lim.building)} for the building and ${K.usd(lim.contents)} for belongings (${h.src('usc_4013', '42 U.S.C. 4013(b)')}). Each coverage has its own deductible, up to ${K.usd(K.P.deductibles.residentialMax)} for a house. Increased Cost of Compliance coverage on a building policy can pay up to ${K.usd(lim.icc)} on top.</p>
<p>Many claims never reach the limits, but some do: a house worth well above ${K.usd(lim.building)} that is badly flooded leaves its owner with the difference. The simulator below shows how the limits and the deductible cut a large loss.</p>
${h.mini('coverage', { t: 'What the policy pays on a big loss', p: ['b', 'c', 'd'] })}
<p>The ${h.a('flood-insurance-coverage-limits', 'coverage limits guide')} explains each ceiling, and the ${h.a('how-much-is-flood-insurance', 'price guide')} what the bill buys in the first place.</p>
`,
  faqs: [
    { q: 'What is the average flood insurance payout for a house?', a: `For single-family homes, the federal program paid an average of ${K.usd(C.avg)} per claim on losses from ${y0} to ${y1}, building and contents together. The median was lower, ${K.usd(C.median)}, because a small number of near total losses raise the average. Both are in the dollars of the year paid, without inflation adjustment.` },
    { q: 'Which state has the largest median flood claim?', a: `Among states with at least ${K.num(1000)} paid single-family claims from ${y0} to ${y1}, ${ranked[0].name} came first with a median of ${K.usd(ranked[0].claims!.median)}, ahead of ${ranked[1].name} (${K.usd(ranked[1].claims!.median)}) and ${ranked[2].name} (${K.usd(ranked[2].claims!.median)}). Long hurricane floods with deep water explain most of the gap with inland states.` },
    { q: `Why are there so few flood claims for ${y1}?`, a: `Claims take months to adjust and pay, and the extract stops at losses dated ${K.day(N.claimsLastLoss)}, so many ${y1} floods are still being settled. The year also lacked a flood event as large as the hurricanes that drive the busiest years. The count for ${y1} will grow as payments are added.` },
    { q: 'Can a flood claim pay more than the building limit?', a: `Not under the building coverage, which stops at ${K.usd(lim.building)} for a house. Contents coverage is separate, up to ${K.usd(lim.contents)}, and Increased Cost of Compliance can add up to ${K.usd(lim.icc)} for required elevation or rebuilding work. Anything beyond those amounts stays with the owner unless another policy covers it.` },
  ],
  tool: 'claims',
  related: ['flood-insurance-coverage-limits', 'flood-insurance-by-state', 'how-much-is-flood-insurance', 'nfip'],
  sources: ['openfema_claims', 'usc_4013', 'cfr_61_6', 'fema_manual'],
});
