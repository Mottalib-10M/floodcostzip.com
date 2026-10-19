import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const md = K.S('maryland');
const N = K.N;
const when = K.day(N.policiesDate!);
const all = md.pol!;
const zones = md.polByZone;
const find = (name: string) => md.topCounties.find((c) => c.name === name);
const worcester = find('Worcester County');
const anne = find('Anne Arundel County');
const pg = find("Prince George's County");
const mont = find('Montgomery County');
const talbot = find('Talbot County');
const under1k = md.ranges.find((r) => r.lo === 0)?.share ?? 0;
const natUnder1k = N.ranges.find((r) => r.lo === 0)?.share ?? 0;
const top = md.events[0];

export default defineState({
  slug: 'maryland',
  title: 'Flood Insurance Maryland 2026: Ocean City and the Bay',
  description: `Maryland flood insurance in 2026: median single-family bill by county and ZIP on ${when}, why bay homes pay near full risk, Ocean City's higher price.`,
  intro: `Maryland's ${K.num(all.n)} single-family flood policies cost a median ${K.usd(all.median)} a year on ${when}, well under the national median.`,
  resume: `Flood insurance is cheap in Maryland by national standards. The median single-family bill was ${K.usd(all.median)} on ${when}, against ${K.usd(N.policies!.median)} for the country, across ${K.num(all.n)} policies; that total includes the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. The state is also almost done with the transition to risk-based prices: the median full-risk bill is ${K.usd(all.full)}, a few dollars above the current one, and only ${K.pct(all.capped, 0)} of policies still pay less than their full-risk premium. In FEMA's 2023 tables, ${K.pct(under1k, 0)} of Maryland homes had a full-risk price under ${K.usd(md.ranges[0]?.hi ?? 0)}, compared with ${K.pct(natUnder1k, 0)} nationally. The exception is Worcester County, the Atlantic coast around Ocean City, where the median bill reached ${K.usd(worcester?.pol?.median ?? 0)} and ${K.pct(worcester?.pol?.capped ?? 0, 0)} of policies are still capped. Policies split evenly between A zones (median ${K.usd(zones.A?.median ?? 0)}) and X zones (median ${K.usd(zones.X?.median ?? 0)}).`,
  body: (h) => `
<h2>Chesapeake shoreline, low prices</h2>
<p>Most Maryland flood policies cover homes on tidal water: the Chesapeake Bay, its rivers and creeks. FEMA's 2023 data counted ${K.pct(md.exposure.surge, 0)} of the state's single-family policies as exposed to storm surge and ${K.pct(md.exposure.erosion, 0)} to coastal erosion, second only to Maine among the states. Even so, bay counties price low. Anne Arundel County, with ${K.num(anne?.pol?.n ?? 0)} policies, had a median bill of ${K.usd(anne?.pol?.median ?? 0)}; Talbot County on the Eastern Shore, ${K.usd(talbot?.pol?.median ?? 0)}.</p>
<p>The zone mix points the same way. Only ${K.num(zones.V?.n ?? 0)} Maryland policies fall in V zones, the coastal areas mapped for breaking waves, and their median bill (${K.usd(zones.V?.median ?? 0)}) differs little from the A-zone median. In most of the bay, FEMA's model sees flooding as a matter of rising water rather than wave impact.</p>
${h.mini('rank', { t: 'How a full-risk quote compares with Maryland homes', p: ['cost'], d: { sx: 'maryland', cost: 1200 } })}
<p>The price bands confirm it. After the under ${K.usd(md.ranges[0]?.hi ?? 0)} band, the next one (${K.usd(md.ranges[1]?.lo ?? 0)} to ${K.usd(md.ranges[1]?.hi ?? 0)}) held ${K.pct(md.ranges[1]?.share ?? 0, 0)} of Maryland homes in 2023, and every band above ${K.usd(md.ranges[2]?.lo ?? 0)} together held less than ${K.pct(1 - under1k - (md.ranges[1]?.share ?? 0) + 0.005, 0)}. A quote far above those levels is unusual for the state and can be set against the ZIP median.</p>
<h2>Worcester County is a different market</h2>
<p>Ocean City and the barrier island face the Atlantic. Worcester County holds ${K.num(worcester?.pol?.n ?? 0)} policies, the most in the state, and its median full-risk bill is ${K.usd(worcester?.pol?.full ?? 0)}, so yearly increases of up to ${K.pct(K.P.caps.standard, 0)} (${K.pct(K.P.caps.higher, 0)} for a second home) continue there. A house insured as a second home or rental also pays the higher HFIAA surcharge of ${K.usd(K.P.fees.hfiaa.other)} instead of ${K.usd(K.P.fees.hfiaa.primary)}. The ${h.a('flood-insurance-second-home', 'second home guide')} covers that case.</p>
<h2>Washington suburbs and small claims</h2>
<p>Montgomery and Prince George's counties together hold ${K.num((mont?.pol?.n ?? 0) + (pg?.pol?.n ?? 0))} policies, with medians of ${K.usd(mont?.pol?.median ?? 0)} and ${K.usd(pg?.pol?.median ?? 0)}. Claims across the state are modest: ${K.num(md.claims?.n ?? 0)} paid single-family claims over ${N.claimYears[0]} to ${N.claimYears[1]}, median ${K.usd(md.claims?.median ?? 0)}. No single storm dominates; ${top ? `the largest, ${top.event} in ${top.year}, paid ${K.num(top.n)} claims` : 'several storms each paid a few dozen claims'}. A small median does not mean small risk for one house, and the ${h.a('flood-insurance-coverage-limits', 'coverage limits guide')} shows what a policy pays on a large loss.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Ocean City, Maryland?', a: `Ocean City is in Worcester County, where the median single-family flood bill was ${K.usd(worcester?.pol?.median ?? 0)} a year on ${when}, the highest county median in Maryland. The same policies at full risk would have a median of ${K.usd(worcester?.pol?.full ?? 0)}. A condominium unit is usually covered by the association's building policy, so the figures here apply to single-family houses.` },
    { q: 'Why is flood insurance in Anne Arundel County so cheap?', a: `Anne Arundel's median single-family bill was ${K.usd(anne?.pol?.median ?? 0)} on ${when}, and its full-risk median ${K.usd(anne?.pol?.full ?? 0)}, so most homes there already pay a risk-based price that happens to be low. The county counts few homes in V zones, and FEMA's model prices sheltered tidal water below an open ocean shore. The ZIP lookup above shows the spread inside the county.` },
    { q: 'What share of Maryland flood policies are still below full risk?', a: `On ${when}, ${K.pct(all.capped, 0)} of Maryland single-family policies paid less than their full-risk premium, against ${K.pct(N.policies!.capped, 0)} nationwide. Among the large counties, Worcester has the highest share (${K.pct(worcester?.pol?.capped ?? 0, 0)} capped). In Montgomery County the share was only ${K.pct(mont?.pol?.capped ?? 0, 0)}, so bills there move mainly with fees and coverage changes.` },
  ],
  related: ['flood-insurance-by-state', 'flood-insurance-second-home', 'flood-insurance-coverage-limits', 'state:virginia'],
});
