/** llms.txt (RECETTE §21), generated from the page registry. */
import { GUIDES, STATE_PAGES, stateId } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS, label } from '../i18n/nav';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> Flood insurance cost in the United States by ZIP code, county and state, built from the federal flood program's own files: FEMA's single-family cost tables (policies in force on August 31, 2023) and the OpenFEMA policy and claims datasets (median total cost of single-family policies in force, claims paid since 2016). Calculators for the yearly increase cap of 42 U.S.C. 4015(e) (18 % for a main home, 25 % for other buildings), the five-year cost, coverage limits, the 30-day waiting period and flood zones. Independent site published by Radif Partners, not affiliated with FEMA or any insurer; general information, not a quote. This product uses the Federal Emergency Management Agency's OpenFEMA API, but is not endorsed by FEMA. Last updated ${LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...GUIDES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## States', ...STATE_PAGES.map((s) => `- [${label(stateId(s.slug))}](${SITE_URL}${route(stateId(s.slug), 'en')}): ${s.intro}`), '',
    '## About', `- [Where the numbers come from](${SITE_URL}${route('method', 'en')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
