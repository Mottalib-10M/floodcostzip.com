import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('new-jersey');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const by = (name: string) => st.topCounties.find((c) => c.name === name);
const ocean = by('Ocean County');
const capeMay = by('Cape May County');
const atlantic = by('Atlantic County');
const monmouth = by('Monmouth County');
const bergen = by('Bergen County');
const union = by('Union County');
const essex = by('Essex County');
const shore = [ocean, capeMay, atlantic, monmouth];
const shorePol = shore.reduce((t, c) => t + (c?.pol?.n ?? 0), 0);
const shoreClaims = shore.reduce((t, c) => t + (c?.claims?.n ?? 0), 0);
const north = [bergen, union, essex];
const northPol = north.reduce((t, c) => t + (c?.pol?.n ?? 0), 0);
const northClaims = north.reduce((t, c) => t + (c?.claims?.n ?? 0), 0);
const ida = st.events[0];
const gap = st.maxGap;
const aShare = (z.A?.n ?? 0) / pol.n;

export default defineState({
  slug: 'new-jersey',
  title: 'Flood Insurance New Jersey 2026: Shore vs Inland Prices',
  description: `New Jersey flood insurance 2026: median single-family bill on ${date}, Jersey Shore and northern county costs, the full-risk gap and Ida claims.`,
  intro: `New Jersey has ${K.num(pol.n)} single-family flood policies; their median yearly bill was ${K.usd(pol.median)} on ${date}, above the national ${K.usd(N.policies!.median)}.`,
  resume: `New Jersey homeowners with a federal flood policy paid a median of ${K.usd(pol.median)} a year for a single-family house on ${date}, a total that includes the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. The national median on that date was ${K.usd(N.policies!.median)}. The state has ${K.num(pol.n)} such policies, and ${K.pct(aShare, 0)} of them are rated in high-risk A zones, a far larger share than in most states, because the barrier islands and back bays of the shore are mapped almost entirely as floodplain. The bills are still well below cost: priced at full risk, the median would be ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of policies pay less than their full-risk premium. Ocean County, with ${K.num(ocean?.pol?.n ?? 0)} policies, is the largest market. Paid claims tell a different story: most recent losses came from rain in the north, led by ${ida?.event ?? 'one storm'} in ${ida?.year ?? N.claimYears[0]}.`,
  body: (h) => `
<h2>Two flood markets in one small state</h2>
<p>Read the county table below with two groups in mind. The four shore counties, Ocean, Cape May, Atlantic and Monmouth, hold ${K.num(shorePol)} single-family policies, about ${K.pct(shorePol / pol.n, 0)} of the state. Bergen, Union and Essex, in the dense north near New York, hold only ${K.num(northPol)}. Yet over ${N.claimYears[0]} to ${N.claimYears[1]}, the northern three had ${K.num(northClaims)} paid claims against ${K.num(shoreClaims)} for the shore four.</p>
<p>Part of the answer is the window. The claims file starts in ${N.claimYears[0]}, so it leaves out older coastal storms, and the big losses since then came from heavy rain over rivers and storm drains far from the beach. ${ida?.event ?? 'The largest event'} alone produced ${K.num(ida?.n ?? 0)} paid claims and ${K.usd(ida?.total ?? 0)} in payments, ${K.pct((ida?.n ?? 0) / (st.claims?.n ?? 1), 0)} of every paid single-family claim in the state in that decade.</p>
<h2>What shore owners pay</h2>
<p>Insurance follows the map, and the map puts the shore in A zones. Cape May County had a median bill of ${K.usd(capeMay?.pol?.median ?? 0)} on ${date}; Atlantic County, ${K.usd(atlantic?.pol?.median ?? 0)}; Ocean County, ${K.usd(ocean?.pol?.median ?? 0)}. In all three, the median full-risk bill is well above that, and in Ocean ${K.pct(ocean?.pol?.capped ?? 0, 0)} of policies are still on a glide path. FEMA rated ${K.pct(st.exposure.surge, 0)} of New Jersey's single-family policies as exposed to storm surge and ${K.pct(st.exposure.erosion, 0)} to erosion.</p>
<p>Where a shore house is a second home, the rules change. A home that is not a primary residence has its premium raised by up to ${K.pct(K.P.caps.higher, 0)} a year instead of ${K.pct(K.P.caps.standard, 0)}, and pays a ${K.usd(K.P.fees.hfiaa.other)} HFIAA surcharge instead of ${K.usd(K.P.fees.hfiaa.primary)}. The ${h.a('flood-insurance-second-home', 'second home guide')} covers that track. The insurer checks primary residence status, for example when a policy is assigned to a buyer at a sale.</p>
${h.mini('five', { t: 'Next five New Jersey bills from the state medians', p: ['cur', 'full', 'use'], d: { cur: pol.median, full: pol.full, use: 'primary' } })}
<h2>The north: few policies, costly claims</h2>
<p>Bergen County paid claims at a median of ${K.usd(bergen?.claims?.median ?? 0)}, Union County at ${K.usd(union?.claims?.median ?? 0)}, both above the state median claim of ${K.usd(st.claims?.median ?? 0)}. Their policies are closer to full price: in Essex County only ${K.pct(essex?.pol?.capped ?? 0, 0)} of policies remain capped. Statewide, ${K.num(st.claimsByZone.X?.n ?? 0)} claims over the decade were paid on homes rated in X zones. No lender requires coverage there, and a policy bought after a forecast still waits ${K.P.waiting.days} days.</p>
<h2>The widest gap</h2>
<p>In FEMA's 2023 table, ${gap?.name ?? 'one inland county'} on the Delaware River had the largest distance between current and full-risk medians: ${K.usd(gap?.current ?? 0)} against ${K.usd(gap?.risk ?? 0)}, across ${K.num(gap?.pif ?? 0)} policies. Few of its homes are insured, and a typical one there still has a long way to go. Monmouth County shows the opposite pattern on the coast: ${K.usd(monmouth?.pol?.median ?? 0)} paid at the median against ${K.usd(monmouth?.pol?.full ?? 0)} at full risk, the smallest distance of the four shore counties.</p>
`,
  faqs: [
    { q: 'How much does flood insurance cost on the Jersey Shore?', a: `County medians on ${date} ranged from ${K.usd(monmouth?.pol?.median ?? 0)} in Monmouth to ${K.usd(capeMay?.pol?.median ?? 0)} in Cape May for single-family homes, fees included. Ocean County, the largest market with ${K.num(ocean?.pol?.n ?? 0)} policies, had a median of ${K.usd(ocean?.pol?.median ?? 0)} and a full-risk median of ${K.usd(ocean?.pol?.full ?? 0)}, so further yearly increases are expected there.` },
    { q: 'How many New Jersey flood claims came from Hurricane Ida?', a: `The federal program paid ${K.num(ida?.n ?? 0)} claims on New Jersey single-family homes for ${ida?.event ?? 'that storm'} in ${ida?.year ?? N.claimYears[0]}, ${K.usd(ida?.total ?? 0)} in total. The claim counts of the northern counties show where the rain fell hardest: Union County alone recorded ${K.num(union?.claims?.n ?? 0)} paid claims over ${N.claimYears[0]} to ${N.claimYears[1]}, and Bergen County ${K.num(bergen?.claims?.n ?? 0)}.` },
    { q: 'Do homes in Bergen County, New Jersey need flood insurance?', a: `A federally regulated lender requires it when the house is in a high-risk A or V zone. Outside those zones it is optional, but Bergen County had ${K.num(bergen?.claims?.n ?? 0)} paid single-family claims from ${N.claimYears[0]} to ${N.claimYears[1]}, at a median of ${K.usd(bergen?.claims?.median ?? 0)}. Its ${K.num(bergen?.pol?.n ?? 0)} policies had a median bill of ${K.usd(bergen?.pol?.median ?? 0)} on ${date}.` },
  ],
  related: ['flood-insurance-rate-increase', 'flood-insurance-second-home', 'is-flood-insurance-required', 'state:new-york'],
});
