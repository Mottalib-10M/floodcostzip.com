import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const N = K.N;
const POL = N.policies!;
const PR = K.P.program;
const T = N.policiesTrend!;
const first = T[0], last = T[T.length - 1];
const date = K.day(N.policiesDate!);
const until = K.day(PR.authorizedThrough);
const drop = 1 - last.n / first.n;
const lost = first.n - last.n;
const rise = last.median / first.median - 1;
const atFull = 1 - POL.capped;
const cap = K.pct(K.P.caps.standard, 0);
const capHi = K.pct(K.P.caps.higher, 0);
const fpf = K.usd(K.P.fees.federalPolicyFee.primary);
const rfa = K.pct(K.P.fees.reserveFundRate, 0);
const g = K.glide({ current: POL.median, full: POL.full, cap: K.P.caps.standard, fees: K.fees('primary') });

export default defineGuide({
  id: 'nfip',
  group: 'policy',
  order: 11,
  slug: 'nfip',
  nav: 'The NFIP',
  card: `What the federal flood program is, who sells it, and its authorization to ${until}.`,
  title: 'NFIP 2026: The National Flood Insurance Program in Figures',
  description: `NFIP in 2026: how the federal flood program works, who sells its policies, its authorization to ${until} and its single-family policy count since 2023.`,
  h1: 'The NFIP: what the National Flood Insurance Program is and where it stands in 2026',
  intro: `Pick a state: the median single-family NFIP bill there on ${date}, the full-risk median, and how far your own bill sits from it.`,
  resume: `The National Flood Insurance Program (NFIP) is the federal flood insurance created by the National Flood Insurance Act of 1968 and run by FEMA. It writes most of the flood cover on American homes: about ${K.num(PR.policiesApril2026)} policies of all kinds in April 2026, according to the GAO, down from about ${K.num(PR.policiesPeak2010)} at the March 2010 peak, while private insurers grew from ${K.pct(PR.privateShare2018, 0)} to ${K.pct(PR.privateShare2025, 0)} of the market between 2018 and 2025. Single-family policies fell from ${K.num(first.n)} on ${K.day(first.date)} to ${K.num(last.n)} on ${date}, ${K.pct(drop, 0)} fewer, as their median bill rose ${K.pct(rise, 0)} to ${K.usd(last.median)}. Congress must renew the program's authority to sell policies: the current extension, in Public Law 119-103, runs to ${until}. Policies are sold through insurance agents and insurers, at a price FEMA sets. This site is not the NFIP and sells nothing; it reads the program's public files.`,
  body: (h) => `
<h2>A federal program, sold by private hands</h2>
<p>The National Flood Insurance Act of 1968 set up the program, run today by FEMA. It does three jobs at once. It sells flood insurance on buildings and their contents in the communities that take part. It publishes the flood maps that show where the hazard is highest. And the same law ties the two together: a lender that is federally regulated, a federal agency lender, or a loan sold to Fannie Mae or Freddie Mac must require a policy on a mortgage in a mapped high-hazard area.</p>
<p>Nobody buys an NFIP policy from FEMA at a counter. The policy is sold through insurance agents and insurers, often the agent who already handles the homeowners policy. The contract, the coverage limits and the rating rules are FEMA's, set for the whole country in its ${h.src('fema_manual', 'Flood Insurance Manual')}, so the agent does not make the price. When two quotes differ, compare the coverage amounts and deductibles first, and check whether one of them is a private policy.</p>
${h.box('This site is not the NFIP', `<p>Radif Partners publishes figures read in the program's public files. It is not FEMA, not the NFIP and not an insurer, sells no policy and passes no request on. For a quote, ask a licensed insurance agent.</p>`)}

<h2>Authorization: why the program has an end date</h2>
<p>The NFIP's authority to issue new contracts expires on a date written in law, and in recent years Congress has renewed it through short extensions rather than a long reauthorization. In ${K.P.year}, an extension signed on February 3 carried it to September 30. Then ${h.src('pl_119_103', 'Public Law 119-103')}, approved on September 2, extended it again to ${until}. As of this page's date, no longer reauthorization has been enacted.</p>
<p>FEMA describes on its ${h.src('fema_reauth', 'reauthorization page')} what a lapse would mean. Claims on policies in force would still be paid with the funds available. What stops is the sale and renewal of policies: a buyer closing on a house in a high-hazard area, or an owner whose policy comes up for renewal during the gap, could not get federal cover until Congress acts.</p>

<h2>Fewer policies, higher bills</h2>
${h.table(['Date', 'Single-family policies', 'Median yearly bill'], T.map((r) => [K.day(r.date), K.num(r.n), K.usd(r.median)]), `Single-family policies in force, total cost (premium, Reserve Fund Assessment, HFIAA surcharge, Federal Policy Fee). OpenFEMA NFIP Redacted Policies.`, ['l', 'r', 'r'])}
<p>The program lost ${K.num(lost)} single-family policies in under three years while the typical bill climbed. Both trends come from the same source. Since October 1, 2021, new policies pay their full-risk premium, and older policies move toward theirs by up to ${cap} a year (${capHi} for second homes, businesses and a few other cases). Over the same years, the ${h.src('gao_2026', 'GAO')} found that the private share of the flood market doubled between 2018 and 2025.</p>

<h2>Full-risk premium and discounted premium</h2>
<p>Every NFIP declarations page shows two prices. The full-risk premium is what FEMA computes for the building under ${h.src('fema_pricing', 'its current pricing approach')}, from its location, flood types, elevation and rebuilding cost. The discounted premium is what the owner actually pays before fees, after the statutory discounts the law grants: the annual increase cap that limits yearly rises, the Pre-FIRM discount for older primary residences, the Newly Mapped discount for buildings just placed in a high-hazard zone. On top come the Reserve Fund Assessment (${rfa} of the discounted premium), the HFIAA surcharge and the ${fpf} Federal Policy Fee.</p>
<p>In August 2023, FEMA counted ${K.pct(PR.fema2023RiskBasedShare, 0)} of single-family policyholders already paying a risk-based premium. On ${date}, ${K.pct(atFull, 0)} of single-family policies paid at least their full-risk premium and ${K.pct(POL.capped, 0)} still paid less. Priced at full risk, the same policies would have a median bill of ${K.usd(POL.full)} instead of ${K.usd(POL.median)}. From the national median, that gap takes ${g.steps} more capped renewals to close.</p>
${h.mini('glide', { t: 'Renewals left before your full-risk price', p: ['cur', 'full', 'use'] })}
<p>A discount is tied to continuous NFIP cover. A policy renewed ${K.P.program.lapseDays} days or more late lapses, and the new one is rated at full risk; the ${h.a('flood-insurance-waiting-period', 'waiting period page')} gives the detail. The ${h.a('flood-insurance-by-state', 'state table')} shows how far each state's median sits from its full-risk median.</p>
`,
  faqs: [
    { q: 'Is the NFIP part of FEMA?', a: `Yes. The National Flood Insurance Program is managed by FEMA, which sets the policy form, the coverage limits and the rates for the whole country and publishes the flood maps. The policies themselves are sold through insurance agents and insurers. A federal policy bought from one agent costs the same as the same policy bought from another, since FEMA sets the price.` },
    { q: 'What happens to my flood policy if the NFIP expires?', a: `According to FEMA, a lapse of authorization would not stop valid claims, which would still be paid with available funds. FEMA would stop selling and renewing policies until Congress acts, so a policy expiring during the gap could not be renewed and a home sale needing a new policy could stall. The current extension runs to ${until}.` },
    { q: 'How many people have NFIP flood insurance?', a: `The GAO counted about ${K.num(PR.policiesApril2026)} NFIP policies of all kinds in April 2026, down from about ${K.num(PR.policiesPeak2010)} in March 2010. Single-family homes account for ${K.num(POL.n)} of them in the OpenFEMA policy file on ${date}, down from ${K.num(first.n)} in August 2023.` },
    { q: 'What is the difference between the full-risk and the discounted premium?', a: `The full-risk premium is FEMA's price for the building's own flood exposure. The discounted premium is that price minus the statutory discounts, mainly the annual increase cap that limits yearly rises to ${cap} for most homes. Both appear on the declarations page; fees and the Reserve Fund Assessment are added on top of the discounted premium.` },
    { q: 'Can I buy flood insurance outside the NFIP?', a: `Yes. Private insurers sell flood policies too, and their share of the market grew from ${K.pct(PR.privateShare2018, 0)} in 2018 to ${K.pct(PR.privateShare2025, 0)} in 2025 according to the GAO. Lenders must accept a private policy that meets the federal definition. Leaving the NFIP can cost its statutory discounts if you come back later, as the private flood insurance page explains.` },
  ],
  tool: 'state',
  toolArg: { sx: 'louisiana' },
  related: ['flood-insurance-by-state', 'flood-insurance-rate-increase', 'private-flood-insurance', 'flood-insurance-waiting-period'],
  sources: ['pl_119_103', 'fema_reauth', 'gao_2026', 'fema_manual', 'fema_pricing', 'openfema_policies'],
});
