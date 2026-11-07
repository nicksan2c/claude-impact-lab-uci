"""Rank screened parcels into a short call list: top sites per law per city.

Run after screen_city.py:  python3 lanes/1-find-it/scripts/rank_sites.py
Writes lanes/1-find-it/data/CALL-LIST.md (top 10) and call-list.csv (top 20).

ASSUMPTION: the ranking is the team's judgment, not from a law or program. It favors land where
nobody lives today (no tenants to displace) and bigger lots. Change the rules below.
"""
import csv
import os

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, '..', 'data')
CITIES = ['Santa Ana', 'Anaheim', 'Garden Grove', 'Stanton']
TOP_CSV, TOP_MD = 20, 10


def tier(code):
    """1 = vacant or parking, 2 = retail, office or commercial, 3 = other non-housing, 4 = housing today."""
    c = code or ''
    if c[:1] == '3' or c in ('1900', '1247', '1414'):
        return 1, 'vacant or parking'
    if c[:3] in ('120', '121', '122', '123'):
        return 2, 'retail, office or commercial'
    if c[:2] == '11':
        return 4, 'housing today (may have tenants)'
    if not c:
        return 3, 'existing use unknown'
    return 3, 'other non-housing use'


def acres(r):
    return float(r['acres'] or 0)


# law: (label, which parcels qualify, sort key, what to check before calling)
LAWS = {
    'AB 2011': (
        lambda r: r['ab2011'] == 'Possible',
        lambda r: (tier(r['use_code'])[0], -acres(r)),
        'Commercial corridor frontage; industrial neighbors; affordability and prevailing-wage terms; '
        'city "exempt and replace" list; tenants on site'),
    'SB 684': (
        lambda r: r['sb684_1123'] == 'Possible' and r['sb684_1123_path'] == 'SB 684' and not r['flood_zone'],
        lambda r: (tier(r['use_code'])[0], -acres(r)),
        'Ten or fewer homes and lots; no tenant or rent-controlled housing removed; utilities; '
        'urban lot'),
    'SB 1123': (
        lambda r: r['sb684_1123_path'] == 'SB 1123' and r['sb684_1123'] == 'Unknown' and not r['flood_zone'],
        lambda r: -acres(r),
        'Confirm the lot is vacant; SB 1123 lot-size limit (read the statute); ten or fewer homes'),
    'SB 4': (
        lambda r: bool(r['sb4_proxy_use']) and r['sb4'] != 'Not likely',
        lambda r: -acres(r),
        'Owner is the religious institution or an independent (private nonprofit) college as of '
        'Jan 1, 2024; public colleges do not qualify (check the Assessor); perimeter mostly urban; '
        'industrial neighbors'),
    'SB 9': (
        lambda r: r['sb9'] == 'Possible' and r['sb9_lot_split_size'] == 'pass'
        and r['use_code'][:3] == '111' and not r['surplus_notice'],
        lambda r: -acres(r),
        'Tenants in last 3 years; rent control or covenant; owner-occupancy affidavit (waived for '
        'nonprofits and land trusts); historic status; 40% split rule'),
}


def main():
    out = []
    for city in CITIES:
        slug = city.lower().replace(' ', '-')
        rows = list(csv.DictReader(open(os.path.join(DATA, slug, f'{slug}-parcels-screened.csv'))))
        # Parent parcels are outlines drawn around other parcels, not lots; one row per location.
        seen, lots = set(), []
        for r in rows:
            if not r['parent_parcel'] and (r['lat'], r['lon']) not in seen:
                seen.add((r['lat'], r['lon']))
                lots.append(r)
        rows = lots
        for law, (keep, key, check) in LAWS.items():
            picked = sorted((r for r in rows if keep(r)), key=key)[:TOP_CSV]
            for i, r in enumerate(picked, 1):
                out.append({
                    'city': city, 'law': law, 'rank': i, 'apn': r['apn'], 'address': r['address'] or 'unknown',
                    'acres': r['acres'], 'zone_city': r['zone_city'], 'existing_use': r['existing_use'] or 'unknown',
                    'use_group': tier(r['use_code'])[1], 'public_owner_notice': r['surplus_notice'] or 'no',
                    'flags': '; '.join(f for f in [f"fire {r['fire_zone']}" if r['fire_zone'] else '',
                                                   f"historic {r['historic_district']}"
                                                   if r['historic_district'] not in ('', 'not checked') else '']
                                       if f),
                    'check_before_calling': check,
                    'map': f"https://www.google.com/maps?q={r['lat']},{r['lon']}",
                })
    cols = list(out[0].keys())
    with open(os.path.join(DATA, 'call-list.csv'), 'w', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=cols)
        w.writeheader()
        w.writerows(out)

    lines = ['# Call list: top sites per law per city', '',
             '**Prototype only. Not legal or financial advice.** These are leads to research, not '
             'approved sites. Owner and willingness to sell are unknown for every site.', '',
             '**How sites are ranked (ASSUMPTION: the team\'s judgment):** only parcels the screen marked '
             '"Possible" (SB 1123: vacant single-family lots; SB 4: church or college land use). Flood-zone '
             'parcels and SCAG "parent" outlines (drawn around other parcels) are left out. AB 2011 and SB 684 rank vacant land and parking first, then retail and '
             'office, then other non-housing uses, then existing housing (tenants may live there); bigger lots '
             'first within each group. SB 9, SB 1123 and SB 4 rank by lot size. Full top 20 in '
             '`call-list.csv`; rules in `scripts/rank_sites.py`.', '',
             '**Open the map link first.** About 4 in 10 sites have no county site address. Large lots '
             'with no address can be common areas, slopes or utility land rather than buildable lots.', '']
    for law, (_, _, check) in LAWS.items():
        lines += [f'## {law}', '', f'Check before calling: {check}.', '']
        for city in CITIES:
            sel = [r for r in out if r['city'] == city and r['law'] == law][:TOP_MD]
            lines.append(f'**{city}**' + ('' if sel else ': no sites'))
            if sel:
                lines += ['', '| # | Address | APN | Acres | Zone | Existing use | Map |', '|---|---|---|---|---|---|---|']
                lines += [f"| {r['rank']} | {r['address']} | {r['apn']} | {r['acres']} | {r['zone_city']} | "
                          f"{r['existing_use']} | [map]({r['map']}) |" for r in sel]
            lines.append('')
    open(os.path.join(DATA, 'CALL-LIST.md'), 'w').write('\n'.join(lines))
    print('wrote', len(out), 'rows')


if __name__ == '__main__':
    main()
