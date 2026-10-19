import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('wisconsin');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const nat = N.policies!;
const z = st.polByZone;
const cz = st.claimsByZone;
const pick = (name: string) => st.topCounties.find((c) => c.name === name);
const mke = pick('Milwaukee County');
const dane = pick('Dane County');
const fdl = pick('Fond du Lac County');
const wauk = pick('Waukesha County');
const brown = pick('Brown County');
const gap = st.maxGap;
const metro = st.events[0];
const spring = st.events[1];
const lowBand = st.ranges[0];

export default defineState({
  slug: 'wisconsin',
  title: 'Flood Insurance Wisconsin 2026: Rates Near Full Risk Price',
  description: `Wisconsin flood insurance 2026: median bill on ${date}, Milwaukee, Dane and Brown county costs, Great Lakes shore exposure and the ${metro?.year ?? N.claimYears[1]} metro flood.`,
  intro: `Wisconsin has ${K.num(pol.n)} single-family flood policies; their median bill was ${K.usd(pol.median)} on ${date}, a little under the national median.`,
  resume: `Wisconsin's single-family flood policies had a median yearly bill of ${K.usd(pol.median)} on ${date}, counting premium, Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee, across ${K.num(pol.n)} policies. Few states are closer to the end of the price climb. The full-risk median of those homes is ${K.usd(pol.full)}, only slightly above the bill, and ${K.pct(pol.capped, 0)} of policies are still capped, against ${K.pct(nat.capped, 0)} nationally. In most of the state, then, the yearly bill now follows FEMA's general rate changes more than the ${K.pct(K.P.caps.standard, 0)} cap. Policies are spread thinly over ${st.counties} counties: Milwaukee County has the most, ${K.num(mke?.pol?.n ?? 0)}, at a median of ${K.usd(mke?.pol?.median ?? 0)}. Claims climbed in ${metro?.year ?? N.claimYears[1]}, when the ${metro ? 'Milwaukee metro flood' : 'largest event'} produced ${K.num(metro?.n ?? 0)} paid single-family claims, the largest event in the state's ten-year file.`,
  body: (h) => `
<h2>Small numbers, low gap</h2>
<p>For a state of lakes and rivers, Wisconsin buys little flood insurance. The ${K.num(pol.n)} single-family policies in force on ${date} are a tiny share of its houses, and almost every county has only a few hundred. Bills are modest: ${K.pct(lowBand?.share ?? 0, 0)} of the state's 2023 full-risk prices were under ${K.usd(lowBand?.hi ?? 0)}, a larger share than the national ${K.pct(N.ranges[0]?.share ?? 0, 0)}. Fond du Lac County, at the south end of Lake Winnebago, is among the cheapest, ${K.usd(fdl?.pol?.median ?? 0)} at the median, and Waukesha County is at ${K.usd(wauk?.pol?.median ?? 0)}.</p>
${h.mini('state', { t: 'Wisconsin medians against your own bill', p: ['cur'], d: { sx: 'wisconsin', cur: 0 } })}
<h2>Lake Michigan and the Great Lakes shore</h2>
<p>FEMA's model treats the Great Lakes as their own exposure. It flagged ${K.pct(st.exposure.greatLakes, 0)} of Wisconsin's 2023 single-family policies as exposed to Great Lakes flooding, which takes in shoreline homes from Kenosha up to Door County and along Lake Superior. A handful of policies, ${K.num(z.V?.n ?? 0)}, are even rated in V zones, the coastal high hazard label used where waves are a threat. Brown County, on Green Bay, has ${K.num(brown?.pol?.n ?? 0)} policies at a median ${K.usd(brown?.pol?.median ?? 0)}.</p>
<p>On the Mississippi, La Crosse County has ${K.num(pick('La Crosse County')?.pol?.n ?? 0)} policies at a median ${K.usd(pick('La Crosse County')?.pol?.median ?? 0)}, with only ${K.pct(pick('La Crosse County')?.pol?.capped ?? 0, 0)} still capped. Ozaukee County, on the Lake Michigan shore north of Milwaukee, pays more, ${K.usd(pick('Ozaukee County')?.pol?.median ?? 0)} at the median.</p>
<h2>Heavy rain in cities, spring melt on rivers</h2>
<p>The two events at the top of Wisconsin's claims list show both sides of its risk. In ${metro?.year ?? ''}, an urban flood in the Milwaukee area paid ${K.num(metro?.n ?? 0)} claims on single-family homes, ${K.usd(metro?.total ?? 0)} in total. In ${spring?.year ?? ''}, the ${spring?.event ?? 'spring floods'} paid ${K.num(spring?.n ?? 0)} claims. Over the decade, ${K.num(cz.X?.n ?? 0)} of the ${K.num(st.claims?.n ?? 0)} paid claims were on homes outside a mapped high-risk area. Dane County, around Madison, had a median claim of ${K.usd(dane?.claims?.median ?? 0)}, well above its median bill of ${K.usd(dane?.pol?.median ?? 0)}.</p>
<p>The exception to the low gap is ${gap?.name ?? 'one county'}, where FEMA's 2023 tables put the median full-risk price at ${K.usd(gap?.risk ?? 0)}, more than double the ${K.usd(gap?.current ?? 0)} paid then. The ${h.a('flood-insurance-cost-per-month', 'monthly cost page')} breaks a yearly bill into monthly amounts.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Milwaukee County?', a: `The median single-family flood bill in Milwaukee County was ${K.usd(mke?.pol?.median ?? 0)} a year on ${date}, across ${K.num(mke?.pol?.n ?? 0)} policies, with a full-risk median of ${K.usd(mke?.pol?.full ?? 0)}. Only ${K.pct(mke?.pol?.capped ?? 0, 0)} were still capped. The county recorded ${K.num(mke?.claims?.n ?? 0)} paid single-family claims from ${N.claimYears[0]} to ${N.claimYears[1]}.` },
    { q: 'Will Wisconsin flood insurance rates keep rising every year?', a: `For most policies the steep part is over. The state median bill, ${K.usd(pol.median)}, is close to the full-risk median of ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of policies are still capped. Those capped policies can rise up to ${K.pct(K.P.caps.standard, 0)} a year for a main home; the others change with FEMA's rate updates.` },
    { q: 'Do Wisconsin homes near Lake Michigan need flood insurance?', a: `A lender requires it only when the house is in a mapped high-risk area and the loan is federally backed or regulated. FEMA rated ${K.pct(st.exposure.greatLakes, 0)} of Wisconsin's 2023 single-family policies as exposed to Great Lakes flooding. Whether to buy it outside those areas is the owner's choice; a licensed agent can quote it.` },
  ],
  related: ['flood-insurance-cost-per-month', 'is-flood-insurance-required', 'state:minnesota', 'state:michigan'],
});
