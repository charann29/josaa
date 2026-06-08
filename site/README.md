# BeingWise — Astro site (landing + JoSAA blog corpus)

Marketing landing page **and** a 15-page SEO blog hub for JoSAA/JEE counselling,
built from the research in `../research`.

## Run it

```bash
cd site
npm install
npm run dev        # http://localhost:4321
npm run build      # static output to ./dist
npm run preview    # serve the built ./dist
```

## What's inside

- `src/pages/index.astro` — the BeingWise landing page (ported, mobile-first, countdown, ₹249/₹2,999).
- `src/pages/blog/index.astro` — blog hub (pillar + clusters).
- `src/content/blog/*.md` — 15 posts (1 pillar + 14 clusters). Frontmatter schema in `src/content.config.ts`.
- `src/layouts/` — `BaseLayout` (meta/OG/Organization+WebSite schema), `BlogPost` (Article+FAQPage+Breadcrumb schema, TOC, CTA, related).
- `src/components/` — Header, Footer, IconSprite.
- `src/styles/global.css` — shared design system (Poppins + EB Garamond).
- `src/consts.ts` — **edit before launch:** site URL, brand, CTA links (`PLAYBOOK_LINK`, `CALL_LINK`, WhatsApp), prices, nav.

## Edit before launch

1. `astro.config.mjs` → `site` = your real domain.
2. `src/consts.ts` → `SITE.url`, `LINKS.playbook` (₹249 Razorpay), `LINKS.call` (₹2,999 calendar→Razorpay), `LINKS.whatsapp`.
3. `public/robots.txt` → real sitemap URL.
4. Landing page: the lock-date countdown lives in `src/pages/index.astro` (`LOCK_DATE`) — set the verified date; update the "June 11" text to match.
5. Add real `public/og-default.png` and `public/logo.png` (referenced by schema/OG).

## Add a new blog post

Drop a `.md` in `src/content/blog/` with the frontmatter from `src/content.config.ts`
(title, description, pubDate, theme, keywords, related, faqs). It auto-appears in the hub,
sitemap, RSS, and gets full schema. Link it from siblings via `/blog/<slug>`.

## Deploy (static)

`npm run build` → upload `dist/` to Netlify / Vercel / Cloudflare Pages / any static host.
Then submit `sitemap-index.xml` in Google Search Console. See `BACKLINKS_AND_DISTRIBUTION.md`.
