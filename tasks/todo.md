# Plan: "Ten Sites to Call" (Lane 1: Find it)

**User:** a one-person acquisitions lead at a small housing nonprofit (scenario F02).
**Question it answers:** "Give me ten sites in one city I should call about this month, and why each one."

## What it does

1. Pick an Orange County city (default: **Anaheim**).
2. The page pulls candidate sites from two public sources:
   - **Housing-element sites** (SCAG `HousingElementSite_poly_scag`, live query). Gives APN and
     the units the city itself planned for that parcel, by income level.
   - **Surplus-land notices** (HCD, data.ca.gov CSV, cached copy). Gives APN, address, acres,
     zoning, existing use and the agency that issued the notice.
3. Each site is checked live against hazard and access layers:
   flood (OC Floodplains), fire (OC Fire Hazard Severity Zones LRA), landslide (CGS), and transit
   (Caltrans High Quality Transit Areas).
4. Sites are ranked with a simple, visible score. Top 10 show as cards plus a map. Each card says
   **why** it ranks, **what is unknown**, the **source and date** for every fact, and a
   **who to call** line (the notice-issuing agency, or the city planning department).
5. Every result says: prototype, not legal or financial advice; confirm with a professional.

## Facts found while planning (checked 2026-11-07)

- SCAG housing-element layer has 2,126 OC sites, but **coverage is uneven**: Anaheim 124, Garden
  Grove 946, Irvine 44. Santa Ana, Huntington Beach, Costa Mesa, Tustin and Orange have **0 rows**.
  The city picker will show the count per city and say when a city has no data.
- All 113 OC surplus-land notices in the HCD file have status **"Archive"**. They are leads to ask
  about, not open offers. The UI will say this on every surplus card.
- Owner and "willing to sell" are **unknown** for every site (not in free data). Shown as unknown.
- The map services allow browser requests, so no server code is needed.

## Ranking (ASSUMPTION, to be shown in the UI and README)

Simple points so a user can see and argue with it. Weights are the team's judgment, not from a
source:
- Lower-income units planned in the housing element: + points
- Has a surplus notice (public owner already signaled it may sell): + points
- Inside a High Quality Transit Area: + points
- Flood, fire or landslide hit: − points and a red flag (not removed; the user decides)

## Files (all deployable files in `html/`)

- `html/index.html`: Bootstrap 5 page, every div has a unique id
- `html/app.js`: queries, scoring, rendering
- `html/data/surplus-oc.json`: OC rows from the HCD surplus CSV, with source URL and download date
- `scripts/build-surplus.py`: rebuilds that JSON from the CSV (not deployed)
- `README.md` section for the team (from `templates/TEAM-README.md`)
- `docs/activity.md`: log of every prompt and action

## Todo

- [x] 1. Build `surplus-oc.json` from the HCD CSV (clean "9,005 SF" style sizes to acres)
- [x] 2. Page skeleton: city picker, results list, map (Leaflet), disclaimer banner
- [x] 3. Load housing-element sites for the chosen city (live SCAG query) + surplus rows
- [x] 4. Hazard and transit checks per site (flood, fire, landslide, HQTA)
- [x] 5. Scoring + top-10 cards with "why", "unknown", sources and dates, who to call
- [x] 6. Test with Anaheim and one city with no data; check every number traces to a source
- [x] 7. Team README (sources, ASSUMPTIONs, limits, path to 100 projects)
- [x] 8. Commit and push after each working step

**Stretch (not done):** flag "maybe already built" using OC Building Footprints; export the
list to CSV.

## Review

- Built a single static page in `html/` (`index.html`, `app.js`, `data/surplus-oc.json`). No
  server code; it queries public map services from the browser.
- `scripts/build-surplus.py` turns the HCD CSV into the OC JSON (113 rows; "9,005 SF" sizes
  converted to acres; staff contact names left out).
- Added two things not in the plan: county **address + year built** per site, and a **"sources
  disagree"** warning when SCAG's city and the county address differ.
- Tested live: Anaheim (140 candidates), Santa Ana (surplus only), Laguna Beach (fire flags fire),
  Laguna Niguel (landslide flag and city mismatches). Every div has a unique id.
- The root README is now the team README (from the template). The event README moved to
  `docs/event-readme.md`.
- Open items: team name, members, demo video and live link in README; SRA fire layer;
  law-by-law eligibility; CSV export.

---

# Plan 2: "Which law" column

Add a row to each site card: **SB 9 · SB 684/1123 · AB 2011 · SB 4**, each marked **Possible**,
**Not likely** or **Unknown**, with the reason, and a "show tests" list of what passed, what failed
and what was not checked.

## Sources (read 2026-11-07)

- HCD Housing Law Fact Sheets, April 2026:
  https://www.hcd.ca.gov/sites/default/files/docs/planning-and-community/housing-law-fact-sheets.pdf
- HCD SB 9 fact sheet, April 2026:
  https://www.hcd.ca.gov/sites/default/files/docs/planning-and-community/lot-splits-and-duplexes-sb-9.pdf
- SCAG Zoning_poly_OR layer description: the `ZN24_SCAG` code legend (1110s single-family, 1120s
  multifamily, 1200s office, retail and commercial, 1600s mixed residential and commercial, 7777
  specific plan, 9999 unknown).

## Rules the tool will apply (only what those sources say)

| Law | Test the tool can check | Result |
|---|---|---|
| SB 9 (Gov Code 65852.21, 66411.7) | Single-family zone (SCAG 111x) | Possible if yes, Not likely if no |
| SB 684 (Gov Code 65852.28, 66499.41) | Multifamily zone (112x; 16xx counts as Possible only if the zone allows multifamily); lot under 5 acres; not in a fire hazard zone | Possible / Not likely |
| SB 1123 | Single-family zone **and vacant** lot | Unknown: vacancy not confirmed; lot-size limit is not in the HCD fact sheet |
| AB 2011 (Gov Code 65912.100–.140) | Zone allows office, retail or parking (SCAG 12xx commercial codes, 16xx mixed) | Possible / Not likely |
| SB 4 (Gov Code 65913.16) | Not in a Very High fire zone or FEMA special flood hazard area; owner type | Not likely if a hazard hits or a public agency filed a surplus notice; otherwise **Unknown** (owner not in free data) |
| Any law | Specific plan (7777) or blank zoning | Unknown: read the specific plan |

**Source disagreement to show:** HCD's SB 684 sheet says lots "under five acres" in one paragraph
and "5 acres or less" in another. A lot of exactly 5.00 acres is marked Unknown with both quotes.

**Always listed as "not checked":** urbanized area, historic status, tenants or rent control in the
last few years, wetlands and farmland, industrial neighbors (SB 4), labor and affordability terms,
local exemptions, objective standards.

Condo conversion is left out: no source is loaded for it.

## Todo

- [x] 1. Add `LAWS` rules in `app.js`, each with its source URL and date
- [x] 2. Add the "Which law" row with badges and a "show tests" list to each card
- [x] 3. Add the rules and sources to the "How it works" box
- [x] 4. Test Anaheim, Laguna Beach and Laguna Niguel; check each verdict against its zoning code
- [x] 5. Update README, review section and activity log; commit and push

## Review (Plan 2)

- New file `html/laws.js`: `zoneType()` maps SCAG codes to zone types; `checkLaws()` returns
  Possible / Not likely / Unknown per law, with every test marked passed, failed, unknown or not
  checked. Each law links to its HCD fact sheet and Gov Code sections.
- `app.js`: zoning lookup now also gets `ZN24_SCAG`; each card has a "Which law might apply" row
  and a "Show tests" list; the zoning line shows the SCAG category; the method box lists the rules.
- Tested 7 sample cases in Node and live in Anaheim, Laguna Beach and Laguna Niguel. Found that
  Laguna Beach "R3" is SCAG single-family, so the card now shows both codes and a note.
- Fixed: the map could zoom out to the world map if drawn while hidden (`invalidateSize`).
- Ranking is unchanged; the law screen does not affect scores.

---

# Plan 3: CSV export

A **Download CSV** button appears after a search. It saves the 10 sites shown, one row per site,
so the list drops into a spreadsheet or pipeline tracker. Built in the browser; nothing is sent
anywhere.

**File name:** `ten-sites-<city>-<date>.csv`

**Columns:** rank, score, address, APN, city, source type (housing element / surplus notice / both),
lower / moderate / above-moderate units planned, housing element data year, surplus agency, notice
date, notice status, city zoning, SCAG category, acres, year built, flood, fire, landslide, transit,
SB 9, SB 684/1123, AB 2011, SB 4, why it ranks, who to call, sources disagree (yes/no), and
lat/lon.

**Header rows (so the file carries its own caveats):** the first lines say "Prototype, not legal or
financial advice", the date checked, that scores are ASSUMPTION, and the source URLs. Unknowns are
written as `unknown`, never left blank.

## Todo

- [x] 1. Add a hidden "Download CSV" button next to "Find 10 sites"; show it after results load
- [x] 2. Build rows from the same data the cards use (no new requests)
- [x] 3. Test: download for Anaheim, open the file, check columns, commas and quotes in addresses
- [x] 4. Update README, review section, activity log; commit and push

## Review (Plan 3)

- `index.html`: a "Download CSV" button under "Find 10 sites", hidden until results load.
- `app.js`: `downloadCsv()` builds the file from the same data the cards use (no new requests).
  The law results are saved on each site when its card is drawn, so the CSV and cards always match.
- Tested in Laguna Niguel: 4 note lines, then a header and 10 rows, every row 30 columns; commas
  and quotes are escaped; "sources disagree" rows carry the county address.
- Fixed: the county "year built" value "0" now shows as blank (card and CSV).
