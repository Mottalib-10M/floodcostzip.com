import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const N = K.N;
const year = N.policiesDate!.slice(0, 4);
const date = K.day(N.policiesDate!);
const withPol = K.STATES.filter((s) => s.pol && s.pol.n >= 1000);
const dear = [...withPol].sort((a, b) => b.pol!.median - a.pol!.median);
const cheap = [...dear].reverse();
const byCount = K.rank((s) => s.pol?.n ?? 0);
const top5 = byCount.slice(0, 5);
const top5Share = top5.reduce((a, s) => a + (s.pol?.n ?? 0), 0) / N.policies!.n;
const gap = (s: (typeof K.STATES)[number]) => s.risk / (s.pol?.median ?? s.current);
const farthest = [...withPol].sort((a, b) => gap(b) - gap(a))[0];
const closest = [...withPol].sort((a, b) => gap(a) - gap(b))[0];
const fl = K.S('florida');
const surgeHi = [...K.STATES].filter((s) => s.pif >= 5000).sort((a, b) => b.exposure.surge - a.exposure.surge).slice(0, 3);
const link = (s: (typeof K.STATES)[number]) => `state:${s.slug}`;
const moved = [...withPol].sort((a, b) => b.pol!.median / b.current - a.pol!.median / a.current);
const fast = moved.slice(0, 3);
const flat = moved[moved.length - 1];
const xShare = (s: (typeof K.STATES)[number]) => (s.polByZone.X?.n ?? 0) / (s.pol?.n ?? 1);
const byX = [...withPol].sort((a, b) => xShare(b) - xShare(a));
const natX = (N.policies!.zone.X?.n ?? 0) / N.policies!.n;

export default defineGuide({
  id: 'flood-insurance-by-state',
  group: 'cost',
  order: 1,
  slug: 'flood-insurance',
  nav: 'Flood insurance by state',
  card: `The ${year} median bill of every state, from the most to the least expensive.`,
  title: 'Flood Insurance by State 2026: Median Cost in All 50',
  description: `Flood insurance by state in 2026: the median single-family bill of each state on ${date}, the full-risk median and the yearly steps left, from FEMA files.`,
  h1: 'Flood insurance by state: the median bill in each of the 50 states and DC',
  intro: `Pick a state: its median single-family bill on ${date}, its full-risk median, and five years of renewals from your own bill.`,
  resume: `On ${date}, the most expensive state for a single-family flood policy was ${dear[0].name}, with a median bill of ${K.usd(dear[0].pol!.median)} a year, followed by ${dear[1].name} (${K.usd(dear[1].pol!.median)}) and ${dear[2].name} (${K.usd(dear[2].pol!.median)}). The least expensive among states with at least ${K.num(1000)} policies was ${cheap[0].name}, at ${K.usd(cheap[0].pol!.median)}. Those medians come from the federal program's own policy file and include premium, assessment, surcharge and fee. Where people buy flood insurance matters as much as what it costs: ${top5.map((s) => s.name).join(', ')} hold ${K.pct(top5Share, 0)} of all single-family policies, ${K.num(fl.pol?.n ?? 0)} in Florida alone. The gap to the full-risk price differs too: in ${farthest.name} FEMA's full-risk median is ${K.dec(gap(farthest), 1)} times the ${year} median bill, so increases have years to run, while in ${closest.name} most bills have already caught up. The calculator above applies the ${K.pct(K.P.caps.standard, 0)} yearly cap from any bill you enter.`,
  body: (h) => `
<h2>Why one state costs more than another</h2>
<p>A state has no flood insurance price of its own. Every federal policy is priced building by building, from the distance to water, the type of flooding the place is exposed to, the elevation of the lowest floor and the cost of rebuilding. A state median is therefore a portrait of where its insured homes stand. Coastal states with many homes behind the dunes have a high median because storm surge is the most expensive kind of exposure: in FEMA's 2023 tables, ${surgeHi.map((s) => `${h.a(link(s), s.name)} (${K.pct(s.exposure.surge, 0)} of policies)`).join(', ')} had the largest shares of policies exposed to surge.</p>
<p>A low median does not mean low risk. In inland states, the people who buy flood insurance are mostly those whose lender requires it, in mapped high-risk areas along rivers, and the many homeowners just outside those areas rarely buy any. The median then describes a small, specific group of houses, not the state.</p>
<h2>The ${Math.min(12, dear.length)} states with the highest median bill</h2>
${h.table(['State', `Policies ${year}`, `Median ${year}`, 'Full-risk median', 'Full-risk to bill'], dear.slice(0, 12).map((s) => [h.a(link(s), s.name), K.num(s.pol!.n), K.usd(s.pol!.median), K.usd(s.risk), `${K.dec(gap(s), 2)}×`]), `Single-family homes. ${year}: OpenFEMA policies in force on ${date}. Full-risk median: FEMA, policies in force on August 31, 2023. States with at least ${K.num(1000)} policies.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The last column divides the full-risk median by today's median bill. Above 1, the typical bill still has increases ahead under the yearly cap; below 1, the typical bill already exceeds what FEMA computes for its full risk, which usually means the full-risk price has been reached and FEMA's later rate changes have pushed bills a little higher.</p>
${h.mini('state', { t: 'Check another state against your own bill', p: ['sx', 'cur'], d: { sx: dear[3].slug } })}
<h2>The states where flood insurance costs the least</h2>
${h.table(['State', `Policies ${year}`, `Median ${year}`, 'Full-risk median'], cheap.slice(0, 8).map((s) => [h.a(link(s), s.name), K.num(s.pol!.n), K.usd(s.pol!.median), K.usd(s.risk)]), `Same sources and the same ${K.num(1000)}-policy threshold.`, ['l', 'r', 'r', 'r'])}
<p>The cheapest states share a profile: few homes exposed to the sea, policies concentrated in river valleys, and a large share of policies in moderate-risk X zones bought without a lender's demand. A policy there is often cheaper than its owners expect, which is why a quote is worth asking for even outside a mapped flood area.</p>
<h2>Where the bill rose fastest since 2023</h2>
<p>FEMA's single-family tables give each state's median bill for August 2023, and the policy file gives it again for ${date}. Set side by side, they show which states have been catching up with the full-risk price. The steepest climbs came in ${fast.map((s) => `${h.a(link(s), s.name)} (${K.usd(s.current)} to ${K.usd(s.pol!.median)})`).join(', ')}. These are states where a large share of policies started far below their full-risk level, so the yearly cap has been at work on most renewals.</p>
<p>At the other end, ${h.a(link(flat), flat.name)} went from ${K.usd(flat.current)} to ${K.usd(flat.pol!.median)}. A flat or falling median fits a state where most bills already matched their full-risk price in 2023. A state whose median has barely moved has fewer increases ahead than one that has risen steeply and still shows a wide gap in the table above.</p>
<h2>Who buys outside the high-risk zones</h2>
<p>The zone mix of a state's policies says a lot about its median. Nationwide, ${K.pct(natX, 0)} of single-family policies in force on ${date} were in X, B or C zones, where federal law does not oblige a lender to require flood insurance. ${byX.slice(0, 3).map((s) => `${h.a(link(s), s.name)} (${K.pct(xShare(s), 0)})`).join(', ')} had the highest shares. In those places many owners buy by choice, and their policies pull the state median down because moderate-risk buildings cost less to insure.</p>
<p>In ${byX.slice(-2).map((s) => h.a(link(s), s.name)).join(' and ')}, by contrast, only ${K.pct(xShare(byX[byX.length - 2]), 0)} or less of policies sat in those zones. The insured houses there are mostly the ones a lender requires to be covered, in A or V zones, and the state median describes that higher-risk group rather than the typical house of the state. Comparing two states on their medians alone can therefore mislead: the one with the lower figure may simply insure more low-risk buildings.</p>
<h2>What a state page adds</h2>
<p>Each state page reads the same files down to the county and the ZIP code: the counties with the most policies, the spread of full-risk prices in ${K.usd(1000)} bands, and the floods that paid the most claims since ${N.claimYears[0]}. Start from the most insured states, ${top5.map((s) => h.a(link(s), s.name)).join(', ')}, or from the ${h.a('home', 'ZIP code lookup')} if you know where the house is. The method behind each figure is on the ${h.a('method', 'method page')}.</p>
`,
  faqs: [
    { q: 'Which state has the most expensive flood insurance?', a: `On ${date}, ${dear[0].name} had the highest median single-family bill among states with at least ${K.num(1000)} policies, ${K.usd(dear[0].pol!.median)} a year, ahead of ${dear[1].name} and ${dear[2].name}. A high state median reflects where the insured homes stand, often close to the sea, rather than a state rate, since each policy is priced building by building.` },
    { q: 'Which state buys the most flood insurance?', a: `Florida, by far: ${K.num(fl.pol?.n ?? 0)} single-family policies were in force there on ${date}, out of ${K.num(N.policies!.n)} in the whole country. ${top5.slice(1).map((s) => s.name).join(', ')} come next. Together the five hold ${K.pct(top5Share, 0)} of all single-family policies in the federal program.` },
    { q: 'Does my state set the price of my flood policy?', a: `No. The federal program has one rating method for the whole country, applied to each building's own location, elevation, foundation and rebuilding cost. States regulate private flood insurers, not the federal policy. Two houses in the same state can therefore pay very different amounts, and the state median is only a starting point.` },
    { q: 'Why is my bill far above my state median?', a: `Because a median sits in the middle: half the policies cost more. A house near the coast or a river, with a low first floor, a basement or a high rebuilding cost will pay well above the state's median, and so will a second home, which carries a higher surcharge and climbs ${K.pct(K.P.caps.higher, 0)} a year rather than ${K.pct(K.P.caps.standard, 0)}.` },
  ],
  tool: 'state',
  related: ['home', 'how-much-is-flood-insurance', 'flood-insurance-rate-increase', 'average-flood-insurance-claim'],
  sources: ['openfema_policies', 'fema_sfh_cost', 'usc_4015', 'fema_pricing'],
});
