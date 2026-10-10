"""Download WHO daily LMS tables and extract gender,day,l,m,s without rounding.

Run from any directory with Python 3; no third-party packages are required.
"""

import csv
import io
from pathlib import Path
import urllib.request
import xml.etree.ElementTree as ET
import zipfile

BASE = "https://cdn.who.int/media/docs/default-source/child-growth/child-growth-standards/indicators/"
OUTPUT = Path(__file__).resolve().parents[1] / "src/shared/data"
NS = {"s": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def download_rows(url):
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=60) as response:
        workbook = zipfile.ZipFile(io.BytesIO(response.read()))
    strings = ET.fromstring(workbook.read("xl/sharedStrings.xml"))
    shared = ["".join(item.itertext()) for item in strings]
    sheet = ET.fromstring(workbook.read("xl/worksheets/sheet1.xml"))
    rows = []
    for row in sheet.findall(".//s:sheetData/s:row", NS):
        cells = {}
        for cell in row.findall("s:c", NS):
            value = cell.find("s:v", NS)
            if value is not None:
                text = value.text
                if cell.get("t") == "s":
                    text = shared[int(text)]
                column = "".join(c for c in cell.get("r") if c.isalpha())
                cells[column] = text
        rows.append(cells)
    assert [rows[0].get(c) for c in "ABCD"] == ["Day", "L", "M", "S"], rows[0]
    data = [[row[c] for c in "ABCD"] for row in rows[1:]]
    assert [int(row[0]) for row in data] == list(range(1857))
    assert all(float(row[2]) > 0 and float(row[3]) > 0 for row in data)
    return data


if __name__ == "__main__":
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for indicator, folder, prefix in [
        ("height", "length-height-for-age/expandable-tables", "lhfa"),
        ("weight", "weight-for-age/expanded-tables", "wfa"),
    ]:
        combined = []
        versions = {
            ("height", "boys"): "7b4a3428_12",
            ("height", "girls"): "27f1e2cb_10",
            ("weight", "boys"): "65cce121_10",
            ("weight", "girls"): "f01bc813_10",
        }
        for gender, sex in [("M", "boys"), ("F", "girls")]:
            url = f"{BASE}{folder}/{prefix}-{sex}-zscore-expanded-tables.xlsx?sfvrsn={versions[indicator, sex]}"
            combined.extend([gender, *row] for row in download_rows(url))
        path = OUTPUT / f"who-{indicator}-for-age.csv"
        with path.open("w", newline="", encoding="utf-8") as output:
            writer = csv.writer(output, lineterminator="\n")
            writer.writerow(["gender", "day", "l", "m", "s"])
            writer.writerows(combined)
        print(f"Saved {len(combined)} daily LMS rows to {path}")
