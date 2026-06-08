# BeingWise — Backlinks, Internal Links & Distribution Playbook

How the site is wired for SEO, and exactly how to earn links and traffic.
Grounded in `research/engagement/engagement_venues.md`, `research/urls/by_platform.md`,
`research/urls/youtube_channels.md`, `research/urls/quora_top_questions.md`.

> **Honest note on "backlinks":** nobody can fabricate real backlinks — they're other
> sites choosing to link to you. What you *can* control is (1) a strong **internal-link**
> structure (done, see below), (2) **linkable assets** worth citing, and (3) **outreach**
> in the exact communities where your audience already is. This doc covers all three.

---

## 1. Internal linking (already built)

The site ships as a **pillar → cluster** topic hub, the structure search engines reward:

- **Pillar:** `/blog/josaa-counselling-2026-complete-guide` links out to all 14 cluster posts.
- **Clusters:** every post links back to the pillar + 3–4 sibling posts (in-body + a "Keep reading" block).
- **Landing → blog:** header/footer link to the guide and blog on every page.
- Result: link equity flows to the pillar, and crawlers discover every page in ≤2 clicks.

Already implemented per page:
- Canonical URL, OG + Twitter cards, `en-IN` locale.
- JSON-LD: **Article + BreadcrumbList + FAQPage** (posts), **Organization + WebSite** (site), **Service + Offer + FAQPage** (landing).
- `sitemap-index.xml` + `/rss.xml` + `robots.txt`.

**On launch, do these 3 things:**
1. Set the real domain in `astro.config.mjs`, `src/consts.ts`, `public/robots.txt`.
2. Add the site to **Google Search Console** + **Bing Webmaster**, submit `sitemap-index.xml`.
3. Request indexing on the pillar + top 3 posts.

---

## 2. Linkable assets (what earns links naturally)

You already own the rarest thing in this niche: **clean multi-year official cutoff data + an explainable method.** Turn slices of it into free, citable assets — these are what bloggers, teachers and Reddit users link to:

- **Free choice-list / college predictor tool** (no phone number required — that itself is a story).
- **"Dream / Likely / Safe" cutoff explorer** by rank + category + home state.
- **Downloadable cheat-sheets** (PDF) per post: "Choice-filling order checklist", "Documents checklist", "Float/Freeze/Slide decision card".
- **Original data posts** each cycle: "What mock allotment told us this year", round-wise cutoff movement. Original data = the #1 backlink magnet.

Add a visible "embed/cite us" line on data pages to make linking effortless.

---

## 3. Outreach targets (from your research)

Rule for all of these: **add genuine value first, link only when relevant.** Hard self-promo gets removed and burns the account. Post from a real, aged account.

### Reddit (110 threads mapped — highest intent)
Subreddits: **r/JEE, r/JEENEETards, r/Btechtards, r/Indian_Academia**, plus cycle subs like **r/CSAB_2025**.
- Answer recurring "best choice-filling order / how many choices / freeze or float / I locked wrong" threads with a genuinely useful reply, then link the matching guide as "I wrote this up here."
- A recurring **"Engineering Admissions Choices" megathread** appears every cycle — be early and helpful in it.
- The "we scraped/analyzed JoSAA data" posts perform well — your data posts fit this culture.

### Quora (93 questions mapped — compounds in Google)
High-intent, evergreen, and Quora answers rank in Google. Target clusters:
- predictor_spam (17), deposit_forfeiture (16), float_freeze_slide (13), choice_filling (12), branch_vs_college (12).
- Write one strong answer per question, link the relevant guide as the source. These keep sending traffic for years.

### YouTube (key influencers — comments + collabs)
Top channels in the space (engage in comments during their live Q&As; pitch collabs/affiliate):
- Vedantu JEE, Gourab Roy, Rankers-JEE, We Won Academy, Counselify, HAREESH REDDY (Telugu belt), PHANI sir (Telugu).
- Many post mock-allotment/round videos with active comments — be the helpful, accurate reply that links your guide.
- A description/"pinned link" partnership with a mid-size channel = a strong, relevant backlink.

### Instagram / Telegram
- IG accounts: @pwjee_wallah, @priyam_harsh, @careerkickservices, @college.pravesh, @josaacounsellingjee.
- 24 Telegram channels/groups mapped — drop the guide where students ask round-by-round questions.

### Digital PR / editorial links (highest authority)
- Pitch the **data-leak / spam-call angle** ("students' rank+phone sold during counselling") to education reporters with your data — this is exactly the kind of original-angle story that earns links from Careers360-tier and mainstream outlets.

---

## 4. The 30-day launch cadence (counselling season)

| Days | Focus |
|---|---|
| 0–2 | Set domain, GSC/Bing, submit sitemap, request indexing on pillar + top posts. |
| 1–10 | Daily: 2–3 genuine Quora answers + 2–3 Reddit replies linking the right guide. |
| Mock-allotment days | Publish/refresh the mock-allotment post; comment on the day's YouTube videos. |
| Round-result days | Push the float/freeze/slide + "what next" posts in communities. |
| Ongoing | One original data post per major event (link magnet). Pitch the spam/scam angle to 5 journalists. |

> Full venue list with URLs + engage flags: `research/engagement/engagement_venues.md`,
> `research/urls/by_platform.md`, `research/urls/all_urls.csv`.

---

## 5. Measure
- **Google Search Console:** impressions/clicks by query + page; index coverage.
- Watch the cluster keywords from `landing/KEYWORDS_AND_CONVERSION.md`.
- Track referral traffic from Reddit/Quora/YouTube to see which venue converts.
