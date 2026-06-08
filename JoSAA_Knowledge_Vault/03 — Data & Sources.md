---
title: Data & Sources
tags: [josaa, data, sources, technical]
created: 2026-06-08
---

# 03 — Data & Sources

## Closing-rank data (source of truth)
- **JoSAA Opening/Closing Rank (ORCR) archive** — the authoritative cutoffs, years **2023, 2024, 2025**, rounds 1–6.
- Stored locally as extracted JSON: `_extract/data/{year}_{round}_{page}.json` (8,544 files).
- Each record: institute (code, name, type NIT/IIIT/GFTI), branch (code, name), **quota** (HS/OS/AI), **category** (e.g. `OBC-NCL(PwD)`, `General PwD`, `General`), **seatPool** (we used Gender-Neutral), **closingRank**, year.

> ⚠️ Gotcha: the `rankmatrix_*.json` files we were first given are **seat matrices** (`availableSeats`), **not** cutoffs. The real cutoffs are in the extracted ORCR data above.

## API reference
- `rankmatrix.in` exposes: `POST https://api.rankmatrix.in/api/josaa/ranks/search` with `{year, page, pageSize}` → opening/closing ranks. (We ultimately used the local extract to avoid scrape timeouts ~7s/page vs 45s CDP limit.)

## NIRF 2025 (Engineering) — verified from official source
Pulled from `nirfindia.org/Rankings/2025/...`. Key ranks used:
| Institute | NIRF 2025 |
|---|---|
| NIT Trichy | 9 |
| NIT Rourkela | 13 |
| NIT Surathkal | 17 |
| NIT Calicut | 21 |
| **NIT Warangal** | **28** |
| MNIT Jaipur | 42 |
| VNIT Nagpur | 44 |
| NIT Durgapur | 49 |
| BIT Mesra | 51 |
| NIT Patna | 53 (Bihar) |
| IIEST Shibpur | 54 |
| NIT Jalandhar | 55 |
| MNNIT Allahabad | 62 |
| NIT Delhi | 65 |
| SVNIT Surat | 66 |
| University of Hyderabad | 74 |
| MANIT Bhopal | 81 |
| NIT Jamshedpur | 82 |
| NIT Kurukshetra | 85 |
| NIT Raipur | 86 |
| IIITM Gwalior | 96 |
| NIT Hamirpur | 97 |
| NIT Puducherry | 99 |
| IIIT Allahabad, IIITDM Jabalpur, PEC, NIT Goa, NIFTEM-Thanjavur | 101–150 band |

## Placement data points (directional, web-sourced)
- **NIT Warangal 2024 branch-wise:** Mechanical avg ₹13.59L (highest ₹34.1L, ~83% placed); Chemical ₹12.54L (₹34L, ~87%); Metallurgy ₹11.98L (~67%).
- **UoH B.Tech CSE:** ~100% placement, avg ~₹7–10L (highest ~₹23L); recruiters Amazon, IBM, JP Morgan. Wider UoH BE/BTech 2024 avg ₹12.55L.
- General: across NITs, CSE ≈ 81% / ~₹20L avg vs Mechanical ≈ 73% / ~₹12L.

See also: [[04 — Reachability Methodology]] · [[05 — Scoring System (Points)]]
