import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('maine');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const at = (name: string) => st.topCounties.find((x) => x.name === name);
const york = at('York County');
const cumb = at('Cumberland County');
const oxford = at('Oxford County');
const hancock = at('Hancock County');
const knox = at('Knox County');
const storm = st.events[0];
const yorkMax = st.maxGap?.name === 'York County';
const gYork = K.glide({ current: york?.pol?.median ?? pol.median, full: york?.pol?.full ?? pol.full, cap: K.P.caps.standard, fees: K.fees('primary') });

export default defineState({
  slug: 'maine',
  title: 'Flood Insurance Maine 2026: York County and the Coast',
  description: `Flood insurance in Maine 2026: median single-family bill on ${date}, full-risk gap in York County and V zones, Portland prices and nor'easter claims.`,
  intro: `Maine has ${K.num(pol.n)} single-family flood policies, and the median bill was ${K.usd(pol.median)} a year on ${date}.`,
  resume: `Maine's single-family flood policies had a median cost of ${K.usd(pol.median)} a year on ${date}, with the premium, Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee all counted. The state has only ${K.num(pol.n)} such policies, and one county holds a large share of them: York County, home of Kittery and Old Orchard Beach, with ${K.num(york?.pol?.n ?? 0)}, about ${K.pct((york?.pol?.n ?? 0) / pol.n, 0)} of the total. York is also where bills are furthest from full price, a median of ${K.usd(york?.pol?.median ?? 0)} against ${K.usd(york?.pol?.full ?? 0)} at full risk. Statewide, the full-risk median is ${K.usd(pol.full)} and ${K.pct(pol.capped, 0)} of policies pay less. FEMA rated ${K.pct(st.exposure.surge, 0)} of single-family policies as exposed to storm surge and ${K.pct(st.exposure.erosion, 0)} to coastal erosion, far above the national ${K.pct(N.exposure.erosion, 0)}. The ${K.num(z.V?.n ?? 0)} homes in V zones paid a median ${K.usd(z.V?.median ?? 0)}.`,
  body: (h) => `
<h2>York County carries the state</h2>
<p>York County has more single-family flood policies than the next five counties combined and most of the claims: ${K.num(york?.claims?.n ?? 0)} paid over ${N.claimYears[0]} to ${N.claimYears[1]}, out of ${K.num(st.claims?.n ?? 0)} in the whole state. ${yorkMax ? 'In FEMA\'s 2023 table it was also the county with the widest ratio of full-risk to current cost, a rare case where the biggest market and the biggest gap are the same place.' : ''}</p>
<p>Two in three York policies, ${K.pct(york?.pol?.capped ?? 0, 0)}, still pay less than their full-risk premium. From the county median, the ${K.pct(K.P.caps.standard, 0)} cap on a primary home leaves about ${gYork.steps} renewals before the bill reaches full risk. A summer cottage rated as a non-primary residence goes up by up to ${K.pct(K.P.caps.higher, 0)} a year instead, with a ${K.usd(K.P.fees.hfiaa.other)} HFIAA surcharge in place of ${K.usd(K.P.fees.hfiaa.primary)}; the ${h.a('flood-insurance-second-home', 'second home guide')} covers that case.</p>
${h.mini('glide', { t: 'Renewals left for a York County bill', p: ['cur', 'full', 'use'], d: { cur: york?.pol?.median ?? pol.median, full: york?.pol?.full ?? pol.full, use: 'primary' } })}
<h2>The V-zone gap</h2>
<p>Maine's V zones, mapped as coastal high hazard areas, show one of the largest gaps of any zone type in any state. Their median bill of ${K.usd(z.V?.median ?? 0)} compares with a full-risk median of ${K.usd(z.V?.full ?? 0)}. In A zones the gap is narrower, ${K.usd(z.A?.median ?? 0)} against ${K.usd(z.A?.full ?? 0)}, and in X zones it has nearly closed at ${K.usd(z.X?.median ?? 0)} against ${K.usd(z.X?.full ?? 0)}.</p>
${h.mini('zone', { t: 'Maine median bill by zone type', p: ['z'], d: { sx: 'maine', z: 'V' } })}
<h2>Portland, Knox, Hancock and Oxford</h2>
<p>Cumberland County, which includes Portland, had ${K.num(cumb?.pol?.n ?? 0)} policies at a median of ${K.usd(cumb?.pol?.median ?? 0)}, close to its full-risk median. Knox and Hancock counties paid ${K.usd(knox?.pol?.median ?? 0)} and ${K.usd(hancock?.pol?.median ?? 0)}. Oxford County, on the New Hampshire line, recorded ${K.num(oxford?.claims?.n ?? 0)} paid claims with a median of ${K.usd(oxford?.claims?.median ?? 0)}, the highest median among the top counties. Lincoln County paid a median ${K.usd(at('Lincoln County')?.pol?.median ?? 0)} and Penobscot County ${K.usd(at('Penobscot County')?.pol?.median ?? 0)}, while Kennebec County's ${K.num(at('Kennebec County')?.pol?.n ?? 0)} policies had a full-risk median of ${K.usd(at('Kennebec County')?.pol?.full ?? 0)} against a current median of ${K.usd(at('Kennebec County')?.pol?.median ?? 0)}. ${storm ? `The one event large enough to stand out in the state's claim file is the ${storm.event} of ${storm.year}, with ${K.num(storm.n)} paid single-family claims.` : ''}</p>
`,
  faqs: [
    { q: 'How much is flood insurance in York County, Maine?', a: `The ${K.num(york?.pol?.n ?? 0)} single-family flood policies in York County had a median yearly bill of ${K.usd(york?.pol?.median ?? 0)} on ${date}, federal charges included. Their median full-risk bill was ${K.usd(york?.pol?.full ?? 0)}, and ${K.pct(york?.pol?.capped ?? 0, 0)} were still below it, so many York County owners face several more years of capped increases.` },
    { q: 'What does flood insurance cost in Portland, Maine?', a: `Cumberland County, which includes Portland, had a median single-family flood bill of ${K.usd(cumb?.pol?.median ?? 0)} a year on ${date}, across ${K.num(cumb?.pol?.n ?? 0)} policies. The median full-risk bill was ${K.usd(cumb?.pol?.full ?? 0)}, so most policies there are near their final price. Statewide, X-zone homes paid a median of ${K.usd(z.X?.median ?? 0)} and V-zone homes ${K.usd(z.V?.median ?? 0)}.` },
    { q: 'How many Maine flood claims did the December 2023 nor\'easter cause?', a: `${storm ? `The federal program paid ${K.num(storm.n)} single-family claims in Maine for the ${storm.event} of ${storm.year}, ${K.usd(storm.total)} for buildings and contents.` : 'That storm is recorded among the paid claims of the state.'} It is the largest single event in the state's file for ${N.claimYears[0]} to ${N.claimYears[1]}, a period with ${K.num(st.claims?.n ?? 0)} paid single-family claims in total.` },
  ],
  related: ['flood-insurance-by-state', 'flood-insurance-second-home', 'flood-zones-explained', 'flood-insurance-rate-increase'],
});
