# BeingWise — Programmatic SEO Playbook

How this site is built to rank, what's done, and the exact next moves (including
the SERP-API workflow once a key is provided). Grounded in `research/` (serp_demand,
by_theme, competitors) + the live site structure.

---

## 1. The architecture (what's live)

| Layer | URL pattern | Count | Purpose |
|---|---|---|---|
| Conversion home | `/` | 1 | Brand + ₹249/₹2,999 offer + countdown |
| Flagship guides (pillar+cluster) | `/blog/<slug>` | 15 | High-quality, hand-written JoSAA authority cluster |
| Articles corpus | `/articles/<slug>` | ~6,800 | Guides on exams/branches/courses/careers |
| Q&A corpus | `/questions/<slug>` | ~1,200 | Long-tail student questions answered |
| Topic hubs | `/topics/<topic>` | 11 | Topical authority + internal-link mesh |
| Paginated indexes | `/articles`, `/questions`, `/topics` | ~170 | Crawl paths |

**On every content page:** unique `<title>` + meta description, canonical, OG/Twitter,
clean descriptive slug (≤70 chars), ~6 related internal links, and JSON-LD
(`Article`/`QAPage` + `BreadcrumbList` + `ItemList`). Sitewide: `Organization` +
`WebSite`. Landing adds `Service` + `Offer` + `FAQPage`.

**Crawlability:** homepage → guides/topics/articles/questions (nav + footer) →
related-links mesh → sitemap (`sitemap-index.xml`, every URL). Nothing is orphaned.

---

## 2. Keyword clusters → page mapping (from research)

The research mined **535 demand URLs across 13 pain themes**. Mapping to pages:

| Cluster (theme · demand) | Target page(s) | Primary keywords |
|---|---|---|
| Choice-filling order ⭐ (171) | `/blog/josaa-choice-filling-order-2026` + pillar | josaa choice filling order, best preference order, dream reach safe |
| Float/Freeze/Slide (59) | `/blog/float-freeze-slide-josaa` | float freeze slide, should i float or freeze |
| Branch vs college (59) | `/blog/branch-vs-college-jee` | branch vs college, cse vs core branch |
| Predictor spam/trust (36) | `/blog/free-college-predictor-spam-trust` | free college predictor safe, stop spam calls jee |
| Deposit forfeiture (40) | `/blog/private-college-deposit-forfeiture` | private college deposit refund |
| Mock allotment (event spikes) | `/blog/josaa-mock-seat-allotment-explained` | josaa mock allotment 2026, what to do after mock |
| Percentile vs rank (22) | `/blog/percentile-vs-rank-jee-main` | jee main percentile to rank |
| Quota/category (15) | `/blog/home-state-quota-category-seats` | home state quota josaa, category seats |
| Documents (14) | `/blog/josaa-documents-reporting-checklist` | josaa documents required, reporting |
| Scams (15) | `/blog/guaranteed-seat-scams-josaa` | management quota fraud, guaranteed seat scam |
| CSAB | `/blog/csab-special-rounds-2026` | csab special round 2026 |
| Registration | `/blog/josaa-registration-choice-filling-steps` | josaa registration 2026, how to register |
| Engineering / Medical / MBA / Exams / Careers (broad, high-volume) | `/topics/*` + `/articles/*` | the long-tail Careers360/Shiksha rank for |

The 15 `/blog` posts own the **high-intent JoSAA money cluster**. The ~8k corpus
captures the **broad long-tail** (the volume play that competes on Careers360/Shiksha terms).

---

## 3. Title & meta patterns (already applied; tune per page)

- **Guides:** `<Primary Keyword> 2026: <Benefit> | BeingWise` (≤60 chars where possible via `seoTitle`).
- **Articles:** keyword-forward H1; meta description = first useful sentence (~155 chars).
- **Q&A:** the question as title (matches voice search / "people also ask"); answer summary as meta.
- **Topic hubs:** `<Topic> — Guides & Answers | BeingWise`.

All descriptions are unique (generated where missing). No duplicate titles within a collection.

---

## 4. The SERP-API workflow (run when a key is provided)

Provider-agnostic (SerpApi / ValueSerp / DataForSEO / Google CSE). Pipeline to add as `scripts/serp.js`:

1. **Seed** from `research/validation/serp_demand.md` keywords + each page's `keywords`/title.
2. **Pull live SERPs** per keyword: top-10 URLs, "People Also Ask", "related searches", and (where available) volume.
3. **Three outputs:**
   - **Rank tracking** — our URL position per target keyword (baseline + weekly).
   - **Content-gap** — PAA / related questions we don't yet have a page for → new `/questions` or `/articles` pages (programmatic expansion).
   - **Title/meta optimization** — for pages ranking 5–20, rewrite `seoTitle`/description toward the winning SERP intent; re-deploy.
4. **Feed back** into frontmatter (`seoTitle`, `description`, new `keywords`) and rebuild.

> Cost control: batch by cluster, cache responses, prioritise the 15 guides + top topic hubs first (highest commercial intent), then the long-tail.

**Until the key lands**, titles/meta are set from the research keyword map above + on-page best practice — already live.

---

## 5. Launch / indexing checklist

- [ ] Set real domain in `astro.config.mjs`, `src/consts.ts`, `public/robots.txt`.
- [ ] Google Search Console + Bing Webmaster → submit `sitemap-index.xml`.
- [ ] Request indexing on `/`, the pillar guide, and the 11 topic hubs first.
- [ ] Wire `PLAYBOOK_LINK` (₹249), `CALL_LINK` (₹2,999), WhatsApp, verified lock date.
- [ ] Watch Search Console: impressions by query → optimize titles for pages stuck at position 5–15.

---

## 6. Penalty-safety (important)

~8k pages are derived from Careers360/Shiksha and brand-stripped. Google's
"scaled content abuse" policy can penalise the whole domain for mass near-duplicate
pages. Mitigations in place: clean unique slugs + meta, thin-content pruning (330
removed), topical structure, internal-link mesh. **The durable fix is the originality
rewrite** (`scripts/rewrite.js`, see Task 8) — run it over the corpus in priority
order (top topic hubs + highest-traffic pages first) to make each page original +
add `FAQPage` schema. Treat the corpus as **raw material**, not the final page.

See also `BACKLINKS_AND_DISTRIBUTION.md` for off-page (the Reddit/Quora/YouTube
outreach targets from the research) and `../landing/KEYWORDS_AND_CONVERSION.md` for ads.
