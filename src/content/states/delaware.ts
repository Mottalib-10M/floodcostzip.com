import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('delaware');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const cz = st.claimsByZone;
const pick = (name: string) => st.topCounties.find((c) => c.name === name);
const sussex = pick('Sussex County');
const nc = pick('New Castle County');
const kent = pick('Kent County');
const ida = st.events[0];
const sussexShare = (sussex?.pol?.n ?? 0) / pol.n;
const years = Math.round((st.claims?.median ?? 0) / pol.median);

export default defineState({
  slug: 'delaware',
  title: 'Flood Insurance Delaware 2026: Sussex County Beach Costs',
  description: `Delaware flood insurance 2026: median house bill on ${date}, Sussex beach towns versus New Castle and Kent, surge exposure, A and X zone prices, claims.`,
  intro: `Delaware's ${K.num(pol.n)} single-family flood policies had a median bill of ${K.usd(pol.median)} on ${date}; most of them are in Sussex County.`,
  resume: `A Delaware single-family flood policy cost a median ${K.usd(pol.median)} a year on ${date}, with the Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee in the total, for ${K.num(pol.n)} policies. The state has only three counties, and one dominates: Sussex County, which includes Rehoboth Beach and Bethany Beach, holds ${K.num(sussex?.pol?.n ?? 0)} policies, about ${K.pct(sussexShare, 0)} of the state, at a median of ${K.usd(sussex?.pol?.median ?? 0)}. FEMA's 2023 tables rate ${K.pct(st.exposure.surge, 0)} of Delaware's single-family policies as exposed to storm surge. Even so, the gap to full price is moderate: the full-risk median is ${K.usd(pol.full)} and ${K.pct(pol.capped, 0)} of policies are still capped. Claims have been small. From ${N.claimYears[0]} to ${N.claimYears[1]}, the program paid ${K.num(st.claims?.n ?? 0)} single-family claims with a median of ${K.usd(st.claims?.median ?? 0)}, roughly ${K.num(years)} years of the median bill.`,
  body: (h) => `
<h2>Three counties, one beach market</h2>
<p>Sussex County alone holds about ${K.pct(sussexShare, 0)} of Delaware's single-family flood policies. Its median single-family bill, ${K.usd(sussex?.pol?.median ?? 0)}, is close to the state figure because it is most of the state. New Castle County, which includes Wilmington, has ${K.num(nc?.pol?.n ?? 0)} policies and a similar median, ${K.usd(nc?.pol?.median ?? 0)}, but a wider gap: its full-risk median is ${K.usd(nc?.pol?.full ?? 0)}, and FEMA's 2023 tables named it the county with the largest gap in the state. Kent County, which includes Dover, is the cheapest, with ${K.num(kent?.pol?.n ?? 0)} policies at ${K.usd(kent?.pol?.median ?? 0)}.</p>
<h2>A zones carry the cost, X zones are already at full price</h2>
<p>The ${K.num(z.A?.n ?? 0)} Delaware policies in A zones pay a median ${K.usd(z.A?.median ?? 0)}, with a full-risk median of ${K.usd(z.A?.full ?? 0)}. That is where yearly increases remain. The ${K.num(z.X?.n ?? 0)} X zone policies pay ${K.usd(z.X?.median ?? 0)}, practically their full-risk level of ${K.usd(z.X?.full ?? 0)}, so their bills move with FEMA's general rate changes rather than with the cap. The ${K.num(z.V?.n ?? 0)} V zone policies, in the coastal high hazard areas, pay ${K.usd(z.V?.median ?? 0)}.</p>
<p>FEMA also rated ${K.pct(st.exposure.erosion, 0)} of the state's 2023 single-family policies as exposed to coastal erosion, against ${K.pct(N.exposure.erosion, 0)} nationally. That share is ${K.dec(st.exposure.erosion / N.exposure.erosion, 1)} times the national one.</p>
<h2>Small claims so far</h2>
<p>Delaware has not had a major flood disaster in the recent claims file. ${ida ? `${ida.event} in ${ida.year} produced the most paid single-family claims, ${K.num(ida.n)}, for ${K.usd(ida.total)} in total.` : ''} The median claim, ${K.usd(st.claims?.median ?? 0)}, is a fraction of the national ${K.usd(N.claims.median)}. New Castle County, though it has far fewer policies than Sussex, accounted for ${K.num(nc?.claims?.n ?? 0)} of the paid claims, against ${K.num(sussex?.claims?.n ?? 0)} in Sussex. Of the ${K.num(st.claims?.n ?? 0)} paid claims, ${K.num(cz.A?.n ?? 0)} were in A zones and ${K.num(cz.X?.n ?? 0)} in X zones.</p>
${h.mini('claims', { t: 'A median Delaware claim measured against your bill', p: ['cur'], d: { sx: 'delaware', cur: pol.median } })}
<p>A small claim record is not a forecast for any one house. Homes in Delaware are valuable, a median replacement cost of ${K.usd(st.medianRcv ?? 0)} in 2023, and the ${h.a('flood-insurance-coverage-limits', 'coverage limits')} of a federal policy stop at ${K.usd(K.P.limits.building)} for the building.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Rehoboth Beach or Bethany Beach?', a: `Both towns are in Sussex County, where the median single-family flood bill was ${K.usd(sussex?.pol?.median ?? 0)} a year on ${date}, across ${K.num(sussex?.pol?.n ?? 0)} policies. Policies in V zones cost more, a statewide median of ${K.usd(z.V?.median ?? 0)}. A single house can sit well above or below these medians; a licensed agent can quote it.` },
    { q: 'Is flood insurance cheaper in Dover than at the Delaware beaches?', a: `At the median, yes. Kent County, which includes Dover, had a median single-family bill of ${K.usd(kent?.pol?.median ?? 0)} on ${date}, against ${K.usd(sussex?.pol?.median ?? 0)} in Sussex County. Only ${K.pct(kent?.pol?.capped ?? 0, 0)} of Kent County policies were still below their full-risk price, so those bills are close to their final level.` },
    { q: 'What was the largest recent flood event for Delaware policyholders?', a: `In the claims for ${N.claimYears[0]} to ${N.claimYears[1]}, ${ida?.event ?? 'the largest event'} led, with ${K.num(ida?.n ?? 0)} paid single-family claims and ${K.usd(ida?.total ?? 0)} in total. That is small next to New Jersey, where ${K.S('new-jersey').events[0]?.event ?? 'its largest storm'} paid ${K.num(K.S('new-jersey').events[0]?.n ?? 0)} single-family claims. Past claims are not a forecast. Over the decade, the program paid ${K.usd(st.claims?.total ?? 0)} on Delaware single-family homes.` },
  ],
  related: ['flood-insurance-coverage-limits', 'average-flood-insurance-claim', 'state:maryland', 'state:new-jersey'],
});
