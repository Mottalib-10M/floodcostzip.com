import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('alabama');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const c = (name: string) => st.topCounties.find((x) => x.name === name);
const baldwin = c('Baldwin County');
const mobile = c('Mobile County');
const madison = c('Madison County');
const shelby = c('Shelby County');
const jefferson = c('Jefferson County');
const gulfPol = (baldwin?.pol?.n ?? 0) + (mobile?.pol?.n ?? 0);
const sally = st.events[0];
const zeta = st.events[1];
const cz = st.claimsByZone;
const gap = st.maxGap;
const gb = K.glide({ current: baldwin?.pol?.median ?? pol.median, full: baldwin?.pol?.full ?? pol.full, cap: K.P.caps.standard, fees: K.fees('primary') });

export default defineState({
  slug: 'alabama',
  title: 'Flood Insurance Alabama 2026: Gulf Coast and Inland Bills',
  description: `Alabama flood insurance in 2026: median single-family bill on ${date}, Baldwin and Mobile county prices, inland costs and what Hurricane Sally paid.`,
  intro: `Alabama has ${K.num(pol.n)} single-family flood policies; on ${date} their median bill was ${K.usd(pol.median)}, and most of them sit near the short Gulf shoreline.`,
  resume: `For a single-family home in Alabama, the median federal flood policy cost ${K.usd(pol.median)} a year on ${date}, counting the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. Only ${K.num(pol.n)} homes carry one, and ${K.pct(gulfPol / pol.n, 0)} of them are in the two Gulf counties, Baldwin and Mobile. That concentration sets the state's price level and its direction. Baldwin's median bill was ${K.usd(baldwin?.pol?.median ?? 0)} and Mobile's ${K.usd(mobile?.pol?.median ?? 0)}, while their full-risk medians were ${K.usd(baldwin?.pol?.full ?? 0)} and ${K.usd(mobile?.pol?.full ?? 0)}. Statewide, ${K.pct(pol.capped, 0)} of policies still pay less than their full-risk premium, and the median full-risk bill is ${K.usd(pol.full)}, so yearly increases continue for most owners near the coast. One storm dominates the claims record: ${sally?.event ?? 'a single hurricane'} in ${sally?.year ?? N.claimYears[0]} accounts for ${K.pct((sally?.n ?? 0) / (st.claims?.n ?? 1), 0)} of all paid single-family claims from ${N.claimYears[0]} to ${N.claimYears[1]}.`,
  body: (h) => `
<h2>A short coast holds most of the policies</h2>
<p>Alabama touches the Gulf only between Mobile Bay and the Florida line, yet Baldwin and Mobile counties hold ${K.num(gulfPol)} of the state's single-family flood policies. Inland, coverage is thin: Madison County, around Huntsville, is third with ${K.num(madison?.pol?.n ?? 0)}, and Jefferson County, which includes Birmingham, has ${K.num(jefferson?.pol?.n ?? 0)}.</p>
<p>FEMA's 2023 exposure table shows the coastal pull. It rated ${K.pct(st.exposure.surge, 0)} of Alabama's single-family policies as exposed to storm surge and ${K.pct(st.exposure.erosion, 0)} to coastal erosion (${K.dec(st.exposure.erosion / N.exposure.erosion, 1)} times the national share), the risk faced by Gulf Shores, Orange Beach and Dauphin Island.</p>
${h.mini('state', { t: 'Compare a bill with the Alabama medians', p: ['cur'], d: { sx: 'alabama', cur: 0 } })}
<h2>Sally, Zeta and the claim record</h2>
<p>${sally?.event ?? 'The largest storm'} came ashore in ${sally?.year ?? N.claimYears[0]} and produced ${K.num(sally?.n ?? 0)} paid single-family claims for ${K.usd(sally?.total ?? 0)}. ${zeta ? `${zeta.event} followed weeks later with ${K.num(zeta.n)} more.` : ''} Baldwin County alone recorded ${K.num(baldwin?.claims?.n ?? 0)} paid claims over the decade, at a median of ${K.usd(baldwin?.claims?.median ?? 0)}.</p>
<p>The split by zone is unusual. Claims rated in V zones, the beachfront, had a median payment of only ${K.usd(cz.V?.median ?? 0)}, while those in X zones reached ${K.usd(cz.X?.median ?? 0)}, above the ${K.usd(cz.A?.median ?? 0)} of A zones. One likely reason: raised beach houses often take water only under the living floor, while a slab house flooded inland loses walls, floors and contents.</p>
<h2>Price by zone today</h2>
<p>The ${K.num(z.A?.n ?? 0)} A zone policies had a median bill of ${K.usd(z.A?.median ?? 0)} on ${date}, the ${K.num(z.V?.n ?? 0)} V zone policies ${K.usd(z.V?.median ?? 0)}, and the ${K.num(z.X?.n ?? 0)} X zone policies ${K.usd(z.X?.median ?? 0)}. On the coast, the climb is not over. Starting from the Baldwin County median and moving toward its full-risk median at the ${K.pct(K.P.caps.standard, 0)} cap for a main home, a policy needs ${gb.steps} more renewals of increases. A beach rental or second home climbs at ${K.pct(K.P.caps.higher, 0)} a year and gets there sooner, at a higher price each year along the way.</p>
<p>Shelby County, south of Birmingham, stands out inland, with a median paid claim of ${K.usd(shelby?.claims?.median ?? 0)}.</p>
<p>${gap?.name ?? 'One county'} on the Tennessee River had the widest gap in FEMA's 2023 table, ${K.usd(gap?.current ?? 0)} paid against a full-risk median of ${K.usd(gap?.risk ?? 0)}. The ${h.a('flood-insurance-rate-increase', 'rate increase guide')} shows how such a gap closes, one capped renewal at a time.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Baldwin County, Alabama?', a: `Baldwin County, which includes Gulf Shores, Orange Beach and the eastern shore of Mobile Bay, had ${K.num(baldwin?.pol?.n ?? 0)} single-family flood policies on ${date}. The median yearly bill was ${K.usd(baldwin?.pol?.median ?? 0)} with fees, and the median full-risk bill ${K.usd(baldwin?.pol?.full ?? 0)}. About ${K.pct(baldwin?.pol?.capped ?? 0, 0)} of those policies are still below full price.` },
    { q: 'What did Hurricane Sally cost the flood program in Alabama?', a: `The federal program paid ${K.num(sally?.n ?? 0)} claims on Alabama single-family homes for ${sally?.event ?? 'that storm'} in ${sally?.year ?? N.claimYears[0]}, ${K.usd(sally?.total ?? 0)} for buildings and contents. No other event from ${N.claimYears[0]} to ${N.claimYears[1]} comes close in the state, and the second largest, ${zeta?.event ?? 'a later storm'}, paid ${K.num(zeta?.n ?? 0)} claims. The whole decade produced ${K.num(st.claims?.n ?? 0)} paid single-family claims.` },
    { q: 'Is flood insurance expensive in Huntsville, Alabama?', a: `Madison County, home to Huntsville, had a median single-family flood bill of ${K.usd(madison?.pol?.median ?? 0)} a year on ${date}, across ${K.num(madison?.pol?.n ?? 0)} policies, below the Gulf counties. Its median full-risk bill was ${K.usd(madison?.pol?.full ?? 0)}. The county recorded ${K.num(madison?.claims?.n ?? 0)} paid claims from ${N.claimYears[0]} to ${N.claimYears[1]}.` },
  ],
  related: ['flood-insurance-rate-increase', 'average-flood-insurance-claim', 'flood-insurance-by-state', 'state:mississippi'],
});
