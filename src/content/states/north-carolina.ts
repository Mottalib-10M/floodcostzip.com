import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('north-carolina');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const cbz = st.claimsByZone;
const c = (name: string) => st.topCounties.find((x) => x.name === name);
const brunswick = c('Brunswick County');
const dare = c('Dare County');
const craven = c('Craven County');
const pender = c('Pender County');
const carteret = c('Carteret County');
const florence = st.events[0];
const helene = st.events.find((e) => e.event.includes('Helene'));
const coast4 = ['Brunswick County', 'Dare County', 'New Hanover County', 'Carteret County'].reduce((s, n) => s + (c(n)?.pol?.n ?? 0), 0);

export default defineState({
  slug: 'north-carolina',
  title: 'Flood Insurance North Carolina 2026: Coast and Mountains',
  description: `Flood insurance in North Carolina 2026: median bill on ${date} for the Outer Banks, Wilmington and the mountains, full-risk prices, Florence and Helene.`,
  intro: `North Carolina has ${K.num(pol.n)} single-family flood policies with a median yearly bill of ${K.usd(pol.median)} on ${date}.`,
  resume: `North Carolina is one of the cheaper coastal states for federal flood insurance. The median single-family policy cost ${K.usd(pol.median)} a year on ${date}, below the national ${K.usd(N.policies!.median)}, and that total includes the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. Four shore counties, Brunswick, Dare, New Hanover and Carteret, hold ${K.num(coast4)} of the ${K.num(pol.n)} policies in the state. Prices split by zone: ${K.usd(z.V?.median ?? 0)} at the median in coastal V zones, ${K.usd(z.A?.median ?? 0)} in A zones and ${K.usd(z.X?.median ?? 0)} in X zones. At full risk the statewide median would be ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of policies were still under that level. Hurricane Florence dominates the claim record of the last ten years: ${K.num(florence?.n ?? 0)} paid single-family claims in ${florence?.year ?? N.claimYears[0]}, for ${K.usd(florence?.total ?? 0)}.`,
  body: (h) => `
<h2>Florence was a river flood</h2>
<p>Of the ${K.num(st.claims?.n ?? 0)} single-family claims the federal program paid in North Carolina between ${N.claimYears[0]} and ${N.claimYears[1]}, ${K.num(florence?.n ?? 0)} came from ${florence?.event ?? 'one hurricane'} in ${florence?.year ?? N.claimYears[0]}, for ${K.usd(florence?.total ?? 0)}. The county that tells the story best is not on the ocean. Craven County, around New Bern on the Neuse River, had ${K.num(craven?.claims?.n ?? 0)} paid claims with a median of ${K.usd(craven?.claims?.median ?? 0)}, the largest claim count among the top counties and a median far above the ${K.usd(dare?.claims?.median ?? 0)} paid in Dare County on the Outer Banks.</p>
<p>The zone record points the same way. Homes rated V, the barrier beaches facing waves, had a median paid claim of ${K.usd(cbz.V?.median ?? 0)}. Homes rated X, outside any mapped high-risk area, had a median of ${K.usd(cbz.X?.median ?? 0)} over ${K.num(cbz.X?.n ?? 0)} claims. On these figures, the typical claim behind the dunes was larger than the typical claim on the beach.</p>
<h2>Beach towns close to full price</h2>
<p>On the barrier islands, bills have mostly caught up with the model. Dare County policies had a median of ${K.usd(dare?.pol?.median ?? 0)} against ${K.usd(dare?.pol?.full ?? 0)} at full risk, and Brunswick County ${K.usd(brunswick?.pol?.median ?? 0)} against ${K.usd(brunswick?.pol?.full ?? 0)}. Pender County, north of Wilmington with low river land behind the coast, is further behind: ${K.usd(pender?.pol?.median ?? 0)} paid, ${K.usd(pender?.pol?.full ?? 0)} at full risk, ${K.pct(pender?.pol?.capped ?? 0, 0)} still capped. Carteret, with ${K.num(carteret?.pol?.n ?? 0)} policies, has the highest median of the big coastal counties at ${K.usd(carteret?.pol?.median ?? 0)}.</p>
${h.mini('rank', { t: 'Where a full-risk quote ranks among North Carolina homes', p: ['cost'], d: { sx: 'north-carolina', cost: 1500 } })}
<h2>X zones are close to settled</h2>
<p>The ${K.num(z.X?.n ?? 0)} North Carolina homes rated X, B or C form the second largest group in the state. Their median bill, ${K.usd(z.X?.median ?? 0)}, is a few dollars from their full-risk median of ${K.usd(z.X?.full ?? 0)}, so the yearly increases in the state come mostly from A and V zones. A-zone homes are where the gap remains: ${K.usd(z.A?.median ?? 0)} paid against ${K.usd(z.A?.full ?? 0)}.</p>
<h2>The mountains after Helene</h2>
<p>${helene ? `${helene.event} in ${helene.year} brought ${K.num(helene.n)} paid single-family claims to the state, ${K.usd(helene.total)} in total, an average near ${K.usd(helene.total / helene.n)} per claim.` : 'A late-season hurricane flooded the western valleys.'} No western county is among the eight with the most policies, so those claims come from a thin base of insured homes, and in FEMA's 2023 table ${st.maxGap?.name ?? 'a mountain county'} had the widest gap between full-risk and current cost. A new policy there waits ${K.P.waiting.days} days before it covers a flood, as described in the ${h.a('flood-insurance-waiting-period', 'waiting period guide')}.</p>
`,
  faqs: [
    { q: 'How much is flood insurance on the Outer Banks?', a: `In Dare County, home of most Outer Banks towns, ${K.num(dare?.pol?.n ?? 0)} single-family policies had a median bill of ${K.usd(dare?.pol?.median ?? 0)} a year on ${date}. That is close to the county's median full-risk bill of ${K.usd(dare?.pol?.full ?? 0)}, so steep increases are less common there than inland. Within the county, the elevation of the lowest floor changes the price of each house.` },
    { q: 'How many North Carolina flood claims did Hurricane Florence produce?', a: `The federal program paid ${K.num(florence?.n ?? 0)} single-family claims in North Carolina for ${florence?.event ?? 'Florence'}, ${K.usd(florence?.total ?? 0)} for buildings and contents. That single storm accounts for about ${K.pct((florence?.n ?? 0) / (st.claims?.n ?? 1), 0)} of the state's paid single-family claims from ${N.claimYears[0]} to ${N.claimYears[1]}, and more than any other storm in that period.` },
    { q: 'Is flood insurance cheaper in Brunswick County than in Pender County?', a: `At the median, yes. Brunswick County policies cost ${K.usd(brunswick?.pol?.median ?? 0)} a year on ${date} and Pender County policies ${K.usd(pender?.pol?.median ?? 0)}. The gap may widen: Pender's median full-risk bill is ${K.usd(pender?.pol?.full ?? 0)}, while Brunswick's is ${K.usd(brunswick?.pol?.full ?? 0)}, so more Pender owners face yearly increases.` },
  ],
  related: ['flood-insurance-by-state', 'flood-insurance-waiting-period', 'average-flood-insurance-claim', 'state:virginia'],
});
