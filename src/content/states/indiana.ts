import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('indiana');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const pick = (name: string) => st.topCounties.find((x) => x.name === name);
const marion = pick('Marion County');
const lake = pick('Lake County');
const clark = pick('Clark County');
const vanderburgh = pick('Vanderburgh County');
const kosciusko = pick('Kosciusko County');
const april = st.events.find((e) => e.n > 1);
const gap = st.maxGap;
const aShare = (z.A?.n ?? 0) / pol.n;
const monthly = pol.median / 12;
const lowerCapped = K.STATES.filter((x) => x.pol && x.pol.capped < pol.capped).length;

export default defineState({
  slug: 'indiana',
  title: 'Flood Insurance Indiana 2026: River County Bills and Claims',
  description: `Indiana flood insurance 2026: median single-family bill on ${date}, Marion, Lake and Ohio River county costs and how close policies are to full risk.`,
  intro: `Indiana has ${K.num(pol.n)} single-family flood policies across its ${K.num(st.counties)} counties; their median yearly bill was ${K.usd(pol.median)} on ${date}.`,
  resume: `In Indiana the median single-family flood policy cost ${K.usd(pol.median)} a year on ${date}, roughly ${K.usd(monthly)} a month, with the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee included. That is below the national median of ${K.usd(N.policies!.median)}, and the state is close to the end of its price transition: priced at full risk, the same policies would have a median bill of ${K.usd(pol.full)}, and only ${K.pct(pol.capped, 0)} still pay less than their full-risk premium; only ${K.num(lowerCapped)} of the ${K.num(K.STATES.length)} jurisdictions in the data, DC included, have a lower share. The market is small. Only ${K.num(pol.n)} homes are insured, and ${K.pct(aShare, 0)} of them are in A zones, where a federally regulated lender requires a policy. Bills differ little by zone, ${K.usd(z.A?.median ?? 0)} in A zones and ${K.usd(z.X?.median ?? 0)} in X zones, and FEMA's 2023 table counts no surge exposure in the state.`,
  body: (h) => `
<h2>Few insured homes</h2>
<p>The USGS gauges the Wabash, the White and the Ohio rivers in Indiana, and the state has ${K.num(st.zips)} ZIP codes with flood policies in FEMA's 2023 table. Still, Marion County, which includes Indianapolis, leads with just ${K.num(marion?.pol?.n ?? 0)} single-family policies. The eight largest counties together hold a minority of the state total; the rest is spread thinly over the other counties.</p>
<p>${K.pct(aShare, 0)} of policies are in A zones, where the mortgage rule applies: a federally regulated lender requires flood insurance for a loan on a building in a high-risk zone. Fewer homes outside those zones are insured, though they produced ${K.num(st.claimsByZone.X?.n ?? 0)} paid claims from ${N.claimYears[0]} to ${N.claimYears[1]}.</p>
<h2>What the bill looks like each month</h2>
<p>At ${K.usd(pol.median)} a year, the state median comes to about ${K.usd(monthly)} a month. The mini-calculator turns a yearly bill into a monthly figure and a cost per thousand dollars of building coverage.</p>
${h.mini('monthly', { t: 'An Indiana flood bill per month', p: ['cur', 'cov'], d: { cur: pol.median } })}
<h2>The Ohio River counties</h2>
<p>Clark County, where the USGS gauges the ${h.ext('https://waterdata.usgs.gov/monitoring-location/03293550/', 'Ohio River at Clarksville')} and which borders Louisville's Jefferson County, Kentucky, is where losses run deepest among the large counties. It recorded ${K.num(clark?.claims?.n ?? 0)} paid single-family claims over the decade, with a median of ${K.usd(clark?.claims?.median ?? 0)}, ${K.dec((clark?.claims?.median ?? 0) / (st.claims?.median ?? 1), 1)} times the state median claim of ${K.usd(st.claims?.median ?? 0)}. Its median bill, ${K.usd(clark?.pol?.median ?? 0)} on ${date}, is the highest of the eight. Vanderburgh County, which includes Evansville and its Ohio River gauge, paid ${K.usd(vanderburgh?.pol?.median ?? 0)} at the median.</p>
<h2>Lake and Kosciusko counties</h2>
<p>Lake County, which borders Cook County, Illinois, holds ${K.num(lake?.pol?.n ?? 0)} policies at a median of ${K.usd(lake?.pol?.median ?? 0)}. FEMA counted ${K.pct(st.exposure.greatLakes, 0)} of Indiana's single-family policies as exposed to Great Lakes flooding. Kosciusko County has the cheapest median of the larger counties, ${K.usd(kosciusko?.pol?.median ?? 0)}.</p>
<h2>Recent floods and the remaining gap</h2>
<p>${april ? `The largest event in the file is ${april.event} in ${april.year}, with ${K.num(april.n)} paid claims for ${K.usd(april.total)}; losses of ${N.claimYears[1]} are still being settled.` : `No single event dominates the claims file; losses of ${N.claimYears[1]} are still being settled.`} ${gap?.name ?? 'One county'} had the widest gap in the 2023 table, ${K.usd(gap?.current ?? 0)} against ${K.usd(gap?.risk ?? 0)}, on ${K.num(gap?.pif ?? 0)} policies. The ${h.a('flood-insurance-cost-per-month', 'monthly cost guide')} explains how the fixed fees weigh on a small bill.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Indianapolis?', a: `Marion County, which includes Indianapolis, had ${K.num(marion?.pol?.n ?? 0)} single-family flood policies on ${date}, with a median yearly bill of ${K.usd(marion?.pol?.median ?? 0)} including fees, about ${K.usd((marion?.pol?.median ?? 0) / 12)} a month. The median full-risk bill was ${K.usd(marion?.pol?.full ?? 0)}, so most policies there are at or near their final price.` },
    { q: 'Are flood claims large along the Ohio River in Indiana?', a: `In Clark County, the median paid single-family claim from ${N.claimYears[0]} to ${N.claimYears[1]} was ${K.usd(clark?.claims?.median ?? 0)}, across ${K.num(clark?.claims?.n ?? 0)} claims, well above the Indiana median of ${K.usd(st.claims?.median ?? 0)}. The county's median bill was ${K.usd(clark?.pol?.median ?? 0)} on ${date}, the highest of the eight largest Indiana counties.` },
    { q: 'What share of Indiana flood policies are still below full price?', a: `On ${date}, ${K.pct(pol.capped, 0)} of Indiana single-family policies paid less than their full-risk premium, against ${K.pct(N.policies!.capped, 0)} nationally. The state median bill was ${K.usd(pol.median)} and the median at full risk ${K.usd(pol.full)}. A capped policy rises by at most ${K.pct(K.P.caps.standard, 0)} a year for a primary residence.` },
  ],
  related: ['flood-insurance-cost-per-month', 'is-flood-insurance-required', 'flood-insurance-by-state', 'state:ohio'],
});
