import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('connecticut');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const find = (name: string) => st.topCounties.find((x) => x.name === name);
const fairfield = find('Fairfield County');
const newHaven = find('New Haven County');
const newLondon = find('New London County');
const middlesex = find('Middlesex County');
const hartford = find('Hartford County');
const coastPol = [fairfield, newHaven, newLondon, middlesex].reduce((t, x) => t + (x?.pol?.n ?? 0), 0);
const band3 = st.ranges.find((r) => r.lo === 3000);
const over3k = st.ranges.filter((r) => r.lo >= (band3?.lo ?? 0)).reduce((t, r) => t + r.share, 0);
const natOver3k = N.ranges.filter((r) => r.lo >= (band3?.lo ?? 0)).reduce((t, r) => t + r.share, 0);
const ida = st.events[0];
const higher = K.STATES.filter((x) => (x.pol?.median ?? 0) > pol.median).length;
const rankText = higher === 0 ? 'the highest state median in the country' : `behind only ${K.num(higher)} other states`;
const elsa = st.events[1];

export default defineState({
  slug: 'connecticut',
  title: 'Flood Insurance Connecticut 2026: Long Island Sound Costs',
  description: `Flood insurance in Connecticut 2026: median single-family bill on ${date}, Fairfield and New Haven county costs, V zone prices and the gap to full risk.`,
  intro: `Connecticut's ${K.num(pol.n)} single-family flood policies had a median bill of ${K.usd(pol.median)} on ${date}, ${rankText}.`,
  resume: `Flood insurance on a Connecticut house is expensive by national standards. The median single-family bill was ${K.usd(pol.median)} a year on ${date}, all charges included (premium, Reserve Fund Assessment, HFIAA surcharge, Federal Policy Fee), against ${K.usd(N.policies!.median)} for the country. The ${K.num(pol.n)} policies are concentrated on Long Island Sound: the four shoreline counties, Fairfield, New Haven, Middlesex and New London, hold ${K.pct(coastPol / pol.n, 0)} of them. Rates are not done rising. At full risk the median bill would be ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of policies pay less than their full-risk premium. The waterfront V zones are the costliest part of the market, at a median of ${K.usd(z.V?.median ?? 0)} and a full-risk median of ${K.usd(z.V?.full ?? 0)}. In FEMA's 2023 table, ${K.pct(over3k, 0)} of Connecticut's single-family policies had a full-risk cost of ${K.usd(band3?.lo ?? 0)} a year or more, against ${K.pct(natOver3k, 0)} nationally.`,
  body: (h) => `
<h2>Eight counties, one shoreline</h2>
<p>Connecticut has only eight counties, and the county table below lists all of them. Fairfield County, from Greenwich to Bridgeport, is the core of the market with ${K.num(fairfield?.pol?.n ?? 0)} policies. Inland Hartford County, crossed by the Connecticut River, has ${K.num(hartford?.pol?.n ?? 0)}, at a lower median of ${K.usd(hartford?.pol?.median ?? 0)}.</p>
<p>Along the Sound, the shore is a chain of coves, salt marshes and low beach communities rather than barrier islands. FEMA's 2023 exposure figures put ${K.pct(st.exposure.surge, 0)} of single-family policies in reach of storm surge and ${K.pct(st.exposure.erosion, 0)} in reach of coastal erosion, one of the highest erosion shares among coastal states.</p>
<h2>Why the price bands sit so high</h2>
<p>The state's full-risk prices spread far up the scale. A home that pays ${K.usd(band3?.lo ?? 0)} a year at full risk would be unusual in most states; here it is common. Use the mini-calculator below with a quote or with the full-risk premium printed on a declarations page to see where it falls.</p>
${h.mini('rank', { t: 'How a Connecticut full-risk price ranks in the state', p: ['cost'], d: { sx: 'connecticut', cost: band3?.lo ?? pol.full } })}
<p>Home values play a part. A policy's building limit stops at ${K.usd(K.P.limits.building)}, and the median replacement cost of insured Connecticut houses in the 2023 table was ${K.usd(st.medianRcv)}, so many owners buy the maximum building coverage, which pushes the premium up.</p>
<h2>New Haven: the largest gap</h2>
<p>New Haven County, not a small rural county, shows the widest gap between FEMA's 2023 current and full-risk medians: ${K.usd(newHaven?.current ?? 0)} against ${K.usd(newHaven?.risk ?? 0)}. On ${date}, its ${K.num(newHaven?.pol?.n ?? 0)} policies had a median bill of ${K.usd(newHaven?.pol?.median ?? 0)} and a full-risk median of ${K.usd(newHaven?.pol?.full ?? 0)}, with ${K.pct(newHaven?.pol?.capped ?? 0, 0)} still capped.</p>
<h2>Rain, not surge, in the recent claims</h2>
<p>From ${N.claimYears[0]} to ${N.claimYears[1]}, Connecticut had ${K.num(st.claims?.n ?? 0)} paid single-family claims, a small number for its policy count. The largest event was ${ida?.event ?? 'a tropical storm'} in ${ida?.year ?? N.claimYears[0]}, with ${K.num(ida?.n ?? 0)} claims${elsa ? `, followed by ${elsa.event} the same summer with ${K.num(elsa.n)}` : ''}. Both brought rain more than surge. The ${h.a('average-flood-insurance-claim', 'average claim page')} puts those figures beside other states.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Fairfield County, Connecticut?', a: `Fairfield County had ${K.num(fairfield?.pol?.n ?? 0)} single-family flood policies on ${date}, the most in the state, with a median yearly bill of ${K.usd(fairfield?.pol?.median ?? 0)} including fees. The median full-risk bill was ${K.usd(fairfield?.pol?.full ?? 0)}. Houses on the water in V zones pay much more than the county median, and inland homes in X zones much less.` },
    { q: 'Why is flood insurance so expensive on the Connecticut shore?', a: `FEMA's rating weighs the distance to the Sound, the elevation of the lowest floor, surge and erosion exposure and the cost to rebuild. Connecticut shore homes score high on several: ${K.pct(st.exposure.erosion, 0)} of single-family policies are exposed to erosion, and V zone policies had a median bill of ${K.usd(z.V?.median ?? 0)} on ${date}, against ${K.usd(z.X?.median ?? 0)} in X zones.` },
    { q: 'How many Connecticut homes filed flood claims after Hurricane Ida?', a: `The federal program paid ${K.num(ida?.n ?? 0)} claims on Connecticut single-family homes for ${ida?.event ?? 'that storm'} in ${ida?.year ?? N.claimYears[0]}, ${K.usd(ida?.total ?? 0)} in total. It is the largest flood event in the state's claims from ${N.claimYears[0]} to ${N.claimYears[1]}. The state median paid claim over that period was ${K.usd(st.claims?.median ?? 0)}.` },
  ],
  related: ['flood-insurance-coverage-limits', 'flood-zones-explained', 'average-flood-insurance-claim', 'state:new-york'],
});
