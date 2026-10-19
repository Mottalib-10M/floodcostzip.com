/** Engine tests: the 18 % / 25 % path, coverage limits and the waiting period, against the rules of params-2026.json. */
import { describe, expect, it } from 'vitest';
import { glide, costAfter } from '../src/lib/engine/glide';
import { cover } from '../src/lib/engine/coverage';
import { waiting, waitDays } from '../src/lib/engine/waiting';
import { fixedFees, capOf, getTool, TOOL_KINDS } from '../src/lib/tool-specs';
import P from '../src/data/params-2026.json';
import NAT from '../src/data/national.json';

describe('params read on the official texts', () => {
  it('caps, fees, limits, waiting period', () => {
    expect(P.caps.standard).toBe(0.18);
    expect(P.caps.higher).toBe(0.25);
    expect(P.fees.federalPolicyFee.primary).toBe(47);
    expect(P.fees.hfiaa.primary).toBe(25);
    expect(P.fees.hfiaa.other).toBe(250);
    expect(P.limits.building).toBe(250000);
    expect(P.limits.contents).toBe(100000);
    expect(P.deductibles.residentialMax).toBe(10000);
    expect(P.waiting.days).toBe(30);
    expect(P.program.authorizedThrough).toBe('2026-12-11');
    expect(Object.keys(P.sources).length).toBeGreaterThanOrEqual(3);
  });
  it('fixed fees and cap by use', () => {
    expect(fixedFees('primary')).toBe(72);
    expect(fixedFees('other')).toBe(297);
    expect(capOf('primary')).toBe(0.18);
    expect(capOf('other')).toBe(0.25);
  });
});

describe('glide path', () => {
  it('1,000 to 2,000 at 18 % without fees: 5 renewals', () => {
    const g = glide({ current: 1000, full: 2000, cap: 0.18, fees: 0 });
    expect(g.steps).toBe(5);
    expect(g.rows[0].cost).toBe(1180);
    expect(g.rows[3].cost).toBeCloseTo(1938.78, 2);
    expect(g.rows[4].cost).toBe(2000);
    expect(g.rows[4].capped).toBe(false);
  });
  it('fees stay outside the cap', () => {
    const g = glide({ current: 1072, full: 2072, cap: 0.18, fees: 72 });
    expect(g.rows[0].cost).toBe(1252); // 1,000 x 1.18 + 72
    expect(g.steps).toBe(5);
  });
  it('25 % track is shorter', () => {
    expect(glide({ current: 1000, full: 2000, cap: 0.25, fees: 0 }).steps).toBe(4);
  });
  it('a full-risk price below the bill applies at the next renewal', () => {
    const g = glide({ current: 1500, full: 900, cap: 0.18, fees: 72 });
    expect(g.decrease).toBe(true);
    expect(g.steps).toBe(0);
    expect(g.rows.every((r) => r.cost === 900)).toBe(true);
  });
  it('already at full price: flat', () => {
    const g = glide({ current: 1200, full: 1200, cap: 0.18, fees: 72 });
    expect(g.steps).toBe(0);
    expect(g.total).toBe(6000);
  });
  it('exact power of the cap needs exactly that many steps', () => {
    expect(glide({ current: 1000, full: 1000 * 1.18 ** 3, cap: 0.18, fees: 0 }).steps).toBe(3);
  });
  it('costAfter', () => {
    const i = { current: 1000, full: 4000, cap: 0.18, fees: 0 };
    expect(costAfter(i, 0)).toBe(1000);
    expect(costAfter(i, 2)).toBeCloseTo(1392.4, 1);
  });
});

describe('coverage', () => {
  it('a loss above both limits', () => {
    const r = cover({ building: 300000, contents: 60000, deductible: 2000 });
    expect(r.buildingPaid).toBe(250000);
    expect(r.contentsPaid).toBe(58000);
    expect(r.uncovered).toBe(52000);
    expect(r.overLimit).toBe(48000);
  });
  it('a small loss: deductible only', () => {
    const r = cover({ building: 15000, contents: 0, deductible: 1250 });
    expect(r.buildingPaid).toBe(13750);
    expect(r.contentsPaid).toBe(0);
  });
  it('contents-only policy (renter)', () => {
    const r = cover({ building: 0, contents: 30000, bCov: 0, deductible: 1000 });
    expect(r.buildingPaid).toBe(0);
    expect(r.contentsPaid).toBe(29000);
  });
});

describe('waiting period', () => {
  it('30 days, loan closing, map revision', () => {
    expect(waitDays('standard')).toBe(30);
    expect(waiting('standard', 29).covered).toBe(false);
    expect(waiting('standard', 30).covered).toBe(true);
    expect(waiting('loan', 0).covered).toBe(true);
    expect(waiting('map', 1).covered).toBe(true);
    expect(waiting('map', 0).gap).toBe(1);
  });
});

describe('every calculator runs on its defaults', () => {
  for (const k of TOOL_KINDS) it(k, () => {
    const spec = getTool(k);
    const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]));
    const out = spec.run(v);
    expect(out.value).not.toMatch(/NaN|undefined|null/);
    for (const r of out.rows) expect(String(r[1])).not.toMatch(/NaN|undefined|null/);
  });
});

describe('data asset', () => {
  it('FEMA 2023 totals and OpenFEMA policies', () => {
    expect(NAT.pif).toBe(3149679);
    expect(NAT.current).toBe(786);
    expect(NAT.policies!.n).toBeGreaterThan(2_000_000);
    expect(NAT.policies!.full).toBeGreaterThan(NAT.policies!.median);
  });
});
