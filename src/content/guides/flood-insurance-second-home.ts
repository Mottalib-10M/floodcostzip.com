import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const N = K.N;
const POL = N.policies!;
const F = K.P.fees;
const capLo = K.pct(K.P.caps.standard, 0);
const capHi = K.pct(K.P.caps.higher, 0);
const extra = F.hfiaa.other - F.hfiaa.primary;
// Worked case: the same premium gap (national median bill to its full-risk bill) on both tracks.
const prem = POL.median - K.fees('primary'), full = POL.full - K.fees('primary');
const main = K.glide({ current: prem + K.fees('primary'), full: full + K.fees('primary'), cap: K.P.caps.standard, fees: K.fees('primary') });
const other = K.glide({ current: prem + K.fees('other'), full: full + K.fees('other'), cap: K.P.caps.higher, fees: K.fees('other') });
const wide = K.glide({ current: 1000, full: 4000, cap: K.P.caps.higher, fees: K.fees('other') });
const wideMain = K.glide({ current: 1000, full: 4000, cap: K.P.caps.standard, fees: K.fees('primary') });
const nonPrimary = 1 - POL.sharePrimary;

export default defineGuide({
  id: 'flood-insurance-second-home',
  group: 'buy',
  order: 23,
  slug: 'flood-insurance-second-home',
  nav: 'Second homes and rentals',
  card: `A ${capHi} yearly cap instead of ${capLo}, and a ${K.usd(F.hfiaa.other)} surcharge instead of ${K.usd(F.hfiaa.primary)}.`,
  title: 'Flood Insurance for a Second Home 2026: the 25 % Track',
  description: `Flood insurance for a second home or a rental in 2026: increases up to ${capHi} a year instead of ${capLo}, a ${K.usd(F.hfiaa.other)} surcharge and no Pre-FIRM discount on new policies.`,
  h1: 'Flood insurance on a second home or a rental: a faster climb and a higher surcharge',
  intro: 'Enter the bill and the full-risk premium of a home you do not live in: its next five bills on the 25 % track.',
  resume: `A house that is not the owner's primary residence pays more for the same federal flood policy, in two ways. Its premium can rise by up to ${capHi} a year toward the full-risk price instead of ${capLo}, because 42 U.S.C. 4014(a)(2)(A) lists "any residential property which is not the primary residence of an individual" among the properties on the faster track. And it pays the HFIAA surcharge of ${K.usd(F.hfiaa.other)} a year instead of ${K.usd(F.hfiaa.primary)}, a difference of ${K.usd(extra)} that no cap limits. A primary residence, in FEMA's manual, is a home where the policyholder or the policyholder's spouse lives. Vacation homes, seasonal cottages and houses rented to tenants fall outside it. On a new policy, a pre-FIRM second home gets no Pre-FIRM discount. Starting from the national gap between the median bill and its full-risk bill, the same premium reaches full price in ${other.steps} renewals on the ${capHi} track against ${main.steps} for a main home. ${K.pct(nonPrimary, 0)} of single-family policies in force on ${K.day(N.policiesDate!)} were not on a primary residence.`,
  body: (h) => `
<h2>Which homes are on the ${capHi} track</h2>
<p>The yearly cap of ${capLo} in ${h.src('usc_4015', '42 U.S.C. 4015(e)')} excludes the properties described in ${h.src('usc_4014', '42 U.S.C. 4014(a)(2)')}, which instead climb by ${capHi} a year until they reach their full-risk premium. The first category of that list is a residential property that is not anyone's primary residence. The others are severe repetitive loss properties, properties whose flood claims have equaled or exceeded their market value, business properties, and buildings substantially damaged or improved by more than 50 % of their market value since July 6, 2012. A second home can fall into more than one category; the rate of climb is the same.</p>
<p>FEMA's manual defines the primary residence for the HFIAA surcharge: a single-family home, a residential unit or a two-to-four family building "in which the policyholder or the policyholder's spouse lives" (${h.src('fema_manual', 'Flood Insurance Manual, Table 34')}). A house you rent to a tenant is not your primary residence, even if it is the tenant's.</p>
<h2>The surcharge that never phases out</h2>
<p>The HFIAA surcharge, set by ${h.src('usc_4015a', '42 U.S.C. 4015a')}, is ${K.usd(F.hfiaa.primary)} a year on a primary residence and ${K.usd(F.hfiaa.other)} on all other policies. It is a fixed charge on top of the premium, outside the yearly cap, and it does not go away once the premium reaches full risk. The Federal Policy Fee, ${K.usd(F.federalPolicyFee.other)}, is the same on both. For a second home the fixed charges alone are ${K.usd(K.fees('other'))} a year.</p>
${h.table(['Same premium gap', 'Main home', 'Second home or rental'], [['First bill', K.usd(main.rows[0].cost), K.usd(other.rows[0].cost)], ['Bill in year five', K.usd(main.rows[4].cost), K.usd(other.rows[4].cost)], ['Five bills added up', K.usd(main.total), K.usd(other.total)], ['Renewals before full risk', String(main.steps), String(other.steps)]], `Premium of the national median bill (${K.usd(POL.median)} with the main-home charges) and of its full-risk bill (${K.usd(POL.full)}), single-family policies in force on ${K.day(N.policiesDate!)}; the second home pays the ${K.usd(F.hfiaa.other)} surcharge and climbs ${capHi} a year.`, ['l', 'r', 'r'])}
<p>The gap between the tracks grows with the distance to full risk. A premium that must quadruple, from ${K.usd(1000)} to ${K.usd(4000)} with the fixed charges, takes ${wideMain.steps} renewals on the ${capLo} track and ${wide.steps} on the ${capHi} track. The faster track reaches the same full-risk premium sooner; the end point differs only by the larger surcharge.</p>
<h2>Where the most expensive bills are</h2>
<p>The full-risk price follows the building, whoever lives in it. FEMA's rating looks at how often the place floods, the types of flooding it is exposed to (river overflow, storm surge, coastal erosion, heavy rainfall), its proximity to flood sources, and building characteristics such as the first floor height and the cost to rebuild (${h.src('fema_rr2_factsheet', 'FEMA fact sheet on Risk Rating 2.0')}). In V zones, coastal high hazard areas, the median single-family bill on ${K.day(N.policiesDate!)} was ${K.usd((POL.zone as Record<string, { median: number }>).V.median)}, the highest of any zone type. Of the single-family policies in force that day, ${K.pct(nonPrimary, 0)} were not on a primary residence, and each of them climbs on the faster track.</p>
<h2>No Pre-FIRM discount on a new policy</h2>
<p>A building put up before its community's first flood map can receive a Pre-FIRM discount on a new federal policy only if it qualifies as a primary residence, is not a commercial property and is not a severe repetitive loss property. FEMA's manual is explicit: Pre-FIRM non-primary residences "are not eligible for a Pre-FIRM discount on a new NFIP policy". An older beach house bought as a second home and insured under a new policy is priced at its full-risk premium.</p>
<h2>Buying a home you will not live in</h2>
<p>A buyer can take over the seller's federal policy by assignment, or buy a new one within a year of the sale, and keep the discounted premium the seller had. But the cap is recalculated on the buyer's situation: FEMA's manual says the annual increase cap "is based on the information provided by the new owner", and the insurer validates primary residence status at the time of assignment. A house that was the seller's main home moves to the ${capHi} track the day it becomes your rental. The ${h.a('buying-a-house-in-a-flood-zone', 'buying a house page')} shows the sequence for a buyer.</p>
${h.mini('five', { t: 'Five years on the second-home track', p: ['cur', 'full'], d: { use: 'other', cur: 1500, full: 3000 } })}
<h2>When a second home becomes your main home</h2>
<p>Status follows the use of the house, not its history. An owner who moves into a former second home and makes it the place where they or their spouse live meets FEMA's definition of a primary residence; the insurer has to validate that status, and what it accepts as proof is its own decision. Once validated, the policy pays the ${K.usd(F.hfiaa.primary)} surcharge. Ask the insurer when the ${capLo} track starts to apply: the manual does not set a single date for every case. The ${h.a('flood-insurance-rate-increase', 'rate increase page')} explains the cap itself, and the ${h.a('home', 'ZIP lookup')} gives the median bill around the house.</p>
`,
  faqs: [
    { q: 'Why does flood insurance cost more on a vacation home?', a: `Two federal rules. The premium of a home that is not anyone's primary residence can rise by up to ${capHi} a year toward its full-risk price, against ${capLo} for a main home, and it pays an HFIAA surcharge of ${K.usd(F.hfiaa.other)} a year instead of ${K.usd(F.hfiaa.primary)}. The flood risk of the house sets the full-risk price itself, whoever lives there.` },
    { q: 'Is a rental property a primary residence for flood insurance?', a: `Not for the owner. FEMA defines a primary residence as a home where the policyholder or the policyholder's spouse lives, so a house rented to a tenant is a non-primary residence of its owner. It pays the ${K.usd(F.hfiaa.other)} HFIAA surcharge and its premium climbs on the ${capHi} yearly track.` },
    { q: 'Can a second home get the Pre-FIRM discount?', a: `Not on a new policy. FEMA's manual limits the Pre-FIRM discount on a new federal policy to buildings that qualify as a primary residence and are neither commercial nor severe repetitive loss properties. A discount the seller already had can pass to a buyer by assignment of the policy, but the yearly cap is then recalculated on the buyer's own situation.` },
    { q: 'How much more is the flood surcharge on a second home?', a: `The HFIAA surcharge is ${K.usd(F.hfiaa.other)} a year on a second home or any policy that is not on a primary residence, against ${K.usd(F.hfiaa.primary)} on a primary residence, a difference of ${K.usd(extra)} a year. It is a fixed charge outside the yearly cap and stays even after the premium reaches its full-risk level.` },
  ],
  tool: 'glide',
  toolArg: { use: 'other' },
  related: ['buying-a-house-in-a-flood-zone', 'flood-insurance-rate-increase', 'private-flood-insurance', 'flood-insurance-calculator'],
  sources: ['usc_4014', 'usc_4015', 'usc_4015a', 'fema_manual'],
});
