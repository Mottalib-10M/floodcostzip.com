import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('idaho');
const N = K.N;
const date = K.day(N.policiesDate!);
const pol = st.pol!;
const z = st.polByZone;
const co = (name: string) => st.topCounties.find((c) => c.name === name);
const ada = co('Ada County');
const blaine = co('Blaine County');
const canyon = co('Canyon County');
const bonner = co('Bonner County');
const shosh = co('Shoshone County');
const cl = st.claims;
const adaShare = ada?.pol ? K.pct(ada.pol.n / pol.n, 0) : '';
const blaineRatio = blaine?.pol ? K.dec(blaine.pol.full / blaine.pol.median, 1) : '';

export default defineState({
  slug: 'idaho',
  title: 'Flood Insurance Idaho 2026: Boise, Sun Valley, Panhandle',
  description: `Flood insurance in Idaho 2026: the median single-family bill on ${date}, Ada County around Boise, the Blaine County full-risk gap and claims since ${N.claimYears[0]}.`,
  intro: `Idaho has ${K.num(pol.n)} single-family flood policies in the federal program, with a median bill of ${K.usd(pol.median)} on ${date}.`,
  resume: `The median Idaho homeowner with a federal flood policy paid ${K.usd(pol.median)} for the year on ${date}, a total that includes the premium, the Reserve Fund Assessment, the HFIAA surcharge and the Federal Policy Fee. That is almost exactly the national median of ${K.usd(N.policies!.median)}, across a small book of ${K.num(pol.n)} single-family policies. At full risk the state median would be ${K.usd(pol.full)}, and ${K.pct(pol.capped, 0)} of policies still pay less than their full-risk premium. Ada County, which contains Boise, carries ${K.num(ada?.pol?.n ?? 0)} of those policies, about ${adaShare} of the state, at a median of ${K.usd(ada?.pol?.median ?? 0)}. The resort valley of Blaine County is the opposite case: a median bill of ${K.usd(blaine?.pol?.median ?? 0)} against a full-risk median of ${K.usd(blaine?.pol?.full ?? 0)}. Idaho has no storm surge exposure; its claims come from rivers, snowmelt and heavy rain, with a median paid claim of ${K.usd(cl?.median ?? 0)} over ${N.claimYears[0]} to ${N.claimYears[1]}.`,
  body: (h) => `
<h2>Three different Idahos in the price data</h2>
<p>The Treasure Valley, the Wood River Valley and the northern Panhandle each tell a different story. In Ada County the median full-risk bill, ${K.usd(ada?.pol?.full ?? 0)}, is only a little above what owners pay today. Canyon County, west of Boise, is cheaper still: ${K.usd(canyon?.pol?.median ?? 0)} at the median for ${K.num(canyon?.pol?.n ?? 0)} policies, and close to full price already. For most homes around Boise and Nampa, the yearly increases from the cap have little room left.</p>
<p>Blaine County, around Ketchum, Hailey and Sun Valley, is where Idaho's flood bills are furthest from their cost. Its full-risk median is about ${blaineRatio} times the median paid, and ${K.pct(blaine?.pol?.capped ?? 0, 0)} of its ${K.num(blaine?.pol?.n ?? 0)} policies are still below full price. FEMA's 2023 table already listed it as the county with the largest gap in the state. Those owners face several years of increases of up to ${K.pct(K.P.caps.standard, 0)} on the premium of a main home.</p>
<p>In the north, Bonner County (${K.usd(bonner?.pol?.median ?? 0)} at the median) and Shoshone County (${K.usd(shosh?.pol?.median ?? 0)}) pay more than the south, with full-risk medians of ${K.usd(bonner?.pol?.full ?? 0)} and ${K.usd(shosh?.pol?.full ?? 0)}.</p>
<h2>X zones cost more than A zones here</h2>
<p>Idaho reverses the usual order. The ${K.num(z.X?.n ?? 0)} policies in moderate- or low-risk zones had a median bill of ${K.usd(z.X?.median ?? 0)}, above the ${K.usd(z.A?.median ?? 0)} paid by the ${K.num(z.A?.n ?? 0)} policies in high-risk A zones. Under the current pricing method the zone letter is one input among many; the building's value, its distance to the river and its first-floor height weigh more. Claims follow the same pattern: ${K.num(st.claimsByZone.X?.n ?? 0)} of the ${K.num(cl?.n ?? 0)} paid single-family claims were rated in X, B or C zones.</p>
${h.mini('zone', { t: 'Idaho median bill by type of flood zone', p: ['z'], d: { sx: 'idaho', z: 'X' } })}
<h2>A thin claims record</h2>
<p>The federal file holds no single flood event large enough to rank for Idaho over ${N.claimYears[0]} to ${N.claimYears[1]}; the ${K.usd(cl?.total ?? 0)} paid on single-family homes came from many smaller floods. That is a reason to read county figures with care, not a sign that the state does not flood. A new policy still waits ${K.P.waiting.days} days before it covers a flood, so a spring runoff forecast is not the moment to buy one; the ${h.a('flood-insurance-waiting-period', 'waiting period guide')} lists the exceptions. Neighbouring ${h.a('state:nevada', 'Nevada')} has a similar inland profile.</p>
`,
  faqs: [
    { q: 'What does flood insurance cost in Boise, Idaho?', a: `Ada County, which includes Boise, had ${K.num(ada?.pol?.n ?? 0)} single-family flood policies on ${date}, with a median yearly bill of ${K.usd(ada?.pol?.median ?? 0)} and a median full-risk bill of ${K.usd(ada?.pol?.full ?? 0)}. A house near the Boise River usually prices higher than one on higher ground. A licensed agent or insurer can quote an exact premium for a given address.` },
    { q: 'Why are flood policies in Blaine County, Idaho rising faster than elsewhere in the state?', a: `Blaine County homes pay a median ${K.usd(blaine?.pol?.median ?? 0)} a year but would pay ${K.usd(blaine?.pol?.full ?? 0)} at full risk, and ${K.pct(blaine?.pol?.capped ?? 0, 0)} of policies are still below that level. The law lets those premiums rise by up to ${K.pct(K.P.caps.standard, 0)} a year for a main home and ${K.pct(K.P.caps.higher, 0)} for a second home until they reach full price.` },
    { q: 'Is flood insurance worth it in Idaho outside a mapped flood zone?', a: `The data does not answer for one house, but it shows that floods in Idaho are not confined to A zones: from ${N.claimYears[0]} to ${N.claimYears[1]}, ${K.num(st.claimsByZone.X?.n ?? 0)} paid single-family claims were rated in X, B or C zones, and the median paid claim in the state was ${K.usd(cl?.median ?? 0)}. No lender requires a policy in those zones.` },
  ],
  related: ['flood-insurance-by-state', 'flood-zones-explained', 'flood-insurance-waiting-period', 'state:nevada'],
});
