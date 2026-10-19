import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ga = K.S('georgia');
const N = K.N;
const day = K.day(N.policiesDate!);
const book = ga.pol!;
const zA = ga.polByZone.A;
const zX = ga.polByZone.X;
const county = (name: string) => ga.topCounties.find((c) => c.name === name);
const chatham = county('Chatham County');
const glynn = county('Glynn County');
const fulton = county('Fulton County');
const cobb = county('Cobb County');
const dekalb = county('DeKalb County');
const metro = [fulton, cobb, dekalb].reduce((s, c) => s + (c?.pol?.n ?? 0), 0);
const coastSix = ['Chatham County', 'Glynn County', 'Bryan County', 'Camden County', 'Liberty County'].reduce((s, n) => s + (county(n)?.pol?.n ?? 0), 0);
const irma = ga.events[0];
const helene = ga.events.find((e) => e.event === 'Hurricane Helene');
const matthew = ga.events.find((e) => e.event === 'Hurricane Matthew');

export default defineState({
  slug: 'georgia',
  title: 'Flood Insurance Georgia 2026: Savannah Coast to Atlanta',
  description: `Georgia flood insurance 2026: median single-family bill by county and ZIP on ${day}, the Savannah and Brunswick coast, metro Atlanta, claims from Irma.`,
  intro: `Georgia's ${K.num(book.n)} single-family flood policies had a median yearly bill of ${K.usd(book.median)} on ${day}.`,
  resume: `The typical Georgia homeowner with federal flood coverage paid ${K.usd(book.median)} a year on ${day}, the median total bill (premium, Reserve Fund Assessment, HFIAA surcharge and policy fee) of ${K.num(book.n)} single-family policies. Most of that book is in a handful of counties: Chatham County, home to Savannah, holds ${K.num(chatham?.pol?.n ?? 0)} policies, and Chatham, Glynn, Bryan, Camden and Liberty counties together hold ${K.num(coastSix)}, about ${K.pct(coastSix / book.n, 0)} of the total. Georgia bills sit closer to full risk than the national picture: the median full-risk bill is ${K.usd(book.full)}, and ${K.pct(book.capped, 0)} of policies remain below their full-risk premium, against ${K.pct(N.policies!.capped, 0)} nationwide. In X zones the median bill of ${K.usd(zX?.median ?? 0)} is almost at its full-risk level of ${K.usd(zX?.full ?? 0)}; in A zones the median of ${K.usd(zA?.median ?? 0)} still has room to rise toward ${K.usd(zA?.full ?? 0)}. Paid single-family claims from ${N.claimYears[0]} to ${N.claimYears[1]} numbered ${K.num(ga.claims?.n ?? 0)}, with a median of ${K.usd(ga.claims?.median ?? 0)}.`,
  body: (h) => `
<h2>A book concentrated in a few counties</h2>
<p>FEMA's 2023 data put ${K.pct(ga.exposure.surge, 0)} of the state's single-family policies within reach of storm surge. In Chatham County the median bill was ${K.usd(chatham?.pol?.median ?? 0)}; in Glynn County, which includes Brunswick, it was ${K.usd(glynn?.pol?.median ?? 0)}.</p>
<p>Those two counties also lead the claims file. Chatham recorded ${K.num(chatham?.claims?.n ?? 0)} paid single-family claims over ${N.claimYears[0]} to ${N.claimYears[1]} and Glynn ${K.num(glynn?.claims?.n ?? 0)}. ${irma ? `${irma.event} in ${irma.year} paid ${K.num(irma.n)} claims statewide, ${K.usd(irma.total)} in all` : 'Hurricane claims dominate the list'}${matthew ? `, ahead of ${matthew.event} (${matthew.year}, ${K.num(matthew.n)} claims)` : ''}.</p>
${h.mini('zone', { t: 'Georgia median bill by kind of flood zone', p: ['z'], d: { sx: 'georgia', z: 'A' } })}
<h2>Metro Atlanta: fewer policies, larger losses</h2>
<p>Fulton, Cobb and DeKalb counties hold ${K.num(metro)} policies between them, a small fraction of the five-county total of ${K.num(coastSix)}. The median paid claim in Fulton County was ${K.usd(fulton?.claims?.median ?? 0)} and in Cobb ${K.usd(cobb?.claims?.median ?? 0)}, both above Chatham's ${K.usd(chatham?.claims?.median ?? 0)}. Bills in the metro are lower, ${K.usd(fulton?.pol?.median ?? 0)} at the median in Fulton, and close to full risk. DeKalb County, which shares Atlanta with Fulton, had ${K.num(dekalb?.pol?.n ?? 0)} policies at a median of ${K.usd(dekalb?.pol?.median ?? 0)}, and Cobb County ${K.num(cobb?.pol?.n ?? 0)} at ${K.usd(cobb?.pol?.median ?? 0)}. For an owner in these three counties, the yearly bill is modest next to the size of a typical paid claim.</p>
<p>${helene ? `${helene.event} (${helene.year}) made landfall in the Florida Big Bend and then crossed Georgia, according to the ${h.ext('https://www.nhc.noaa.gov/data/tcr/AL092024_Helene.pdf', 'National Hurricane Center report')}, and paid ${K.num(helene.n)} single-family claims, ${K.usd(helene.total)} in total.` : ''} FEMA's 2023 table rates every Georgia policy as exposed to inland flooding, whatever its surge exposure.</p>
<h2>Where bills still have to climb</h2>
<p>Half of Chatham's policies (${K.pct(chatham?.pol?.capped ?? 0, 0)}) remain below full risk, more than in Fulton (${K.pct(fulton?.pol?.capped ?? 0, 0)}). The largest county gap in the 2023 tables was in Habersham County, where a small group of ${K.num(ga.maxGap?.pif ?? 0)} policies paid ${K.usd(ga.maxGap?.current ?? 0)} at the median against a full-risk figure of ${K.usd(ga.maxGap?.risk ?? 0)}. The ${h.a('flood-insurance-rate-increase', 'rate increase guide')} explains how the ${K.pct(K.P.caps.standard, 0)} yearly cap closes such a gap, and the county table below gives each county's own numbers.</p>
`,
  faqs: [
    { q: 'How much is flood insurance in Savannah, Georgia?', a: `Savannah lies in Chatham County, where the median single-family flood bill was ${K.usd(chatham?.pol?.median ?? 0)} a year on ${day}, across ${K.num(chatham?.pol?.n ?? 0)} federal policies. The county's median full-risk bill was ${K.usd(chatham?.pol?.full ?? 0)}. Two houses in the same county can pay very different amounts, so the ZIP lookup gives a closer median.` },
    { q: 'Is flood insurance cheaper in Atlanta than on the Georgia coast?', a: `At the median, yes. Fulton County's single-family bill was ${K.usd(fulton?.pol?.median ?? 0)} on ${day} and Cobb County's ${K.usd(cobb?.pol?.median ?? 0)}, below Glynn County's ${K.usd(glynn?.pol?.median ?? 0)}. Metro claims, though, have a higher median: ${K.usd(fulton?.claims?.median ?? 0)} in Fulton over ${N.claimYears[0]} to ${N.claimYears[1]}, against ${K.usd(chatham?.claims?.median ?? 0)} in Chatham County.` },
    { q: 'How many Georgia flood claims came from Hurricane Irma?', a: `${irma ? `The federal program paid ${K.num(irma.n)} Georgia single-family claims for ${irma.event} in ${irma.year}, ${K.usd(irma.total)} for buildings and contents.` : 'Irma is the largest event in the Georgia file.'} That is about ${K.pct((irma?.n ?? 0) / (ga.claims?.n ?? 1), 0)} of the ${K.num(ga.claims?.n ?? 0)} single-family claims paid in the state from ${N.claimYears[0]} to ${N.claimYears[1]}, the largest share of any single event.` },
  ],
  related: ['flood-insurance-by-state', 'flood-zones-explained', 'flood-insurance-rate-increase', 'state:south-carolina'],
});
