import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('massachusetts');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const nat = N.policies!;
const z = st.polByZone;
const cz = st.claimsByZone;
const pick = (name: string) => st.topCounties.find((c) => c.name === name);
const barn = pick('Barnstable County');
const plym = pick('Plymouth County');
const suff = pick('Suffolk County');
const midd = pick('Middlesex County');
const worc = pick('Worcester County');
const noreaster = st.events[0];
const cut3 = st.ranges[3]?.lo ?? 0;
const over3k = st.ranges.filter((r) => r.lo >= cut3).reduce((s, r) => s + r.share, 0);
const natOver3k = N.ranges.filter((r) => r.lo >= cut3).reduce((s, r) => s + r.share, 0);

export default defineState({
  slug: 'massachusetts',
  title: 'Flood Insurance Massachusetts 2026: Cape Cod to Boston',
  description: `Massachusetts flood insurance 2026: median home bill on ${date}, Cape Cod, Plymouth and Boston costs, V zone prices, coastal erosion, nor'easter claims.`,
  intro: `Massachusetts has ${K.num(pol.n)} single-family flood policies; at ${K.usd(pol.median)} on ${date}, the median bill is above the national figure.`,
  resume: `Massachusetts homeowners with a federal flood policy paid a median ${K.usd(pol.median)} a year on ${date} for a single-family home, all charges included, across ${K.num(pol.n)} policies. That is more than the national median of ${K.usd(nat.median)}, and the gap to full price is smaller than in the Gulf states: the full-risk median is ${K.usd(pol.full)} and ${K.pct(pol.capped, 0)} of policies are still capped. The cost sits on the shore. Barnstable County (Cape Cod and the islands nearby) and Plymouth County hold ${K.num((barn?.pol?.n ?? 0) + (plym?.pol?.n ?? 0))} policies between them, with medians of ${K.usd(barn?.pol?.median ?? 0)} and ${K.usd(plym?.pol?.median ?? 0)}. V zone policies, ${K.num(z.V?.n ?? 0)} of them, have a median of ${K.usd(z.V?.median ?? 0)}. Inland, Middlesex County pays ${K.usd(midd?.pol?.median ?? 0)}. Houses are expensive too: the median replacement cost in FEMA's 2023 data was ${K.usd(st.medianRcv ?? 0)}, so many owners insure the building at the ${K.usd(K.P.limits.building)} federal maximum.`,
  body: (h) => `
<h2>Why the Bay State pays above the national median</h2>
<p>Two features of the data push Massachusetts up. First, a larger share of its policies are on the open coast: ${K.num(z.V?.n ?? 0)} of ${K.num(pol.n)} are in V zones, a much higher proportion than in most states. Second, FEMA's 2023 tables put ${K.pct(st.exposure.erosion, 0)} of its single-family policies in areas exposed to coastal erosion, against ${K.pct(N.exposure.erosion, 0)} nationally, and ${K.pct(st.exposure.surge, 0)} exposed to surge. Expensive homes add to it, since the premium depends partly on the cost to rebuild.</p>
<p>The shape of the price bands shows the result. ${K.pct(over3k, 0)} of the state's 2023 policies had a full-risk price of ${K.usd(cut3)} or more, against ${K.pct(natOver3k, 0)} nationally.</p>
${h.mini('rank', { t: 'Where a quoted full-risk price falls among Massachusetts homes', p: ['cost'], d: { sx: 'massachusetts', cost: 2000 } })}
<h2>Boston and the South Shore</h2>
<p>Suffolk County, which is mostly the city of Boston, has fewer single-family policies than its population suggests, ${K.num(suff?.pol?.n ?? 0)}, because most homes there are condominiums and apartments not counted in these medians. Its single-family median, ${K.usd(suff?.pol?.median ?? 0)}, is the highest of the large counties, and the full-risk median is ${K.usd(suff?.pol?.full ?? 0)}. Plymouth County, from Hull and Hingham down to Buzzards Bay, recorded ${K.num(plym?.claims?.n ?? 0)} paid single-family claims from ${N.claimYears[0]} to ${N.claimYears[1]}, more than any other of the large counties.</p>
<p>North of the city, Essex County takes in Gloucester, Newburyport and the marsh towns of the North Shore. Its ${K.num(pick('Essex County')?.pol?.n ?? 0)} policies pay a median ${K.usd(pick('Essex County')?.pol?.median ?? 0)}, and ${K.pct(pick('Essex County')?.pol?.capped ?? 0, 0)} are still capped. Norfolk County, south of Boston, is a little cheaper at ${K.usd(pick('Norfolk County')?.pol?.median ?? 0)}. Bristol County, on Buzzards Bay and the Taunton River, sits close to the state median.</p>
<h2>Many small losses, few big storms</h2>
<p>The claims record is modest for a coastal state: ${K.num(st.claims?.n ?? 0)} paid single-family claims over ten years, a median of ${K.usd(st.claims?.median ?? 0)}. No storm in that window produced a large claims file. The costliest event was the ${noreaster?.event ?? 'winter storm'} of ${noreaster?.year ?? ''}, with ${K.num(noreaster?.n ?? 0)} claims. V zone claims are the largest, a median of ${K.usd(cz.V?.median ?? 0)}, because waves damage structure as well as finishes. In Worcester County and the rest of the interior, river flooding is the risk, and the ${K.num(worc?.pol?.n ?? 0)} Worcester policies cost a median ${K.usd(worc?.pol?.median ?? 0)}.</p>
<p>The ${h.a('flood-insurance-coverage-limits', 'coverage limits page')} explains what the ${K.usd(K.P.limits.building)} building cap means for a house that costs more to rebuild.</p>
`,
  faqs: [
    { q: 'How much does flood insurance cost on Cape Cod?', a: `In Barnstable County, which covers Cape Cod, the median single-family flood bill was ${K.usd(barn?.pol?.median ?? 0)} a year on ${date}, across ${K.num(barn?.pol?.n ?? 0)} policies. The full-risk median of those homes was ${K.usd(barn?.pol?.full ?? 0)}, and ${K.pct(barn?.pol?.capped ?? 0, 0)} were still capped. Waterfront houses in V zones pay more than homes set back from the shore.` },
    { q: 'Is flood insurance in Massachusetts higher than the national average?', a: `By median, yes. The Massachusetts single-family median was ${K.usd(pol.median)} on ${date}, against ${K.usd(nat.median)} for the whole country. The state has a large share of V zone and erosion-exposed homes and high rebuilding costs. Its X zone policies are cheaper, a median of ${K.usd(z.X?.median ?? 0)}, and close to their full-risk price.` },
    { q: 'What flood event cost Massachusetts homeowners the most recently?', a: `In the federal claims data for ${N.claimYears[0]} to ${N.claimYears[1]}, the ${noreaster?.event ?? 'largest event'} of ${noreaster?.year ?? ''} paid the most on single-family homes: ${K.num(noreaster?.n ?? 0)} claims for ${K.usd(noreaster?.total ?? 0)}. Most Massachusetts claims are scattered losses from coastal storms and heavy rain rather than one large disaster.` },
  ],
  related: ['flood-insurance-by-state', 'flood-insurance-coverage-limits', 'state:rhode-island', 'state:new-hampshire'],
});
