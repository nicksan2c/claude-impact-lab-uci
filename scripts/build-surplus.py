"""Build html/data/surplus-oc.json from the HCD Surplus Land Act notices CSV.

Source: https://data.ca.gov/dataset/surplus-land-act-notices-of-availability-received
Usage:  python3 scripts/build-surplus.py path/to/noa_information.csv

Keeps only Orange County cities. Staff contact names are left out on purpose:
the tool points to the issuing agency instead.
"""
import csv
import json
import re
import sys
from datetime import date

CSV_URL = ("https://publish.data.ca.gov/dataset/0a52a6d9-4c1f-4905-8d25-6117c60c35c8/resource/"
           "bb81599a-e130-48aa-a6e3-bbcce9392d4f/download/noa_information.csv")

OC_CITIES = {
    "ALISO VIEJO", "ANAHEIM", "BREA", "BUENA PARK", "COSTA MESA", "CYPRESS", "DANA POINT",
    "FOUNTAIN VALLEY", "FULLERTON", "GARDEN GROVE", "HUNTINGTON BEACH", "IRVINE", "LA HABRA",
    "LA PALMA", "LAGUNA BEACH", "LAGUNA HILLS", "LAGUNA NIGUEL", "LAGUNA WOODS", "LAKE FOREST",
    "LOS ALAMITOS", "MISSION VIEJO", "NEWPORT BEACH", "ORANGE", "PLACENTIA",
    "RANCHO SANTA MARGARITA", "SAN CLEMENTE", "SAN JUAN CAPISTRANO", "SANTA ANA", "SEAL BEACH",
    "STANTON", "TUSTIN", "VILLA PARK", "WESTMINSTER", "YORBA LINDA",
}


def to_acres(text):
    """'9,005 SF' -> 0.207; '1.5' -> 1.5; anything else -> None (unknown)."""
    t = (text or "").strip().upper().replace(",", "")
    m = re.match(r"^([\d.]+)\s*(SF|SQ\.? ?FT\.?|SQUARE FEET)?\s*(AC|ACRES?)?$", t)
    if not m:
        return None
    n = float(m.group(1))
    return round(n / 43560, 3) if m.group(2) else n


def to_float(text):
    try:
        return float(text)
    except (TypeError, ValueError):
        return None


rows = []
with open(sys.argv[1], encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        city = r["City"].strip().upper()
        if city not in OC_CITIES:
            continue
        rows.append({
            "apn": r["APN"].strip(),
            "address": r["Address"].strip(),
            "city": city,
            "lon": to_float(r["x"]),
            "lat": to_float(r["y"]),
            "acres": to_acres(r["Parcel Size (Gross Acres)"]),
            "size_raw": r["Parcel Size (Gross Acres)"].strip(),
            "zoning": r["General Plan/Zoning"].strip(),
            "existing_use": r["Existing Use/Vacancy"].strip(),
            "agency": r["Local Agency"].strip(),
            "date_issued": r["Date Notice Issued"].strip(),
            "status": r["NOA Status"].strip(),
            "notice_link": r["Notice Website Link"].strip(),
        })

out = {
    "source": "HCD Surplus Land Act Notices of Availability (data.ca.gov)",
    "source_url": "https://data.ca.gov/dataset/surplus-land-act-notices-of-availability-received",
    "csv_url": CSV_URL,
    "downloaded": date.today().isoformat(),
    "rows": rows,
}
with open("html/data/surplus-oc.json", "w") as f:
    json.dump(out, f, indent=1)
print(len(rows), "rows;", sum(r["acres"] is None for r in rows), "with unknown acres")
