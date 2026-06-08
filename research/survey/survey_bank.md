# JoSAA Counselling Co-Pilot — Validation Questionnaire Bank

> **Purpose:** Test real demand (not politeness) for a JoSAA / CSAB counselling co-pilot before building. Every instrument below is designed to separate *expressed* interest from *revealed* behaviour. Bias toward past actions, money already spent, and concrete artifacts over hypothetical "would you use this?" answers.
>
> **How to read severity scores:** A pain point is only worth building for if it scores **≥4 average AND has wide spread toward 5** (a few people in agony beats everyone mildly annoyed). Treat anything that everyone rates 3 as a non-problem.
>
> **The 10 pain points probed throughout** (referenced by code):
> - **P1 — Choice-filling order** (how to sequence the preference list)
> - **P2 — Fear of wrong locking** (locking choices / final submission anxiety)
> - **P3 — Float / Freeze / Slide** (which option to pick after a round result)
> - **P4 — Predictor spam / trust** (too many predictors, none trustworthy)
> - **P5 — Branch vs College** (better branch at lower-ranked college vs worse branch at top college)
> - **P6 — Private deposit forfeiture** (money locked in private colleges as backup)
> - **P7 — Quota / Gender pool** (home-state quota, category, female-supernumerary seats)
> - **P8 — Documents** (verification, mismatches, what to keep ready)
> - **P9 — Scams** (fake consultants, paid "guaranteed seat" fraud)

---

## Table of Contents
1. [Instrument 1 — Quantitative Student Survey](#instrument-1--quantitative-student-survey)
2. [Instrument 2 — Parent Survey](#instrument-2--parent-survey)
3. [Instrument 3 — 30-Minute Mom-Test User Interview Script](#instrument-3--30-minute-mom-test-user-interview-script)
4. [Instrument 4 — Community Seeding Question Set](#instrument-4--community-seeding-question-set)
5. [Appendix A — Pain-Point-to-Question Map](#appendix-a--pain-point-to-question-map)
6. [Appendix B — Analysis & Decision Rules](#appendix-b--analysis--decision-rules)

---

# Instrument 1 — Quantitative Student Survey

**Target N:** 150+ responses for stable van-Westendorp curves; 80 minimum.
**Channels:** JEE Telegram groups, college subreddits, coaching alumni lists, JoSAA-season Discord.
**Length:** 6–8 minutes. Keep it that short or completion craters.
**Incentive:** Offer the aggregate results back ("we'll send you the rank-vs-college data we collect") — attracts the exact people who care.

> **Screening note:** Screen-outs are data, not waste. Record them. If 70% of your traffic screens out, your channel is wrong.

## Section A — Screening & Qualification

**S1. Which best describes you right now?**
- [ ] I am filling / about to fill JoSAA choices this cycle (2026)
- [ ] I filled JoSAA choices in a previous cycle (2023–2025)
- [ ] I am a year or more away from JEE counselling
- [ ] I never went through JoSAA / not relevant to me
> *Route: keep cycles 2023–2026. Route "never / far away" to S2 then end.*

**S2. (Screen-out capture) In one line, why doesn't JoSAA counselling apply to you?**
`__________` *(free text — tells you who your channel is actually reaching)*

**S3. What was / is your JEE (Main or Advanced) category rank bracket?** *(used for segmentation, not judgment)*
- [ ] Top (≤5,000 Adv / ≤10,000 Main) [ ] Mid-high [ ] Mid [ ] Mid-low [ ] Below typical NIT/IIIT cutoffs [ ] Prefer not to say

**S4. Which counselling did/will you participate in?** *(multi-select)*
- [ ] JoSAA [ ] CSAB special rounds [ ] State counselling [ ] Private/deemed (VIT, BITS, etc.) [ ] Other

**S5. Who actually filled the choice list?**
- [ ] Me, alone
- [ ] Me, with a parent watching
- [ ] A parent / relative did most of it
- [ ] A paid consultant / coaching mentor drove it
> *This is your buyer-vs-user signal. Note it.*

## Section B — Behaviour (what you actually did — ask before opinions)

**B1. How many distinct tools / sources did you open while deciding your choice order?** (rank predictors, college predictors, spreadsheets, YouTube, seniors, etc.)
- [ ] 0–1 [ ] 2–3 [ ] 4–6 [ ] 7+

**B2. Roughly how many hours total did you spend on counselling decisions (not the exam)?**
- [ ] <2 [ ] 2–5 [ ] 6–12 [ ] 13–25 [ ] 25+

**B3. Did you build or copy a spreadsheet to manage your choices?**
- [ ] Yes, built my own [ ] Yes, copied/downloaded one [ ] No, used the portal directly [ ] No, someone else handled it

**B4. Did you pay anyone for counselling help last cycle?** *(money already spent = strongest signal)*
- [ ] No
- [ ] Yes, a coaching institute's counselling add-on — ₹`____`
- [ ] Yes, an independent consultant — ₹`____`
- [ ] Yes, bought a paid predictor / report — ₹`____`
- [ ] Yes, other — what & how much: `____`

**B5. Did you submit a security/admission deposit at a private or deemed college as a backup *before* your JoSAA seat was final?**
- [ ] Yes, and I later forfeited it — amount ₹`____`
- [ ] Yes, and I got it back / used it
- [ ] No
- [ ] Considered it but didn't

**B6. Think back to your single most stressful counselling moment. What were you trying to figure out?** `__________` *(free text — unprompted pain ranking)*

## Section C — Pain Severity (rate each 1–5)

> **Scale:** 1 = Not a problem at all · 2 = Minor · 3 = Annoying but manageable · 4 = Genuinely stressful / cost me sleep · 5 = Made me feel I could ruin my admission.
> *For each, also tick "N/A — didn't face this."*

| # | Pain point | 1 | 2 | 3 | 4 | 5 | N/A |
|---|------------|---|---|---|---|---|-----|
| C1 (P1) | Knowing the **right order** to fill my choices | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| C2 (P2) | **Fear of locking / final-submitting the wrong list** | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| C3 (P3) | Deciding **Float vs Freeze vs Slide** after a round result | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| C4 (P4) | **Predictors everywhere, none I could trust** | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| C5 (P5) | **Better branch at a lower college vs top college, worse branch** | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| C6 (P6) | **Private-college deposit I might forfeit** | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| C7 (P7) | **Quota / category / gender-pool** seats (home-state, supernumerary) | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| C8 (P8) | **Documents** — what to keep ready, mismatches at verification | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| C9 (P9) | **Fake consultants / "guaranteed seat" scams** | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

**C10. Of the nine above, which ONE caused you the most stress?** *(forced single choice — drop-down of P1–P9)* `____`

**C11. Which ONE did you wish you'd had a clear, trustworthy answer for and never found one?** `____`

## Section D — Current Solution & Switching

**D1. What did you rely on MOST for your decisions?**
- [ ] Free online predictors [ ] YouTube channels [ ] Seniors / friends [ ] Coaching mentor [ ] Paid consultant [ ] Parent's research [ ] Official JoSAA docs only [ ] Other

**D2. What was the single biggest thing wrong with what you used?** `__________`

**D3. If a tool could have removed your #1 stress (from C10), would you have…** *(reveals seriousness)*
- [ ] Paid for it [ ] Used it only if free [ ] Not bothered — I managed fine

## Section E — Willingness to Pay & Pricing

> *Frame concretely:* "Imagine a tool that, given your rank/category/home-state, builds and stress-tests your full choice list, flags risky locking, explains Float/Freeze/Slide for your exact case, and warns you about deposits and scams."

**E1. Would you pay anything at all for this?**
- [ ] Yes [ ] No [ ] Only if a trusted source (coaching/senior) recommended it

**E2. (If yes) What feels like a fair one-time price for the full counselling season?** ₹`____`

**E3. Who would actually pay — you or your parent?**
- [ ] Me, from my own money [ ] Me, but I'd ask parent for the money [ ] Parent decides & pays [ ] Nobody would pay

### Van-Westendorp Price Sensitivity Meter
*Ask all four. Same product description as above. Currency ₹.*

**VW1. (Too cheap)** At what price would you think this tool is **so cheap you'd doubt its quality / accuracy**? ₹`____`
**VW2. (Cheap / bargain)** At what price would it be **a great deal — clearly worth it**? ₹`____`
**VW3. (Expensive)** At what price would it start to feel **expensive, making you think twice**? ₹`____`
**VW4. (Too expensive)** At what price is it **so expensive you would not consider it at all**? ₹`____`

> *(Plotting VW1–VW4 cumulative curves gives the acceptable price band and the Optimal Price Point. See Appendix B.)*

### Gabor–Granger cross-check (direct purchase intent)
**GG1. Would you buy it at ₹199?** [ ] Yes [ ] No
**GG2. At ₹499?** [ ] Yes [ ] No
**GG3. At ₹999?** [ ] Yes [ ] No
**GG4. At ₹1,999?** [ ] Yes [ ] No
> *Compare the implied demand curve against van-Westendorp's band; if they disagree wildly, your respondents are anchoring, not valuing.*

## Section F — Commitment Signal (the real test)

**F1. We're building this for the next cycle. Leave your email/WhatsApp if you want early access:** `__________`
> *Blank = polite interest. Filled = demand. Track the fill rate as your headline metric.*

**F2. Would you be willing to do a 30-minute call about your counselling experience (we'll send ₹200 / a voucher)?** [ ] Yes — contact: `____` [ ] No

---

# Instrument 2 — Parent Survey

**Why a separate instrument:** In S5/E3 you'll often find the parent is the *payer* even when the student is the *user*. Parents weigh money, scams, and "did we make a safe choice" differently. Build this to find the buyer.

**Target:** Parents of students who went through JoSAA in 2023–2026. Channels: parent WhatsApp groups, coaching parent-orientation lists.
**Length:** 5 minutes. Plain language, minimal jargon (expand acronyms).

## Section PA — Screening
**PA1. Did your child go through JEE engineering counselling (JoSAA/CSAB) in the last 3 years?** [ ] Yes [ ] Currently [ ] No → end
**PA2. How involved were you in the choice-filling decisions?**
- [ ] I led it [ ] Equal partner with my child [ ] I watched, child decided [ ] Not involved

## Section PB — Behaviour & Money (ask first)
**PB1. Did you pay for any counselling help? What and how much?**
- [ ] Coaching counselling package — ₹`____`
- [ ] Independent counsellor — ₹`____`
- [ ] Paid reports/predictors — ₹`____`
- [ ] Nothing paid

**PB2. Did you pay a deposit at a private/deemed college as a backup, before the government seat was confirmed?**
- [ ] Yes, forfeited it — ₹`____` [ ] Yes, recovered/used it [ ] No

**PB3. Were you ever approached by someone promising a "guaranteed seat" or "management quota" for a fee?**
- [ ] Yes, and we paid [ ] Yes, but we declined [ ] No
> *(P9 — parents are the prime scam target; capture amounts.)*

**PB4. Looking back, what worried you most as a parent during counselling?** `__________`

## Section PC — Pain Severity (parent's lens, 1–5)
*Same scale as student survey.*

| # | Concern | 1–5 | N/A |
|---|---------|-----|-----|
| PC1 (P5) | Whether **branch or college brand** matters more for my child's future | `__` | ☐ |
| PC2 (P6) | **Money locked / forfeited** in backup private-college deposits | `__` | ☐ |
| PC3 (P9) | **Falling for a fake consultant / scam** | `__` | ☐ |
| PC4 (P2) | My child **submitting the wrong final list** out of confusion | `__` | ☐ |
| PC5 (P4) | **Not knowing which advice/predictor to trust** | `__` | ☐ |
| PC6 (P7) | Getting **category / home-state quota** benefits right | `__` | ☐ |
| PC7 (P8) | **Documents** correct & ready for verification | `__` | ☐ |
| PC8 (P3) | Understanding **what to do after each round** (float/freeze/slide) | `__` | ☐ |

**PC9. Which ONE of these worried you most?** `____`

## Section PD — Willingness to Pay
**PD1. Would you pay for a trustworthy tool that guided your child's full counselling and warned you about scams and deposit risks?** [ ] Yes [ ] No [ ] Only if my child's coaching recommended it
**PD2. Fair price for the whole season? ₹`____`**
**PD3. What would make you trust such a tool enough to pay?** `__________`
> *(Free text on trust drivers — gold for positioning. Likely answers: "uses official JoSAA data", "recommended by coaching", "real past-year accuracy".)*

**PD4. (Van-Westendorp, parent)**
- Too cheap to trust: ₹`____` · Good deal: ₹`____` · Getting expensive: ₹`____` · Too expensive: ₹`____`

## Section PE — Commitment
**PE1. Want us to contact you before next cycle? Contact: `____`**
**PE2. Open to a 20-min call about your experience? [ ] Yes `____` [ ] No**

---

# Instrument 3 — 30-Minute Mom-Test User Interview Script

> **The Mom Test rules baked into this script:**
> 1. Talk about **their life and past actions**, never your idea.
> 2. Ask about **specifics in the past**, not generics or hypotheticals about the future.
> 3. **Don't pitch.** If you mention the product, you've contaminated the data.
> 4. **Shut up and listen.** Aim for them talking 80% of the time.
> 5. Dig for **money, time, and workarounds already spent** — those are facts; opinions are noise.
> 6. When they compliment the idea, **deflect and re-ground in a real story.**
>
> Conduct over video so you can see screen-shares of their actual spreadsheets/screenshots if they'll show you. Record (with consent).

### 0:00–0:03 — Warm-up & framing (no pitch)
- "Thanks for the time. I'm just trying to understand how students actually went through JEE counselling — I'm **not selling anything**, there are no right answers. Can I record this just so I don't have to scribble?"
- "Quick context: when did you go through JoSAA, and what were you hoping to get into?"

### 0:03–0:10 — Reconstruct the actual experience (behaviour, chronological)
> Goal: get them re-living it, not summarizing it.
- "Walk me through the day you first sat down to fill your choice list. Where were you, who was with you, what was open on your screen?"
- "What did you do *first*? And then?" *(let silence pull the story out)*
- "Show me — do you still have the spreadsheet/screenshots? Can you screen-share it?" *(artifacts > recollection)*
- "How many times did you change your list before locking it?"
- "Who else's opinion did you pull in, and why them?"

### 0:10–0:20 — Dig into each pain (only the ones they raise; probe the rest lightly)
> For whatever pain they mention, run the loop: **What did you do about it? → How long did that take? → Did it work? → What did it cost you (time/money/sleep)?**

Targeted memory-prompts (use only if not already covered — phrased as past events, never "would you"):
- **P1 (order):** "How did you decide what went at the top of your list versus the bottom? Was there a moment you weren't sure of the order?"
- **P2 (locking):** "Tell me about the moment you locked / final-submitted. What was going through your head right before you clicked?"
- **P3 (float/freeze/slide):** "After the first round result came out — what did you choose, float, freeze, or slide? How did you figure out which one?"
- **P4 (predictor trust):** "Which predictor did you open first? Why? Did you end up trusting it — what made you doubt it?"
- **P5 (branch vs college):** "Was there a specific branch-vs-college call you agonized over? Which two options? How did you decide?"
- **P6 (deposit):** "Did you put money down anywhere as a backup? Walk me through that decision. Did you get it back?"
- **P7 (quota/gender):** "Did home-state quota / category / female seats come into your choices? Was anything confusing there?"
- **P8 (documents):** "At verification, did anything go wrong or nearly go wrong with documents?"
- **P9 (scams):** "Did anyone offer you a 'guaranteed seat' or paid shortcut? What happened?"

> **Listen for the phrase that means money:** "I paid…", "we almost lost…", "I spent the whole night…". Star those. Ask: "How much exactly?" Don't let them round.

### 0:20–0:26 — Workarounds, spend, and the worst moment
- "What's the single worst counselling moment you remember? What did you do in that moment?"
- "Did you spend any money trying to get help or peace of mind — consultant, report, deposit, anything?" *(if vague, get the rupee figure)*
- "If you have a younger sibling/cousin going through this next year, what's the one thing you'd tell them to watch out for?" *(reveals the durable pain without asking them to evaluate a product)*
- "Did you ever go looking for a tool/service to solve this and fail to find a good one? What did you search for?"

### 0:26–0:29 — Light commitment tests (still no pitch)
> The Mom Test currency is **time, reputation, or money** — ask for one.
- "Would you be open to me sending you the choice-list of the next student we work with, to sanity-check it?" *(time commitment)*
- "Who else went through this that you'd introduce me to?" *(reputation/referral commitment — a real yes is strong signal)*
- *Only if they ask "so what are you building?":* give one neutral sentence, then immediately: "But before that — going back to what you said about [their pain], what did you try next?"

### 0:29–0:30 — Close
- "Anything about counselling I should have asked but didn't?"
- "Can I come back to you if I have a follow-up?" *(another small commitment)*

### Interviewer scorecard (fill immediately after, before memory fades)
| Field | Capture |
|-------|---------|
| Top unprompted pain | |
| Pains they were *indifferent* to | |
| Money already spent (₹, itemized) | |
| Hours spent | |
| Existing workaround | |
| Direct quotes (verbatim, esp. emotional) | |
| Commitment given? (referral / time / money) | |
| Buyer = student or parent? | |
| Signal verdict: strong / weak / false-positive | |

---

# Instrument 4 — Community Seeding Question Set

> **Goal:** Provoke *organic, unsolicited* discussion in JEE communities so you learn the language people use and which pains get the most replies — **without** announcing a product (which kills honesty and invites self-promotion accusations). Post as a genuine student/researcher. Engagement volume per topic = a free demand heat-map.

**Where:** r/JEE, r/Btechtards, JoSAA/CSAB Telegram groups, college-specific Discords, Quora JEE spaces, coaching alumni groups.
**Posting hygiene:** one question per post (don't spam), reply to every comment, never drop a link until people *ask* what you're building.

### Open prompts (designed to surface pains P1–P9)
1. **(P1/P2)** "Filling JoSAA choices this week — for those who've done it, what's the one ordering mistake you wish you hadn't made? Trying not to repeat history."
2. **(P3)** "Genuine question: after round 1, how did you actually decide between Float, Freeze and Slide? The official doc explains *what* they are but not *when* to pick which."
3. **(P4)** "There are like 15 rank predictors and they all disagree. Which one did you find was actually closest to reality last year, and how did you sanity-check it?"
4. **(P5)** "Settle a fight in my house: better branch at a lower-NIRF college, or a 'worse' branch at a top one? Looking for people who chose either and how it turned out 1–2 years later."
5. **(P6)** "Did you book a private/deemed college as backup and pay the deposit? Did you get it back after JoSAA, or did you forfeit it? Trying to estimate the real money at risk."
6. **(P7)** "How did home-state quota / category / female-supernumerary seats actually change your safe choices? Feel like I'm leaving options on the table by not understanding this."
7. **(P8)** "What document mismatch nearly cost someone their seat at verification? Want to fix mine *before* I show up."
8. **(P9)** "PSA-style question: who got DM'd or called by a 'guaranteed seat / management quota' agent during counselling? How do you tell a real counsellor from a scam?"
9. **(open / unprompted ranking)** "If you could go back to your counselling week and hand your past self ONE cheat-sheet, what would be on it?"

### Engagement-mining follow-ups (drop into comment threads)
- "Did you find a tool/site that handled this, or did you do it manually in a spreadsheet?"
- "How long did that end up taking you?"
- "Did you pay for any help with this part?"
- "If something had just *told you the answer* here, would you have trusted it?"

### What to measure from the community (instrument-level metrics)
| Metric | What it tells you |
|--------|-------------------|
| Replies per pain-point post | Relative demand / heat per pain |
| Count of "I wish there'd been a tool for this" | Latent solution-seeking |
| Spontaneous spreadsheet/consultant mentions | Existing-workaround intensity |
| DMs asking "are you building this?" | Pull signal (pre-launch waitlist seeds) |
| Vocabulary used ("locking", "freeze regret", "agent") | Exact copy for your marketing |
| Scam stories volume | Trust-feature priority |

---

# Appendix A — Pain-Point-to-Question Map

| Pain | Student survey | Parent survey | Interview | Community |
|------|----------------|---------------|-----------|-----------|
| P1 Choice-filling order | C1, B3 | — | P1 prompt | Q1 |
| P2 Fear of wrong locking | C2, B6 | PC4 | P2 prompt | Q1 |
| P3 Float/Freeze/Slide | C3 | PC8 | P3 prompt | Q2 |
| P4 Predictor spam/trust | C4, D1 | PC5 | P4 prompt | Q3 |
| P5 Branch vs college | C5 | PC1 | P5 prompt | Q4 |
| P6 Private deposit forfeiture | C6, B5 | PC2, PB2 | P6 prompt | Q5 |
| P7 Quota / gender pool | C7 | PC6 | P7 prompt | Q6 |
| P8 Documents | C8 | PC7 | P8 prompt | Q7 |
| P9 Scams | C9, B4 | PC3, PB3 | P9 prompt | Q8 |
| (Buyer identity) | S5, E3 | PA2, PD1 | scorecard | follow-ups |
| (WTP) | E1–E3, VW, GG | PD1–PD4 | commitment tests | DM pull |

---

# Appendix B — Analysis & Decision Rules

### Reading severity (the "is this real?" test)
- Compute **mean** and **% who rated 4–5** for each of C1–C9 / PC1–PC8.
- **Build-worthy pain:** mean ≥ 4.0 **and** ≥40% rated 4–5 **and** it appears in C10/C11 (forced top-pain) and unprompted in B6/community.
- **Trap:** a pain everyone rates exactly 3 = nice-to-have, not a wedge. Cut it.
- **Cross-validate prompted vs unprompted:** if a pain scores high on the 1–5 grid but *never* shows up in B6 free-text or community replies, the grid is inflating it (acquiescence bias). Trust the unprompted source.

### Reading van-Westendorp (per segment: student-payer vs parent-payer)
- Plot cumulative curves: "too cheap" + "not cheap", "too expensive" + "not expensive".
- **PMC (Point of Marginal Cheapness)** = intersection of "too cheap" × "expensive" → price floor.
- **PME (Point of Marginal Expensiveness)** = intersection of "too expensive" × "cheap" → price ceiling.
- **OPP (Optimal Price Point)** = "too cheap" × "too expensive" intersection.
- Acceptable price band = PMC → PME. Launch price ≈ OPP, tested against Gabor–Granger (GG1–GG4) demand curve.
- **Segment separately.** Students and parents will produce different bands; price to whoever S5/E3/PD1 says actually pays.

### The signals that actually matter (ranked)
1. **Money already spent** (B4, B5, PB1, PB2, PB3) — strongest. Past spend predicts future spend.
2. **Commitment given** (F1 email fills, F2/PE2 call yeses, interview referrals) — revealed, not stated.
3. **Forced top-pain convergence** (C10/C11/PC9 + interview top pain + highest-reply community post all pointing to the same 2–3 pains) — that's your wedge.
4. **Stated WTP** (E2, PD2) — weakest; discount it ~50% versus revealed signals.

### Red flags that you have false demand
- High average severity but near-zero F1 email fills.
- Everyone "would pay" but nobody paid anything last cycle (B4 all "No").
- Community posts get likes but no replies/stories.
- Interviewees compliment the idea but give no referral and spent ₹0.

> **Decision gate:** Proceed to build only if ≥2 of the top-4 signals point at the *same* pain cluster, the buyer is identifiable, and the van-Westendorp band sits above your unit cost with room to spare.
