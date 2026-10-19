import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('south-carolina');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const cty = (name: string) => st.topCounties.find((c) => c.name === name);
const charleston = cty('Charleston County');
const beaufort = cty('Beaufort County');
const horry = cty('Horry County');
const georgetown = cty('Georgetown County');
const matthew = st.events[0];
const florence = st.events.find((e) => e.event.includes('Florence'));
const gap = st.maxGap;

export default defineState({
  slug: 'south-carolina',
  title: 'Flood Insurance South Carolina 2026: Coast and County Costs',
  description: `Flood insurance in South Carolina 2026: median bill on ${date}, Charleston, Beaufort and Horry costs, V zone prices and what Matthew and Florence paid.`,
  intro: `South Carolina counts ${K.num(pol.n)} single-family flood policies; on ${date} the median yearly bill was ${K.usd(pol.median)}, below the national ${K.usd(N.policies!.median)}.`,
  resume: `On ${date}, the typical single-family flood policy in South Carolina had a total yearly cost of ${K.usd(pol.median)}, premium plus the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. The state has ${K.num(pol.n)} such policies, and FEMA rated ${K.pct(st.exposure.surge, 0)} of its 2023 single-family policies as exposed to storm surge. Charleston County alone holds ${K.num(charleston?.pol?.n ?? 0)} of them. The statewide picture is calmer than that exposure suggests. Priced at full risk, the same policies would have a median of ${K.usd(pol.full)}, not far above today, and only ${K.pct(pol.capped, 0)} still pay less than their full-risk premium. The real gap sits on the front row. A V zone policy cost ${K.usd(z.V?.median ?? 0)} at the median, with a full-risk median of ${K.usd(z.V?.full ?? 0)}, while X zone homes paid ${K.usd(z.X?.median ?? 0)}.`,
  body: (h) => `
<h2>A coastal state with a modest median</h2>
<p>With ${K.pct(st.exposure.surge, 0)} of its policies carrying surge exposure in FEMA's tables, South Carolina still has a median bill lower than the country's. Two features of the data explain part of it. First, ${K.num(z.X?.n ?? 0)} policies are rated X, B or C, a large block of homes outside the mapped high-risk area whose median bill is ${K.usd(z.X?.median ?? 0)}. Second, the A zone median itself is moderate, ${K.usd(z.A?.median ?? 0)}, because Risk Rating 2.0 can weigh each building's first floor height and cost to rebuild, not only the zone letter.</p>
<p>Horry County, home to Myrtle Beach, shows the effect clearly. Its ${K.num(horry?.pol?.n ?? 0)} policies had a median of ${K.usd(horry?.pol?.median ?? 0)} on ${date}, with a full-risk median of ${K.usd(horry?.pol?.full ?? 0)}: the yearly increases there are nearly done. Georgetown County, which borders Horry to the south, is another story, at ${K.usd(georgetown?.pol?.median ?? 0)} against ${K.usd(georgetown?.pol?.full ?? 0)}.</p>
${h.mini('zone', { t: 'Median South Carolina bill by type of flood zone', p: ['z'], d: { sx: 'south-carolina', z: 'V' } })}
<h2>The front row pays for velocity</h2>
<p>V zones are FEMA's coastal high hazard areas, flooded by tidal water with velocity. South Carolina has ${K.num(z.V?.n ?? 0)} single-family policies rated there, few in number but far from their final price: the median full-risk bill is ${K.dec((z.V?.full ?? 0) / (z.V?.median ?? 1), 1)} times the median paid today. At ${K.pct(K.P.caps.standard, 0)} a year on a main home, that distance takes several renewals to close. A second home in a V zone moves at ${K.pct(K.P.caps.higher, 0)} a year instead.</p>
<h2>Three storms in three years</h2>
<p>${matthew?.event ?? 'The largest hurricane'} in ${matthew?.year ?? N.claimYears[0]} produced ${K.num(matthew?.n ?? 0)} paid single-family claims, the most of any event in the state's ${N.claimYears[0]} to ${N.claimYears[1]} records. ${florence ? `${florence.event} followed in ${florence.year} with fewer claims, ${K.num(florence.n)}, but ${K.usd(florence.total)} in payments, a larger amount per house.` : ''} Across the whole period, ${K.num(st.claims?.n ?? 0)} claims were paid at a median of ${K.usd(st.claims?.median ?? 0)}. Claims rated in X zones had a higher median, ${K.usd(st.claimsByZone.X?.median ?? 0)}, than those in A zones, ${K.usd(st.claimsByZone.A?.median ?? 0)}.</p>
<h2>Where the largest gap hides</h2>
<p>The county with the widest distance between FEMA's 2023 current and full-risk medians is ${gap?.name ?? 'a smaller county'}, which borders both Charleston and Beaufort counties, with ${K.num(gap?.pif ?? 0)} policies. Beaufort County, around Hilton Head, is closer to balance at ${K.usd(beaufort?.pol?.median ?? 0)} paid against ${K.usd(beaufort?.pol?.full ?? 0)}. The ${h.a('flood-zones-explained', 'flood zone guide')} explains how the letters on a map change the rate.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Charleston, South Carolina?', a: `Charleston County had ${K.num(charleston?.pol?.n ?? 0)} single-family flood policies on ${date}, with a median yearly bill of ${K.usd(charleston?.pol?.median ?? 0)} including fees. At full risk the median would be ${K.usd(charleston?.pol?.full ?? 0)}, and ${K.pct(charleston?.pol?.capped ?? 0, 0)} of those policies still pay below it. Each house is priced on its own flood risk, including its first floor height and its proximity to flood sources.` },
    { q: 'Is flood insurance cheaper in Myrtle Beach than in Charleston?', a: `At the county level, yes. Horry County, which includes Myrtle Beach, had a median single-family bill of ${K.usd(horry?.pol?.median ?? 0)} on ${date}, against ${K.usd(charleston?.pol?.median ?? 0)} in Charleston County. Horry also had more paid claims per policy over ${N.claimYears[0]} to ${N.claimYears[1]}, ${K.num(horry?.claims?.n ?? 0)} in all, with a median of ${K.usd(horry?.claims?.median ?? 0)}.` },
    { q: 'How many South Carolina flood claims did Hurricane Matthew cause?', a: `The federal program paid ${K.num(matthew?.n ?? 0)} claims on South Carolina single-family homes for ${matthew?.event ?? 'that storm'} in ${matthew?.year ?? N.claimYears[0]}, for ${K.usd(matthew?.total ?? 0)} in building and contents payments. That is about ${K.pct((matthew?.n ?? 0) / (st.claims?.n ?? 1), 0)} of all paid single-family claims in the state from ${N.claimYears[0]} to ${N.claimYears[1]}.` },
  ],
  related: ['flood-zones-explained', 'flood-insurance-second-home', 'flood-insurance-by-state', 'state:north-carolina'],
});
