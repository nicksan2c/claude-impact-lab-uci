"""Compare the team's shortlisted cities side by side.

Run after screen_city.py for each city:  python3 lanes/1-find-it/scripts/compare_cities.py
Writes lanes/1-find-it/data/CITY-COMPARISON.md and city-comparison.csv.
"""
import csv
import os
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, '..', 'data')
MARKET = os.path.join(DATA, 'market')

# The team's shortlist (2026-11-07): lower-priced OC cities. Laguna Woods left out on purpose:
# it is a retirement community. Stanton added by the team (no price data in the market file).
CITIES = ['Santa Ana', 'Anaheim', 'Garden Grove', 'Stanton']


def main():
    prices = {r['City']: r for r in csv.DictReader(open(os.path.join(MARKET, 'city-median-asking-price.csv')))}
    notes = {r['City']: r for r in csv.DictReader(open(os.path.join(MARKET, 'city-shortlist-notes.csv')))}

    out = []
    for name in CITIES:
        m = prices.get(name, {})
        slug = name.lower().replace(' ', '-')
        path = os.path.join(DATA, slug, f'{slug}-parcels-screened.csv')
        if not os.path.exists(path):
            print('not screened yet:', name)
            continue
        rows = list(csv.DictReader(open(path)))
        c = {k: Counter(r[k] for r in rows) for k in ('sb9', 'sb684_1123', 'ab2011', 'sb4')}
        out.append({
            'city': name,
            'median_asking_price': m.get('Median asking price—all listed property types', 'no data'),
            'homes_listed': m.get('Total homes listed', 'no data'),
            'parcels': len(rows),
            'sb9_possible': c['sb9']['Possible'],
            'sb9_possible_splittable': sum(r['sb9'] == 'Possible' and r['sb9_lot_split_size'] == 'pass' for r in rows),
            'sb684_possible': c['sb684_1123']['Possible'],
            'sb1123_vacant_sf_lots': sum(r['sb684_1123_path'] == 'SB 1123' and r['sb684_1123'] == 'Unknown'
                                         for r in rows),
            'ab2011_possible': c['ab2011']['Possible'],
            'sb4_proxy_sites': sum(bool(r['sb4_proxy_use']) and r['sb4'] != 'Not likely' for r in rows),
            'zone_unknown': sum(r['zone_type'] in ('unknown', 'specific plan') for r in rows),
            'flood_zone': sum(bool(r['flood_zone']) for r in rows),
            'fire_zone': sum(bool(r['fire_zone']) for r in rows),
            'historic': (f"{sum(bool(r['historic_district']) for r in rows):,}"
                         if rows and rows[0]['historic_district'] != 'not checked' else 'not checked'),
            'shortlist_note': notes.get(name, {}).get('Main distinction', ''),
        })

    cols = list(out[0].keys())
    with open(os.path.join(DATA, 'city-comparison.csv'), 'w', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=cols)
        w.writeheader()
        w.writerows(out)

    fmt = lambda v: f'{v:,}' if isinstance(v, int) else v
    lines = [
        '# City comparison: four-law screen in lower-priced OC cities', '',
        '**Prototype only. Not legal advice.** "Possible" = passed the tests free data can run. '
        'See each city folder README for the tests and limits.', '',
        'Cities: the team\'s shortlist (2026-11-07). Laguna Woods is left out on purpose (retirement '
        'community). Stanton was added by the team and has no price data.',
        'Price and listing counts come from `market/city-median-asking-price.csv` (team-provided; '
        '**original source and date unknown**).', '',
        '| City | Median asking price | Homes listed | Parcels | SB 9 Possible (splittable lot) | '
        'SB 684 Possible | SB 1123 vacant SF lots | AB 2011 Possible | SB 4 proxy sites | Zone unknown | '
        'Flood | Fire (LRA) | Historic |',
        '|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ]
    for r in out:
        lines.append(f"| {r['city']} | {r['median_asking_price']} | {r['homes_listed']} | {fmt(r['parcels'])} | "
                     f"{fmt(r['sb9_possible'])} ({fmt(r['sb9_possible_splittable'])}) | {fmt(r['sb684_possible'])} | "
                     f"{fmt(r['sb1123_vacant_sf_lots'])} | {fmt(r['ab2011_possible'])} | {fmt(r['sb4_proxy_sites'])} | "
                     f"{fmt(r['zone_unknown'])} | {fmt(r['flood_zone'])} | {fmt(r['fire_zone'])} | {r['historic']} |")
    lines += ['', 'Historic districts are mapped for Anaheim only; elsewhere that SB 9 test is not checked.',
              'The fire column covers local responsibility areas (LRA) only.']
    open(os.path.join(DATA, 'CITY-COMPARISON.md'), 'w').write('\n'.join(lines) + '\n')
    print('\n'.join(lines))


if __name__ == '__main__':
    main()
