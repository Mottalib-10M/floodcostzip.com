import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ks = K.S('kansas');
const N = K.N;
const asof = K.day(N.policiesDate!);
const kp = ks.pol!;
const inA = ks.polByZone.A;
const inX = ks.polByZone.X;
const get = (name: string) => ks.topCounties.find((x) => x.name === name);
const sedg = get('Sedgwick County');
const shaw = get('Shawnee County');
const john = get('Johnson County');
const riley = get('Riley County');
const doug = get('Douglas County');
const butler = get('Butler County');
const aPart = (inA?.n ?? 0) / kp.n;
const natA = (N.policies!.zone.A?.n ?? 0) / N.policies!.n;
const perK = K.tool('monthly', { cur: kp.median, cov: K.P.limits.building });

export default defineState({
  slug: 'kansas',
  title: 'Flood Insurance Kansas 2026: Wichita, Topeka and River Towns',
  description: `Kansas flood insurance in 2026: single-family bills by county and ZIP on ${asof}, Wichita and Topeka medians, A-zone homes and claims along Kansas rivers.`,
  intro: `Only ${K.num(kp.n)} Kansas homes carried a federal single-family flood policy on ${asof}; their median bill was ${K.usd(kp.median)}.`,
  resume: `Few Kansas homeowners buy flood insurance, and most who do live in a mapped high-risk area. On ${asof}, the federal program had ${K.num(kp.n)} single-family policies in the state, with a median total bill of ${K.usd(kp.median)} a year (premium, Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee together). ${K.pct(aPart, 0)} of those policies were in A zones, against ${K.pct(natA, 0)} nationwide, a sign that the market is driven by lender requirements rather than by voluntary buyers. A-zone homes paid a median ${K.usd(inA?.median ?? 0)} and X-zone homes ${K.usd(inX?.median ?? 0)}. Kansas bills are fairly close to full risk: the median full-risk bill is ${K.usd(kp.full)}, and ${K.pct(kp.capped, 0)} of policies still pay less than their full-risk premium. The exception is Shawnee County, around Topeka, where the median bill of ${K.usd(shaw?.pol?.median ?? 0)} has a full-risk counterpart of ${K.usd(shaw?.pol?.full ?? 0)}. From ${N.claimYears[0]} to ${N.claimYears[1]}, the program paid ${K.num(ks.claims?.n ?? 0)} single-family claims in Kansas, with a median of ${K.usd(ks.claims?.median ?? 0)}.`,
  body: (h) => `
<h2>A thin market on the plains</h2>
<p>With fewer policies than many single coastal counties, Kansas gives the county and ZIP tables below small samples, and a handful of policies can move a local median. The state figures are steadier. Spread over twelve months, the state median comes to ${perK.value}, and most of the bill outside the premium is fixed: the ${K.usd(K.P.fees.federalPolicyFee.primary)} policy fee and the ${K.usd(K.P.fees.hfiaa.primary)} surcharge apply whatever the risk.</p>
${h.mini('monthly', { t: 'The Kansas median bill per month and per thousand dollars of cover', p: ['cur', 'cov'], d: { cur: kp.median } })}
<h2>Wichita and Topeka</h2>
<p>Sedgwick County, home to Wichita, has the largest book, ${K.num(sedg?.pol?.n ?? 0)} policies at a median of ${K.usd(sedg?.pol?.median ?? 0)}, and the most paid claims in the state over the decade, ${K.num(sedg?.claims?.n ?? 0)}. Shawnee County follows with ${K.num(shaw?.pol?.n ?? 0)} policies but the highest median bill among the large counties. In FEMA's 2023 county table, Shawnee's median full-risk figure was ${K.usd(shaw?.risk ?? 0)} against ${K.usd(shaw?.current ?? 0)} actually paid, and ${K.pct(shaw?.pol?.capped ?? 0, 0)} of its policies remain capped today. At ${K.pct(K.P.caps.standard, 0)} a year for a main home, those bills keep rising for several more renewals.</p>
<h2>Kansas City suburbs and college towns</h2>
<p>Johnson County, on the Kansas side of the Kansas City area, has ${K.num(john?.pol?.n ?? 0)} policies at a median of ${K.usd(john?.pol?.median ?? 0)} and is nearer full risk (${K.pct(john?.pol?.capped ?? 0, 0)} capped). Riley County, around Manhattan, has some of the lowest bills, ${K.usd(riley?.pol?.median ?? 0)} at the median, yet one of the larger median claims, ${K.usd(riley?.claims?.median ?? 0)}. Douglas County, around Lawrence, shows a similar pairing: a ${K.usd(doug?.pol?.median ?? 0)} median bill and a ${K.usd(doug?.claims?.median ?? 0)} median claim.</p>
${h.mini('claims', { t: 'A median Kansas claim in years of premium', p: ['cur'], d: { sx: 'kansas' } })}
<h2>Claims without a headline storm</h2>
<p>No single event paid enough Kansas claims from ${N.claimYears[0]} to ${N.claimYears[1]} to be listed on its own; the losses come from many local floods. Butler County, east of Wichita, stands out with a median paid claim of ${K.usd(butler?.claims?.median ?? 0)}, more than double the state median. Outside A zones, ${K.num(ks.claimsByZone.X?.n ?? 0)} claims were paid on homes in X, B or C zones. The ${h.a('flood-insurance-waiting-period', 'waiting period guide')} explains why a policy has to be in place ${K.P.waiting.days} days before a flood, and the ${h.a('state:missouri', 'Missouri page')} covers the other half of the Kansas City area.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Wichita, Kansas?', a: `In Sedgwick County, which includes Wichita, the median single-family flood bill was ${K.usd(sedg?.pol?.median ?? 0)} a year on ${asof}, across ${K.num(sedg?.pol?.n ?? 0)} federal policies. The county's full-risk median was ${K.usd(sedg?.pol?.full ?? 0)}, and ${K.pct(sedg?.pol?.capped ?? 0, 0)} of policies were still below it. A ZIP code median in the lookup can differ widely from the county figure.` },
    { q: 'Why is flood insurance in Topeka higher than in the rest of Kansas?', a: `Shawnee County, around Topeka, had a median bill of ${K.usd(shaw?.pol?.median ?? 0)} on ${asof}, the highest of the large Kansas counties, and a full-risk median of ${K.usd(shaw?.pol?.full ?? 0)}. The higher full-risk price reflects how FEMA rates the homes there, and ${K.pct(shaw?.pol?.capped ?? 0, 0)} of policies are still being raised toward it each year.` },
    { q: 'Do most Kansas flood policies come from mortgage requirements?', a: `The zone mix points that way. On ${asof}, ${K.num(inA?.n ?? 0)} of the ${K.num(kp.n)} Kansas single-family policies were in A zones, where a loan from a federally regulated or insured lender requires flood insurance, and ${K.num(inX?.n ?? 0)} in X zones, where buying is a choice. The policy data does not record why each owner bought.` },
  ],
  related: ['flood-insurance-by-state', 'is-flood-insurance-required', 'flood-insurance-waiting-period', 'state:missouri'],
});
