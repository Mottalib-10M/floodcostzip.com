import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('montana');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const cz = st.claimsByZone;
const mt = (name: string) => st.topCounties.find((x) => x.name === name);
const custer = mt('Custer County');
const flathead = mt('Flathead County');
const gallatin = mt('Gallatin County');
const cascade = mt('Cascade County');
const park = mt('Park County');
const yellowstoneCo = mt('Yellowstone County');
const missoula = mt('Missoula County');
const flood22 = st.events[0];
const gap = st.maxGap;

export default defineState({
  slug: 'montana',
  title: 'Flood Insurance Montana 2026: County Bills and Yellowstone',
  description: `Montana flood insurance 2026: median single-family bill on ${date}, Custer, Flathead and Gallatin county costs and what the 2022 Yellowstone flood paid.`,
  intro: `Montana is one of the smallest flood insurance markets: ${K.num(pol.n)} single-family policies on ${date}, with a median bill of ${K.usd(pol.median)}.`,
  resume: `The median single-family flood policy in Montana cost ${K.usd(pol.median)} a year on ${date}, with the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee included, a little under the national ${K.usd(N.policies!.median)}. With only ${K.num(pol.n)} policies statewide, county figures rest on a few hundred homes and can move with each renewal cycle, so they are best read as orders of magnitude. Two things stand out. First, the zone order is reversed: policies rated in X zones had a higher median bill, ${K.usd(z.X?.median ?? 0)}, than those in high-risk A zones, ${K.usd(z.A?.median ?? 0)}. The state totals do not say why; with so few policies, the mix of houses in each zone can tilt a median. Second, one flood shapes the claims record. ${flood22?.event ?? 'A June flood'} in ${flood22?.year ?? N.claimYears[1]} paid ${K.num(flood22?.n ?? 0)} of the state's ${K.num(st.claims?.n ?? 0)} paid single-family claims from ${N.claimYears[0]} to ${N.claimYears[1]}. The full-risk median is ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of policies still pay below it.`,
  body: (h) => `
<h2>Miles City has the most policies</h2>
<p>The largest pool of insured homes in Montana is not in the mountain valleys but in Custer County, where Miles City sits where the Tongue River meets the Yellowstone. Its ${K.num(custer?.pol?.n ?? 0)} single-family policies had a median bill of ${K.usd(custer?.pol?.median ?? 0)} on ${date}, among the lowest of any county in the data, and a full-risk median of ${K.usd(custer?.pol?.full ?? 0)}. With ${K.pct((custer?.pol?.n ?? 0) / pol.n, 0)} of the state's policies, those homes pull the statewide medians down.</p>
${h.mini('zone', { t: 'Montana median bill by zone type', p: ['z'], d: { sx: 'montana', z: 'X' } })}
<h2>The western valleys pay more</h2>
<p>Flathead County, around Kalispell and Flathead Lake, had a median of ${K.usd(flathead?.pol?.median ?? 0)} and a full-risk median of ${K.usd(flathead?.pol?.full ?? 0)}; Cascade County, at Great Falls on the Missouri, ${K.usd(cascade?.pol?.median ?? 0)} against ${K.usd(cascade?.pol?.full ?? 0)}. In both, more than half of the policies are still capped, so their owners face yearly increases of up to ${K.pct(K.P.caps.standard, 0)} for a primary home. Gallatin County, around Bozeman, is the opposite case, with a median of ${K.usd(gallatin?.pol?.median ?? 0)} close to its full-risk median and only ${K.pct(gallatin?.pol?.capped ?? 0, 0)} of policies capped.</p>
<h2>June 2022 on the Yellowstone</h2>
<p>Snowmelt and heavy rain sent the Yellowstone River and its tributaries out of their banks in ${flood22?.year ?? N.claimYears[1]}. The federal program paid ${K.num(flood22?.n ?? 0)} single-family claims for ${K.usd(flood22?.total ?? 0)}. Park County, which includes Gardiner and Livingston, recorded ${K.num(park?.claims?.n ?? 0)} paid claims over the decade at a median of ${K.usd(park?.claims?.median ?? 0)}; Yellowstone County, at Billings, had ${K.num(yellowstoneCo?.claims?.n ?? 0)}. ${gap?.name ?? 'A nearby county'}, upstream of Billings on the Stillwater, has the widest current to full-risk gap in FEMA's 2023 table: ${K.usd(gap?.current ?? 0)} against ${K.usd(gap?.risk ?? 0)}, though on only ${K.num(gap?.pif ?? 0)} policies.</p>
<p>Claims inside A zones were much larger than outside: a median of ${K.usd(cz.A?.median ?? 0)} against ${K.usd(cz.X?.median ?? 0)} for X zones. Small totals like these swing with one event, which is why the ${h.a('average-flood-insurance-claim', 'average claim guide')} also gives the national figures.</p>
<p>The thin market has a practical side. FEMA's 2023 table lists policies in only ${K.num(st.zips)} Montana ZIP codes, so many Montana ZIP codes have no figure of their own and the county median is the nearest guide. For a single house, the elevation certificate and the quote from a licensed agent say far more than any median.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Bozeman, Montana?', a: `Gallatin County, which includes Bozeman, had ${K.num(gallatin?.pol?.n ?? 0)} single-family flood policies on ${date}, with a median yearly bill of ${K.usd(gallatin?.pol?.median ?? 0)} including fees and a median full-risk bill of ${K.usd(gallatin?.pol?.full ?? 0)}. Prices there are near their final level, and the exact cost of a house depends on its zone and elevation.` },
    { q: 'What did the 2022 Yellowstone flood cost the flood program in Montana?', a: `The federal program paid ${K.num(flood22?.n ?? 0)} claims on Montana single-family homes for ${flood22?.event ?? 'that flood'}, ${K.usd(flood22?.total ?? 0)} in total for buildings and contents. That single event, a mix of snowmelt and rain in the mountains, accounts for ${K.pct((flood22?.n ?? 0) / (st.claims?.n ?? 1), 0)} of all paid single-family claims in the state from ${N.claimYears[0]} to ${N.claimYears[1]}.` },
    { q: 'Is flood insurance more expensive in Missoula or Kalispell?', a: `At the county level, Kalispell's Flathead County costs more. Its median single-family bill was ${K.usd(flathead?.pol?.median ?? 0)} on ${date}, against ${K.usd(missoula?.pol?.median ?? 0)} in Missoula County. Flathead's full-risk median of ${K.usd(flathead?.pol?.full ?? 0)} also points to more yearly increases ahead than Missoula's ${K.usd(missoula?.pol?.full ?? 0)}, where bills are already close to full price.` },
  ],
  related: ['flood-zones-explained', 'average-flood-insurance-claim', 'flood-insurance-by-state', 'state:wyoming'],
});
