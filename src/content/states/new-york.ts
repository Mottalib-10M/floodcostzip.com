import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('new-york');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const cty = (name: string) => st.topCounties.find((c) => c.name === name);
const nassau = cty('Nassau County');
const suffolk = cty('Suffolk County');
const westch = cty('Westchester County');
const broome = cty('Broome County');
const boroughs = ['Queens County', 'Kings County', 'Richmond County', 'Bronx County'].map(cty);
const cityPol = boroughs.reduce((s, c) => s + (c?.pol?.n ?? 0), 0);
const island = (nassau?.pol?.n ?? 0) + (suffolk?.pol?.n ?? 0);
const ida = st.events[0];
const sept = st.events[1];
const cl = st.claims;

export default defineState({
  slug: 'new-york',
  title: 'Flood Insurance New York 2026: Long Island to the Hudson',
  description: `Flood insurance in New York 2026: median single-family bill on ${date} for Long Island, the five boroughs and upstate, full-risk gap and Ida claims.`,
  intro: `New York counts ${K.num(pol.n)} single-family flood policies, and the median one cost ${K.usd(pol.median)} a year on ${date}.`,
  resume: `On ${date}, the median single-family flood policy in New York State cost ${K.usd(pol.median)} a year, counting the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. That is above the national median of ${K.usd(N.policies!.median)}, and it is not the end point: priced at full risk, the same ${K.num(pol.n)} policies would have a median bill of ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of them still pay less than that. Long Island dominates the market. Nassau and Suffolk together hold ${K.num(island)} policies, about ${K.pct(island / pol.n, 0)} of the state, with medians of ${K.usd(nassau?.pol?.median ?? 0)} and ${K.usd(suffolk?.pol?.median ?? 0)}. High-risk A zones carry a median of ${K.usd(z.A?.median ?? 0)}, moderate and low-risk zones ${K.usd(z.X?.median ?? 0)}. FEMA rated ${K.pct(st.exposure.surge, 0)} of the state's single-family policies as exposed to storm surge.`,
  body: (h) => `
<h2>Long Island buys, the Hudson Valley claims</h2>
<p>Policy counts and claim counts point to different parts of the state. Nassau County has the most single-family policies, ${K.num(nassau?.pol?.n ?? 0)}, yet Westchester County, with only ${K.num(westch?.pol?.n ?? 0)}, recorded more paid claims over ${N.claimYears[0]} to ${N.claimYears[1]}: ${K.num(westch?.claims?.n ?? 0)} against ${K.num(nassau?.claims?.n ?? 0)}. The median Westchester claim, ${K.usd(westch?.claims?.median ?? 0)}, was also larger than the Nassau one, ${K.usd(nassau?.claims?.median ?? 0)}.</p>
<p>Most of that gap traces back to one storm. ${ida?.event ?? 'A single hurricane'} in ${ida?.year ?? N.claimYears[0]} produced ${K.num(ida?.n ?? 0)} paid single-family claims in New York, worth ${K.usd(ida?.total ?? 0)}, which is roughly ${K.pct((ida?.n ?? 0) / (cl?.n ?? 1), 0)} of the ${K.num(cl?.n ?? 0)} claims paid statewide in ten years. Its damage came from rain falling inland, not from the sea, and ${K.num(st.claimsByZone.X?.n ?? 0)} of the state's paid claims over the decade were on homes rated X, B or C.</p>
<p>Westchester bills reflect a market already close to its model price: a median of ${K.usd(westch?.pol?.median ?? 0)} against ${K.usd(westch?.pol?.full ?? 0)} at full risk, with ${K.pct(westch?.pol?.capped ?? 0, 0)} of policies still capped.</p>
<h2>The five boroughs</h2>
<p>Queens, Brooklyn (Kings County), Staten Island (Richmond County) and the Bronx hold ${K.num(cityPol)} single-family policies among them, fewer than Suffolk County alone. Queens is the largest, with a median of ${K.usd(boroughs[0]?.pol?.median ?? 0)}. In ${sept?.year ?? N.claimYears[1]}, ${sept?.event ?? 'a late-September rainstorm'} added ${K.num(sept?.n ?? 0)} paid claims across the state, the second largest event of the decade in the state.</p>
${h.mini('zone', { t: 'New York median bill by flood zone type', p: ['z'], d: { sx: 'new-york', z: 'A' } })}
<h2>Room left to rise on the South Shore</h2>
<p>The full-risk median in Suffolk County is ${K.usd(suffolk?.pol?.full ?? 0)}, far above the ${K.usd(suffolk?.pol?.median ?? 0)} its owners paid at the median, and ${K.pct(suffolk?.pol?.capped ?? 0, 0)} of its policies are below that line. The Nassau numbers tell the same story at ${K.usd(nassau?.pol?.full ?? 0)}. Barrier beaches, bay-front streets and low ground near tidal wetlands are where the coastal V and A zones sit: the ${K.num(z.V?.n ?? 0)} V-zone homes in the state paid a median ${K.usd(z.V?.median ?? 0)}. Each renewal moves a capped premium up by at most ${K.pct(K.P.caps.standard, 0)} for a primary home, so these gaps close over several years rather than at once.</p>
${h.mini('five', { t: 'Five Suffolk County bills on the yearly cap', p: ['cur', 'full'], d: { cur: suffolk?.pol?.median ?? pol.median, full: suffolk?.pol?.full ?? pol.full, use: 'primary' } })}
<h2>Upstate rivers</h2>
<p>Farther north, the Susquehanna basin around Binghamton is the main cluster. Broome County had ${K.num(broome?.pol?.n ?? 0)} policies and ${K.pct(broome?.pol?.capped ?? 0, 0)} of them below full risk, the highest share among the eight largest counties. In FEMA's 2023 table, ${st.maxGap?.name ?? 'a Mohawk Valley county'} showed the widest ratio between full-risk and current cost. The ${h.a('flood-insurance-rate-increase', 'rate increase page')} explains how a gap like that is closed one renewal at a time.</p>
`,
  faqs: [
    { q: 'How much is flood insurance on Long Island?', a: `On ${date}, the median single-family flood bill was ${K.usd(nassau?.pol?.median ?? 0)} in Nassau County and ${K.usd(suffolk?.pol?.median ?? 0)} in Suffolk County, premium and federal charges included. Both counties have many policies still below their full-risk price, so renewals keep rising for a large share of owners. A licensed agent can quote a given house, whose price depends on its elevation and distance to the water.` },
    { q: 'Why did Westchester County have so many flood claims?', a: `Westchester recorded ${K.num(westch?.claims?.n ?? 0)} paid single-family claims between ${N.claimYears[0]} and ${N.claimYears[1]}, more than any other New York county, with a median payment of ${K.usd(westch?.claims?.median ?? 0)}. Most came from heavy rain, above all ${ida?.event ?? 'the remnants of Ida'} in ${ida?.year ?? N.claimYears[0]}, which overwhelmed streams and drains far from the coast.` },
    { q: 'What does flood insurance cost in Queens and Brooklyn?', a: `Queens County policies had a median yearly bill of ${K.usd(boroughs[0]?.pol?.median ?? 0)} on ${date}, and Kings County (Brooklyn) policies ${K.usd(boroughs[1]?.pol?.median ?? 0)}. Both figures cover single-family homes in the federal program. Brooklyn bills sit near their full-risk median of ${K.usd(boroughs[1]?.pol?.full ?? 0)}; Queens is further away at ${K.usd(boroughs[0]?.pol?.full ?? 0)}.` },
  ],
  related: ['flood-insurance-by-state', 'flood-zones-explained', 'flood-insurance-rate-increase', 'average-flood-insurance-claim'],
});
