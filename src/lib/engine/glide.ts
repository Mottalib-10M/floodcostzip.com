/**
 * The road from today's flood premium to the full risk-based price (Risk Rating 2.0 "glide path").
 *
 * Law: 42 U.S.C. 4015(e) caps the yearly increase of the chargeable premium of a policy, 18 % for most
 * policies (25 % for the categories named in params.caps.higher). The fixed charges (Federal Policy Fee,
 * HFIAA surcharge) sit outside the capped amount, so they are taken out before the cap is applied and
 * added back afterwards. When the full-risk price is BELOW today's premium, the decrease is applied at
 * the next renewal at once (FEMA, Risk Rating 2.0: decreases are not phased in).
 *
 * All amounts are yearly totals as printed on a declarations page (premium + assessments + fees).
 */
export interface GlideIn {
  /** Today's total yearly cost of the policy. */
  current: number;
  /** Full risk-based total yearly cost (what FEMA calls the risk-based cost of insurance). */
  full: number;
  /** Yearly cap on the capped part, 0.18 or 0.25. */
  cap: number;
  /** Fixed charges outside the cap (Federal Policy Fee + HFIAA surcharge). */
  fees: number;
  /** Number of renewals to project (default 5). */
  years?: number;
}
export interface GlideYear { year: number; cost: number; capped: boolean }
export interface GlideOut {
  /** Renewals needed before the bill reaches the full-risk price (0 = already there). */
  steps: number;
  /** True when the full-risk price is lower than today's bill. */
  decrease: boolean;
  rows: GlideYear[];
  /** Sum of the next `years` renewals. */
  total: number;
  /** Sum of the same renewals if the full-risk price applied at once. */
  totalAtFull: number;
  /** Increase of the last projected renewal over today's bill. */
  rise: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export function glide({ current, full, cap, fees, years = 5 }: GlideIn): GlideOut {
  const c = Math.max(0, current), f = Math.max(0, full), fee = Math.max(0, Math.min(fees, c, f));
  const base = c - fee, target = f - fee;
  const rows: GlideYear[] = [];
  let steps = 0;
  if (target > base && base > 0 && cap > 0) steps = Math.ceil(Math.log(target / base) / Math.log(1 + cap) - 1e-9);
  else if (target > base && base <= 0) steps = 1;
  let p = base;
  for (let y = 1; y <= years; y++) {
    let capped = false;
    if (target <= p) p = target;
    else { const next = p * (1 + cap); capped = next < target; p = Math.min(next, target); }
    rows.push({ year: y, cost: r2(p + fee), capped });
  }
  const total = r2(rows.reduce((s, r) => s + r.cost, 0));
  return { steps, decrease: f < c, rows, total, totalAtFull: r2(f * years), rise: r2(rows[rows.length - 1].cost - c) };
}

/** Yearly cost after n renewals on the capped path (n = 0 is today's bill). */
export function costAfter(i: GlideIn, n: number): number {
  if (n <= 0) return i.current;
  return glide({ ...i, years: n }).rows[n - 1].cost;
}
