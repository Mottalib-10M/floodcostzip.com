import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('ohio');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const one = (name: string) => st.topCounties.find((c) => c.name === name);
const franklin = one('Franklin County');
const hamilton = one('Hamilton County');
const cuyahoga = one('Cuyahoga County');
const ottawa = one('Ottawa County');
const lucas = one('Lucas County');
const butler = one('Butler County');
const ev = st.events[0];
const band1 = st.ranges.find((r) => r.lo === 0);
const under1k = band1?.share ?? 0;

export default defineState({
  slug: 'ohio',
  title: 'Flood Insurance Ohio 2026: Lake Erie and River County Costs',
  description: `Flood insurance in Ohio 2026: the median single-family bill on ${date}, Lake Erie and Ohio River counties, X zone prices and recent flood claims.`,
  intro: `Ohio has ${K.num(pol.n)} single-family flood policies in the federal program; their median bill was ${K.usd(pol.median)} on ${date}.`,
  resume: `The median single-family flood bill in Ohio was ${K.usd(pol.median)} a year on ${date}, counting the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. It is a small market for a large state: ${K.num(pol.n)} policies, about ${K.pct(pol.n / N.policies!.n, 1)} of the national total. Prices are moderate and fairly settled. The median full-risk bill is ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of Ohio policies still pay below it. A policy rated in an A zone had a median bill of ${K.usd(z.A?.median ?? 0)}; one rated X, B or C cost ${K.usd(z.X?.median ?? 0)}. In FEMA's 2023 table, ${K.pct(under1k, 0)} of Ohio's single-family policies had a full-risk cost under ${K.usd(band1?.hi ?? 0)} a year. Floods here are frequent but rarely huge: the median paid claim from ${N.claimYears[0]} to ${N.claimYears[1]} was ${K.usd(st.claims?.median ?? 0)}, a fraction of the national ${K.usd(N.claims.median)}.`,
  body: (h) => `
<h2>Few policies, many rivers</h2>
<p>Ohio drains two ways. The northern third runs to Lake Erie through the Maumee, the Cuyahoga and smaller streams; the rest flows south to the Ohio River. Flooding comes from both, mostly as heavy spring rain on saturated ground. Yet coverage is thin. Franklin County, around Columbus, leads the state with only ${K.num(franklin?.pol?.n ?? 0)} single-family policies.</p>
<p>Most of those homes pay close to their modelled price. Franklin's median bill was ${K.usd(franklin?.pol?.median ?? 0)} against a full-risk median of ${K.usd(franklin?.pol?.full ?? 0)}; Cuyahoga County, which takes in Cleveland, showed ${K.usd(cuyahoga?.pol?.median ?? 0)} against ${K.usd(cuyahoga?.pol?.full ?? 0)}. Butler County, between Cincinnati and Dayton, is the main exception among the larger counties, with ${K.pct(butler?.pol?.capped ?? 0, 0)} of policies still capped.</p>
${h.mini('rank', { t: 'Where an Ohio full-risk quote falls among 2023 policies', p: ['cost'], d: { sx: 'ohio', cost: 1000 } })}
<h2>Outside the mapped floodplain</h2>
<p>In Ohio, ${K.num(z.X?.n ?? 0)} policies, ${K.pct((z.X?.n ?? 0) / pol.n, 0)} of the total, cover homes rated X, B or C, where no lender requires flood coverage. Those owners paid a median ${K.usd(z.X?.median ?? 0)}, with a full-risk median of ${K.usd(z.X?.full ?? 0)}, so their bills have nearly finished rising. Over the claim years, ${K.num(st.claimsByZone.X?.n ?? 0)} paid claims came from those zones, at a median of ${K.usd(st.claimsByZone.X?.median ?? 0)}, not far below the ${K.usd(st.claimsByZone.A?.median ?? 0)} paid in A zones. Water from a clogged storm drain or a backed-up creek does not check the map.</p>
<h2>The Lake Erie shore</h2>
<p>FEMA counted ${K.pct(st.exposure.greatLakes, 0)} of Ohio's single-family policies as exposed to Great Lakes flooding, the wind-driven rise of the lake on its shallow western basin. Ottawa County, on the peninsula east of Toledo, is where that shows most: ${K.num(ottawa?.pol?.n ?? 0)} policies at a median bill of ${K.usd(ottawa?.pol?.median ?? 0)}, the highest of the eight counties with the most policies. Lucas County, which includes Toledo, paid less, ${K.usd(lucas?.pol?.median ?? 0)} at the median.</p>
<h2>Claims: steady and small</h2>
<p>Ohio paid ${K.num(st.claims?.n ?? 0)} single-family claims for losses from ${N.claimYears[0]} to ${N.claimYears[1]}. Hamilton County, on the Ohio River at Cincinnati, had the most, ${K.num(hamilton?.claims?.n ?? 0)}. No single storm dominates: the largest event in the file, ${ev?.event ?? 'a spring flood'} of ${ev?.year ?? N.claimYears[1]}, paid ${K.num(ev?.n ?? 0)} claims, and the losses of ${N.claimYears[1]} are still being settled. Ohio's median claim is ${K.pct((st.claims?.median ?? 0) / N.claims.median, 0)} of the national median claim: the typical loss per house is smaller here than in states hit by coastal surge.</p>
<p>A small claim still exceeds several years of premium. The ${h.a('average-flood-insurance-claim', 'average claim guide')} compares claims and bills state by state.</p>
`,
  faqs: [
    { q: 'How much does flood insurance cost in Columbus, Ohio?', a: `Franklin County, which contains most of Columbus, had a median single-family flood bill of ${K.usd(franklin?.pol?.median ?? 0)} a year on ${date}, across ${K.num(franklin?.pol?.n ?? 0)} policies. The median full-risk bill there was ${K.usd(franklin?.pol?.full ?? 0)}, so typical owners are near the end of their yearly increases. A home in an A zone pays more than one rated X.` },
    { q: 'Is flood insurance needed near Lake Erie in Ohio?', a: `A federally regulated lender requires it only when the home is in a high-risk A or V zone. Along the lake, ${K.num(ottawa?.pol?.n ?? 0)} homes in Ottawa County carried a policy on ${date}, with a median bill of ${K.usd(ottawa?.pol?.median ?? 0)}. FEMA lists ${K.pct(st.exposure.greatLakes, 0)} of Ohio's single-family policies as exposed to Great Lakes flooding.` },
    { q: 'How many flood claims were paid in Hamilton County, Ohio?', a: `Hamilton County, which includes Cincinnati, had ${K.num(hamilton?.claims?.n ?? 0)} paid single-family claims for losses from ${N.claimYears[0]} to ${N.claimYears[1]}, the most of any Ohio county, with a median payment of ${K.usd(hamilton?.claims?.median ?? 0)}. Its ${K.num(hamilton?.pol?.n ?? 0)} policies had a median bill of ${K.usd(hamilton?.pol?.median ?? 0)} on ${date}.` },
  ],
  related: ['flood-insurance-by-state', 'average-flood-insurance-claim', 'is-flood-insurance-required', 'state:pennsylvania'],
});
