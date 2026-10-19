import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('oregon');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const pick = (name: string) => st.topCounties.find((c) => c.name === name);
const lane = pick('Lane County');
const tilla = pick('Tillamook County');
const clatsop = pick('Clatsop County');
const lincoln = pick('Lincoln County');
const clack = pick('Clackamas County');
const mult = pick('Multnomah County');
const coast = [tilla, clatsop, lincoln].reduce((s, c) => s + (c?.pol?.n ?? 0), 0);
const cut = st.ranges[3]?.lo ?? 0;
const high = st.ranges.filter((r) => r.lo >= cut).reduce((s, r) => s + r.share, 0);
const natHigh = N.ranges.filter((r) => r.lo >= cut).reduce((s, r) => s + r.share, 0);
const tg = K.glide({ current: tilla?.pol?.median ?? pol.median, full: tilla?.pol?.full ?? pol.full, cap: K.P.caps.standard, fees: K.fees('primary') });

export default defineState({
  slug: 'oregon',
  title: 'Flood Insurance Oregon 2026: Coast Counties Far from Full',
  description: `Flood insurance in Oregon 2026: median bill on ${date}, coast counties far below full-risk price, Willamette Valley costs, tsunami exposure and claims.`,
  intro: `Oregon's ${K.num(pol.n)} single-family flood policies had a median bill of ${K.usd(pol.median)} on ${date}; the coast pays more and will keep rising.`,
  resume: `In Oregon, a single-family federal flood policy had a median yearly bill of ${K.usd(pol.median)} on ${date}, premium, Reserve Fund Assessment, HFIAA surcharge and Federal Policy Fee together, across ${K.num(pol.n)} policies. The full-risk median of the same homes is ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of policies still pay less, so the state is in the middle of its climb. The pressure sits on the Pacific shore. Tillamook, Clatsop and Lincoln counties hold ${K.num(coast)} policies, and in each of them at least ${K.pct(Math.min(...[tilla, clatsop, lincoln].map((c) => c?.pol?.capped ?? 0)), 0)} are below full price; Tillamook's median bill of ${K.usd(tilla?.pol?.median ?? 0)} compares with a full-risk median of ${K.usd(tilla?.pol?.full ?? 0)}. At ${K.pct(K.P.caps.standard, 0)} a year, a main home at that county median needs ${tg.steps} more renewals to get there. FEMA rated ${K.pct(st.exposure.tsunami, 0)} of Oregon's policies as exposed to tsunami.`,
  body: (h) => `
<h2>Two Oregons on the flood map</h2>
<p>Not every policy is on the open shore. Lane County, around Eugene and Springfield, has the largest count, ${K.num(lane?.pol?.n ?? 0)}, at a median bill of ${K.usd(lane?.pol?.median ?? 0)}. Multnomah County, which includes Portland, is cheaper and almost at full price: ${K.usd(mult?.pol?.median ?? 0)} paid against ${K.usd(mult?.pol?.full ?? 0)}. FEMA's model prices both well below Tillamook, Clatsop and Lincoln counties.</p>
<p>On the Pacific shore the numbers change. Lincoln County, home to Newport and Lincoln City, had a median bill of ${K.usd(lincoln?.pol?.median ?? 0)} and a full-risk median of ${K.usd(lincoln?.pol?.full ?? 0)}. Clatsop County, where the USGS gauges the Columbia River at its mouth near Astoria, showed ${K.usd(clatsop?.pol?.median ?? 0)} against ${K.usd(clatsop?.pol?.full ?? 0)}. FEMA's 2023 table counts the coastal hazards statewide: ${K.pct(st.exposure.tsunami, 0)} of policies exposed to tsunami and ${K.pct(st.exposure.erosion, 0)} to coastal erosion.</p>
${h.mini('five', { t: 'Five years of bills for a Tillamook County median home', p: ['cur', 'full'], d: { cur: tilla?.pol?.median ?? pol.median, full: tilla?.pol?.full ?? pol.full, use: 'primary' } })}
<h2>An unusual X zone</h2>
<p>In most states, homes outside the mapped floodplain are both cheaper and closer to full price. Oregon's ${K.num(z.X?.n ?? 0)} X-zone policies paid a median ${K.usd(z.X?.median ?? 0)}, but their full-risk median is ${K.usd(z.X?.full ?? 0)}, higher than the ${K.usd(z.A?.full ?? 0)} of the A zones. Under the current method, a low-risk letter on the map does not mean a low price ahead.</p>
<p>The 2023 price bands point the same way. FEMA put ${K.pct(high, 0)} of Oregon's single-family policies at a full-risk cost of ${K.usd(cut)} a year or more, against ${K.pct(natHigh, 0)} of policies nationwide. Those homes are the ones still several renewals away from their final price, and the ${h.a('flood-insurance-rate-increase', 'rate increase guide')} shows how the steps add up.</p>
<h2>Few claims, but costly ones</h2>
<p>Oregon paid only ${K.num(st.claims?.n ?? 0)} single-family claims for losses from ${N.claimYears[0]} to ${N.claimYears[1]}, and no single flood event stands out in the file. The median payment, ${K.usd(st.claims?.median ?? 0)}, is still several times the yearly bill. Clackamas County had the most claims, ${K.num(clack?.claims?.n ?? 0)}, at a median of ${K.usd(clack?.claims?.median ?? 0)}. ${st.maxGap?.name ?? 'Another county'} had the widest gap between current and full-risk cost in 2023. For homes bought with a mortgage, the ${h.a('buying-a-house-in-a-flood-zone', 'guide to buying in a flood zone')} covers what a lender checks.</p>
`,
  faqs: [
    { q: 'How much is flood insurance on the Oregon coast?', a: `In Tillamook County the median single-family bill was ${K.usd(tilla?.pol?.median ?? 0)} on ${date}; in Clatsop County ${K.usd(clatsop?.pol?.median ?? 0)}; in Lincoln County ${K.usd(lincoln?.pol?.median ?? 0)}. Their full-risk medians are roughly double those figures, and most policies there are still capped, so yearly increases are expected to continue for several renewals.` },
    { q: 'Why do flood bills keep rising in Tillamook County, Oregon?', a: `Because most of them have not reached full price. On ${date}, ${K.pct(tilla?.pol?.capped ?? 0, 0)} of Tillamook County's ${K.num(tilla?.pol?.n ?? 0)} single-family policies paid less than their full-risk premium. The cap limits each yearly rise to ${K.pct(K.P.caps.standard, 0)} for a main home, so a home at the county median needs ${tg.steps} more renewals before increases stop.` },
    { q: 'What does flood insurance cost in Eugene, Oregon?', a: `Lane County, which includes Eugene, had ${K.num(lane?.pol?.n ?? 0)} single-family flood policies on ${date}, more than any other Oregon county. The median bill was ${K.usd(lane?.pol?.median ?? 0)} a year and the median full-risk bill ${K.usd(lane?.pol?.full ?? 0)}; ${K.pct(lane?.pol?.capped ?? 0, 0)} of those policies still pay below full price.` },
  ],
  related: ['flood-insurance-rate-increase', 'buying-a-house-in-a-flood-zone', 'flood-insurance-by-state', 'state:california'],
});
