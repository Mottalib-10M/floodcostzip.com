/**
 * When a new NFIP policy starts to pay: 42 U.S.C. 4013(c) and 44 CFR 61.11 (params.waiting).
 * Situations: a voluntary purchase (30 days), a purchase made with a mortgage loan being made,
 * increased, extended or renewed (no wait when paid by closing), a purchase within 13 months of a
 * flood map revision that puts the building in a high-risk area (1 day).
 */
import P from '../../data/params-2026.json';

export type Situation = 'standard' | 'loan' | 'map';
export interface WaitOut { days: number; covered: boolean; gap: number; rule: string }

export function waitDays(s: Situation): number {
  return s === 'loan' ? P.waiting.loanDays : s === 'map' ? P.waiting.mapRevisionDays : P.waiting.days;
}

/** Is a flood `daysAway` days after the purchase covered? (A flood that starts before the policy is not.) */
export function waiting(s: Situation, daysAway: number): WaitOut {
  const days = waitDays(s);
  const d = Math.max(0, Math.floor(daysAway));
  const rule = s === 'loan' ? 'Bought with a mortgage loan: starts at closing' : s === 'map' ? `Map revision within ${P.waiting.mapRevisionMonths} months: ${days}-day wait` : `Standard ${days}-day wait`;
  return { days, covered: d >= days, gap: Math.max(0, days - d), rule };
}
