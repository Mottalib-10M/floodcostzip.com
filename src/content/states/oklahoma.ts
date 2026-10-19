import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('oklahoma');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const cz = st.claimsByZone;
const get = (name: string) => st.topCounties.find((x) => x.name === name);
const tulsa = get('Tulsa County');
const okc = get('Oklahoma County');
const comanche = get('Comanche County');
const wagoner = get('Wagoner County');
const ottawa = get('Ottawa County');
const cleveland = get('Cleveland County');
const gap = st.maxGap;
const big = st.events[0];
const claimToBill = (st.claims?.median ?? 0) / pol.median;

export default defineState({
  slug: 'oklahoma',
  title: 'Flood Insurance Oklahoma 2026: Tulsa, OKC and Claim Sizes',
  description: `Oklahoma flood insurance in 2026: median single-family bill on ${date}, Tulsa and Oklahoma County prices, A and X zone costs and the large median claim.`,
  intro: `Only ${K.num(pol.n)} Oklahoma homes had a single-family flood policy on ${date}; their median bill was ${K.usd(pol.median)} a year.`,
  resume: `Oklahoma's ${K.num(pol.n)} single-family flood policies had a median total bill of ${K.usd(pol.median)} a year on ${date}, including the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. That is near the national median of ${K.usd(N.policies!.median)}, and the state's prices are fairly close to full risk: the same policies would have a median bill of ${K.usd(pol.full)} at full-risk rates, and ${K.pct(pol.capped, 0)} pay less than that today. No Oklahoma policy is rated in a V zone: every one is in an A zone (${K.num(z.A?.n ?? 0)}) or an X zone (${K.num(z.X?.n ?? 0)}). What sets Oklahoma apart is the size of its losses. From ${N.claimYears[0]} to ${N.claimYears[1]}, the median paid single-family claim was ${K.usd(st.claims?.median ?? 0)}, about ${K.num(claimToBill)} times the median yearly bill, on ${K.num(st.claims?.n ?? 0)} paid claims. Tulsa County and its eastern neighbours record the largest median losses, and few homes there carry a policy.`,
  body: (h) => `
<h2>Small market, heavy losses</h2>
<p>Oklahoma insures ${K.pct(pol.n / N.policies!.n, 1)} of the country's single-family flood policies. ${big ? `The largest event in the file, ${big.event}, paid ${K.num(big.n)} claims.` : `No single storm stands out in the claims file: none of the floods from ${N.claimYears[0]} to ${N.claimYears[1]} paid enough Oklahoma claims to rank as a named event in the data.`} The paid claims are spread over many local floods, county by county and year by year.</p>
<p>The claims that were paid were large. Tulsa County's median paid claim was ${K.usd(tulsa?.claims?.median ?? 0)}, on ${K.num(tulsa?.claims?.n ?? 0)} claims. Wagoner County, east of Tulsa, where the USGS gauges both the Arkansas and the Verdigris rivers, reached ${K.usd(wagoner?.claims?.median ?? 0)}. Both are well above the national median claim of ${K.usd(N.claims.median)}.</p>
${h.mini('claims', { t: 'An Oklahoma median claim measured in years of premium', p: ['cur'], d: { sx: 'oklahoma' } })}
<h2>Outside the A zone, losses are almost as big</h2>
<p>A home outside the mapped floodplain is not a home without risk. In Oklahoma, the ${K.num(cz.X?.n ?? 0)} paid claims on homes rated X, B or C had a median of ${K.usd(cz.X?.median ?? 0)}, close to the ${K.usd(cz.A?.median ?? 0)} of A zone claims. An X zone policy cost ${K.usd(z.X?.median ?? 0)} at the median on ${date}; no lender requires it, and it takes ${K.P.waiting.days} days to start.</p>
<h2>When the loss is large</h2>
<p>The average paid claim in Oklahoma, which a few very large losses pull upward, was ${K.usd(st.claims?.avg ?? 0)}. A federal policy on a house pays up to ${K.usd(K.P.limits.building)} for the structure and, only if contents coverage was bought, up to ${K.usd(K.P.limits.contents)} for belongings, each after its own deductible. Nationally, ${K.pct(N.policies!.shareWithContents, 0)} of single-family policies include contents coverage. The claims data do not record the depth of water in each house, only the amount paid, and in Oklahoma ${K.num(st.claims?.n ?? 0)} payments added up to ${K.usd(st.claims?.total ?? 0)}.</p>
<h2>County prices</h2>
<p>Tulsa County leads with ${K.num(tulsa?.pol?.n ?? 0)} policies at a median of ${K.usd(tulsa?.pol?.median ?? 0)}. Oklahoma County, home to Oklahoma City, follows with ${K.num(okc?.pol?.n ?? 0)} at ${K.usd(okc?.pol?.median ?? 0)}, and Cleveland County, around Norman, is lower at ${K.usd(cleveland?.pol?.median ?? 0)}. Comanche County, around Lawton, recorded ${K.num(comanche?.claims?.n ?? 0)} paid claims, a lot for its ${K.num(comanche?.pol?.n ?? 0)} policies.</p>
<p>The northeast corner is the exception on price. Ottawa County had ${K.pct(ottawa?.pol?.capped ?? 0, 0)} of its policies still capped, and ${gap?.name ?? 'its neighbour'}, which borders it, had the widest current to full-risk gap in FEMA's 2023 table, ${K.usd(gap?.current ?? 0)} against ${K.usd(gap?.risk ?? 0)}. The ${h.a('average-flood-insurance-claim', 'claims guide')} compares Oklahoma's claim sizes with other states.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Tulsa, Oklahoma?', a: `Tulsa County had ${K.num(tulsa?.pol?.n ?? 0)} single-family flood policies on ${date}, the most in Oklahoma, with a median yearly bill of ${K.usd(tulsa?.pol?.median ?? 0)} including fees and a median full-risk bill of ${K.usd(tulsa?.pol?.full ?? 0)}. Its median paid claim from ${N.claimYears[0]} to ${N.claimYears[1]} was ${K.usd(tulsa?.claims?.median ?? 0)}, the highest among the state's eight largest counties.` },
    { q: 'What does flood insurance cost in Oklahoma City?', a: `Oklahoma County, which includes Oklahoma City, had a median single-family flood bill of ${K.usd(okc?.pol?.median ?? 0)} a year on ${date}, across ${K.num(okc?.pol?.n ?? 0)} policies. At full risk the median would be ${K.usd(okc?.pol?.full ?? 0)}. The county recorded ${K.num(okc?.claims?.n ?? 0)} paid claims over ${N.claimYears[0]} to ${N.claimYears[1]}, at a median of ${K.usd(okc?.claims?.median ?? 0)}.` },
    { q: 'Why are Oklahoma flood claims so large?', a: `The data show the size of each payment, not the cause of the flood or the depth of water in the house, so the reason cannot be read from them. The Oklahoma median paid single-family claim was ${K.usd(st.claims?.median ?? 0)} from ${N.claimYears[0]} to ${N.claimYears[1]}. A federal policy pays at most ${K.usd(K.P.limits.building)} for the building and ${K.usd(K.P.limits.contents)} for contents.` },
  ],
  related: ['average-flood-insurance-claim', 'flood-insurance-coverage-limits', 'is-flood-insurance-required', 'state:texas'],
});
