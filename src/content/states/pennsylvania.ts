import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('pennsylvania');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const cty = (name: string) => st.topCounties.find((c) => c.name === name);
const luz = cty('Luzerne County');
const mont = cty('Montgomery County');
const bucks = cty('Bucks County');
const phl = cty('Philadelphia County');
const dau = cty('Dauphin County');
const ida = st.events[0];
const isaias = st.events[1];
const cappedPlace = K.place('PA', (x) => x.pol?.capped ?? 0);
const g = K.glide({ current: pol.median, full: pol.full, cap: K.P.caps.standard, fees: K.fees('primary') });

export default defineState({
  slug: 'pennsylvania',
  title: 'Flood Insurance Pennsylvania 2026: River Valley Costs',
  description: `Flood insurance in Pennsylvania 2026: the median bill on ${date}, why it tops the national median, Susquehanna county gaps and the Ida claims paid.`,
  intro: `Pennsylvania's ${K.num(pol.n)} single-family flood policies had a median bill of ${K.usd(pol.median)} on ${date}, more than the country as a whole.`,
  resume: `For a single-family home in Pennsylvania, the median federal flood bill was ${K.usd(pol.median)} a year on ${date}, all charges included, across ${K.num(pol.n)} policies. The national median on the same date was ${K.usd(N.policies!.median)}, so a state with no ocean coast pays more than the average American policyholder. The reason is river flooding priced at full cost: the median full-risk bill of these policies is ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of them have not reached it; only ${K.num(cappedPlace - 1)} other states (counting the District of Columbia) have a larger share still capped. A-zone policies paid a median ${K.usd(z.A?.median ?? 0)} and would pay ${K.usd(z.A?.full ?? 0)} at full risk. At ${K.pct(K.P.caps.standard, 0)} a year, a main home at the state median needs ${g.steps} more renewals to close that gap. ${ida.event}, in ${ida.year}, paid ${K.num(ida.n)} single-family claims here.`,
  body: (h) => `
<h2>Why a landlocked state pays above average</h2>
<p>Pennsylvania's flood risk runs along its valleys: the Susquehanna and its branches, the Delaware, the Schuylkill, and the rivers that meet at Pittsburgh. Towns were built on the flat ground beside them, often long before flood maps existed, and many of those older homes kept discounted rates for decades. The current pricing method removed most of that discount, and the cap now lets it fade a step at a time.</p>
<p>The result is a price ladder that has not finished climbing. In August 2023, FEMA's table put the state's median current cost at ${K.usd(st.current)} and its median full-risk cost at ${K.usd(st.risk)}. By ${date} the median bill had reached ${K.usd(pol.median)}, and the full-risk median of policies in force was ${K.usd(pol.full)}.</p>
${h.mini('glide', { t: 'Renewals left for a Pennsylvania bill', p: ['cur', 'full'], d: { cur: pol.median, full: pol.full, use: 'primary' } })}
<p>Homes outside the mapped floodplain are cheaper but not exempt. Pennsylvania's ${K.num(z.X?.n ?? 0)} policies rated X, B or C paid a median ${K.usd(z.X?.median ?? 0)}, and their full-risk median of ${K.usd(z.X?.full ?? 0)} leaves a smaller climb than in the A zones. Buyers in those zones choose to insure: no federally regulated lender has to require it there.</p>
<h2>Luzerne County and the upper Susquehanna</h2>
<p>Luzerne County, around Wilkes-Barre, has the most policies in the state, ${K.num(luz?.pol?.n ?? 0)}. Its median bill of ${K.usd(luz?.pol?.median ?? 0)} compares with a median full-risk bill of ${K.usd(luz?.pol?.full ?? 0)}, and ${K.pct(luz?.pol?.capped ?? 0, 0)} of its policies are still below full price. Dauphin County, home to Harrisburg, pays more today, ${K.usd(dau?.pol?.median ?? 0)} at the median, and its full-risk median is ${K.usd(dau?.pol?.full ?? 0)}. Further north, ${st.maxGap?.name ?? 'a small upriver county'} had the widest gap between current and full-risk cost in FEMA's 2023 table.</p>
<h2>The Philadelphia suburbs carry the claims</h2>
<p>Claims tell a different story from policy counts. Montgomery County paid ${K.num(mont?.claims?.n ?? 0)} single-family claims over ${N.claimYears[0]} to ${N.claimYears[1]}, at a median of ${K.usd(mont?.claims?.median ?? 0)}, and Bucks County ${K.num(bucks?.claims?.n ?? 0)}. Most came from two storms: ${ida.event} (${K.num(ida.n)} claims, ${K.usd(ida.total)}) and ${isaias?.event ?? 'a second tropical storm'} (${K.num(isaias?.n ?? 0)} claims). Both dropped heavy rain on small creeks that rose within hours. Philadelphia itself has fewer policies, ${K.num(phl?.pol?.n ?? 0)}, at a median of ${K.usd(phl?.pol?.median ?? 0)}.</p>
<p>The ${K.num(st.claimsByZone.X?.n ?? 0)} paid claims rated in X, B or C zones are a reminder that the suburbs flooded well beyond the mapped floodplain. ${h.a('flood-insurance-rate-increase', 'How rate increases work')} explains the yearly steps in detail.</p>
`,
  faqs: [
    { q: 'Why is flood insurance in Pennsylvania higher than the national median?', a: `The median single-family bill in Pennsylvania was ${K.usd(pol.median)} on ${date}, against ${K.usd(N.policies!.median)} nationally. Many insured homes are older buildings on river floodplains, and their full-risk price is high: ${K.usd(pol.full)} at the median. With ${K.pct(pol.capped, 0)} of policies still capped, the state median is expected to keep rising.` },
    { q: 'What does flood insurance cost in Luzerne County, Pennsylvania?', a: `Luzerne County had ${K.num(luz?.pol?.n ?? 0)} single-family policies on ${date}, the largest number in the state, with a median bill of ${K.usd(luz?.pol?.median ?? 0)}. The same homes priced at full risk would have a median bill of ${K.usd(luz?.pol?.full ?? 0)}. Each home's own price depends on its elevation, its distance to the river and its replacement cost.` },
    { q: 'How many flood claims did Hurricane Ida cause in Pennsylvania?', a: `${ida.event} in ${ida.year} led to ${K.num(ida.n)} paid single-family claims in Pennsylvania, ${K.usd(ida.total)} in total for buildings and contents. It is the largest event in the state's claims from ${N.claimYears[0]} to ${N.claimYears[1]}. Montgomery County, north of Philadelphia, paid more claims over the period than any other Pennsylvania county.` },
  ],
  related: ['flood-insurance-rate-increase', 'flood-insurance-by-state', 'average-flood-insurance-claim', 'state:ohio'],
});
