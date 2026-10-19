import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('missouri');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const at = (name: string) => st.topCounties.find((c) => c.name === name);
const stl = at('St. Louis County');
const stc = at('St. Charles County');
const jeff = at('Jefferson County');
const scott = at('Scott County');
const pem = at('Pemiscot County');
const kc = at('Jackson County');
const spring = st.events[0];
const july = st.events[1];
const band = st.ranges[0];
const natBand = N.ranges[0];
const metro = [stl, stc, jeff].reduce((s, c) => s + (c?.claims?.n ?? 0), 0);

export default defineState({
  slug: 'missouri',
  title: 'Flood Insurance Missouri 2026: St. Louis to the Bootheel',
  description: `Flood insurance in Missouri 2026: median bill on ${date}, St. Louis counties far below full risk, cheap Bootheel policies, claims of the ${spring.year} floods.`,
  intro: `Missouri has ${K.num(pol.n)} single-family flood policies; the median bill was ${K.usd(pol.median)} on ${date}, with large gaps around St. Louis.`,
  resume: `The ${K.num(pol.n)} single-family flood policies in force in Missouri on ${date} had a median yearly bill of ${K.usd(pol.median)}, a total that includes the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. Priced at full risk, the median would be ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of policies still pay less than that. Prices vary widely inside the state. In Jefferson County, south of St. Louis, the median bill was ${K.usd(jeff?.pol?.median ?? 0)} against a full-risk median of ${K.usd(jeff?.pol?.full ?? 0)}; in Scott County, in the Bootheel, policies cost a median ${K.usd(scott?.pol?.median ?? 0)} and were already near full price. Missouri claims are large: the median paid single-family claim from ${N.claimYears[0]} to ${N.claimYears[1]} was ${K.usd(st.claims?.median ?? 0)}, and the ${spring.event.toLowerCase()} of ${spring.year} alone produced ${K.num(spring.n)} paid claims.`,
  body: (h) => `
<h2>The rivers around St. Louis</h2>
<p>Three counties around St. Louis hold the heart of Missouri's flood market. The Meramec River runs through St. Louis and Jefferson counties, where the USGS gauges it at Valley Park and Arnold. St. Louis County had ${K.num(stl?.pol?.n ?? 0)} policies on ${date}, St. Charles County ${K.num(stc?.pol?.n ?? 0)} and Jefferson County ${K.num(jeff?.pol?.n ?? 0)}. Together they paid ${K.num(metro)} single-family claims for losses from ${N.claimYears[0]} to ${N.claimYears[1]}.</p>
<p>They are also the counties furthest from full price. In St. Charles County, ${K.pct(stc?.pol?.capped ?? 0, 0)} of policies were still capped, with a median bill of ${K.usd(stc?.pol?.median ?? 0)} and a full-risk median of ${K.usd(stc?.pol?.full ?? 0)}. Jefferson County is further still: ${K.pct(jeff?.pol?.capped ?? 0, 0)} capped and a full-risk median more than double the bill paid. For an owner there, the yearly ${K.pct(K.P.caps.standard, 0)} rise on a main home is likely to continue for years.</p>
${h.mini('state', { t: 'Compare a bill with the Missouri medians', p: ['cur'], d: { sx: 'missouri', cur: 0 } })}
<h2>The Bootheel: low bills, settled prices</h2>
<p>The southeast corner of the state shows the opposite picture. Scott, Pemiscot and New Madrid counties belong to the state's ${h.ext('https://dnr.mo.gov/waste-recycling/reduce-reuse-recycle/solid-waste-management-districts/district-s-bootheel', 'Bootheel district')}, and their policies are among the cheapest in Missouri: Pemiscot County's median bill was ${K.usd(pem?.pol?.median ?? 0)}, almost exactly its full-risk median of ${K.usd(pem?.pol?.full ?? 0)}. FEMA prices each home from flood frequency, flood types, distance to flood sources, first floor height and the cost to rebuild, so a low bill reflects that model.</p>
<p>Across the state, FEMA's 2023 bands placed ${K.pct(band?.share ?? 0, 0)} of Missouri single-family policies at a full-risk cost under ${K.usd(band?.hi ?? 0)} a year, close to the national ${K.pct(natBand?.share ?? 0, 0)}.</p>
<h2>What the big floods paid</h2>
<p>The ${spring.event.toLowerCase()} of ${spring.year} paid ${K.num(spring.n)} claims and ${K.usd(spring.total)} on Missouri single-family homes, the largest event in the file. ${july?.event ?? 'A summer flash flood'} in ${july?.year ?? ''} followed with ${K.num(july?.n ?? 0)} claims. Claims in A zones had a median of ${K.usd(st.claimsByZone.A?.median ?? 0)}, and the ${K.num(st.claimsByZone.X?.n ?? 0)} claims in X, B or C zones a median of ${K.usd(st.claimsByZone.X?.median ?? 0)}.</p>
<p>On the Arkansas line, ${st.maxGap?.name ?? 'one county'} had the largest ratio of full-risk to current cost in FEMA's 2023 table. Jackson County, which includes Independence and part of Kansas City, sits between the extremes at ${K.usd(kc?.pol?.median ?? 0)}. The ${h.a('flood-insurance-waiting-period', 'waiting period guide')} explains why coverage bought during a spring flood watch usually starts too late.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in St. Charles County, Missouri?', a: `St. Charles County had ${K.num(stc?.pol?.n ?? 0)} single-family flood policies on ${date}, with a median yearly bill of ${K.usd(stc?.pol?.median ?? 0)}. At full risk, the median would be ${K.usd(stc?.pol?.full ?? 0)}, and ${K.pct(stc?.pol?.capped ?? 0, 0)} of the county's policies are still below it, so many bills will keep rising at the capped rate.` },
    { q: 'Why is flood insurance so cheap in southeast Missouri?', a: `In Scott County the median bill was ${K.usd(scott?.pol?.median ?? 0)} on ${date}, and in Pemiscot County ${K.usd(pem?.pol?.median ?? 0)}, both close to their full-risk medians. FEMA's model sets those prices from each home's flood sources, first floor height and cost to rebuild, and in these two counties the result is a bill well under the state median of ${K.usd(pol.median)}.` },
    { q: `How many Missouri flood claims came from the ${spring.year} storms?`, a: `The federal program paid ${K.num(spring.n)} single-family claims in Missouri for the ${spring.event.toLowerCase()} of ${spring.year}, ${K.usd(spring.total)} for buildings and contents. That is the largest event in the state's paid claims from ${N.claimYears[0]} to ${N.claimYears[1]}, ahead of ${july?.event ?? 'a later flood'} with ${K.num(july?.n ?? 0)} claims.` },
  ],
  related: ['flood-insurance-waiting-period', 'flood-insurance-by-state', 'average-flood-insurance-claim', 'state:nebraska'],
});
