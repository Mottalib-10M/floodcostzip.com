import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('california');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const co = (name: string) => st.topCounties.find((c) => c.name === name);
const sac = co('Sacramento County');
const la = co('Los Angeles County');
const marin = co('Marin County');
const sd = co('San Diego County');
const ar = st.events[0];
const gapMarin = marin?.pol ? K.pct(marin.pol.full / marin.pol.median - 1, 0) : '';
const sacShare = sac?.pol ? K.pct(sac.pol.n / pol.n, 0) : '';

export default defineState({
  slug: 'california',
  title: 'Flood Insurance California 2026: Prices from Delta to Coast',
  description: `Flood insurance in California 2026: median single-family bill on ${date}, Sacramento's own bills versus coastal counties, claims from atmospheric rivers.`,
  intro: `California counts ${K.num(pol.n)} single-family flood policies in the federal program, and a median bill of ${K.usd(pol.median)} on ${date}.`,
  resume: `On ${date}, the ${K.num(pol.n)} single-family flood policies written by the federal program in California had a median yearly bill of ${K.usd(pol.median)}, which includes the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. Priced at full risk, the same homes would have a median bill of ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of them still pay less than that full price, a larger share than the national ${K.pct(N.policies!.capped, 0)}. The state's buyers are concentrated in one county: Sacramento County alone holds ${K.num(sac?.pol?.n ?? 0)} policies, about ${sacShare} of the state, at a median of ${K.usd(sac?.pol?.median ?? 0)}. Several other large counties pay more and sit further from full price; in Marin County the median full-risk bill is ${gapMarin} above the median paid. The costliest recent event, the ${ar.event} of ${ar.year}, produced ${K.num(ar.n)} paid single-family claims.`,
  body: (h) => `
<h2>Sacramento holds the market</h2>
<p>No California county comes close to Sacramento County, where ${K.num(sac?.pol?.n ?? 0)} single-family policies were in force on ${date}, about ${sacShare} of the state total. Their median bill, ${K.usd(sac?.pol?.median ?? 0)}, sits almost on top of the median full-risk bill of ${K.usd(sac?.pol?.full ?? 0)}: only ${K.pct(sac?.pol?.capped ?? 0, 0)} of those policies are still on a capped path. For a Sacramento homeowner, the yearly increases driven by the ${K.pct(K.P.caps.standard, 0)} limit are mostly behind them.</p>
<p>That stability pulls the state median down. Remove Sacramento and the typical California policy is both pricier and further from its full cost.</p>
<h2>Southern California and the Bay Area</h2>
<p>Los Angeles County has ${K.num(la?.pol?.n ?? 0)} policies at a median of ${K.usd(la?.pol?.median ?? 0)}, with a full-risk median of ${K.usd(la?.pol?.full ?? 0)}; ${K.pct(la?.pol?.capped ?? 0, 0)} remain below full price. Marin County has the widest gap among the large counties, ${K.usd(marin?.pol?.median ?? 0)} paid against ${K.usd(marin?.pol?.full ?? 0)} at full risk. San Diego County sits between them at ${K.usd(sd?.pol?.median ?? 0)}. These are the places where renewals will keep rising for several more years.</p>
<p>The few California homes rated in V zones, ${K.num(z.V?.n ?? 0)} policies, had a median bill of ${K.usd(z.V?.median ?? 0)} and a full-risk median of ${K.usd(z.V?.full ?? 0)}. A and X zones show the same median, ${K.usd(z.A?.median ?? 0)} and ${K.usd(z.X?.median ?? 0)}, so in this state the zone letter on its own says little about what a given house pays.</p>
${h.mini('zone', { t: 'California median bill by zone type', p: ['z'], d: { sx: 'california', z: 'V' } })}
<h2>The atmospheric river claims</h2>
<p>No hurricane appears among California's large claim events. The ${ar.event} of ${ar.year} accounts for ${K.num(ar.n)} of the ${K.num(st.claims?.n ?? 0)} single-family claims paid for losses from ${N.claimYears[0]} to ${N.claimYears[1]}, ${K.usd(ar.total)} in all. The median paid claim in the state was ${K.usd(st.claims?.median ?? 0)}, well under the national ${K.usd(N.claims.median)}. Claims in X zones, outside the mapped high-risk areas, numbered ${K.num(st.claimsByZone.X?.n ?? 0)}.</p>
<p>FEMA's 2023 table also records ${K.pct(st.exposure.tsunami, 0)} of California policies as exposed to tsunami and ${K.pct(st.exposure.erosion, 0)} to coastal erosion. The highest ratio of full-risk to current cost among counties was in ${st.maxGap?.name ?? 'a small rural county'}, a reminder that a cheap bill today can hide a large future price. The ${h.a('flood-zones-explained', 'flood zone guide')} explains what each letter means for a lender.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Sacramento County?', a: `The median single-family bill in Sacramento County was ${K.usd(sac?.pol?.median ?? 0)} a year on ${date}, across ${K.num(sac?.pol?.n ?? 0)} policies, the largest count of any California county. Because the median full-risk bill is ${K.usd(sac?.pol?.full ?? 0)}, most of those owners already pay close to the price FEMA's model sets, so large yearly increases are less common there than on the coast.` },
    { q: 'Did flood insurance pay for the California atmospheric river storms?', a: `For buildings that carried a policy, yes. The ${ar.event} of ${ar.year} led to ${K.num(ar.n)} paid single-family claims in the state, ${K.usd(ar.total)} for buildings and contents together. Homeowners insurance excludes flooding, so owners without a flood policy had no claim to file for water that rose from outside.` },
    { q: 'Why is flood insurance in Marin County more expensive than in Sacramento?', a: `In Marin County the median bill was ${K.usd(marin?.pol?.median ?? 0)} on ${date}, against ${K.usd(sac?.pol?.median ?? 0)} in Sacramento County. Marin also sits further from full price: ${K.pct(marin?.pol?.capped ?? 0, 0)} of its policies are still below a median full-risk bill of ${K.usd(marin?.pol?.full ?? 0)}, so the gap is likely to widen.` },
  ],
  related: ['flood-insurance-by-state', 'flood-zones-explained', 'flood-insurance-rate-increase', 'state:oregon'],
});
