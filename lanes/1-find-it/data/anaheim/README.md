# Anaheim: every parcel screened for SB 9, SB 684/1123, AB 2011 and SB 4

**Prototype only. Not legal advice.** "Possible" means a parcel passed the tests that free public
data can run. Many legal tests cannot be checked from this data (tenants, owner, historic
contributing status, utilities). Confirm every site with the city and a land-use attorney.

Downloaded and screened 2026-11-07. Rebuild with:

```bash
python3 lanes/1-find-it/scripts/fetch_city.py Anaheim
```

```bash
python3 lanes/1-find-it/scripts/screen_city.py Anaheim
```

Counts are in [SUMMARY.md](SUMMARY.md). Other cities use the same scripts and tests; see
[../CITY-COMPARISON.md](../CITY-COMPARISON.md).

## Files

| File | What it is |
|---|---|
| `anaheim-parcels-screened.csv` | All 56,478 Anaheim parcels, with zoning, land use, hazards and a verdict per law |
| `candidates-sb9.csv` | Parcels where SB 9 is Possible or Unknown, largest first |
| `candidates-sb684-sb1123.csv` | Multifamily-zoned lots under 5 acres (SB 684), plus vacant single-family lots (SB 1123) |
| `candidates-ab2011.csv` | Commercially zoned parcels (AB 2011) |
| `candidates-sb4.csv` | 142 parcels mapped as religious facilities or colleges (SB 4 **proxy**) |
| `raw/` | Downloaded source JSON. Git-ignored (about 50 MB); the fetch script recreates it |

## Sources (all checked 2026-11-07)

| Data | Source |
|---|---|
| Parcels, acres, slope, zoning (city code + SCAG code) | SCAG Zoning_poly_OR, `CITY='Anaheim'`: https://maps.scag.ca.gov/scaggis/rest/services/LDX/Zoning_poly_OR/MapServer/0 |
| Existing land use (2024) and code legend | SCAG Existinglanduse_poly_OR: https://maps.scag.ca.gov/scaggis/rest/services/LDX/Existinglanduse_poly_OR/MapServer/0 |
| General plan land use, max density | SCAG GeneralPlan_poly_OR: https://maps.scag.ca.gov/scaggis/rest/services/LDX/GeneralPlan_poly_OR/MapServer/0 |
| Street address | OC Parcels (county), `SITE_ADDRESS` ending in the city name: https://www.ocgis.com/arcpub/rest/services/Map_Layers/Parcels/FeatureServer/0 |
| Historic districts (6) | City of Anaheim PropertyInfo layer 14: https://gis.anaheim.net/map/rest/services/PropertyInfo/MapServer/14 |
| Very high fire hazard zones (local responsibility areas only) | OC Fire_Hazard_Severity_Zones_LRA: https://www.ocgis.com/arcpub/rest/services/Map_Layers/Fire_Hazard_Severity_Zones_LRA/MapServer/0 |
| FEMA special flood hazard areas (`SFHA_TF='T'`) | OC Floodplains: https://www.ocgis.com/arcpub/rest/services/Map_Layers/Floodplains/MapServer/0 |
| Surplus-land notices (public owner) | HCD via data.ca.gov, cached in `html/data/surplus-oc.json` |
| Law tests | HCD Housing Law Fact Sheets (April 2026): https://www.hcd.ca.gov/sites/default/files/docs/planning-and-community/housing-law-fact-sheets.pdf and SB 9 sheet: https://www.hcd.ca.gov/sites/default/files/docs/planning-and-community/lot-splits-and-duplexes-sb-9.pdf |

## The tests

The tests are the same as `html/laws.js`, run on every parcel. The verdicts are **Possible**,
**Unknown** or **Not likely**.

- **SB 9** (Gov Code §§ 65852.21, 66411.7). The test is a single-family zone (SCAG 111x).
  - Parcels in a historic district are **Unknown**. Since AB 1061 (2025), only *contributing
    structures* are excluded, and this data does not show which buildings are contributing.
  - Parcels in a fire or flood zone are **Unknown**. Gov Code 65913.4(a)(6) has exceptions.
  - `sb9_lot_split_size`: the lot is at least 2,400 sq ft. HCD's sheet says cities cannot block
    two 1,200 sq ft lots. The 40% split rule in the statute is **not checked**.
- **SB 684** (Gov Code § 65852.28). The tests are a multifamily zone (SCAG 112x), a lot under 5
  acres, and no very high fire zone.
- **SB 1123** (Gov Code § 66499.41). The tests are a single-family zone and SCAG existing use of
  Vacant (3000s) or Urban Vacant (1900). The result is always **Unknown**, because SB 1123's
  lot-size limit is not in the HCD sheet.
- **AB 2011** (Gov Code §§ 65912.100–65912.140). The test is a zone that allows office, retail
  or parking (SCAG 12xx, 1500, 16xx). Corridor frontage, nearby industrial uses, affordability
  and wage terms are **not checked**.
- **SB 4** (Gov Code § 65913.16). The test is an owner that is a religious institution or an
  independent college. Free data does not show the owner.
  - **PROXY:** SCAG existing land use 1245 (Religious Facilities) or 1265 (Colleges and
    Universities). Public colleges do not qualify, and a church may lease rather than own.
  - A surplus notice (public owner), a very high fire zone or a FEMA flood zone rules a parcel out.

## Known limits

- **5,941 parcels have no usable zoning code**: 5,150 are in specific plans (Platinum Triangle,
  Anaheim Resort and others) and the rest have no SCAG zone code (for example city zone `T`). Their verdicts are Unknown.
  The rules are in each specific plan document.
- The fire layer covers **local** responsibility areas only. State responsibility areas are not
  checked.
- Hazards and historic districts are checked at the parcel's center point. A parcel that only
  touches a zone is not flagged.
- Condo units that share one footprint (SCAG `STACK` > 1) are dropped. The parent parcel is kept.
- About 3,500 parcels have no county site address (blank `address`); use the APN.
- SCAG data is "for planning purposes only" (SCAG layer description). Zoning may be older than the
  city's current map.
