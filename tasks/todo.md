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
