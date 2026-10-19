import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('new-mexico');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const cz = st.claimsByZone;
const get = (name: string) => st.topCounties.find((x) => x.name === name);
const valencia = get('Valencia County');
const bern = get('Bernalillo County');
const dona = get('Doña Ana County');
const lea = get('Lea County');
const sf = get('Santa Fe County');
const otero = get('Otero County');
const july = st.events[0];
const cl = st.claims;

export default defineState({
  slug: 'new-mexico',
  title: 'Flood Insurance New Mexico 2026: Desert Floods and Prices',
  description: `Flood insurance in New Mexico 2026: median single-family bill on ${date} by county, Rio Grande prices, why claims run large and the July 2025 floods.`,
  intro: `New Mexico has ${K.num(pol.n)} single-family flood policies, at a median of ${K.usd(pol.median)} a year on ${date}.`,
  resume: `Flood insurance in New Mexico is a small market with a flat price. The ${K.num(pol.n)} single-family policies in force on ${date} had a median yearly cost of ${K.usd(pol.median)}, counting the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee, which is about the national median of ${K.usd(N.policies!.median)}. The zone letter changes little: A-zone homes paid ${K.usd(z.A?.median ?? 0)} at the median and X-zone homes ${K.usd(z.X?.median ?? 0)}. Bills are also near their model level, with a full-risk median of ${K.usd(pol.full)} and ${K.pct(pol.capped, 0)} of policies still below it. What sets New Mexico apart is the size of its claims. Only ${K.num(cl?.n ?? 0)} single-family claims were paid between ${N.claimYears[0]} and ${N.claimYears[1]}, but their median was ${K.usd(cl?.median ?? 0)}, and in A zones ${K.usd(cz.A?.median ?? 0)}. Valencia County, south of Albuquerque, has more policies than any other county.`,
  body: (h) => `
<h2>Rare floods, costly ones</h2>
<p>A few hundred paid claims in ten years is a thin record for a whole state, and it means each flood counts. When a flood does reach insured homes, the bill is high: the median paid on A-zone homes, ${K.usd(cz.A?.median ?? 0)}, is more than twice the median on X-zone homes, ${K.usd(cz.X?.median ?? 0)}, and X-rated homes still filed ${K.num(cz.X?.n ?? 0)} of the paid claims.</p>
${july ? `<p>The largest single event is the July ${july.year} flooding, with ${K.num(july.n)} paid single-family claims worth ${K.usd(july.total)}, an average of about ${K.usd(july.total / july.n)} per home. Claims from ${N.claimYears[1]} are still being settled, so that total can grow.</p>` : ''}
${h.mini('claims', { t: 'New Mexico median claim against a yearly bill', p: ['cur'], d: { sx: 'new-mexico', cur: pol.median } })}
<h2>Valencia leads, Albuquerque follows</h2>
<p>Valencia County, on the Rio Grande south of the city, had ${K.num(valencia?.pol?.n ?? 0)} policies at a median of ${K.usd(valencia?.pol?.median ?? 0)}, nearly twice the ${K.num(bern?.pol?.n ?? 0)} of Bernalillo County, where Albuquerque sits and the median bill was lower, ${K.usd(bern?.pol?.median ?? 0)}. Doña Ana County around Las Cruces had ${K.num(dona?.pol?.n ?? 0)} policies at ${K.usd(dona?.pol?.median ?? 0)}, and Otero County ${K.num(otero?.pol?.n ?? 0)} at ${K.usd(otero?.pol?.median ?? 0)}. Santa Fe County was the cheapest of the large counties at ${K.usd(sf?.pol?.median ?? 0)}. Sandoval County, north of Albuquerque, sat near the state median at ${K.usd(get('Sandoval County')?.pol?.median ?? 0)}, while Roosevelt County, on the eastern plains, paid ${K.usd(get('Roosevelt County')?.pol?.median ?? 0)} on a much smaller base.</p>
<p>The southeast is where bills have the most catching up to do. Lea County policies paid a median of ${K.usd(lea?.pol?.median ?? 0)} against ${K.usd(lea?.pol?.full ?? 0)} at full risk, with ${K.pct(lea?.pol?.capped ?? 0, 0)} still capped. In FEMA's 2023 table, ${st.maxGap?.name ?? 'one county'} showed the widest gap of the state between the full-risk and the current cost.</p>
<h2>Timing a purchase</h2>
<p>A new federal policy bought without a loan takes effect after ${K.P.waiting.days} days. A policy bought a few days before a forecast storm is not yet in force when that storm arrives. The exception for flooding caused by post-wildfire conditions on federal land allows coverage from the next day when it is bought within ${K.P.waiting.wildfirePurchaseWindowDays} days of the fire's containment; the ${h.a('flood-insurance-waiting-period', 'waiting period guide')} sets out its conditions.</p>
${h.mini('waiting', { t: 'Would a flood be covered after this many days?', p: ['sit', 'days'], d: { sit: 'standard', days: 14 } })}
`,
  faqs: [
    { q: 'How much is flood insurance in Albuquerque?', a: `In Bernalillo County, which contains Albuquerque, ${K.num(bern?.pol?.n ?? 0)} single-family flood policies had a median yearly bill of ${K.usd(bern?.pol?.median ?? 0)} on ${date}, federal charges included. The median full-risk bill was ${K.usd(bern?.pol?.full ?? 0)}, so most policies are close to their final price. Valencia County, to the south, paid a higher median of ${K.usd(valencia?.pol?.median ?? 0)}.` },
    { q: 'Why are New Mexico flood claims so large?', a: `The median paid single-family claim in New Mexico was ${K.usd(cl?.median ?? 0)} from ${N.claimYears[0]} to ${N.claimYears[1]}, on only ${K.num(cl?.n ?? 0)} claims. Floods there are infrequent, so the record holds few small losses, and the median is pulled up by large losses. A-zone claims had a median of ${K.usd(cz.A?.median ?? 0)}.` },
    { q: 'Does a New Mexico flood after a wildfire have a waiting period?', a: `Usually ${K.P.waiting.days} days. Federal rules allow coverage to start the next day when the flooding is caused or made worse by post-wildfire conditions on federal land and the policy was bought on or before the fire's containment date or within ${K.P.waiting.wildfirePurchaseWindowDays} days after it. The property must be privately owned. Other purchases follow the normal wait.` },
  ],
  related: ['flood-insurance-by-state', 'flood-insurance-waiting-period', 'average-flood-insurance-claim', 'state:texas'],
});
