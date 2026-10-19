import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('iowa');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const cz = st.claimsByZone;
const ia = (name: string) => st.topCounties.find((x) => x.name === name);
const linn = ia('Linn County');
const polk = ia('Polk County');
const scott = ia('Scott County');
const blackHawk = ia('Black Hawk County');
const harrison = ia('Harrison County');
const pott = ia('Pottawattamie County');
const [mar2019, jun2024] = st.events;
const gap = st.maxGap;
const gl = K.glide({ current: linn?.pol?.median ?? pol.median, full: linn?.pol?.full ?? pol.full, cap: K.P.caps.standard, fees: K.fees('primary') });

export default defineState({
  slug: 'iowa',
  title: 'Flood Insurance Iowa 2026: River Towns, Costs and Claims',
  description: `Iowa flood insurance 2026: median single-family bill on ${date}, Cedar Rapids, Des Moines and Davenport costs and claims from the 2019 and 2024 floods.`,
  intro: `On ${date}, ${K.num(pol.n)} Iowa homes had a single-family flood policy, at a median of ${K.usd(pol.median)} a year.`,
  resume: `Flood insurance on an Iowa house had a median total cost of ${K.usd(pol.median)} a year on ${date}, counting the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee, close to the national ${K.usd(N.policies!.median)}. Coverage is sparse: ${K.num(pol.n)} single-family policies across the whole state. The difference between zones is small. A zone homes paid a median of ${K.usd(z.A?.median ?? 0)} and X zone homes ${K.usd(z.X?.median ?? 0)}, and paid claims from the two groups had almost the same median, ${K.usd(cz.A?.median ?? 0)} and ${K.usd(cz.X?.median ?? 0)}. The full-risk median of ${K.usd(pol.full)} sits a little above today's bills, with ${K.pct(pol.capped, 0)} of policies still capped. The largest claim event was ${mar2019?.event ?? 'the 2019 spring flood'} paid ${K.num(mar2019?.n ?? 0)} Iowa claims, the most of any event from ${N.claimYears[0]} to ${N.claimYears[1]}.`,
  body: (h) => `
<h2>Where the policies are</h2>
<p>Iowa's insured homes are spread over many counties rather than gathered in one region. Linn County, which includes Cedar Rapids, where the USGS gauges the ${h.ext('https://waterdata.usgs.gov/monitoring-location/05464500/', 'Cedar River')}, has the most policies, ${K.num(linn?.pol?.n ?? 0)}. Polk County, which includes most of Des Moines, has ${K.num(polk?.pol?.n ?? 0)}; Scott County, which includes Davenport and its Mississippi River gauge, ${K.num(scott?.pol?.n ?? 0)}. Black Hawk County, which includes Waterloo, is smaller in policies but recorded ${K.num(blackHawk?.claims?.n ?? 0)} paid claims over the decade, about as many as Scott.</p>
<p>Scott County's median bill, ${K.usd(scott?.pol?.median ?? 0)} on ${date}, is among the highest of the larger counties. Pottawattamie County, which includes Council Bluffs and borders Omaha's Douglas County, Nebraska, is near the bottom at ${K.usd(pott?.pol?.median ?? 0)}.</p>
<h2>The 2019 flood and Harrison County</h2>
<p>${mar2019?.event ?? 'The March 2019 flood'} paid ${K.num(mar2019?.n ?? 0)} claims in Iowa for ${K.usd(mar2019?.total ?? 0)}. Harrison County, which borders Pottawattamie, has the largest median paid claim of the eight biggest counties over the decade, ${K.usd(harrison?.claims?.median ?? 0)}, against ${K.usd(st.claims?.median ?? 0)} for the state as a whole. ${jun2024 ? `Five years later, ${jun2024.event} in ${jun2024.year} added ${K.num(jun2024.n)} claims.` : ''}</p>
<h2>How long Iowa bills keep rising</h2>
<p>Linn County shows a typical path. Its median bill was ${K.usd(linn?.pol?.median ?? 0)} with a full-risk median of ${K.usd(linn?.pol?.full ?? 0)}; at the ${K.pct(K.P.caps.standard, 0)} yearly cap for a primary residence, that median policy needs ${gl.steps} more renewals of increases. Enter your own declarations page figures below.</p>
${h.mini('glide', { t: 'Renewals left before an Iowa policy reaches full price', p: ['cur', 'full', 'use'], d: { cur: linn?.pol?.median ?? pol.median, full: linn?.pol?.full ?? pol.full, use: 'primary' } })}
<p>Some homes face a much longer climb. ${gap?.name ?? 'One county'}, which includes Decorah, had the widest gap in FEMA's 2023 table: ${K.usd(gap?.current ?? 0)} paid against ${K.usd(gap?.risk ?? 0)} at full risk, on ${K.num(gap?.pif ?? 0)} policies.</p>
<h2>X zones are not dry zones</h2>
<p>Of Iowa's ${K.num(st.claims?.n ?? 0)} paid single-family claims, ${K.num(cz.X?.n ?? 0)} were on homes rated in X, B or C zones, where no lender requires coverage. The ${h.a('flood-zones-explained', 'flood zone guide')} explains how those zones are drawn. Those X zone claims had a median of ${K.usd(cz.X?.median ?? 0)}, no smaller than the claims inside the mapped floodplain.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Cedar Rapids, Iowa?', a: `Linn County, which includes Cedar Rapids, had ${K.num(linn?.pol?.n ?? 0)} single-family flood policies on ${date}, the most in Iowa, with a median yearly bill of ${K.usd(linn?.pol?.median ?? 0)} including fees. The median full-risk bill was ${K.usd(linn?.pol?.full ?? 0)}, and ${K.pct(linn?.pol?.capped ?? 0, 0)} of policies there still pay below it, so increases continue.` },
    { q: 'How many Iowa flood claims did the March 2019 flooding cause?', a: `The federal program paid ${K.num(mar2019?.n ?? 0)} claims on Iowa single-family homes for ${mar2019?.event ?? 'that flood'}, ${K.usd(mar2019?.total ?? 0)} in total, the largest event in the state from ${N.claimYears[0]} to ${N.claimYears[1]}. In Harrison County, the median paid claim over the whole decade was ${K.usd(harrison?.claims?.median ?? 0)}.` },
    { q: 'Is flood insurance in Des Moines cheaper than the Iowa median?', a: `Yes, at the county level. Polk County, which contains Des Moines, had a median single-family bill of ${K.usd(polk?.pol?.median ?? 0)} on ${date}, against ${K.usd(pol.median)} for Iowa. It recorded ${K.num(polk?.claims?.n ?? 0)} paid claims from ${N.claimYears[0]} to ${N.claimYears[1]}, at a median of ${K.usd(polk?.claims?.median ?? 0)}.` },
  ],
  related: ['flood-insurance-rate-increase', 'flood-zones-explained', 'flood-insurance-by-state', 'state:nebraska'],
});
