# Market data (team-provided)

| File | What it is |
|---|---|
| `city-median-asking-price.csv` | Median asking price (all listed property types) and total homes listed, for 7 OC cities |
| `city-shortlist-notes.csv` | Why each of 7 cities belongs on an entry-level ownership shortlist |

**Source: provided by the team on 2026-11-07. The original source and the date the listings were
pulled are unknown.** Treat them as context, not facts, until a source and date are added here.
Asking prices are not sale prices.

`scripts/compare_cities.py` screens the team's shortlist (2026-11-07): Santa Ana, Anaheim,
Garden Grove and Stanton. Laguna Woods is left out on purpose because it is a retirement
community. Stanton has no row in the price file, so its price shows as "no data".
