# Activity log

## 2026-11-07

**Prompt:** "Claude Impact Lab: UCI × SoCal Affordable Housing"
- Read the repo README and summarized the event, lanes and rules.

**Prompt:** "Find it"
- Read Lane 1 README, DATA-SOURCES.md, pathways.json and scenarios.json.
- Offered three prototypes; the team picked **"Ten sites to call"** (scenario F02).
- Checked data: SCAG housing-element sites (2,126 in OC; uneven by city; Anaheim 124) and the
  HCD surplus-land CSV (113 OC rows, all status "Archive").
- Confirmed SCAG, OC GIS and Caltrans map services allow browser requests.
- Wrote the plan to `tasks/todo.md`. Waiting for approval before building.

**Prompt:** "Approve, start building"
- Wrote `scripts/build-surplus.py`, built `html/data/surplus-oc.json` (113 OC notices).
- Probed hazard layers (flood codes A/AE/AH/AO/VE/X/D; fire class "Very High"), SCAG zoning by APN
  and OC Parcels address fields.
- Built `html/index.html` + `html/app.js` (Bootstrap 5 + Leaflet). Added `.claude/launch.json`
  for a local preview server.
- Tested Anaheim, Santa Ana, Laguna Beach, Laguna Niguel. Added address/year-built lookup,
  "sources disagree" warning, unique div ids; reworded the "Archive" note (meaning unconfirmed).
- Wrote the team README; moved the event README to `docs/event-readme.md`; filled the review in
  `tasks/todo.md`. Committed and pushed.

**Prompt:** "Add which-law column"
- Downloaded and read the HCD Housing Law Fact Sheets (April 2026) for AB 2011, SB 4, SB 9 and the
  Starter Home Revitalization Act (SB 684 / SB 1123).
- Found the SCAG `ZN24_SCAG` zoning code legend in the layer's own description.
- Noted a source disagreement: "under five acres" vs "5 acres or less" for SB 684.
- Wrote Plan 2 in `tasks/todo.md`. Waiting for approval before building.

**Prompt:** "Approve, build it"
- Added `html/laws.js` (which-law rules from HCD fact sheets + SCAG code legend) and the
  "Which law might apply" row with "Show tests" on each card; rules listed in the method box.
- Tested rules on 7 sample cases and live in Anaheim, Laguna Beach and Laguna Niguel.
- Found a SCAG vs city zone-name difference (Laguna Beach R3 = SCAG 1111); now shown on cards.
- Fixed the map zooming out when drawn while hidden.
- Updated README (sources, limits, next steps), todo review and this log. Committed and pushed.

**Prompt:** "Add CSV export"
- Wrote Plan 3 (CSV export: columns, header caveats, file name) in `tasks/todo.md`. Waiting for
  approval before building.

**Prompt:** "Approve, build it" (CSV export)
- Added the "Download CSV" button and `downloadCsv()` (30 columns, caveat lines at the top,
  `unknown` for missing values, file named by city and date).
- Tested the generated file in Laguna Niguel (every row 30 columns, escaping correct).
- Fixed county year built "0" showing as a year. Updated README and todo review. Committed and pushed.

**Prompt:** "Help with demo script"
- Read `docs/judging.md` and `docs/submission.md` (30-second video ideal, live demo for finalists).
- Wrote `docs/demo-script.md`: 30-second video shot list with voiceover, a ~3-minute live demo,
  judge Q&A, a pre-demo checklist and ready-to-paste submission form text. Uses numbers from the
  2026-11-07 test runs (Anaheim, Laguna Niguel). Committed and pushed.

**Prompt:** "Yes, set it up" (GitHub Pages live demo)
- Repo is public; Pages was off. Local `gh` CLI does not run on this Mac (wrong CPU type), so
  Pages could not be switched on from here.
- Confirmed all map services accept requests from https://nicksan2c.github.io.
- Added `.github/workflows/pages.yml` (deploys `html/` on push to main) and the live link in the
  README. Committed and pushed. Pages must be switched on once in repo Settings.

**Prompt:** "verify github connector"
- `gh` CLI signed in as nicksan2c with push/admin on the public repo; SSH push works. The GitHub
  MCP connector needs authorizing via `/mcp`. No changes.

**Prompt:** "summarize the data available in the repo"
- Summarized: one real dataset (113 OC surplus-land notices, all "Archive"), three source
  catalogs, starter lists, synthetic deal and scenarios. No changes.

**Prompt:** "go so get the data so we analyze in anaheim for these scenarios: SB 9 single-family
lot splits, SB 684 / 1123 up to 10 homes no hearing, AB 2011 commercial corridors, SB 4 faith and
college land"
- Added `lanes/1-find-it/scripts/fetch_anaheim.py`: downloads SCAG zoning, land use and general
  plan for Anaheim (57,176 parcels), City of Anaheim parcels and historic districts, OC fire (LRA)
  and FEMA flood zones. Raw files git-ignored.
- Added `screen_anaheim.py`: runs the `laws.js` tests on every parcel; writes a full screened CSV,
  one candidate CSV per law and `SUMMARY.md` in `lanes/1-find-it/data/anaheim/`.
- Checked the HCD SB 9 sheet (April 2026): two 1,200 sq ft lots; historic exclusion is for
  contributing structures (AB 1061). SB 4 uses SCAG land use 1245/1265 as a labeled PROXY.
- Wrote the data README (sources, tests, limits). Committed and pushed.

**Prompt:** (two CSVs: median asking price and shortlist notes) "also consider the cities in the
attached by constrained to these cities and thresholds" (Laguna Woods, Santa Ana, Anaheim, Garden Grove)
- Made the scripts work for any city (`fetch_city.py`, `screen_city.py`); addresses now come from
  the county parcel layer for every city. Copied the two CSVs to `lanes/1-find-it/data/market/`
  (source and date unknown; labeled). Added `compare_cities.py`.

**Prompt:** "did you already gather the data for all those cities? if not do that next"
- Downloads were still running; waited for them.

**Prompt:** "skip Laguna Woods since it's a retirement community / add stanton if not on the list"
- Stopped the job before Laguna Woods; added Stanton. Comparison now uses a fixed list: Santa
  Ana, Anaheim, Garden Grove, Stanton (Stanton has no price data).
- Fixed: a missing historic layer made every SB 9 parcel "Unknown"; now "not checked", as in laws.js.

**Prompt:** "what's the current status and what should be next on this list to analyze?"
- Reported status; recommended a ranked call list per law per city next.
- Screened Garden Grove and Stanton, built `lanes/1-find-it/data/CITY-COMPARISON.md`. Committed and pushed.

**Prompt:** "Yes, build it" (ranked call list per law per city)
- Added `lanes/1-find-it/scripts/rank_sites.py`: top 20 per law (AB 2011, SB 684, SB 1123, SB 4,
  SB 9) per city in `call-list.csv`, top 10 in `CALL-LIST.md`, with a "check before calling"
  line per law and a map link. Ranking (ASSUMPTION): vacant/parking first, then retail/office,
  then other non-housing, then existing housing; bigger lots first. Flood-zone parcels left out.
- Fixed the SCAG legend parser (codes like 1122 had blank labels). Added a `parent_parcel` column;
  parent outlines and duplicate locations are left out of the call list.
- Committed and pushed.

**Prompt:** "Yes, add to app" (call list in the web app)
- Added `html/call-list.html` and `html/call-list.js`: city and law dropdowns, ranked table, numbered
  map, "check before calling" box, method and sources. Reads `html/data/call-list.json`, which
  `rank_sites.py` now writes. Linked from the main page header. Every div has an id.
- Tested in the browser preview: switching city and law, row click to map popup, no console errors.
- Updated the README ("What we built" item 8). Committed and pushed.

**Prompt:** "Yes, merge it" / "Yes, switch it on"
- Merged PR nicksan2c/claude-impact-lab-uci#1 into main. The Pages deploy failed: Pages was not enabled.
- With approval, enabled GitHub Pages (source: GitHub Actions) via the API and re-ran the deploy.
  It succeeded. Live: https://nicksan2c.github.io/claude-impact-lab-uci/ and `/call-list.html`
  (checked: 20 rows and 20 map markers load).

**Prompt:** "it seems that the title Ten Sites to Call is misleading since there are more than 10 cities?" / "Yes, rename it"
- Renamed the app "Sites to Call": page title and heading (`html/index.html`), back link
  (`html/call-list.html`), `app.js` header comment and CSV caveat line, README and demo script
  titles. Kept the scenario quote ("ten sites…"), the "Find 10 sites" button and the CSV line (the
  main page still returns 10). Checked in the preview. Committed and pushed to main.

**Prompt:** "so that changed the title of the web page itself but not the button"
- Changed the main button from "Find 10 sites" to "Find sites" (`html/index.html`). The results
  summary still says how many are shown. Committed and pushed to main.

**Prompt:** "how many cities are in the sites to call drop down list? the call list by law only has 4
cities? it should be updated to the same exact cities as the sites to call page. Please fix"
- Main page dropdown = 30 cities (SCAG housing-element sites or HCD surplus notices, minus
  unincorporated). Added the 26 missing cities; shared list in `lanes/1-find-it/scripts/cities.py`.
- Bigger SCAG pages (2,000) for speed. Full parcel CSVs and SB 9 lists now git-ignored (size).
- The county map server (ocgis.com) began returning errors during the address downloads; stopped
  all county requests. New cities: fire/flood marked "not checked" (flag, never "no hazard"),
  addresses unknown (map link works). `fetch_city.py` now has `--no-hazards` and opt-in `--addresses`.
- Data fixes: city zone "PC" with a generic SCAG code counts as zone unknown (Newport Beach AB 2011
  went from 10,278 to 806); Irvine SB 4 college sites flagged as likely public university land.
- Call list: 2,558 leads in 30 cities; page tested. Committed and pushed to main.

**Prompts in between:** "how big are the CVS per city?", "would I be able to use git-lfs on a free
github account" (yes: 10 GiB storage and 10 GiB bandwidth per month; not used today), "understood",
"how are we doing so far?"
- Update: the county server came back. Fetched fire and flood for the 26 cities one city at a time
  (2 small requests each), re-screened and re-ranked. No site is "not checked" for hazards now;
  the call list has 2,482 leads (flood-zone parcels drop out). Addresses for new cities are still
  unknown (the bulk address search is heavy; skipped). Committed and pushed to main.

**Prompt:** "what about creating the 30 second video"
- No ffmpeg on this Mac and the screen must be recorded by the team, so rewrote the 30-second
  video section of `docs/demo-script.md` around the Call List page (live numbers: 568,842 parcels,
  30 cities; Santa Ana AB 2011 #2 parking lot; Anaheim SB 4 #1 at 1111 N Brookhurst St), with Mac
  recording steps (Cmd + Shift + 5). Committed and pushed.
