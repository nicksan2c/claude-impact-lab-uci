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
