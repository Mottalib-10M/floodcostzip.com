import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const N = K.N;
const POL = N.policies!;
const Z = POL.zone;
const date = K.day(N.policiesDate!);
const rfa = K.P.fees.reserveFundRate;
const run = (cur: number, full: number, use: 'primary' | 'other') => K.glide({ current: cur, full, cap: K.cap(use), fees: K.fees(use) });
const main = run(POL.median, POL.full, 'primary');
const second = run(POL.median, POL.full, 'other');
const vz = run(Z.V.median, Z.V.full, 'primary');
const xz = run(Z.X.median, Z.X.full, 'primary');
const renew = (k: number) => (k === 0 ? 'no renewal' : k === 1 ? 'one renewal' : `${K.num(k)} renewals`);
const rebuilt = POL.medianFullPremium * (1 + rfa) + K.fees('primary');
const extra = main.total - main.totalAtFull;

export default defineGuide({
  id: 'flood-insurance-calculator',
  group: 'cost',
  order: 4,
  slug: 'flood-insurance-calculator',
  nav: 'Five-year calculator',
  card: 'Add up your next five flood bills from your declarations page, main home or second home.',
  title: 'Flood Insurance Calculator 2026: Your Next Five Yearly Bills',
  description: `Flood insurance calculator for 2026: enter today's bill and the full-risk premium from your declarations page to add up your next five renewals under the cap.`,
  h1: 'Flood insurance calculator: the total of your next five bills',
  intro: `Two numbers from your declarations page are enough. The defaults are the national medians of ${date}: ${K.usd(POL.median)} today, ${K.usd(POL.full)} at full risk.`,
  resume: `The calculator projects the next five renewals of a federal flood policy from two amounts: the total you pay today and the total you would pay at the full-risk price. It keeps the fixed charges aside, raises the rest by up to ${K.pct(K.P.caps.standard, 0)} a year for a main home or ${K.pct(K.P.caps.higher, 0)} for a second home or rental, stops at the full-risk level, and adds the charges back. With the national single-family medians of ${date}, ${K.usd(POL.median)} today and ${K.usd(POL.full)} at full risk, a main home needs ${renew(main.steps)} to get there and the five bills add up to ${K.usd(main.total)}, the last one ${K.usd(main.rows[4].cost)}. The same house as a second home reaches full price in ${renew(second.steps)} and adds up to ${K.usd(second.total)} over five years, since its larger surcharge is set aside and the faster cap works on a smaller part. Every declarations page shows the Full-Risk Premium, the number this calculation needs.`,
  body: (h) => `
<h2>What the calculator does</h2>
<p>Many policies written before FEMA's current pricing method still pay less than the price the method computes for their building. The law closes that gap in steps: the chargeable premium of a main home may rise by at most ${K.pct(K.P.caps.standard, 0)} a year, and the premium of a non-primary residence, a business property or a severe repetitive loss property rises by ${K.pct(K.P.caps.higher, 0)} a year until it reaches its full level (${h.src('usc_4015', '42 U.S.C. 4015(e)')}, ${h.src('usc_4014', '4014(a)(2)')}). The calculator replays that rule five times.</p>
<p>It works on the whole bill, in four moves. First it takes out the charges that do not follow the premium: the Federal Policy Fee of ${K.usd(K.P.fees.federalPolicyFee.primary)} and the HFIAA surcharge of ${K.usd(K.P.fees.hfiaa.primary)} for a main home or ${K.usd(K.P.fees.hfiaa.other)} for any other home. Then it raises what remains by the cap. When the next step would pass the full-risk level, it stops there. Last, it puts the fixed charges back and prints each renewal and the five-year sum. If the full-risk price is below today's bill, the calculator applies it at the next renewal.</p>
<h2>What to enter, and where to find it</h2>
<p>The first field is what you pay today for a year, all lines included: premium, Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee, plus a probation surcharge in the rare community that carries one. The total is at the bottom of the declarations page, or on the renewal notice.</p>
<p>The second field needs one more step. FEMA requires every declarations page to show a line called Full-Risk Premium, "always shown", described in the ${h.src('fema_manual', 'Flood Insurance Manual')} as the premium "excluding fees, surcharges, assessments, and applicable discounts". To compare it with your total, add the Reserve Fund Assessment, ${K.pct(rfa, 0)} of that premium once no discount is left, and the two fixed charges. Done on the national median full-risk premium of ${K.usd(POL.medianFullPremium)}, the sum is about ${K.usd(rebuilt)}. The median full-risk bill of ${K.usd(POL.full)} used as the default is a little different, because the median of a total is not the total of the medians.</p>
<p>No declarations page at hand? The ${h.a('home', 'ZIP code lookup')} shows the median bill and the median full-risk bill of the houses insured in your ZIP code or county, a fair stand-in until you have your own figures.</p>
<h2>Four worked examples</h2>
${h.table(['Case', 'Today', 'Full risk', 'Renewals to full', 'Year 5', 'Five bills'], [
  ['National median, main home', K.usd(POL.median), K.usd(POL.full), K.num(main.steps), K.usd(main.rows[4].cost), K.usd(main.total)],
  ['National median, second home', K.usd(POL.median), K.usd(POL.full), K.num(second.steps), K.usd(second.rows[4].cost), K.usd(second.total)],
  ['V zone median, main home', K.usd(Z.V.median), K.usd(Z.V.full), K.num(vz.steps), K.usd(vz.rows[4].cost), K.usd(vz.total)],
  ['X zone median, main home', K.usd(Z.X.median), K.usd(Z.X.full), K.num(xz.steps), K.usd(xz.rows[4].cost), K.usd(xz.total)],
], `Medians of single-family policies in force on ${date} (OpenFEMA). Computed with the calculator's own rules and today's fees.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The first row is the typical main home. Its capped part needs ${renew(main.steps)} to close the gap, after which the bill sits at ${K.usd(POL.full)} until FEMA changes its rates. Over five years it pays ${K.usd(Math.abs(extra))} ${extra >= 0 ? 'more' : 'less'} than five bills at the full-risk price would cost, because the early years are discounted.</p>
<p>The second row keeps the same two totals but treats the house as a second home. The yearly step is larger, so the gap closes in ${renew(second.steps)}; the five-year total is ${K.usd(second.total)}. In practice the comparison is unfair to the second home, whose real full-risk bill also carries the ${K.usd(K.P.fees.hfiaa.other)} surcharge: enter both totals as they appear on its own declarations page.</p>
<p>The third row shows a coastal case. A V zone house at the median has the widest gap of the three zone types and needs ${renew(vz.steps)}, so its bill in year five, ${K.usd(vz.rows[4].cost)}, is far above today's. The last row is the opposite: in X, B and C zones the median bill is already close to its full-risk level and the increases are nearly over.</p>
<h2>What the five-year total leaves out</h2>
<p>The projection holds the full-risk price still. In reality FEMA reprices the program from time to time, so the target itself can move up or down. The cap also does not shield every change. The statute lets the premium rise faster when the owner raises the coverage or lowers the deductible, when the community loses its rating discount, or when the policy was misrated. A lapse of ${K.P.program.lapseDays} days or more after the expiration date can cost the discount altogether and bring the full-risk premium at once. And a new owner keeps the discounted premium only through the routes set out in the ${h.src('fema_manual', 'manual')}, with the cap rebuilt on the new owner's own information.</p>
<p>Someone weighing a private quote can test it against the federal path. The private insurer has no legal cap, so the yearly increase below is your own assumption.</p>
${h.mini('private', { t: 'The same five years against a private quote', p: ['cur', 'full', 'q', 'g'], d: { cur: POL.median, full: POL.full } })}
<p>The ${h.a('flood-insurance-rate-increase', 'rate increase guide')} explains why the bills rise, and the ${h.a('private-flood-insurance', 'private flood insurance guide')} what a private policy must contain to satisfy a lender.</p>
`,
  faqs: [
    { q: 'Where is the full-risk premium on a flood declarations page?', a: `In the premium section, on a line headed Full-Risk Premium. FEMA's manual requires it on every declarations page and defines it without fees, surcharges, assessments or discounts. Lines for the Annual Increase Cap Discount and other discounts appear below it when they apply, followed by the Discounted Premium and the Reserve Fund Assessment.` },
    { q: 'Why does the five-year calculator take the fees out first?', a: `Because the Federal Policy Fee and the HFIAA surcharge are flat charges that are not part of the premium the yearly cap limits. Raising them by ${K.pct(K.P.caps.standard, 0)} would overstate the increase. The calculator removes ${K.usd(K.fees('primary'))} for a main home or ${K.usd(K.fees('other'))} for another home, applies the cap to the rest and adds them back.` },
    { q: 'Can the calculator be used for a policy bought this year?', a: `Only if the new policy received a statutory discount, such as the one for an older primary residence built before the first flood map or the one for a newly mapped house. A brand-new policy without a discount already pays its full-risk premium, so today's bill and the full-risk bill are the same and the five-year total is simply five equal bills.` },
    { q: 'How accurate is a five-year flood premium projection?', a: `It follows the legal cap exactly, but it assumes the full-risk price stays where it is. FEMA can change its rates, and changes to the coverage, the deductible or the community's rating discount fall outside the cap. Treat the result as the path the law allows from today's figures, not as a quote.` },
  ],
  tool: 'five',
  related: ['flood-insurance-rate-increase', 'flood-insurance-cost-per-month', 'private-flood-insurance', 'flood-insurance-second-home'],
  sources: ['usc_4015', 'usc_4014', 'fema_manual', 'floodsmart_costs', 'openfema_policies'],
});
