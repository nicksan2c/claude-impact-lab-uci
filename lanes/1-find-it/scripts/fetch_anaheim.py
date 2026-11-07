"""Download public parcel, zoning, land-use and hazard data for Anaheim.

Run:  python3 lanes/1-find-it/scripts/fetch_anaheim.py
Writes raw JSON to lanes/1-find-it/data/anaheim/raw/ (git-ignored; about 50 MB).
Pages slowly (one request at a time, with a pause) so we do not load the servers.
Sources are listed in lanes/1-find-it/data/anaheim/README.md.
"""
import json
import os
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, '..', 'data', 'anaheim', 'raw')
SCAG = 'https://maps.scag.ca.gov/scaggis/rest/services/LDX'
ANA = 'https://gis.anaheim.net/map/rest/services/PropertyInfo/MapServer'
OCGIS = 'https://www.ocgis.com/arcpub/rest/services/Map_Layers'
PAUSE = 0.7  # seconds between requests
CITY = "CITY='Anaheim'"

# name: (layer url, where, fields, with geometry)
LAYERS = {
    'scag_zoning': (f'{SCAG}/Zoning_poly_OR/MapServer/0', CITY,
                    'PID24,APN24,PARENT_INDEX,STACK,ACRES,SLOPE,ZN24_CITY,ZN24_SCAG,YEAR_ZN', True),
    'scag_landuse': (f'{SCAG}/Existinglanduse_poly_OR/MapServer/0', CITY,
                     'PID24,LU24,LU24_2ND,YEAR', False),
    'scag_genplan': (f'{SCAG}/GeneralPlan_poly_OR/MapServer/0', CITY,
                     'PID24,GP24_CITY,GP24_SCAG,DEN_MAX,FAR_MAX,YEAR_GP', False),
    'anaheim_parcels': (f'{ANA}/0', '1=1',
                        'APN,HSENO,DIR,STR,SFX,ZIP,CITY,LOTAREA,UNITS,BLDGAREA,STORIES,USETYPE', False),
    'anaheim_historic': (f'{ANA}/14', '1=1', 'DISTRICTNAME,STATUS,DISTRICTTYPE', True),
}
# Hazard layers clipped to the Anaheim bounding box (filled in after zoning downloads).
HAZARDS = {
    'oc_fire_lra': (f'{OCGIS}/Fire_Hazard_Severity_Zones_LRA/MapServer/0', '1=1', 'HAZ_CLASS,HAZ_CODE,SRA'),
    'oc_flood_sfha': (f'{OCGIS}/Floodplains/MapServer/0', "SFHA_TF='T'", 'FLD_ZONE,ZONE_SUBTY,SFHA_TF'),
}


def get(url, params):
    data = urllib.parse.urlencode({**params, 'f': 'json'}).encode()
    for attempt in range(4):
        try:
            req = urllib.request.Request(url + '/query', data=data,
                                         headers={'User-Agent': 'impact-lab-prototype'})
            with urllib.request.urlopen(req, timeout=120) as r:
                out = json.load(r)
            if 'error' in out:
                raise RuntimeError(out['error'])
            time.sleep(PAUSE)
            return out
        except Exception as e:  # retry slowly, then give up
            print('  retry', attempt + 1, e)
            time.sleep(5 * (attempt + 1))
    raise RuntimeError(f'failed: {url}')


def fetch(name, url, where, fields, geom, extra=None):
    path = os.path.join(RAW, name + '.json')
    if os.path.exists(path):
        print(name, 'already downloaded')
        return json.load(open(path))
    base = {'where': where, **(extra or {})}
    ids = sorted(get(url, {**base, 'returnIdsOnly': 'true'})['objectIds'] or [])
    print(name, len(ids), 'rows')
    feats = []
    for i in range(0, len(ids), 1000):
        chunk = ids[i:i + 1000]
        params = {'objectIds': ','.join(map(str, chunk)), 'outFields': fields,
                  'returnGeometry': 'true' if geom else 'false'}
        if geom:
            params.update(outSR=4326, geometryPrecision=6, maxAllowableOffset=0.00003)
        feats += get(url, params)['features']
        print(f'  {len(feats)}/{len(ids)}')
    out = {'source': url, 'where': where, 'downloaded': time.strftime('%Y-%m-%d'), 'features': feats}
    json.dump(out, open(path, 'w'))
    return out


def main():
    os.makedirs(RAW, exist_ok=True)
    legend = os.path.join(RAW, 'scag_legend.txt')  # SCAG land-use code legend (layer description)
    if not os.path.exists(legend):
        with urllib.request.urlopen(LAYERS['scag_landuse'][0] + '?f=json', timeout=60) as r:
            open(legend, 'w').write(json.load(r)['description'])
    got ={n: fetch(n, *spec) for n, spec in LAYERS.items()}
    xs, ys = [], []
    for f in got['scag_zoning']['features']:
        for ring in (f.get('geometry') or {}).get('rings', []):
            for x, y in ring:
                xs.append(x)
                ys.append(y)
    env = {'geometry': f'{min(xs)},{min(ys)},{max(xs)},{max(ys)}', 'geometryType': 'esriGeometryEnvelope',
           'inSR': 4326, 'spatialRel': 'esriSpatialRelIntersects'}
    for n, (url, where, fields) in HAZARDS.items():
        fetch(n, url, where, fields, True, env)


if __name__ == '__main__':
    main()
