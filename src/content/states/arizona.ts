import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('arizona');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const nat = N.policies!;
const z = st.polByZone;
const cz = st.claimsByZone;
const pick = (name: string) => st.topCounties.find((c) => c.name === name);
const mari = pick('Maricopa County');
const pima = pick('Pima County');
const yava = pick('Yavapai County');
const coco = pick('Coconino County');
const gap = st.maxGap;
const burn = st.events[0];
const cut2 = st.ranges[1]?.hi ?? 0;
const under2k = st.ranges.filter((r) => r.hi !== null && r.hi <= cut2).reduce((s, r) => s + r.share, 0);

export default defineState({
  slug: 'arizona',
  title: 'Flood Insurance Arizona 2026: Desert Washes and Burn Scars',
  description: `Arizona flood insurance 2026: what single-family policies cost on ${date}, Maricopa and Pima bills, monsoon flash floods, burn scars, the waiting rule.`,
  intro: `Arizona has only ${K.num(pol.n)} single-family flood policies; the median bill on ${date} was ${K.usd(pol.median)}, below the national median.`,
  resume: `In Arizona, the median single-family flood bill was ${K.usd(pol.median)} a year on ${date}, including the Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee, across just ${K.num(pol.n)} policies for a state of several million people. Flood cover is thin here because most flooding comes from short monsoon storms and dry washes, not from rivers or the sea; FEMA counts no surge or coastal erosion exposure at all. The state's bills are already near full price, with a full-risk median of ${K.usd(pol.full)} and ${K.pct(pol.capped, 0)} of policies still capped. Maricopa County, the Phoenix area, holds ${K.num(mari?.pol?.n ?? 0)} policies at a median ${K.usd(mari?.pol?.median ?? 0)}. Mountain counties pay more: Coconino, around Flagstaff, has a median of ${K.usd(coco?.pol?.median ?? 0)}. Claims are rare, ${K.num(st.claims?.n ?? 0)} paid on single-family homes from ${N.claimYears[0]} to ${N.claimYears[1]}, but the median, ${K.usd(st.claims?.median ?? 0)}, equals about ${K.num(Math.round((st.claims?.median ?? 0) / pol.median))} years of the median bill.`,
  body: (h) => `
<h2>A dry state with a flash flood problem</h2>
<p>Arizona's flood risk arrives fast. A summer thunderstorm can drop heavy rain on hardened desert soil and send water down a wash that is dry the rest of the year. That kind of event touches a few streets at a time, which is why the federal claims file holds only ${K.num(st.claims?.n ?? 0)} paid single-family claims for the whole decade, against ${K.num(N.claims.n)} nationally. Losses split evenly between mapped high-risk areas and the rest: ${K.num(cz.A?.n ?? 0)} claims in A zones, ${K.num(cz.X?.n ?? 0)} in X, B or C zones.</p>
<p>One unusual feature: Arizona's X zone policies cost slightly more at the median, ${K.usd(z.X?.median ?? 0)}, than its A zone policies, ${K.usd(z.A?.median ?? 0)}. The zone label no longer drives the premium; the building's elevation, foundation, distance to a channel and replacement cost do.</p>
<h2>Wildfire scars change the rules for a while</h2>
<p>After a large fire, bare slopes shed rain like pavement, and the flood risk below them can rise sharply for several seasons. The claims data for ${burn ? `${burn.year} lists the ${burn.event}` : 'recent years'} among the state's events. Federal law has a specific exception for this case. A new policy normally takes effect ${K.P.waiting.days} days after purchase, but a privately owned property flooded because of post-wildfire conditions on federal land can be covered after one day, if the policy was bought by the fire containment date or within ${K.P.waiting.wildfireDays} days after it (${h.src('usc_4013', '42 U.S.C. 4013(c)')}). National forests cover much of the high country around Flagstaff.</p>
${h.mini('waiting', { t: 'Is a flood covered this many days after buying a policy?', p: ['sit', 'days'], d: { sit: 'standard', days: 20 } })}
<h2>Where Arizona bills are highest</h2>
<p>The high country leads. Coconino County, with Flagstaff and the forests around it, has ${K.num(coco?.pol?.n ?? 0)} policies at a median of ${K.usd(coco?.pol?.median ?? 0)}, and its full-risk median is ${K.usd(coco?.pol?.full ?? 0)}; ${K.pct(coco?.pol?.capped ?? 0, 0)} of those policies are still capped, the largest share among the big counties. Snowmelt and summer storms both run off steep ground there.</p>
<p>Pima County, around Tucson, pays a median ${K.usd(pima?.pol?.median ?? 0)} and Yavapai County, around Prescott, ${K.usd(yava?.pol?.median ?? 0)}. The widest gap in FEMA's 2023 county tables was in ${gap?.name ?? 'a small river county'}, along the Colorado River, where the median full-risk price was ${K.usd(gap?.risk ?? 0)} against ${K.usd(gap?.current ?? 0)} paid, on only ${K.num(gap?.pif ?? 0)} policies. Statewide, ${K.pct(under2k, 0)} of the 2023 full-risk prices were under ${K.usd(cut2)}. For how this compares with other states, see ${h.a('flood-insurance-by-state', 'flood insurance by state')}.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Phoenix?', a: `Most of the Phoenix area is in Maricopa County, where ${K.num(mari?.pol?.n ?? 0)} single-family flood policies had a median bill of ${K.usd(mari?.pol?.median ?? 0)} a year on ${date}. Their full-risk median was ${K.usd(mari?.pol?.full ?? 0)}, so bills there are close to their final level. A house near a wash or in a mapped floodplain can pay more than that median.` },
    { q: 'Does a new Arizona flood policy cover a monsoon flood next week?', a: `Usually not. A new federal policy bought on its own starts after a ${K.P.waiting.days}-day wait. There is no wait when the policy is bought at a mortgage closing, a one-day wait in the ${K.P.waiting.mapRevisionMonths} months after a map change newly puts the home in a high-risk area, and a one-day wait for some floods caused by burn scars on federal land.` },
    { q: 'How many Arizona homes have filed flood insurance claims?', a: `From ${N.claimYears[0]} to ${N.claimYears[1]}, the federal program paid ${K.num(st.claims?.n ?? 0)} claims on Arizona single-family homes, ${K.usd(st.claims?.total ?? 0)} in total, with a median of ${K.usd(st.claims?.median ?? 0)}. Maricopa County accounted for ${K.num(mari?.claims?.n ?? 0)} of them. Small numbers like these swing a lot from one year to the next.` },
  ],
  related: ['flood-insurance-waiting-period', 'flood-zones-explained', 'flood-insurance-by-state', 'state:new-mexico'],
});
