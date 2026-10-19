/**
 * The site's data asset, built by scripts/build-data.py from the federal flood program's own files:
 *  - FEMA "Cost of Flood Insurance for Single-Family Homes" Examples 1 to 4 (policies in force 2023-08-31);
 *  - OpenFEMA FimaNfipPolicies v2 (single-family policies in force on national.policiesDate);
 *  - OpenFEMA FimaNfipClaims v2 (single-family claims with a loss in national.claimYears).
 */
import NAT from '../data/national.json';
import STATES_RAW from '../data/states.json';
import COUNTIES_RAW from '../data/counties.json';

export interface Claims { n: number; avg: number; median: number; total: number; filed: number }
/** OpenFEMA policies in force on N.policiesDate: count, median and average total cost, median full-risk total cost, share still below full risk. */
export interface Pol { n: number; median: number; avg: number; full: number; capped: number }
export interface Exposure { inland: number; surge: number; tsunami: number; greatLakes: number; erosion: number }
export interface Range { lo: number; hi: number | null; pif: number; share: number; rcv: number | null; risk: number | null }
export interface CountyRow { st: string; name: string; pif: number; current: number; risk: number; exposure: Exposure; fips: string | null; slug: string; claims: Claims | null; pol: Pol | null }
export interface StateRow {
  code: string; name: string; slug: string; pif: number; risk: number; current: number; exposure: Exposure;
  aggregated: { pif: number; risk: number; current: number } | null; counties: number;
  topCounties: Array<{ name: string; pif: number; current: number; risk: number; claims: Claims | null; pol: Pol | null }>;
  maxGap: { name: string; current: number; risk: number; pif: number } | null;
  ranges: Range[]; medianRcv: number | null; zips: number;
  claims: Claims | null; events: Array<{ event: string; year: number; n: number; total: number }>;
  claimsByZone: Record<string, { n: number; median: number }>;
  pol: Pol | null; polByZone: Record<string, { n: number; median: number; full: number }>;
}

export const N = NAT as typeof NAT;
export const STATES = STATES_RAW as unknown as StateRow[];
export const COUNTIES = COUNTIES_RAW as unknown as CountyRow[];
export const stateBySlug = (slug: string) => { const s = STATES.find((x) => x.slug === slug); if (!s) throw new Error(`Unknown state ${slug}`); return s; };
export const stateByCode = (code: string) => { const s = STATES.find((x) => x.code === code); if (!s) throw new Error(`Unknown state ${code}`); return s; };
export const countiesOf = (code: string) => COUNTIES.filter((c) => c.st === code);
/** Share of single-family policies whose full risk-based cost is below `cost` (from FEMA Example 1 ranges). */
export function shareBelow(ranges: Range[], cost: number): number {
  const total = ranges.reduce((s, r) => s + r.pif, 0);
  if (!total) return 0;
  let below = 0;
  for (const r of ranges) {
    if (r.hi !== null && cost >= r.hi) below += r.pif;
    else if (cost > r.lo) { const w = r.hi === null ? r.lo : r.hi - r.lo; below += r.pif * Math.min(1, (cost - r.lo) / w); }
  }
  return below / total;
}
/** States ranked on a numeric field (highest first). */
export const rank = (f: (s: StateRow) => number) => [...STATES].sort((a, b) => f(b) - f(a));
export const placeOf = (code: string, f: (s: StateRow) => number) => rank(f).findIndex((s) => s.code === code) + 1;
