import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const N = K.N;
const POL = N.policies!;
const W = K.P.waiting;
const lapse = K.P.program.lapseDays;
const date = K.day(N.policiesDate!);
// Worked cases with the engine: a flood 20 days after a voluntary purchase, the same flood after a closing.
const early = K.waiting('standard', 20);
const atLoan = K.waiting('loan', 0);
const mapCase = K.waiting('map', 2);
const g = K.glide({ current: POL.median, full: POL.full, cap: K.P.caps.standard, fees: K.fees('primary') });

export default defineGuide({
  id: 'flood-insurance-waiting-period',
  group: 'policy',
  order: 12,
  slug: 'flood-insurance-waiting-period',
  nav: 'Waiting period',
  card: `The ${W.days}-day rule, its three exceptions and what a late renewal costs.`,
  title: `Flood Insurance Waiting Period 2026: ${W.days} Days and Exceptions`,
  description: `Flood insurance waiting period in 2026: the ${W.days}-day rule of the federal policy, the loan, map change and wildfire exceptions, added coverage and late renewals.`,
  h1: 'The flood insurance waiting period: when a new federal policy starts to pay',
  intro: `Choose how the policy is bought and how many days later the water arrives: the calculator says whether that flood would be covered.`,
  resume: `A new federal flood policy does not pay for a flood in its first ${W.days} days. The rule comes from 42 U.S.C. 4013(c) and 44 CFR 61.11: cover begins at 12:01 a.m. on the ${W.days}th calendar day after the application is complete and the premium is paid, so a policy bought when a storm is forecast usually starts too late. The same wait applies when an owner raises the coverage of an existing policy. Three exceptions shorten it. Cover bought in connection with making, increasing, extending or renewing a mortgage loan starts at the closing, with no wait, if it is applied for and paid by then. Cover bought in the ${W.mapRevisionMonths} months after a map revision newly puts the building in a high-risk area starts after ${W.mapRevisionDays} day; the statute itself says one year. And after a wildfire on federal land, cover bought up to ${W.wildfirePurchaseWindowDays} days after containment starts after ${W.wildfireWaitDays} day. Renewals are a separate matter: a premium paid ${lapse} days or more after expiration means a lapse, a new application and the full-risk price.`,
  body: (h) => `
<h2>Why the federal policy has a wait at all</h2>
<p>Floods often give some warning: a river crests after rain upstream, a hurricane is tracked for days. An insurance pool cannot work if cover is bought only once the water is on its way, and the federal policy answers that with a delay. The text sits in ${h.src('usc_4013', '42 U.S.C. 4013(c)')} and applies to contracts entered into after September 23, 1994: new coverage, and any change that adds coverage, takes effect when the ${W.days}-day period that begins once all obligations are met has run out. Those obligations are the completed application and the payment of the first premium.</p>
<p>The regulation, ${h.src('cfr_61_6', '44 CFR 61.11')}, turns this into a clock time: 12:01 a.m., local time, on the ${W.days}th calendar day after the application date and the presentment of payment. Day one is the day after the application. A flood ${K.num(20)} days after a voluntary purchase is therefore outside the policy: the calculator gives "${early.covered ? 'covered' : 'not covered'}", with ${K.num(early.gap)} days still to run.</p>

<h2>Exception one: buying at a mortgage closing</h2>
<p>When the policy is bought in connection with making, increasing, extending or renewing a loan secured by the building, the wait does not apply. Cover starts at the time of the loan closing, provided the written request has reached the program and the application and payment were made at or before the closing. This is the case of most purchases in a high-risk zone, where the lender requires the policy anyway (see ${h.a('is-flood-insurance-required', 'when flood insurance is required')}). In the calculator, the same flood on closing day gives "${atLoan.covered ? 'covered' : 'not covered'}". The exception covers the initial purchase tied to the loan; a homeowner who later decides to add coverage on the same house waits ${W.days} days for the added part.</p>

<h2>Exception two: a new flood map</h2>
<p>When FEMA revises a map and a building that was outside the Special Flood Hazard Area is now inside it, the owner gets a short window. The ${h.src('fema_manual', 'Flood Insurance Manual')} and the regulation set the wait at ${W.mapRevisionDays} day during the first ${W.mapRevisionMonths} months after the revised map takes effect. The statute words it differently: a one-year period that begins when notice of the revision is published. The regulation is the version insurers apply. A policy bought ${K.num(2)} days before a flood in that window is ${mapCase.covered ? 'covered' : 'not covered'}. The same remapping can also open the Newly Mapped discount, which applies when the policy takes effect within ${K.P.program.newlyMappedMonths} months of the map revision.</p>

<h2>Exception three: after a wildfire on federal land</h2>
<p>Flooding that follows a fire can start on public land and reach private homes below, and the statute has a case for it. If the flood originates on federal land, post-wildfire conditions caused or worsened it, and the owner bought the new or increased coverage on or before the fire containment date or within ${W.wildfirePurchaseWindowDays} calendar days after it, the wait is ${W.wildfireWaitDays} day. FEMA decides whether a given flood meets those conditions.</p>

<h2>Adding coverage to a policy you already have</h2>
<p>An endorsement that raises the building or contents amount follows the ${W.days}-day rule for the added part, unless it is tied to a loan. The existing coverage keeps running in the meantime, so a flood during the wait is paid up to the old amounts. The ${h.a('flood-insurance-coverage-limits', 'coverage limits page')} explains how far the amounts can go.</p>
${h.mini('coverage', { t: 'What the policy pays on a large loss', p: ['b', 'c'], d: { b: 180000, c: 40000 } })}

<h2>Renewal: the grace period and the lapse</h2>
<p>The waiting period applies to new and added coverage, not to a renewal paid on time. FEMA's manual sets the line at ${lapse} days: paying the renewal premium ${lapse} days or more after the expiration date causes a lapse in coverage. A new application is then required, the policy is rated at its full-risk premium, and the statutory discounts, including the annual increase cap, may be lost. The renewal notice states the amount of the cap discount at stake.</p>
<p>For a typical policy that loss is large. On ${date}, ${K.pct(POL.capped, 0)} of single-family policies still paid less than their full-risk premium; at the national medians, the gap between ${K.usd(POL.median)} and ${K.usd(POL.full)} would otherwise close over ${g.steps} capped renewals. The calculator below adds up the next five bills of a policy that stays on its capped path.</p>
${h.mini('five', { t: 'Five bills ahead, kept on the capped path', p: ['cur', 'full'] })}
<p>Everything above concerns the federal policy. A private flood policy is a different contract, compared on the ${h.a('private-flood-insurance', 'private flood insurance page')}; its own terms, which a licensed agent can show, say when it begins.</p>
`,
  faqs: [
    { q: 'Can I buy flood insurance when a hurricane is coming?', a: `You can apply, but a federal policy bought on your own starts after ${W.days} days, so it will not pay for a storm that arrives within that time. The wait is shorter only when the purchase is tied to a mortgage closing, follows a map revision that newly put the building in a high-risk area, or follows a wildfire on federal land.` },
    { q: 'Does the waiting period apply when I buy a house?', a: `Not when the policy is bought in connection with the loan. If it is applied for and paid at or before the closing, the federal policy starts at the time of the loan closing, with no wait. A buyer paying cash with no loan follows the standard ${W.days}-day rule, as does any coverage added after the closing.` },
    { q: 'When does a federal flood policy start exactly?', a: `At 12:01 a.m., local time, on the ${W.days}th calendar day after the application date and the presentment of the premium payment, under 44 CFR 61.11. The statute counts the ${W.days} days from the date all obligations, application and payment, are completed. Under the map revision and wildfire exceptions, it starts at 12:01 a.m. on the first calendar day after.` },
    { q: 'What if I pay my flood insurance renewal late?', a: `If the renewal premium is paid ${lapse} days or more after the expiration date, coverage lapses. A new application is then needed and the policy is rated at its full-risk premium, which can mean losing the annual increase cap and other statutory discounts. A renewal paid before that point keeps the policy and its discounts.` },
    { q: 'Is there a waiting period to increase flood coverage?', a: `Yes, the same ${W.days} days apply to the added amount, unless the increase is made in connection with a loan, such as a refinance or a larger mortgage, in which case it starts at closing. The coverage already in force continues during the wait, so a flood in that time is paid up to the earlier amounts.` },
  ],
  tool: 'waiting',
  toolArg: { sit: 'standard', days: 20 },
  related: ['is-flood-insurance-required', 'flood-insurance-coverage-limits', 'nfip', 'buying-a-house-in-a-flood-zone'],
  sources: ['usc_4013', 'cfr_61_6', 'fema_manual', 'floodsmart_costs'],
});
