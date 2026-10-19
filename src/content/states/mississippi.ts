import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('mississippi');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const cz = st.claimsByZone;
const pick = (name: string) => st.topCounties.find((c) => c.name === name);
const jackson = pick('Jackson County');
const harrison = pick('Harrison County');
const hancock = pick('Hancock County');
const hinds = pick('Hinds County');
const rankin = pick('Rankin County');
const coastN = [jackson, harrison, hancock].reduce((s, c) => s + (c?.pol?.n ?? 0), 0);
const jg = K.glide({ current: jackson?.pol?.median ?? pol.median, full: jackson?.pol?.full ?? pol.full, cap: K.P.caps.standard, fees: K.fees('primary') });
const zeta = st.events.find((e) => e.event.includes('Zeta'));

export default defineState({
  slug: 'mississippi',
  title: 'Flood Insurance Mississippi 2026: Gulf Coast Gap to Close',
  description: `Mississippi flood insurance 2026: median bill on ${date}, Jackson, Harrison and Hancock counties far below full price, inland claims, storms paid.`,
  intro: `Mississippi counts ${K.num(pol.n)} single-family flood policies; the median bill was ${K.usd(pol.median)} on ${date}, and most of them are in its three coastal counties.`,
  resume: `On ${date}, a Mississippi single-family flood policy had a median yearly cost of ${K.usd(pol.median)}, premium plus the Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee, across ${K.num(pol.n)} policies. The full-risk median of those same homes is ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} still pay less than that, one of the larger capped shares in the country. Three coastal counties drive it. Jackson, Harrison and Hancock hold ${K.num(coastN)} policies, about ${K.pct(coastN / pol.n, 0)} of the state. In Jackson County, ${K.pct(jackson?.pol?.capped ?? 0, 0)} of policies are capped, with a median bill of ${K.usd(jackson?.pol?.median ?? 0)} against ${K.usd(jackson?.pol?.full ?? 0)} at full risk; a main home at those medians faces ${jg.steps} more yearly increases at ${K.pct(K.P.caps.standard, 0)}. Claims point the other way: from ${N.claimYears[0]} to ${N.claimYears[1]}, the median paid claim in X zones, ${K.usd(cz.X?.median ?? 0)}, was higher than in A zones.`,
  body: (h) => `
<h2>The coast pays, and will pay more</h2>
<p>Jackson County, around Pascagoula and Ocean Springs, is the state's largest flood market, with ${K.num(jackson?.pol?.n ?? 0)} single-family policies, and it is also where FEMA's 2023 tables put the largest county gap between the bill and the full-risk price. Harrison County, home to Gulfport and Biloxi, follows with ${K.num(harrison?.pol?.n ?? 0)} policies at a median ${K.usd(harrison?.pol?.median ?? 0)}. Hancock County, on the Louisiana line, is smaller but just as far from full price: ${K.pct(hancock?.pol?.capped ?? 0, 0)} of its policies remain capped.</p>
<p>FEMA rated ${K.pct(st.exposure.surge, 0)} of Mississippi's 2023 single-family policies as exposed to storm surge. The V zone median full-risk price, ${K.usd(z.V?.full ?? 0)}, is about double the ${K.usd(z.V?.median ?? 0)} those ${K.num(z.V?.n ?? 0)} policies pay now.</p>
${h.mini('glide', { t: 'Increases left for a Jackson County home at the county medians', p: ['cur', 'full', 'use'], d: { cur: jackson?.pol?.median ?? pol.median, full: jackson?.pol?.full ?? pol.full } })}
<h2>Inland Mississippi: fewer policies, larger claims</h2>
<p>Away from the coast, policies are few and bills are lower. Hinds County, which contains Jackson the capital city, has ${K.num(hinds?.pol?.n ?? 0)} policies at a median of ${K.usd(hinds?.pol?.median ?? 0)}; Rankin County across the Pearl River is at ${K.usd(rankin?.pol?.median ?? 0)}, already close to its full-risk median. Yet inland claims are larger. Hinds County's median paid claim was ${K.usd(hinds?.claims?.median ?? 0)} and Rankin's ${K.usd(rankin?.claims?.median ?? 0)}, both well above Harrison's ${K.usd(harrison?.claims?.median ?? 0)}.</p>
<h2>Low-risk zones are not at full price either</h2>
<p>In many states, X zone bills already match their full-risk price. Mississippi is an exception. Its ${K.num(z.X?.n ?? 0)} X zone policies pay a median ${K.usd(z.X?.median ?? 0)}, while the full-risk median of the same homes is ${K.usd(z.X?.full ?? 0)}. A zones show a wider gap, ${K.usd(z.A?.median ?? 0)} against ${K.usd(z.A?.full ?? 0)}. So increases are not confined to V zones: a home rated A or X can still be on the capped path. The yearly notice and the declarations page show both figures for a given policy.</p>
<h2>No single catastrophe in the recent file</h2>
<p>Hurricane Katrina struck in 2005, according to the ${h.ext('https://www.nhc.noaa.gov/data/tcr/AL122005_Katrina.pdf', 'National Hurricane Center report')}, before the ten-year claims record that starts in ${N.claimYears[0]}. The program paid ${K.num(st.claims?.n ?? 0)} single-family claims in the state over those years, ${K.usd(st.claims?.total ?? 0)} in total. ${zeta ? `${zeta.event} in ${zeta.year} produced the most claims, ${K.num(zeta.n)}, but` : 'The'} late winter storms of ${st.events[0]?.year ?? N.claimYears[0]} paid the most money. Of all claims, ${K.num(cz.X?.n ?? 0)} came from X zone homes, where a lender does not require cover. The ${h.a('average-flood-insurance-claim', 'average claim guide')} puts these sums in national context.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Biloxi and Gulfport?', a: `Both cities are in Harrison County, where the median single-family flood bill was ${K.usd(harrison?.pol?.median ?? 0)} a year on ${date}, across ${K.num(harrison?.pol?.n ?? 0)} policies. The full-risk median there is ${K.usd(harrison?.pol?.full ?? 0)}, so many owners face more yearly increases. A home's own price depends on its elevation, distance to the water and construction, which a licensed agent can quote.` },
    { q: 'Why do Jackson County, Mississippi flood bills keep going up?', a: `${K.pct(jackson?.pol?.capped ?? 0, 0)} of Jackson County single-family policies still pay less than their full-risk premium. The law limits most yearly increases to ${K.pct(K.P.caps.standard, 0)} for a main home, so the bill rises step by step. At the county medians, ${K.usd(jackson?.pol?.median ?? 0)} today and ${K.usd(jackson?.pol?.full ?? 0)} at full risk, that takes ${jg.steps} more renewals.` },
    { q: 'Do Mississippi homes outside a flood zone file flood claims?', a: `Yes. From ${N.claimYears[0]} to ${N.claimYears[1]}, ${K.num(cz.X?.n ?? 0)} of the ${K.num(st.claims?.n ?? 0)} paid single-family claims in Mississippi were on homes rated in X, B or C zones, with a median of ${K.usd(cz.X?.median ?? 0)}. The median bill in those zones was ${K.usd(z.X?.median ?? 0)} on ${date}. New policies there wait ${K.P.waiting.days} days before they pay.` },
  ],
  related: ['flood-insurance-rate-increase', 'average-flood-insurance-claim', 'state:louisiana', 'state:alabama'],
});
