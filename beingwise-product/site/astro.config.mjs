// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import dualmark from '@dualmark/astro';
import netlify from '@astrojs/netlify';

// EDIT: set this to your real production domain before deploying.
export const SITE_URL = 'https://www.beingwise.in';

// --- AEO (Answer Engine Optimization) ---------------------------------------
// Every content page also resolves at `<url>.md` (see src/pages/**/[slug].md.ts)
// returning clean canonical markdown, so AI answer engines ingest our text
// instead of scraping rendered HTML. dualmark v0.9 can't serialize custom
// converters into routes, so the `.md` twins are generated natively; we use
// dualmark for its `/llms.txt` generator — the AI-readable site index.
const L = (title, href, description) => ({ title, href, description });
const U = (p) => `${SITE_URL}${p}`;

// Every page renders the title as its single <h1> in the layout. Markdown
// bodies (esp. the imported corpus) often open with their own `# heading`,
// which produced a second <h1>. Demote any in-body <h1> to <h2>.
function rehypeDemoteH1() {
  const walk = (node) => {
    if (node.tagName === 'h1') node.tagName = 'h2';
    if (node.children) node.children.forEach(walk);
  };
  return (tree) => tree.children.forEach(walk);
}

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  // Adapter enables the one on-demand route (/api/copilot) as a serverless
  // function. Every content page still prerenders to static HTML by default;
  // only routes with `export const prerender = false` run on the server.
  adapter: netlify(),
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      // Sitemap = curated/structural pages + blog guides ONLY. The scraped
      // article/question/college corpus is excluded so it isn't advertised
      // for crawling or enumeration. (No rolling lastmod: that faked freshness.)
      filter: (page) => {
        const p = new URL(page).pathname.replace(/\/+$/, '') || '/';
        if (/^\/(articles|questions|colleges)\/[^/]+$/.test(p)) return false; // corpus detail
        if (/\/page\/\d+$/.test(p)) return false;                            // pagination
        return true;
      },
    }),
    dualmark({
      siteUrl: SITE_URL,
      llmsTxt: {
        enabled: false,
        brandName: 'BeingWise',
        description:
          'BeingWise is an independent, student-first platform for Indian college admissions (JoSAA, JEE, NEET, EAMCET, MBA and more). We turn a rank into the right seat using official data — a free college predictor, plain-English guides, structured college and exam information, and optional paid counselling. Not affiliated with any government body; we never sell student data and never promise a "guaranteed seat." Every content URL also has a Markdown version at the same path with a ".md" suffix (e.g. /blog/josaa-counselling-2026-complete-guide.md).',
        sections: [
          {
            title: 'Tools',
            links: [
              L('College Predictor', U('/predictor'), 'Free — enter your JEE Main rank and category to see the NITs, IIITs and GFTIs you can realistically get, classified Safe / Likely / Dream on official JoSAA closing ranks (2023–2026).'),
              L('Search', U('/search'), 'Search all colleges, exams, courses and answers.'),
            ],
          },
          {
            title: 'Core JoSAA guides',
            links: [
              L('JoSAA Counselling 2026: Complete Choice-Filling Guide', U('/blog/josaa-counselling-2026-complete-guide'), 'The full playbook — registration to final seat.'),
              L('JoSAA Choice Filling Order 2026', U('/blog/josaa-choice-filling-order-2026'), 'The correct Dream/Likely/Safe preference order.'),
              L('Float vs Freeze vs Slide', U('/blog/float-freeze-slide-josaa'), 'What to choose after each round.'),
              L('How Many Choices to Fill in JoSAA', U('/blog/how-many-choices-to-fill-josaa')),
              L('JoSAA Mock Seat Allotment Explained', U('/blog/josaa-mock-seat-allotment-explained')),
              L('Branch vs College', U('/blog/branch-vs-college-jee')),
              L('Percentile vs Rank in JEE Main', U('/blog/percentile-vs-rank-jee-main')),
              L('CSAB Special Rounds 2026', U('/blog/csab-special-rounds-2026')),
              L('Home-State Quota, Category & Female Seats', U('/blog/home-state-quota-category-seats')),
              L('JoSAA Documents & Reporting Checklist', U('/blog/josaa-documents-reporting-checklist')),
              L('Free College Predictors: Spam & Trust', U('/blog/free-college-predictor-spam-trust')),
              L('Guaranteed-Seat & Management-Quota Scams', U('/blog/guaranteed-seat-scams-josaa')),
            ],
          },
          {
            title: 'Browse',
            links: [
              L('All JoSAA Guides', U('/blog')),
              L('Colleges in India', U('/colleges'), 'Courses, fees, admission, cutoffs, placements.'),
              L('Entrance Exams', U('/exams'), 'JEE Main, JEE Advanced, NEET, EAMCET, CAT, CLAT and more.'),
              L('Courses & Branches', U('/courses'), 'CSE, ECE, Mechanical, Civil and other B.Tech branches.'),
              L('Topics & Streams', U('/topics'), 'Engineering, Medical, MBA, Law, Science, Careers.'),
              L('Student Questions & Answers', U('/questions')),
            ],
          },
          {
            title: 'About',
            links: [
              L('About BeingWise', U('/about'), 'Who we are and how we help.'),
              L('Editorial Policy', U('/editorial-policy'), 'How we source data and review content.'),
              L('Contact', U('/contact')),
            ],
          },
        ],
      },
    }),
  ],
  markdown: { rehypePlugins: [rehypeDemoteH1] },
  build: { inlineStylesheets: 'auto' },
});
