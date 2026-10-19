import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('utah');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const cz = st.claimsByZone;
const u = (name: string) => st.topCounties.find((x) => x.name === name);
const slc = u('Salt Lake County');
const utahCo = u('Utah County');
const davis = u('Davis County');
const summit = u('Summit County');
const wash = u('Washington County');
const under1k = st.ranges.find((r) => r.lo === 0);
const monthly = pol.median / 12;

export default defineState({
  slug: 'utah',
  title: 'Flood Insurance Utah 2026: Low Bills on a Small Market',
  description: `Flood insurance in Utah 2026: median single-family bill on ${date}, prices in Salt Lake, Davis and Washington counties, X-zone claims and the gap.`,
  intro: `Utah has ${K.num(pol.n)} single-family flood policies; the median bill was ${K.usd(pol.median)} a year on ${date}.`,
  resume: `Utah is one of the least expensive states for federal flood insurance. On ${date}, its ${K.num(pol.n)} single-family policies had a median yearly cost of ${K.usd(pol.median)}, premium, Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee included, well below the national ${K.usd(N.policies!.median)}. That is about ${K.usd(monthly)} a month. The bill is also nearly settled: the full-risk median for the same homes is ${K.usd(pol.full)}, and only ${K.pct(pol.capped, 0)} of policies still pay less. Most Utah policies are in X zones, where no lender requires coverage: ${K.num(z.X?.n ?? 0)} of them at a median of ${K.usd(z.X?.median ?? 0)}, against ${K.num(z.A?.n ?? 0)} in A zones at ${K.usd(z.A?.median ?? 0)}. The claim record is short, ${K.num(st.claims?.n ?? 0)} paid single-family claims in ten years with a median of ${K.usd(st.claims?.median ?? 0)}, and almost all of them were on X-zone homes. Washington County, on the Arizona and Nevada borders, is the one market with a real gap to full risk.`,
  body: (h) => `
<h2>Few policies, few claims</h2>
<p>With ${K.num(pol.n)} single-family policies, Utah has one of the smallest flood markets in the country. FEMA's 2023 table put ${K.pct(under1k?.share ?? 0, 0)} of them at a full-risk cost under ${K.usd(under1k?.hi ?? 0)} a year, a much larger share than the national ${K.pct(N.ranges[0].share, 0)}. The claim file is thin in the same way. Between ${N.claimYears[0]} and ${N.claimYears[1]} the federal program paid ${K.num(st.claims?.n ?? 0)} claims on Utah single-family homes, and ${K.num(cz.X?.n ?? 0)} of them were rated X, B or C. No single storm produced a large group of claims.</p>
<p>In this state, then, the paid losses came mostly from outside the mapped high-risk areas. Paid claims are small, a median of ${K.usd(st.claims?.median ?? 0)} against ${K.usd(N.claims.median)} nationally, and an X-zone bill of ${K.usd(z.X?.median ?? 0)} a year is less than the X-zone median of ${K.usd(N.policies!.zone.X.median)} nationally. Still, a policy in an X zone is bought by choice and waits ${K.P.waiting.days} days before it covers anything.</p>
${h.mini('rank', { t: 'Where a full-risk quote sits among Utah homes', p: ['cost'], d: { sx: 'utah', cost: 1000 } })}
<h2>Salt Lake, Utah, Davis and Weber counties</h2>
<p>Salt Lake County leads with ${K.num(slc?.pol?.n ?? 0)} policies at a median of ${K.usd(slc?.pol?.median ?? 0)}. Utah County, around Provo, paid more, ${K.usd(utahCo?.pol?.median ?? 0)}. Davis County was the cheapest of the large counties at ${K.usd(davis?.pol?.median ?? 0)}, with almost every policy at its full-risk price. Weber County, around Ogden, paid ${K.usd(u('Weber County')?.pol?.median ?? 0)}, and in Cache and Iron counties the medians were ${K.usd(u('Cache County')?.pol?.median ?? 0)} and ${K.usd(u('Iron County')?.pol?.median ?? 0)}, both on small policy counts. Summit County homes paid a median of ${K.usd(summit?.pol?.median ?? 0)}, well above those four counties.</p>
<h2>Washington County is the exception</h2>
<p>In the St. George area, ${K.num(wash?.pol?.n ?? 0)} policies paid a median of ${K.usd(wash?.pol?.median ?? 0)}, the highest median among the large Utah counties, with a full-risk median of ${K.usd(wash?.pol?.full ?? 0)} and ${K.pct(wash?.pol?.capped ?? 0, 0)} of policies still capped. ${st.maxGap?.name === 'Washington County' ? 'It also had the widest ratio of full-risk to current cost in the 2023 table.' : ''} For the monthly cost of a given bill, the ${h.a('flood-insurance-cost-per-month', 'cost per month page')} splits it by month and by coverage.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Salt Lake County?', a: `The ${K.num(slc?.pol?.n ?? 0)} single-family flood policies in Salt Lake County had a median yearly bill of ${K.usd(slc?.pol?.median ?? 0)} on ${date}, including the federal assessment and fees. The median full-risk bill was ${K.usd(slc?.pol?.full ?? 0)}, so the price is nearly settled. Most Utah policies are rated X, where lenders do not require coverage.` },
    { q: 'Is flood insurance worth looking at in Utah outside a flood zone?', a: `The data show where Utah losses happen: of the ${K.num(st.claims?.n ?? 0)} single-family claims paid from ${N.claimYears[0]} to ${N.claimYears[1]}, ${K.num(cz.X?.n ?? 0)} were on homes rated X, B or C. Coverage there is not required by lenders, and X-zone policies had a median bill of ${K.usd(z.X?.median ?? 0)} on ${date}. The decision belongs to the owner.` },
    { q: 'Why is flood insurance higher in St. George, Utah?', a: `St. George is in Washington County, where single-family policies had a median bill of ${K.usd(wash?.pol?.median ?? 0)} on ${date}, above the state median of ${K.usd(pol.median)}. Its full-risk median, ${K.usd(wash?.pol?.full ?? 0)}, is higher still, and ${K.pct(wash?.pol?.capped ?? 0, 0)} of its policies are capped, so bills there are still rising.` },
  ],
  related: ['flood-insurance-by-state', 'flood-insurance-cost-per-month', 'flood-zones-explained', 'state:nevada'],
});
