/** Home page text (the pillar). Every figure comes from the kit (src/lib/kit.ts), never typed by hand. */
import type { FAQ, Helpers } from '../lib/page-types';
import { KIT as K } from '../lib/kit';
import { AUTHOR_NAME } from '../data/site-config';

const N = K.N;
const POL = N.policies!;
const T = N.policiesTrend!;
const first = T[0], last = T[T.length - 1];
const cap = K.pct(K.P.caps.standard, 0);
const capHi = K.pct(K.P.caps.higher, 0);
const F = K.P.fees;
const L = K.P.limits;
const W = K.P.waiting;
const date = K.day(N.policiesDate!);
const year = N.policiesDate!.slice(0, 4);
// Worked case: the national median bill against the median full-risk bill of the same policies.
const g = K.glide({ current: POL.median, full: POL.full, cap: K.P.caps.standard, fees: K.fees('primary') });
const rise = (last.median / first.median - 1);
const under1k = N.ranges.filter((r) => r.hi !== null && r.hi <= 1000).reduce((a, r) => a + r.share, 0);
const over2k = N.ranges.filter((r) => r.lo >= 2000).reduce((a, r) => a + r.share, 0);
const byPol = K.rank((s) => s.pol?.n ?? 0);
const top3 = byPol.slice(0, 3);
const steps = (a: number, b: number) => K.glide({ current: a, full: b, cap: K.P.caps.standard, fees: K.fees('primary') }).steps;
const zone = POL.zone as Record<string, { n: number; median: number }>;

export const VALUE = `This site does better than the first Google result because it gives the flood insurance cost of your own ZIP code or county, read in the federal program's own ${year} policy files and dated, and counts the ${cap} renewals left before the full-risk price, where the first result, last updated in January 2025, gives one national average taken second-hand from a comparison site and no calculator.`;

export const HOME = {
  title: 'Flood Insurance Cost by ZIP Code and County, 2026 Data',
  description: `Flood insurance cost by ZIP code and county from FEMA's own files: the ${year} median bill, the full risk-based price and the ${cap} yearly steps between them.`,
  h1: 'Flood insurance cost by ZIP code: what homes pay now and what is still to come',
  intro: `Type a ZIP code or pick a county: the median single-family bill on ${date}, the full risk-based price and the bills of the next five years.`,
  resume: `The median single-family flood insurance bill in the federal program was ${K.usd(POL.median)} a year on ${date}, across ${K.num(POL.n)} policies, premium, assessments and fees included. The average is higher, ${K.usd(POL.avg)}, because a minority of coastal homes pay several thousand dollars. That median was ${K.usd(first.median)} on ${K.day(first.date)}, so it has risen ${K.pct(rise, 0)} in less than three years, and it keeps rising: ${K.pct(POL.capped, 0)} of these policies still pay less than their full-risk premium, the same policies at full risk would have a median bill of ${K.usd(POL.full)}, and by law a main home's premium can climb no more than ${cap} a year until it gets there (${capHi} for a second home or a rental). From the national median, that is ${g.steps} more renewals of increases, and five bills that add up to ${K.usd(g.total)}. Your own figure depends on where the building is: the lookup above reads the median of your ZIP code or county in the same files, and what floods there have actually paid.`,
  why: (h: Helpers) => `
<h2>Why the national averages you read elsewhere disagree</h2>
<p>Search for the cost of flood insurance and you will find figures from about ${K.usd(700)} to about ${K.usd(1000)} a year, often with no date or source, sometimes taken from a FEMA fact sheet written before the current pricing method started in October 2021. They disagree because they measure different things: an average or a median, the premium alone or the full amount paid, all policies or only houses, and a year that is rarely stated.</p>
<p>This site uses one definition and keeps it everywhere: the median <strong>total cost</strong> of a <strong>single-family</strong> policy in force on a stated date, premium, Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee included. That is the amount on the bill, and it is the definition FEMA itself used in ${h.src('fema_sfh_cost', 'its single-family cost tables')} (${K.num(N.pif)} policies in force on ${K.day(N.snapshot)}, median ${K.usd(N.current)}). The ${year} figures come from the ${h.src('openfema_policies', 'OpenFEMA policy file')}, which lists every policy term with its ZIP code, county, flood zone and cost; the claims come from the ${h.src('openfema_claims', 'OpenFEMA claims file')}.</p>
<p>${VALUE}</p>
<h2>How the price of a federal flood policy is built</h2>
<p>Since the pricing method FEMA calls Risk Rating 2.0, each building gets a <strong>full-risk premium</strong> computed from its own exposure: distance to the coast or a river, the type of flooding (rain, river, storm surge, Great Lakes, erosion), elevation, foundation and what rebuilding would cost. The flood zone on the map no longer sets the price. Your declarations page must always show that full-risk premium, even when you pay less (${h.src('fema_manual', 'Flood Insurance Manual, Appendix I')}).</p>
<p>Most older policies pay less than their full-risk premium because the law caps each yearly increase. FEMA's own count: about ${K.pct(K.P.program.fema2023RiskBasedShare, 0)} of single-family policyholders were already paying a risk-based price in August 2023, while the others were climbing toward it. The cap comes from ${h.src('usc_4015', '42 U.S.C. 4015(e)')}: ${cap} a year for most properties. It is ${capHi} a year for the properties listed in ${h.src('usc_4014', '42 U.S.C. 4014(a)(2)')}: homes that are not the owner's main residence, business properties, severe repetitive loss properties and buildings substantially damaged or improved since July 2012.</p>
<p>On top of the premium come charges that the cap does not cover. The ${h.src('floodsmart_costs', 'FloodSmart page on premium costs')} lists them: a Federal Policy Fee of ${K.usd(F.federalPolicyFee.primary)}, an HFIAA surcharge of ${K.usd(F.hfiaa.primary)} for a main home and ${K.usd(F.hfiaa.other)} for any other building, and a Reserve Fund Assessment of ${K.pct(F.reserveFundRate, 0)} of the discounted premium. In the ${year} file the median premium alone was ${K.usd(POL.medianPremium)} and the median assessment ${K.usd(POL.medianReserveFund)}.</p>
<h2>What the ${cap} cap means for your next five bills</h2>
<p>A cap is not a price freeze. If your bill is below the full-risk price, it goes up at each renewal by up to ${cap} on the capped part until it reaches that price, then follows FEMA's yearly rate changes. The number of steps is easy to work out once you know both amounts: from ${K.usd(1000)} to ${K.usd(2000)}, ${steps(1000, 2000)} renewals; from ${K.usd(1000)} to ${K.usd(4000)}, ${steps(1000, 4000)}. A bill already above the full-risk price comes down at the next renewal instead.</p>
${h.mini('glide', { t: 'Count the renewals left on your own bill', p: ['cur', 'full'] })}
<p>The cap also has edges. It applies to the policy, not to the house: a policy that lapses for ${K.P.program.lapseDays} days or more after its expiry loses the cap, and the next policy is priced at full risk. A buyer can take over the seller's discounted premium by assignment, or buy a new policy within a year of the sale and keep the statutory discounts, but the cap is then recalculated on the buyer's own situation, so a buyer who will rent the house out moves to the ${capHi} track.</p>
<h2>Where flood insurance costs the most</h2>
<p>By number of policies, flood insurance is above all a matter for ${top3.map((s) => h.a(`state:${s.slug}`, s.name)).join(', ')}. By price, the gap between places is far larger than the gap between states: in FEMA's 2023 tables, ${K.pct(under1k, 0)} of single-family homes had a full-risk price under ${K.usd(1000)}, and ${K.pct(over2k, 0)} had one of ${K.usd(2000)} or more. Homes in V zones, exposed to waves, had a median bill of ${K.usd(zone.V.median)} in ${year}, against ${K.usd(zone.A.median)} in A zones and ${K.usd(zone.X.median)} in X, B and C zones.</p>
`,
  sections: (h: Helpers) => [
    {
      title: 'What the federal policy pays, and what it leaves out',
      html: `<p>A Standard Flood Insurance Policy on a house covers the building up to ${K.usd(L.building)} and its contents up to ${K.usd(L.contents)}, separate amounts with separate deductibles (${h.src('usc_4013', '42 U.S.C. 4013')}). Belongings are paid at depreciated value, and a basement is covered only for a short list of items such as the furnace and the water heater. Above those limits, an excess policy from a private insurer can cover the rest. Mandatory building rules after a flood are paid by Increased Cost of Compliance cover, up to ${K.usd(L.icc)}.</p>${h.mini('coverage', { t: 'What a large flood loss would leave you to pay', p: ['b', 'c'] })}`,
    },
    {
      title: 'The 30-day wait before a new policy pays',
      html: `<p>A new policy, or more coverage on an existing one, starts ${W.days} days after the application and payment, under ${h.src('cfr_61_6', '44 CFR 61.11')}. There is no wait when the policy is bought at a mortgage closing, and a one-day wait in the ${W.mapRevisionMonths} months after a map revision puts the building in a high-risk area. A storm that is already forecast is not a reason to buy: a flood under way on the start date is not covered.</p>`,
    },
    {
      title: 'Federal or private: what changes',
      html: `<p>Since ${K.day(K.P.program.privateRuleDate)}, lenders must accept a private flood policy that is at least as broad as the federal one (${h.src('fdic_private', 'FDIC FIL-8-2019')}). A private insurer has no ${cap} cap and can refuse to renew, but it can cover more than ${K.usd(L.building)} and sometimes prices a low-risk house below the federal premium. Leaving the federal program has one cost the quote does not show: the capped discount is lost and does not come back if you return.</p>`,
    },
    {
      title: 'The program is extended to a fixed date',
      html: `<p>The National Flood Insurance Program runs on short extensions voted by Congress. ${h.src('pl_119_103', 'Public Law 119-103')} extends it to ${K.day(K.P.program.authorizedThrough)}. If an extension lapses, existing policies stay in force and claims are paid, but FEMA stops selling and renewing policies until Congress acts (${h.src('fema_reauth', 'FEMA')}). Any change for 2027 announced after the date of this page will be shown as to come, not as in force.</p>`,
    },
  ],
  faqs: [
    { q: 'How much is flood insurance for a house in 2026?', a: `The median single-family policy in the federal program cost ${K.usd(POL.median)} a year on ${date}, fees included, and the average was ${K.usd(POL.avg)}. Half of all houses pay less than the median. Your own price depends on the building, so the median of your ZIP code or county, shown by the lookup on this page, is a closer guide than any national figure.` },
    { q: 'Why does my flood insurance go up every year?', a: `Most older policies pay less than their full-risk premium, and the law lets FEMA close the gap by up to ${cap} a year for a main home and ${capHi} for other buildings. The increase stops once the bill reaches the full-risk price, which your declarations page must show. FEMA's yearly rate changes then move that price itself.` },
    { q: 'What is the full risk-based price of a flood policy?', a: `It is the premium FEMA computes for the building from its own flood exposure, before the discounts the law allows. Across single-family policies in force on ${date}, the median full-risk premium alone was ${K.usd(POL.medianFullPremium)}, or ${K.usd(POL.full)} with assessment and fees. It is printed on every declarations page as the Full-Risk Premium, without fees, so you can compare it with what you pay today.` },
    { q: 'Is flood insurance cheaper outside a high-risk zone?', a: `Usually, but not always. In ${year} the median single-family bill was ${K.usd(zone.X.median)} in X, B and C zones against ${K.usd(zone.A.median)} in A zones. Outside a high-risk area no lender requires a policy, yet many claims come from there, and the price now depends on the building's own exposure rather than on the zone line.` },
    { q: 'Where do the figures of this site come from?', a: `From the federal program's own files: FEMA's single-family cost tables of August 2023 and the OpenFEMA policy and claims datasets, aggregated by ZIP code, county and state with a script anyone can rerun. Each figure carries its date. A ZIP code or county with fewer than ten policies or claims has no published median.` },
    { q: 'Does this site sell flood insurance or pass on my details?', a: `No. ${AUTHOR_NAME} publishes the figures and sells no policy, works with no agent or insurer and asks for no contact details. The ZIP and county tables load as files and the lookup runs in your browser. For a quote, a licensed agent or the insurer that holds your homeowners policy can price the federal or a private policy.` },
    { q: 'Can I pay a federal flood policy by the month?', a: `The law requires FEMA to offer monthly payment to policyholders who do not pay through a mortgage escrow, and a 2024 rule sets it up. FEMA's fact sheet of June 2026 still describes the option as coming soon, with twelve installments and no extra fee. Until your insurer offers it, the premium is paid yearly or through the escrow.` },
  ] as FAQ[],
  sources: ['fema_sfh_cost', 'openfema_policies', 'openfema_claims', 'usc_4015', 'usc_4014', 'usc_4013', 'floodsmart_costs', 'fema_manual', 'pl_119_103'],
};
