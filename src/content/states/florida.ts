import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('florida');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const nat = N.policies!;
const z = st.polByZone;
const cz = st.claimsByZone;
const pick = (name: string) => st.topCounties.find((c) => c.name === name);
const dade = pick('Miami-Dade County');
const broward = pick('Broward County');
const lee = pick('Lee County');
const palm = pick('Palm Beach County');
const pinellas = pick('Pinellas County');
const collier = pick('Collier County');
const [helene, ian, milton] = st.events;
const hurricanes = (helene?.total ?? 0) + (ian?.total ?? 0) + (milton?.total ?? 0);
const leeG = K.glide({ current: lee?.pol?.median ?? pol.median, full: lee?.pol?.full ?? pol.full, cap: K.P.caps.standard, fees: K.fees('primary') });
const under1k = st.ranges[0]?.share ?? 0;

export default defineState({
  slug: 'florida',
  title: 'Flood Insurance Florida 2026: Bills After Helene and Ian',
  description: `Florida flood insurance 2026: median home bill on ${date}, county gaps to full-risk price, V zone costs and the claims paid after Helene, Ian, Milton.`,
  intro: `Florida holds ${K.num(pol.n)} single-family flood policies, about ${K.pct(pol.n / nat.n, 0)} of the country; the median bill was ${K.usd(pol.median)} on ${date}.`,
  resume: `The median single-family flood bill in Florida was ${K.usd(pol.median)} a year on ${date}, counting premium, Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee, for ${K.num(pol.n)} policies in force. That is a little under the national median of ${K.usd(nat.median)}, a surprise for the state with the most policies by far. The reason is the mix: ${K.num(z.X?.n ?? 0)} Florida policies sit in X zones, where the median is ${K.usd(z.X?.median ?? 0)} and already close to full price. The southwest Gulf coast is another market. Lee County pays a median ${K.usd(lee?.pol?.median ?? 0)} with a full-risk median of ${K.usd(lee?.pol?.full ?? 0)}, and ${K.pct(lee?.pol?.capped ?? 0, 0)} of its policies are still below full price; Collier County is at ${K.pct(collier?.pol?.capped ?? 0, 0)}. Statewide, ${K.pct(pol.capped, 0)} of policies are capped and the full-risk median is ${K.usd(pol.full)}. Paid single-family claims from ${N.claimYears[0]} to ${N.claimYears[1]} had a median of ${K.usd(st.claims?.median ?? 0)}.`,
  body: (h) => `
<h2>A third of the national program lives here</h2>
<p>No other state comes close to Florida's policy count. The ${K.num(pol.n)} single-family policies in force on ${date} are roughly ${K.pct(pol.n / nat.n, 0)} of all such policies in the country, and they are spread over ${st.counties} counties and ${K.num(st.zips)} ZIP codes. Miami-Dade alone has ${K.num(dade?.pol?.n ?? 0)}, Broward ${K.num(broward?.pol?.n ?? 0)}. Those two southeast counties pay less than the state median, ${K.usd(dade?.pol?.median ?? 0)} and ${K.usd(broward?.pol?.median ?? 0)}, and their bills are near their full-risk level already. Palm Beach County is the clearest case: only ${K.pct(palm?.pol?.capped ?? 0, 0)} of its policies pay less than full price.</p>
<h2>Southwest Florida still has years of increases</h2>
<p>The picture flips on the Gulf side. Lee, Collier and Pinellas counties combine high surge exposure with large gaps. In Lee County the full-risk median is more than twice the bill paid today, and a main home at the county median would need ${leeG.steps} more renewals at the ${K.pct(K.P.caps.standard, 0)} cap to reach it. Pinellas, on the Tampa Bay peninsula, has a median bill of ${K.usd(pinellas?.pol?.median ?? 0)} against ${K.usd(pinellas?.pol?.full ?? 0)} at full risk. FEMA counted ${K.pct(st.exposure.surge, 0)} of Florida's 2023 single-family policies as exposed to storm surge, against ${K.pct(N.exposure.surge, 0)} nationally.</p>
${h.mini('glide', { t: 'Renewals left for a Lee County home at the county medians', p: ['cur', 'full', 'use'], d: { cur: lee?.pol?.median ?? pol.median, full: lee?.pol?.full ?? pol.full } })}
<h2>V zones cost the most and are furthest behind</h2>
<p>Only ${K.num(z.V?.n ?? 0)} Florida policies are rated in coastal high hazard V zones, but their median bill is ${K.usd(z.V?.median ?? 0)}, and their median full-risk price, ${K.usd(z.V?.full ?? 0)}, is about double. A zones carry the bulk of the market, ${K.num(z.A?.n ?? 0)} policies at a median ${K.usd(z.A?.median ?? 0)}. The zone still decides whether a lender requires a policy, as explained in ${h.a('flood-zones-explained', 'flood zones explained')}, even though it no longer sets the price.</p>
${h.mini('zone', { t: 'Florida median bill by zone type', p: ['z'], d: { sx: 'florida', z: 'V' } })}
<h2>Three hurricanes, three very different claim files</h2>
<p>${helene?.event ?? 'The largest storm'} in ${helene?.year ?? ''} produced ${K.num(helene?.n ?? 0)} paid single-family claims, ${ian?.event ?? 'the next'} in ${ian?.year ?? ''} ${K.num(ian?.n ?? 0)}, and ${milton?.event ?? 'the third'} ${K.num(milton?.n ?? 0)}. Together they account for ${K.usd(hurricanes)} paid on Florida homes. Claims are deep here: the state median of ${K.usd(st.claims?.median ?? 0)} compares with ${K.usd(N.claims.median)} for the country, and Pinellas County's median claim reached ${K.usd(pinellas?.claims?.median ?? 0)}. Most of the money went to A zone homes, ${K.num(cz.A?.n ?? 0)} claims at a median of ${K.usd(cz.A?.median ?? 0)}.</p>
<p>The price bands tell the same story from the other end: ${K.pct(under1k, 0)} of Florida's 2023 policies had a full-risk price under ${K.usd(st.ranges[0]?.hi ?? 0)}, while a long tail runs past several thousand dollars on barrier islands. A quote for one house comes from a licensed agent or insurer; the ${h.a('flood-insurance-rate-increase', 'rate increase page')} shows how a capped bill climbs.</p>
`,
  faqs: [
    { q: 'Why is flood insurance in Miami cheaper than in Fort Myers?', a: `Miami-Dade County had a median single-family bill of ${K.usd(dade?.pol?.median ?? 0)} on ${date}, while Lee County, which includes Fort Myers, was at ${K.usd(lee?.pol?.median ?? 0)}. Many Miami-Dade homes are rated in X zones and already pay near their full-risk price. Lee County faces deep Gulf surge, and ${K.pct(lee?.pol?.capped ?? 0, 0)} of its policies are still below full price, so its bills keep rising each year.` },
    { q: 'How much did the federal program pay Florida homes after Hurricane Ian?', a: `For ${ian?.event ?? 'that storm'}, the program paid ${K.num(ian?.n ?? 0)} claims on Florida single-family homes, ${K.usd(ian?.total ?? 0)} for buildings and contents together. It was the second largest event of ${N.claimYears[0]} to ${N.claimYears[1]} in the state, behind ${helene?.event ?? 'Helene'}, which paid ${K.usd(helene?.total ?? 0)}. Amounts are in dollars of the year paid.` },
    { q: 'What share of Florida flood policies already pay the full-risk price?', a: `On ${date}, ${K.pct(pol.capped, 0)} of Florida single-family policies were still below their full-risk premium, so roughly ${K.pct(1 - pol.capped, 0)} were at or above it. The share varies by county: ${K.pct(palm?.pol?.capped ?? 0, 0)} capped in Palm Beach against ${K.pct(collier?.pol?.capped ?? 0, 0)} in Collier. Each declarations page prints the full-risk premium of the policy.` },
  ],
  related: ['flood-insurance-by-state', 'flood-zones-explained', 'flood-insurance-rate-increase', 'average-flood-insurance-claim'],
});
