/** Every page id the site is meant to have. Content tests accept links to these ids while pages are being
 *  written; the "all planned pages exist" test fails until each has its file. */
import STATES from '../data/states.json';
export const PLANNED_GUIDES = [
  'flood-insurance-by-state', 'how-much-is-flood-insurance', 'flood-insurance-cost-per-month', 'flood-insurance-calculator', 'flood-insurance-rate-increase', 'average-flood-insurance-claim', 'flood-zones-explained',
  'nfip', 'flood-insurance-waiting-period', 'flood-insurance-coverage-limits', 'is-flood-insurance-required',
  'private-flood-insurance', 'buying-a-house-in-a-flood-zone', 'flood-insurance-for-renters', 'flood-insurance-second-home',
];
export const PLANNED_STATES = (STATES as Array<{ slug: string }>).map((s) => s.slug);
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, ...PLANNED_STATES.map((s) => `state:${s}`)]);
