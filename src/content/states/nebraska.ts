import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('nebraska');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const co = (name: string) => st.topCounties.find((c) => c.name === name);
const douglas = co('Douglas County');
const dodge = co('Dodge County');
const lanc = co('Lancaster County');
const sarpy = co('Sarpy County');
const cass = co('Cass County');
const ev = st.events[0];
const cl = st.claims;
const evShare = ev && cl ? K.pct(ev.n / cl.n, 0) : '';
const lowBand = st.ranges[0];

export default defineState({
  slug: 'nebraska',
  title: 'Flood Insurance Nebraska 2026: Omaha and the 2019 Floods',
  description: `Flood insurance in Nebraska 2026: median single-family bill on ${date}, Omaha, Fremont and Lincoln counties, and what the March 2019 flood paid.`,
  intro: `On ${date}, ${K.num(pol.n)} Nebraska homes had a federal single-family flood policy, at a median of ${K.usd(pol.median)} a year.`,
  resume: `Nebraska flood insurance is cheaper than the national norm: the ${K.num(pol.n)} single-family policies in force on ${date} had a median yearly bill of ${K.usd(pol.median)}, against ${K.usd(N.policies!.median)} nationwide, and that figure already counts the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee on top of the premium. Most of those homes are close to full price: the median full-risk bill is ${K.usd(pol.full)}, and only ${K.pct(pol.capped, 0)} of policies remain below their full-risk premium. The state's claims file is dominated by one event. The ${ev?.event ?? 'March 2019 flood'} produced ${K.num(ev?.n ?? 0)} paid single-family claims and ${K.usd(ev?.total ?? 0)}, about ${evShare} of every single-family claim the program paid in Nebraska from ${N.claimYears[0]} to ${N.claimYears[1]}. Sarpy County, south of Omaha, had the costliest claims, with a median of ${K.usd(sarpy?.claims?.median ?? 0)}. Cass County is the main exception to the low prices, at ${K.usd(cass?.pol?.median ?? 0)}.`,
  body: (h) => `
<h2>One flood in the record</h2>
<p>In the ${ev?.year ?? 2019} flooding, declared by FEMA as ${h.ext('https://www.fema.gov/disaster/4420', 'disaster 4420')} (severe winter storm, straight-line winds and flooding, from March 9), the federal program paid ${K.num(ev?.n ?? 0)} claims on insured single-family houses. No other event in the ten-year file comes close; it is the only one large enough to be listed for the state. Across the whole period the median paid claim in Nebraska was ${K.usd(cl?.median ?? 0)}, against ${K.usd(N.claims.median)} for the country. In Sarpy County the median claim reached ${K.usd(sarpy?.claims?.median ?? 0)}, and in Cass County ${K.usd(cass?.claims?.median ?? 0)}, for counties whose median bill is close to a thousand dollars.</p>
${h.mini('claims', { t: 'A Nebraska median claim measured in years of bills', p: ['cur'], d: { sx: 'nebraska' } })}
<h2>The river counties around Omaha</h2>
<p>The USGS gauges the Missouri River at Omaha and the Platte near Fremont. Douglas County (Omaha) holds ${K.num(douglas?.pol?.n ?? 0)} policies at a median of ${K.usd(douglas?.pol?.median ?? 0)}. Dodge County, around Fremont, has nearly as many, ${K.num(dodge?.pol?.n ?? 0)}, and the most paid claims among the large counties over the period, ${K.num(dodge?.claims?.n ?? 0)}. Lancaster County, home of Lincoln, is the cheapest of the large counties at ${K.usd(lanc?.pol?.median ?? 0)}, and its policies are almost all at full price.</p>
<p>Cass County, on the Platte and Missouri rivers, is different: ${K.usd(cass?.pol?.median ?? 0)} paid at the median, ${K.usd(cass?.pol?.full ?? 0)} at full risk, with ${K.pct(cass?.pol?.capped ?? 0, 0)} of policies still capped. Renewals there will keep stepping up, by up to ${K.pct(K.P.caps.standard, 0)} a year on a main home's premium.</p>
<h2>High-risk zones that are not expensive</h2>
<p>About ${K.pct((z.A?.n ?? 0) / pol.n, 0)} of Nebraska policies sit in A zones (${K.num(z.A?.n ?? 0)} of ${K.num(pol.n)}), where a federally backed mortgage requires coverage. Yet the A-zone median, ${K.usd(z.A?.median ?? 0)}, is below the X-zone median of ${K.usd(z.X?.median ?? 0)}. FEMA's 2023 price bands point the same way: ${K.pct(lowBand?.share ?? 0, 0)} of the state's single-family policies had a full-risk price under ${K.usd(lowBand?.hi ?? 1000)}, a larger share than in most states. For a buyer in a mapped zone, the ${h.a('buying-a-house-in-a-flood-zone', 'guide to buying in a flood zone')} covers what the lender will ask for. A low price is not a low risk: the bill measures modeled cost per year, and the median Nebraska claim equals many years of the median bill. Upstream, ${h.a('state:south-dakota', 'South Dakota')} shares the Missouri River.</p>
`,
  faqs: [
    { q: 'How much did flood insurance pay Nebraska homeowners after the March 2019 flooding?', a: `The ${ev?.event ?? 'March 2019 flood'} produced ${K.num(ev?.n ?? 0)} paid single-family claims in Nebraska, ${K.usd(ev?.total ?? 0)} for buildings and contents. It was the largest single event in the state's file for ${N.claimYears[0]} to ${N.claimYears[1]}, about ${evShare} of all paid single-family claims. Only insured homes appear in that total.` },
    { q: 'What is the typical flood insurance bill in Omaha?', a: `In Douglas County, which includes Omaha, the median single-family flood bill was ${K.usd(douglas?.pol?.median ?? 0)} a year on ${date}, across ${K.num(douglas?.pol?.n ?? 0)} policies, with a median full-risk bill of ${K.usd(douglas?.pol?.full ?? 0)}. Sarpy County to the south had a median of ${K.usd(sarpy?.pol?.median ?? 0)}. The ZIP lookup narrows the median to a single ZIP code.` },
    { q: 'Why is flood insurance in Cass County, Nebraska higher than in Lincoln?', a: `Cass County homes paid a median ${K.usd(cass?.pol?.median ?? 0)} on ${date}, against ${K.usd(lanc?.pol?.median ?? 0)} in Lancaster County. Its full-risk median is ${K.usd(cass?.pol?.full ?? 0)}, so its houses carry more modeled risk, and ${K.pct(cass?.pol?.capped ?? 0, 0)} of its policies are still rising toward full price under the yearly cap.` },
  ],
  related: ['flood-insurance-by-state', 'average-flood-insurance-claim', 'buying-a-house-in-a-flood-zone', 'state:south-dakota'],
});
