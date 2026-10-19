/**
 * What an NFIP residential policy pays on a large loss, and what stays with the owner.
 * Limits: 42 U.S.C. 4013(b) (params.limits). One deductible applies to the building and one to the
 * contents. Contents are paid at actual cash value; a building is paid at replacement cost only for a
 * primary residence insured to at least 80 % of its replacement cost (Standard Flood Insurance Policy,
 * Dwelling Form, 44 CFR Part 61 Appendix A(1)), which the inputs leave to the reader.
 */
import P from '../../data/params-2026.json';

export interface CoverIn {
  /** Building damage (or rebuild cost on a total loss). */
  building: number;
  /** Damaged belongings. */
  contents: number;
  /** Building coverage bought (capped at the legal limit). */
  bCov?: number;
  /** Contents coverage bought (capped at the legal limit). */
  cCov?: number;
  /** Deductible per coverage. */
  deductible: number;
}
export interface CoverOut { buildingPaid: number; contentsPaid: number; paid: number; uncovered: number; bLimit: number; cLimit: number; overLimit: number }

export function cover({ building, contents, bCov, cCov, deductible }: CoverIn): CoverOut {
  const bLimit = Math.min(bCov ?? P.limits.building, P.limits.building);
  const cLimit = Math.min(cCov ?? P.limits.contents, P.limits.contents);
  const b = Math.max(0, building), c = Math.max(0, contents), d = Math.max(0, deductible);
  // The deductible comes off the loss, then the coverage limit caps what is paid.
  const buildingPaid = bLimit > 0 ? Math.min(Math.max(0, b - d), bLimit) : 0;
  const contentsPaid = cLimit > 0 ? Math.min(Math.max(0, c - d), cLimit) : 0;
  const paid = buildingPaid + contentsPaid;
  const overLimit = Math.max(0, b - d - bLimit) + Math.max(0, c - d - cLimit);
  return { buildingPaid, contentsPaid, paid, uncovered: Math.max(0, b + c - paid), bLimit, cLimit, overLimit };
}
