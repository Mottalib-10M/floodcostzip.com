import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const N = K.N;
const POL = N.policies!;
const Z = POL.zone;
const date = K.day(N.policiesDate!);
const year = N.policiesDate!.slice(0, 4);
const mo = (x: number) => K.usd(x / 12);
const cents = (x: number) => `$${K.dec(x, 2)}`;
const per1k = (POL.median / POL.medianBuilding) * 1000;
const perDay = POL.median / 365;
const T = N.policiesTrend;
const first = T[0];
const last = T[T.length - 1];
const fees = K.fees('primary');
const feesOther = K.fees('other');

export default defineGuide({
  id: 'flood-insurance-cost-per-month',
  group: 'cost',
  order: 3,
  slug: 'flood-insurance-cost-per-month',
  nav: 'Cost per month',
  card: `The median flood bill spread over twelve months, per day and per ${K.usd(1000)} of coverage.`,
  title: 'Flood Insurance Cost per Month 2026: The Median Monthly Bill',
  description: `Flood insurance cost per month in 2026: the median single-family bill divided by twelve, per ${K.usd(1000)} of coverage, by zone, how escrow or yearly payment works.`,
  h1: 'Flood insurance cost per month: the yearly bill seen month by month',
  intro: `The median single-family flood bill of ${K.usd(POL.median)} a year on ${date} comes to ${mo(POL.median)} a month. Enter your own bill and coverage below.`,
  resume: `Spread over twelve months, the median single-family flood policy of the federal program cost ${mo(POL.median)} a month on ${date}, from a yearly bill of ${K.usd(POL.median)} that includes premium, Reserve Fund Assessment, surcharge and fee. That is about ${cents(perDay)} a day, or ${cents(per1k)} a year for each ${K.usd(1000)} of building coverage at the usual ${K.usd(POL.medianBuilding)} limit. By zone, the monthly equivalent was ${mo(Z.X.median)} in X, B and C zones, ${mo(Z.A.median)} in A zones and ${mo(Z.V.median)} in V zones. Monthly is still a way of reading the bill, not a way of paying it for most owners: a homeowner with a mortgage escrow pays through the monthly loan payment, and everyone else pays the year in advance. The law requires FEMA to offer monthly installments to policyholders who do not escrow, and FEMA's June 2026 fact sheet says the option is coming but does not give a start date.`,
  body: (h) => `
<h2>Twelve slices of one yearly bill</h2>
<p>A federal flood policy is written for one year and priced for one year. Talking about a monthly cost is only a way to compare it with a mortgage payment, a utility bill or a homeowners policy. At the national median, ${K.usd(POL.median)} a year becomes ${mo(POL.median)} a month. The average bill, ${K.usd(POL.avg)}, comes to ${mo(POL.avg)}, a little higher because a minority of houses pays far more than the rest.</p>
<p>Part of each month's share is fixed whatever the house. A main home pays ${K.usd(fees)} a year in flat charges (the Federal Policy Fee and the HFIAA surcharge), so ${mo(fees)} of every month goes to them before any premium. A second home or a rental pays ${K.usd(feesOther)} in the same charges, ${mo(feesOther)} a month. The Reserve Fund Assessment is not flat: it is ${K.pct(K.P.fees.reserveFundRate, 0)} of the discounted premium, so it grows with the premium.</p>
${h.table(['Zone type', `Median bill ${year}`, 'Per month', 'Per day'], [['X, B and C zones', K.usd(Z.X.median), mo(Z.X.median), cents(Z.X.median / 365)], ['A zones', K.usd(Z.A.median), mo(Z.A.median), cents(Z.A.median / 365)], ['V zones', K.usd(Z.V.median), mo(Z.V.median), cents(Z.V.median / 365)], ['All single-family policies', K.usd(POL.median), mo(POL.median), cents(perDay)]], `Single-family policies in force on ${date}, OpenFEMA. Total yearly cost divided by 12 and by 365.`, ['l', 'r', 'r', 'r'])}
<h2>The cost per ${K.usd(1000)} of coverage</h2>
<p>The second figure in the calculator divides the bill by the building coverage. At ${K.usd(POL.medianBuilding)} of coverage, which is both the legal maximum for a house and the most common choice (${K.pct(POL.shareBuildingAtMax, 0)} of policies), the median bill works out to ${cents(per1k)} for every ${K.usd(1000)} insured. The ratio is handy for comparing two quotes with different limits, or a federal policy with a private one.</p>
<p>It is not how the premium is built. FEMA rates the building from its flood exposure and its rebuilding cost, and the fixed charges do not shrink with a smaller limit, so halving the coverage does not halve the bill. A house worth far more than ${K.usd(K.P.limits.building)} cannot buy more building coverage from the federal program, so its cost per ${K.usd(1000)} of value is lower than its cost per ${K.usd(1000)} of coverage.</p>
<h2>How the bill is actually paid</h2>
<p>When a lender holds a mortgage on a house in a high-risk area, it must make sure flood insurance stays in force for the term of the loan (${h.src('usc_4012a', '42 U.S.C. 4012a')}). Many servicers collect the premium through an escrow account: a twelfth of the yearly amount is added to each mortgage payment, and the servicer pays the insurer once a year at renewal. For those owners the bill already feels monthly, even though the policy is paid in one sum.</p>
<p>Without escrow, the policyholder pays the insurer the full year before the policy starts or renews. Paying late has a price: a renewal paid ${K.P.program.lapseDays} days or more after the expiration date lets the policy lapse, a new application is needed, and the policy can lose its discounts, including the yearly increase cap, and be rated at its full-risk premium (FEMA ${h.src('fema_manual', 'Flood Insurance Manual')}, Section 5).</p>
<h2>Monthly installments: required by law, not yet offered</h2>
<p>The statute already says that FEMA "shall provide policyholders that are not required to escrow their premiums and fees" with the option of paying "annually or monthly" (${h.src('usc_4015', '42 U.S.C. 4015(g)')}), and the federal regulations now refer to a series of monthly premium installments (${h.src('cfr_61_6', '44 CFR 61.10')}). Under that rule, if a claim occurs before all installments are paid, the policyholder must pay the balance.</p>
<p>Putting it into practice is another matter. FEMA's fact sheet "NFIP Installment Payment Plans" of June 2026 says that FEMA "will soon require" all insurers in the program to offer the option and that it is working with them to launch it. The terms it describes for the launch are twelve monthly payments, no extra fee for choosing them, fees and surcharges included in the first payment, and no installments for escrowed policies or group policies. As of this page's date, no later FEMA document confirming the start has been found, so ask the insurer whether it offers installments before counting on them.</p>
<h2>The monthly figure will move</h2>
<p>The national median rose at each of the yearly snapshots of the policy file since 2023. It was ${K.usd(first.median)} a year (${mo(first.median)} a month) for single-family policies in force on ${K.day(first.date)}, and ${K.usd(last.median)} (${mo(last.median)} a month) on ${K.day(last.date)}. Policies still below their full-risk price keep rising at renewal, by up to ${K.pct(K.P.caps.standard, 0)} a year for a main home. To see your monthly share a few years out, add up the next five bills below and divide by sixty.</p>
${h.mini('five', { t: 'Your next five bills, to divide by sixty', p: ['cur', 'full', 'use'], d: { cur: POL.median, full: POL.full } })}
<p>The ${h.a('flood-insurance-rate-increase', 'rate increase guide')} explains the cap and what lies outside it, and the ${h.a('how-much-is-flood-insurance', 'price guide')} shows why one house pays several times the median of another.</p>
`,
  faqs: [
    { q: 'How much is flood insurance a month for a typical house?', a: `About ${mo(POL.median)} a month at the national median, from a yearly single-family bill of ${K.usd(POL.median)} on ${date}, fees included. In X, B and C zones the monthly equivalent was ${mo(Z.X.median)}, in A zones ${mo(Z.A.median)}. The amount is a way of reading a yearly bill: the policy is paid in one sum or through the mortgage escrow.` },
    { q: 'Can my lender add flood insurance to my monthly mortgage payment?', a: `Many servicers do, through an escrow account: they collect a twelfth of the yearly premium and fees with each payment and pay the insurer at renewal. A lender must keep coverage in force on a loan secured by a house in a high-risk area, and escrowed policies are excluded from the monthly installment plan FEMA is preparing.` },
    { q: 'Is there a fee for paying a federal flood policy in installments?', a: `FEMA's June 2026 fact sheet says there will be no additional fee for choosing monthly installments, with twelve payments and the fixed fees and surcharges included in the first one. The plan was described as coming soon, with no start date in that document, so the insurer is the one to confirm whether it is offered yet.` },
    { q: 'What is a good flood insurance cost per thousand dollars of coverage?', a: `There is no official benchmark. At the national median, a ${K.usd(POL.median)} bill on ${K.usd(POL.medianBuilding)} of building coverage is ${cents(per1k)} per ${K.usd(1000)}. The figure helps compare two quotes for the same house with different limits, but it hides the fixed charges and the building's own exposure, which drive the premium far more than the limit.` },
  ],
  tool: 'monthly',
  related: ['how-much-is-flood-insurance', 'flood-insurance-rate-increase', 'is-flood-insurance-required', 'flood-insurance-coverage-limits'],
  sources: ['openfema_policies', 'usc_4015', 'cfr_61_6', 'fema_manual', 'floodsmart_costs'],
});
