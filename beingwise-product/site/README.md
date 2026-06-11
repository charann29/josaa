# BeingWise — Astro site (landing + 8k-page SEO knowledge base)

Conversion landing page **plus** a large programmatic-SEO content site for
JoSAA/JEE/engineering/medical/MBA admissions, built from the research + the
Careers360/Shiksha corpus, all in the BeingWise design (Poppins + EB Garamond).

## Run

```bash
cd site
npm install
npm run dev                 # http://localhost:4321
NODE_OPTIONS=--max-old-space-size=12288 npx astro build   # 8k+ pages need a big heap
npm run preview
```

## Structure

| URL | What | Count |
|---|---|---|
| `/` | Landing (₹249 / ₹2,999 offer, countdown) | 1 |
| `/blog/<slug>` | Hand-written JoSAA pillar + 14 clusters | 15 |
| `/articles/<slug>` | Imported guides (exams/branches/courses/careers) | ~6,500 |
| `/questions/<slug>` | Imported student Q&A | ~1,200 |
| `/topics/<topic>` | Topical hubs (engineering, medical, MBA, …) | 11 |
| `/articles`, `/questions`, `/topics` | Paginated indexes | ~170 |

Every content page: unique title + meta description, canonical, OG/Twitter, clean
slug, ~6 related internal links, JSON-LD (`Article`/`QAPage` + `BreadcrumbList` +
`ItemList`, plus `FAQPage` on rewritten pages). Sitewide `Organization` + `WebSite`;
landing adds `Service`/`Offer`/`FAQPage`. Sitemap + RSS + robots included.

## Content pipeline (`scripts/`)

Run in this order to (re)generate from the source corpus in `../beingwise-blog`:

1. `seo-clean.js` / `seo-clean2.js` — strip scraped chrome, prune thin pages.
2. `classify-topics.js` — assign each page a `topic` (powers `/topics`).
3. `related.js` — recompute internal related-links.
4. `rewrite.js` — **originality pass** (penalty-safety + quality). Needs an API key:
   `ANTHROPIC_API_KEY=sk-... node scripts/rewrite.js articles 200`. Rewrites scraped
   pages into original prose + FAQ schema; idempotent (`rewritten: true`). **Run this
   over the corpus before relying on it for SEO — see `SEO_PLAYBOOK.md` §6.**

## Edit before launch

- `astro.config.mjs` + `src/consts.ts` + `public/robots.txt` → real domain.
- `src/consts.ts` → `LINKS.playbook` (₹249 Razorpay), `LINKS.call` (₹2,999 calendar→Razorpay), WhatsApp.
- Landing: `LOCK_DATE` countdown + "June 11" text in `src/pages/index.astro`.

## Deploy

`netlify.toml` / `vercel.json` included (note the `NODE_OPTIONS` heap bump — 8k pages
will OOM on default memory). Easiest: build locally, deploy `dist/`. Then submit
`sitemap-index.xml` in Google Search Console. See `SEO_PLAYBOOK.md` and
`BACKLINKS_AND_DISTRIBUTION.md`.
