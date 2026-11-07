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
