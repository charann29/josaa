# JoSAA Choice-Filling — Tomorrow Morning Runbook (Vinay)

Everything is staged. Tomorrow, once your cousin sends the **login OTP** and the **choice-filling OTP**, we just authenticate and run the steps below **in order**. Nothing here locks anything — Vinay locks the choices manually at the very end.

## The #1 rule: restriction safety
Vinay has a **locomotor (walking) disability**. A restricted seat must **never** be added — if a restricted seat were allotted and then rejected at document verification, it would jeopardise his admission. We protect against this **three ways**:
1. **Pre-filtered** — every known walking-restricted institute is already removed from the 464-item list.
2. **Runtime decline** — the engine overrides the browser's confirm/alert so that if the portal shows *any* restriction warning while adding a choice, it is **automatically declined** (never added) and logged.
3. **Hard guard** — a built-in restricted-institute code list; the engine refuses to even attempt those.

## What's staged in this folder
- `Vinay_FINAL_list.xlsx` / `.csv` — the human-readable final list (464 rows, with Points, Percentile, NIRF, reach colours).
- `josaa_queue.js` — the exact ordered queue the engine fills (`window.QUEUE`, 464 items, institute+branch codes).
- `josaa_fill_engine.js` — the automation engine (probe / dry-run / remove-all / fill).
- `Vinay_choice_queue.json` — same queue as data.

## Step-by-step (do NOT skip the dry run)

**0. Login (Vinay does this himself).**
Open JoSAA in the **single browser tab I control**, enter Vinay's credentials + the **login OTP**. Then open Choice Filling and enter the **choice-filling OTP**. (I never type passwords/OTPs — you do.)

**1. Load the queue + engine.** I inject `josaa_queue.js` then `josaa_fill_engine.js` into the page.

**2. `josaaProbe()`** — confirms the page structure and that QUEUE = 464. *Touches nothing.* If the page layout differs from expectation, we adapt the selectors here **before** doing anything.

**3. `josaaDryRun()`** — matches all 464 items against the live page, lists anything not found or pre-flagged restricted. *Touches nothing.* We review this together. If many are "not found", we **stop and go one-by-one** rather than blindly.

**4. `josaaRemoveAll()`** — removes **every existing choice** currently in the list, bottom-up, verifying the count drops to 0. (Per your instruction: wipe first, then refill fresh.)

**5. `josaaFill()`** — adds the 464 in order, **one at a time**, verifying each addition. It will:
   - **auto-decline + log** any restricted choice,
   - **stop immediately** on any anomaly (a choice that neither adds nor shows a restriction), so we never barrel ahead blindly.
   We can run it in chunks, e.g. `josaaFill(1, 100)`, then **save on the portal**, then `josaaFill(101)`, to avoid the ~20-min session timeout and the save-crash issues we hit before.

**6. `josaaReport()`** — final tally: added / restricted-declined / failed. We eyeball the filled list against `Vinay_FINAL_list.xlsx`.

**7. Vinay reviews and LOCKS** the choices himself. I will not lock.

## If anything misbehaves
- Session expired / "active session" → re-login in the **same** controlled tab (JoSAA is single-tab; logging in elsewhere breaks it).
- A choice won't add → engine stops and names it; we add that one manually, then resume with `josaaFill(<next rank>)`.
- Save crashes → reload, re-login, the already-added choices persist; resume from where we stopped.

## Reminder
The password was shared earlier in chat — please **change it** after counselling for safety.
