"""Screen every parcel in one city against four state housing laws (a first screen, not legal advice).

Run after fetch_city.py:  python3 lanes/1-find-it/scripts/screen_city.py "Santa Ana"
Writes CSVs and SUMMARY.md to lanes/1-find-it/data/<city>/.

Tests follow html/laws.js and the HCD Housing Law Fact Sheets (April 2026, read 2026-11-07).
Each law gets one verdict per parcel:
  Possible   - every test we can run passes (many tests are still "not checked")
  Unknown    - a test needs data we do not have, or a hazard/historic flag needs a closer look
  Not likely - a test we can run fails
"""
import csv
import json
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
CITY_NAME = sys.argv[1] if len(sys.argv) > 1 else 'Anaheim'
SLUG = CITY_NAME.lower().replace(' ', '-')
OUT = os.path.join(HERE, '..', 'data', SLUG)
RAW = os.path.join(OUT, 'raw')
SURPLUS = os.path.join(HERE, '..', '..', '..', 'html', 'data', 'surplus-oc.json')

SQFT_PER_ACRE = 43560
SB9_MIN_SPLIT_SQFT = 2 * 1200  # HCD SB 9 sheet: cities cannot preclude two 1,200 sq ft lots
VACANT = {'3000', '3100', '3200', '3300', '3400', '1900'}  # SCAG legend: Vacant / Urban Vacant
SB4_USES = {'1245': 'religious facility', '1265': 'college or university'}


def load(name):
    if not os.path.exists(os.path.join(RAW, name + '.json')):
        return None
    return json.load(open(os.path.join(RAW, name + '.json')))['features']


def legend():
    text = open(os.path.join(RAW, 'scag_legend.txt')).read()
    text = text[text.find('Legend'):]
    pairs = re.findall(r'(\d{4})\s+([A-Za-z].*?)(?=\s*\d{4}\s|\s*$)', text)
    # Category headings run into the description ("Urban VacantWater"); cut at the join.
    return {code: re.split(r'(?<=[a-z\)])(?=[A-Z])', desc)[0].strip() for code, desc in pairs}


def ring_centroid(ring):
    a = cx = cy = 0.0
    for (x1, y1), (x2, y2) in zip(ring, ring[1:]):
        c = x1 * y2 - x2 * y1
        a += c
        cx += (x1 + x2) * c
        cy += (y1 + y2) * c
    if abs(a) < 1e-15:
        return sum(p[0] for p in ring) / len(ring), sum(p[1] for p in ring) / len(ring), 0
    return cx / (3 * a), cy / (3 * a), abs(a)


def centroid(geom):
    best = max((ring_centroid(r) for r in geom['rings']), key=lambda t: t[2])
    return best[0], best[1]


def inside(x, y, ring):
    hit = False
    for (x1, y1), (x2, y2) in zip(ring, ring[1:]):
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            hit = not hit
    return hit


class Polys:
    """Point-in-polygon lookup with a bounding-box prefilter (even-odd rule handles holes)."""

    def __init__(self, feats, label):
        self.items = []
        for f in feats:
            rings = (f.get('geometry') or {}).get('rings') or []
            if not rings:
                continue
            xs = [p[0] for r in rings for p in r]
            ys = [p[1] for r in rings for p in r]
            self.items.append(((min(xs), min(ys), max(xs), max(ys)), rings, label(f['attributes'])))

    def find(self, x, y):
        for (x0, y0, x1, y1), rings, lab in self.items:
            if x0 <= x <= x1 and y0 <= y <= y1 and sum(inside(x, y, r) for r in rings) % 2:
                return lab
        return ''


def zone_type(code):  # same buckets as html/laws.js zoneType()
    c = code or ''
    if not c or c == '9999':
        return 'unknown'
    if c == '7777':
        return 'specific plan'
    if c.startswith('111'):
        return 'single-family'
    if c.startswith('112'):
        return 'multifamily'
    if c.startswith('16'):
        return 'mixed res/commercial'
    if re.match(r'^12[0-3]', c) or c == '1500':
        return 'commercial'
    return 'other'


def verdict(results):
    if 'fail' in results:
        return 'Not likely'
    if 'unknown' in results:
        return 'Unknown'
    return 'Possible'


def screen(p):
    zt, acres, sqft = p['zone_type'], p['acres'], p['lot_sqft']
    zone_unknown = zt in ('unknown', 'specific plan')
    fire, flood, hist = p['fire_zone'], p['flood_zone'], p['historic_district']
    lu = {p['use_code'], p['use_code_2nd']}
    out = {}

    # SB 9 (Gov Code 65852.21, 66411.7)
    t, why = [], []
    if zone_unknown:
        t.append('unknown'); why.append(f'zone {zt}')
    elif zt != 'single-family':
        t.append('fail'); why.append(f'zone is {zt}')
    if hist == 'not checked':  # like laws.js: a test we cannot run is "not checked", not "unknown"
        why.append('historic districts not checked (no city layer)')
    elif hist:
        t.append('unknown'); why.append(f'in {hist} historic district: check for contributing structure')
    if fire or flood:
        t.append('unknown'); why.append('in fire or flood zone: check 65913.4(a)(6) exceptions')
    out['sb9'] = verdict(t)
    out['sb9_lot_split_size'] = 'unknown' if not sqft else ('pass' if sqft >= SB9_MIN_SPLIT_SQFT else 'fail')
    out['sb9_why'] = '; '.join(why)

    # SB 684 (multifamily zone, under 5 acres) / SB 1123 (vacant single-family lot)
    t, why, path = [], [], ''
    if zt == 'single-family':
        path = 'SB 1123'
        if lu & VACANT:
            t.append('unknown'); why.append('vacant single-family lot: SB 1123 size limit not in HCD sheet')
        else:
            t.append('fail'); why.append('single-family zone but not mapped vacant')
    elif zt == 'mixed res/commercial':
        path = 'SB 684'
        t.append('unknown'); why.append('mixed-use zone: check the zone allows multifamily')
    elif zone_unknown:
        t.append('unknown'); why.append(f'zone {zt}')
    elif zt != 'multifamily':
        t.append('fail'); why.append(f'zone is {zt}')
    else:
        path = 'SB 684'
    if path == 'SB 684' or zone_unknown:
        if acres is None:
            t.append('unknown'); why.append('lot size unknown')
        elif acres >= 5:
            t.append('fail'); why.append(f'{acres:.2f} acres (5+)')
    if fire:
        t.append('fail'); why.append(f'{fire} fire hazard zone')
    out['sb684_1123'] = verdict(t)
    out['sb684_1123_path'] = path
    out['sb684_1123_why'] = '; '.join(why)

    # AB 2011 (Gov Code 65912.100-65912.140): zone allows office, retail or parking
    t, why = [], []
    if zone_unknown:
        t.append('unknown'); why.append(f'zone {zt}')
    elif zt not in ('commercial', 'mixed res/commercial'):
        t.append('fail'); why.append(f'zone is {zt}')
    if fire or flood:
        t.append('unknown'); why.append('in fire or flood zone: check environmental criteria')
    out['ab2011'] = verdict(t)
    out['ab2011_why'] = '; '.join(why)

    # SB 4 (Gov Code 65913.16): owner must be a religious institution or independent college.
    # PROXY: SCAG existing land use is a religious facility or college. Owner is not in free data.
    t, why = [], []
    use = next((SB4_USES[c] for c in (p['use_code'], p['use_code_2nd']) if c in SB4_USES), '')
    if p['surplus_notice']:
        t.append('fail'); why.append('public agency filed a surplus notice (public owner)')
    if not use:
        t.append('unknown'); why.append('owner not in free data; land use is not religious or college')
    else:
        t.append('unknown'); why.append(f'PROXY: land use is {use}; confirm owner with the Assessor')
    if fire == 'Very High':
        t.append('fail'); why.append('very high fire hazard zone')
    if flood:
        t.append('fail'); why.append(f'FEMA flood zone {flood}')
    out['sb4'] = verdict(t)
    out['sb4_proxy_use'] = use
    out['sb4_why'] = '; '.join(why)
    return out


def main():
    names = legend()
    lu = {f['attributes']['PID24']: f['attributes'] for f in load('scag_landuse')}
    gp = {f['attributes']['PID24']: f['attributes'] for f in load('scag_genplan')}
    addr = {}
    for f in load('oc_addresses'):
        a = f['attributes']
        site = (a['SITE_ADDRESS'] or '').strip()
        if site.upper().endswith(' ' + CITY_NAME.upper()):
            site = site[:-len(CITY_NAME)].strip()
        addr.setdefault((a['ASSESSMENT_NO'] or '').replace('-', ''), site)
    fire = Polys(load('oc_fire_lra'), lambda a: a['HAZ_CLASS'])
    flood = Polys(load('oc_flood_sfha'), lambda a: a['FLD_ZONE'])
    hist_feats = load('anaheim_historic')
    hist = Polys(hist_feats, lambda a: a['DISTRICTNAME']) if hist_feats else None
    surplus = {r['apn'].replace('-', '') for r in json.load(open(SURPLUS))['rows']
               if r['city'].upper() == CITY_NAME.upper() or r['agency'].lower() == CITY_NAME.lower()}

    rows = []
    for f in load('scag_zoning'):
        z = f['attributes']
        pid = z['PID24']
        if z['STACK'] and z['STACK'] > 1 and not z['PARENT_INDEX']:
            continue  # condo-style unit stacked on a shared footprint; the parent parcel is kept
        x, y = centroid(f['geometry'])
        l, g = lu.get(pid, {}), gp.get(pid, {})
        p = {
            'city': CITY_NAME, 'apn': z['APN24'], 'pid24': pid, 'address': addr.get(z['APN24'] or '', ''),
            'lat': round(y, 6), 'lon': round(x, 6),
            'acres': round(z['ACRES'], 3) if z['ACRES'] is not None else None,
            'lot_sqft': round(z['ACRES'] * SQFT_PER_ACRE) if z['ACRES'] else None,
            'slope': z['SLOPE'],
            'parent_parcel': 'yes' if z['PARENT_INDEX'] else '',  # outline of other parcels
            'zone_city': z['ZN24_CITY'], 'zone_scag': z['ZN24_SCAG'],
            'zone_type': zone_type(z['ZN24_SCAG']),
            'general_plan_city': g.get('GP24_CITY', ''), 'gp_max_density': g.get('DEN_MAX'),
            'use_code': l.get('LU24') or '', 'use_code_2nd': l.get('LU24_2ND') or '',
            'existing_use': names.get(l.get('LU24') or '', ''),
            'fire_zone': fire.find(x, y), 'flood_zone': flood.find(x, y),
            'historic_district': hist.find(x, y) if hist else 'not checked',
            'surplus_notice': 'yes' if z['APN24'] in surplus else '',
        }
        p.update(screen(p))
        rows.append(p)

    cols = list(rows[0].keys())
    write(os.path.join(OUT, f'{SLUG}-parcels-screened.csv'), rows, cols)
    base = ['city', 'apn', 'address', 'lat', 'lon', 'acres', 'lot_sqft', 'zone_city', 'zone_type',
            'general_plan_city', 'existing_use', 'fire_zone', 'flood_zone', 'historic_district',
            'surplus_notice']
    lists = {
        'sb9': (lambda r: r['sb9'] != 'Not likely', ['sb9', 'sb9_lot_split_size', 'sb9_why']),
        'sb684-sb1123': (lambda r: r['sb684_1123'] != 'Not likely',
                         ['sb684_1123', 'sb684_1123_path', 'sb684_1123_why']),
        'ab2011': (lambda r: r['ab2011'] != 'Not likely', ['ab2011', 'ab2011_why']),
        'sb4': (lambda r: r['sb4_proxy_use'] and r['sb4'] != 'Not likely', ['sb4', 'sb4_proxy_use', 'sb4_why']),
    }
    for name, (keep, extra) in lists.items():
        sel = sorted((r for r in rows if keep(r)), key=lambda r: -(r['acres'] or 0))
        write(os.path.join(OUT, f'candidates-{name}.csv'), sel, base + extra)
    summary(rows)


def write(path, rows, cols):
    with open(path, 'w', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=cols, extrasaction='ignore')
        w.writeheader()
        for r in rows:
            w.writerow({k: ('' if r.get(k) is None else r.get(k)) for k in cols})
    print('wrote', os.path.relpath(path), len(rows), 'rows')


def summary(rows):
    n = len(rows)
    lines = [f'# {CITY_NAME} screen: counts', '',
             f'Parcels screened: {n:,} (SCAG 2024 parcels in {CITY_NAME}, condo-unit duplicates removed).', '',
             '| Law | Possible | Unknown | Not likely |', '|---|---|---|---|']
    for key, label in [('sb9', 'SB 9'), ('sb684_1123', 'SB 684 / SB 1123'), ('ab2011', 'AB 2011'), ('sb4', 'SB 4')]:
        c = Counter(r[key] for r in rows)
        lines.append(f"| {label} | {c['Possible']:,} | {c['Unknown']:,} | {c['Not likely']:,} |")
    sb9 = [r for r in rows if r['sb9'] == 'Possible']
    lines += ['', f"SB 9 'Possible' lots big enough for two 1,200 sq ft lots: "
                  f"{sum(r['sb9_lot_split_size'] == 'pass' for r in sb9):,} of {len(sb9):,}.",
              f"SB 684 path (multifamily zone): {sum(r['sb684_1123'] == 'Possible' for r in rows):,} 'Possible'; "
              f"SB 1123 vacant single-family lots: "
              f"{sum(r['sb684_1123_path'] == 'SB 1123' and r['sb684_1123'] == 'Unknown' for r in rows):,}.",
              f"SB 4 proxy sites (religious or college land use): {sum(bool(r['sb4_proxy_use']) for r in rows):,}; "
              f"not ruled out by flood or fire: {sum(bool(r['sb4_proxy_use']) and r['sb4'] != 'Not likely' for r in rows):,}.",
              f"Zone unknown (specific plan or no code): {sum(r['zone_type'] in ('unknown', 'specific plan') for r in rows):,}.",
              f"In a FEMA flood zone: {sum(bool(r['flood_zone']) for r in rows):,}. "
              f"In a very high fire zone (LRA): {sum(bool(r['fire_zone']) for r in rows):,}. "
              f"In a historic district: " + (f"{sum(bool(r['historic_district']) for r in rows):,}."
                                              if rows[0]['historic_district'] != 'not checked'
                                              else "not checked (no city layer)."),
              '', '"Possible" means it passed the tests free data can run. Many tests are not checked. '
                  'Prototype only; not legal advice.']
    open(os.path.join(OUT, 'SUMMARY.md'), 'w').write('\n'.join(lines) + '\n')
    print('\n'.join(lines))


if __name__ == '__main__':
    main()
