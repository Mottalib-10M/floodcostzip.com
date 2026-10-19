import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const N = K.N;
const POL = N.policies!;
const PR = K.P.program;
const W = K.P.waiting;
const cap = K.pct(K.P.caps.standard, 0);
const capHi = K.pct(K.P.caps.higher, 0);
const zA = (POL.zone as Record<string, { n: number; median: number; full: number }>).A;
const zV = (POL.zone as Record<string, { n: number; median: number; full: number }>).V;
// Worked case: a seller in an A zone pays the A-zone median; the full-risk bill is the A-zone full-risk median.
const keep = K.glide({ current: zA.median, full: zA.full, cap: K.P.caps.standard, fees: K.fees('primary') });
const rent = K.glide({ current: zA.median - K.fees('primary') + K.fees('other'), full: zA.full - K.fees('primary') + K.fees('other'), cap: K.P.caps.higher, fees: K.fees('other') });

export default defineGuide({
  id: 'buying-a-house-in-a-flood-zone',
  group: 'buy',
  order: 21,
  slug: 'buying-a-house-in-a-flood-zone',
  nav: 'Buying a house in a flood zone',
  card: "Read the seller's declarations page, keep the discount, and budget the next five bills.",
  title: 'Buying a House in a Flood Zone 2026: Keep the Seller Rate',
  description: `Buying a house in a flood zone in 2026: read the seller's bill and full-risk premium, take over the policy to keep its discount and budget the ${cap} steps ahead.`,
  h1: 'Buying a house in a flood zone: what the flood policy will cost you, and how to keep the seller’s rate',
  intro: "Enter the seller's flood bill and the full-risk premium from their declarations page: your next five bills.",
  resume: `When you buy a house in a high-risk flood zone with a mortgage, the lender will require flood insurance before closing, and the price you pay depends less on the house than on what happens to the seller's policy. The seller can assign the federal policy to you, or you can buy a new federal policy within one year of the sale: either way you keep the statutory discounts the seller had, and the bill keeps climbing by at most ${cap} a year toward the full-risk premium. Let the policy lapse instead and the next one is priced at full risk at once. Two figures on the seller's declarations page tell you what is coming: the premium paid and the Full-Risk Premium, which must always be shown. In A zones, the median single-family bill was ${K.usd(zA.median)} on ${K.day(N.policiesDate!)}, against a median full-risk bill of ${K.usd(zA.full)}; from there, ${keep.steps} more renewals of increases remain. If you will rent the house out, the cap becomes ${capHi} and the surcharge rises.`,
  body: (h) => `
<h2>Ask for the declarations page before you sign</h2>
<p>A listing says whether the house is in a flood zone; it rarely says what the flood policy costs. The document that does is the seller's declarations page. FEMA's manual requires every federal declarations page to show the Full-Risk Premium, "Always shown", and, when they apply, the Annual Increase Cap Discount, the Pre-FIRM discount and the Newly Mapped discount (${h.src('fema_manual', 'Flood Insurance Manual, Appendix I')}). The gap between the discounted premium and the full-risk premium is the increase still to come.</p>
<p>A seller who has no flood policy, or a policy only because the lender required it years ago, still gives you information: the house's flood zone, its elevation certificate if one exists, and its claim history, which you can ask about. A house with several past claims may be a severe repetitive loss property, which climbs ${capHi} a year rather than ${cap}.</p>
<h2>Keep the seller's discount: assignment or a new policy within a year</h2>
<p>Two routes keep the discounts. The seller can assign the policy to you: the assignment endorsement must be signed by the seller on or before closing, and you have until the closing date plus 29 days to send it to the insurer. Or you can buy a new federal policy that takes effect within one year of the sale, which receives any statutory discount the prior policyholder had, as long as the building was insured with building coverage at the time of the sale. Both rules are in FEMA's manual, and FEMA's pricing page sums it up: policyholders "are able to transfer their discount to a new owner" (${h.src('fema_pricing', 'FEMA')}).</p>
<p>What does not transfer is the seller's situation. The manual says the annual increase cap "is based on the information provided by the new owner": if the seller lived in the house and you will rent it out, the policy moves to the ${capHi} track for non-primary residences, and the HFIAA surcharge goes from ${K.usd(K.P.fees.hfiaa.primary)} to ${K.usd(K.P.fees.hfiaa.other)} (${h.src('usc_4014', '42 U.S.C. 4014(a)(2)')}).</p>
${h.table(['If you buy the A-zone median house', 'Main home', 'Rented out'], [['First bill after the sale', K.usd(keep.rows[0].cost), K.usd(rent.rows[0].cost)], ['Bill in year five', K.usd(keep.rows[4].cost), K.usd(rent.rows[4].cost)], ['Five bills added up', K.usd(keep.total), K.usd(rent.total)], ['Renewals before full risk', String(keep.steps), String(rent.steps)]], `A-zone medians of single-family policies in force on ${K.day(N.policiesDate!)}: bill ${K.usd(zA.median)}, full-risk bill ${K.usd(zA.full)}. Rented: same premium with the ${K.usd(K.P.fees.hfiaa.other)} surcharge and the ${capHi} cap.`, ['l', 'r', 'r'])}
<h2>Discounts tied to the house's history</h2>
<p>Two discounts depend on when the house was built or mapped. A Pre-FIRM building, built before the community's first flood map or by the end of 1974, can receive a Pre-FIRM discount on a new policy only if it is a primary residence, not a business and not a severe repetitive loss property; the discount then phases out year by year. A house newly mapped into a high-risk area can receive the Newly Mapped discount if the policy starts within ${PR.newlyMappedMonths} months of the map revision. Both are lost if a policy in the applicant's name lapses, with narrow exceptions. A buyer who was never named on the old policy is a different policyholder, so the seller's past lapse does not count against the buyer for the Pre-FIRM rule.</p>
<h2>No 30-day wait at closing</h2>
<p>A new federal policy normally starts ${W.days} days after it is bought. The exception that matters to a buyer: when the policy is bought in connection with making, increasing, extending or renewing a loan, there is no waiting period, and coverage starts at the closing, provided the application and the payment are made at or before closing (${h.src('cfr_61_6', '44 CFR 61.11')}).</p>
${h.mini('waiting', { t: 'Would the policy cover a flood shortly after you buy?', p: ['sit', 'days'], d: { sit: 'loan', days: 0 } })}
<h2>How much coverage the lender will require</h2>
<p>For a loan secured by a building in a special flood hazard area, the lender must require flood insurance at least equal to the outstanding principal or the maximum available for the type of building, whichever is less (${h.src('usc_4012a', '42 U.S.C. 4012a')}); for a house, that maximum is ${K.usd(K.P.limits.building)}. Contents coverage is not required by that rule; most owners add it anyway, and ${K.pct(POL.shareWithContents, 0)} of single-family policies carried some on ${K.day(N.policiesDate!)}. Houses facing the waves cost the most: in V zones the median bill was ${K.usd(zV.median)}.</p>
<p>To see the medians where you are buying, type the ZIP code in the ${h.a('home', 'lookup on the home page')}. The ${h.a('flood-zones-explained', 'flood zones page')} explains what each zone letter means, and the ${h.a('is-flood-insurance-required', 'mandatory purchase page')} who must buy.</p>
`,
  faqs: [
    { q: 'Can I take over the seller’s flood insurance when I buy a house?', a: `Yes, for a federal policy with building coverage. The seller signs an assignment endorsement on or before closing and you send it to the insurer within the closing date plus 29 days. You keep the discounted premium, but the yearly cap is recalculated on your own situation, so renting the house out puts it on the ${capHi} track.` },
    { q: 'What happens to the flood rate if the seller lets the policy lapse?', a: `If you buy a new federal policy that takes effect within one year of the sale, you still receive the statutory discounts the prior policyholder had, provided the building was insured with building coverage at the time of the sale. After that year, or without a prior policy, a new policy is generally priced at the full-risk premium.` },
    { q: 'Is there a waiting period for flood insurance bought at closing?', a: `No. When the federal policy is bought in connection with making, increasing, extending or renewing a mortgage loan, coverage starts at the closing, as long as the application and payment are made at or before closing. The usual ${W.days}-day wait applies to a policy bought on your own, for example after the sale.` },
    { q: 'How do I know how much the flood insurance will go up after I buy?', a: `Compare two lines of the seller's declarations page: the premium paid and the Full-Risk Premium, which every federal declarations page must show. If the second is higher, the premium climbs by up to ${cap} a year until it gets there, ${capHi} for a house you do not live in. The calculator on this page turns both into your next five bills.` },
  ],
  tool: 'glide',
  toolArg: { cur: zA.median, full: zA.full },
  related: ['is-flood-insurance-required', 'flood-insurance-second-home', 'flood-zones-explained', 'private-flood-insurance'],
  sources: ['fema_manual', 'fema_pricing', 'usc_4014', 'cfr_61_6', 'usc_4012a'],
});
