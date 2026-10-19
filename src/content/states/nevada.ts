import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('nevada');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const find = (name: string) => st.topCounties.find((c) => c.name === name);
const nye = find('Nye County');
const washoe = find('Washoe County');
const clark = find('Clark County');
const douglas = find('Douglas County');
const storey = find('Storey County');
const hilary = st.events[0];
const low = st.ranges.find((r) => r.lo === 0);
const perMonth = K.usd(pol.median / 12);

export default defineState({
  slug: 'nevada',
  title: 'Flood Insurance Nevada 2026: Desert Flash Flood Coverage',
  description: `Flood insurance in Nevada 2026: median bill on ${date}, why Nye County has more policies than Las Vegas, Reno area claims, and A versus X zones.`,
  intro: `Only ${K.num(pol.n)} Nevada homes carry a single-family federal flood policy; the median bill was ${K.usd(pol.median)} on ${date}.`,
  resume: `Nevada is one of the smallest flood insurance markets in the country: ${K.num(pol.n)} single-family federal policies on ${date}, with a median yearly bill of ${K.usd(pol.median)} once the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee are added together. That is about ${perMonth} a month. Prices are low and close to their final level, since the median full-risk bill of the same policies is only ${K.usd(pol.full)} and ${K.pct(pol.capped, 0)} remain capped. The zone letter barely moves the price: A-zone homes paid a median ${K.usd(z.A?.median ?? 0)}, homes rated X ${K.usd(z.X?.median ?? 0)}. The surprise is where the policies are. Nye County, which includes Pahrump, holds ${K.num(nye?.pol?.n ?? 0)} of them, more than Clark County around Las Vegas (${K.num(clark?.pol?.n ?? 0)}) or Washoe County around Reno (${K.num(washoe?.pol?.n ?? 0)}). Nevada paid ${K.num(st.claims?.n ?? 0)} single-family claims from ${N.claimYears[0]} to ${N.claimYears[1]}.`,
  body: (h) => `
<h2>A sliver of the national market</h2>
<p>Floods reach insured Nevada homes inside and outside the mapped high-risk zones: of the ${K.num(st.claims?.n ?? 0)} paid single-family claims, ${K.num(st.claimsByZone.X?.n ?? 0)} were on homes rated X, B or C and ${K.num(st.claimsByZone.A?.n ?? 0)} on homes in A zones.</p>
<p>The federal program covers relatively few of them. The ${K.num(pol.n)} single-family policies in force on ${date} are a sliver of the national total, ${K.pct(pol.n / N.policies!.n, 1)}. With so few policies, a county median can rest on a few hundred homes, and the lookup above is the better guide for a single ZIP code.</p>
<h2>Pahrump, Las Vegas and Reno</h2>
<p>Nye County, which includes Pahrump, leads the state on policy count, and the data gives no reason for it. Its median bill was ${K.usd(nye?.pol?.median ?? 0)} on ${date}. Clark County, despite its far larger population, had ${K.num(clark?.pol?.n ?? 0)} policies at a median of ${K.usd(clark?.pol?.median ?? 0)}. Washoe County, along the Truckee River, paid ${K.usd(washoe?.pol?.median ?? 0)} and had the most claims in the state over the period, ${K.num(washoe?.claims?.n ?? 0)}. Douglas County, around Minden and Gardnerville, showed ${K.usd(douglas?.pol?.median ?? 0)}. Lyon County had ${K.num(find('Lyon County')?.pol?.n ?? 0)} policies at a median of ${K.usd(find('Lyon County')?.pol?.median ?? 0)}, Churchill County ${K.num(find('Churchill County')?.pol?.n ?? 0)} at ${K.usd(find('Churchill County')?.pol?.median ?? 0)}, and Carson City ${K.num(find('Carson City, Consolidated Municipality of')?.pol?.n ?? 0)} at ${K.usd(find('Carson City, Consolidated Municipality of')?.pol?.median ?? 0)}.</p>
<p>One small county breaks the pattern. Storey County's ${K.num(storey?.pol?.n ?? 0)} policies had a median bill of ${K.usd(storey?.pol?.median ?? 0)} and a full-risk median of ${K.usd(storey?.pol?.full ?? 0)}, with ${K.pct(storey?.pol?.capped ?? 0, 0)} still capped. ${st.maxGap?.name ?? 'Another rural county'} had the widest current-to-full-risk ratio in FEMA's 2023 table.</p>
${h.mini('monthly', { t: 'A Nevada median bill, per month and per thousand dollars of cover', p: ['cur', 'cov'], d: { cur: pol.median } })}
<h2>Claims: few and modest</h2>
<p>The median paid single-family claim in Nevada was ${K.usd(st.claims?.median ?? 0)}, with A-zone and X-zone claims at almost the same median (${K.usd(st.claimsByZone.A?.median ?? 0)} and ${K.usd(st.claimsByZone.X?.median ?? 0)}). The largest event in the file, ${hilary?.event ?? 'a tropical storm'} in ${hilary?.year ?? N.claimYears[1]}, paid only ${K.num(hilary?.n ?? 0)} claims. FEMA's 2023 bands put ${K.pct(low?.share ?? 0, 0)} of Nevada policies at a full-risk cost under ${K.usd(low?.hi ?? 0)} a year. For a renter in Las Vegas or Reno, the ${h.a('flood-insurance-for-renters', 'renters guide')} covers contents-only policies.</p>
`,
  faqs: [
    { q: 'Why does Nye County, Nevada have the most flood policies in the state?', a: `On ${date}, Nye County held ${K.num(nye?.pol?.n ?? 0)} single-family flood policies, against ${K.num(clark?.pol?.n ?? 0)} in Clark County. The federal data gives counts, not reasons, but a high count usually follows mapped high-risk areas, where federally regulated lenders must require a policy on a mortgage. The median bill in Nye County was ${K.usd(nye?.pol?.median ?? 0)}, close to its full-risk median of ${K.usd(nye?.pol?.full ?? 0)}.` },
    { q: 'How much is flood insurance in Las Vegas?', a: `In Clark County, which includes Las Vegas, the median single-family flood bill was ${K.usd(clark?.pol?.median ?? 0)} a year on ${date}, across ${K.num(clark?.pol?.n ?? 0)} policies. The full-risk median was ${K.usd(clark?.pol?.full ?? 0)}. FEMA prices each home from factors such as distance to flood sources and first floor height, so a ZIP code median says more than the county figure.` },
    { q: 'Does Reno get many flood insurance claims?', a: `Washoe County, which includes Reno, had ${K.num(washoe?.claims?.n ?? 0)} paid single-family claims for losses from ${N.claimYears[0]} to ${N.claimYears[1]}, the most in Nevada, with a median payment of ${K.usd(washoe?.claims?.median ?? 0)}. Its ${K.num(washoe?.pol?.n ?? 0)} policies had a median bill of ${K.usd(washoe?.pol?.median ?? 0)} a year on ${date}.` },
  ],
  related: ['flood-insurance-cost-per-month', 'flood-zones-explained', 'flood-insurance-for-renters', 'state:idaho'],
});
