#!/usr/bin/env python3
"""Build public/data/tg-eapcet.json from master_cutoffs.csv.

Source CSV columns: year, phase, source, college_code, college_name, place,
branch, category, opening_rank, closing_rank, seats_filled.

The CSV mixes two category encodings:
  - eduvale (2015-2024):  BASE_GEN/GIRLS_OU/UR     (has region, uses GEN)
  - official (2023-2025): BASE_BOYS/GIRLS          (no region, uses BOYS)

We normalise both into the predictor's key schema  BASE_GENDER_REGION
(e.g. OC_GEN_OU) by:  BOYS -> GEN,  missing region -> OU.

Output record shape (consumed by tg-eapcet-predictor.astro):
  { code, inst, bcode, branch, branchFull,
    close:{key:bestRank}, closingWorst:{key:worstRank},
    final2025:{key:latestRank}, history:{key:[{label,rank}]} }
"""
import csv, json, os, re
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
CSV_IN = os.path.normpath(os.path.join(SITE, "..", "master_cutoffs.csv"))
JSON_OUT = os.path.join(SITE, "public", "data", "tg-eapcet.json")
HIST_OUT = os.path.join(SITE, "public", "data", "tg-eapcet-history.json")

REGIONS = {"OU", "AU", "SVU", "UR"}
GENDERS = {"GEN", "GIRLS", "BOYS"}
# Standard merit categories we expose; everything else (CAP/NCC/PH/SG/MUS...) is dropped.
BASES = {"OC", "BC_A", "BC_B", "BC_C", "BC_D", "BC_E",
         "SC", "SC_I", "SC_II", "SC_III", "ST", "EWS"}
# Phase ordering: which phase best represents a year's settled closing rank.
PHASE_RANK = {"3_final": 3, "2_second": 2, "1_first": 1, "4_special": 0}
# Prefer official numbers over eduvale when both exist for the same cell.
SOURCE_RANK = {"official": 1, "eduvale": 0}

BRANCH_FULL = {
    "AGR": "Agricultural Engineering", "AI": "Artificial Intelligence",
    "AID": "Artificial Intelligence And Data Science",
    "AIM": "Artificial Intelligence And Machine Learning",
    "ANE": "Aeronautical Engineering", "AUT": "Automobile Engineering",
    "BIO": "Bio-Technology", "BME": "Bio-Medical Engineering",
    "BSE": "Building Services Engineering", "CHE": "Chemical Engineering",
    "CIC": "CSE (IoT And Cyber Security Including Block Chain Technology)",
    "CIV": "Civil Engineering", "CME": "Computer Engineering",
    "CS": "Computer Science", "CSA": "Computer Science And Engineering (Artificial Intelligence)",
    "CSB": "Computer Science And Business System",
    "CSC": "Computer Science And Engineering (Cyber Security)",
    "CSD": "Computer Science And Engineering (Data Science)",
    "CSE": "Computer Science And Engineering",
    "CSG": "Computer Science And Engineering (Gaming Technology)",
    "CSI": "Computer Science And Information Technology",
    "CSM": "Computer Science And Engineering (Artificial Intelligence And Machine Learning)",
    "CSN": "Computer Science And Engineering (Networks)",
    "CSO": "Computer Science And Engineering (IoT)",
    "CSW": "Computer Science And Engineering (Software Engineering)",
    "DRG": "Design", "DTD": "Digital Techniques For Design And Planning",
    "ECE": "Electronics And Communication Engineering",
    "ECI": "Electronics And Computer Engineering",
    "ECM": "Electronics And Communication Engineering (Microelectronics)",
    "EEE": "Electrical And Electronics Engineering",
    "EIE": "Electronics And Instrumentation Engineering",
    "ETM": "Electronics And Telematics Engineering",
    "EVL": "Environmental Engineering", "FDT": "Food Technology",
    "GEO": "Geo-Informatics Engineering", "INF": "Information Technology",
    "MCT": "Mechatronics Engineering", "MEC": "Mechanical Engineering",
    "MET": "Metallurgical Engineering",
    "MIN": "Mining Engineering", "MMS": "Mechanical (Manufacturing) Engineering",
    "MMT": "Metallurgical And Materials Engineering",
    "MTE": "Mechatronics Engineering", "PHD": "Pharma D",
    "PHE": "Pharmaceutical Engineering", "PHM": "Pharmacy",
    "PLG": "Planning", "TEX": "Textile Technology",
}
BRANCH_SHORT = {
    "AI": "Artificial Intelligence", "AID": "AI & Data Science", "AIM": "CSE — AI & ML",
    "ANE": "Aeronautical", "BME": "Bio-Medical", "CHE": "Chemical",
    "CIC": "CSE — IoT & Cyber/Blockchain", "CIV": "Civil", "CS": "Computer Science",
    "CSA": "CSE — AI", "CSB": "CSE — Business Systems", "CSC": "CSE — Cyber Security",
    "CSD": "CSE — Data Science", "CSE": "Computer Science", "CSI": "CSE & IT",
    "CSM": "CSE — AI & ML", "CSN": "CSE — Networks", "CSO": "CSE — IoT",
    "CSG": "CSE — Gaming", "CSW": "CSE — Software", "ECE": "Electronics & Comm.",
    "ECI": "Electronics & Computer", "EEE": "Electrical & Electronics",
    "EIE": "Electronics & Instrumentation", "INF": "Information Technology",
    "MCT": "Mechatronics", "MEC": "Mechanical", "MET": "Metallurgical",
    "MIN": "Mining", "MMT": "Metallurgy & Materials", "TEX": "Textile",
    "FDT": "Food Technology", "AGR": "Agricultural", "AUT": "Automobile",
    "BIO": "Bio-Technology", "CHE": "Chemical", "PLG": "Planning",
}

ART = {"of", "and", "the", "for", "a", "an", "in"}

def titlecase(s):
    s = re.sub(r"\s+", " ", s.replace("\n", " ")).strip().lower()
    out = []
    for i, w in enumerate(s.split(" ")):
        if i and w in ART:
            out.append(w)
        else:
            out.append(w[:1].upper() + w[1:])
    return " ".join(out)

def norm_category(cat):
    """Return canonical key BASE_GENDER_REGION, or None to drop."""
    c = cat.upper()
    c = re.sub(r"\([^)]*\)", "", c)          # strip trailing seat-count parens
    c = re.sub(r"[\s]+", "_", c.strip())     # whitespace artifacts -> underscore
    c = re.sub(r"_+", "_", c).strip("_")
    parts = c.split("_")
    region = parts[-1] if parts and parts[-1] in REGIONS else None
    if region:
        parts = parts[:-1]
    gender = parts[-1] if parts and parts[-1] in GENDERS else None
    if not gender:
        return None                          # special quotas with no gender -> drop
    parts = parts[:-1]
    base = "_".join(parts)
    if base not in BASES:
        return None                          # CAP/NCC/PH/SG/MUS and the like -> drop
    if gender == "BOYS":
        gender = "GEN"
    region = region or "OU"
    return f"{base}_{gender}_{region}"

def main():
    # cell[(code,branch)][key][year] = (phase_rank, source_rank, rank)
    cell = defaultdict(lambda: defaultdict(dict))
    names = {}        # code -> best college name seen
    years_seen = set()
    rows = kept = 0
    with open(CSV_IN, newline="") as f:
        for r in csv.DictReader(f):
            rows += 1
            try:
                rank = int(r["closing_rank"])
            except (ValueError, KeyError):
                continue
            if rank <= 0:
                continue
            key = norm_category(r["category"])
            if not key:
                continue
            year = r["year"]
            ph = PHASE_RANK.get(r["phase"], -1)
            sp = SOURCE_RANK.get(r["source"], -1)
            ck = (r["college_code"], r["branch"])
            prev = cell[ck][key].get(year)
            # keep the better phase; tie-break on source; then lower (more competitive) rank
            cand = (ph, sp, -rank)
            if prev is None or cand > (prev[0], prev[1], -prev[2]):
                cell[ck][key][year] = (ph, sp, rank)
            nm = titlecase(r["college_name"])
            if nm and len(nm) > len(names.get(r["college_code"], "")):
                names[r["college_code"]] = nm
            years_seen.add(year)
            kept += 1

    # Slim index (fast first paint) carries close/worst/final2025 only.
    # Full year-by-year history is split out and lazy-loaded per college on demand.
    out, hist_out = [], {}
    for (code, branch), keys in cell.items():
        close, worst, final, hist = {}, {}, {}, {}
        for key, by_year in keys.items():
            series = [(y, by_year[y][2]) for y in by_year]
            series.sort(key=lambda x: x[0], reverse=True)   # newest first
            ranks = [rk for _, rk in series]
            close[key] = min(ranks)
            worst[key] = max(ranks)
            if "2025" in by_year:
                final[key] = by_year["2025"][2]
            hist[key] = [{"label": y, "rank": rk} for y, rk in series]
        out.append({
            "code": code,
            "inst": names.get(code, code),
            "bcode": branch,
            "branch": BRANCH_SHORT.get(branch, BRANCH_FULL.get(branch, branch)),
            "branchFull": BRANCH_FULL.get(branch, branch),
            "close": close, "closingWorst": worst, "final2025": final,
        })
        hist_out[f"{code}|{branch}"] = hist

    # stable order: by college code then branch
    out.sort(key=lambda r: (r["code"], r["bcode"]))
    os.makedirs(os.path.dirname(JSON_OUT), exist_ok=True)
    with open(JSON_OUT, "w") as f:
        json.dump(out, f, ensure_ascii=False, separators=(",", ":"))
    with open(HIST_OUT, "w") as f:
        json.dump(hist_out, f, ensure_ascii=False, separators=(",", ":"))

    colleges = len({r["code"] for r in out})
    print(f"rows read: {rows:,}  kept: {kept:,}")
    print(f"years: {sorted(years_seen)}")
    print(f"records (college-branch): {len(out):,}  colleges: {colleges}")
    print(f"wrote {JSON_OUT} ({os.path.getsize(JSON_OUT):,} bytes)")
    print(f"wrote {HIST_OUT} ({os.path.getsize(HIST_OUT):,} bytes)")

if __name__ == "__main__":
    main()
