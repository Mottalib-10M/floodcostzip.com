import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('north-dakota');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const nat = N.policies!;
const z = st.polByZone;
const cz = st.claimsByZone;
const pick = (name: string) => st.topCounties.find((c) => c.name === name);
const cass = pick('Cass County');
const ward = pick('Ward County');
const burl = pick('Burleigh County');
const gf = pick('Grand Forks County');
const morton = pick('Morton County');
const barnes = pick('Barnes County');
const lowBand = st.ranges[0];
const bg = K.glide({ current: burl?.pol?.median ?? pol.median, full: burl?.pol?.full ?? pol.full, cap: K.P.caps.standard, fees: K.fees('primary') });

export default defineState({
  slug: 'north-dakota',
  title: 'Flood Insurance North Dakota 2026: Fargo, Bismarck, Minot',
  description: `North Dakota flood insurance 2026: median house bill on ${date}, Cass, Ward and Burleigh county costs, Missouri River gaps to full price and few claims.`,
  intro: `North Dakota counts ${K.num(pol.n)} single-family flood policies; the median bill was ${K.usd(pol.median)} on ${date}, among the lower state medians.`,
  resume: `North Dakota's median single-family flood bill was ${K.usd(pol.median)} a year on ${date}, including the Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee, for ${K.num(pol.n)} policies. That is below the national median of ${K.usd(nat.median)}, and the state as a whole is close to full price: the full-risk median is ${K.usd(pol.full)} and ${K.pct(pol.capped, 0)} of policies are still capped. Three river cities hold most of the market. Cass County, around Fargo on the Red River, has ${K.num(cass?.pol?.n ?? 0)} policies at a median of ${K.usd(cass?.pol?.median ?? 0)}; Ward County, around Minot on the Souris, has ${K.num(ward?.pol?.n ?? 0)}. Bismarck and Mandan are different. In Burleigh and Morton counties, on the Missouri River, the full-risk medians are ${K.usd(burl?.pol?.full ?? 0)} and ${K.usd(morton?.pol?.full ?? 0)}, well above what owners pay now. Paid claims have been few: ${K.num(st.claims?.n ?? 0)} on single-family homes from ${N.claimYears[0]} to ${N.claimYears[1]}.`,
  body: (h) => `
<h2>Cheap bills on the Red River</h2>
<p>Fargo sits on the Red River, known for its spring floods, yet the Cass County bill is low: ${K.usd(cass?.pol?.median ?? 0)} at the median, with a full-risk median of ${K.usd(cass?.pol?.full ?? 0)}. Grand Forks County, further north on the same river, pays ${K.usd(gf?.pol?.median ?? 0)}. Ward County is at ${K.usd(ward?.pol?.median ?? 0)} and only ${K.pct(ward?.pol?.capped ?? 0, 0)} of its policies are capped. More than half of the state's 2023 full-risk prices, ${K.pct(lowBand?.share ?? 0, 0)}, were below ${K.usd(lowBand?.hi ?? 0)}, against ${K.pct(N.ranges[0]?.share ?? 0, 0)} nationally.</p>
${h.mini('monthly', { t: 'A North Dakota flood bill per month', p: ['cur', 'cov'], d: { cur: pol.median } })}
<h2>The Missouri River counties are the exception</h2>
<p>Burleigh County, home to Bismarck, has ${K.num(burl?.pol?.n ?? 0)} policies at a median of ${K.usd(burl?.pol?.median ?? 0)}, and FEMA's 2023 tables named it the county with the widest gap in the state. ${K.pct(burl?.pol?.capped ?? 0, 0)} of its policies are still below full price; a main home at the county medians has ${bg.steps} renewals left at the ${K.pct(K.P.caps.standard, 0)} cap. Morton County across the river, with Mandan, is even further behind, with ${K.pct(morton?.pol?.capped ?? 0, 0)} capped. Barnes County, around Valley City on the Sheyenne, has the highest median bill of the large counties, ${K.usd(barnes?.pol?.median ?? 0)}.</p>
<h2>Minot and the Souris</h2>
<p>Ward County holds the second largest group of policies, ${K.num(ward?.pol?.n ?? 0)}, around Minot, where the Souris River loops through the city. The county median bill, ${K.usd(ward?.pol?.median ?? 0)}, is almost the same as the full-risk median, ${K.usd(ward?.pol?.full ?? 0)}. FEMA's 2023 table shows how far the state has come: the median bill then was ${K.usd(st.current)} statewide against a median full-risk price of ${K.usd(st.risk)}. The OpenFEMA median on ${date} is ${K.usd(pol.median)}, so the remaining gap is now small for most owners outside the Missouri valley.</p>
<h2>Split evenly between zones</h2>
<p>North Dakota is one of the few states where A and X zones hold almost the same number of policies, ${K.num(z.A?.n ?? 0)} and ${K.num(z.X?.n ?? 0)}. Their medians are close too, ${K.usd(z.A?.median ?? 0)} and ${K.usd(z.X?.median ?? 0)}. The claims data has no single large event in the decade, and the ${K.num(st.claims?.n ?? 0)} paid claims had a median of only ${K.usd(st.claims?.median ?? 0)}; ${K.num(cz.X?.n ?? 0)} of them were on X zone homes. With counts this small, most counties have no claim figure of their own in the data. The ${h.a('flood-insurance-cost-per-month', 'cost per month page')} looks at monthly amounts for any bill.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Fargo, North Dakota?', a: `Fargo is in Cass County, where ${K.num(cass?.pol?.n ?? 0)} single-family flood policies had a median bill of ${K.usd(cass?.pol?.median ?? 0)} a year on ${date}. Their full-risk median was ${K.usd(cass?.pol?.full ?? 0)}, so most bills there are near their final level. A house close to the Red River or in a mapped floodplain can pay more than that.` },
    { q: 'Why does Bismarck flood insurance cost more than Fargo?', a: `Burleigh County's median single-family bill was ${K.usd(burl?.pol?.median ?? 0)} on ${date}, against ${K.usd(cass?.pol?.median ?? 0)} in Cass County. FEMA's model sets a full-risk median of ${K.usd(burl?.pol?.full ?? 0)} for Burleigh homes, so ${K.pct(burl?.pol?.capped ?? 0, 0)} are still being raised toward it each year. The difference comes from the risk FEMA assigns to each building, not the city name.` },
    { q: 'How many flood claims have North Dakota homes filed?', a: `From ${N.claimYears[0]} to ${N.claimYears[1]}, the federal program paid ${K.num(st.claims?.n ?? 0)} claims on North Dakota single-family homes, ${K.usd(st.claims?.total ?? 0)} in total, with a median of ${K.usd(st.claims?.median ?? 0)}. That is a small file next to the ${K.num(pol.n)} policies in force, and no single flood dominates it.` },
  ],
  related: ['flood-insurance-cost-per-month', 'flood-insurance-rate-increase', 'state:minnesota', 'state:south-dakota'],
});
