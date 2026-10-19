import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const tn = K.S('tennessee');
const N = K.N;
const d = K.day(N.policiesDate!);
const pp = tn.pol!;
const A = tn.polByZone.A;
const X = tn.polByZone.X;
const c = (name: string) => tn.topCounties.find((x) => x.name === name);
const davidson = c('Davidson County');
const shelby = c('Shelby County');
const williamson = c('Williamson County');
const sumner = c('Sumner County');
const hamilton = c('Hamilton County');
const knox = c('Knox County');
const midState = ['Davidson County', 'Williamson County', 'Rutherford County', 'Sumner County', 'Wilson County'].reduce((s, n) => s + (c(n)?.pol?.n ?? 0), 0);
const helene = tn.events.find((e) => e.event === 'Hurricane Helene');
const tf = tn.events.find((e) => e.year === 2021);
const spring = tn.events.find((e) => e.year === 2025);
const b3 = tn.ranges[3]?.lo ?? 0;
const bandsAbove3k = tn.ranges.filter((r) => r.lo >= b3).reduce((s, r) => s + r.share, 0);
const natAbove3k = N.ranges.filter((r) => r.lo >= b3).reduce((s, r) => s + r.share, 0);

export default defineState({
  slug: 'tennessee',
  title: 'Flood Insurance Tennessee 2026: Nashville and River Basins',
  description: `Tennessee flood insurance 2026: median single-family bill by county and ZIP on ${d}, Nashville's full-risk gap, Memphis prices, Helene claims.`,
  intro: `Tennessee has ${K.num(pp.n)} single-family flood policies, with a median bill of ${K.usd(pp.median)} on ${d}.`,
  resume: `Flood insurance in Tennessee is bought for rivers, not for the sea: none of the state's policies is exposed to storm surge in FEMA's 2023 tables, and every one is priced for inland flooding. On ${d}, the ${K.num(pp.n)} single-family policies in the federal program had a median total bill of ${K.usd(pp.median)}, assessment, surcharge and fee included, close to the national ${K.usd(N.policies!.median)}. The median full-risk bill is higher, ${K.usd(pp.full)}, and ${K.pct(pp.capped, 0)} of policies are still on a capped path. The Nashville area drives both numbers: Davidson County and the four counties bordering it that rank in the state's top eight hold ${K.num(midState)} policies, and in Davidson County the median bill of ${K.usd(davidson?.pol?.median ?? 0)} sits well below a full-risk median of ${K.usd(davidson?.pol?.full ?? 0)}. A-zone homes pay a median ${K.usd(A?.median ?? 0)}, X-zone homes ${K.usd(X?.median ?? 0)}. Paid single-family claims from ${N.claimYears[0]} to ${N.claimYears[1]} totaled ${K.num(tn.claims?.n ?? 0)}, median ${K.usd(tn.claims?.median ?? 0)}.`,
  body: (h) => `
<h2>Nashville and its suburbs carry the market</h2>
<p>Davidson County alone accounts for ${K.num(davidson?.pol?.n ?? 0)} policies and ${K.num(davidson?.claims?.n ?? 0)} paid single-family claims over the decade, far more than any other county in the state. The Cumberland River, which the USGS gauges at Nashville, runs through the county, and the neighboring counties show the same pattern: Sumner, with a median bill of ${K.usd(sumner?.pol?.median ?? 0)}, has the highest share of policies still below full risk among the large counties, ${K.pct(sumner?.pol?.capped ?? 0, 0)}.</p>
<p>Williamson County, south of Nashville, recorded a median paid claim of ${K.usd(williamson?.claims?.median ?? 0)}, above the state median. The claims file does not say whether that comes from deeper water or from costlier houses to repair.</p>
${h.mini('five', { t: 'Five years of bills for a Davidson County median home', p: ['cur', 'full', 'use'], d: { cur: davidson?.pol?.median ?? pp.median, full: davidson?.pol?.full ?? pp.full, use: 'primary' } })}
<h2>Memphis, Chattanooga, Knoxville</h2>
<p>West and East Tennessee price differently. Shelby County, around Memphis, had a median bill of ${K.usd(shelby?.pol?.median ?? 0)} and is already close to its full-risk median of ${K.usd(shelby?.pol?.full ?? 0)}. Its claims are fewer, ${K.num(shelby?.claims?.n ?? 0)}, but their median is the largest of the big counties, ${K.usd(shelby?.claims?.median ?? 0)}. In the east, Hamilton County (Chattanooga) paid ${K.usd(hamilton?.pol?.median ?? 0)} at the median and Knox County (Knoxville) ${K.usd(knox?.pol?.median ?? 0)}.</p>
<h2>Three recent floods</h2>
<p>The claims file for ${N.claimYears[0]} to ${N.claimYears[1]} has no single dominant storm. ${helene ? `${helene.event} in ${helene.year} paid the most, ${K.num(helene.n)} claims and ${K.usd(helene.total)}, and the ${h.ext('https://www.nhc.noaa.gov/data/tcr/AL092024_Helene.pdf', 'National Hurricane Center report')} on the storm lists northeastern Tennessee among the areas where stream gauges passed their record flood levels.` : ''} ${tf ? `The ${tf.year} event listed by FEMA as "${tf.event}" paid ${K.num(tf.n)} claims for ${K.usd(tf.total)}.` : ''} ${spring ? `The ${spring.event.replace('Central U.S. ', '')} of ${spring.year} added ${K.num(spring.n)} more, and claims from that year may still be settling.` : ''}</p>
<p>Price bands are wide for a state with no coast: ${K.pct(bandsAbove3k, 0)} of Tennessee homes had a full-risk price of ${K.usd(b3)} or more in 2023, against ${K.pct(natAbove3k, 0)} nationwide. The largest county gap was in Cheatham County, west of Nashville, where ${K.num(tn.maxGap?.pif ?? 0)} policies paid ${K.usd(tn.maxGap?.current ?? 0)} at the median against ${K.usd(tn.maxGap?.risk ?? 0)} at full risk. The ${h.a('is-flood-insurance-required', 'guide on when flood insurance is required')} explains who must buy, and the ${h.a('flood-insurance-waiting-period', 'waiting period guide')} why a policy bought as a river rises does not cover that flood.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Nashville, Tennessee?', a: `In Davidson County the median single-family flood bill was ${K.usd(davidson?.pol?.median ?? 0)} a year on ${d}, across ${K.num(davidson?.pol?.n ?? 0)} federal policies. The full-risk median was ${K.usd(davidson?.pol?.full ?? 0)}, and ${K.pct(davidson?.pol?.capped ?? 0, 0)} of those policies still pay less than full risk, so many Nashville bills keep rising each year within the cap.` },
    { q: 'Is flood insurance in Memphis cheaper than in Nashville?', a: `At the median, yes: Shelby County's single-family bill was ${K.usd(shelby?.pol?.median ?? 0)} on ${d}, against ${K.usd(davidson?.pol?.median ?? 0)} in Davidson County. Shelby is also nearer full risk, with ${K.pct(shelby?.pol?.capped ?? 0, 0)} of policies capped. Its median paid claim from ${N.claimYears[0]} to ${N.claimYears[1]} was higher, though, at ${K.usd(shelby?.claims?.median ?? 0)}.` },
    { q: 'Did Hurricane Helene cause flood claims in Tennessee?', a: `${helene ? `Yes. The federal program paid ${K.num(helene.n)} single-family claims in Tennessee for ${helene.event} in ${helene.year}, ${K.usd(helene.total)} in total, the largest event in the state's file for ${N.claimYears[0]} to ${N.claimYears[1]}.` : 'Helene appears in the Tennessee claims file.'} None of the state's policies is exposed to storm surge in FEMA's 2023 tables, so these claims were for inland flooding.` },
  ],
  related: ['flood-insurance-by-state', 'is-flood-insurance-required', 'flood-insurance-waiting-period', 'state:kentucky'],
});
