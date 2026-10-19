import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('district-of-columbia');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const nat = N.policies!;
const z = st.polByZone;
const cz = st.claimsByZone;
const lowBand = st.ranges[0];
const ida = st.events.find((e) => e.event.includes('Ida'));
const ophelia = st.events.find((e) => e.event.includes('Ophelia'));
const fiveYears = K.glide({ current: pol.median, full: pol.full, cap: K.P.caps.standard, fees: K.fees('primary') });
const feeShare = (K.P.fees.federalPolicyFee.primary + K.P.fees.hfiaa.primary) / pol.median;

export default defineState({
  slug: 'district-of-columbia',
  title: 'Flood Insurance Washington DC 2026: Low Bills, Small Market',
  description: `Flood insurance Washington, DC 2026: median single-family bill on ${date}, the low full-risk price, A and X zone costs, rare claims and what fees add.`,
  intro: `The District of Columbia has ${K.num(pol.n)} single-family flood policies; the median bill was ${K.usd(pol.median)} on ${date}, among the lowest anywhere.`,
  resume: `In the District of Columbia, a single-family flood policy had a median yearly cost of ${K.usd(pol.median)} on ${date}, premium plus Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee, across only ${K.num(pol.n)} policies. That is far below the national median of ${K.usd(nat.median)}. The District is also almost entirely at full price: the full-risk median is ${K.usd(pol.full)}, the same as the bill, and just ${K.pct(pol.capped, 0)} of policies are still capped, so yearly increases tied to the cap barely apply. Most policies, ${K.num(z.X?.n ?? 0)} of them, are in X zones at a median ${K.usd(z.X?.median ?? 0)}; the ${K.num(z.A?.n ?? 0)} A zone policies cost ${K.usd(z.A?.median ?? 0)}. In FEMA's 2023 tables, ${K.pct(lowBand?.share ?? 0, 0)} of the District's single-family homes had a full-risk price under ${K.usd(lowBand?.hi ?? 0)}. Paid claims numbered ${K.num(st.claims?.n ?? 0)} from ${N.claimYears[0]} to ${N.claimYears[1]}, mostly small.`,
  body: (h) => `
<h2>Why the District pays so little</h2>
<p>Washington sits where the Potomac and Anacostia meet, and parts of the city lie low, but FEMA's model puts the flood risk of most single-family houses there at a low level. FEMA counts no storm surge exposure for the District's 2023 policies, only inland flooding from rivers and heavy rain. Single-family homes are also a small part of the housing: many residents live in apartments and condominiums, which are not in these medians. The result is a small, cheap market: ${K.num(pol.n)} policies, nearly all priced under ${K.usd(lowBand?.hi ?? 0)} a year.</p>
<p>At this price level, fixed charges weigh more. The Federal Policy Fee and the HFIAA surcharge for a main home together come to ${K.usd(K.P.fees.federalPolicyFee.primary + K.P.fees.hfiaa.primary)}, about ${K.pct(feeShare, 0)} of the median bill. The Reserve Fund Assessment adds ${K.pct(K.P.fees.reserveFundRate, 0)} of the discounted premium on top.</p>
<h2>A flat path ahead</h2>
<p>Because the median bill already equals the median full-risk price, a typical District policy has no capped increase left to absorb. Over five renewals at today's rates, the bill would total ${K.usd(fiveYears.total)}. FEMA can still change its rates for everyone, and a renewal paid ${K.P.program.lapseDays} days or more late is rewritten at full price, which here changes little. The few capped policies, ${K.pct(pol.capped, 0)} of the total, are the ones still climbing by up to ${K.pct(K.P.caps.standard, 0)} a year.</p>
${h.mini('five', { t: 'Next five bills for a District home', p: ['cur', 'full', 'use'], d: { cur: pol.median, full: pol.full } })}
<p>The District's bills have barely moved. In FEMA's table of policies in force in August 2023, the median single-family bill was ${K.usd(st.current)} and the median full-risk price ${K.usd(st.risk)}. The OpenFEMA median on ${date}, ${K.usd(pol.median)}, is almost the same. Elsewhere the same comparison shows years of increases; here there was little gap to close.</p>
<h2>Claims: frequent enough to notice, small in size</h2>
<p>The program paid ${K.num(st.claims?.n ?? 0)} single-family claims in the District over the decade, ${K.usd(st.claims?.total ?? 0)} in total, with a median of ${K.usd(st.claims?.median ?? 0)}. Most were in X zones, ${K.num(cz.X?.n ?? 0)} of them, against ${K.num(cz.A?.n ?? 0)} in A zones. No single event stands out: ${ida ? `${ida.event} in ${ida.year} paid ${K.num(ida.n)} claim` : 'the largest storm paid only a handful of claims'}${ophelia ? `, ${ophelia.event} in ${ophelia.year} ${K.num(ophelia.n)}` : ''}. Federal policies cover basements only narrowly, as explained in ${h.a('flood-insurance-coverage-limits', 'coverage limits')}. Renters can buy contents cover alone; see ${h.a('flood-insurance-for-renters', 'flood insurance for renters')}.</p>
`,
  faqs: [
    { q: 'How much is flood insurance for a house in Washington, DC?', a: `The median single-family flood bill in the District was ${K.usd(pol.median)} a year on ${date}, across ${K.num(pol.n)} policies. A zone homes paid a median ${K.usd(z.A?.median ?? 0)} and X zone homes ${K.usd(z.X?.median ?? 0)}. These figures cover single-family houses, not condominium units. A licensed agent or insurer quotes the price of a given home.` },
    { q: 'Will DC flood insurance premiums keep going up each year?', a: `Few will. Only ${K.pct(pol.capped, 0)} of District single-family policies were still below their full-risk premium on ${date}; the rest already pay the full price. Those capped policies rise by up to ${K.pct(K.P.caps.standard, 0)} a year for a main home. All policies can still move when FEMA updates its rates or fees.` },
    { q: 'Do homes in the District of Columbia file flood claims outside flood zones?', a: `Yes, most District claims come from outside the mapped high-risk areas. From ${N.claimYears[0]} to ${N.claimYears[1]}, ${K.num(cz.X?.n ?? 0)} of the ${K.num(st.claims?.n ?? 0)} paid single-family claims were rated in X, B or C zones, with a median of ${K.usd(cz.X?.median ?? 0)}. FEMA rates the District's policies for inland flooding from rain and rivers only.` },
  ],
  related: ['flood-insurance-for-renters', 'flood-insurance-coverage-limits', 'state:maryland', 'state:virginia'],
});
