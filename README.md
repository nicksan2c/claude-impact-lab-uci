# Ten Sites to Call

> For a one-person acquisitions lead at a small housing nonprofit: pick an Orange County city and
> get the ten best affordable-housing site leads to call about this month, with the reasons, the
> hazards, the gaps and the sources shown.

**Team:** [team name: TO FILL]
**Members:** [names: TO FILL]
**Lane:** 1 Find it
**Built at:** Claude Impact Lab: UCI × SoCal Affordable Housing, November 7, 2026

*Prototype only. Not legal, financial or lending advice.*
(The original event README is now at [docs/event-readme.md](docs/event-readme.md).)

## The real user

A small nonprofit's acquisitions lead has no GIS team. Today, sites mostly find them by luck: a
city calls about surplus land, or a church offers a lot. The public data exists, but it is spread
across a dozen map services and spreadsheets.

**Before:** open the HCD surplus spreadsheet, the city's housing element PDF, and FEMA, fire and
transit maps one by one, parcel by parcel.
**After:** pick a city, click once, and get a ranked list of ten parcels. Each one shows why it
ranks, its hazard flags, what is still unknown, and who to call.

## What we built

A single web page (`html/`) that, for the chosen city:

1. Pulls every **housing-element site** (parcels the city itself planned for homes, with
   lower-income unit counts) live from SCAG, plus every **surplus-land notice** from HCD.
2. Gives each site a preliminary score. The top 25 are then checked live against **flood**,
   **fire**, **landslide** and **High Quality Transit Area** layers.
3. Looks up **zoning, acres, address and year built** for the final ten.
4. Shows ten cards and a map. Each card has a "why it ranks here" line, an "unknown" line, a
   source next to every fact, and "who to call" (the agency that filed the notice, or the city's
   planning department).
5. Shows a warning when sources **disagree**, for example when SCAG puts a parcel in one city and
   the county address says another.

**Demo video:** [TO FILL]
**Live demo:** [TO FILL]

## How Claude is used

- Built with Claude Code. It checked each data source's fields and coverage before writing code,
  then wrote and tested the page against live services for Anaheim, Santa Ana, Laguna Beach and
  Laguna Niguel.
- The tool itself makes no AI calls. Every result comes from public data, and every fact links
  to its source, so a person can check it.

## Try it

```bash
git clone https://github.com/nicksan2c/claude-impact-lab-uci.git
cd claude-impact-lab-uci
python3 -m http.server 8123 --directory html
# open http://localhost:8123
```

Needs only Python 3 (or any web server: the `html/` folder deploys as-is to a LAMP host) and an
internet connection. No keys.

To refresh the surplus-land data: download the CSV from the HCD link below, then run
`python3 scripts/build-surplus.py path/to/noa_information.csv`.

## Sources and assumptions

| Item | Source or assumption | Date checked |
|---|---|---|
| Housing-element sites (APN, units by income, data year) | SCAG HousingElementSite_poly_scag, https://maps.scag.ca.gov/scaggis/rest/services/LDX/HousingElementSite_poly_scag/MapServer | 2026-11-07, queried live |
| Surplus-land notices | HCD Surplus Land Act Notices of Availability, https://data.ca.gov/dataset/surplus-land-act-notices-of-availability-received (cached in `html/data/surplus-oc.json`) | downloaded 2026-11-07 |
| Zoning, acres | SCAG Zoning_poly_OR, https://maps.scag.ca.gov/scaggis/rest/services/LDX/Zoning_poly_OR/MapServer | 2026-11-07, live |
| Address, year built | OC Parcels, https://www.ocgis.com/arcpub/rest/services/Map_Layers/Parcels/FeatureServer/0 | 2026-11-07, live |
| Flood zone | OC Floodplains (FEMA zones), https://www.ocgis.com/arcpub/rest/services/Map_Layers/Floodplains/MapServer/0 | 2026-11-07, live |
| Fire hazard zone | OC Fire Hazard Severity Zones LRA, https://www.ocgis.com/arcpub/rest/services/Map_Layers/Fire_Hazard_Severity_Zones_LRA/MapServer/0 | 2026-11-07, live |
| Landslide zone | CGS Landslide Zones, https://services2.arcgis.com/zr3KAIbsRSUyARHG/arcgis/rest/services/CGS_Landslide_Zones/FeatureServer/0 | 2026-11-07, live |
| Transit | Caltrans High Quality Transit Areas, https://caltrans-gis.dot.ca.gov/arcgis/rest/services/CHrailroad/CA_HQ_Transit_Areas/FeatureServer/0 | 2026-11-07, live |
| Ranking points (+40 lower-income units, +25 surplus notice, +15 transit, −20 per hazard) | **ASSUMPTION**: the team's judgment of what makes a site worth a call first. Not from any law or program. Set in `WEIGHTS` in `html/app.js` | 2026-11-07 |
| Hazard checks on the top 25 only | **ASSUMPTION**: a limit to keep requests to public servers low | 2026-11-07 |
| A and V flood zones are high-risk | FEMA flood zone codes: zones starting with A or V are Special Flood Hazard Areas | 2026-11-07 |

## What is real and what is mocked

| Part | Status |
|---|---|
| Housing-element sites, zoning, parcels, hazards, transit | working, live public data |
| Surplus-land notices | working, cached copy of the HCD CSV (dated in the UI) |
| Ranking | working; weights are ASSUMPTION |
| Owner and willingness to sell | **not available**: shown as unknown |

## Where it gets things wrong

- **Coverage is uneven.** The SCAG housing-element layer has no rows for Santa Ana, Huntington
  Beach, Costa Mesa, Tustin or Orange. For those cities only surplus notices show. "No sites
  found" means unknown, not none.
- **All 113 Orange County surplus notices are marked "Archive"** in the HCD file. We did not confirm
  what that status means. Each one is a lead to ask about, not an open offer.
- **Fire check covers local responsibility areas only.** State-responsibility areas are not
  checked, so a "not in LRA zone" badge in the hills does not mean low fire risk.
- **Hazard checks use one point per parcel** (the average of its outline), so a hazard on part of a
  large lot can be missed.
- **Housing-element lists go stale.** A parcel may have sold or been built since it was listed.
  "Year built" from the county is a hint only: blank can mean vacant or just not recorded.
- **Sources disagree on city** for some parcels (for example, Laguna Niguel sites with Mission
  Viejo addresses). The card flags it; we do not pick one.
- **Not checked:** ownership, contamination, water and sewer capacity, slope, local objective
  standards, and which state law (SB 9, SB 684, AB 2011, SB 4) applies.

## Next steps

- **Next month:** add a "which law opens this site" column for AB 2011 (commercial zones) and
  SB 4 (worship-site proxy), each with yes / no / unknown and the test that decided it.
- Add the CAL FIRE state-responsibility layer and the HCD statewide sites inventory to fill the
  missing cities.
- Export to CSV so the list drops into a nonprofit's pipeline tracker.
- **Path to the next 100 projects:** nothing here is Orange County specific except the county
  parcel layer. SCAG covers six counties, and HCD, FEMA, CGS and Caltrans are statewide, so the
  same page can rank sites anywhere in Southern California.

## Data and privacy

This project uses only public data. It contains no personal information about real tenants,
buyers or residents. Staff contact names in the HCD file are left out on purpose; the tool names
the agency instead. It does not file applications or contact any city or person.

## License

MIT, see the LICENSE file in this repo.
