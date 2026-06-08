---
title: Chrome Extension Product
tags: [product, chrome-extension, automation, saas, moat]
created: 2026-06-08
---

# 13 — Chrome Extension Product

> Insight (Charan): the JoSAA fill **script we wrote is itself a product**. Wrapped as a Chrome extension, it's the "last mile" of the SaaS — the part that actually gets the recommended list onto the official portal, safely.

## ⚠️ Scope: the PRODUCT is the automation, not the options
The product = the **generic automation engine** (detect portal → restriction-safe fill → verify → human lock), portal-agnostic via adapters. It is **decoupled from any specific choice list.**
- Vinay's 464 options (`josaa_queue.js` / `Vinay_choice_queue.json`) are **just sample input data** for one student — NOT part of the product.
- The list is generated per-user by the separate scoring brain ([[12 — The Playbook & Thesis]] / `josaa_pipeline.py`), or even uploaded/typed by the user.
- So when we talk "extension product," we mean **the filler mechanism**: it accepts *any* ordered list and enters it safely. The specific options are interchangeable data.

## The product in one line
A browser extension that sits on the counselling portal (JoSAA + state CET portals), **imports the student's scored priority list** from the SaaS, and **auto-fills it in order — restriction-safe, with a dry-run preview, progress/resume, and a human-only lock.**

## We already have the kernel
`josaa_fill_engine.js` (see [[08 — Automation Engine]]) is effectively the extension's content script today:
- `josaaProbe()` → page detection
- `josaaDryRun()` → match + preview, touches nothing
- `josaaRemoveAll()` → clean slate
- `josaaFill()` → one-by-one add, **verify each**, **auto-decline orthopedic restrictions**, **pause on other restrictions/anomalies**
- never auto-locks (human-in-the-loop)
That's the hard 80%. The rest is packaging + UX.

## Extension architecture
- **Content script** = the engine (DOM match, add/remove, dialog override for restriction safety).
- **Popup UI** = load the student's list, "Dry run", "Fill", live progress (added / declined / paused), "Open report".
- **Background/service worker** = state across reloads (resume after timeout/crash), portal-adapter routing.
- **Options page** = manage profile/list source, per-portal settings.
- **Data in** = the scored, ordered list from the SaaS backend (or an uploaded CSV/JSON like `josaa_queue.js`).

## Why it's a strong product wedge
- The portal step is **the most painful, error-prone part** for families (hundreds of choices, timeouts, single-tab, easy to mis-order). Turning hours → minutes is felt value.
- **Restriction safety** at the point of entry = the trust feature (a wrong allotment is catastrophic for PwD students).
- It's the natural **"do it for me" upsell** on top of the SaaS "tell me what to do" scoring engine.

## Multi-portal = adapters (scales the moat)
Each counselling portal (JoSAA, each state CET) = one **adapter**: selectors + add/remove logic + restriction-message patterns. The engine core stays the same; adapters are the maintained asset. This directly serves the **central + state** ambition in [[10 — Product Vision (SaaS + Service)]].

## Hard constraints / risks (be honest in the proposal)
- **Portal Terms of Service / automation policy** — review per portal; position as an *assistive* tool with human review + human lock, not a bot.
- **No credential/OTP/CAPTCHA handling** — the student logs in and locks; the extension only fills. (Same rule we followed.)
- **DOM drift** — portals change markup each season → adapters need maintenance (also a moat: keeps copycats out).
- **Single-tab / ~20-min session / save-crashes** → chunked fills + resume (already designed).
- Liability: the extension fills *the user's reviewed list*; it doesn't decide.

## MVP scope
1. JoSAA adapter (done in prototype) + popup with Dry-run / Fill / Report.
2. Import list from SaaS or file.
3. Restriction-safe fill + resume.
4. Then: 1–2 state CET adapters to prove the multi-portal thesis.

See also: [[08 — Automation Engine]] · [[12 — The Playbook & Thesis]] · [[10 — Product Vision (SaaS + Service)]]
