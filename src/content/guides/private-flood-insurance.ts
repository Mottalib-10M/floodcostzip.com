import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const N = K.N;
const POL = N.policies!;
const PR = K.P.program;
const L = K.P.limits;
const cap = K.pct(K.P.caps.standard, 0);
const date = K.day(N.policiesDate!);
// Worked case: the national median bill and its full-risk bill, against a private quote 15 % under the
// federal full-risk bill that then rises 8 % a year (the calculator's default assumption).
const quote = Math.round(POL.full * 0.85);
const pv = K.tool('private', { cur: POL.median, full: POL.full, q: quote, g: 8 });
const fed = K.glide({ current: POL.median, full: POL.full, cap: K.P.caps.standard, fees: K.fees('primary') });
let priv = 0, p = quote; for (let y = 0; y < 5; y++) { priv += p; p *= 1.08; }

export default defineGuide({
  id: 'private-flood-insurance',
  group: 'buy',
  order: 20,
  slug: 'private-flood-insurance',
  nav: 'Private flood insurance',
  card: 'What a private policy changes against the federal one: cap, limits, renewal, discounts.',
  title: 'Private Flood Insurance 2026: Compared With the NFIP Path',
  description: `Private flood insurance in 2026: what lenders must accept since July 2019, what a private policy covers above ${K.usd(L.building)}, and the ${cap} federal cap it gives up.`,
  h1: 'Private flood insurance against the federal policy: what you gain and what you give up',
  intro: 'Enter your federal bill, its full-risk price and a private quote: five years of each, side by side.',
  resume: `Private flood insurance is a policy sold by an insurer on its own terms instead of the federal Standard Flood Insurance Policy. Since ${K.day(PR.privateRuleDate)}, a lender must accept a private policy that meets the legal definition: coverage at least as broad as the federal policy, 45 days' written notice before cancellation or non-renewal, and a mortgage clause. The private share of the flood market grew from ${K.pct(PR.privateShare2018, 0)} in 2018 to ${K.pct(PR.privateShare2025, 0)} in 2025, according to the GAO. A private policy can cover a house above the federal ${K.usd(L.building)} building limit and sometimes prices a low-risk house below the federal premium. It also gives up two protections: no ${cap} yearly cap applies to its renewals, and an insurer can decline to renew. Leaving the federal program has a cost a quote does not show: the capped discount is lost, and going back means a new policy at the full-risk price. On the national median, the federal bill would reach ${K.usd(fed.rows[4].cost)} in year five.`,
  body: (h) => `
<h2>What the law asks of a private flood policy</h2>
<p>A private policy is not automatically good enough for a lender. The definition in ${h.src('usc_4012a', '42 U.S.C. 4012a(b)(7)')} requires an insurer licensed or approved in the state, coverage "at least as broad as" the federal Standard Flood Insurance Policy, including deductibles, exclusions and conditions, at least 45 days of written notice before cancellation or non-renewal, information about the federal program, a mortgage interest clause and a right to sue within one year of a written denial. The banking regulators' joint rule, in force since ${K.day(PR.privateRuleDate)}, turned that definition into an obligation: a regulated lender must accept a policy that meets it (${h.src('fdic_private', 'FDIC FIL-8-2019')}). A policy can carry a sentence saying it meets the definition, which spares the lender a clause-by-clause review.</p>
<p>Lenders may also accept, at their discretion, private policies or mutual aid plans that do not meet the definition, under conditions set by the same rule. That door is the lender's choice, not yours.</p>
<h2>Where a private policy can do more</h2>
<p>The federal limits are fixed by statute: ${K.usd(L.building)} for the building and ${K.usd(L.contents)} for contents of a one-to-four family home (${h.src('usc_4013', '42 U.S.C. 4013(b)')}). A house that would cost more to rebuild is underinsured with the federal policy alone. In FEMA's 2023 tables the median rebuild value of insured single-family homes was ${K.usd(N.medianRcv ?? 0)}, and ${K.pct(POL.shareBuildingAtMax, 0)} of policies in force on ${date} already carried the maximum building coverage. Private insurers sell either a full replacement of the federal policy or an excess policy that starts where the federal limit stops.</p>
<p>Private policies can also cover items the federal policy treats narrowly, such as additional living expenses while the house is repaired, or a basement's finishings, depending on the contract. Each policy is different: what it covers is in its own wording, not in a general rule.</p>
${h.mini('coverage', { t: 'How much of a large loss the federal limits leave uncovered', p: ['b', 'c'], d: { b: 450000, c: 120000 } })}
<h2>What a private policy gives up</h2>
<p><strong>The yearly cap.</strong> A federal policy below its full-risk price climbs at most ${cap} a year on its premium (${h.src('usc_4015', '42 U.S.C. 4015(e)')}). A private insurer re-prices at each renewal on its own model. A low first-year quote says nothing about the second year.</p>
<p><strong>Continuous coverage.</strong> The discounts the federal program grants by law are kept only by policyholders who stay insured with it. FEMA's own legislative proposal acknowledges that someone who moves to a private policy "may not be eligible to regain their premium discounts", and the GAO wrote in October 2026 that no law had changed this as of August 2026 (${h.src('gao_2026', 'GAO-27-108012')}). For a house whose federal bill is still well below its full-risk price, that discount is the most valuable part of the policy.</p>
<p><strong>Renewal.</strong> The federal program renews any policy whose premium is paid, as long as Congress keeps the program authorized (currently through ${K.day(PR.authorizedThrough)}). A private insurer can decline to renew after giving notice, often after a large loss in the area.</p>
<h2>Comparing five years, not one</h2>
<p>The calculator above adds up five years of each option. Take the national median: a federal bill of ${K.usd(POL.median)} whose full-risk bill is ${K.usd(POL.full)}. A private quote of ${K.usd(quote)}, about 15 % under the federal full-risk bill, that rises 8 % a year would cost ${K.usd(priv)} over five years, against ${K.usd(fed.total)} on the federal path. The result card reads: ${pv.label.toLowerCase()} ${pv.value}. Change the private increase you assume and the answer can flip; that assumption is yours, since no public file publishes private renewals.</p>
<p>Two checks make the comparison fair: the same building and contents limits on both sides, and the same deductibles. A private quote with a ${K.usd(K.P.deductibles.residentialMax)} deductible is not comparable with a federal policy at ${K.usd(K.P.deductibles.residentialDefault)}.</p>
<h2>Where to read the numbers</h2>
<p>Your federal declarations page shows the Full-Risk Premium and the discounted premium you pay. The ${h.a('flood-insurance-rate-increase', 'rate increase page')} explains how far the cap still has to run, and the ${h.a('flood-insurance-coverage-limits', 'coverage limits page')} what the federal policy pays on a large loss. For a private quote, a licensed agent or an insurer can price the same house; this site sells neither and receives nothing from either.</p>
`,
  faqs: [
    { q: 'Does my lender have to accept a private flood policy?', a: `Yes, if the policy meets the legal definition of private flood insurance in 42 U.S.C. 4012a(b)(7): coverage at least as broad as the federal policy, 45 days of notice before cancellation or non-renewal, a mortgage clause and the other listed terms. The joint rule of the banking regulators has required it since ${K.day(PR.privateRuleDate)}. A lender may accept other private policies at its discretion.` },
    { q: 'Do I lose my federal discount if I switch to a private policy?', a: `Very likely, yes. The statutory discounts of the federal program, including the yearly increase cap, depend on continuous federal coverage. FEMA itself notes that a policyholder who moves to a private policy may not regain those discounts on returning, and as of August 2026 no law had changed that. A new federal policy is generally priced at full risk.` },
    { q: 'Can a private flood policy cover more than 250,000 dollars?', a: `Yes. The federal building limit of ${K.usd(L.building)} for a house is set by law, but a private insurer can write a full policy with a higher limit, or an excess policy that pays above the federal one. Contents can likewise go above ${K.usd(L.contents)}. The price and the terms depend on each insurer.` },
    { q: 'How big is the private flood insurance market?', a: `Small but growing. The GAO reported in October 2026 that the private share of the flood insurance market went from ${K.pct(PR.privateShare2018, 0)} in 2018 to ${K.pct(PR.privateShare2025, 0)} in 2025. The federal program still had about ${K.dec(PR.policiesApril2026 / 1e6, 1)} million policies of all kinds in April 2026, with ${K.num(POL.n)} single-family policies in force on ${date}.` },
  ],
  tool: 'private',
  related: ['flood-insurance-rate-increase', 'flood-insurance-coverage-limits', 'buying-a-house-in-a-flood-zone', 'nfip'],
  sources: ['fdic_private', 'usc_4012a', 'usc_4015', 'gao_2026', 'usc_4013'],
});
