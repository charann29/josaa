---
title: Filters & Rules
tags: [josaa, filters, rules, restrictions]
created: 2026-06-08
---

# 06 — Filters & Rules

## 1. Restriction safety (orthopedic / locomotor) #critical
The single most important rule. A **restricted seat must never be added** — if allotted then rejected at document verification, it jeopardises admission. Protected three ways:
- **Pre-filter:** known walking-restricted institutes removed from the list. Codes:
  `307, 308, 316, 318, 303, 326, 304, 327, 453, 432, 439, 371, 325`
  (Sri City, Vadodara, Dharwad, Kottayam, Guwahati, Raichur, Kalyani, Diu, CU Karnataka, etc.)
- **Runtime decline:** the engine hijacks `window.confirm`/`alert`; if the portal shows an **orthopedic/locomotor** restriction it is auto-declined; **any other** restriction → declined + paused for manual review (see [[08 — Automation Engine]]).
- **Hard guard:** the restricted-code set is also checked before attempting any add.

**Orthopedic keywords auto-declined:** orthopaedically handicapped, locomotor, walking, one/both legs, lower/upper limb, lower extremity, one/both arms, muscular, cerebral palsy, musculoskeletal, leprosy, dwarfism, acid attack.

## 2. Northeast removed
NITs + IIITs + GFTIs in the NE. Regex:
`agartala|arunachal|manipur|meghalaya|mizoram|nagaland|sikkim|silchar|assam|tezpur|shillong|aizawl|imphal|kohima|kokrajar|nirjuli|north[- ]?eastern|nerist|guwahati|tripura`

## 3. Cold-North removed (cold-weather avoidance) — "coldest only" scope
Removed **J&K, Himachal, Uttarakhand**:
- NIT Srinagar (225), NIT Hamirpur (210), NIT Uttarakhand (227), IIIT Una (306), SMVDU Katra (416), CU Jammu (437), Gurukula Kangri Haridwar (403).
- *Kept* (per "coldest only" choice): Punjab, Haryana, Delhi, Rajasthan, UP. (Wider scopes were offered but not chosen.)

## 4. Bihar last
NIT Patna, IIIT Bhagalpur, BIT Patna, NIELIT Patna → forced to the very bottom (codes `214, 322, 441, 446`).

## 5. Unsuitable branches demoted (not removed)
Pushed **below all proper engineering branches** (≈ rank 396+) because they float up on institute brand but are poor fits for a leg disability / low pay:
- **Mining** (field/mine work — worst fit), **pure-science integrated MSc** (Physics, Chemistry, Maths, Life Science), **Ceramic**, **Industrial Design**, **Food** (tech/process), **Bio-Medical**.
- **Kept in normal position:** Biotechnology (home option), Metallurgy/Materials (legit).

## 6. Other exclusions
- **B.Arch / B.Plan** (not eligible).
- **Female-only** seats (male).

## Net effect
Universe trimmed from ~635 raw options → **464** clean, suitable, reachable-or-aspirational choices.

See also: [[02 — Vinay Profile & Constraints]] · [[08 — Automation Engine]]
