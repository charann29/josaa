---
title: Scoring System (Points)
tags: [josaa, scoring, algorithm, methodology]
created: 2026-06-08
---

# 05 — Scoring System (Points)

The ordering after the Warangal block is driven by a **Points /100** score blended from six pointers, then converted to a **Percentile** across the post-Warangal pool.

## The six pointers (each normalised 0–100)
| Pointer | Weight | Definition |
|---|---|---|
| **Branch** | 22% | branch quality: CSE=100, CSE(AI/DS)=97, AI/DS=95, M&C=92, IT=90, ECE-VLSI=86, ECE=84, Electronics=80, EEE=78, Instrumentation=68, Mechanical=66, Production=62, Chemical=58, Civil=52, Metallurgy/Materials/Ceramic=46, Mining=40, Bio=38, pure science=33 |
| **Career** | 24% | placement rating ×10 (institute-level, 1–10) |
| **NIRF** | 16% | NIRF 2025 rank → `100 − rank` (≤100); 101–150 band → 10; unranked → 3 |
| **Brand** | 18% | CSE General-GN cutoff strength → `max(0, 100 − brandRank×1.4)` |
| **YourPref** | 12% | Charan's preferred institute order (pasted list) → `max(0, 100 − idx×1.3)` |
| **Culture** | 8% | campus-life rating ×10 (1–10) |

```
points = 0.18*Brand + 0.24*Career + 0.16*NIRF + 0.22*Branch + 0.12*YourPref + 0.08*Culture
         + type_tilt + proximity_nudge
type_tilt   = +8 NIT, 0 IIIT, −8 GFTI   (enforces NIT > IIIT > GFTI)
proximity   = small additive boost for closeness to Telangana (Warangal=0 km baseline)
```

## Career & Culture ratings (institute-level, 1–10) — examples
| Institute | Career | Culture |
|---|---|---|
| NIT Trichy | 9.5 | 9.2 |
| NIT Surathkal | 9.3 | 9.0 |
| NIT Warangal | 9.2 | 9.3 |
| NIT Rourkela | 8.7 | 8.5 |
| NIT Calicut | 8.5 | 8.3 |
| University of Hyderabad | 7.6 | 9.4 |
| (defaults) NIT/IIIT/GFTI | 7.0 / 6.6 / 5.5 | 7.2 / 6.3 / 5.8 |

> Ratings are reputation-based (NIRF tiers + fest/campus-life + placement reputation) — **directional, not exact**.

## Ordering rules layered on top of points
1. **NIT Warangal engineering block forced to the very top** (#1–13), ordered by points within; **Mechanical above Chemical**; **Biotech** pulled into the block (below Chemical); pure sciences demoted out.
2. **Everything else** sorted strictly by points → converted to **percentile**.
3. **Bihar** institutes pushed to the very bottom (penalty in sort key).
4. **Unsuitable branches demoted** (see [[06 — Filters & Rules]]) via a large points penalty so they sit below all real engineering.
5. **University of Hyderabad CSE** was manually anchored (per Charan's choice) — moved through #13 → #40 → finally **#85** (a deep home-city SAFE fallback).

## Percentile
`percentile(seat) = 100 × (# post-Warangal seats with ≤ this points) / N`. Warangal block = 100.

See also: [[06 — Filters & Rules]] · [[07 — Final List & Predicted Outcome]] · [[09 — Decisions Log]]
