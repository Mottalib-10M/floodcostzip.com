import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('south-dakota');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const co = (name: string) => st.topCounties.find((c) => c.name === name);
const union = co('Union County');
const lake = co('Lake County');
const minne = co('Minnehaha County');
const codi = co('Codington County');
const ev = st.events[0];
const cl = st.claims;
const xClaims = st.claimsByZone.X?.n ?? 0;
const aClaims = st.claimsByZone.A?.n ?? 0;
const unionGap = union?.pol ? K.usd(union.pol.full - union.pol.median) : '';
const drop = st.pif > 0 ? K.pct(1 - pol.n / st.pif, 0) : '';

export default defineState({
  slug: 'south-dakota',
  title: 'Flood Insurance South Dakota 2026: Small Market, Big Gaps',
  description: `Flood insurance in South Dakota 2026: median single-family bill on ${date}, the Union County full-risk gap, river claims and the ${ev?.year ?? 2024} June flood.`,
  intro: `Only ${K.num(pol.n)} South Dakota homes carry a federal single-family flood policy; their median bill was ${K.usd(pol.median)} on ${date}.`,
  resume: `South Dakota is one of the smallest flood insurance markets in the country: ${K.num(pol.n)} single-family policies were in force with the federal program on ${date}, and their median total bill was ${K.usd(pol.median)} a year, counting the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. That is above the national median of ${K.usd(N.policies!.median)}, even though the state has no coast. Priced at full risk, the same homes would have a median bill of ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of them still pay less than their full-risk premium. The averages hide one county. In Union County, in the far southeast corner, the median policy pays ${K.usd(union?.pol?.median ?? 0)} while its median full-risk bill is ${K.usd(union?.pol?.full ?? 0)}, and ${K.pct(union?.pol?.capped ?? 0, 0)} of its policies are on the capped path. Paid claims from ${N.claimYears[0]} to ${N.claimYears[1]} had a median of ${K.usd(cl?.median ?? 0)}.`,
  body: (h) => `
<h2>A few thousand policies, spread thin</h2>
<p>FEMA counted ${K.num(st.pif)} single-family policies in South Dakota in its August 2023 table, spread over ${st.counties} counties and ${st.zips} ZIP codes. The OpenFEMA file for ${date} lists ${K.num(pol.n)}. The two sources are built differently, so the comparison is rough, but it points to roughly ${drop} fewer insured homes in three years. With numbers this small, a county median can rest on fewer than a hundred houses: read the county rows below as a direction, not a quote.</p>
<p>No county dominates. Codington County, around Watertown, leads with ${K.num(codi?.pol?.n ?? 0)} policies at a median of ${K.usd(codi?.pol?.median ?? 0)}. Minnehaha County, home of Sioux Falls, follows with ${K.num(minne?.pol?.n ?? 0)} policies and a median of ${K.usd(minne?.pol?.median ?? 0)}.</p>
<h2>Union County is the outlier</h2>
<p>Most South Dakota counties have a median bill within a few dozen dollars of their full-risk median. Union County does not: ${unionGap} separates the two at the median, the widest gap among the counties with the most policies, and FEMA's 2023 figures already named it the county with the largest distance between the average price paid and the average full-risk price. Each renewal there can rise by up to ${K.pct(K.P.caps.standard, 0)} on the premium for a main home, ${K.pct(K.P.caps.higher, 0)} for a second home, until the full price is reached.</p>
${h.mini('rank', { t: 'Where a full-risk quote sits among South Dakota homes', p: ['cost'], d: { sx: 'south-dakota' } })}
<h2>Claims came from outside the high-risk map</h2>
<p>Between ${N.claimYears[0]} and ${N.claimYears[1]}, the program paid ${K.num(cl?.n ?? 0)} single-family claims in the state, ${K.usd(cl?.total ?? 0)} in all. ${K.num(xClaims)} of them were rated in X, B or C zones, nearly as many as the ${K.num(aClaims)} in A zones. Lake County, around Madison, stands out: ${K.num(lake?.claims?.n ?? 0)} paid claims for a county with ${K.num(lake?.pol?.n ?? 0)} policies today. The largest single event in the file is the ${ev?.event ?? 'June flood'} of ${ev?.year ?? ''}, with ${K.num(ev?.n ?? 0)} paid claims and ${K.usd(ev?.total ?? 0)}.</p>
<p>The zone mix shows why. Of the policies in force, ${K.num(z.A?.n ?? 0)} were in A zones, at a median of ${K.usd(z.A?.median ?? 0)}, and ${K.num(z.X?.n ?? 0)} in X zones, at ${K.usd(z.X?.median ?? 0)}. The two medians are almost equal, which says the price follows the house and the river more than the letter on the map. The ${h.a('flood-zones-explained', 'flood zone guide')} explains how those letters are drawn, and ${h.a('state:nebraska', 'Nebraska')} shows a similar river pattern downstream.</p>
`,
  faqs: [
    { q: 'Why is flood insurance in Union County, South Dakota so far from its full price?', a: `On ${date}, the median Union County policy paid ${K.usd(union?.pol?.median ?? 0)} a year against a median full-risk bill of ${K.usd(union?.pol?.full ?? 0)}. Many of its homes were rated well below their risk before the current pricing method, and the law limits each yearly premium increase, so ${K.pct(union?.pol?.capped ?? 0, 0)} of policies there are still climbing toward full price.` },
    { q: 'How much does a flood policy cost in Sioux Falls?', a: `Minnehaha County, which holds most of Sioux Falls, had ${K.num(minne?.pol?.n ?? 0)} single-family policies on ${date}, with a median yearly bill of ${K.usd(minne?.pol?.median ?? 0)} and a median full-risk bill of ${K.usd(minne?.pol?.full ?? 0)}. A single house can be far from that median: elevation, foundation and distance to the Big Sioux River move the price. The ZIP lookup gives a narrower median.` },
    { q: 'Did the June 2024 flooding in South Dakota lead to many flood insurance claims?', a: `The ${ev?.event ?? 'June flood'} of ${ev?.year ?? ''} produced ${K.num(ev?.n ?? 0)} paid single-family claims in South Dakota, ${K.usd(ev?.total ?? 0)} for buildings and contents, the largest event in the state's file for ${N.claimYears[0]} to ${N.claimYears[1]}. The number is small because few homes were insured; claims from ${N.claimYears[1]} are still being settled.` },
  ],
  related: ['flood-insurance-by-state', 'flood-zones-explained', 'flood-insurance-rate-increase', 'state:nebraska'],
});
