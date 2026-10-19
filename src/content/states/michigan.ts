import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const mi = K.S('michigan');
const N = K.N;
const on = K.day(N.policiesDate!);
const m = mi.pol!;
const zz = mi.polByZone;
const pick = (name: string) => mi.topCounties.find((x) => x.name === name);
const wayne = pick('Wayne County');
const macomb = pick('Macomb County');
const stclair = pick('St. Clair County');
const monroe = pick('Monroe County');
const oakland = pick('Oakland County');
const saginaw = pick('Saginaw County');
const ingham = pick('Ingham County');
const aShare = (zz.A?.n ?? 0) / m.n;
const claimsTotal = mi.claims?.n ?? 0;

export default defineState({
  slug: 'michigan',
  title: 'Flood Insurance Michigan 2026: Great Lakes and River Bills',
  description: `Michigan flood insurance in 2026: what single-family homes paid on ${on} by county and ZIP, Detroit area prices, Great Lakes exposure, Saginaw claims.`,
  intro: `On ${on}, Michigan counted ${K.num(m.n)} single-family flood policies with a median bill of ${K.usd(m.median)}.`,
  resume: `Michigan is a small flood insurance market for its size: ${K.num(m.n)} single-family policies in the federal program on ${on}, with a median yearly bill of ${K.usd(m.median)}, which counts the premium, the Reserve Fund Assessment, the HFIAA surcharge and the policy fee. That median is below the national ${K.usd(N.policies!.median)}, and it is near its own full-risk level: priced at full risk the same policies would have a median of ${K.usd(m.full)}, and ${K.pct(m.capped, 0)} still pay less than their full-risk premium, against ${K.pct(N.policies!.capped, 0)} nationally. The book leans heavily to mapped high-risk areas: ${K.pct(aShare, 0)} of policies are in A zones (median ${K.usd(zz.A?.median ?? 0)}), the zones where a federally backed mortgage requires coverage. FEMA's 2023 tables also rate Great Lakes exposure, and ${K.pct(mi.exposure.greatLakes, 0)} of Michigan policies were exposed to it in 2023. From ${N.claimYears[0]} to ${N.claimYears[1]}, the state had ${K.num(claimsTotal)} paid single-family claims, median ${K.usd(mi.claims?.median ?? 0)}.`,
  body: (h) => `
<h2>Few policies, mostly where a lender asks</h2>
<p>Only ${K.num(zz.X?.n ?? 0)} Michigan single-family policies were written in X zones on ${on}, where buying is voluntary, against ${K.num(zz.A?.n ?? 0)} in A zones. The X-zone median bill was ${K.usd(zz.X?.median ?? 0)}, not far below the A-zone figure, because a large part of any small bill is fixed: the ${K.usd(K.P.fees.federalPolicyFee.primary)} Federal Policy Fee and the ${K.usd(K.P.fees.hfiaa.primary)} HFIAA surcharge for a main home do not depend on risk.</p>
<p>The claims show the cost of that gap in coverage. ${K.num(mi.claimsByZone.X?.n ?? 0)} of the state's paid claims over the decade came from X, B or C zones, with a median of ${K.usd(mi.claimsByZone.X?.median ?? 0)}. No single flood event paid enough Michigan claims over those years to stand out as a named event in the file.</p>
${h.mini('state', { t: 'Set a bill against the Michigan medians', p: ['cur'], d: { sx: 'michigan', cur: 0 } })}
<h2>Detroit area: Wayne, Oakland, Macomb and St. Clair</h2>
<p>Wayne County, which includes Detroit, holds ${K.num(wayne?.pol?.n ?? 0)} policies, about ${K.pct((wayne?.pol?.n ?? 0) / m.n, 0)} of the state. Its median bill of ${K.usd(wayne?.pol?.median ?? 0)} is already at full risk for most homes (${K.pct(wayne?.pol?.capped ?? 0, 0)} capped). The county also has the most paid claims in the state, ${K.num(wayne?.claims?.n ?? 0)}, with a median of ${K.usd(wayne?.claims?.median ?? 0)}. Oakland County is cheaper still at ${K.usd(oakland?.pol?.median ?? 0)}.</p>
<p>On Lake St. Clair and the St. Clair River, Macomb and St. Clair counties together carry ${K.num((macomb?.pol?.n ?? 0) + (stclair?.pol?.n ?? 0))} policies at medians of ${K.usd(macomb?.pol?.median ?? 0)} and ${K.usd(stclair?.pol?.median ?? 0)}.</p>
<h2>Monroe, Saginaw and Ingham</h2>
<p>Monroe County, on Lake Erie, stands apart. Its median bill was ${K.usd(monroe?.pol?.median ?? 0)} on ${on}, but the full-risk median is ${K.usd(monroe?.pol?.full ?? 0)} and ${K.pct(monroe?.pol?.capped ?? 0, 0)} of its policies are still capped, the most of any large Michigan county. At ${K.pct(K.P.caps.standard, 0)} a year, closing that distance takes several renewals.</p>
<p>Saginaw County shows the other risk: the largest losses. Its ${K.num(saginaw?.claims?.n ?? 0)} paid claims had a median of ${K.usd(saginaw?.claims?.median ?? 0)}, ${K.dec((saginaw?.claims?.median ?? 0) / (mi.claims?.median || 1), 1)} times the state median, against a modest median bill of ${K.usd(saginaw?.pol?.median ?? 0)}. Ingham County, around Lansing, has the highest median bill among the large counties, ${K.usd(ingham?.pol?.median ?? 0)}. The ${h.a('average-flood-insurance-claim', 'claims guide')} puts these sizes in national context, and the ${h.a('flood-zones-explained', 'zone guide')} explains A and X.</p>
`,
  faqs: [
    { q: 'How much does flood insurance cost in Wayne County, Michigan?', a: `Wayne County's median single-family flood bill was ${K.usd(wayne?.pol?.median ?? 0)} a year on ${on}, across ${K.num(wayne?.pol?.n ?? 0)} federal policies, with a full-risk median of ${K.usd(wayne?.pol?.full ?? 0)}. Only ${K.pct(wayne?.pol?.capped ?? 0, 0)} of those policies still pay less than full risk, so yearly changes there are small. The ZIP lookup shows Detroit neighborhoods separately.` },
    { q: 'Are Great Lakes floods covered by Michigan flood insurance?', a: `A federal flood policy pays for direct flood damage within the ${K.usd(K.P.limits.building)} building and ${K.usd(K.P.limits.contents)} contents limits, and its own definition of a flood decides which lakeshore losses qualify. FEMA's model rates Great Lakes exposure separately: ${K.pct(mi.exposure.greatLakes, 0)} of Michigan single-family policies carried it in 2023. The ZIP lookup gives the median for each lakeshore ZIP code.` },
    { q: 'Why is Monroe County flood insurance rising faster than elsewhere in Michigan?', a: `Because its bills start far below full risk. On ${on} the Monroe County median was ${K.usd(monroe?.pol?.median ?? 0)} against a full-risk median of ${K.usd(monroe?.pol?.full ?? 0)}, and ${K.pct(monroe?.pol?.capped ?? 0, 0)} of policies were capped. Those homes see increases of up to ${K.pct(K.P.caps.standard, 0)} a year for a main home until they reach full risk.` },
  ],
  related: ['flood-insurance-by-state', 'average-flood-insurance-claim', 'flood-zones-explained', 'state:ohio'],
});
