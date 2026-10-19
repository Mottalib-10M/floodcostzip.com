import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('west-virginia');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const cz = st.claimsByZone;
const w = (name: string) => st.topCounties.find((x) => x.name === name);
const kan = w('Kanawha County');
const green = w('Greenbrier County');
const mingo = w('Mingo County');
const logan = w('Logan County');
const cabell = w('Cabell County');
const ohio = w('Ohio County');
const big = st.events[0];
const cappedRank = [...K.STATES].filter((s) => (s.pol?.capped ?? 0) > pol.capped).length + 1;
const g = K.glide({ current: pol.median, full: pol.full, cap: K.P.caps.standard, fees: K.fees('primary') });
const under1k = st.ranges.find((r) => r.lo === 0)?.share ?? 0;

export default defineState({
  slug: 'west-virginia',
  title: 'Flood Insurance West Virginia 2026: Far Below Full Risk',
  description: `Flood insurance in West Virginia 2026: median single-family bill on ${date}, full risk twice as high, gaps from Kanawha to Mingo and the ${big?.year ?? N.claimYears[0]} flood.`,
  intro: `West Virginia's ${K.num(pol.n)} single-family flood policies had a median bill of ${K.usd(pol.median)} a year on ${date}, far under their full-risk price.`,
  resume: `No state has more flood policies still climbing toward their full price than West Virginia. On ${date}, the median single-family bill was ${K.usd(pol.median)} a year (premium, Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee together), but the median full-risk bill for the same ${K.num(pol.n)} homes was ${K.usd(pol.full)}. ${K.pct(pol.capped, 0)} of policies pay less than full risk, ${cappedRank === 1 ? 'the highest share of any state' : `a share that ranks ${cappedRank} among the states`}, against ${K.pct(N.policies!.capped, 0)} nationally. From the state median, the ${K.pct(K.P.caps.standard, 0)} yearly cap for a primary home leaves about ${g.steps} renewals of increases. The gap is not a coastal story: West Virginia has no storm surge exposure, only rivers and creeks. Even homes rated X, outside the mapped high-risk area, have a median full-risk bill of ${K.usd(z.X?.full ?? 0)}, above the A-zone figure of ${K.usd(z.A?.full ?? 0)}.`,
  body: (h) => `
<h2>Why the gap is so wide</h2>
<p>Under the pricing method in use since 2021, the zone letter no longer sets the premium; FEMA's model prices each building's own flood risk, and in West Virginia that price lands far above the bills people pay. The 2023 table already showed it: only ${K.pct(under1k, 0)} of West Virginia's single-family policies had a full-risk cost under ${K.usd(st.ranges[0]?.hi ?? 0)}, against ${K.pct(N.ranges[0].share, 0)} in the country as a whole.</p>
<p>The X-zone figures are the clearest sign that the old maps understate the risk here. The ${K.num(z.X?.n ?? 0)} X-rated policies paid a median of ${K.usd(z.X?.median ?? 0)}, but their full-risk median is ${K.usd(z.X?.full ?? 0)}. Their paid claims were not smaller either: a median of ${K.usd(cz.X?.median ?? 0)}, against ${K.usd(cz.A?.median ?? 0)} for A-zone claims.</p>
${h.mini('state', { t: 'West Virginia medians and the renewals left', p: ['cur'], d: { sx: 'west-virginia', cur: 0 } })}
<h2>County by county</h2>
<p>Kanawha County, around Charleston, has the most policies, ${K.num(kan?.pol?.n ?? 0)}, with a median bill of ${K.usd(kan?.pol?.median ?? 0)} and a full-risk median of ${K.usd(kan?.pol?.full ?? 0)}. The southern coalfield counties are further out. In Mingo County ${K.pct(mingo?.pol?.capped ?? 0, 0)} of policies are capped and the full-risk median is ${K.usd(mingo?.pol?.full ?? 0)}; in Logan County the figures are ${K.pct(logan?.pol?.capped ?? 0, 0)} and ${K.usd(logan?.pol?.full ?? 0)}. Along the Ohio River, Cabell (Huntington) and Ohio County (Wheeling) are closer to their model prices, at ${K.usd(cabell?.pol?.full ?? 0)} and ${K.usd(ohio?.pol?.full ?? 0)}. ${st.maxGap?.name ?? 'A highland county'} had the widest ratio of all in 2023, on a small number of policies. Putnam County, between Charleston and Huntington, had ${K.pct(w('Putnam County')?.pol?.capped ?? 0, 0)} of its policies capped.</p>
<h2>The ${big?.year ?? N.claimYears[0]} storms and Greenbrier County</h2>
<p>${big ? `The event that paid the most West Virginia claims over the decade is listed as ${big.event.toLowerCase()} of ${big.year}: ${K.num(big.n)} single-family claims and ${K.usd(big.total)}.` : 'Summer storms paid the most claims over the decade.'} Greenbrier County carries the mark of it. With ${K.num(green?.pol?.n ?? 0)} policies today, it recorded ${K.num(green?.claims?.n ?? 0)} paid claims over ${N.claimYears[0]} to ${N.claimYears[1]}, at a median of ${K.usd(green?.claims?.median ?? 0)}, the largest among the top counties. Its full-risk median, ${K.usd(green?.pol?.full ?? 0)}, reflects that record. The ${h.a('flood-insurance-rate-increase', 'rate increase page')} explains how a capped bill moves toward such a figure.</p>
${h.mini('five', { t: 'Next five bills for a Kanawha County median policy', p: ['cur', 'full'], d: { cur: kan?.pol?.median ?? pol.median, full: kan?.pol?.full ?? pol.full, use: 'primary' } })}
`,
  faqs: [
    { q: 'Why does West Virginia flood insurance keep going up?', a: `Because ${K.pct(pol.capped, 0)} of the state's single-family policies still pay less than their full-risk premium. The median bill was ${K.usd(pol.median)} on ${date} while the median full-risk bill was ${K.usd(pol.full)}. Federal law caps the yearly increase at ${K.pct(K.P.caps.standard, 0)} for most primary homes, so the gap closes over several renewals.` },
    { q: 'How much is flood insurance in Charleston, West Virginia?', a: `In Kanawha County, which includes Charleston, ${K.num(kan?.pol?.n ?? 0)} single-family policies had a median yearly bill of ${K.usd(kan?.pol?.median ?? 0)} on ${date}. The same homes at full risk would have a median of ${K.usd(kan?.pol?.full ?? 0)}, and ${K.pct(kan?.pol?.capped ?? 0, 0)} of them were still below it. A licensed agent can quote the price of a specific house.` },
    { q: 'How many flood claims did Greenbrier County, West Virginia have?', a: `Greenbrier County recorded ${K.num(green?.claims?.n ?? 0)} paid single-family claims between ${N.claimYears[0]} and ${N.claimYears[1]}, with a median payment of ${K.usd(green?.claims?.median ?? 0)}. That is about as many claims as the ${K.num(green?.pol?.n ?? 0)} policies in force in the county on ${date}, so the county's claim record is long compared with its policy base.` },
  ],
  related: ['flood-insurance-by-state', 'flood-insurance-rate-increase', 'flood-zones-explained', 'state:kentucky'],
});
