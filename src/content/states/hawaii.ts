import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const hi = K.S('hawaii');
const N = K.N;
const at = K.day(N.policiesDate!);
const q = hi.pol!;
const zn = hi.polByZone;
const isl = (name: string) => hi.topCounties.find((x) => x.name.startsWith(name));
const oahu = isl('Honolulu');
const maui = isl('Maui');
const kauai = isl('Kauai');
const big = isl('Hawaii County');
const low = hi.ranges[0];
const natLow = N.ranges[0];
const lane = hi.events[0];
const ratio = q.full / (q.median || 1);
const g = K.glide({ current: q.median, full: q.full, cap: K.P.caps.standard, fees: K.fees('primary') });

export default defineState({
  slug: 'hawaii',
  title: 'Flood Insurance Hawaii 2026: Tsunami Risk and Full Prices',
  description: `Hawaii flood insurance 2026: the median single-family bill on each island county on ${at}, tsunami exposure, and why full-risk prices run far higher.`,
  intro: `Hawaii's ${K.num(q.n)} single-family flood policies had a median bill of ${K.usd(q.median)} on ${at}, the full-risk median is ${K.usd(q.full)}.`,
  resume: `Of all the states, Hawaii shows the widest ratio between what flood insurance costs today and what it would cost at full risk. On ${at}, the median single-family bill in the federal program was ${K.usd(q.median)} a year, premium, Reserve Fund Assessment, HFIAA surcharge and policy fee included, across ${K.num(q.n)} policies. Priced at full risk, the same homes would have a median bill of ${K.usd(q.full)}, ${K.dec(ratio, 1)} times higher, and ${K.pct(q.capped, 0)} of them still pay less than their full-risk premium. The exposure figures stand out: FEMA's 2023 tables put ${K.pct(hi.exposure.tsunami, 0)} of Hawaii policies within reach of a tsunami and ${K.pct(hi.exposure.surge, 0)} within reach of storm surge. The gap shows even outside mapped high-risk areas, where the X-zone median bill of ${K.usd(zn.X?.median ?? 0)} faces a full-risk median of ${K.usd(zn.X?.full ?? 0)}. From the state median, a main home capped at ${K.pct(K.P.caps.standard, 0)} a year has about ${g.steps} renewals of increases ahead.`,
  body: (h) => `
<h2>Tsunami exposure and X zone prices</h2>
<p>No state has a larger share of its single-family policies rated as exposed to tsunami: ${K.pct(hi.exposure.tsunami, 0)} in FEMA's 2023 tables, against ${K.pct(N.exposure.tsunami, 0)} nationally. Hawaii also shows a pattern rare elsewhere: its X zones, the areas of moderate or minimal flood hazard, carry a full-risk median of ${K.usd(zn.X?.full ?? 0)}, close to the ${K.usd(zn.A?.full ?? 0)} of A zones. In this state, a house outside the mapped high-risk zone can still face a high full-risk price.</p>
<p>FEMA's 2023 price bands show the same thing. Only ${K.pct(low?.share ?? 0, 0)} of Hawaii homes had a full-risk price under ${K.usd(low?.hi ?? 0)}, while ${K.pct(natLow?.share ?? 0, 0)} of homes nationwide did. The median home is also expensive to rebuild, ${K.usd(hi.medianRcv)} in replacement cost against ${K.usd(N.medianRcv)} nationally.</p>
${h.mini('rank', { t: 'Where a full-risk quote falls among Hawaii homes', p: ['cost'], d: { sx: 'hawaii', cost: 3000 } })}
<h2>Island by island</h2>
<p>The City and County of Honolulu, which the ${h.ext('https://files.hawaii.gov/dbedt/economic/library/facts/Facts_Figures_printable.pdf', 'state fact sheet')} equates with the island of Oahu, holds ${K.num(oahu?.pol?.n ?? 0)} policies, ${K.pct((oahu?.pol?.n ?? 0) / q.n, 0)} of the state's. Its median bill was ${K.usd(oahu?.pol?.median ?? 0)} on ${at} and its full-risk median ${K.usd(oahu?.pol?.full ?? 0)}. Kauai, with ${K.num(kauai?.pol?.n ?? 0)} policies, paid ${K.usd(kauai?.pol?.median ?? 0)} at the median, and Maui ${K.usd(maui?.pol?.median ?? 0)}.</p>
<p>Hawaii County, the island of Hawaii, is the extreme. Its ${K.num(big?.pol?.n ?? 0)} policies had a median bill of ${K.usd(big?.pol?.median ?? 0)}, against a full-risk median of ${K.usd(big?.pol?.full ?? 0)}, and ${K.pct(big?.pol?.capped ?? 0, 0)} are capped. In FEMA's 2023 county table, no county in the country with ${K.num(1000)} policies or more had a larger ratio between full-risk and current price (${K.usd(hi.maxGap?.risk ?? 0)} against ${K.usd(hi.maxGap?.current ?? 0)}).</p>
${h.mini('glide', { t: 'Yearly steps to full risk at the Hawaii County medians', p: ['cur', 'full', 'use'], d: { cur: big?.pol?.median ?? q.median, full: big?.pol?.full ?? q.full, use: 'primary' } })}
<h2>Claims are few but large</h2>
<p>The program paid ${K.num(hi.claims?.n ?? 0)} single-family claims in Hawaii from ${N.claimYears[0]} to ${N.claimYears[1]}, with a median of ${K.usd(hi.claims?.median ?? 0)}. ${K.num(hi.claimsByZone.A?.n ?? 0)} of them were on A-zone homes and ${K.num(hi.claimsByZone.V?.n ?? 0)} in V zones. No storm dominates: ${lane ? `${lane.event} in ${lane.year}, the largest listed event, paid only ${K.num(lane.n)}.` : 'losses are spread over many small events.'} On Oahu the median paid claim was ${K.usd(oahu?.claims?.median ?? 0)}. A second home pays the ${K.pct(K.P.caps.higher, 0)} cap and the higher surcharge; the ${h.a('flood-insurance-second-home', 'second home guide')} and the ${h.a('private-flood-insurance', 'private flood insurance guide')} cover those cases.</p>
`,
  faqs: [
    { q: 'How much is flood insurance on Oahu?', a: `In the City and County of Honolulu, the median single-family flood bill was ${K.usd(oahu?.pol?.median ?? 0)} a year on ${at}, across ${K.num(oahu?.pol?.n ?? 0)} federal policies. The same homes at full risk would have a median of ${K.usd(oahu?.pol?.full ?? 0)}, and ${K.pct(oahu?.pol?.capped ?? 0, 0)} still pay less than that, so most Oahu bills keep climbing within the yearly cap.` },
    { q: 'Why is the full-risk flood price so high on the Big Island?', a: `On the island of Hawaii the median full-risk bill was ${K.usd(big?.pol?.full ?? 0)} on ${at}, against a current median of ${K.usd(big?.pol?.median ?? 0)}. Statewide, FEMA's 2023 tables rated ${K.pct(hi.exposure.tsunami, 0)} of single-family policies as exposed to tsunami and ${K.pct(hi.exposure.surge, 0)} to storm surge. ${K.pct(big?.pol?.capped ?? 0, 0)} of the county's policies were still below full risk.` },
    { q: 'Does a Hawaii flood policy cover tsunami damage?', a: `FEMA's 2023 exposure tables list tsunami as a hazard separate from inland flooding and surge, and ${K.pct(hi.exposure.tsunami, 0)} of Hawaii single-family policies were exposed to it in 2023. The policy wording sets which losses are paid; a licensed agent can show it. Limits are ${K.usd(K.P.limits.building)} for the building and ${K.usd(K.P.limits.contents)} for contents.` },
  ],
  related: ['flood-insurance-by-state', 'flood-insurance-rate-increase', 'private-flood-insurance', 'flood-insurance-second-home'],
});
