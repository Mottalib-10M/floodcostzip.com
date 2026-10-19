import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('minnesota');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const cz = st.claimsByZone;
const pick = (name: string) => st.topCounties.find((c) => c.name === name);
const henn = pick('Hennepin County');
const clay = pick('Clay County');
const olm = pick('Olmsted County');
const anoka = pick('Anoka County');
const stl = pick('St. Louis County');
const dak = pick('Dakota County');
const june = st.events[0];
const gap = st.maxGap;
const cg = K.glide({ current: clay?.pol?.median ?? pol.median, full: clay?.pol?.full ?? pol.full, cap: K.P.caps.standard, fees: K.fees('primary') });

export default defineState({
  slug: 'minnesota',
  title: 'Flood Insurance Minnesota 2026: Red River to Twin Cities',
  description: `Minnesota flood insurance 2026: what a house policy cost on ${date}, Hennepin, Clay and Olmsted counties, A versus X zone prices, Red River risk, claims.`,
  intro: `Minnesota has ${K.num(pol.n)} single-family flood policies; on ${date} the median bill was ${K.usd(pol.median)}, and A zone homes paid well above it.`,
  resume: `On ${date}, Minnesota's ${K.num(pol.n)} single-family flood policies had a median yearly bill of ${K.usd(pol.median)}, with the premium, Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee added together. The full-risk median of the same homes was ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of policies still paid less. The split by zone is clear: about half the policies are in A zones, at a median ${K.usd(z.A?.median ?? 0)}, and most of the rest in X zones, at ${K.usd(z.X?.median ?? 0)}. Hennepin County, with Minneapolis, has the most policies, ${K.num(henn?.pol?.n ?? 0)}, and among the lowest bills. The steep gaps are on the rivers of the west and south. Clay County, across the Red River from Fargo, pays a median ${K.usd(clay?.pol?.median ?? 0)} against ${K.usd(clay?.pol?.full ?? 0)} at full risk; Olmsted County, around Rochester, has a full-risk median of ${K.usd(olm?.pol?.full ?? 0)}. Paid claims from ${N.claimYears[0]} to ${N.claimYears[1]} numbered ${K.num(st.claims?.n ?? 0)}.`,
  body: (h) => `
<h2>Most of the state buys none at all</h2>
<p>Minnesota has thousands of lakes and several large river systems, yet its federal flood policy count is small: ${K.num(pol.n)} single-family homes. No county has more than about a thousand. In the Twin Cities, bills are low and close to final: Hennepin County's median of ${K.usd(henn?.pol?.median ?? 0)} compares with a full-risk median of ${K.usd(henn?.pol?.full ?? 0)}, and Dakota County is cheaper still at ${K.usd(dak?.pol?.median ?? 0)}. Anoka County, on the Mississippi and Rum rivers, pays more, ${K.usd(anoka?.pol?.median ?? 0)}. Washington County, along the St. Croix around Stillwater, has ${K.num(pick('Washington County')?.pol?.n ?? 0)} policies at ${K.usd(pick('Washington County')?.pol?.median ?? 0)}, and its paid claims had a median of ${K.usd(pick('Washington County')?.claims?.median ?? 0)}, the highest among the large counties with claim data.</p>
<h2>A zone or X zone makes a real difference here</h2>
<p>The zone does not set the premium any more, but it still tracks where flooding is expected. In Minnesota the ${K.num(z.A?.n ?? 0)} A zone policies cost ${K.usd(z.A?.median ?? 0)} at the median and have a full-risk median of ${K.usd(z.A?.full ?? 0)}; the ${K.num(z.X?.n ?? 0)} X zone policies cost ${K.usd(z.X?.median ?? 0)}, with little gap left. An A zone home with a federally backed mortgage must carry a policy; an X zone home does not.</p>
${h.mini('zone', { t: 'Minnesota bills by zone type', p: ['z'], d: { sx: 'minnesota', z: 'A' } })}
<h2>The Red River valley and the southeast</h2>
<p>Clay County, around Moorhead, sits on the flat Red River plain, where spring snowmelt floods spread wide. Its ${K.num(clay?.pol?.n ?? 0)} policies have the largest share still capped among the big counties, ${K.pct(clay?.pol?.capped ?? 0, 0)}, and a main home at the county medians has ${cg.steps} renewals to go at ${K.pct(K.P.caps.standard, 0)} a year. Olmsted County pays a median ${K.usd(olm?.pol?.median ?? 0)} today, less than half its full-risk median. In FEMA's 2023 county tables the widest gap was in ${gap?.name ?? 'a small county'}, in the river bluff country of the southeast corner, on just ${K.num(gap?.pif ?? 0)} policies.</p>
<p>Claims are light. ${june ? `The ${june.event} of ${june.year} is the largest event in the file, with ${K.num(june.n)} paid single-family claims for ${K.usd(june.total)}.` : ''} The median claim statewide was ${K.usd(st.claims?.median ?? 0)}, and A zone claims, a median of ${K.usd(cz.A?.median ?? 0)}, ran larger than X zone claims. St. Louis County, around Duluth on Lake Superior, has ${K.num(stl?.pol?.n ?? 0)} policies. Lender rules are covered in ${h.a('is-flood-insurance-required', 'is flood insurance required')}.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Minneapolis?', a: `Minneapolis is in Hennepin County, where the median single-family flood bill was ${K.usd(henn?.pol?.median ?? 0)} a year on ${date}, across ${K.num(henn?.pol?.n ?? 0)} policies. That is below the Minnesota median of ${K.usd(pol.median)}, and only ${K.pct(henn?.pol?.capped ?? 0, 0)} of Hennepin policies were still below their full-risk price. Homes near the Mississippi or Minnehaha Creek can pay more.` },
    { q: 'Why is flood insurance in Moorhead and Clay County rising?', a: `Clay County's median bill was ${K.usd(clay?.pol?.median ?? 0)} on ${date}, but the full-risk median of the same homes is ${K.usd(clay?.pol?.full ?? 0)}. ${K.pct(clay?.pol?.capped ?? 0, 0)} of its policies are capped, so they rise each year, by up to ${K.pct(K.P.caps.standard, 0)} for a main home, until they reach that price. At the county medians that takes ${cg.steps} renewals.` },
    { q: 'What flood event paid the most Minnesota claims recently?', a: `In the federal claims for ${N.claimYears[0]} to ${N.claimYears[1]}, the ${june?.event ?? 'largest event'} of ${june?.year ?? ''} led, with ${K.num(june?.n ?? 0)} paid single-family claims and ${K.usd(june?.total ?? 0)} in total. Over the decade the program paid ${K.num(st.claims?.n ?? 0)} claims on Minnesota homes, ${K.usd(st.claims?.total ?? 0)} altogether, with a median of ${K.usd(st.claims?.median ?? 0)}.` },
  ],
  related: ['is-flood-insurance-required', 'flood-zones-explained', 'state:north-dakota', 'state:wisconsin'],
});
