import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const N = K.N;
const POL = N.policies!;
const L = K.P.limits;
const D = K.P.deductibles;
const W = K.P.waiting;
// Worked case: a renter loses 30,000 dollars of belongings with a 1,000 dollar deductible.
const loss = 30000;
const r = K.cover({ building: 0, contents: loss, bCov: 0, deductible: D.buildingMinSmall });
const big = K.cover({ building: 0, contents: 140000, bCov: 0, deductible: D.buildingMinSmall });

export default defineGuide({
  id: 'flood-insurance-for-renters',
  group: 'buy',
  order: 22,
  slug: 'flood-insurance-for-renters',
  nav: 'Flood insurance for renters',
  card: `A contents-only policy: up to ${K.usd(L.contents)} for your belongings, whoever owns the building.`,
  title: 'Flood Insurance for Renters 2026: Contents Up to $100,000',
  description: `Flood insurance for renters in 2026: a contents-only federal policy pays up to ${K.usd(L.contents)} for belongings, with a ${K.usd(D.buildingMinSmall)} minimum deductible and a ${W.days}-day wait.`,
  h1: 'Flood insurance for renters: covering your belongings when you do not own the building',
  intro: 'Enter the value of the belongings a flood could ruin: what a contents-only policy would pay, after the deductible.',
  resume: `A renter can buy federal flood insurance for belongings alone. The policy is called contents-only: it has no building coverage, because the building belongs to the landlord, and it pays up to ${K.usd(L.contents)} for furniture, clothing, electronics and appliances that you own, the legal limit for residential contents (42 U.S.C. 4013(b)). A contents-only policy carries a deductible of at least ${K.usd(D.buildingMinSmall)}, and like any new federal policy it starts ${W.days} days after you apply and pay. Renters insurance does not fill the gap: standard renters and homeowners policies exclude flood damage, which is why the federal program exists. The landlord's flood policy, if there is one, covers the walls, floors, wiring and built-in fixtures, not your things. On a loss of ${K.usd(loss)} of belongings, a contents-only policy with the minimum deductible would pay ${K.usd(r.contentsPaid)}. Belongings are paid at their depreciated value, so a five-year-old sofa is not paid as a new one.`,
  body: (h) => `
<h2>What a contents-only policy is</h2>
<p>The federal Standard Flood Insurance Policy has two separate coverages: building and contents, each with its own limit and its own deductible (${h.src('usc_4013', '42 U.S.C. 4013')}). A tenant buys the second one alone. The limit is ${K.usd(L.contents)} for a residential unit, the same as for a homeowner. FEMA's manual sets the deductible floor for contents-only policies: "Contents-only policies (policies with no building coverage) receive a minimum ${K.usd(D.buildingMinSmall)} deductible", with higher options of ${K.usd(2000)}, ${K.usd(5000)} and ${K.usd(D.residentialMax)} (${h.src('fema_manual', 'Flood Insurance Manual, Table 26')}). A higher deductible lowers the premium, and raises what you pay yourself after each flood.</p>
<p>The policy follows the tenant's belongings at the insured address. It is priced like any federal policy under the current method, on the building's location and exposure, and a renter in a high-risk zone pays more than one on a hill, for the same belongings.</p>
<h2>What it pays, and what it does not</h2>
<p>Contents are paid at actual cash value: replacement cost minus depreciation. The calculator above applies the limit and the deductible to the amount you enter; the depreciation of your own items is not modeled, so treat its result as an upper bound.</p>
${h.table(['Belongings lost', 'Deductible', 'Paid by the policy', 'Left with you'], [[K.usd(loss), K.usd(D.buildingMinSmall), K.usd(r.contentsPaid), K.usd(r.uncovered)], [K.usd(140000), K.usd(D.buildingMinSmall), K.usd(big.contentsPaid), K.usd(big.uncovered)]], `Before depreciation. Contents limit ${K.usd(L.contents)} for a residential unit (42 U.S.C. 4013(b)).`, ['r', 'r', 'r', 'r'])}
<p>Three limits surprise renters. First, a basement apartment or a basement storage room has narrow cover: in a basement the federal policy covers only a short list of contents, and most furniture and electronics kept there are not on it. Second, cash, valuable papers and vehicles are excluded. Third, the policy pays for direct flood damage, not for a hotel while the unit dries out; some private policies add that cover, at a price.</p>
<h2>The landlord's policy is not yours</h2>
<p>If the building has a federal flood policy, it covers the structure: walls, floors, stairways, the furnace, the water heater, built-in appliances and cabinets. It does not pay a tenant for anything the tenant owns. Ask the landlord whether the building is insured: the answer tells you whether repairs to the unit will be funded after a flood, not whether your things will be replaced. In a high-risk zone, a building with a mortgage from a regulated lender must be insured (${h.src('usc_4012a', '42 U.S.C. 4012a')}), but that requirement protects the lender's collateral, not your belongings.</p>
${h.mini('waiting', { t: 'If you buy a contents-only policy today, when would it pay?', p: ['days'], d: { sit: 'standard', days: 20 } })}
<h2>The ${W.days}-day wait applies to renters too</h2>
<p>The exception that lets a homebuyer's policy start at closing is tied to a loan; a tenant has none. A renter's new policy starts at 12:01 a.m. on the ${W.days}th day after the application and payment (${h.src('cfr_61_6', '44 CFR 61.11')}). Moving into a ground-floor unit in hurricane season is the moment to apply, not the week a storm is named.</p>
<h2>Choosing the amount of contents coverage</h2>
<p>The right amount is what it would cost to refurnish the unit, not the ${K.usd(L.contents)} maximum. A quick inventory, room by room, usually lands well below the limit for a one-bedroom apartment and close to it for a family house. Because the policy pays depreciated value, a tenant whose furniture is old can choose a lower amount and a lower premium without losing much in a claim. The opposite case is a renter with expensive equipment at home: above ${K.usd(L.contents)}, only a private policy can cover the rest.</p>
<p>Photographs of each room and the receipts of large purchases, kept outside the home or online, make a claim faster to settle. After a flood, the adjuster works from a list of damaged items with their age and price; a tenant who has to rebuild that list from memory usually ends up claiming less than was lost.</p>
<h2>How common it is</h2>
<p>Most federal flood policies are bought by owners. Among the ${K.num(POL.n)} single-family policies in force on ${K.day(N.policiesDate!)}, ${K.pct(POL.shareWithContents, 0)} carried contents coverage alongside the building. The figures of this site describe policies on single-family homes as a whole and do not isolate contents-only policies, so no median renter premium is shown here. For a price, a licensed agent or the insurer that sells your renters policy can quote a contents-only flood policy for your address.</p>
<p>The ${h.a('flood-insurance-coverage-limits', 'coverage limits page')} explains how building and contents limits work together, and the ${h.a('flood-insurance-waiting-period', 'waiting period page')} gives every exception to the ${W.days} days.</p>
`,
  faqs: [
    { q: 'Can a renter buy flood insurance?', a: `Yes. A tenant can buy a federal flood policy with contents coverage only, up to ${K.usd(L.contents)} for the belongings the tenant owns at the insured address. The landlord's permission is not needed, because the policy covers the tenant's property, not the building. Private insurers also sell flood cover for renters, on their own terms.` },
    { q: 'Does renters insurance cover flood damage?', a: `Standard renters and homeowners policies exclude damage from flooding, which is why a separate flood policy exists. Water from a burst pipe inside the unit is a different peril, usually covered by renters insurance; water that rises from outside is flood. Read the exclusions of your own renters policy to see where it draws the line.` },
    { q: 'What deductible applies to a contents-only flood policy?', a: `FEMA's manual sets a minimum deductible of ${K.usd(D.buildingMinSmall)} for policies with no building coverage. Higher options go up to ${K.usd(D.residentialMax)}. The deductible is subtracted from the loss before the ${K.usd(L.contents)} limit applies, and a higher deductible lowers the premium but leaves more of each claim to you.` },
    { q: 'Is my apartment covered by my landlord’s flood insurance?', a: `The building is, if the landlord has a flood policy: walls, floors, wiring, the furnace and built-in appliances. Your furniture, clothing, electronics and other belongings are not. The landlord's policy pays the owner of the building, and nothing in it protects the tenant's property. Only a contents policy in your own name does.` },
  ],
  tool: 'coverage',
  toolArg: { b: 0, c: 30000, d: D.buildingMinSmall },
  related: ['flood-insurance-coverage-limits', 'flood-insurance-waiting-period', 'how-much-is-flood-insurance', 'nfip'],
  sources: ['usc_4013', 'fema_manual', 'cfr_61_6', 'usc_4012a'],
});
