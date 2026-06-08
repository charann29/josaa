---
title: Automation Engine
tags: [josaa, automation, engine, technical]
created: 2026-06-08
---

# 08 — Automation Engine

## Files
- `josaa_queue.js` — sets `window.QUEUE` = ordered array of 464 `{rank, ic, bc, inst, branch, reach}` (institute + branch codes; no duplicate `(ic,bc)`).
- `josaa_fill_engine.js` — the engine.
- `JoSAA_RUNBOOK.md` — run steps.

## Portal facts
- Single-tab security (logging in elsewhere → "Active Session"/"Session Expired" in the controlled tab).
- ~20-min session timeout. Two OTPs: **login OTP** + **choice-filling OTP** (sent to Vinay's cousin).
- DOM (observed): `#avlChoiceContainer` (available) / `#filledChoiceContainer` (filled); rows where cells `[0]=instcode, [1]=instname, [2]=branchcode, [3]=branchname, [4]=Add`.
- `AddChoice()` uses native `confirm()`; restricted choices raise a restriction message in that dialog.

## Engine functions (run in this order)
1. `josaaProbe()` — reports structure + counts. **Touches nothing.**
2. `josaaDryRun()` — matches all 464 vs the live page; lists not-found / pre-flagged restricted. **Touches nothing.**
3. `josaaRemoveAll()` — removes **every** existing filled choice (bottom-up), verifying count → 0.
4. `josaaFill(startRank=1, maxToAdd)` — adds in order, **one at a time, verifying each**.
5. `josaaReport()` — tally: added / ortho-declined / other-restriction / failed.

## Restriction handling (the heart of it) #critical
- `window.confirm`/`alert` are overridden. A dialog is classified:
  - **`ortho`** (orthopedic/locomotor/walking/limb keywords) → **auto-declined**, logged, loop continues.
  - **`other`** (any other restriction wording) → **declined AND the run STOPS**, printing the exact message for manual review. If it doesn't affect Vinay, add manually then `josaaFill(nextRank)`.
- A restricted seat is therefore **never auto-added** under any circumstance.

## Safety behaviours
- Stops immediately on any **anomaly** (a choice that neither adds nor shows a restriction) → handle one-by-one (per Charan's instruction "don't go blindly").
- Fill in **chunks** (e.g. `josaaFill(1,100)` → save on portal → `josaaFill(101)`) to dodge timeout/save-crash issues seen earlier.
- **Never locks.** Vinay reviews and locks manually.

## Known operational issues seen earlier
- Tab/session mismatch (MCP opens its own tab; must log into *that* tab).
- "Save & Continue" occasionally crashed the tab or didn't commit → reload, re-login, added choices persist, resume.
- CDP 45s limit → avoid `querySelectorAll('*')`; use targeted selectors.

## Security note
Login credentials/OTP were shared in chat during the session. **Change the JoSAA password after counselling.** Claude never types passwords/OTP/captcha — Vinay does.

See also: [[07 — Final List & Predicted Outcome]] · [[11 — Open Items & Next Steps]]
