import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const N = K.N;
const POL = N.policies!;
const L = K.P.limits;
const D = K.P.deductibles;
const F = K.P.fees;
const date = K.day(N.policiesDate!);
const [y0, y1] = N.claimYears;
const u = K.usd;
// Worked case: a house that needs a full rebuild above the building limit, with a large contents loss.
const big = K.cover({ building: 400000, contents: 150000, deductible: D.residentialDefault });
// A smaller loss under both limits, at the highest residential deductible.
const mid = K.cover({ building: 60000, contents: 15000, deductible: D.residentialMax });

export default defineGuide({
  id: 'flood-insurance-coverage-limits',
  group: 'policy',
  order: 13,
  slug: 'flood-insurance-coverage-limits',
  nav: 'Coverage limits',
  card: `${u(L.building)} for the house, ${u(L.contents)} for belongings, and the deductibles.`,
  title: 'Flood Insurance Coverage Limits 2026: Building and Contents',
  description: `Flood insurance coverage limits in 2026: ${u(L.building)} building and ${u(L.contents)} contents on a home, larger buildings, ICC, deductibles and what the owner still pays.`,
  h1: 'Flood insurance coverage limits: the most a federal policy can pay',
  intro: `Enter the damage to the house and to its contents: the calculator applies the federal limits and the deductible and shows what stays with you.`,
  resume: `A federal flood policy on a single-family home, a two-to-four family building, a condo unit or a residential mobile home pays at most ${u(L.building)} for the building and ${u(L.contents)} for its contents. The limits are written in 42 U.S.C. 4013(b) and 44 CFR 61.6 and have no inflation clause. A residential building of five units or more can insure up to ${u(L.otherResidentialBuilding)} on the building but still only ${u(L.contents)} on contents; a non-residential building goes to ${u(L.nonResidentialBuilding)} and ${u(L.nonResidentialContents)}. Increased Cost of Compliance coverage adds up to ${u(L.icc)} to bring a badly damaged house up to code. Each coverage has its own deductible, from ${u(D.buildingMinSmall)} up to ${u(D.residentialMax)}. Most owners buy close to the top: on ${date}, ${K.pct(POL.shareBuildingAtMax, 0)} of single-family policies carried the full building limit and ${K.pct(POL.shareWithContents, 0)} included contents. On a ${u(400000)} rebuild with ${u(150000)} of lost belongings, the policy pays ${u(big.paid)} and the owner keeps ${u(big.uncovered)}.`,
  body: (h) => `
<h2>The limits by type of building</h2>
<p>The federal policy has no menu of plans. The owner picks two amounts, one for the structure and one for what is inside, each up to a ceiling fixed by ${h.src('usc_4013', 'the statute')} and repeated in ${h.src('cfr_61_6', 'the regulation')} and Table 24 of the ${h.src('fema_manual', 'Flood Insurance Manual')}. The ceiling depends on the occupancy of the building, not on its value.</p>
${h.table(['Building', 'Building limit', 'Contents limit'], [
  ['Single-family home, two-to-four family building, residential condo unit, residential mobile home', u(L.building), u(L.contents)],
  ['Other residential building (five units or more)', u(L.otherResidentialBuilding), u(L.contents)],
  ['Residential condominium building (whole association)', `Units × ${u(L.building)}, or replacement cost if lower`, u(L.contents)],
  ['Non-residential building', u(L.nonResidentialBuilding), u(L.nonResidentialContents)],
  ['Increased Cost of Compliance, added to the building coverage', u(L.icc), ''],
], 'Regular Program limits, FEMA Flood Insurance Manual, October 2025 edition, Table 24.', ['l', 'r', 'r'])}
<p>One line often surprises owners of apartment buildings: the building limit doubles once the property has five units or more, but the contents limit stays at the household figure. The larger contents ceiling is reserved for non-residential buildings, and for tenants of those buildings, who can insure their own contents per unit.</p>

<h2>How many owners buy the maximum</h2>
<p>In the OpenFEMA policy file, the median single-family policy on ${date} carried ${u(POL.medianBuilding)} of building coverage and ${u(POL.medianContents)} of contents, which are the two ceilings. ${K.pct(POL.shareBuildingAtMax, 0)} of single-family policies were written at the full building limit, and ${K.pct(POL.shareWithContents, 0)} included some contents coverage, so about one policy in five protects the walls but not the furniture, appliances and clothes. Contents is priced separately, and its share of the policy is the owner's choice.</p>
<p>The ceiling is below what many insured houses would cost to rebuild. In FEMA's 2023 single-family tables, the median replacement cost of insured homes was ${u(N.medianRcv)}, against a building limit of ${u(L.building)}. For a house in that middle, a total loss leaves a gap that no choice of deductible can close.</p>

<h2>A large loss, worked through</h2>
<p>Take a house that floods to the ceiling: rebuilding costs ${u(400000)} and ${u(150000)} of belongings are ruined, with the ${u(D.residentialDefault)} deductible on each coverage. The building payment stops at ${u(big.bLimit)} minus the deductible, ${u(big.buildingPaid)}; the contents payment stops at ${u(big.cLimit)} minus the deductible, ${u(big.contentsPaid)}. The policy pays ${u(big.paid)} in all. Of the ${u(big.uncovered)} left to the owner, ${u(big.overLimit)} is the part above the legal ceilings and the rest is the two deductibles. The calculator at the top of the page runs the same arithmetic on any figures.</p>

<h2>The deductibles</h2>
<p>Each policy has two deductibles, one taken from the building payment and one from the contents payment, under ${h.src('usc_4013', '42 U.S.C. 4013(d)')} and Table 26 of the manual. For a home, the lowest building deductible is ${u(D.buildingMinSmall)} on smaller building amounts and ${u(D.buildingMinLarge)} on larger ones, and the options rise in steps from ${u(D.residentialDefault)} to ${u(D.residentialMax)}. Contents deductibles run from ${u(D.buildingMinSmall)} to ${u(D.residentialMax)}, and a contents-only policy, the kind a renter buys, has a minimum of ${u(D.buildingMinSmall)}. A higher deductible lowers the premium. Lowering the deductible later is one of the changes that falls outside the yearly increase cap.</p>
<p>The deductible matters most on the small and middle-sized losses that make up most claims. On a ${u(60000)} building loss with ${u(15000)} of contents and the ${u(D.residentialMax)} deductible on each, the policy pays ${u(mid.paid)}: twice ${u(D.residentialMax)} stays with the owner. The national median paid single-family claim for floods of ${y0} to ${y1} was ${u(N.claims.median)}, building and contents together, as the ${h.a('average-flood-insurance-claim', 'claims page')} details.</p>

<h2>Increased Cost of Compliance</h2>
<p>When a community finds that repairing a flooded building would cost 50 percent or more of its market value before the flood, the building must be brought up to the community's floodplain rules. ${h.ext('https://www.fema.gov/floodplain-management/financial-help/increased-cost-compliance', 'Increased Cost of Compliance')} pays up to ${u(L.icc)} toward elevating it, relocating it, demolishing it or, mostly for non-residential buildings, floodproofing it. FEMA adjusts that claim separately from the flood damage claim. The coverage is built into the policy: its premium is ${K.pct(F.iccRate, 1)} of the building and contents premiums, capped at ${u(F.iccMax)}, and the median single-family policy paid ${u(POL.medianIcc)} for it in ${N.policiesDate!.slice(0, 4)}.</p>

<h2>Basements and what the policy leaves out</h2>
<p>Below-grade space has narrower cover. ${h.ext('https://www.floodsmart.gov/whats-covered', 'FloodSmart')} lists personal property kept in basements among what the policy does not protect, while the building coverage includes furnaces, water heaters, foundation walls and staircases. A finished basement with furniture and electronics is therefore mostly outside the contents coverage, whatever amount was bought.</p>
<p>What exceeds the federal ceilings is not covered by the federal policy at all. Some private insurers sell flood coverage above the federal limits, often called excess flood insurance, and some private policies replace the federal one entirely (${h.a('private-flood-insurance', 'private flood insurance')}). A licensed agent can say what is offered for a given address.</p>
${h.mini('monthly', { t: 'What each $1,000 of building coverage costs you', p: ['cur', 'cov'] })}
`,
  faqs: [
    { q: 'What is the maximum flood insurance coverage for a house?', a: `Under the federal program, ${u(L.building)} for the building and ${u(L.contents)} for its contents, for a single-family home, a two-to-four family building, a condo unit or a residential mobile home. Increased Cost of Compliance pays up to ${u(L.icc)} more toward elevating, moving or demolishing a substantially damaged home, in a claim adjusted separately. Higher amounts require a private policy.` },
    { q: 'Do I need to buy contents coverage with flood insurance?', a: `No federal rule requires it. A lender requires building coverage on a mortgaged home in a high-risk zone, but contents is optional and priced separately. On ${date}, ${K.pct(POL.shareWithContents, 0)} of single-family policies included contents, so about one in five owners had nothing to cover furniture, appliances or clothing after a flood.` },
    { q: `Can I choose a deductible above ${u(D.residentialMax)} on a home flood policy?`, a: `Not on the federal policy for a home. The deductible options stop at ${u(D.residentialMax)} for both building and contents on a single-family home, a two-to-four family building or a residential unit. Larger deductibles are available only on other residential and non-residential buildings. The lowest home building deductible is ${u(D.buildingMinSmall)} or ${u(D.buildingMinLarge)}, depending on the coverage amount.` },
    { q: 'Is a basement covered by flood insurance?', a: `Only in part. FloodSmart lists personal property kept in basements among the things the federal policy does not protect. Building items there, such as the furnace, the water heater, foundation walls and staircases, are covered under the building coverage. A finished basement's furniture and contents are therefore largely outside the policy.` },
    { q: 'How much can an apartment building insure under the NFIP?', a: `A residential building with five units or more, an other residential building, can insure up to ${u(L.otherResidentialBuilding)} on the structure, twice the single-family figure, but only ${u(L.contents)} on the owner's contents. A condominium association's policy can go up to the number of units times ${u(L.building)}, or the building's replacement cost if lower.` },
  ],
  tool: 'coverage',
  toolArg: { b: 400000, c: 150000 },
  related: ['average-flood-insurance-claim', 'private-flood-insurance', 'flood-insurance-for-renters', 'is-flood-insurance-required'],
  sources: ['usc_4013', 'cfr_61_6', 'fema_manual', 'openfema_policies'],
});
