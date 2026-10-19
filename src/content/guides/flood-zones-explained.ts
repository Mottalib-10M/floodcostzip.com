import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const N = K.N;
const POL = N.policies!;
const date = K.day(N.policiesDate!);
const year = N.policiesDate!.slice(0, 4);
const Z = POL.zone as Record<string, { n: number; median: number; full: number }>;
const zn = (k: string) => Z[k]?.n ?? 0;
const zm = (k: string) => Z[k]?.median ?? 0;
const zf = (k: string) => Z[k]?.full ?? 0;
const share = (k: string) => zn(k) / POL.n;
const chance = K.pct(K.P.program.zoneAMortgageChance, 0);
const [y0, y1] = N.claimYears;
// Paid single-family claims by zone type, summed over the 50 states and DC.
const CZ: Record<string, number> = {};
for (const s of K.STATES) for (const [k, v] of Object.entries(s.claimsByZone ?? {})) CZ[k] = (CZ[k] ?? 0) + (v?.n ?? 0);
const cTot = Object.values(CZ).reduce((a, b) => a + b, 0) || 1;
const cShare = (k: string) => (CZ[k] ?? 0) / cTot;
const fl = K.S('florida');
const flA = fl.claimsByZone?.A?.median ?? 0, flX = fl.claimsByZone?.X?.median ?? 0, flV = fl.claimsByZone?.V?.median ?? 0;
const tx = K.S('texas');
const txTot = Object.values(tx.claimsByZone ?? {}).reduce((a, v) => a + (v?.n ?? 0), 0) || 1;
const txX = (tx.claimsByZone?.X?.n ?? 0) / txTot;
const vGap = zf('V') / (zm('V') || 1);

export default defineGuide({
  id: 'flood-zones-explained',
  group: 'policy',
  order: 10,
  slug: 'flood-zones-explained',
  nav: 'Flood zones explained',
  card: `What A, V, X, B, C and D mean, and what each zone type paid in ${year}.`,
  title: 'Flood Zones Explained 2026: A, V, X Letters and Their Cost',
  description: `Flood zones explained for 2026: what A, AE, V, VE, X, B, C and D mean on FEMA maps, the 1% yearly chance and the median bill in each zone type on ${date}.`,
  h1: 'Flood zones explained: what each letter on the map means and what it costs',
  intro: `Pick a state and a zone type: the median single-family bill in that zone on ${date}, against the same zone in the whole country.`,
  resume: `A flood zone is the letter FEMA gives an area on its Flood Insurance Rate Map. Zones starting with A or V form the Special Flood Hazard Area, land with at least a 1% chance of flooding in any year, which FEMA translates as a ${chance} chance over a 30-year mortgage. V zones add wave action on the coast. X (shaded) and B mark moderate hazard, X (unshaded) and C minimal hazard, and D an area nobody has studied. Since Risk Rating 2.0 the letter no longer sets the premium, but it still shows in the bills: on ${date}, the median single-family bill was ${K.usd(zm('A'))} in A zones, ${K.usd(zm('V'))} in V zones and ${K.usd(zm('X'))} in X, B and C zones. The low-risk letters are not dry ground either: X zones held ${K.pct(share('X'), 0)} of policies and produced ${K.pct(cShare('X'), 0)} of the single-family claims paid for floods of ${y0} to ${y1}.`,
  body: (h) => `
<h2>Where the letters come from</h2>
<p>Every community in the federal program has a Flood Insurance Rate Map, drawn by FEMA from river and coastal studies. The map splits the land into zones, each named by a letter or a short code defined in ${h.src('cfr_64_3', '44 CFR 64.3')}. The letters answer two questions: how often water is expected to reach the area, and whether the water arrives with breaking waves. The ${h.src('fema_zones', 'FEMA glossary')} groups them into three families: high hazard (the Special Flood Hazard Area, or SFHA), moderate hazard and minimal hazard, plus one family for land never studied.</p>
<p>The SFHA is the area a flood with a 1% chance of being equaled or exceeded in a given year would cover. That flood is the base flood, often called the 100-year flood, a name that misleads: it can happen two years running. Over the 30 years of a typical mortgage, FEMA puts the chance of at least one such flood at ${chance}.</p>

<h2>The A zones: rivers, lakes and sheltered coast</h2>
<p>A zones are high-hazard areas without breaking waves. The plain letter A means FEMA mapped the flood extent without computing a water height. AE (and the older A1 to A30) adds a base flood elevation, the height water is expected to reach, which lets an insurer compare it with the floor of the house. AO marks shallow water, one to three feet deep, or flow paths that cannot be predicted; AH marks the same shallow depths with a computed water elevation. A99 is an area behind a levee or dam still being built but far enough along to count for insurance. AR is an area whose levee lost its accreditation and is being restored.</p>
<p>A zones carry most of the program: ${K.num(zn('A'))} single-family policies on ${date}, ${K.pct(share('A'), 0)} of the total, with a median bill of ${K.usd(zm('A'))}.</p>

<h2>The V zones: the coastal high hazard area</h2>
<p>V and VE zones are the coastal high hazard area: land reached by tidal floods with velocity, where the water moves and strikes rather than only rises. VE has a computed elevation, plain V does not. The price follows that exposure. Only ${K.num(zn('V'))} single-family policies sit in V zones, yet their median bill, ${K.usd(zm('V'))}, is the highest of any zone type, and the same policies at their full-risk price would have a median of ${K.usd(zf('V'))}, ${K.dec(vGap, 1)} times the current one. Many V-zone bills still have years of capped increases ahead.</p>

<h2>X, B, C and D: outside the high-hazard line</h2>
<p>X (shaded), formerly B, covers land between the 1% and the 0.2% annual chance flood, the so-called 500-year flood, and areas of future-conditions flood hazard. X (unshaded), formerly C, is land above the 0.2% flood. Older maps still print B and C, and the policy file groups them with X. Zone D means the hazard is possible but no flood hazard analysis was done.</p>
<p>On ${date}, ${K.num(zn('X'))} single-family policies were in X, B or C zones, with a median bill of ${K.usd(zm('X'))}. Those owners buy without a lender forcing them, which is why the median is close to its full-risk level (${K.usd(zf('X'))}): few of these policies were ever deeply discounted.</p>

<h2>What the zone decides, and what it no longer does</h2>
<p>Under ${h.src('fema_pricing', 'Risk Rating 2.0')}, FEMA prices each building from its own distance to water, flood types, elevation and rebuilding cost, so two houses on either side of a zone line can pay nearly the same, and two houses in the same AE zone can pay very different amounts. The zone keeps two roles. It decides whether a federally regulated or insured lender must require a policy, explained on the ${h.a('is-flood-insurance-required', 'flood insurance requirement page')}. And a new map that moves a building into an A or V zone opens a short window with a one-day wait and a Newly Mapped discount.</p>
${h.table(['Zone type', `Policies ${year}`, 'Share', `Median bill ${year}`, 'Full-risk median', `Paid claims ${y0} to ${y1}`], (['A', 'V', 'X'] as const).map((k) => [k === 'X' ? 'X, B, C' : k, K.num(zn(k)), K.pct(share(k), 0), K.usd(zm(k)), K.usd(zf(k)), K.num(CZ[k] ?? 0)]), `Single-family homes. Policies in force on ${date} (OpenFEMA); claims with a loss in ${y0} to ${y1}, 50 states and DC. Zone as recorded on the policy or the claim.`, ['l', 'r', 'r', 'r', 'r', 'r'])}

<h2>Where the claims come from</h2>
<p>Read the last column against the second. A zones hold ${K.pct(share('A'), 0)} of the policies and ${K.pct(cShare('A'), 0)} of the paid claims, which fits their higher hazard. X zones hold ${K.pct(share('X'), 0)} of the policies and still ${K.pct(cShare('X'), 0)} of the claims. The share swings by state: in ${h.a('state:texas', 'Texas')}, X zones produced ${K.pct(txX, 0)} of the paid single-family claims. Claim size depends on the zone too. In ${h.a('state:florida', 'Florida')}, the median paid claim was ${K.usd(flA)} in A zones, ${K.usd(flV)} in V zones and ${K.usd(flX)} in X zones.</p>
${h.mini('claims', { t: 'Median claim against your bill, by state', p: ['sx', 'cur'], d: { sx: 'texas' } })}
<p>To see the zone mix of one place, the ${h.a('home', 'ZIP code lookup')} gives the median bill of a ZIP or county; ${h.src('floodsmart_zones', 'FloodSmart')} explains how to find the zone printed for an address.</p>
`,
  faqs: [
    { q: 'What is the difference between zone A and zone AE?', a: `Both are high-hazard areas without wave action, inside the Special Flood Hazard Area. In zone A, FEMA mapped where the 1% annual chance flood reaches but did not compute how high the water rises. In zone AE, it published a base flood elevation, which lets an insurer compare the expected water height with the lowest floor of the building.` },
    { q: 'What does a 1% annual chance flood mean over a mortgage?', a: `It means a flood that has one chance in a hundred of being reached or exceeded in any year. The yearly odds add up: FEMA puts the chance of at least one such flood during a 30-year mortgage at ${chance}, about one in four. That is why lenders treat the line around the Special Flood Hazard Area as a real boundary.` },
    { q: 'Is zone X shaded a high-risk flood zone?', a: `No. Shaded X, formerly B, is a moderate hazard area between the 1% and the 0.2% annual chance floods, or an area of future-conditions flood hazard. It is outside the Special Flood Hazard Area, so no federal rule makes a lender require flood insurance there. In ${year}, X, B and C zones together paid a median bill of ${K.usd(zm('X'))}.` },
    { q: 'Does my flood zone set my flood insurance premium?', a: `Not any more. Since Risk Rating 2.0, FEMA prices each building from its own location, flood types, elevation and rebuilding cost. The zone shows on the policy and still decides whether a lender must require coverage, but houses in the same zone can pay very different amounts, and houses on both sides of a zone line can pay alike.` },
    { q: 'What is flood zone D?', a: `Zone D marks land where a flood hazard is possible but FEMA has not conducted any flood hazard analysis. It is not part of the Special Flood Hazard Area listed for mandatory purchase in 44 CFR 64.3(b). A federal policy can still be bought there, priced from the building's own characteristics like any other.` },
  ],
  tool: 'zone',
  toolArg: { sx: 'florida', z: 'A' },
  related: ['is-flood-insurance-required', 'buying-a-house-in-a-flood-zone', 'how-much-is-flood-insurance', 'average-flood-insurance-claim'],
  sources: ['fema_zones', 'cfr_64_3', 'floodsmart_zones', 'fema_pricing', 'openfema_policies', 'openfema_claims'],
});
