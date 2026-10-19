/**
 * The calculators of the site, one entry per subject (declarative, rendered by components/calc/SpecTool.tsx
 * and MiniSim.tsx). Every rule comes from params-2026.json through the engine; every local figure comes
 * from src/data/state-lite.json, built by scripts/build-data.py. Nothing heavy is imported here: this
 * file ships to the browser.
 */
import P from '../data/params-2026.json';
import LITE from '../data/state-lite.json';
import NAT from '../data/national.json';
import type { ToolSpec, V, Input } from './tool-types';
import { formatMoney, formatPercent, formatNumber } from './format';
import { glide } from './engine/glide';
import { cover } from './engine/coverage';
import { waiting, type Situation } from './engine/waiting';

export const usd = (x: number) => `${x < -0.5 ? '-' : ''}${formatMoney(Math.abs(Math.round(x)), 0)}`;
export const pct = (x: number, d = 1) => formatPercent(x, d);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k]);

interface Lite { c: string; n: string; s: string; cur: number; risk: number; pif: number; pol: number | null; polN: number | null; full: number | null; capped: number | null; zone: Record<string, number>; cl: [number, number]; rg: Array<[number, number | null, number]> }
export const LITE_STATES = LITE as unknown as Lite[];
const ST = (slug: string) => LITE_STATES.find((x) => x.s === slug) ?? LITE_STATES.find((x) => x.s === 'texas')!;
const STATE_OPTIONS = LITE_STATES.map((x) => ({ value: x.s, label: x.n }));
const stateIn = (def = 'texas'): Input => ({ kind: 'select', id: 'sx', label: 'State', def, options: STATE_OPTIONS });
const POL = NAT.policies!;

/** Fixed charges left outside the yearly cap, for a main home or another building. */
export const fixedFees = (use: string) => P.fees.federalPolicyFee[use === 'primary' ? 'primary' : 'other'] + P.fees.hfiaa[use === 'primary' ? 'primary' : 'other'];
export const capOf = (use: string) => (use === 'primary' ? P.caps.standard : P.caps.higher);
const USE: Input = { kind: 'choice', id: 'use', label: 'The insured home is', def: 'primary', options: [{ value: 'primary', label: 'Main home' }, { value: 'other', label: 'Second home or rental' }] };
const renewals = (k: number) => (k === 1 ? '1 renewal' : `${k} renewals`);

function glideCard(v: V, main: 'steps' | 'total') {
  const use = s(v, 'use') || 'primary';
  const cap = capOf(use);
  const g = glide({ current: n(v, 'cur'), full: n(v, 'full'), cap, fees: fixedFees(use), years: 5 });
  const value = main === 'total' ? usd(g.total) : g.decrease ? 'Lower at renewal' : g.steps === 0 ? 'Already at full price' : renewals(g.steps);
  const label = main === 'total' ? 'Your next five flood bills, added up' : 'Renewals before your bill reaches the full-risk price';
  const sub = g.decrease
    ? `The full-risk price is below today's bill: it applies at the next renewal, ${usd(g.rows[0].cost)} a year.`
    : main === 'total' ? `${g.steps === 0 ? 'No increase left on the cap' : `${renewals(g.steps)} at up to ${pct(cap, 0)} a year before the full-risk price`}; in year five you pay ${usd(g.rows[4].cost)}.`
      : `Increases of up to ${pct(cap, 0)} a year on the capped part. Next five bills: ${usd(g.total)} in total.`;
  return {
    label, value, sub,
    rows: [...g.rows.map((r) => [`Renewal ${r.year}${r.capped ? ' (capped)' : ''}`, usd(r.cost), r.cost] as [string, string, number]), ['Five years at the full-risk price at once', usd(g.totalAtFull)]],
    note: `Fixed charges kept outside the cap: ${usd(fixedFees(use))} a year (Federal Policy Fee and HFIAA surcharge). Rates FEMA sets each year can move the full-risk price itself.`,
  };
}

export const SPECS: Record<string, (arg?: Record<string, number | string>) => ToolSpec> = {
  /* Today's bill to the full-risk price: number of 18 % (or 25 %) steps */
  glide: () => ({
    inputs: [
      { id: 'cur', label: 'Your flood bill today', def: POL.median, unit: '$', max: 100000, help: 'Total yearly cost on your declarations page' },
      { id: 'full', label: 'Full risk-based price', def: POL.full, unit: '$', max: 100000, help: 'On your declarations page, or use your ZIP median' },
      USE,
    ],
    run: (v) => glideCard(v, 'steps'),
  }),
  /* Same engine, the five-year total in front */
  five: () => ({
    inputs: [
      { id: 'cur', label: 'Your flood bill today', def: POL.median, unit: '$', max: 100000, help: 'Premium, assessments and fees' },
      { id: 'full', label: 'Full risk-based price', def: POL.full, unit: '$', max: 100000, help: 'National median by default' },
      USE,
    ],
    run: (v) => glideCard(v, 'total'),
  }),
  /* A state's medians: what single-family policyholders pay, the full-risk median, the gap */
  state: () => ({
    inputs: [stateIn(), { id: 'cur', label: 'Your flood bill today (0 = state median)', def: 0, unit: '$', max: 100000, help: 'Leave at 0 to use the state median' }],
    run: (v) => {
      const x = ST(s(v, 'sx'));
      const today = n(v, 'cur') || x.pol || x.cur;
      const full = x.full || x.risk;
      const g = glide({ current: today, full, cap: P.caps.standard, fees: fixedFees('primary'), years: 5 });
      return {
        label: `Single-family flood policies in ${x.n}`, value: usd(x.pol ?? x.cur), sub: `Median yearly cost of the ${formatNumber(x.polN ?? x.pif, 0)} policies in force on ${NAT.policiesDate ? longDate(NAT.policiesDate) : ''}.`,
        rows: [
          ['Median full-risk price, same policies', usd(full), full], ['Still below their full-risk price', x.capped !== null ? pct(x.capped, 0) : 'n/a'], ['Median paid in August 2023', usd(x.cur), x.cur],
          ['Gap left from the bill entered', g.decrease || g.steps === 0 ? 'none' : `${renewals(g.steps)} at ${pct(P.caps.standard, 0)}`], ['Next five bills from that bill', usd(g.total)],
        ],
        note: 'Medians of single-family homes; your own premium depends on the building, not on the state.',
      };
    },
  }),
  /* What a single-family policy costs in each type of flood zone, by state */
  zone: () => ({
    inputs: [stateIn('florida'), { kind: 'choice', id: 'z', label: 'Flood zone on the policy', def: 'A', options: [{ value: 'A', label: 'A zones' }, { value: 'V', label: 'V zones' }, { value: 'X', label: 'X, B or C' }] }],
    run: (v) => {
      const x = ST(s(v, 'sx')), z = s(v, 'z');
      const local = x.zone[z];
      const nat = (POL.zone as Record<string, { n: number; median: number }>)[z]?.median ?? 0;
      return {
        label: `Median yearly cost, ${z === 'X' ? 'X, B and C zones' : `${z} zones`}, ${x.n}`, value: local ? usd(local) : 'Too few policies',
        sub: local ? `Single-family policies in force on ${longDate(NAT.policiesDate!)}, OpenFEMA.` : 'Fewer than ten single-family policies in this zone type in this state.',
        rows: [['Same zone type, whole country', usd(nat), nat], ...(['A', 'V', 'X'] as const).filter((k) => k !== z && x.zone[k]).map((k) => [`${k === 'X' ? 'X, B, C' : k} zones in ${x.n}`, usd(x.zone[k]), x.zone[k]] as [string, string, number])],
        note: 'The zone no longer sets the price under Risk Rating 2.0; it still decides whether a lender must require a policy.',
      };
    },
  }),
  /* Median paid claim against the yearly bill */
  claims: () => ({
    inputs: [stateIn('louisiana'), { id: 'cur', label: 'Your flood bill today', def: POL.median, unit: '$', max: 100000 }],
    run: (v) => {
      const x = ST(s(v, 'sx'));
      const [cn, cm] = x.cl;
      const yearsOf = n(v, 'cur') > 0 ? cm / n(v, 'cur') : 0;
      return {
        label: `Median single-family claim paid in ${x.n}, ${NAT.claimYears[0]} to ${NAT.claimYears[1]}`, value: usd(cm),
        sub: `${formatNumber(cn, 0)} paid claims on single-family homes over those ten years (building and contents).`,
        rows: [['Years of the bill entered that one median claim equals', formatNumber(Math.round(yearsOf), 0)], ['Median claim, whole country', usd(NAT.claims.median), NAT.claims.median], ['Average claim, whole country', usd(NAT.claims.avg), NAT.claims.avg]],
        note: 'Amounts as paid, not adjusted for inflation; claims of the last months are still being settled.',
      };
    },
  }),
  /* Where a full-risk price sits among the state's single-family policies */
  rank: () => ({
    inputs: [stateIn('new-jersey'), { id: 'cost', label: 'Full risk-based price quoted', def: 1500, unit: '$', max: 100000 }],
    run: (v) => {
      const x = ST(s(v, 'sx')), c = n(v, 'cost');
      const total = x.rg.reduce((a, r) => a + r[2], 0);
      let below = 0;
      for (const [lo, hi, pif] of x.rg) { if (hi !== null && c >= hi) below += pif; else if (c > lo) below += pif * Math.min(1, (c - lo) / ((hi ?? lo + 1000) - lo)); }
      const sh = total ? below / total : 0;
      const under1k = x.rg.filter((r) => r[1] !== null && r[1] <= 1000).reduce((a, r) => a + r[2], 0);
      return {
        label: `Single-family homes in ${x.n} with a lower full-risk price`, value: pct(sh, 0),
        sub: `Among the ${formatNumber(total, 0)} policies FEMA priced in August 2023.`,
        rows: [['Full-risk price under $1,000', pct(total ? under1k / total : 0, 0)], ['State median full-risk price, 2023 rates', usd(x.risk), x.risk], ['Price entered', usd(c), c]],
      };
    },
  }),
  /* Waiting period before a new policy pays */
  waiting: () => ({
    inputs: [
      { kind: 'select', id: 'sit', label: 'How you buy the policy', def: 'standard', options: [{ value: 'standard', label: 'On your own, no loan involved' }, { value: 'loan', label: 'At a mortgage closing or refinance' }, { value: 'map', label: `Within ${P.waiting.mapRevisionMonths} months of a map change` }], wide: true },
      { id: 'days', label: 'Days between purchase and the flood', def: 10, unit: 'days', max: 3650 },
    ],
    run: (v) => {
      const w = waiting(s(v, 'sit') as Situation, n(v, 'days'));
      return {
        label: 'Would the policy pay for that flood?', value: w.covered ? 'Yes' : 'No',
        sub: w.covered ? `The policy is in effect after ${w.days === 0 ? 'closing' : `${w.days} ${w.days === 1 ? 'day' : 'days'}`}.` : `It starts ${w.gap} ${w.gap === 1 ? 'day' : 'days'} too late for this flood.`,
        rows: [['Rule applied', w.rule], ['Waiting period', `${w.days} ${w.days === 1 ? 'day' : 'days'}`]],
        note: 'A flood already under way when the policy starts is not covered, even after the wait.',
      };
    },
  }),
  /* What the policy pays on a big loss */
  coverage: () => ({
    inputs: [
      { id: 'b', label: 'Damage to the building', def: 300000, unit: '$', max: 5000000, help: 'Repair or rebuild cost' },
      { id: 'c', label: 'Damage to belongings', def: 60000, unit: '$', max: 2000000 },
      { id: 'd', label: 'Deductible (each coverage)', def: P.deductibles.residentialDefault, unit: '$', max: P.deductibles.residentialMax, adv: true },
    ],
    run: (v) => {
      const r = cover({ building: n(v, 'b'), contents: n(v, 'c'), deductible: n(v, 'd') });
      return {
        label: 'The federal policy would pay', value: usd(r.paid), sub: `You keep ${usd(r.uncovered)} of the loss.`,
        rows: [['Building, up to ' + usd(r.bLimit), usd(r.buildingPaid), r.buildingPaid], ['Belongings, up to ' + usd(r.cLimit), usd(r.contentsPaid), r.contentsPaid], ['Above the legal limits', usd(r.overLimit), r.overLimit], ['Deductibles', usd(Math.min(n(v, 'b'), n(v, 'd')) + Math.min(n(v, 'c'), n(v, 'd')))]],
        note: 'Belongings are paid at depreciated value; basements and items outside the house have narrower cover.',
      };
    },
  }),
  /* NFIP glide path against a private quote */
  private: () => ({
    inputs: [
      { id: 'cur', label: 'Federal policy today', def: POL.median, unit: '$', max: 100000 },
      { id: 'full', label: 'Its full risk-based price', def: POL.full, unit: '$', max: 100000 },
      { id: 'q', label: 'Private quote, year one', def: 1300, unit: '$', max: 100000 },
      { id: 'g', label: 'Private yearly increase assumed', def: 8, unit: '%', max: 100, decimals: 1, help: 'Your guess: a private insurer has no cap', adv: true },
    ],
    run: (v) => {
      const g = glide({ current: n(v, 'cur'), full: n(v, 'full'), cap: P.caps.standard, fees: fixedFees('primary'), years: 5 });
      let p = n(v, 'q'), priv = 0; const rate = n(v, 'g') / 100;
      for (let y = 0; y < 5; y++) { priv += p; p *= 1 + rate; }
      const diff = priv - g.total;
      return {
        label: diff <= 0 ? 'Private quote cheaper over five years by' : 'Federal policy cheaper over five years by', value: usd(Math.abs(diff)),
        sub: `Federal: ${usd(g.total)} on the ${pct(P.caps.standard, 0)} path. Private: ${usd(priv)} with the increase assumed.`,
        rows: [['Federal, renewal 5', usd(g.rows[4].cost), g.rows[4].cost], ['Private, renewal 5', usd(n(v, 'q') * (1 + rate) ** 4), n(v, 'q') * (1 + rate) ** 4]],
        note: 'Compare the same building and contents limits and deductibles; a private policy can be cancelled or not renewed.',
      };
    },
  }),
  /* Monthly and daily view of a yearly bill */
  monthly: () => ({
    inputs: [{ id: 'cur', label: 'Yearly flood bill', def: POL.median, unit: '$', max: 100000 }, { id: 'cov', label: 'Building coverage bought', def: P.limits.building, unit: '$', max: P.limits.building }],
    run: (v) => {
      const y = n(v, 'cur'), cov = n(v, 'cov');
      return {
        label: 'The same bill per month', value: usd(y / 12), sub: `${usd(y)} a year is ${formatMoney(y / 365, 2)} a day.`,
        rows: [['Per $1,000 of building coverage', cov > 0 ? formatMoney((y / cov) * 1000, 2) : 'n/a'], ['National median, per month', usd(POL.median / 12), POL.median / 12], ['National median, per year', usd(POL.median), POL.median]],
      };
    },
  }),
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const longDate = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}, ${iso.slice(0, 4)}`;

/** A spec with its defaults overridden by `arg` (same keys as the input ids). */
export function getTool(kind: string, arg?: Record<string, number | string>): ToolSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown tool ${kind}`);
  const spec = f(arg);
  if (!arg) return spec;
  return { ...spec, inputs: spec.inputs.map((i) => (arg[i.id] === undefined ? i : ({ ...i, def: arg[i.id] } as typeof i))) };
}
export const TOOL_KINDS = Object.keys(SPECS);
