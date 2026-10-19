import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('vermont');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const vt = (name: string) => st.topCounties.find((x) => x.name === name);
const washington = vt('Washington County');
const windsor = vt('Windsor County');
const chittenden = vt('Chittenden County');
const rutland = vt('Rutland County');
const july = st.events[0];
const gap = st.maxGap;
const grew = st.topCounties.filter((x) => (x.pol?.n ?? 0) > x.pif);
const ahead = K.STATES.filter((x) => (x.pol?.median ?? 0) > pol.median).length;

export default defineState({
  slug: 'vermont',
  title: 'Flood Insurance Vermont 2026: River Valley Costs and Claims',
  description: `Vermont flood insurance 2026: median single-family bill on ${date}, Washington and Windsor county costs and what the July 2023 flood paid to homeowners.`,
  intro: `Vermont had ${K.num(pol.n)} single-family flood policies on ${date}, with a median yearly bill of ${K.usd(pol.median)}, high for an inland state.`,
  resume: `In Vermont, a single-family flood policy had a median total cost of ${K.usd(pol.median)} a year on ${date}: premium, Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee. Only ${K.num(ahead)} states had a higher median, and Vermont has no coast at all. The zone mix shows where the cost sits: A zone policies, ${K.num(z.A?.n ?? 0)} of the ${K.num(pol.n)}, had a median bill of ${K.usd(z.A?.median ?? 0)}, against ${K.usd(z.X?.median ?? 0)} in X zones. The full-risk median is ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of policies still pay less than their full-risk premium. The claims record is dominated by one summer: ${july?.event ?? 'the July 2023 flood'} in ${july?.year ?? N.claimYears[1]} paid ${K.num(july?.n ?? 0)} claims, ${K.pct((july?.n ?? 0) / (st.claims?.n ?? 1), 0)} of all single-family claims paid in the state from ${N.claimYears[0]} to ${N.claimYears[1]}, at a state median of ${K.usd(st.claims?.median ?? 0)}.`,
  body: (h) => `
<h2>Rivers, not tides</h2>
<p>The USGS gauges the Winooski, the Lamoille, the Otter Creek and the White River, among other Vermont streams, and FEMA's 2023 tables count every Vermont single-family policy as exposed to inland flooding. The flood that matters for insurance here is a river flood, not a tidal one.</p>
<p>Washington County, home to Montpelier and Barre, has the highest median bill of the eight largest counties, ${K.usd(washington?.pol?.median ?? 0)} on ${date}, and a full-risk median of ${K.usd(washington?.pol?.full ?? 0)}. Windsor County follows with ${K.num(windsor?.pol?.n ?? 0)} policies at ${K.usd(windsor?.pol?.median ?? 0)}. Chittenden County, around Burlington, is lower at ${K.usd(chittenden?.pol?.median ?? 0)}.</p>
<h2>The July 2023 flood</h2>
<p>FEMA's ${h.ext('https://www.fema.gov/disaster/4720', 'disaster declaration DR-4720')} gives an incident period of July 7 to 21, 2023. ${july?.event ?? 'The July 2023 flood'} paid ${K.num(july?.n ?? 0)} claims on Vermont single-family homes, ${K.usd(july?.total ?? 0)} in all. Washington County alone recorded ${K.num(washington?.claims?.n ?? 0)} paid claims over the decade, at a median of ${K.usd(washington?.claims?.median ?? 0)}. Rutland County had ${K.num(rutland?.claims?.n ?? 0)}.</p>
<p>Comparing the ${date} policy file with FEMA's August 2023 count, a different source, some counties now show more policies: ${grew.length ? grew.map((x) => x.name).join(', ') : 'none of the larger ones'}. A policy bought after a flood still waits ${K.P.waiting.days} days before it can pay.</p>
<h2>Insured outside the mapped floodplain</h2>
<p>Not every Vermont policy was bought for a mortgage: ${K.num(z.X?.n ?? 0)} of its single-family policies, ${K.pct((z.X?.n ?? 0) / pol.n, 0)}, are rated in X zones, where a lender does not require coverage. For an inland state far from any surge, that is a sizable group. Over the claim years, ${K.num(st.claimsByZone.X?.n ?? 0)} claims went to X zone homes, at a median of ${K.usd(st.claimsByZone.X?.median ?? 0)}, not far below the A zone median of ${K.usd(st.claimsByZone.A?.median ?? 0)}.</p>
<h2>What a policy pays on a large loss</h2>
<p>A federal policy on a house covers up to ${K.usd(K.P.limits.building)} for the building and up to ${K.usd(K.P.limits.contents)} for contents, after a deductible of up to ${K.usd(K.P.deductibles.residentialMax)} chosen at purchase. Contents coverage is a separate choice. Try a large loss below to see the split between what the policy pays and what stays with the owner.</p>
${h.mini('coverage', { t: 'What a Vermont policy would pay on a major flood', p: ['b', 'c', 'd'], d: { d: K.P.deductibles.residentialDefault } })}
<p>${gap?.name ?? 'One county'} had the widest gap in FEMA's 2023 table, ${K.usd(gap?.current ?? 0)} paid against ${K.usd(gap?.risk ?? 0)} at full risk, on ${K.num(gap?.pif ?? 0)} policies. The ${h.a('flood-insurance-coverage-limits', 'coverage limits guide')} sets out the limits and deductibles in detail.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Montpelier, Vermont?', a: `Washington County, which includes Montpelier, had ${K.num(washington?.pol?.n ?? 0)} single-family flood policies on ${date}, with a median yearly bill of ${K.usd(washington?.pol?.median ?? 0)} including fees, the highest among Vermont's eight largest counties. The median full-risk bill was ${K.usd(washington?.pol?.full ?? 0)}, so many policies there still face yearly increases.` },
    { q: 'How many Vermont flood claims came from the July 2023 flood?', a: `The federal program paid ${K.num(july?.n ?? 0)} claims on Vermont single-family homes for ${july?.event ?? 'that flood'} in ${july?.year ?? N.claimYears[1]}, ${K.usd(july?.total ?? 0)} for buildings and contents. That is ${K.pct((july?.n ?? 0) / (st.claims?.n ?? 1), 0)} of all paid single-family claims in the state from ${N.claimYears[0]} to ${N.claimYears[1]}, which totaled ${K.num(st.claims?.n ?? 0)}.` },
    { q: 'Why is flood insurance expensive in Vermont without a coast?', a: `Of Vermont's ${K.num(pol.n)} single-family policies, ${K.num(z.A?.n ?? 0)} are rated in high-risk A zones, where the median bill was ${K.usd(z.A?.median ?? 0)} on ${date}, against ${K.usd(z.X?.median ?? 0)} in X zones, where no lender has to require a policy. Only ${K.num(ahead)} states had a higher statewide median than Vermont's ${K.usd(pol.median)}.` },
  ],
  related: ['flood-insurance-coverage-limits', 'flood-insurance-waiting-period', 'flood-insurance-by-state', 'state:new-hampshire'],
});
