import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('arkansas');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const nat = N.policies!;
const z = st.polByZone;
const cz = st.claimsByZone;
const pick = (name: string) => st.topCounties.find((c) => c.name === name);
const pulaski = pick('Pulaski County');
const garland = pick('Garland County');
const craig = pick('Craighead County');
const crit = pick('Crittenden County');
const faulk = pick('Faulkner County');
const [storms17, april25] = st.events;
const ratio = (st.claims?.median ?? 0) / (N.claims.median || 1);
const gg = K.glide({ current: garland?.pol?.median ?? pol.median, full: garland?.pol?.full ?? pol.full, cap: K.P.caps.standard, fees: K.fees('primary') });

export default defineState({
  slug: 'arkansas',
  title: 'Flood Insurance Arkansas 2026: River Floods, Modest Bills',
  description: `Arkansas flood insurance 2026: the typical bill on ${date}, Pulaski and Garland county costs, river flood claims from ${storms17?.year ?? N.claimYears[0]} and ${april25?.year ?? N.claimYears[1]}, coverage limits.`,
  intro: `Arkansas has ${K.num(pol.n)} single-family flood policies with a median bill of ${K.usd(pol.median)} on ${date}; its claims run large for a river state.`,
  resume: `A single-family flood policy in Arkansas had a median yearly bill of ${K.usd(pol.median)} on ${date}, premium and the federal assessment and fees included, across ${K.num(pol.n)} policies. That is below the national median of ${K.usd(nat.median)}, and close to the state's full-risk median of ${K.usd(pol.full)}; ${K.pct(pol.capped, 0)} of policies are still capped. Arkansas has no coast, and FEMA rates every policy for inland flooding only. Its claims are what stand out. From ${N.claimYears[0]} to ${N.claimYears[1]}, the program paid ${K.num(st.claims?.n ?? 0)} single-family claims with a median of ${K.usd(st.claims?.median ?? 0)}, high for a state with modest homes: the median replacement cost in FEMA's 2023 data was ${K.usd(st.medianRcv ?? 0)}. Claims in X zones, with a median of ${K.usd(cz.X?.median ?? 0)}, were about as large as in A zones. Garland County, around Hot Springs, is the main exception on price, with a full-risk median about twice its current bill.`,
  body: (h) => `
<h2>Rivers, not storms at sea</h2>
<p>The Arkansas, White, Ouachita and Mississippi rivers shape the state's flood map. When they rise, water stays for days, and the damage to a house is deep. That shows in the paid claims: the Arkansas median is about ${K.pct(ratio, 0)} of the national median claim, even though the homes are cheaper than average. The ${storms17?.event?.toLowerCase() ?? 'storms'} of ${storms17?.year ?? ''} paid ${K.num(storms17?.n ?? 0)} single-family claims, ${K.usd(storms17?.total ?? 0)} in total, and the ${april25?.event ?? 'spring flooding'} of ${april25?.year ?? ''} paid ${K.num(april25?.n ?? 0)}.</p>
<p>Outside the mapped floodplain, losses are just as heavy. ${K.num(cz.X?.n ?? 0)} paid claims came from X zone homes, at a median of ${K.usd(cz.X?.median ?? 0)}, while the ${K.num(z.X?.n ?? 0)} X zone policies in force on ${date} cost a median ${K.usd(z.X?.median ?? 0)} a year.</p>
<h2>What a federal policy pays on a deep flood</h2>
<p>A federal policy pays up to ${K.usd(K.P.limits.building)} for the building and ${K.usd(K.P.limits.contents)} for belongings, after a deductible chosen on each. With a median rebuilding cost of ${K.usd(st.medianRcv ?? 0)}, most Arkansas houses fit within the building limit, which is not true in high-cost coastal states. Belongings are paid at depreciated value, and basements have narrower cover.</p>
${h.mini('coverage', { t: 'What the policy pays on a large Arkansas loss', p: ['b', 'c', 'd'], d: { b: st.medianRcv ?? K.P.limits.building, c: 40000 } })}
<h2>Northwest Arkansas floods fast</h2>
<p>The Ozark plateau around Fayetteville, Springdale and Bentonville drains through steep creeks that rise within hours of a storm. Washington County has ${K.num(pick('Washington County')?.pol?.n ?? 0)} policies at a median ${K.usd(pick('Washington County')?.pol?.median ?? 0)}, and Benton County ${K.num(pick('Benton County')?.pol?.n ?? 0)} at ${K.usd(pick('Benton County')?.pol?.median ?? 0)}. Their claim files are among the state's largest after Pulaski: ${K.num(pick('Washington County')?.claims?.n ?? 0)} and ${K.num(pick('Benton County')?.claims?.n ?? 0)} paid claims, with medians of ${K.usd(pick('Washington County')?.claims?.median ?? 0)} and ${K.usd(pick('Benton County')?.claims?.median ?? 0)}.</p>
<h2>County prices: Little Rock, Jonesboro and Hot Springs</h2>
<p>Pulaski County, home to Little Rock, has the most policies, ${K.num(pulaski?.pol?.n ?? 0)}, at a median of ${K.usd(pulaski?.pol?.median ?? 0)}. Faulkner County next door is at ${K.usd(faulk?.pol?.median ?? 0)}. In the Delta, Craighead County around Jonesboro pays one of the lowest medians, ${K.usd(craig?.pol?.median ?? 0)}, and Crittenden County, across the river from Memphis, ${K.usd(crit?.pol?.median ?? 0)}. Garland County is the outlier. Its policies pay a median ${K.usd(garland?.pol?.median ?? 0)} against a full-risk median of ${K.usd(garland?.pol?.full ?? 0)}, and ${K.pct(garland?.pol?.capped ?? 0, 0)} of its policies are below full price; at the county medians, a main home needs ${gg.steps} more renewals at the ${K.pct(K.P.caps.standard, 0)} cap. The ${h.a('average-flood-insurance-claim', 'average claim guide')} compares claim sizes across the country.</p>
`,
  faqs: [
    { q: 'How much does flood insurance cost in Little Rock, Arkansas?', a: `In Pulaski County, which includes Little Rock, the median single-family flood bill was ${K.usd(pulaski?.pol?.median ?? 0)} a year on ${date}, across ${K.num(pulaski?.pol?.n ?? 0)} policies. The full-risk median was ${K.usd(pulaski?.pol?.full ?? 0)}. The county had ${K.num(pulaski?.claims?.n ?? 0)} paid single-family claims from ${N.claimYears[0]} to ${N.claimYears[1]}, with a median of ${K.usd(pulaski?.claims?.median ?? 0)}.` },
    { q: 'Why are Garland County flood insurance bills rising faster?', a: `Garland County, around Hot Springs, has a large gap to full price: a median bill of ${K.usd(garland?.pol?.median ?? 0)} on ${date} against a full-risk median of ${K.usd(garland?.pol?.full ?? 0)}. ${K.pct(garland?.pol?.capped ?? 0, 0)} of its policies are still below that price, so their yearly increases continue at up to ${K.pct(K.P.caps.standard, 0)} for a main home.` },
    { q: 'How large is a typical Arkansas flood claim against the yearly bill?', a: `The median paid single-family claim in Arkansas from ${N.claimYears[0]} to ${N.claimYears[1]} was ${K.usd(st.claims?.median ?? 0)}, against ${K.usd(N.claims.median)} nationally, where large hurricanes weigh heavily. Measured against the state's median bill of ${K.usd(pol.median)}, one median claim equals about ${K.num(Math.round((st.claims?.median ?? 0) / pol.median))} years of premium, a high multiple among inland states.` },
  ],
  related: ['average-flood-insurance-claim', 'flood-insurance-coverage-limits', 'state:missouri', 'state:mississippi'],
});
