import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('illinois');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const pick = (name: string) => st.topCounties.find((x) => x.name === name);
const cook = pick('Cook County');
const lake = pick('Lake County');
const dupage = pick('DuPage County');
const will = pick('Will County');
const mchenry = pick('McHenry County');
const madison = pick('Madison County');
const stclair = pick('St. Clair County');
const rock = pick('Rock Island County');
const collar = [cook, lake, dupage, will, mchenry].reduce((s, x) => s + (x?.pol?.n ?? 0), 0);
const top = st.events[0];
const cl = st.claims;

export default defineState({
  slug: 'illinois',
  title: 'Flood Insurance Illinois 2026: Chicago Suburbs and Rivers',
  description: `Flood insurance in Illinois 2026: median single-family bill on ${date} in Cook, DuPage and the river counties, the full-risk price and the claims paid.`,
  intro: `Illinois counts ${K.num(pol.n)} single-family flood policies, with a median bill of ${K.usd(pol.median)} a year on ${date}.`,
  resume: `A federal flood policy on an Illinois single-family home had a median cost of ${K.usd(pol.median)} a year on ${date}, premium plus the Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee. That is a little above the national ${K.usd(N.policies!.median)}, even though Illinois has no coast exposed to surge. The market is small for a state of its size, ${K.num(pol.n)} policies, and about ${K.pct(collar / pol.n, 0)} of them are in Cook County and four collar counties around Chicago. Two in three policies are rated in high-risk A zones, where the median bill was ${K.usd(z.A?.median ?? 0)}; homes in X zones paid ${K.usd(z.X?.median ?? 0)}. Illinois bills are near their model level: the full-risk median would be ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of policies were still below it. Claims are frequent but modest, with a median paid single-family claim of ${K.usd(cl?.median ?? 0)} over ${N.claimYears[0]} to ${N.claimYears[1]}.`,
  body: (h) => `
<h2>Suburban creeks, not big rivers, hold the policies</h2>
<p>Most Illinois policies sit in the Chicago suburbs, along the Des Plaines and Fox rivers and the many small creeks that drain flat, built-up land. Cook County alone had ${K.num(cook?.pol?.n ?? 0)} single-family policies at a median of ${K.usd(cook?.pol?.median ?? 0)}. Lake County, to the north, had ${K.num(lake?.pol?.n ?? 0)} at ${K.usd(lake?.pol?.median ?? 0)}, and DuPage ${K.num(dupage?.pol?.n ?? 0)} at ${K.usd(dupage?.pol?.median ?? 0)}.</p>
<p>The claim record of the metro area is made of many small losses. Cook County had ${K.num(cook?.claims?.n ?? 0)} paid single-family claims over ten years, with a median payment of only ${K.usd(cook?.claims?.median ?? 0)}, less than a quarter of the national median of ${K.usd(N.claims.median)}. Lake County claims were larger, ${K.usd(lake?.claims?.median ?? 0)} at the median.</p>
${h.mini('state', { t: 'Illinois medians and the gap from your bill', p: ['cur'], d: { sx: 'illinois', cur: 0 } })}
<h2>No single storm dominates</h2>
<p>Coastal states usually have one hurricane that explains half their claims. Illinois has nothing like it. ${top ? `The largest event in the file, listed as ${top.event} (${top.year}), paid ${K.num(top.n)} single-family claims, a small slice of the ${K.num(cl?.n ?? 0)} paid in the state over the decade.` : 'No event paid a large share of the claims.'} The rest is spread over many smaller storms and river rises. For a buyer, that means a mapped zone says less about the chance of a claim than local drainage does: ${K.num(st.claimsByZone.X?.n ?? 0)} of the paid claims were on homes rated X, B or C.</p>
<p>FEMA's 2023 bands show the same moderate profile: ${K.pct(st.ranges[0]?.share ?? 0, 0)} of Illinois single-family policies had a full-risk cost under ${K.usd(st.ranges[0]?.hi ?? 0)}, and ${K.pct(st.ranges[1]?.share ?? 0, 0)} fell between ${K.usd(st.ranges[1]?.lo ?? 0)} and ${K.usd(st.ranges[1]?.hi ?? 0)}. Very high prices are rare in the state.</p>
<h2>The Mississippi side of the state</h2>
<p>Downstate, Madison and St. Clair counties across from St. Louis had ${K.num((madison?.pol?.n ?? 0) + (stclair?.pol?.n ?? 0))} policies between them, with medians of ${K.usd(madison?.pol?.median ?? 0)} and ${K.usd(stclair?.pol?.median ?? 0)}. Rock Island County in the Quad Cities was the cheapest large county at ${K.usd(rock?.pol?.median ?? 0)}. The biggest gap in FEMA's 2023 table was in ${st.maxGap?.name ?? 'a river county'}, where the full-risk cost was several times the current one.</p>
<p>Will County is the one collar county with real room to rise: a median of ${K.usd(will?.pol?.median ?? 0)} against ${K.usd(will?.pol?.full ?? 0)} at full risk. Lenders require a policy only in A and V zones; the ${h.a('is-flood-insurance-required', 'flood insurance requirement page')} sets out the rule.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Cook County, Illinois?', a: `On ${date}, the ${K.num(cook?.pol?.n ?? 0)} single-family flood policies in Cook County had a median yearly bill of ${K.usd(cook?.pol?.median ?? 0)}, including the federal fees and assessment. The median full-risk bill was ${K.usd(cook?.pol?.full ?? 0)}, and only ${K.pct(cook?.pol?.capped ?? 0, 0)} of policies were still below it, so most Cook County bills already sit near their full price.` },
    { q: 'Why are Illinois flood claims smaller than the national median?', a: `Over ${N.claimYears[0]} to ${N.claimYears[1]}, the median paid single-family claim in Illinois was ${K.usd(cl?.median ?? 0)}, against ${K.usd(N.claims.median)} nationally. FEMA's 2023 tables show no storm surge exposure in Illinois, so its claims come from rain and rivers. Cook County, with the most policies, had a median claim of just ${K.usd(cook?.claims?.median ?? 0)}.` },
    { q: 'Is flood insurance more expensive in Will County than in DuPage County?', a: `Yes, at the median. Will County policies cost ${K.usd(will?.pol?.median ?? 0)} a year on ${date}, DuPage County policies ${K.usd(dupage?.pol?.median ?? 0)}. Will also has the larger gap to full risk, a median full-risk bill of ${K.usd(will?.pol?.full ?? 0)} against ${K.usd(dupage?.pol?.full ?? 0)} in DuPage, so its bills are more likely to keep rising.` },
  ],
  related: ['flood-insurance-by-state', 'is-flood-insurance-required', 'flood-zones-explained', 'state:missouri'],
});
