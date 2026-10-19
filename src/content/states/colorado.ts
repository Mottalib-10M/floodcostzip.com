import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('colorado');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const co = (name: string) => st.topCounties.find((x) => x.name === name);
const boulder = co('Boulder County');
const elPaso = co('El Paso County');
const denver = co('Denver, City and County of');
const arapahoe = co('Arapahoe County');
const laPlata = co('La Plata County');
const larimer = co('Larimer County');
const burn = st.events[0];
const gap = st.maxGap;
const W = K.P.waiting;

export default defineState({
  slug: 'colorado',
  title: 'Flood Insurance Colorado 2026: Front Range and Burn Scars',
  description: `Colorado flood insurance in 2026: median single-family bill on ${date}, Boulder and Denver area costs, X zone prices and the wait after a wildfire.`,
  intro: `Colorado has ${K.num(pol.n)} single-family flood policies; on ${date} the median bill was ${K.usd(pol.median)}, and more of them sit outside the high-risk zones than inside.`,
  resume: `A federal flood policy on a Colorado house cost a median ${K.usd(pol.median)} a year on ${date}, fees and assessment included, under the national ${K.usd(N.policies!.median)}. Colorado is a low-volume market: ${K.num(pol.n)} single-family policies statewide, most of them along the Front Range from Fort Collins to Colorado Springs. Unusually, homes rated X, B or C outnumber A zone homes, ${K.num(z.X?.n ?? 0)} to ${K.num(z.A?.n ?? 0)}, and they paid a median of only ${K.usd(z.X?.median ?? 0)}. Prices are close to their final level: the full-risk median is ${K.usd(pol.full)} and ${K.pct(pol.capped, 0)} of policies still pay below it. Paid claims are rare and small. From ${N.claimYears[0]} to ${N.claimYears[1]}, the federal program paid ${K.num(st.claims?.n ?? 0)} single-family claims in the state, at a median of ${K.usd(st.claims?.median ?? 0)}. One exposure stands apart, the flash flood that follows a wildfire, and the program has a specific timing rule for it.`,
  body: (h) => `
<h2>Most insured homes are outside the floodplain</h2>
<p>Colorado's flood risk is concentrated in canyons and along creeks that drain the mountains into the plains. Lenders require coverage only in mapped high-risk zones, yet ${K.pct((z.X?.n ?? 0) / pol.n, 0)} of the state's single-family policies are in X zones, a sign that many owners buy it by choice. That is cheap coverage: the X zone median bill was ${K.usd(z.X?.median ?? 0)}, with a full-risk median of ${K.usd(z.X?.full ?? 0)}. In A zones the median was ${K.usd(z.A?.median ?? 0)}.</p>
<p>Boulder County has the most policies, ${K.num(boulder?.pol?.n ?? 0)}, and one of the higher medians on the Front Range, ${K.usd(boulder?.pol?.median ?? 0)}. Denver paid ${K.usd(denver?.pol?.median ?? 0)} and Arapahoe County ${K.usd(arapahoe?.pol?.median ?? 0)}, among the lowest county medians in the data.</p>
<h2>After a fire, the rules on timing change</h2>
<p>Wildfire changes the ground: soil baked by a fire absorbs little water, and a summer thunderstorm over a burn scar can send mud and debris down a drainage within minutes. ${burn ? `In Colorado's claims records, ${burn.event} in ${burn.year} is the only event large enough to be named, with ${K.num(burn.n)} paid claims.` : ''} The usual rule is a ${W.days}-day wait between purchase and coverage. The statute carves out one case: a privately owned home flooded from federal land, where post-wildfire conditions caused or worsened the flood, is covered after ${K.num(W.mapRevisionDays)} day if the policy was bought by the containment date or within ${K.num(W.wildfireDays)} days after it. Many foothill neighborhoods sit directly below national forest, so the federal-land condition is often met.</p>
${h.mini('waiting', { t: 'Would a Colorado policy be in force on the day of the flood?', p: ['sit', 'days'], d: { sit: 'standard', days: 14 } })}
<p>The calculator covers the standard, loan and map-change cases; the wildfire rule is narrower and its conditions are listed in the ${h.a('flood-insurance-waiting-period', 'waiting period guide')}.</p>
<h2>The southwest corner</h2>
<p>La Plata County, around Durango, breaks the statewide pattern. Its ${K.num(laPlata?.pol?.n ?? 0)} policies had a median of ${K.usd(laPlata?.pol?.median ?? 0)} on ${date}, and a full-risk median of ${K.usd(laPlata?.pol?.full ?? 0)}; ${K.pct(laPlata?.pol?.capped ?? 0, 0)} are still capped. Next door, ${gap?.name ?? 'a neighbouring county'} shows the widest gap of the state in FEMA's 2023 table, ${K.usd(gap?.current ?? 0)} paid against ${K.usd(gap?.risk ?? 0)} at full risk, on ${K.num(gap?.pif ?? 0)} policies.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Boulder County, Colorado?', a: `Boulder County had ${K.num(boulder?.pol?.n ?? 0)} single-family flood policies on ${date}, more than any other Colorado county, with a median yearly bill of ${K.usd(boulder?.pol?.median ?? 0)} including fees. The median full-risk bill was ${K.usd(boulder?.pol?.full ?? 0)}. Homes near Boulder Creek and the canyon mouths pay more than those on higher ground.` },
    { q: 'Is flood insurance cheap in Colorado Springs and Denver?', a: `At the county level, yes. El Paso County, which contains Colorado Springs, had a median single-family bill of ${K.usd(elPaso?.pol?.median ?? 0)} on ${date}, and Denver ${K.usd(denver?.pol?.median ?? 0)}, both below the Colorado median of ${K.usd(pol.median)}. Larimer County, around Fort Collins, was at ${K.usd(larimer?.pol?.median ?? 0)}.` },
    { q: 'Can I buy flood insurance in Colorado right after a wildfire?', a: `Yes, and the wait can be shorter. When flooding on federal land is caused or worsened by post-wildfire conditions, coverage bought by the fire's containment date or up to ${K.num(W.wildfireDays)} days after it takes effect after ${K.num(W.mapRevisionDays)} day instead of ${W.days}. Without those conditions, the usual ${W.days}-day wait applies unless the policy is bought at a loan closing.` },
  ],
  related: ['flood-insurance-waiting-period', 'flood-zones-explained', 'flood-insurance-by-state', 'state:utah'],
});
