import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('alaska');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const cz = st.claimsByZone;
const b = (name: string) => st.topCounties.find((x) => x.name === name);
const fair = b('Fairbanks North Star Borough');
const anch = b('Anchorage, Municipality of');
const kenai = b('Kenai Peninsula Borough');
const juneau = b('Juneau, City and Borough of');
const matsu = b('Matanuska-Susitna Borough');
const sitka = b('Sitka, City and Borough of');
const cheaper = [...K.STATES].filter((s) => s.pol && s.pol.median < pol.median).length;
const yearsOfClaim = (st.claims?.median ?? 0) / pol.median;

export default defineState({
  slug: 'alaska',
  title: 'Flood Insurance Alaska 2026: Prices by Borough and Zone',
  description: `Flood insurance in Alaska 2026: median single-family bill on ${date} in Fairbanks, Anchorage, Juneau and Kenai, tsunami exposure and the size of claims.`,
  intro: `Alaska has ${K.num(pol.n)} single-family flood policies, with a median bill of ${K.usd(pol.median)} a year on ${date}.`,
  resume: `Federal flood insurance costs less in Alaska than ${cheaper === 0 ? 'in any other state' : 'in almost any other state'}. The median single-family policy had a yearly cost of ${K.usd(pol.median)} on ${date}, a figure that includes the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee, against ${K.usd(N.policies!.median)} for the whole country. The market is tiny, ${K.num(pol.n)} policies, and the price is settled: the full-risk median is ${K.usd(pol.full)}, and only ${K.pct(pol.capped, 0)} of policies pay less than full risk. A and X zones cost nearly the same, ${K.usd(z.A?.median ?? 0)} and ${K.usd(z.X?.median ?? 0)} at the median. Claims are rare but not small. Only ${K.num(st.claims?.n ?? 0)} single-family claims were paid between ${N.claimYears[0]} and ${N.claimYears[1]}, with a median of ${K.usd(st.claims?.median ?? 0)}, roughly ${K.num(Math.round(yearsOfClaim))} years of the median bill. FEMA rated ${K.pct(st.exposure.tsunami, 0)} of Alaska policies as exposed to tsunami.`,
  body: (h) => `
<h2>Boroughs, not counties</h2>
<p>Alaska has no counties; FEMA's data group its policies by borough, municipality and census area. Fairbanks North Star Borough, on the Chena and Tanana rivers, had ${K.num(fair?.pol?.n ?? 0)} single-family policies at a median of ${K.usd(fair?.pol?.median ?? 0)}. Juneau carried ${K.num(juneau?.pol?.n ?? 0)} at ${K.usd(juneau?.pol?.median ?? 0)}. Anchorage, the largest city, is a smaller flood market with ${K.num(anch?.pol?.n ?? 0)} policies, at ${K.usd(anch?.pol?.median ?? 0)}. The Kenai Peninsula Borough had the highest median of the large areas, ${K.usd(kenai?.pol?.median ?? 0)}, and the Matanuska-Susitna Borough paid ${K.usd(matsu?.pol?.median ?? 0)}. In the Bethel Census Area, in western Alaska, ${K.num(b('Bethel Census Area')?.pol?.n ?? 0)} policies paid a median of ${K.usd(b('Bethel Census Area')?.pol?.median ?? 0)}.</p>
<p>Across these places the median full-risk bill sits within a few dollars of the median paid. Very few owners are on a path of yearly increases, which is unusual: nationally ${K.pct(N.policies!.capped, 0)} of policies are still capped.</p>
<h2>Sitka and the coastal exception</h2>
<p>The one area with a real gap is Sitka. Its ${K.num(sitka?.pol?.n ?? 0)} policies paid a median of ${K.usd(sitka?.pol?.median ?? 0)}, against ${K.usd(sitka?.pol?.full ?? 0)} at full risk, and ${K.pct(sitka?.pol?.capped ?? 0, 0)} were capped. ${st.maxGap?.name?.startsWith('Sitka') ? 'It also showed the widest ratio of full-risk to current cost in FEMA\'s 2023 table.' : ''} V zones, the wave-exposed shore, hold just ${K.num(z.V?.n ?? 0)} Alaska policies, at a median of ${K.usd(z.V?.median ?? 0)}.</p>
<h2>What a claim represents</h2>
<p>Alaska's claim file is too small for any single flood to stand out as a named event. Claims on homes rated X, B or C numbered ${K.num(cz.X?.n ?? 0)}, about as many as the ${K.num(cz.A?.n ?? 0)} on A-zone homes, and their median was higher: ${K.usd(cz.X?.median ?? 0)} against ${K.usd(cz.A?.median ?? 0)}. Small numbers like these move a lot from one year to the next, so a single flood can change the picture. In Juneau, the ${K.num(juneau?.claims?.n ?? 0)} paid claims had a median of ${K.usd(juneau?.claims?.median ?? 0)}.</p>
${h.mini('claims', { t: 'An Alaska median claim in years of premium', p: ['cur'], d: { sx: 'alaska', cur: pol.median } })}
<p>A cheap policy still has the same limits as anywhere else: up to ${K.usd(K.P.limits.building)} for the building and ${K.usd(K.P.limits.contents)} for contents on a single-family home in the Regular Program. FEMA's manual sets higher Emergency Program limits for Alaska, Hawaii, Guam and the U.S. Virgin Islands than for other states, for communities not yet in the Regular Program. The ${h.a('flood-insurance-coverage-limits', 'coverage limits guide')} explains what each part pays.</p>
${h.mini('monthly', { t: 'The Alaska median bill per month', p: ['cur', 'cov'], d: { cur: pol.median, cov: K.P.limits.building } })}
`,
  faqs: [
    { q: 'How much is flood insurance in Fairbanks, Alaska?', a: `In the Fairbanks North Star Borough, ${K.num(fair?.pol?.n ?? 0)} single-family flood policies had a median yearly bill of ${K.usd(fair?.pol?.median ?? 0)} on ${date}, federal charges included. The median full-risk bill was ${K.usd(fair?.pol?.full ?? 0)}, so almost no policy there is on a path of capped increases. A licensed agent can quote a specific house.` },
    { q: 'Why is flood insurance so cheap in Alaska?', a: `The median single-family bill was ${K.usd(pol.median)} on ${date}, and the full-risk median ${K.usd(pol.full)}, so the low price is FEMA's own estimate of the risk, not a discount. Alaska has almost no hurricane surge exposure in FEMA's tables. Claims are few, ${K.num(st.claims?.n ?? 0)} in ten years, though each one can be large.` },
    { q: 'How many Alaska homes are exposed to tsunami flooding?', a: `FEMA's 2023 tables counted ${K.pct(st.exposure.tsunami, 0)} of Alaska's single-family flood policies as exposed to tsunami, against ${K.pct(N.exposure.tsunami, 0)} nationally, the main coastal hazard the model sees in the state; storm surge reached only ${K.pct(st.exposure.surge, 0)}. The exposure is already inside the full-risk price, whose median was ${K.usd(pol.full)} on ${date}.` },
  ],
  related: ['flood-insurance-by-state', 'flood-insurance-coverage-limits', 'average-flood-insurance-claim', 'state:washington'],
});
