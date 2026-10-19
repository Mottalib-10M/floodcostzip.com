import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('washington');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const co = (name: string) => st.topCounties.find((x) => x.name === name);
const king = co('King County');
const skagit = co('Skagit County');
const whatcom = co('Whatcom County');
const snoh = co('Snohomish County');
const lewis = co('Lewis County');
const cowlitz = co('Cowlitz County');
const ar = st.events[0];
const claimN = st.claims?.n ?? 0;

export default defineState({
  slug: 'washington',
  title: 'Flood Insurance Washington 2026: River Valleys and Coast',
  description: `Flood insurance in Washington 2026: median single-family bill on ${date} by county, full-risk gaps in Lewis and Cowlitz, and atmospheric river claims.`,
  intro: `Washington State has ${K.num(pol.n)} single-family flood policies; their median yearly cost was ${K.usd(pol.median)} on ${date}.`,
  resume: `In Washington State the median single-family flood policy cost ${K.usd(pol.median)} a year on ${date}, a total that adds the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee to the premium. King, Skagit, Pierce and Snohomish counties lead the list of the ${K.num(pol.n)} policies. Storm surge plays no part here. FEMA's 2023 tables show no single-family policy in the state exposed to storm surge, while ${K.pct(st.exposure.erosion, 0)} faced coastal erosion and ${K.pct(st.exposure.tsunami, 0)} tsunami risk. High-risk A zones had a median bill of ${K.usd(z.A?.median ?? 0)}, X zones ${K.usd(z.X?.median ?? 0)}. At full risk the state median would reach ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of policies were still paying less. Claims run large: the median paid single-family claim was ${K.usd(st.claims?.median ?? 0)} over ${N.claimYears[0]} to ${N.claimYears[1]}.`,
  body: (h) => `
<h2>An atmospheric river leads the claims</h2>
<p>${ar ? `The largest event in the claim file is an atmospheric river in December ${ar.year}: ${K.num(ar.n)} paid single-family claims, ${K.usd(ar.total)} in total, already ${K.pct(ar.n / (claimN || 1), 0)} of the ten-year count even though claims from ${N.claimYears[1]} are still being settled.` : 'Winter storms account for most of the claim file.'}</p>
<p>Whatcom County, where the USGS gauges the Nooksack River, recorded ${K.num(whatcom?.claims?.n ?? 0)} paid claims with a median of ${K.usd(whatcom?.claims?.median ?? 0)}, more claims than King County with three times the policies. Skagit County had a median claim of ${K.usd(skagit?.claims?.median ?? 0)}.</p>
${h.mini('claims', { t: 'A median Washington flood claim, counted in years of bills', p: ['cur'], d: { sx: 'washington', cur: pol.median } })}
<h2>A coastal zone that costs less</h2>
<p>In most coastal states, V zones are the most expensive. Washington reverses that: its ${K.num(z.V?.n ?? 0)} V-zone homes paid a median ${K.usd(z.V?.median ?? 0)}, below the ${K.usd(z.A?.median ?? 0)} of A-zone homes. With no storm surge in the exposure data, the V-zone median here sits below the A-zone median. Grays Harbor County had ${K.num(co('Grays Harbor County')?.pol?.n ?? 0)} policies at a median of ${K.usd(co('Grays Harbor County')?.pol?.median ?? 0)}.</p>
<p>FEMA's 2023 tables counted ${K.pct(st.exposure.erosion, 0)} of Washington single-family policies as exposed to coastal erosion, nearly twice the national ${K.pct(N.exposure.erosion, 0)}, and ${K.pct(st.exposure.tsunami, 0)} to tsunami. Pierce County, around Tacoma, had ${K.num(co('Pierce County')?.pol?.n ?? 0)} policies at a median of ${K.usd(co('Pierce County')?.pol?.median ?? 0)}, close to its full-risk median.</p>
<h2>Lewis and Cowlitz have the most to catch up</h2>
<p>Two neighbouring counties stand out for how far their bills sit below full risk. In Cowlitz County the median bill was ${K.usd(cowlitz?.pol?.median ?? 0)} against ${K.usd(cowlitz?.pol?.full ?? 0)} at full risk, with ${K.pct(cowlitz?.pol?.capped ?? 0, 0)} of policies capped. Lewis County, along the Chehalis, showed ${K.usd(lewis?.pol?.median ?? 0)} against ${K.usd(lewis?.pol?.full ?? 0)}. Snohomish follows with a full-risk median of ${K.usd(snoh?.pol?.full ?? 0)}. A capped premium for a primary home rises by no more than ${K.pct(K.P.caps.standard, 0)} at each renewal, so owners there can expect several more years of increases; the ${h.a('flood-insurance-rate-increase', 'rate increase calculator')} counts them for one bill. In King County, the largest market, the median was ${K.usd(king?.pol?.median ?? 0)}. ${st.maxGap?.name ?? 'Another county'} had the widest ratio of full-risk to current cost in FEMA's 2023 data.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in King County, Washington?', a: `King County had ${K.num(king?.pol?.n ?? 0)} single-family flood policies on ${date}, with a median yearly bill of ${K.usd(king?.pol?.median ?? 0)} including federal charges. The median full-risk bill for the same homes was ${K.usd(king?.pol?.full ?? 0)}, and ${K.pct(king?.pol?.capped ?? 0, 0)} of the policies were still below it. Each home's price can still differ from that median with its first floor height and proximity to flood sources.` },
    { q: 'Why are V zones cheaper than A zones in Washington State?', a: `The data show the gap but not FEMA's reasons for it. Washington has no storm surge exposure in FEMA's 2023 tables, while ${K.pct(st.exposure.erosion, 0)} of policies faced coastal erosion. The ${K.num(z.V?.n ?? 0)} V-zone single-family policies had a median bill of ${K.usd(z.V?.median ?? 0)} on ${date}, against ${K.usd(z.A?.median ?? 0)} for A zones.` },
    { q: 'How many claims did the December 2025 atmospheric river cause in Washington?', a: `${ar ? `The claim file shows ${K.num(ar.n)} paid single-family claims for that storm, ${K.usd(ar.total)} for buildings and contents, the largest single event in Washington from ${N.claimYears[0]} to ${N.claimYears[1]}.` : 'The event is recorded among the paid claims of the state.'} Claims from ${N.claimYears[1]} are still being settled, so the final count can rise, and the storm may end up larger still in the record.` },
  ],
  related: ['flood-insurance-by-state', 'average-flood-insurance-claim', 'flood-insurance-rate-increase', 'state:oregon'],
});
