import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const nh = K.S('new-hampshire');
const N = K.N;
const ref = K.day(N.policiesDate!);
const s = nh.pol!;
const zA = nh.polByZone.A;
const zV = nh.polByZone.V;
const zX = nh.polByZone.X;
const cty = (name: string) => nh.topCounties.find((x) => x.name === name);
const rock = cty('Rockingham County');
const hills = cty('Hillsborough County');
const merr = cty('Merrimack County');
const carroll = cty('Carroll County');
const grafton = cty('Grafton County');
const nor = nh.events[0];
const above2k = nh.ranges.filter((r) => r.lo >= (nh.ranges[2]?.lo ?? 0)).reduce((t, r) => t + r.share, 0);
const natAbove2k = N.ranges.filter((r) => r.lo >= (nh.ranges[2]?.lo ?? 0)).reduce((t, r) => t + r.share, 0);
const rockGlide = K.glide({ current: rock?.pol?.median ?? s.median, full: rock?.pol?.full ?? s.full, cap: K.P.caps.standard, fees: K.fees('primary') });

export default defineState({
  slug: 'new-hampshire',
  title: 'Flood Insurance New Hampshire 2026: Rockingham to Carroll',
  description: `New Hampshire flood insurance 2026: median single-family bills by county and ZIP on ${ref}, Rockingham to Carroll County, the long climb to full risk.`,
  intro: `New Hampshire's ${K.num(s.n)} single-family flood policies had a median bill of ${K.usd(s.median)} on ${ref}, above the national median.`,
  resume: `New Hampshire flood insurance costs more than the national norm and is set to keep rising. The median single-family bill was ${K.usd(s.median)} a year on ${ref}, across ${K.num(s.n)} federal policies, against ${K.usd(N.policies!.median)} nationwide; the figure includes the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. At full risk, the same homes would have a median bill of ${K.usd(s.full)}, and ${K.pct(s.capped, 0)} of them still pay less than their full-risk premium, above the national ${K.pct(N.policies!.capped, 0)}. A-zone homes, the bulk of the book, paid a median ${K.usd(zA?.median ?? 0)} with a full-risk median of ${K.usd(zA?.full ?? 0)}. Rockingham County, home of Hampton, Rye and Portsmouth, accounts for ${K.pct((rock?.pol?.n ?? 0) / s.n, 0)} of policies. Inland, Grafton and Merrimack counties show some of the largest distances to full risk. From ${N.claimYears[0]} to ${N.claimYears[1]}, ${K.num(nh.claims?.n ?? 0)} single-family claims were paid, median ${K.usd(nh.claims?.median ?? 0)}.`,
  body: (h) => `
<h2>Expensive for a state with little coast</h2>
<p>Only ${K.pct(nh.exposure.surge, 0)} of New Hampshire policies were exposed to storm surge in FEMA's 2023 tables, a lower share than in the other coastal states of New England, yet the state's bills run high. The price bands explain it: ${K.pct(above2k, 0)} of New Hampshire homes had a full-risk price of ${K.usd(nh.ranges[2]?.lo ?? 0)} or more in 2023, against ${K.pct(natAbove2k, 0)} of homes nationwide.</p>
<p>Policies are concentrated in A zones: ${K.num(zA?.n ?? 0)} of the ${K.num(s.n)}. The ${K.num(zX?.n ?? 0)} X-zone policies paid a median ${K.usd(zX?.median ?? 0)}, and the small V-zone group (${K.num(zV?.n ?? 0)} homes) ${K.usd(zV?.median ?? 0)}.</p>
<h2>Rockingham County, on the coast</h2>
<p>Hampton, Rye and Portsmouth sit in Rockingham County, which has ${K.num(rock?.pol?.n ?? 0)} policies, a median bill of ${K.usd(rock?.pol?.median ?? 0)} and a median full-risk bill of ${K.usd(rock?.pol?.full ?? 0)}. More than half of them, ${K.pct(rock?.pol?.capped ?? 0, 0)}, are still capped. At the county medians, a main home needs about ${rockGlide.steps} renewals of increases of up to ${K.pct(K.P.caps.standard, 0)} to reach full risk.</p>
${h.mini('private', { t: 'Rockingham County medians: the capped federal path against a private quote', p: ['cur', 'full', 'q'], d: { cur: rock?.pol?.median ?? s.median, full: rock?.pol?.full ?? s.full, q: rock?.pol?.full ?? s.full } })}
<p>The county also has the most paid claims in the state, ${K.num(rock?.claims?.n ?? 0)}, with a median of ${K.usd(rock?.claims?.median ?? 0)}. ${nor ? `The ${nor.event} of ${nor.year}, the only event listed for the state, paid ${K.num(nor.n)} claims across New Hampshire.` : ''}</p>
<h2>Hillsborough, Grafton, Merrimack and Carroll</h2>
<p>Hillsborough County, with Manchester and Nashua, has ${K.num(hills?.pol?.n ?? 0)} policies at a median of ${K.usd(hills?.pol?.median ?? 0)}. Cheshire County paid a median ${K.usd(cty('Cheshire County')?.pol?.median ?? 0)} and Strafford County ${K.usd(cty('Strafford County')?.pol?.median ?? 0)}. Farther north the gaps widen. Grafton County showed the largest one in the 2023 tables, ${K.usd(nh.maxGap?.current ?? 0)} paid against ${K.usd(nh.maxGap?.risk ?? 0)} at full risk, and its median bill of ${K.usd(grafton?.pol?.median ?? 0)} on ${ref} is the highest of the large counties. Merrimack County, around Concord, has a full-risk median of ${K.usd(merr?.pol?.full ?? 0)}; Carroll County, which includes Wolfeboro, Bartlett and Jackson, ${K.usd(carroll?.pol?.full ?? 0)}. A private quote can compete with those full-risk figures, and the ${h.a('private-flood-insurance', 'private flood insurance guide')} sets out what changes when a home leaves the federal program.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Hampton or Rye, New Hampshire?', a: `Both towns are in Rockingham County, where the median single-family flood bill was ${K.usd(rock?.pol?.median ?? 0)} a year on ${ref}, across ${K.num(rock?.pol?.n ?? 0)} federal policies. The full-risk median was ${K.usd(rock?.pol?.full ?? 0)}. A single home can pay far more or less than the county median; the ZIP lookup gives the median for a single ZIP code.` },
    { q: 'Why are New Hampshire flood insurance bills still going up?', a: `Because ${K.pct(s.capped, 0)} of single-family policies in the state paid less than their full-risk premium on ${ref}, and the statewide full-risk median of ${K.usd(s.full)} is well above the current ${K.usd(s.median)}. A capped main home's premium can rise up to ${K.pct(K.P.caps.standard, 0)} a year until it reaches full risk.` },
    { q: 'What does flood insurance cost in Grafton County, New Hampshire?', a: `Grafton County's median single-family flood bill was ${K.usd(grafton?.pol?.median ?? 0)} on ${ref}, the highest among the state's larger counties, for ${K.num(grafton?.pol?.n ?? 0)} policies. The full-risk median there was ${K.usd(grafton?.pol?.full ?? 0)}, and ${K.pct(grafton?.pol?.capped ?? 0, 0)} of policies were still below it, so yearly increases are likely to continue for years.` },
  ],
  related: ['flood-insurance-by-state', 'private-flood-insurance', 'flood-insurance-rate-increase', 'state:massachusetts'],
});
