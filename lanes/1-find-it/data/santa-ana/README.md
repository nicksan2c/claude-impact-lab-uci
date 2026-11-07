# Santa Ana: every parcel screened for SB 9, SB 684/1123, AB 2011 and SB 4

**Prototype only. Not legal advice.** Downloaded and screened 2026-11-07. Counts are in
[SUMMARY.md](SUMMARY.md); all four cities side by side are in
[../CITY-COMPARISON.md](../CITY-COMPARISON.md).

The sources, tests and limits are the same as Anaheim's: see [../anaheim/README.md](../anaheim/README.md).
The one difference: **Santa Ana has no historic-district layer**, so that SB 9 test is "not
checked" (it does not change the verdict). Confirm historic status with the city.

Files: `santa-ana-parcels-screened.csv` (every parcel) and one `candidates-*.csv` per law.

Rebuild:

```bash
python3 lanes/1-find-it/scripts/fetch_city.py "Santa Ana"
```

```bash
python3 lanes/1-find-it/scripts/screen_city.py "Santa Ana"
```
