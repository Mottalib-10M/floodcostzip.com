import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const la = K.S('louisiana');
const N = K.N;
const asOf = K.day(N.policiesDate!);
const p = la.pol!;
const byZ = la.polByZone;
const parish = (name: string) => la.topCounties.find((c) => c.name === name);
const jeff = parish('Jefferson Parish');
const orleans = parish('Orleans Parish');
const ebr = parish('East Baton Rouge Parish');
const liv = parish('Livingston Parish');
const tam = parish('St. Tammany Parish');
const summer = la.events[0];
const ida = la.events.find((e) => e.event === 'Hurricane Ida');
const paid = la.claims?.n ?? 0;
const ofPaid = (n: number) => K.pct(n / (paid || 1), 0);
const steps = K.glide({ current: p.median, full: p.full, cap: K.P.caps.standard, fees: K.fees('primary') }).steps;

export default defineState({
  slug: 'louisiana',
  title: 'Flood Insurance Louisiana 2026: Parish Costs After Ida',
  description: `Louisiana flood insurance in 2026: median single-family bill by parish and ZIP on ${asOf}, the 2016 Baton Rouge floods, Ida, and the gap to full risk.`,
  intro: `Louisiana counts ${K.num(p.n)} single-family flood policies; the median one cost ${K.usd(p.median)} on ${asOf}, assessment and fees included.`,
  resume: `On ${asOf}, the ${K.num(p.n)} single-family flood policies written through the federal program in Louisiana had a median yearly cost of ${K.usd(p.median)}, counting premium, Reserve Fund Assessment, HFIAA surcharge and the Federal Policy Fee. Priced at full risk, the same policies would have a median of ${K.usd(p.full)}, and ${K.pct(p.capped, 0)} of them still pay less than that full-risk premium. The state is split almost evenly between A zones (${K.num(byZ.A?.n ?? 0)} policies, median ${K.usd(byZ.A?.median ?? 0)}) and X zones (${K.num(byZ.X?.n ?? 0)}, median ${K.usd(byZ.X?.median ?? 0)}), a mix found in few other states. Parish averages hide wide contrasts: around New Orleans most owners remain on the yearly glide path, while in East Baton Rouge Parish the median bill has already caught up with its full-risk price. From the statewide median, a main home capped at ${K.pct(K.P.caps.standard, 0)} a year needs about ${steps} more renewals to reach full risk. Over ${N.claimYears[0]} to ${N.claimYears[1]}, the program paid ${K.num(paid)} single-family claims here, with a median of ${K.usd(la.claims?.median ?? 0)}.`,
  body: (h) => `
<h2>The rain of August 2016 still dominates the claims file</h2>
<p>Hurricanes get the headlines, yet the single costliest event in the Louisiana records of ${N.claimYears[0]} to ${N.claimYears[1]} was a stalled rainstorm. The ${summer?.event.toLowerCase() ?? 'summer storms'} of ${summer?.year ?? N.claimYears[0]} produced ${K.num(summer?.n ?? 0)} paid single-family claims worth ${K.usd(summer?.total ?? 0)}, roughly ${ofPaid(summer?.n ?? 0)} of every paid claim in the state over the decade. Most of that water fell inland, around Baton Rouge, far from the Gulf.</p>
<p>The parish figures carry the mark. East Baton Rouge Parish logged ${K.num(ebr?.claims?.n ?? 0)} paid claims with a median of ${K.usd(ebr?.claims?.median ?? 0)}, and Livingston Parish ${K.num(liv?.claims?.n ?? 0)} with a median of ${K.usd(liv?.claims?.median ?? 0)}. Compare Orleans Parish, where the median paid claim was ${K.usd(orleans?.claims?.median ?? 0)}, a sign of shallower water in most of its flooded homes.</p>
${h.mini('claims', { t: 'A median Louisiana claim set against one year of premium', p: ['cur'], d: { sx: 'louisiana' } })}
<h2>Ida and the coastal parishes</h2>
<p>${ida ? `${ida.event} (${ida.year}) ranks second, with ${K.num(ida.n)} paid claims and ${K.usd(ida.total)} paid.` : 'Hurricane claims rank behind the inland rain events.'} Surge is the reason: FEMA's 2023 tables put ${K.pct(la.exposure.surge, 0)} of Louisiana single-family policies in reach of storm surge, against ${K.pct(N.exposure.surge, 0)} nationwide. Plaquemines Parish shows the widest distance between what owners paid in 2023 (${K.usd(la.maxGap?.current ?? 0)} at the median) and the full-risk figure (${K.usd(la.maxGap?.risk ?? 0)}).</p>
<p>Only ${K.num(byZ.V?.n ?? 0)} policies sit in V zones, where waves are expected; their median of ${K.usd(byZ.V?.median ?? 0)} is the highest of any zone type in the state, and their full-risk median reaches ${K.usd(byZ.V?.full ?? 0)}.</p>
<h2>Two speeds of increase across the metro areas</h2>
<p>Jefferson Parish has the largest book in the state, ${K.num(jeff?.pol?.n ?? 0)} policies, and ${K.pct(jeff?.pol?.capped ?? 0, 0)} of them are still below full risk; its median bill of ${K.usd(jeff?.pol?.median ?? 0)} has a full-risk counterpart of ${K.usd(jeff?.pol?.full ?? 0)}. St. Tammany Parish, on the north shore, looks similar with ${K.pct(tam?.pol?.capped ?? 0, 0)} capped. In East Baton Rouge, only ${K.pct(ebr?.pol?.capped ?? 0, 0)} remain capped and the median bill (${K.usd(ebr?.pol?.median ?? 0)}) is level with full risk, so the cap has little left to phase in there.</p>
${h.mini('glide', { t: 'Renewals left at the Jefferson Parish medians', p: ['cur', 'full', 'use'], d: { cur: jeff?.pol?.median ?? p.median, full: jeff?.pol?.full ?? p.full, use: 'primary' } })}
<p>A sale does not reset these figures: a buyer can take over the seller's policy and its discount. The ${h.a('buying-a-house-in-a-flood-zone', 'guide on buying in a flood zone')} explains the transfer, and the ${h.a('flood-zones-explained', 'zone guide')} what A, V and X mean on a parish map. The parish table further down lists every parish with enough policies to publish.</p>
`,
  faqs: [
    { q: 'What does flood insurance cost in Jefferson Parish, Louisiana?', a: `The median single-family bill in Jefferson Parish was ${K.usd(jeff?.pol?.median ?? 0)} a year on ${asOf}, across ${K.num(jeff?.pol?.n ?? 0)} federal policies. At full risk the same homes would have a median of ${K.usd(jeff?.pol?.full ?? 0)}, which is why ${K.pct(jeff?.pol?.capped ?? 0, 0)} of them still see a yearly increase. Elevation and the lowest-floor height drive the price of a single house.` },
    { q: 'Why are flood claims so large in Livingston and East Baton Rouge parishes?', a: `Both parishes were hit hardest by the ${summer?.year ?? N.claimYears[0]} rain floods, which put deep water in houses for days. Livingston Parish's median paid claim from ${N.claimYears[0]} to ${N.claimYears[1]} was ${K.usd(liv?.claims?.median ?? 0)} and East Baton Rouge's ${K.usd(ebr?.claims?.median ?? 0)}, well above the statewide ${K.usd(la.claims?.median ?? 0)} and the national ${K.usd(N.claims.median)}.` },
    { q: 'Do Louisiana homes outside a high-risk zone file flood claims?', a: `Yes. Of the ${K.num(paid)} single-family claims paid in Louisiana over ${N.claimYears[0]} to ${N.claimYears[1]}, ${K.num(la.claimsByZone.X?.n ?? 0)} were on homes rated in X, B or C zones, with a median of ${K.usd(la.claimsByZone.X?.median ?? 0)}. Those zones held ${K.num(byZ.X?.n ?? 0)} policies on ${asOf}, at a median bill of ${K.usd(byZ.X?.median ?? 0)}.` },
  ],
  related: ['flood-insurance-by-state', 'average-flood-insurance-claim', 'buying-a-house-in-a-flood-zone', 'state:mississippi'],
});
