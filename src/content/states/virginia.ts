import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('virginia');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const city = (name: string) => st.topCounties.find((c) => c.name === name);
const vb = city('Virginia Beach, City of');
const norfolk = city('Norfolk, City of');
const hampton = city('Hampton, City of');
const poq = city('Poquoson, City of');
const york = city('York County');
const matthew = st.events[0];
const roads = ['Virginia Beach, City of', 'Hampton, City of', 'Norfolk, City of', 'Chesapeake, City of', 'Portsmouth, City of', 'Poquoson, City of']
  .reduce((s, n) => s + (city(n)?.pol?.n ?? 0), 0);

export default defineState({
  slug: 'virginia',
  title: 'Flood Insurance Virginia 2026: Hampton Roads and Inland',
  description: `Flood insurance in Virginia 2026: median bill by city and county on ${date}, the gap between A and X zones, Hampton Roads surge risk and Matthew claims.`,
  intro: `Virginia has ${K.num(pol.n)} single-family flood policies; the median bill was ${K.usd(pol.median)} on ${date}, below the national median.`,
  resume: `Virginia homeowners paid a median ${K.usd(pol.median)} a year for a single-family federal flood policy on ${date}, a figure that counts the premium plus the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. That is less than the national ${K.usd(N.policies!.median)}, and the state is also close to its full-risk level: the same ${K.num(pol.n)} policies would cost a median ${K.usd(pol.full)} at full risk, and only ${K.pct(pol.capped, 0)} of them still pay less. The zone you are in matters more here than in most states. A-zone homes paid a median ${K.usd(z.A?.median ?? 0)}, X-zone homes ${K.usd(z.X?.median ?? 0)}. Six independent cities around Hampton Roads (Virginia Beach, Hampton, Norfolk, Chesapeake, Portsmouth and Poquoson) account for ${K.num(roads)} policies, about ${K.pct(roads / pol.n, 0)} of the state, and FEMA rated ${K.pct(st.exposure.surge, 0)} of Virginia's single-family policies as exposed to storm surge.`,
  body: (h) => `
<h2>A market built around the Chesapeake Bay</h2>
<p>Virginia reports flood data by city as well as by county, because its independent cities are counted apart from the counties around them. The list is led by the City of Virginia Beach, with ${K.num(vb?.pol?.n ?? 0)} single-family policies at a median bill of ${K.usd(vb?.pol?.median ?? 0)}. Norfolk follows at ${K.usd(norfolk?.pol?.median ?? 0)} and Hampton at ${K.usd(hampton?.pol?.median ?? 0)}. In each of them the median full-risk bill is within a few dollars of the median paid, which means most bills there have already climbed to the level FEMA's model sets.</p>
<p>Two places near the mouth of the York River break that pattern. Poquoson, a small city on low ground, had ${K.num(poq?.pol?.n ?? 0)} policies at a median of ${K.usd(poq?.pol?.median ?? 0)}, with ${K.pct(poq?.pol?.capped ?? 0, 0)} still capped. York County is further from full price: ${K.usd(york?.pol?.median ?? 0)} paid against ${K.usd(york?.pol?.full ?? 0)} at full risk.</p>
<h2>What Matthew left behind</h2>
<p>The ${matthew.event} in ${matthew.year} is the event that paid the most single-family claims in Virginia over ${N.claimYears[0]} to ${N.claimYears[1]}: ${K.num(matthew.n)} claims and ${K.usd(matthew.total)}. That one storm is ${K.pct(matthew.n / (st.claims?.n ?? 1), 0)} of the ${K.num(st.claims?.n ?? 0)} paid claims in the state. Virginia Beach carried most of it; the median claim paid there over the period, ${K.usd(vb?.claims?.median ?? 0)}, compares with a state median of ${K.usd(st.claims?.median ?? 0)}.</p>
<p>Zone letters split the Virginia price more sharply than they do in many states. The ${K.num(z.X?.n ?? 0)} policies rated X, B or C had a median bill of ${K.usd(z.X?.median ?? 0)}, against ${K.usd(z.A?.median ?? 0)} for the ${K.num(z.A?.n ?? 0)} rated A. Yet ${K.num(st.claimsByZone.X?.n ?? 0)} of the paid claims came from those lower-risk zones, with a median payment of ${K.usd(st.claimsByZone.X?.median ?? 0)}. In a tidal city, a street outside the mapped area can still take water when rain falls during a high tide.</p>
${h.mini('claims', { t: 'A median Virginia claim, in years of flood bills', p: ['cur'], d: { sx: 'virginia' } })}
<h2>Inland Virginia is a different price</h2>
<p>West of the coastal plain, rivers rise after heavy rain and after the remnants of storms such as ${st.events[1]?.event ?? 'the remnants of tropical systems'}. Policy counts are small there, but the gaps are wide: ${st.maxGap?.name ?? 'one valley county'} had the largest ratio of full-risk to current cost in FEMA's 2023 table. A cheap bill in the valley is less settled than a cheap bill in Norfolk. Federally regulated lenders require coverage in A and V zones, a rule explained in ${h.a('is-flood-insurance-required', 'when flood insurance is required')}.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Virginia Beach?', a: `The City of Virginia Beach had ${K.num(vb?.pol?.n ?? 0)} single-family flood policies on ${date}, with a median yearly bill of ${K.usd(vb?.pol?.median ?? 0)}, premium and fees included. The median full-risk bill was ${K.usd(vb?.pol?.full ?? 0)}, so few owners there face large increases. A home in an A zone near the bay usually pays more than a home rated X.` },
    { q: 'Is flood insurance cheaper in Norfolk than in Poquoson?', a: `At the median, yes. Norfolk policies had a median bill of ${K.usd(norfolk?.pol?.median ?? 0)} on ${date} and Poquoson policies ${K.usd(poq?.pol?.median ?? 0)}. Poquoson also has more room to rise: ${K.pct(poq?.pol?.capped ?? 0, 0)} of its policies were still below a median full-risk bill of ${K.usd(poq?.pol?.full ?? 0)}, against ${K.pct(norfolk?.pol?.capped ?? 0, 0)} in Norfolk.` },
    { q: 'How many Virginia flood claims came from Hurricane Matthew?', a: `The federal program paid ${K.num(matthew.n)} single-family claims in Virginia for ${matthew.event}, ${K.usd(matthew.total)} for buildings and contents. That is the largest event in the state's paid claims from ${N.claimYears[0]} to ${N.claimYears[1]}, ahead of ${st.events[1]?.event ?? 'later storms'} and ${st.events[2]?.event ?? 'other storms'}, which paid far fewer claims in the state.` },
  ],
  related: ['flood-insurance-by-state', 'average-flood-insurance-claim', 'is-flood-insurance-required', 'state:pennsylvania'],
});
