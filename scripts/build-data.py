#!/usr/bin/env python3
"""Rebuild the aggregated data files of the site from the federal flood program's own files.

Usage (Python 3.11+ with duckdb and openpyxl, e.g. a virtualenv):
    python3 scripts/build-data.py [--raw .cache/raw] [--no-policies]

Inputs, downloaded into the raw cache when missing (never committed, see .gitignore):
  1. FEMA, "Cost of Flood Insurance for Single-Family Homes under NFIP's Pricing Approach",
     Examples 2, 3 and 4 (state, ZIP, county) and Example 1 (cost ranges by state):
     fema_risk-rating_exhibits-2-3-4.xlsx and fema_risk-rating_exhibit-1.xlsx
     (single-family policies in force on 2023-08-31, rates effective 2023-02-01).
     fema.gov answers 403 to scripts; the Wayback Machine copy of the same file is used.
  2. OpenFEMA NFIP Redacted Claims v3 (NfipClaimsV3.parquet): every NFIP claim since 1978.
  3. OpenFEMA NFIP Redacted Policies v3 (NfipPoliciesV3.parquet, about 5 GB): every policy term since 2009.
     (v2, FimaNfip*, was frozen on 2026-06-01 and removed by FEMA in October 2026.)
     Read column by column with duckdb; only the aggregates are kept. Skipped with --no-policies
     (the previous src/data/policies-*.json then stays as it is).
  4. Census Bureau 2020 county codes (national_county2020.txt), to join county names and FIPS codes.

Outputs (committed):
  src/data/national.json        national figures and cost ranges
  src/data/states.json          50 states + DC: FEMA medians, exposure, cost ranges, claims, policies
  src/data/counties.json        one row per county (FEMA medians + claims + 2026 policies)
  public/data/counties.json     same rows, compact, for the in-browser county search
  public/data/zip-<d>.json      ZIP rows split by first digit, for the in-browser ZIP search

Rules (RECETTE §22): rerun once a year, or when FEMA republishes the exhibits; check the totals
printed at the end against the "ALL STATES AND TERRITORIES" row of the spreadsheet.
"""
import argparse, json, os, re, statistics, subprocess, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FEMA = 'https://www.fema.gov/sites/default/files/documents/'
WAYBACK = 'https://web.archive.org/web/2026id_/'
FILES = {
    'exhibits': ('fema_risk-rating_exhibits-2-3-4.xlsx', WAYBACK + FEMA + 'fema_risk-rating_exhibits-2-3-4.xlsx'),
    'exhibit1': ('fema_risk-rating_exhibit-1.xlsx', WAYBACK + FEMA + 'fema_risk-rating_exhibit-1.xlsx'),
    'claims': ('NfipClaimsV3.parquet', 'https://www.fema.gov/about/reports-and-data/openfema/v3/NfipClaimsV3.parquet'),
    'policies': ('NfipPoliciesV3.parquet', 'https://www.fema.gov/about/reports-and-data/openfema/v3/NfipPoliciesV3.parquet'),
    'counties': ('national_county2020.txt', 'https://www2.census.gov/geo/docs/reference/codes2020/national_county2020.txt'),
}
STATES = [
    ('AL', 'Alabama'), ('AK', 'Alaska'), ('AZ', 'Arizona'), ('AR', 'Arkansas'), ('CA', 'California'), ('CO', 'Colorado'),
    ('CT', 'Connecticut'), ('DE', 'Delaware'), ('DC', 'District of Columbia'), ('FL', 'Florida'), ('GA', 'Georgia'),
    ('HI', 'Hawaii'), ('ID', 'Idaho'), ('IL', 'Illinois'), ('IN', 'Indiana'), ('IA', 'Iowa'), ('KS', 'Kansas'),
    ('KY', 'Kentucky'), ('LA', 'Louisiana'), ('ME', 'Maine'), ('MD', 'Maryland'), ('MA', 'Massachusetts'),
    ('MI', 'Michigan'), ('MN', 'Minnesota'), ('MS', 'Mississippi'), ('MO', 'Missouri'), ('MT', 'Montana'),
    ('NE', 'Nebraska'), ('NV', 'Nevada'), ('NH', 'New Hampshire'), ('NJ', 'New Jersey'), ('NM', 'New Mexico'),
    ('NY', 'New York'), ('NC', 'North Carolina'), ('ND', 'North Dakota'), ('OH', 'Ohio'), ('OK', 'Oklahoma'),
    ('OR', 'Oregon'), ('PA', 'Pennsylvania'), ('RI', 'Rhode Island'), ('SC', 'South Carolina'), ('SD', 'South Dakota'),
    ('TN', 'Tennessee'), ('TX', 'Texas'), ('UT', 'Utah'), ('VT', 'Vermont'), ('VA', 'Virginia'), ('WA', 'Washington'),
    ('WV', 'West Virginia'), ('WI', 'Wisconsin'), ('WY', 'Wyoming'),
]
CODES = {c for c, _ in STATES}
SFH = (1, 11)  # OpenFEMA occupancyType: single-family residence (legacy code 1, Risk Rating 2.0 code 11)
CLAIM_YEARS = (2016, 2025)  # ten full years of losses
MIN_N = 10  # a ZIP or county median on fewer policies or claims is not published (noise, privacy)


def keep(x): return x if x and x.get('n', 0) >= MIN_N else None


def slug(name): return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def fetch(raw, key):
    name, url = FILES[key]
    path = os.path.join(raw, name)
    if not os.path.exists(path):
        print(f'downloading {name} …', file=sys.stderr)
        # curl: fema.gov serves its OpenFEMA files to curl, not to Python's default user agent.
        subprocess.run(['curl', '-sL', '--fail', '-o', path, url], check=True)
    return path


def r2(x): return None if x is None else round(float(x), 2)


def read_exhibits(raw):
    import openpyxl
    wb = openpyxl.load_workbook(fetch(raw, 'exhibits'), read_only=True)
    def rows(sheet):
        out = []
        for r in wb[sheet].iter_rows(values_only=True):
            if r[0] is None or r[2] is None or not isinstance(r[2], (int, float)): continue
            out.append(r)
        return out
    def expo(r): return {'inland': r2(r[5]), 'surge': r2(r[6]), 'tsunami': r2(r[7]), 'greatLakes': r2(r[8]), 'erosion': r2(r[9])}
    st = {}
    for r in rows('Exhibit2'):
        st[r[0]] = {'pif': int(r[2]), 'risk': r2(r[3]), 'current': r2(r[4]), 'exposure': expo(r)}
    zips = []
    for r in rows('Exhibit3'):
        if r[0] not in CODES or not isinstance(r[1], int): continue  # state rows and "<st>_Aggregated" buckets
        zips.append({'zip': f'{r[1]:05d}', 'st': r[0], 'pif': int(r[2]), 'risk': r2(r[3]), 'current': r2(r[4]), 'surge': r2(r[6])})
    counties = []
    agg = {}
    for r in rows('Exhibit4'):
        if r[0] not in CODES: continue
        if r[1] is None: continue
        if str(r[1]).endswith('_Aggregated'):
            agg[r[0]] = {'pif': int(r[2]), 'risk': r2(r[3]), 'current': r2(r[4])}
            continue
        counties.append({'st': r[0], 'name': r[1], 'pif': int(r[2]), 'risk': r2(r[3]), 'current': r2(r[4]), 'exposure': expo(r)})
    nat = next(r for r in rows('Exhibit2') if r[0] == 'ALL')
    national = {'pif': int(nat[2]), 'risk': r2(nat[3]), 'current': r2(nat[4]), 'exposure': expo(nat)}
    # Example 1: cost ranges, one sheet per state.
    wb1 = openpyxl.load_workbook(fetch(raw, 'exhibit1'), read_only=True)
    ranges = {}
    for ws in wb1.worksheets:
        key = 'ALL' if ws.title == 'All' else ws.title
        out = []
        for r in ws.iter_rows(values_only=True):
            if isinstance(r[0], (int, float)) and r[1] in ('-', '+'):
                lo = int(r[0]); hi = int(r[2]) if r[1] == '-' else None
                cells = list(r[3:])  # PIF, share, median RCV, median risk-based cost, exposures
                if not cells or cells[0] in ('', None):
                    out.append({'lo': lo, 'hi': hi, 'pif': 0, 'share': 0, 'rcv': None, 'risk': None}); continue
                out.append({'lo': lo, 'hi': hi, 'pif': int(cells[0]), 'share': round(float(cells[1]), 4), 'rcv': int(round(float(cells[2]))), 'risk': r2(cells[3])})
            elif r[0] == 'Total' and len(r) > 5 and isinstance(r[5], (int, float)):
                out.append({'total': True, 'rcv': int(round(float(r[5])))})
        ranges[key] = out
    return national, st, zips, counties, agg, ranges


def county_fips(raw):
    m = {}
    for line in open(fetch(raw, 'counties'), encoding='utf-8'):
        p = line.rstrip('\n').split('|')
        if p[0] == 'STATE' or len(p) < 5: continue
        m[(p[0], p[4].lower())] = p[1] + p[2]
    return m


KINDS = {'city of': ' city', 'municipality of': ' municipality', 'city and borough of': ' city and borough',
         'city and county of': ' county', 'town and county of': ' county', 'consolidated municipality of': ''}


def norm(name):
    """FEMA writes "Norfolk, City of" where the Census Bureau writes "Norfolk city"."""
    n = name.lower().replace('\u2013', '-').strip()
    if ', ' in n:
        base, kind = n.split(', ', 1)
        if kind in KINDS: n = base + KINDS[kind]
    return n


def duck():
    import duckdb
    c = duckdb.connect()
    c.sql("SET memory_limit='6GB'")
    return c


def read_claims(raw, c):
    f = fetch(raw, 'claims')
    lo, hi = CLAIM_YEARS
    c.sql(f"""CREATE OR REPLACE TABLE cl AS SELECT state AS st, countyCode AS fips, lpad(reportedZipCode, 5, '0') AS zip, yearOfLoss AS y,
        floodEvent AS ev, coalesce(netBuildingPaymentAmount,0)+coalesce(netContentsPaymentAmount,0) AS paid,
        coalesce(netBuildingPaymentAmount,0) AS bpaid, coalesce(netContentsPaymentAmount,0) AS cpaid, ratedFloodZone AS zone
        FROM read_parquet('{f}') WHERE occupancyType IN {SFH} AND yearOfLoss BETWEEN {lo} AND {hi}""")
    def agg(key):
        q = f"""SELECT {key}, count(*) FILTER (WHERE paid>0) n, round(avg(paid) FILTER (WHERE paid>0)) avg,
            round(median(paid) FILTER (WHERE paid>0)) med, round(sum(paid)) tot, count(*) filed
            FROM cl GROUP BY {key}"""
        return {r[0]: {'n': int(r[1]), 'avg': int(r[2] or 0), 'median': int(r[3] or 0), 'total': int(r[4] or 0), 'filed': int(r[5])} for r in c.sql(q).fetchall() if r[0]}
    by_state, by_fips, by_zip = agg('st'), agg('fips'), agg('zip')
    events = {}
    for st, ev, y, n, tot in c.sql("""SELECT st, ev, min(y), count(*) FILTER (WHERE paid>0), round(sum(paid)) FROM cl
            WHERE ev IS NOT NULL AND ev <> '' GROUP BY st, ev ORDER BY st, 5 DESC""").fetchall():
        if n and len(events.setdefault(st, [])) < 3: events[st].append({'event': ev, 'year': int(y), 'n': int(n), 'total': int(tot)})
    zone = {}
    for st, z, n, med in c.sql("""SELECT st, CASE WHEN left(zone,1)='V' THEN 'V' WHEN left(zone,1)='A' THEN 'A' WHEN left(zone,1) IN ('X','B','C') THEN 'X' ELSE 'other' END,
            count(*) FILTER (WHERE paid>0), round(median(paid) FILTER (WHERE paid>0)) FROM cl GROUP BY 1, 2""").fetchall():
        if st: zone.setdefault(st, {})[z] = {'n': int(n), 'median': int(med or 0)}
    years = {int(y): {'n': int(n), 'median': int(m or 0)} for y, n, m in c.sql("SELECT y, count(*) FILTER (WHERE paid>0), round(median(paid) FILTER (WHERE paid>0)) FROM cl GROUP BY y ORDER BY y").fetchall()}
    nat = c.sql("SELECT count(*) FILTER (WHERE paid>0), round(avg(paid) FILTER (WHERE paid>0)), round(median(paid) FILTER (WHERE paid>0)), round(sum(paid)) FROM cl").fetchone()
    asof = c.sql(f"SELECT max(dateOfLoss)::VARCHAR FROM read_parquet('{f}')").fetchone()[0]
    return {'state': by_state, 'fips': by_fips, 'zip': by_zip, 'events': events, 'zone': zone, 'years': years,
            'national': {'n': int(nat[0]), 'avg': int(nat[1]), 'median': int(nat[2]), 'total': int(nat[3])}, 'lastLoss': asof}


def read_policies(raw, c):
    """Single-family NFIP policies in force on a date: count and median of the total policy cost.

    In force on D = policyEffectiveDate <= D < policyTerminationDate (one row per policy term).
    Check of the method: on 2023-08-31 it gives 3,113,740 single-family policies and a median
    policyCost of $780, against 3,149,679 and $786 in FEMA's own Exhibit 2 for the same date.
    D = end of the latest month whose new terms reach 93 % of the same month a year earlier
    (the last months of the file are still being reported by insurers)."""
    f = fetch(raw, 'policies')
    c.sql(f"""CREATE OR REPLACE TABLE po_all AS SELECT propertyState AS st, left(censusGeoid, 5) AS fips, lpad(reportedZipCode, 5, '0') AS zip,
        policyCost::DOUBLE AS cost, totalInsurancePremiumOfThePolicy::DOUBLE AS prem, ratedFloodZone AS fz,
        totalBuildingInsuranceCoverage AS bcov, totalContentsInsuranceCoverage AS ccov, primaryResidenceIndicator AS prim,
        federalPolicyFee AS fpf, hfiaaSurcharge AS hf, reserveFundAssessment AS rfa, iccPremium AS icc,
        fullRiskPremium::DOUBLE AS frp,
        -- full-risk total cost: the full-risk premium with the same Reserve Fund rate, plus the same fixed fees
        CASE WHEN fullRiskPremium IS NOT NULL AND totalInsurancePremiumOfThePolicy > 0
             THEN fullRiskPremium * (1 + coalesce(reserveFundAssessment, 0) / totalInsurancePremiumOfThePolicy) + coalesce(federalPolicyFee, 0) + coalesce(hfiaaSurcharge, 0) + coalesce(communityProbationSurcharge, 0) END AS fullcost,
        policyEffectiveDate AS e, policyTerminationDate AS t
        FROM read_parquet('{f}') WHERE occupancyType IN {SFH} AND policyEffectiveDate >= DATE '2022-06-01' AND policyCost > 0""")
    months = dict(c.sql("SELECT strftime(e, '%Y-%m'), count(*) FROM po_all GROUP BY 1").fetchall())
    ok = [m for m in sorted(months) if m >= '2024-01' and months.get(f"{int(m[:4]) - 1}{m[4:]}", 0) and months[m] >= 0.93 * months[f"{int(m[:4]) - 1}{m[4:]}"]]
    date = c.sql(f"SELECT (DATE '{ok[-1]}-01' + INTERVAL 1 MONTH - INTERVAL 1 DAY)::DATE::VARCHAR").fetchone()[0]
    check = c.sql("SELECT count(*), median(cost) FROM po_all WHERE e <= DATE '2023-08-31' AND t > DATE '2023-08-31'").fetchone()
    print(f'policies method check on 2023-08-31: {check[0]} policies, median cost {check[1]} (FEMA Exhibit 2: 3149679, 786)')
    c.sql(f"CREATE OR REPLACE TABLE po AS SELECT * FROM po_all WHERE e <= DATE '{date}' AND t > DATE '{date}'")
    zone_sql = "CASE WHEN left(fz,1)='V' THEN 'V' WHEN left(fz,1)='A' THEN 'A' WHEN left(fz,1) IN ('X','B','C') THEN 'X' ELSE 'other' END"
    # full: median full-risk total cost; capped: share of policies whose premium is still below the full-risk premium
    FULL = "round(median(fullcost)), avg(CASE WHEN frp > prem * 1.01 THEN 1.0 ELSE 0.0 END) FILTER (WHERE frp IS NOT NULL AND prem > 0)"
    def agg(key):
        q = f"SELECT {key}, count(*), round(median(cost)), round(avg(cost)), {FULL} FROM po GROUP BY {key}"
        return {r[0]: {'n': int(r[1]), 'median': int(r[2]), 'avg': int(r[3]), 'full': int(r[4] or 0), 'capped': round(r[5] or 0, 3)} for r in c.sql(q).fetchall() if r[0]}
    zone = {}
    for st, z, n, med, full in c.sql(f"SELECT st, {zone_sql}, count(*), round(median(cost)), round(median(fullcost)) FROM po GROUP BY 1, 2").fetchall():
        if st: zone.setdefault(st, {})[z] = {'n': int(n), 'median': int(med), 'full': int(full or 0)}
    nat = c.sql("""SELECT count(*), round(median(cost)), round(avg(cost)), round(median(bcov)), round(median(ccov)),
        round(median(prem)), round(median(fpf)), round(median(hf)), round(median(rfa)), round(median(icc)),
        avg(CASE WHEN bcov >= 250000 THEN 1 ELSE 0 END), avg(CASE WHEN ccov > 0 THEN 1 ELSE 0 END), avg(CASE WHEN prim THEN 1 ELSE 0 END),
        {FULL}, round(median(frp)), round(median(frp / prem) FILTER (WHERE frp > prem * 1.01), 3), count(fullcost)
        FROM po""".replace('{FULL}', FULL)).fetchone()
    natzone = {z: {'n': int(n), 'median': int(m), 'full': int(fl or 0)} for z, n, m, fl in c.sql(f"SELECT {zone_sql}, count(*), round(median(cost)), round(median(fullcost)) FROM po GROUP BY 1").fetchall()}
    trend = []
    for d in ('2023-08-31', '2024-08-31', '2025-08-31', date):
        n, m = c.sql(f"SELECT count(*), round(median(cost)) FROM po_all WHERE e <= DATE '{d}' AND t > DATE '{d}'").fetchone()
        trend.append({'date': d, 'n': int(n), 'median': int(m)})
    return {'date': date, 'field': 'policyCost', 'state': agg('st'), 'fips': agg('fips'), 'zip': agg('zip'), 'zone': zone, 'trend': trend,
            'national': {'n': int(nat[0]), 'median': int(nat[1]), 'avg': int(nat[2]), 'medianBuilding': int(nat[3] or 0), 'medianContents': int(nat[4] or 0),
                         'medianPremium': int(nat[5]), 'federalPolicyFee': int(nat[6]), 'hfiaa': int(nat[7]), 'medianReserveFund': int(nat[8]), 'medianIcc': int(nat[9]),
                         'shareBuildingAtMax': round(nat[10], 3), 'shareWithContents': round(nat[11], 3), 'sharePrimary': round(nat[12], 3), 'zone': natzone,
                         'full': int(nat[13]), 'capped': round(nat[14], 3), 'medianFullPremium': int(nat[15]), 'cappedMedianRatio': nat[16], 'withFull': int(nat[17])}}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--raw', default=os.path.join(ROOT, '.cache', 'raw'))
    ap.add_argument('--no-policies', action='store_true')
    a = ap.parse_args()
    os.makedirs(a.raw, exist_ok=True)
    national, st, zips, counties, agg, ranges = read_exhibits(a.raw)
    fips = county_fips(a.raw)
    c = duck()
    claims = read_claims(a.raw, c)
    pol_path = os.path.join(ROOT, 'src/data/policies-summary.json')
    if a.no_policies:
        pol = json.load(open(pol_path)) if os.path.exists(pol_path) else None
        pol_full = None
    else:
        pol_full = read_policies(a.raw, c)
        pol = {'date': pol_full['date'], 'field': pol_full['field'], 'national': pol_full['national'], 'state': pol_full['state'], 'zone': pol_full['zone'], 'trend': pol_full['trend']}
        json.dump(pol, open(pol_path, 'w'), indent=1)
    pol_fips = pol_full['fips'] if pol_full else {}
    pol_zip = pol_full['zip'] if pol_full else {}

    # Counties: FEMA rows + FIPS + claims + policies
    unmatched = []
    crow = []
    for r in counties:
        k = fips.get((r['st'], r['name'].lower())) or fips.get((r['st'], norm(r['name'])))
        if not k: unmatched.append(f"{r['st']} {r['name']}")
        cl = keep(claims['fips'].get(k)) if k else None
        po = keep(pol_fips.get(k)) if k else None
        crow.append({**r, 'fips': k, 'slug': slug(r['name']), 'claims': cl, 'pol': po})
    crow.sort(key=lambda r: (r['st'], r['name']))
    # ZIPs: FEMA rows + claims + policies
    zrows = []
    for z in zips:
        cl = keep(claims['zip'].get(z['zip'])); po = keep(pol_zip.get(z['zip']))
        zrows.append([z['zip'], z['st'], z['pif'], z['current'], z['risk'], z['surge'], cl['n'] if cl else 0, cl['median'] if cl else 0, po['n'] if po else 0, po['median'] if po else 0, po['full'] if po else 0, po['capped'] if po else 0])
    # States
    states = []
    for code, name in STATES:
        s = st.get(code)
        if not s: sys.exit(f'state {code} missing from Exhibit 2')
        cs = [r for r in crow if r['st'] == code]
        top = sorted(cs, key=lambda r: -r['pif'])[:8]
        states.append({
            'code': code, 'name': name, 'slug': slug(name), **s,
            'aggregated': agg.get(code),
            'counties': len(cs),
            'topCounties': [{'name': r['name'], 'pif': r['pif'], 'current': r['current'], 'risk': r['risk'], 'claims': r['claims'], 'pol': r['pol']} for r in top],
            'maxGap': max(({'name': r['name'], 'current': r['current'], 'risk': r['risk'], 'pif': r['pif']} for r in cs if r['pif'] >= 50), key=lambda x: (x['risk'] or 0) - (x['current'] or 0), default=None),
            'ranges': [x for x in ranges.get(code, []) if not x.get('total')],
            'medianRcv': next((x['rcv'] for x in ranges.get(code, []) if x.get('total')), None),
            'zips': sum(1 for z in zips if z['st'] == code),
            'claims': claims['state'].get(code), 'events': claims['events'].get(code, []), 'claimsByZone': claims['zone'].get(code, {}),
            'pol': pol['state'].get(code) if pol else None, 'polByZone': pol['zone'].get(code, {}) if pol else {},
        })
    out = os.path.join(ROOT, 'src/data')
    nat = {**national, 'ranges': [x for x in ranges.get('ALL', []) if not x.get('total')], 'medianRcv': next((x['rcv'] for x in ranges.get('ALL', []) if x.get('total')), None),
           'claims': claims['national'], 'claimsByYear': claims['years'], 'claimYears': list(CLAIM_YEARS), 'claimsLastLoss': claims['lastLoss'],
           'policies': pol['national'] if pol else None, 'policiesTrend': pol['trend'] if pol else None, 'policiesDate': pol['date'] if pol else None, 'policiesField': pol['field'] if pol else None,
           'snapshot': '2023-08-31', 'ratesOf': '2023-02-01', 'zipCount': len(zips), 'countyCount': len(crow)}
    json.dump(nat, open(os.path.join(out, 'national.json'), 'w'), indent=1)
    json.dump(states, open(os.path.join(out, 'states.json'), 'w'), indent=1)
    json.dump(crow, open(os.path.join(out, 'counties.json'), 'w'), indent=None, separators=(',', ':'))
    # Slim state table for the calculators shipped to the browser (no county or ZIP rows in the bundle).
    lite = [{'c': x['code'], 'n': x['name'], 's': x['slug'], 'cur': x['current'], 'risk': x['risk'], 'pif': x['pif'],
             'pol': (x['pol'] or {}).get('median'), 'polN': (x['pol'] or {}).get('n'), 'full': (x['pol'] or {}).get('full'), 'capped': (x['pol'] or {}).get('capped'),
             'zone': {z: v['median'] for z, v in x['polByZone'].items() if z in ('A', 'V', 'X') and v['n'] >= MIN_N},
             'cl': [(x['claims'] or {}).get('n', 0), (x['claims'] or {}).get('median', 0)],
             'rg': [[r['lo'], r['hi'], r['pif']] for r in x['ranges']]} for x in states]
    json.dump(lite, open(os.path.join(out, 'state-lite.json'), 'w'), separators=(',', ':'))
    pub = os.path.join(ROOT, 'public/data'); os.makedirs(pub, exist_ok=True)
    # Compact county rows for the browser: [st, name, pif, current, risk, surge, claimsN, claimsMedian, polN, polMedian, polFull, polCapped]
    json.dump([[r['st'], r['name'], r['pif'], r['current'], r['risk'], r['exposure']['surge'], (r['claims'] or {}).get('n', 0), (r['claims'] or {}).get('median', 0), (r['pol'] or {}).get('n', 0), (r['pol'] or {}).get('median', 0), (r['pol'] or {}).get('full', 0), (r['pol'] or {}).get('capped', 0)] for r in crow],
              open(os.path.join(pub, 'counties.json'), 'w'), separators=(',', ':'))
    for d in '0123456789':
        json.dump([z for z in zrows if z[0][0] == d], open(os.path.join(pub, f'zip-{d}.json'), 'w'), separators=(',', ':'))
    print(f"national: {nat['pif']} SFH policies, median current {nat['current']}, median risk-based {nat['risk']}")
    print(f"states: {len(states)} · counties: {len(crow)} ({len(unmatched)} without FIPS) · ZIPs: {len(zrows)}")
    print(f"claims {CLAIM_YEARS}: {claims['national']} · last loss {claims['lastLoss']}")
    if pol: print(f"policies in force on {pol['date']}: {pol['national']}")
    if unmatched: print('no FIPS:', ', '.join(unmatched[:40]))


if __name__ == '__main__':
    main()
