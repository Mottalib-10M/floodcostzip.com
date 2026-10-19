/**
 * Writing kit (CONTRIBUTING-PAGES.md): every figure written in a page comes from here, never typed by hand.
 *   K.P                 params-2026.json (caps, fees, limits, waiting period, sources)
 *   K.N                 national.json (FEMA medians 2023, OpenFEMA policies 2026, claims 2016-2025)
 *   K.S(slug)           one state of states.json (medians, exposure, cost ranges, counties, claims, events)
 *   K.counties(code)    the county rows of a state (counties.json)
 *   K.tool(kind, args)  runs a calculator of tool-specs.ts and returns its result card
 *   engine              K.glide, K.costAfter, K.cover, K.waiting, K.fees(use), K.cap(use), K.shareBelow, K.place
 *   formats             K.usd, K.pct, K.num, K.dec, K.day (2026-04-30 -> April 30, 2026), K.month
 */
import P from '../data/params-2026.json';
import { N, STATES, stateBySlug, stateByCode, countiesOf, shareBelow, placeOf, rank } from './data';
import { usd, pct, getTool, fixedFees, capOf, longDate } from './tool-specs';
import { formatNumber, formatDecimal } from './format';
import { glide, costAfter } from './engine/glide';
import { cover } from './engine/coverage';
import { waiting, waitDays } from './engine/waiting';
import type { V } from './tool-types';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function tool(kind: string, args: V = {}) {
  const spec = getTool(kind);
  const v: V = { ...Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])), ...args };
  return spec.run(v);
}
export const KIT = {
  P, N, STATES, S: stateBySlug, SC: stateByCode, counties: countiesOf, tool,
  glide, costAfter, cover, waiting, waitDays, fees: fixedFees, cap: capOf, shareBelow, place: placeOf, rank,
  usd, pct, num: (x: number) => formatNumber(x, 0), dec: (x: number, d = 1) => formatDecimal(x, d), day: longDate,
  month: (ym: string) => `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`,
};
export type Kit = typeof KIT;
