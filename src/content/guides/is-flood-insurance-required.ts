import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const N = K.N;
const POL = N.policies!;
const L = K.P.limits;
const date = K.day(N.policiesDate!);
const year = N.policiesDate!.slice(0, 4);
const [y0, y1] = N.claimYears;
const Z = POL.zone as Record<string, { n: number; median: number; full: number }>;
const polX = (Z.X?.n ?? 0) / POL.n;
// Paid single-family claims outside A and V zones (X, B, C and other), summed over the 50 states and DC.
let cAll = 0, cOut = 0;
for (const s of K.STATES) for (const [k, v] of Object.entries(s.claimsByZone ?? {})) { cAll += v?.n ?? 0; if (k !== 'A' && k !== 'V') cOut += v?.n ?? 0; }
const outShare = cAll ? cOut / cAll : 0;
// States where claims outside the high-risk zones weigh most (at least 2,000 paid claims).
const outOf = (s: (typeof K.STATES)[number]) => { const e = Object.entries(s.claimsByZone ?? {}); const t = e.reduce((a, [, v]) => a + (v?.n ?? 0), 0); return { t, o: t ? e.filter(([k]) => k !== 'A' && k !== 'V').reduce((a, [, v]) => a + (v?.n ?? 0), 0) / t : 0 }; };
const topOut = [...K.STATES].filter((s) => outOf(s).t >= 2000).sort((a, b) => outOf(b).o - outOf(a).o).slice(0, 3);
// Worked case: a 180,000 loan balance against the single-family building limit.
const bal = 180000;
const need = Math.min(bal, L.building);
const chance = K.pct(K.P.program.zoneAMortgageChance, 0);

export default defineGuide({
  id: 'is-flood-insurance-required',
  group: 'policy',
  order: 14,
  slug: 'is-flood-insurance-required',
  nav: 'Is it required?',
  card: `Who must carry flood insurance, how much, and the claims that come from outside the mapped zones.`,
  title: 'Flood Insurance Requirement 2026: Who Must Buy and How Much',
  description: `Flood insurance requirement in 2026: when a lender must make you buy a policy, the amount, federal aid rules, exceptions and claims outside A and V zones.`,
  h1: 'Is flood insurance required? The federal purchase rule and what it leaves out',
  intro: `Pick a state and a zone type: the median single-family bill on ${date} for the homes that buy in that kind of zone.`,
  resume: `Flood insurance is required by federal law when a building in a Special Flood Hazard Area, the A and V zones of FEMA's map, secures a loan from a federally regulated lender, a federal agency lender, or a loan sold to Fannie Mae or Freddie Mac, in a community where federal flood insurance is available. The rule is 42 U.S.C. 4012a and the zones are listed in 44 CFR 64.3(b). The amount must be at least the outstanding principal balance of the loan or the maximum coverage available for that type of building, whichever is less: ${K.usd(L.building)} for a house's structure. When federal financial assistance helped buy or build the house, the duty to keep a policy lasts for the life of the property, even after a sale. Outside A and V zones, no federal rule requires a policy. Yet those zones produced ${K.pct(outShare, 0)} of the single-family claims the program paid for floods of ${y0} to ${y1}.`,
  body: (h) => `
<h2>The rule in one sentence</h2>
<p>Under ${h.src('usc_4012a', '42 U.S.C. 4012a(b)')}, a regulated lender may not make, increase, extend or renew a loan secured by a building or a mobile home in an area FEMA has identified as having special flood hazards, in a community where flood insurance is available, unless the building is covered by flood insurance for the term of the loan. Each part of that sentence narrows it. It needs a loan: a house owned outright, with no mortgage, falls outside it. It needs a building in a mapped high-hazard area, the Special Flood Hazard Area. And it needs a participating community, since the rule refers to insurance made available under the National Flood Insurance Act.</p>
<p>Three kinds of lenders are bound: lending institutions regulated by the federal agencies (the FDIC, the OCC, the Federal Reserve, the NCUA and the Farm Credit Administration); federal agency lenders; and the government-sponsored enterprises, Fannie Mae and Freddie Mac, for the loans they buy. Since ${K.day(K.P.program.privateRuleDate)}, those lenders must also accept a private policy that meets the statutory definition, as the ${h.src('fdic_private', 'joint rule')} sets out and the ${h.a('private-flood-insurance', 'private flood insurance page')} explains.</p>

<h2>Which zones trigger it</h2>
<p>${h.src('cfr_64_3', '44 CFR 64.3(b)')} lists them: A, A1 to A30, AE, A99, AO, AH, the AR family, V, V1 to V30, VE and VO, plus the old M and E codes. Every one of those areas has at least a 1% chance of flooding in a given year, a ${chance} chance over a 30-year mortgage in FEMA's own terms. Zones X, B, C and D are not on the list. The ${h.a('flood-zones-explained', 'flood zones page')} explains each letter.</p>

<h2>How much coverage the lender can demand</h2>
<p>The required amount is the lesser of two figures: the outstanding principal balance of the loan, or the maximum coverage the program offers for that kind of building. For a single-family home the maximum is ${K.usd(L.building)} on the structure, so a borrower who owes ${K.usd(bal)} must carry at least ${K.usd(need)} of building coverage, and one who owes more than ${K.usd(L.building)} must carry the full ${K.usd(L.building)}. The house's market value is not the measure. Contents coverage enters the rule only when personal property secures the loan, along with the building.</p>
<p>Because the policy is bought at the closing in connection with the loan, the ${h.a('flood-insurance-waiting-period', 'usual waiting period')} does not apply: cover starts when the loan closes.</p>
${h.mini('waiting', { t: 'Bought at closing: when does cover start?', p: ['sit', 'days'], d: { sit: 'loan', days: 0 } })}

<h2>Federal assistance comes with a lasting condition</h2>
<p>The statute has a second trigger that has nothing to do with a mortgage. Under ${h.src('usc_4012a', '4012a(a)')}, no federal agency may approve financial assistance for acquisition or construction in a high-hazard area where flood insurance is available unless the building is insured. The statute adds that the requirement of maintaining flood insurance applies during the life of the property, regardless of transfer of ownership, so a buyer can take it over with the house. Asking the seller whether federal assistance was ever received on the building is the way to find out.</p>

<h2>The exceptions written in the law</h2>
<p>The statute exempts a few cases from the lender rule: property owned by a state that insures itself, very small loans with a repayment term of one year or less, and, on residential property, a structure detached from the main home that does not serve as a residence. A paid-off mortgage ends the federal requirement for that loan; a lapse of cover after that point does not cost a Pre-FIRM discount, under the manual's exception for owners who were no longer required to carry a policy.</p>

<h2>Outside the high-risk zones: no rule, real claims</h2>
<p>For a house in an X, B or C zone, no federal rule requires flood insurance, whatever the mortgage. Owners there buy by choice. On ${date}, X, B and C zones accounted for ${K.pct(polX, 0)} of the program's single-family policies, with a median bill of ${K.usd(Z.X?.median ?? 0)}, against ${K.usd(Z.A?.median ?? 0)} in A zones.</p>
<p>The claim files show why the zone line is not a dry line. Of the single-family claims paid for floods of ${y0} to ${y1}, ${K.pct(outShare, 0)} came from outside A and V zones. In some states the share is higher still: ${topOut.map((s) => `${h.a(`state:${s.slug}`, s.name)} (${K.pct(outOf(s).o, 0)})`).join(', ')}. These counts include only the owners outside the zones who held a policy when the water came.</p>
<p>The calculator at the top shows the median bill by zone type in any state, a starting point before asking a licensed agent for a quote on a specific house.</p>
`,
  faqs: [
    { q: 'Do I need flood insurance if my house is paid off?', a: `No federal rule requires it. The lender requirement of 42 U.S.C. 4012a applies only while a covered loan secures the building. One case still binds an owner without a mortgage: federal financial assistance once received to buy or build in a high-hazard area. The statute says the duty to keep flood insurance then lasts for the life of the property, whoever owns it. Outside that case, buying a policy is the owner's decision.` },
    { q: 'How much flood insurance does my mortgage lender require?', a: `At least the lesser of the outstanding principal balance and the program's maximum for the building, ${K.usd(L.building)} on a single-family home's structure. A borrower owing ${K.usd(bal)} must carry ${K.usd(need)} or more. The market value of the house does not enter the calculation, and contents coverage is needed only if personal property secures the loan.` },
    { q: 'Is flood insurance required in zone X?', a: `Not by federal law. Zones X, B, C and D are outside the Special Flood Hazard Area, and 44 CFR 64.3(b) lists only A and V zones and a few older codes for mandatory purchase. Owners there buy by choice, and their homes still produced ${K.pct(outShare, 0)} of the single-family claims paid for floods of ${y0} to ${y1}, counted with other zones outside A and V.` },
    { q: 'Does the flood insurance requirement pass to a new owner?', a: `The lender requirement belongs to each loan, so a buyer who finances a home in a high-hazard area faces it again at closing. A requirement tied to federal financial assistance is different: the statute says it applies for the life of the property, regardless of transfer of ownership, so the buyer takes it over with the house.` },
    { q: 'Can my lender accept a private flood policy instead of the NFIP?', a: `Yes. Since ${K.day(K.P.program.privateRuleDate)}, federally regulated lenders must accept a private policy that meets the statutory definition, which requires coverage at least as broad as the federal policy, and they may accept some others that meet set criteria. The policy must still carry the required amount.` },
  ],
  tool: 'zone',
  toolArg: { sx: 'texas', z: 'X' },
  related: ['flood-zones-explained', 'buying-a-house-in-a-flood-zone', 'private-flood-insurance', 'flood-insurance-waiting-period'],
  sources: ['usc_4012a', 'cfr_64_3', 'fdic_private', 'fema_zones', 'openfema_claims'],
});
