import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const N = K.N;
const POL = N.policies!;
const Z = POL.zone;
const date = K.day(N.policiesDate!);
const year = N.policiesDate!.slice(0, 4);
const R = N.ranges;
const shareUnder = (hi: number) => R.filter((r) => r.hi !== null && r.hi <= hi).reduce((a, r) => a + r.share, 0);
const under1k = shareUnder(1000);
const under2k = shareUnder(2000);
const over5k = R.filter((r) => r.lo >= 5000).reduce((a, r) => a + r.share, 0);
const top = R.filter((r) => r.lo >= 10000).reduce((a, r) => a + r.pif, 0);
const feeGap = K.fees('other') - K.fees('primary');
const secondHome = 1 - POL.sharePrimary;
const withPol = K.STATES.filter((s) => s.pol && s.pol.n >= 1000);
const dear = [...withPol].sort((a, b) => b.pol!.median - a.pol!.median);
const cheap = dear[dear.length - 1];
const nj = K.S('new-jersey');
const njAtNat = K.shareBelow(nj.ranges, N.risk);
const bandRow = (r: (typeof R)[number]) => [r.hi === null ? `${K.usd(r.lo)} and more` : `${K.usd(r.lo)} to ${K.usd(r.hi)}`, K.pct(r.share, 1), K.usd(r.rcv ?? 0)];

export default defineGuide({
  id: 'how-much-is-flood-insurance',
  group: 'cost',
  order: 2,
  slug: 'how-much-is-flood-insurance',
  nav: 'How much is flood insurance',
  card: `The median bill of a house in ${year}, by zone, by price band and for a second home.`,
  title: 'Flood Insurance Price 2026: What a House Pays, by Zone',
  description: `Flood insurance price in 2026: the median and average yearly bill of a house on ${date}, the share in each price band, by zone and for a second home.`,
  h1: 'How much is flood insurance? The price of a house policy, by zone and type of home',
  intro: `A single-family flood policy had a median bill of ${K.usd(POL.median)} a year on ${date}. Enter a full-risk price below to see where it sits in a state.`,
  resume: `On ${date}, the ${K.num(POL.n)} single-family flood policies of the federal program had a median yearly bill of ${K.usd(POL.median)} and an average of ${K.usd(POL.avg)}, premium, Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee included. The average sits above the median because a small group of houses pays several thousand dollars. Location moves the price most: the median was ${K.usd(Z.X.median)} in X, B and C zones, ${K.usd(Z.A.median)} in A zones and ${K.usd(Z.V.median)} in coastal V zones. FEMA's own price bands of 2023 put ${K.pct(under1k, 0)} of houses under ${K.usd(1000)} a year at full risk and ${K.pct(under2k, 0)} under ${K.usd(2000)}, while ${K.pct(over5k, 0)} were priced at ${K.usd(5000)} or more. A second home or a rental pays ${K.usd(feeGap)} more a year in fixed charges than a main home, and a discounted premium on such a home climbs by ${K.pct(K.P.caps.higher, 0)} a year, against at most ${K.pct(K.P.caps.standard, 0)} for a main home.`,
  body: (h) => `
<h2>The middle of the market: ${K.usd(POL.median)} a year</h2>
<p>The figure most people want is the price of an ordinary house, and the cleanest answer is the median of the policies actually in force. On ${date}, OpenFEMA listed ${K.num(POL.n)} single-family policies with a building in the federal program, and half of them cost less than ${K.usd(POL.median)} for the year. That amount is the full bill, not the premium alone: the median premium was ${K.usd(POL.medianPremium)}, the median Reserve Fund Assessment ${K.usd(POL.medianReserveFund)}, and two flat charges, the ${K.usd(POL.federalPolicyFee)} Federal Policy Fee and the ${K.usd(POL.hfiaa)} HFIAA surcharge of a main home, come on top. Medians do not add up exactly, so those parts are a guide to the structure rather than a sum.</p>
<p>What that money buys is fairly uniform. The median policy carried ${K.usd(POL.medianBuilding)} of building coverage, the legal maximum for a house, and ${K.pct(POL.shareBuildingAtMax, 0)} of policies were written at that maximum. ${K.pct(POL.shareWithContents, 0)} also covered belongings, with a median contents limit of ${K.usd(POL.medianContents)}. Two houses with the same coverage can still pay very different amounts, because the price follows the building, not the coverage.</p>
<h2>Why the average is higher than the median</h2>
<p>The average bill, ${K.usd(POL.avg)}, is pulled up by a long tail. FEMA's single-family table of August 2023, which priced every policy at its full risk under the current method, shows how uneven the market is. Most houses cluster in the first two bands, and the number thins out quickly after ${K.usd(3000)}. Only ${K.num(top)} policies, out of ${K.num(N.pif)}, were priced at ${K.usd(10000)} a year or more, yet those houses weigh on any average.</p>
${h.table(['Full-risk yearly price', 'Share of houses', 'Median rebuild value'], R.slice(0, 7).map(bandRow), `Single-family policies in force on August 31, 2023, priced at their full risk with the rates of ${K.day(N.ratesOf)}. FEMA single-family cost table.`, ['l', 'r', 'r'])}
<p>The last column is useful: the rebuild value barely changes from one band to the next. A house paying ${K.usd(6000)} a year is not much more expensive to rebuild than one paying ${K.usd(600)}. The difference lies in how likely and how deep a flood would be at that address.</p>
<h2>What makes one house cost more than its neighbor</h2>
<p>Under the pricing method FEMA has used since 2021, each building gets its own rate from a list of facts: distance to the coast, a river or a lake, the kinds of flooding that can reach it (rain, river overflow, storm surge, coastal erosion), the height of the first floor above the ground, the foundation, a basement or not, and the cost to rebuild. The flood zone on the map no longer sets the rate directly, but it still tracks risk, which is why the zone medians differ so much.</p>
<p>In ${year}, a house in a coastal V zone had a median bill of ${K.usd(Z.V.median)}, against ${K.usd(Z.A.median)} for the high-risk A zones along rivers and bays and ${K.usd(Z.X.median)} outside the mapped high-risk area. V zones are rare, ${K.num(Z.V.n)} policies, but they show what storm surge and waves add. A raised house on piles in a V zone can still pay less than an older slab house at the edge of an A zone, because elevation counts as much as the zone line.</p>
${h.mini('zone', { t: 'Median bill by zone type in one state', p: ['sx', 'z'], d: { sx: 'north-carolina', z: 'X' } })}
<h2>Main home, second home, rental</h2>
<p>The same house costs more when nobody lives in it as a main residence. Two rules make the difference. The HFIAA surcharge is ${K.usd(K.P.fees.hfiaa.primary)} for a primary residence and ${K.usd(K.P.fees.hfiaa.other)} for any other home, so ${K.usd(feeGap)} more a year before any premium. And when the premium is still below its full-risk level, the law makes it rise by ${K.pct(K.P.caps.higher, 0)} a year for a non-primary residence, against at most ${K.pct(K.P.caps.standard, 0)} for a main home (${h.src('usc_4014', '42 U.S.C. 4014(a)(2)')}). About ${K.pct(secondHome, 0)} of single-family policies in force on ${date} were not on a main home. The ${h.a('flood-insurance-second-home', 'second home guide')} covers the rest.</p>
<h2>Where in the country</h2>
<p>State medians spread less than people expect, because every state has cheap and dear houses. Among states with at least ${K.num(1000)} policies, ${h.a(`state:${dear[0].slug}`, dear[0].name)} had the highest median, ${K.usd(dear[0].pol!.median)}, and ${h.a(`state:${cheap.slug}`, cheap.name)} the lowest, ${K.usd(cheap.pol!.median)}. The calculator at the top of the page answers a sharper question: where a given full-risk price ranks among the houses of one state. In New Jersey, for instance, a house priced at the national full-risk median of ${K.usd(N.risk)} would cost more than ${K.pct(njAtNat, 0)} of the state's insured houses. The ${h.a('flood-insurance-by-state', 'state ranking')} lists every state.</p>
<h2>How to get your own number</h2>
<p>A median tells you what is normal, not what you will pay. The only exact figure is a quote for the building, which a licensed agent or the insurer that writes your homeowners policy can produce for the federal program, often with an elevation certificate if one exists. If you already hold a policy, the declarations page shows both what you pay and the full-risk premium, which is where the yearly increases are heading. The ${h.a('home', 'ZIP code lookup')} gives the median of the houses insured around yours, the closest public benchmark.</p>
`,
  faqs: [
    { q: 'What is the average cost of flood insurance for a single-family house?', a: `The average single-family bill was ${K.usd(POL.avg)} a year on ${date}, against a median of ${K.usd(POL.median)}. The average is higher because a few thousand houses near the coast or with low floors pay ${K.usd(5000)} or more. For a typical house, the median is the better guide, and the ZIP or county median is better still.` },
    { q: 'Does a flood policy cost more in a V zone than in an A zone?', a: `Yes, at the median. Single-family policies in coastal V zones had a median bill of ${K.usd(Z.V.median)} on ${date}, against ${K.usd(Z.A.median)} in A zones and ${K.usd(Z.X.median)} in X, B and C zones. The zone does not set the rate by itself any more, but V zones face waves and surge, which the rating method prices heavily.` },
    { q: 'How much more does flood insurance cost for a second home?', a: `At least ${K.usd(feeGap)} a year more in fixed charges, because the HFIAA surcharge is ${K.usd(K.P.fees.hfiaa.other)} instead of ${K.usd(K.P.fees.hfiaa.primary)}. If the premium is still discounted, it also climbs by ${K.pct(K.P.caps.higher, 0)} a year, faster than the ${K.pct(K.P.caps.standard, 0)} of a main home, until it reaches its full-risk level.` },
    { q: `What share of houses pay less than ${K.usd(1000)} a year at full risk?`, a: `In FEMA's table of August 2023, ${K.pct(under1k, 0)} of single-family policies had a full-risk price under ${K.usd(1000)} a year and ${K.pct(under2k, 0)} were under ${K.usd(2000)}. Many of those houses still paid less at the time because of the discounts the law phases out. The share differs widely by state, which the calculator on this page shows.` },
    { q: 'Does a bigger house always pay more for flood insurance?', a: `Not necessarily. The rebuild cost enters the price, but FEMA's 2023 table shows that the median rebuild value barely changes across the bands where most houses sit, close to ${K.usd(N.medianRcv)} nationally. Elevation, distance to water and the type of flooding weigh more. A large raised house can pay less than a small one built at ground level near a river.` },
  ],
  tool: 'rank',
  toolArg: { sx: 'new-jersey', cost: Math.round(N.risk) },
  related: ['flood-insurance-by-state', 'flood-insurance-cost-per-month', 'flood-zones-explained', 'flood-insurance-second-home'],
  sources: ['openfema_policies', 'fema_sfh_cost', 'floodsmart_costs', 'usc_4014', 'fema_manual'],
});
