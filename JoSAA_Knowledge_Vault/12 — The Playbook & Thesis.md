---
title: The Playbook & Thesis (for the SaaS)
tags: [playbook, thesis, saas, methodology, moat]
created: 2026-06-08
---

# 12 — The Playbook & Thesis (for the SaaS)

> The repeatable end-to-end recipe we executed for Vinay, distilled so it can become a product. Each step maps to a **SaaS feature** and, where relevant, a **moat**.

## The thesis in one line
*College counselling is a data + constraint-satisfaction problem, not an opinion problem.* Given a student's exact rank/category/quota/medical profile and multi-year official cutoffs, the **optimal priority list is computable, explainable, and safe** — and that's exactly what human counsellors do inconsistently and expensively.

---

## The 8-step playbook (repeatable for any student, JoSAA or state board)

### Step 1 — Capture the student profile
Inputs: all rank pools (CRL, category, PwD variants), category (e.g. OBC-NCL), **PwD type** (locomotor/visual/…), gender, **home state**, eligibility (Main/Advanced), and **preferences** (branch family, location, weather, culture vs brand).
→ *Feature:* guided intake form. *Moat:* the PwD/medical + preference modelling most rivals skip.

### Step 2 — Acquire & clean the cutoff data
Multi-year **official Opening/Closing Ranks** (we used JoSAA ORCR 2023–25, all rounds), keyed by institute, branch, **quota** (HS/OS/AI), **category**, seat pool.
→ *Feature:* cutoff database. *Moat:* **curated, cleaned, multi-year data across central + every state board** is the hardest-to-copy asset. (Beware: seat-matrix ≠ cutoffs — a real trap.)

### Step 3 — Compute per-student reachability
For each (institute, branch), test the student's winning pools vs the correct quota, **per year**:
`clears(Y) = (categoryPwD_close[Y] ≥ studentRank) OR (commonPwD_close[Y] ≥ commonRank)`.
Classify by consistency: **SAFE (3/3) / LIKELY (2/3) / BORDERLINE (1/3) / OUT / No-data**.
→ *Feature:* colour-coded reachability. *Key lesson:* **never use averages** — classify per-year (averages hid that Warangal M&C was really borderline).

### Step 4 — Score every option (transparent points)
Blend normalised 0–100 pointers into one score:
`Branch 22% + Career 24% + NIRF 16% + Brand 18% + UserPref 12% + Culture 8%` (+ type tilt NIT>IIIT>GFTI, + proximity). Convert to **percentile**.
→ *Feature:* explainable score (every seat shows *why* it ranks). *Moat:* explainability = trust = fee justification.

### Step 5 — Apply personal filters (safety + fit)
- **Restriction safety** (orthopedic/locomotor) — exclude + runtime-decline. #critical
- Geography / **weather** (cold-North removed), brand tiers, **branch-suitability** (demote field/low-pay branches: Mining, pure-science, Ceramic, Food, Bio-Med), region-last rules (Bihar), eligibility exclusions (B.Arch, female-only).
→ *Feature:* rule layer. *Moat:* disability-restriction safety is a genuine, under-served, high-trust differentiator.

### Step 6 — Assemble the priority list
Honour JoSAA's "**highest qualifying choice wins**" mechanic: reaches on top (free), then realistic, then safe, then last-resort. Allow **explicit overrides** (we forced home NIT first; anchored specific seats).
→ *Feature:* drag-tunable list with guardrails. *Lesson:* keep one source of truth; re-rank cleanly on every preference change.

### Step 7 — Simulate the likely outcome + rate it
Replay the final list against each historical year → "if 2026 ≈ 2024 you get X." Rate the list and **state the ceiling honestly** (top-NIT CSE was simply unreachable — say so).
→ *Feature:* outcome simulator + honest rating. *Moat:* nobody else shows a back-tested prediction.

### Step 8 — Automate portal entry (human-in-the-loop)
Browser engine: **probe → dry-run → remove-all → fill one-by-one with verification**. Restriction dialogs auto-declined; anomalies pause. **Never auto-locks** — student locks.
→ *Feature:* assisted auto-fill. *Lesson:* single-tab/session limits, ~20-min timeout, chunked saves.

---

## Unique value propositions (the pitch)
1. **Per-individual reachability on real multi-year data** — not generic "predictor" averages.
2. **Restriction- & disability-aware** — protects PwD/medical students from disqualifying allotments. Trust-building, under-served.
3. **Explainable scoring** — every rank justified → defensible advice → premium fees.
4. **Back-tested outcome simulation** — "here's what you'd actually get."
5. **Central + state coverage in one place** — JoSAA *and* state boards.
6. **Safe assisted automation** — fills the portal correctly, human keeps the lock.

## What's hard to copy (the moats)
- The **cleaned multi-year, multi-board cutoff dataset** (Step 2).
- The **restriction/medical rule library** (Step 5).
- Trust from **explainability + honest simulation** (Steps 4 & 7).

## Productisation lanes
- **Self-serve SaaS** (student enters profile → scored list + simulation).
- **Assisted service** (counsellor + AI co-pilot; premium, PwD/edge cases).
- **B2B2C white-label** for coaching institutes / schools / state bodies.

See also: [[10 — Product Vision (SaaS + Service)]] · [[05 — Scoring System (Points)]] · [[06 — Filters & Rules]] · [[09 — Decisions Log]]
