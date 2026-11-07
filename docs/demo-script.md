# Demo script: Sites to Call

Two versions: the **30-second video** for the submission (due 2:30 PM) and the **live demo** if
we are a finalist (3:00 PM). Every number below came from a real run on 2026-11-07. Re-run before
recording: live data can change.

**The user (made up, from scenario F02):** a one-person acquisitions lead at a small housing
nonprofit with no GIS team. Their ask: *"Give me ten sites in one city I should call about this
month, and why each one."*

---

## 1. The 30-second video

Screen recording of the browser, with voiceover. About 75 words total.

| Time | On screen | Voiceover |
|---|---|---|
| 0–5 s | Page title and the yellow "Prototype" banner | "A small nonprofit's acquisitions lead has no GIS team. Finding land comes down to luck." |
| 5–10 s | Pick **Anaheim**, click **Find 10 sites**; the map fills with numbered pins | "Pick a city. We pull the city's own housing plan and state surplus-land notices, live." |
| 10–20 s | Card #1, 1515 W North St: 86 lower-income homes planned, hazard badges, transit | "Each site is checked for flood, fire, landslide and transit. Here: 86 lower-income homes planned, near a major bus stop." |
| 20–26 s | Open **Show tests**: SB 684 Possible, SB 4 Unknown | "Which law might open it, with every test shown. If the data doesn't say, it says unknown." |
| 26–30 s | Click **Download CSV** | "Ten calls to make, with sources, in one click." |

**Recording tips**
- Set the browser to about 1280 × 800 and zoom to 110% so text is readable.
- Run the Anaheim search once before recording, so the live services are warm (about 15 seconds
  the first time).
- Record the voiceover separately if the room is loud.

---

## 2. The live demo (finalists)

**Time limit:** not stated in the event docs. Ask an organizer. The script below runs about
3 minutes. Cut section C first if you need to.

### A. The problem (30 s, no screen)

> "California passed a wave of laws that open up land for affordable homes. The parcel data is
> public too. But a small nonprofit still finds sites by luck, because the data is spread across a
> dozen map services and spreadsheets, and nobody has joined them up. Meet our user: the one-person
> acquisitions team at a small housing nonprofit. They want ten sites to call this month, and why."

### B. The tool working (90 s)

1. **Pick Anaheim** and click **Find 10 sites**. While it loads:
   > "This is live. It pulls 124 parcels from Anaheim's own housing element and 16 state
   > surplus-land notices, then checks the top 25 against FEMA flood, fire, landslide and transit
   > maps."
2. **Card #1, 1515 W North St.**
   > "The city's own plan counts 86 lower-income homes here. Three acres, multifamily zone, near a
   > major bus stop, no hazard hits. Every fact has its source next to it."
3. **Open "Show tests".**
   > "Which state law might open it? SB 684 is possible: multifamily zone, under five acres, not in
   > a fire zone. Those tests come straight from HCD's fact sheets. SB 4 is unknown, because free
   > data doesn't say who owns the land. We'd rather say unknown than guess."
4. **Scroll to card #4, 125 W Vermont.**
   > "This one is a surplus notice. A public agency already signalled it may sell. Commercial zone,
   > so AB 2011 is possible. And it tells you who to call: the agency that filed the notice."
5. **Click Download CSV.**
   > "One click, and it's in their pipeline spreadsheet, caveats and sources included."

### C. Honesty moment (30 s)

Switch the city to **Laguna Niguel** and run it. Point to the yellow "Sources disagree" line.
> "When sources disagree, we show it. The regional data says this parcel is in Laguna Niguel; the
> county says Mission Viejo. We don't pick one. Same for coverage: five cities, including Santa
> Ana, have no housing-element rows in this data, and the tool says so."

### D. Scale and close (30 s)

> "Nothing here is Orange County-only except one parcel layer. SCAG covers six counties; HCD, FEMA,
> the state geology survey and Caltrans are statewide. So the next 100 projects are a city picker
> away. Next month, a nonprofit can use this to make ten better calls. Thank you."

---

## 3. Likely judge questions

| Question | Answer |
|---|---|
| How do you rank sites? | Simple points shown on the page: lower-income units planned, surplus notice, transit, minus hazards. The weights are **our judgment, labelled ASSUMPTION**, and anyone can change them in one place (`WEIGHTS` in `app.js`). |
| Is this legal advice? | No. It's a first screen from HCD fact sheets. Every card says to confirm with the city and a land-use attorney. |
| Why is SB 4 always unknown? | SB 4 needs a religious or college owner as of Jan 1, 2024. Owner type isn't in free parcel data. A proxy is our next step, labelled as a proxy. |
| What does "Archive" mean on surplus notices? | All 113 OC notices in HCD's file are marked Archive. We didn't confirm what that means, so the tool treats each one as a lead to ask about. |
| What if a map service is down? | That check shows "unknown (service did not answer)", not a pass. |
| Is any of it made up? | No made-up data. Only the ranking weights are assumptions, and they're labelled. No personal information: we left staff names out of the surplus data. |
| Why not use AI inside the tool? | Every answer needs a source a person can check. Claude built and tested it against live data; the tool itself only shows sourced facts. |
| Why these cities? | Any OC city works. Coverage depends on the source; the picker shows the counts per city. |

---

## 4. Before you present

- [ ] Run Anaheim once to warm up the services. Check card #1 still matches the script.
- [ ] Click **Download CSV** for real once and open the file. (Only the file contents were tested
      so far, not an actual save.)
- [ ] Have a **backup**: a screenshot of the Anaheim results and the CSV, in case Wi-Fi or a
      public service fails on stage.
- [ ] Close other tabs; turn off notifications.
- [ ] Fill in team name, members and video link in `README.md`.
- [ ] Open the repo in a private window to confirm it's public.

## 5. Submission form, ready to paste

- **One-liner:** For a small housing nonprofit's acquisitions lead: pick an Orange County city and
  get ten affordable-housing sites to call this month, with hazards, possible laws, sources and
  who to call.
- **The real user, before and after:** A one-person acquisitions team with no GIS staff. Before:
  open the surplus spreadsheet, the city's housing element and separate flood, fire and transit
  maps, parcel by parcel. After: one click gives a ranked list of ten parcels with why each ranks,
  what is unknown, sources on every fact, and a CSV for their tracker.
- **What it does:** Pulls the city's housing-element sites (SCAG) and state surplus-land notices
  (HCD), checks the top 25 live against FEMA flood, fire, landslide and transit layers, adds zoning,
  address and year built, screens SB 9, SB 684/1123, AB 2011 and SB 4 from HCD fact sheets, and
  exports a CSV. It flags when sources disagree.
- **Sources and assumptions:** See the README "Sources and assumptions" table. The only
  assumptions are the ranking weights (+40 lower-income units, +25 surplus notice, +15 transit,
  −20 per hazard) and the limit of 25 hazard checks per search.
