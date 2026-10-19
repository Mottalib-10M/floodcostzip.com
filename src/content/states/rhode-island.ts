import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ri = K.S('rhode-island');
const N = K.N;
const dt = K.day(N.policiesDate!);
const r = ri.pol!;
const zv = ri.polByZone.V;
const za = ri.polByZone.A;
const zx = ri.polByZone.X;
const co = (name: string) => ri.topCounties.find((x) => x.name === name);
const wash = co('Washington County');
const bristol = co('Bristol County');
const newport = co('Newport County');
const kent = co('Kent County');
const prov = co('Providence County');
const vShare = (zv?.n ?? 0) / r.n;
const natV = (N.policies!.zone.V?.n ?? 0) / N.policies!.n;
const ida = ri.events.find((e) => e.event === 'Hurricane Ida');
const noreaster = ri.events.find((e) => e.event.includes('Nor'));

export default defineState({
  slug: 'rhode-island',
  title: "Flood Insurance Rhode Island 2026: South County and the Bay",
  description: `Rhode Island flood insurance 2026: what single-family homes pay by county and ZIP on ${dt}, V-zone shore prices, Narragansett Bay, recent claims.`,
  intro: `Rhode Island's ${K.num(r.n)} single-family flood policies cost a median ${K.usd(r.median)} a year on ${dt}.`,
  resume: `Rhode Island's median flood bill sits above the national ${K.usd(N.policies!.median)}: ${K.usd(r.median)} a year on ${dt} for the ${K.num(r.n)} single-family policies in the federal program, a total that includes the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. Its shoreline explains most of the difference. ${K.num(zv?.n ?? 0)} of those policies, about ${K.pct(vShare, 0)}, are in V zones, where waves are part of the mapped hazard, a share many times the national ${K.pct(natV, 1)}. Their median bill was ${K.usd(zv?.median ?? 0)}. A-zone homes paid ${K.usd(za?.median ?? 0)} and X-zone homes ${K.usd(zx?.median ?? 0)}. The state is not far from full risk overall: the median full-risk bill is ${K.usd(r.full)} and ${K.pct(r.capped, 0)} of policies still pay less than their full-risk premium. Washington County, the South County shore, carries ${K.pct((wash?.pol?.n ?? 0) / r.n, 0)} of all policies. Claims have been few: ${K.num(ri.claims?.n ?? 0)} paid single-family claims from ${N.claimYears[0]} to ${N.claimYears[1]}, median ${K.usd(ri.claims?.median ?? 0)}.`,
  body: (h) => `
<h2>A small state with a long exposed coast</h2>
<p>For its size, Rhode Island has a lot of shoreline open to the ocean and to Narragansett Bay. FEMA's 2023 tables counted ${K.pct(ri.exposure.surge, 0)} of its single-family policies as exposed to storm surge and ${K.pct(ri.exposure.erosion, 0)} to coastal erosion, among the highest erosion shares of any state. Every county touches salt water, and the five counties make up the whole county table further down.</p>
<p>The V-zone count is the key figure. Elsewhere in the Northeast, high-velocity zones hold a small slice of the market. Here ${K.pct(vShare, 0)} of policies are, and the V-zone full-risk median is ${K.usd(zv?.full ?? 0)}.</p>
${h.mini('zone', { t: 'Rhode Island median bill by zone, V zones first', p: ['z'], d: { sx: 'rhode-island', z: 'V' } })}
<h2>County by county</h2>
<p>Washington County (${K.num(wash?.pol?.n ?? 0)} policies) had a median bill of ${K.usd(wash?.pol?.median ?? 0)} on ${dt}, and Bristol County, on the east side of the bay, ${K.usd(bristol?.pol?.median ?? 0)}. Of the coastal counties, Bristol has the highest share of policies still capped, ${K.pct(bristol?.pol?.capped ?? 0, 0)}. Newport County is the cheapest of the coastal group at ${K.usd(newport?.pol?.median ?? 0)} and the closest to full risk, with ${K.pct(newport?.pol?.capped ?? 0, 0)} capped.</p>
<p>Inland, Providence County has the fewest policies, ${K.num(prov?.pol?.n ?? 0)}, but showed the widest 2023 gap between what owners paid (${K.usd(ri.maxGap?.current ?? 0)}) and the full-risk figure (${K.usd(ri.maxGap?.risk ?? 0)}). It also logged the most paid claims of any county, ${K.num(prov?.claims?.n ?? 0)}, more than Washington's ${K.num(wash?.claims?.n ?? 0)}, so inland flooding counts here too. Kent County sits between the two at ${K.usd(kent?.pol?.median ?? 0)}.</p>
<h2>What the last decade of claims shows</h2>
<p>The totals over the claims window are modest. ${ida ? `${ida.event} in ${ida.year} produced ${K.num(ida.n)} paid claims` : 'Ida produced a few dozen claims'}${noreaster ? `, and the ${noreaster.event} of ${noreaster.year} ${K.num(noreaster.n)}` : ''}. The median paid claim was ${K.usd(ri.claims?.median ?? 0)}, far below the national ${K.usd(N.claims.median)}. A quiet decade does not lower the rated risk on the shore, and the ${h.a('flood-insurance-coverage-limits', 'coverage limits guide')} shows how a policy pays when a large surge reaches a house. The ${h.a('state:massachusetts', 'Massachusetts page')} and ${h.a('state:connecticut', 'Connecticut page')} give the neighbouring figures.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in South County, Rhode Island?', a: `South County is Washington County, where the median single-family flood bill was ${K.usd(wash?.pol?.median ?? 0)} a year on ${dt}, across ${K.num(wash?.pol?.n ?? 0)} federal policies. The full-risk median was ${K.usd(wash?.pol?.full ?? 0)}. Beachfront homes in V zones pay more than houses set back from the water, so the ZIP lookup gives a closer figure for a single town.` },
    { q: 'Why do so many Rhode Island homes have V-zone flood policies?', a: `Because much of the coast faces open water where FEMA maps breaking waves. On ${dt}, ${K.num(zv?.n ?? 0)} Rhode Island single-family policies were rated in V zones, about ${K.pct(vShare, 0)} of the state's total, at a median bill of ${K.usd(zv?.median ?? 0)}. Nationwide only ${K.pct(natV, 1)} of single-family policies are in V zones.` },
    { q: 'Is flood insurance in Providence cheaper than on the Rhode Island coast?', a: `Somewhat. The Providence County median bill was ${K.usd(prov?.pol?.median ?? 0)} on ${dt}, against ${K.usd(wash?.pol?.median ?? 0)} in Washington County. But Providence County bills are further from full risk, with ${K.pct(prov?.pol?.capped ?? 0, 0)} of policies capped, and the county had more paid claims from ${N.claimYears[0]} to ${N.claimYears[1]} than any other in the state.` },
  ],
  related: ['flood-insurance-by-state', 'flood-zones-explained', 'flood-insurance-coverage-limits', 'state:connecticut'],
});
