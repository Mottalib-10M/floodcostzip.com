import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const wy = K.S('wyoming');
const N = K.N;
const day = K.day(N.policiesDate!);
const w = wy.pol!;
const a = wy.polByZone.A;
const x = wy.polByZone.X;
const look = (name: string) => wy.topCounties.find((c) => c.name === name);
const teton = look('Teton County');
const natrona = look('Natrona County');
const laramie = look('Laramie County');
const sheridan = look('Sheridan County');
const fremont = look('Fremont County');
const paidN = wy.claims?.n ?? 0;
const tetonShare = (teton?.pol?.n ?? 0) / w.n;
const perHome = (w.n || 1) / (wy.zips || 1);

export default defineState({
  slug: 'wyoming',
  title: 'Flood Insurance Wyoming 2026: A Small Market Led by Teton',
  description: `Wyoming flood insurance in 2026: median single-family bills on ${day}, Teton County, Casper and Cheyenne prices, and what so few policies can tell you.`,
  intro: `Wyoming had ${K.num(w.n)} single-family flood policies on ${day}, one of the smallest counts in the country, at a median bill of ${K.usd(w.median)}.`,
  resume: `Wyoming has one of the smallest flood insurance markets in the United States: ${K.num(w.n)} single-family policies in the federal program on ${day}, with a median total bill of ${K.usd(w.median)} a year once the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee are added to the premium. That median is close to the national ${K.usd(N.policies!.median)}, and the state is near full risk: the median full-risk bill is ${K.usd(w.full)}, and ${K.pct(w.capped, 0)} of policies still pay less than their full-risk premium. Teton County, around Jackson, holds ${K.num(teton?.pol?.n ?? 0)} of those policies, about ${K.pct(tetonShare, 0)} of the state. The split between zones is close: ${K.num(a?.n ?? 0)} homes in A zones at a median of ${K.usd(a?.median ?? 0)}, and ${K.num(x?.n ?? 0)} in X zones at ${K.usd(x?.median ?? 0)}. Over ${N.claimYears[0]} to ${N.claimYears[1]}, the program paid just ${K.num(paidN)} single-family claims in Wyoming, with a median of ${K.usd(wy.claims?.median ?? 0)}, too few for county-level claim figures in most of the state.`,
  body: (h) => `
<h2>Reading figures from very few policies</h2>
<p>Small numbers change how this page should be read. With about ${K.num(perHome)} policies per ZIP code on average, and fewer than ${K.num(100)} in most counties, one expensive policy can move a local median by hundreds of dollars. The state medians, built on ${K.num(w.n)} policies, are the steadier guide, and county figures outside the largest three are best taken as rough.</p>
<p>The claims file is even thinner. The ${K.num(paidN)} paid claims of the decade split into ${K.num(wy.claimsByZone.A?.n ?? 0)} in A zones and ${K.num(wy.claimsByZone.X?.n ?? 0)} in X, B or C zones. No flood paid enough Wyoming claims to appear as a named event, and only Sheridan County among the large counties has enough claims to publish a median, ${K.usd(sheridan?.claims?.median ?? 0)}.</p>
${h.mini('state', { t: 'A Wyoming bill next to the state medians', p: ['cur'], d: { sx: 'wyoming', cur: 0 } })}
<h2>Jackson, Casper, Cheyenne</h2>
<p>In Teton County the median bill was ${K.usd(teton?.pol?.median ?? 0)} on ${day}, almost level with its full-risk median of ${K.usd(teton?.pol?.full ?? 0)}. However much a house there is worth, the federal policy stops at ${K.usd(K.P.limits.building)} of building coverage; the ${h.a('flood-insurance-coverage-limits', 'coverage limits guide')} covers the gap above that.</p>
<p>Natrona County, around Casper, paid more: ${K.usd(natrona?.pol?.median ?? 0)} at the median. Laramie County, home to Cheyenne, is the cheapest of the large counties at ${K.usd(laramie?.pol?.median ?? 0)} and already at full risk, with ${K.pct(laramie?.pol?.capped ?? 0, 0)} of policies capped.</p>
<h2>Where the increases remain</h2>
<p>Sheridan County had the largest 2023 gap in the state: ${K.usd(wy.maxGap?.current ?? 0)} paid at the median against ${K.usd(wy.maxGap?.risk ?? 0)} at full risk. On ${day} its median bill was ${K.usd(sheridan?.pol?.median ?? 0)} and ${K.pct(sheridan?.pol?.capped ?? 0, 0)} of its policies were still capped. Fremont County shows a similar pattern on fewer homes, with a full-risk median of ${K.usd(fremont?.pol?.full ?? 0)}.</p>
${h.mini('waiting', { t: 'Is a Wyoming flood covered this many days after buying?', p: ['sit', 'days'], d: { sit: 'standard', days: 20 } })}
<p>Outside a mapped high-risk zone no lender has to require a policy, and a new one usually waits ${K.P.waiting.days} days before it covers a flood. The ${h.a('flood-insurance-waiting-period', 'waiting period guide')} lists the exceptions, and the ${h.a('state:idaho', 'Idaho page')} shows the market of a neighbouring state.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Jackson, Wyoming?', a: `Jackson is in Teton County, where the median single-family flood bill was ${K.usd(teton?.pol?.median ?? 0)} a year on ${day}, across ${K.num(teton?.pol?.n ?? 0)} federal policies, with a full-risk median of ${K.usd(teton?.pol?.full ?? 0)}. Only ${K.pct(teton?.pol?.capped ?? 0, 0)} of those policies were below full risk, so yearly changes there should be small.` },
    { q: 'Why does Wyoming have so few flood insurance policies?', a: `The requirement to buy applies only to homes in mapped high-risk zones with a loan from a regulated or federal lender, and elsewhere buying is a choice. The data does not record each owner's reason. On ${day} the state had ${K.num(w.n)} single-family policies, ${K.num(a?.n ?? 0)} of them in A zones. Its paid claims from ${N.claimYears[0]} to ${N.claimYears[1]} numbered ${K.num(paidN)}, the fewest of any state.` },
    { q: 'Is flood insurance in Sheridan County, Wyoming, going to rise?', a: `The data points that way. Sheridan County's median bill was ${K.usd(sheridan?.pol?.median ?? 0)} on ${day}, against a full-risk median of ${K.usd(sheridan?.pol?.full ?? 0)}, and ${K.pct(sheridan?.pol?.capped ?? 0, 0)} of its policies were capped. A capped main home's premium can rise up to ${K.pct(K.P.caps.standard, 0)} a year, for a second home ${K.pct(K.P.caps.higher, 0)}.` },
  ],
  related: ['flood-insurance-by-state', 'flood-insurance-waiting-period', 'flood-insurance-coverage-limits', 'state:idaho'],
});
