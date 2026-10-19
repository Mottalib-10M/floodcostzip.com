import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('kentucky');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const find = (name: string) => st.topCounties.find((x) => x.name === name);
const jeff = find('Jefferson County');
const pike = find('Pike County');
const floyd = find('Floyd County');
const daviess = find('Daviess County');
const ev = st.events;
const y25 = ev.filter((e) => e.year === N.claimYears[1]);
const n25 = y25.reduce((s, e) => s + e.n, 0);
const gPike = K.glide({ current: pike?.pol?.median ?? pol.median, full: pike?.pol?.full ?? pol.full, cap: K.P.caps.standard, fees: K.fees('primary') });

export default defineState({
  slug: 'kentucky',
  title: 'Flood Insurance Kentucky 2026: Louisville and the Hollows',
  description: `Flood insurance in Kentucky 2026: median single-family bill on ${date}, the full-risk gap in Pike and Floyd, Louisville prices and the ${N.claimYears[1]} floods.`,
  intro: `Kentucky has ${K.num(pol.n)} single-family flood policies; the median one cost ${K.usd(pol.median)} a year on ${date}.`,
  resume: `Kentucky's ${K.num(pol.n)} single-family flood policies had a median yearly cost of ${K.usd(pol.median)} on ${date}, a total that includes the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. The headline number hides a wide gap. Priced at full risk, the same homes would have a median bill of ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of them still pay less than that, one of the highest shares in the country (the national share is ${K.pct(N.policies!.capped, 0)}). The gap is widest in the narrow valleys of eastern Kentucky: in Pike County the median paid was ${K.usd(pike?.pol?.median ?? 0)} while the median full-risk bill was ${K.usd(pike?.pol?.full ?? 0)}. Kentucky is an inland state, so policies cluster in A zones, ${K.num(z.A?.n ?? 0)} of them at a median of ${K.usd(z.A?.median ?? 0)}. Claims are large for an inland market, ${K.usd(st.claims?.median ?? 0)} at the median.`,
  body: (h) => `
<h2>Eastern Kentucky: cheap today, expensive at full price</h2>
<p>FEMA's model prices the coalfield counties far above what their owners pay today. Pike County had ${K.num(pike?.pol?.n ?? 0)} policies with ${K.pct(pike?.pol?.capped ?? 0, 0)} still capped; Floyd County ${K.num(floyd?.pol?.n ?? 0)} policies with ${K.pct(floyd?.pol?.capped ?? 0, 0)} capped and a full-risk median of ${K.usd(floyd?.pol?.full ?? 0)}. In the 2023 table, ${st.maxGap?.name ?? 'a neighboring county'} had the largest ratio of full-risk to current cost in the state.</p>
<p>From the Pike County median, the ${K.pct(K.P.caps.standard, 0)} yearly cap for a primary home leaves about ${gPike.steps} renewals of increases before the bill meets its full-risk level. A second home climbs on the ${K.pct(K.P.caps.higher, 0)} track instead.</p>
${h.mini('glide', { t: 'Renewals left for a Pike County bill', p: ['cur', 'full', 'use'], d: { cur: pike?.pol?.median ?? pol.median, full: pike?.pol?.full ?? pol.full, use: 'primary' } })}
<p>The claims explain why the model is so severe. Floyd County recorded ${K.num(floyd?.claims?.n ?? 0)} paid single-family claims over ${N.claimYears[0]} to ${N.claimYears[1]}, more than the ${K.num(floyd?.pol?.n ?? 0)} policies it carries today: more paid claims in ten years than policies in force today. Pike County had ${K.num(pike?.claims?.n ?? 0)}, with a median of ${K.usd(pike?.claims?.median ?? 0)}.</p>
<h2>A heavy year in ${N.claimYears[1]}</h2>
<p>Two of the three events that paid the most Kentucky claims fell in the same year. ${y25.map((e) => `${e.event} paid ${K.num(e.n)} claims (${K.usd(e.total)})`).join('; ')}. Together that is ${K.num(n25)} claims, about ${K.pct(n25 / (st.claims?.n ?? 1), 0)} of the ten-year total, and the ${N.claimYears[1]} files are still being settled. ${ev.find((e) => e.year !== N.claimYears[1]) ? `The ${ev.find((e) => e.year !== N.claimYears[1])!.year} flood ranks third with ${K.num(ev.find((e) => e.year !== N.claimYears[1])!.n)} claims.` : ''}</p>
<h2>Louisville and the Ohio River towns</h2>
<p>Jefferson County is the biggest market, ${K.num(jeff?.pol?.n ?? 0)} policies at a median of ${K.usd(jeff?.pol?.median ?? 0)}, with a full-risk median of ${K.usd(jeff?.pol?.full ?? 0)}. Downstream, Daviess County around Owensboro is cheaper at ${K.usd(daviess?.pol?.median ?? 0)} and already near full risk. Only ${K.num(z.X?.n ?? 0)} Kentucky policies are in X zones, where no lender requires coverage; they paid a median of ${K.usd(z.X?.median ?? 0)}, yet their full-risk median, ${K.usd(z.X?.full ?? 0)}, is well above that, so the low-risk label does not mean a settled price.</p>
<h2>Claims across the rest of the state</h2>
<p>Outside the coalfields, two counties stand out for the size of their claims. Bullitt County, south of Louisville, had a median paid claim of ${K.usd(find('Bullitt County')?.claims?.median ?? 0)}, and Christian County, in the west, ${K.usd(find('Christian County')?.claims?.median ?? 0)}, both above the state median. Greenup County, on the Ohio River, recorded ${K.num(find('Greenup County')?.claims?.n ?? 0)} paid claims for ${K.num(find('Greenup County')?.pol?.n ?? 0)} policies in force today.</p>
${h.mini('zone', { t: 'Kentucky median bill by zone type', p: ['z'], d: { sx: 'kentucky', z: 'X' } })}
`,
  faqs: [
    { q: 'How much is flood insurance in Pike County, Kentucky?', a: `The median single-family flood bill in Pike County was ${K.usd(pike?.pol?.median ?? 0)} a year on ${date}, across ${K.num(pike?.pol?.n ?? 0)} policies. The same homes priced at full risk would have a median of ${K.usd(pike?.pol?.full ?? 0)}, so ${K.pct(pike?.pol?.capped ?? 0, 0)} of them keep rising at each renewal, within the yearly cap set by federal law.` },
    { q: 'What does flood insurance cost in Louisville?', a: `In Jefferson County, which includes Louisville, ${K.num(jeff?.pol?.n ?? 0)} single-family policies had a median bill of ${K.usd(jeff?.pol?.median ?? 0)} on ${date}. The median full-risk bill was ${K.usd(jeff?.pol?.full ?? 0)}, and ${K.pct(jeff?.pol?.capped ?? 0, 0)} of policies were still capped. Paid claims over ${N.claimYears[0]} to ${N.claimYears[1]} had a median of ${K.usd(jeff?.claims?.median ?? 0)}.` },
    { q: 'How many Kentucky flood claims were paid for the 2025 floods?', a: `The two ${N.claimYears[1]} events in the top three, ${y25.map((e) => e.event).join(' and ')}, account for ${K.num(n25)} paid single-family claims in Kentucky so far. Claims from ${N.claimYears[1]} are still being settled, so the count may grow. The median Kentucky claim over the decade was ${K.usd(st.claims?.median ?? 0)}.` },
  ],
  related: ['flood-insurance-by-state', 'flood-insurance-rate-increase', 'flood-insurance-second-home', 'state:west-virginia'],
});
