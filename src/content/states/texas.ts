import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('texas');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const harris = st.topCounties[0];
const galv = st.topCounties.find((c) => c.name === 'Galveston County')!;
const harvey = st.events[0];
const share = (x: number) => K.pct(x / (st.claims?.n ?? 1), 0);
const z = st.polByZone;
const g = K.glide({ current: pol.median, full: pol.full, cap: K.P.caps.standard, fees: K.fees('primary') });

export default defineState({
  slug: 'texas',
  title: 'Flood Insurance Texas 2026: Cost by County and ZIP Code',
  description: `Flood insurance in Texas 2026: the median single-family bill by county and ZIP code on ${date}, the full-risk price and what Harvey and other floods paid.`,
  intro: `Texas has ${K.num(pol.n)} single-family flood policies, more than any state but Florida; the median bill was ${K.usd(pol.median)} on ${date}.`,
  resume: `A single-family flood policy in Texas cost a median ${K.usd(pol.median)} a year on ${date}, premium, assessment and fees included, across ${K.num(pol.n)} policies in the federal program. That is close to the national median, but the state hides two very different markets. In V zones, the coastal high hazard areas, the median bill was ${K.usd(z.V.median)}; in X zones, it was ${K.usd(z.X.median)}. Harris County alone carries ${K.num(harris.pol!.n)} policies, about ${K.pct(harris.pol!.n / pol.n, 0)} of the state, the largest county count in the data. Bills are still climbing: ${K.pct(pol.capped, 0)} of Texas policies pay less than their full-risk premium, and the same policies at full risk would have a median bill of ${K.usd(pol.full)}. From the state median, the ${K.pct(K.P.caps.standard, 0)} cap leaves ${g.steps} more renewals of increases.`,
  body: (h) => `
<h2>Harvey and the Texas claims file</h2>
<p>${harvey.event} in ${harvey.year} is the largest flood in the records of the federal program for Texas: ${K.num(harvey.n)} paid claims on single-family homes, ${K.usd(harvey.total)} in total, about ${share(harvey.n)} of all paid single-family claims in the state from ${N.claimYears[0]} to ${N.claimYears[1]}. The file also shows where losses happen beyond the high-risk map: ${K.num(st.claimsByZone.X?.n ?? 0)} of the state's paid single-family claims over those years were rated in X, B or C zones, against ${K.num(st.claimsByZone.A?.n ?? 0)} in A zones.</p>
<p>The policy count leans the same way. In ${h.a('state:texas', 'Texas')}, ${K.num(z.X.n)} single-family policies in force on ${date} were in moderate- or low-risk zones, more than twice the ${K.num(z.A.n)} in high-risk A zones. Outside a high-risk zone a policy is cheaper, ${K.usd(z.X.median)} at the median, but it is bought by choice, and it carries the same ${K.P.waiting.days}-day wait as any new policy: buying when a storm enters the Gulf is too late.</p>
${h.mini('claims', { t: 'What a median Texas claim represents in years of premium', p: ['cur'], d: { sx: 'texas' } })}
<h2>Galveston, Harris and storm surge</h2>
<p>Storm surge is one of the flood types Risk Rating 2.0 assesses. In Galveston County, ${K.num(galv.pol?.n ?? 0)} single-family policies had a median bill of ${K.usd(galv.pol?.median ?? 0)} on ${date}, against ${K.usd(harris.pol!.median)} in Harris County next door. The county line itself does not set the price: FEMA's model can weigh each building's proximity to flood sources, its first floor height and its cost to rebuild.</p>
<p>FEMA's 2023 tables show how much of the state is exposed to each kind of flooding: ${K.pct(st.exposure.surge, 0)} of Texas single-family policies were exposed to storm surge, and ${K.pct(st.exposure.erosion, 0)} to coastal erosion. Every policy is exposed to inland flooding.</p>
<h2>How far Texas bills are from full price</h2>
<p>Under the current pricing method, a policy that paid less than its full-risk premium moves up by at most ${K.pct(K.P.caps.standard, 0)} a year for a main home. Texas started from a low base: in August 2023 the state median bill was ${K.usd(st.current)}, below the national ${K.usd(N.current)}. By ${date} it had reached ${K.usd(pol.median)}. The share still capped, ${K.pct(pol.capped, 0)}, is close to the national ${K.pct(N.policies!.capped, 0)}, so the yearly increases are not over.</p>
<p>The table below ranks the counties with the most policies. The renewals column counts the yearly steps from each county's median bill to its median full-risk bill; your own number depends on your own bill and full-risk premium, both printed on your declarations page. The ${h.a('flood-insurance-rate-increase', 'rate increase calculator')} does that count for one policy.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Houston?', a: `In Harris County, which includes Houston, the median single-family flood bill was ${K.usd(harris.pol!.median)} a year on ${date}, across ${K.num(harris.pol!.n)} policies. A house in an X zone usually pays less than one in an A zone, and the exact price can depend on first floor height and proximity to flood sources. The ZIP lookup above gives the median of a single ZIP code.` },
    { q: 'Do I need flood insurance in Texas if I am not in a flood zone?', a: `No lender requires it outside a high-risk area, but Texas claims show why many owners buy it anyway: from ${N.claimYears[0]} to ${N.claimYears[1]}, ${K.num(st.claimsByZone.X?.n ?? 0)} paid single-family claims in the state were rated in X, B or C zones. The median bill in those zones was ${K.usd(z.X.median)} on ${date}.` },
    { q: 'How much did flood insurance pay after Hurricane Harvey?', a: `The federal program paid ${K.num(harvey.n)} claims on Texas single-family homes for ${harvey.event}, ${K.usd(harvey.total)} in total for buildings and contents. Over ${N.claimYears[0]} to ${N.claimYears[1]}, the median paid single-family claim in Texas was ${K.usd(st.claims!.median)}, against ${K.usd(N.claims.median)} for the whole country. The claims file does not record the depth or length of each flood.` },
  ],
  related: ['flood-insurance-by-state', 'average-flood-insurance-claim', 'flood-zones-explained', 'flood-insurance-rate-increase'],
});
