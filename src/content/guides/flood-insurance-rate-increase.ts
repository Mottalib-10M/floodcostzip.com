import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const N = K.N;
const POL = N.policies!;
const date = K.day(N.policiesDate!);
const T = N.policiesTrend;
const first = T[0];
const last = T[T.length - 1];
const rise = last.median / first.median - 1;
const drop = 1 - last.n / first.n;
const atFull = 1 - POL.capped;
const maxStep = Math.max(...T.slice(1).map((t, i) => t.median / T[i].median - 1));
const withPol = K.STATES.filter((s) => s.pol && s.pol.n >= 1000);
const byCapped = [...withPol].sort((a, b) => b.pol!.capped - a.pol!.capped);
const mostCapped = byCapped.slice(0, 3);
const leastCapped = byCapped.slice(-3).reverse();
const g = K.glide({ current: POL.median, full: POL.full, cap: K.P.caps.standard, fees: K.fees('primary') });
const trendRows = T.map((t, i) => [K.day(t.date), K.num(t.n), K.usd(t.median), i === 0 ? '' : `+${K.pct(t.median / T[i - 1].median - 1, 1)}`]);
const sl = (s: (typeof K.STATES)[number]) => `state:${s.slug}`;

export default defineGuide({
  id: 'flood-insurance-rate-increase',
  group: 'cost',
  order: 5,
  slug: 'flood-insurance-rate-increase',
  nav: 'Rate increases',
  card: `Why the bill rises, the ${K.pct(K.P.caps.standard, 0)} and ${K.pct(K.P.caps.higher, 0)} caps, and how many renewals are left.`,
  title: `Flood Insurance Rate Increase 2026: The ${K.pct(K.P.caps.standard, 0)} Yearly Cap`,
  description: `Flood insurance rate increases in 2026: the ${K.pct(K.P.caps.standard, 0)} and ${K.pct(K.P.caps.higher, 0)} legal caps, the fees left outside them, the rise of the median bill since 2023 and the renewals left.`,
  h1: 'Flood insurance rate increase: why the bill rises and when it stops',
  intro: `${K.pct(POL.capped, 0)} of single-family flood policies still paid less than their full-risk premium on ${date}. Enter your two amounts to count the increases left.`,
  resume: `Federal flood bills keep rising because many policies still pay less than the full-risk premium FEMA now computes for each building, and the law only lets that gap close in steps. For a main home the premium may go up by at most ${K.pct(K.P.caps.standard, 0)} a year (42 U.S.C. 4015(e)); for a second home, a rental, a business property or a severe repetitive loss property it rises by ${K.pct(K.P.caps.higher, 0)} a year (42 U.S.C. 4014(a)(2)). The flat Federal Policy Fee and HFIAA surcharge sit outside the cap. On ${date}, ${K.pct(POL.capped, 0)} of single-family policies were still below their full-risk level. The national median bill went from ${K.usd(first.median)} on ${K.day(first.date)} to ${K.usd(last.median)} on ${K.day(last.date)}, up ${K.pct(rise, 0)}. From today's median to the median full-risk bill of ${K.usd(POL.full)}, a main home has ${g.steps === 1 ? 'one renewal' : `${K.num(g.steps)} renewals`} of increases left. A lapse of ${K.P.program.lapseDays} days or more can end the discount at once.`,
  body: (h) => `
<h2>The gap the increases are closing</h2>
<p>For a long time, many federal flood policies paid less than their risk implied, in part through discounts the law grants to buildings older than the first flood map of their community. Since October 1, 2021, new policies pay the full-risk premium that FEMA's current method computes building by building. Existing policies were moved onto the same method, but not all at once: their price climbs toward the new level a step at a time. FEMA's ${h.src('fema_pricing', 'pricing page')} sums it up: existing statutory limits keep most rates from rising more than ${K.pct(K.P.caps.standard, 0)} a year.</p>
<p>That is why two neighbors with similar houses can see different increases. One may already pay the full price and only see FEMA's general rate changes. The other may have years of capped increases left. The declarations page tells them apart: it always shows the Full-Risk Premium, and, when it applies, an Annual Increase Cap Discount line with the amount still being waived.</p>
<h2>The two caps in the statute</h2>
<p>The general rule is in ${h.src('usc_4015', '42 U.S.C. 4015(e)')}: the chargeable risk premium rate "for any property" may not go up by more than ${K.pct(K.P.caps.standard, 0)} in a year. The faster track is in the same subsection, which sends the categories listed in ${h.src('usc_4014', '42 U.S.C. 4014(a)(2)')} up by ${K.pct(K.P.caps.higher, 0)} a year: a residence that is not the primary residence of an individual, a severe repetitive loss property, a property whose flood claims have added up to its market value, a business property, and a building substantially damaged or improved by more than half its value since July 6, 2012.</p>
<p>The ${K.pct(K.P.caps.standard, 0)} limit also has exceptions in the text. A premium can rise beyond it when the owner increases the coverage or lowers the deductible, when the community has been downgraded in FEMA's Community Rating System, or when the policy was misrated. Properties leased from the federal government on the river side of a levee or seaward of a seawall are outside the cap entirely.</p>
<h2>What sits outside the cap</h2>
<p>The cap is built into what FEMA calls the discounted premium. Several items of the bill are not part of it. The Federal Policy Fee, ${K.usd(K.P.fees.federalPolicyFee.primary)}, and the HFIAA surcharge, ${K.usd(K.P.fees.hfiaa.primary)} for a main home or ${K.usd(K.P.fees.hfiaa.other)} for any other building, are flat amounts added on top. The Reserve Fund Assessment is ${K.pct(K.P.fees.reserveFundRate, 0)} of the discounted premium, so it rises in proportion with it. The FEMA ${h.src('fema_manual', 'Flood Insurance Manual')} lists these as "not part of the full-risk premium or discounted premium". In practice, the total on the bill can move by a slightly different percentage than the capped premium, which is why the calculator above takes the flat charges out before applying the cap.</p>
<h2>What the policy file shows since 2023</h2>
${h.table(['Policies in force on', 'Single-family policies', 'Median bill', 'Change'], trendRows, 'OpenFEMA policy file, total yearly cost of single-family policies. The last interval is eleven months.', ['l', 'r', 'r', 'r'])}
<p>The median bill rose ${K.pct(rise, 0)} over the period while the number of policies fell ${K.pct(drop, 0)}. The largest step of the median between two snapshots was ${K.pct(maxStep, 0)}, ${maxStep < K.P.caps.standard ? 'below' : 'close to'} the cap, because about half of the policies were already at or near their full price and only change with FEMA's general rate updates.</p>
<p>In August 2023, FEMA reported that ${K.pct(K.P.program.fema2023RiskBasedShare, 0)} of single-family policyholders already paid a risk-based premium (${h.src('fema_sfh_cost', 'FEMA single-family cost page')}). On ${date}, the share of policies at or above their full-risk premium in the policy file was ${K.pct(atFull, 0)}, and the other ${K.pct(POL.capped, 0)} still had increases to come.</p>
<h2>Where the increases have furthest to run</h2>
<p>The share still capped differs a lot between states. Among states with at least ${K.num(1000)} policies, it was highest in ${mostCapped.map((s) => `${h.a(sl(s), s.name)} (${K.pct(s.pol!.capped, 0)})`).join(', ')}, where most policyholders will keep seeing yearly increases. It was lowest in ${leastCapped.map((s) => `${h.a(sl(s), s.name)} (${K.pct(s.pol!.capped, 0)})`).join(', ')}, where most bills have already caught up.</p>
${h.mini('state', { t: 'Share still capped in your state', p: ['sx', 'cur'], d: { sx: mostCapped[0].slug } })}
<h2>Two ways to lose the cap</h2>
<p>A lapse is the first. A renewal paid ${K.P.program.lapseDays} days or more after the expiration date ends the policy; a new application is required and, under the manual, the new policy "will be rated based on the full-risk premium". FEMA prints the warning on renewal notices: "If your policy lapses, you will lose the Annual Increase Cap Discount and your premium will be higher." Moving to a private policy and then coming back counts as a break in federal coverage too.</p>
<p>A sale is the second risk, but not an automatic one. The seller can assign the policy to the buyer, who may keep the same discounted premium; the cap is then recomputed on the buyer's own information. A buyer who will not live in the house moves to the ${K.pct(K.P.caps.higher, 0)} track. The ${h.a('buying-a-house-in-a-flood-zone', 'guide to buying in a flood zone')} details the routes, and the ${h.a('flood-insurance-calculator', 'five-year calculator')} adds up what the remaining increases cost.</p>
`,
  faqs: [
    { q: 'How much can a federal flood premium go up in one year?', a: `For most main homes, ${K.pct(K.P.caps.standard, 0)} of the premium a year under 42 U.S.C. 4015(e). Second homes, rentals, business properties, severe repetitive loss properties and buildings substantially damaged or improved rise by ${K.pct(K.P.caps.higher, 0)} a year. More coverage, a lower deductible, a community rating downgrade or a misrating can push the premium past those limits.` },
    { q: 'When do flood insurance increases stop?', a: `When the premium reaches the full-risk premium printed on the declarations page. After that the policy only follows FEMA's general rate changes, which can be up or down. On ${date}, ${K.pct(atFull, 0)} of single-family policies were already at that point; the others still carried an Annual Increase Cap Discount that shrinks at each renewal.` },
    { q: 'Do the fees on a flood bill go up by the same percentage as the premium?', a: `No. The Federal Policy Fee of ${K.usd(K.P.fees.federalPolicyFee.primary)} and the HFIAA surcharge of ${K.usd(K.P.fees.hfiaa.primary)} or ${K.usd(K.P.fees.hfiaa.other)} are flat amounts outside the discounted premium. The Reserve Fund Assessment is a percentage of that premium, ${K.pct(K.P.fees.reserveFundRate, 0)}, so it rises with it. The total bill therefore moves by a slightly different percentage than the premium.` },
    { q: 'Does a late flood renewal payment cancel the yearly cap?', a: `It can. Paying ${K.P.program.lapseDays} days or more after the expiration date causes a lapse, a new application is needed and the new policy is rated at its full-risk premium, without the Annual Increase Cap Discount. FEMA's renewal notices say so in plain words, and the lapse can also end older discounts tied to the policyholder.` },
    { q: 'Why did my flood bill rise less than the cap this year?', a: `Because ${K.pct(K.P.caps.standard, 0)} is a ceiling, not a target. A policy close to its full-risk premium only rises by the remaining gap, and a policy already there follows FEMA's general rate changes. The flat fees also dilute the percentage on the total bill, since they do not grow with the premium.` },
  ],
  tool: 'glide',
  related: ['flood-insurance-calculator', 'how-much-is-flood-insurance', 'buying-a-house-in-a-flood-zone', 'nfip'],
  sources: ['usc_4015', 'usc_4014', 'fema_manual', 'fema_pricing', 'fema_sfh_cost', 'openfema_policies'],
});
