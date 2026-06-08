---
title: Code & Scripts
tags: [code, technical, saas, automation]
created: 2026-06-08
---

# 14 — Code & Scripts

**Separation of concerns (important):**
- **`/code`** = the **generic product code** — contains **NO specific options**. The automation engine fills *whatever* list it's given.
- **`/sample_data`** = one student's data (Vinay's queue & output) — **just sample input, not the product.**

## `code/josaa_pipeline.py`  ⭐ the core engine (the IP)
The full **profile → reachability → points → filters → ordered list → back-test** pipeline, generalised with a `STUDENT` config block so it works for any candidate.
- Run: `python3 josaa_pipeline.py /path/to/_extract/data`
- Output: `priority_list.json` + prints the back-tested allotment.
- **Verified:** reproduces the 464-row list and the exact prediction
  (2023→Warangal M&C, 2024→Warangal Chemical, 2025→Warangal Mechanical).
- Edit the `STUDENT` dict (ranks/pools/home institute), `W` (weights), and the filter
  sets (`RESTRICT_INST`, `COLD_INST`, `BIHAR_INST`, `is_demoted_branch`) to retune.
- This is the function the **SaaS scoring service** wraps (vault note 12).

Key blocks inside it:
- `load()` — parse JoSAA ORCR JSON. (Remember: seat-matrix ≠ cutoffs.)
- `reach()` — per-year SAFE/LIKELY/BORDERLINE/OUT/No-data (never averages).
- `build()` — the six-pointer score, home-block forcing, demotions, UoH anchor, percentile.
- `simulate()` — replay the list against each historical year.

## `code/josaa_fill_engine.js`  ⭐ the browser fill engine (→ Chrome extension)
Content-script kernel for the **Chrome extension product** (vault note 13).
`josaaProbe → josaaDryRun → josaaRemoveAll → josaaFill → josaaReport`,
restriction-safe (auto-declines orthopedic, pauses on others), never auto-locks.

## `code/queue_TEMPLATE.js`  — the INPUT FORMAT (generic, no real options)
Shows the schema `{rank, ic, bc, inst, branch, reach}` with placeholder rows. The engine
fills *whatever* you put in `window.QUEUE`. **No specific options live in the product code.**

## `sample_data/josaa_queue.js` + `sample_data/Vinay_choice_queue.json` + `priority_list.json`
One student's (Vinay's) ordered 464-item list and the pipeline output — **sample input/output only**,
deliberately kept OUT of `/code`. Interchangeable data; swap in any student's list.

## How the two pieces compose (the product)
```
   student profile ─▶ josaa_pipeline.py ─▶ priority_list.json ─▶ josaa_queue.js
                          (SaaS brain)                              │
                                                                    ▼
                                              josaa_fill_engine.js (extension)
                                                 ─▶ fills portal, human locks
```

## To rebuild / extend in a new session
1. Connect the `josaa` folder.
2. "Read `JoSAA_Knowledge_Vault`, run `code/josaa_pipeline.py` on `_extract/data`, and help me extend it."
3. For the extension: start from `code/josaa_fill_engine.js` + vault note 13.

See also: [[12 — The Playbook & Thesis]] · [[13 — Chrome Extension Product]] · [[08 — Automation Engine]]
