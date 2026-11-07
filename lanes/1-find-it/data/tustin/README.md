# Tustin: every parcel checked for SB 9, SB 684/1123, AB 2011 and SB 4

**Prototype only. Not legal advice.** Counts are in [SUMMARY.md](SUMMARY.md); all cities side by side
are in [../CITY-COMPARISON.md](../CITY-COMPARISON.md); top sites are in [../CALL-LIST.md](../CALL-LIST.md).

Sources, tests and limits are the same as Anaheim's: see [../anaheim/README.md](../anaheim/README.md).

The one difference: **Tustin has no historic-district layer**, so that SB 9 test is "not checked" (it does not change the verdict). Confirm historic status with the city.

Files: one `candidates-*.csv` per law. The full parcel CSV and the SB 9 list are not in git because of
size. Rebuild them:

```bash
python3 lanes/1-find-it/scripts/fetch_city.py "Tustin"
```

```bash
python3 lanes/1-find-it/scripts/screen_city.py "Tustin"
```
