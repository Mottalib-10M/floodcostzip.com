/**
 * The site's main tool: flood insurance cost for a ZIP code, a county or a state, and the road to the
 * full-risk price. First render = the page's defaults (state medians, or the national medians), computed
 * at build time; the ZIP and county tables are fetched from /data/ only after the page is interactive,
 * and a shared link is read after mount (RECETTE §17.5). Nothing typed leaves the browser: the tables
 * are static files, the lookup happens here.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Choice, ResultCard, Rows, ShareRow } from './parts';
import { readParams, updateURL } from '../../lib/url-state';
import { glide } from '../../lib/engine/glide';
import { LITE_STATES, fixedFees, capOf, usd, pct, longDate } from '../../lib/tool-specs';
import { formatNumber } from '../../lib/format';
import NAT from '../../data/national.json';

/** [key, state, pif2023, current2023, risk2023, surgeShare, claimsN, claimsMedian, polN, polMedian, polFullMedian, polCappedShare] */
type Row = [string, string, number, number, number, number, number, number, number, number, number, number];
interface Area { label: string; kind: 'zip' | 'county' | 'state' | 'nation'; pif: number; current: number; risk: number; surge: number | null; clN: number; clMed: number; polN: number; polMed: number; full: number; capped: number }

const natArea = (): Area => ({ label: 'the United States', kind: 'nation', pif: NAT.pif, current: NAT.current, risk: NAT.risk, surge: NAT.exposure.surge, clN: NAT.claims.n, clMed: NAT.claims.median, polN: NAT.policies?.n ?? 0, polMed: NAT.policies?.median ?? 0, full: NAT.policies?.full ?? 0, capped: NAT.policies?.capped ?? 0 });
const stateArea = (code: string): Area => {
  const x = LITE_STATES.find((s) => s.c === code)!;
  return { label: x.n, kind: 'state', pif: x.pif, current: x.cur, risk: x.risk, surge: null, clN: x.cl[0], clMed: x.cl[1], polN: x.polN ?? 0, polMed: x.pol ?? 0, full: x.full ?? 0, capped: x.capped ?? 0 };
};
const rowArea = (r: Row, kind: 'zip' | 'county'): Area => {
  const st = LITE_STATES.find((s) => s.c === r[1]);
  return { label: kind === 'zip' ? `ZIP ${r[0]} (${st?.n ?? r[1]})` : `${r[0]}, ${st?.n ?? r[1]}`, kind, pif: r[2], current: r[3], risk: r[4], surge: r[5], clN: r[6], clMed: r[7], polN: r[8], polMed: r[9], full: r[10] ?? 0, capped: r[11] ?? 0 };
};

interface Props { state?: string; idPrefix?: string; methodHref?: string }

export default function FloodLookup({ state = '', idPrefix = 'lk', methodHref }: Props) {
  const [zip, setZip] = useState('');
  const [st, setSt] = useState(state);
  const [county, setCounty] = useState('');
  const [cur, setCur] = useState(0);
  const [use, setUse] = useState<'primary' | 'other'>('primary');
  const [counties, setCounties] = useState<Row[] | null>(null);
  const [zipRows, setZipRows] = useState<Record<string, Row[]>>({});
  const [zipMsg, setZipMsg] = useState('');
  const loading = useRef<Record<string, boolean>>({});

  // After mount: county table, then the parameters of a shared link.
  useEffect(() => {
    fetch('/data/counties.json').then((r) => r.json()).then((rows: Array<[string, string, ...number[]]>) => setCounties(rows.map((r) => [r[1], r[0], ...r.slice(2)] as unknown as Row))).catch(() => setCounties([]));
    const u = readParams(window.location.search);
    if (u.get('zip')) setZip(u.get('zip')!.replace(/\D/g, '').slice(0, 5));
    if (u.get('st') && LITE_STATES.some((s) => s.c === u.get('st'))) setSt(u.get('st')!);
    if (u.get('county')) setCounty(u.get('county')!);
    if (u.get('cur')) { const f = parseFloat(u.get('cur')!); if (!isNaN(f)) setCur(Math.min(f, 100000)); }
    if (u.get('use') === 'other') setUse('other');
  }, []);
  useEffect(() => updateURL({ zip: zip || undefined, st: st || undefined, county: county || undefined, cur: cur || undefined, use: use === 'other' ? 'other' : undefined }), [zip, st, county, cur, use]);

  // ZIP tables are split by first digit and fetched once each.
  useEffect(() => {
    if (zip.length !== 5) { setZipMsg(''); return; }
    const d = zip[0];
    if (zipRows[d] || loading.current[d]) return;
    loading.current[d] = true;
    fetch(`/data/zip-${d}.json`).then((r) => r.json()).then((rows: Row[]) => setZipRows((o) => ({ ...o, [d]: rows }))).catch(() => setZipMsg('The ZIP table could not be loaded.'));
  }, [zip, zipRows]);

  const zipRow = zip.length === 5 ? zipRows[zip[0]]?.find((r) => r[0] === zip) : undefined;
  useEffect(() => {
    if (zip.length === 5 && zipRows[zip[0]] && !zipRow) setZipMsg(`ZIP ${zip} is not in FEMA's table (no single-family policy, or too few to publish). Showing the county or state instead.`);
    else if (zipRow) setZipMsg('');
  }, [zip, zipRows, zipRow]);

  const stateCounties = useMemo(() => (counties ?? []).filter((r) => r[1] === st).sort((a, b) => a[0].localeCompare(b[0])), [counties, st]);
  const countyRow = county ? stateCounties.find((r) => r[0] === county) : undefined;

  const area: Area = zipRow ? rowArea(zipRow, 'zip') : countyRow ? rowArea(countyRow, 'county') : st ? stateArea(st) : natArea();
  const today = cur > 0 ? cur : area.polMed || area.current;
  const target = area.full || area.risk;
  const g = glide({ current: today, full: target, cap: capOf(use), fees: fixedFees(use), years: 5 });
  const head = area.polMed || area.current;
  const date = NAT.policiesDate ? longDate(NAT.policiesDate) : '';

  const stateOptions = [{ value: '', label: 'All states' }, ...LITE_STATES.map((s) => ({ value: s.c, label: s.n }))];
  const countyOptions = [{ value: '', label: st ? 'Whole state' : 'Pick a state first' }, ...stateCounties.map((r) => ({ value: r[0], label: r[0] }))];
  const steps = g.decrease ? 'lower at renewal' : g.steps === 0 ? 'none left' : `${g.steps} ${g.steps === 1 ? 'renewal' : 'renewals'} at ${pct(capOf(use), 0)}`;

  return (
    <div className="rounded-xl border border-navy-200 bg-white p-4 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <form className="grid content-start grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
            <label htmlFor={`${idPrefix}-zip`} className="mb-1 block text-sm font-medium text-navy-700">ZIP code</label>
            <input id={`${idPrefix}-zip`} type="text" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={zip} placeholder="e.g. 77573"
              onChange={(e) => { setZip(e.target.value.replace(/\D/g, '').slice(0, 5)); }} aria-describedby={`${idPrefix}-zip-help`}
              className="tabular-nums h-12 w-full rounded-lg border border-navy-300 bg-white px-4 text-lg tracking-wider text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
            <p id={`${idPrefix}-zip-help`} role="status" className="mt-1 text-xs text-navy-500">{zipMsg || 'Five digits; or pick a county below'}</p>
          </div>
          <NumberField id={`${idPrefix}-cur`} label="Your bill today (optional)" value={cur} onChange={setCur} unit="$" max={100000} help="Leave empty to use the local median" />
          <SelectField id={`${idPrefix}-st`} label="State" value={st} onChange={(v) => { setSt(v); setCounty(''); }} options={stateOptions} />
          <SelectField id={`${idPrefix}-county`} label="County" value={county} onChange={setCounty} options={countyOptions} help={counties === null ? 'Loading the county table' : undefined} />
          <div className="grid grid-rows-subgrid row-span-3 sm:col-span-2"><Choice id={`${idPrefix}-use`} label="The insured home is" value={use} onChange={(v) => setUse(v as 'primary' | 'other')} options={[{ value: 'primary', label: 'Main home' }, { value: 'other', label: 'Second home or rental' }]} /></div>
        </form>
        <ResultCard label={`Median single-family flood bill, ${area.label}`} value={usd(head)}
          sub={area.polMed ? `${formatNumber(area.polN, 0)} policies in force on ${date}, premium and fees included.` : `Median paid in August 2023 (${formatNumber(area.pif, 0)} policies); too few policies for a 2026 median.`}>
          <Rows rows={[
            [area.full ? 'Median full-risk price, same policies' : 'Full-risk median (FEMA, 2023 rates)', usd(target), target],
            ...(area.full ? [['Policies still below their full-risk price', pct(area.capped, 0)] as [string, string]] : []),
            ['Median paid in August 2023', usd(area.current), area.current],
            [`Increase left from ${cur > 0 ? 'your bill' : 'the median'}`, steps],
            ['Next five bills, added up', usd(g.total)],
            [area.clN ? `Median claim paid, ${NAT.claimYears[0]} to ${NAT.claimYears[1]} (${formatNumber(area.clN, 0)} claims)` : 'Claims paid, 2016 to 2025', area.clN ? usd(area.clMed) : 'fewer than 10'],
            ...(area.surge !== null ? [['Policies exposed to storm surge', pct(area.surge, 0)] as [string, string]] : []),
          ]} />
          <ShareRow methodHref={methodHref} />
        </ResultCard>
      </div>
    </div>
  );
}
