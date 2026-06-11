// rewrite.js — originality pass (penalty-safety + quality).
// Rewrites scraped-derived corpus pages into ORIGINAL BeingWise content and adds
// FAQ schema. Uses the Anthropic Messages API. Idempotent (skips pages already
// marked `rewritten: true`), resumable, rate-limited, priority-ordered.
//
//   ANTHROPIC_API_KEY=sk-... node scripts/rewrite.js [collection] [limit]
//   e.g. node scripts/rewrite.js articles 200
//
// Treat the scraped page as a SOURCE/brief; output is new prose in our voice.
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const ROOT = new URL('..', import.meta.url).pathname;
const KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.REWRITE_MODEL || 'claude-sonnet-4-6';
const collArg = process.argv[2] || 'articles';
const limit = parseInt(process.argv[3] || '100', 10);
if (!KEY) { console.error('Set ANTHROPIC_API_KEY'); process.exit(1); }

// Priority: bigger topics first (more traffic), then alphabetical for determinism.
const TOPIC_PRIORITY = ['engineering', 'management', 'exams', 'careers', 'medical', 'science', 'design-architecture', 'law', 'commerce-finance', 'study-abroad', 'study-guides'];

const SYSTEM = `You rewrite education guides for BeingWise, an independent Indian admissions-help brand (JoSAA/JEE/NEET/MBA).
Rules: write ORIGINAL prose in your own words from the source brief — never copy phrasing. Plain English for Indian students/parents. Keep all correct facts; do NOT invent statistics, cutoffs, fees or dates. No emoji. Use ## and ### markdown headings, short paragraphs, bullet lists, and a table where useful. Neutral, trustworthy, helpful. ~700-1100 words. Do not mention competitor brands.`;

function buildPrompt(title, body) {
  return `Rewrite the following into an original, well-structured BeingWise article titled "${title}".
Return STRICT JSON only: {"body": "<markdown body, no frontmatter, starts with a 1-2 sentence intro then ## sections>", "description": "<150-160 char meta>", "faqs": [{"q":"...","a":"..."}, ... 3-5 items]}.
SOURCE BRIEF (rewrite, don't copy):
"""
${body.slice(0, 6000)}
"""`;
}

async function callLLM(title, body) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 3000, system: SYSTEM, messages: [{ role: 'user', content: buildPrompt(title, body) }] }),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  return JSON.parse(json);
}

const dir = join(ROOT, 'src/content', collArg);
let files = readdirSync(dir).filter((f) => f.endsWith('.md'));
// order by topic priority
const withMeta = files.map((f) => ({ f, data: matter(readFileSync(join(dir, f), 'utf8')).data }))
  .filter((x) => !x.data.rewritten)
  .sort((a, b) => TOPIC_PRIORITY.indexOf(a.data.topic ?? 'study-guides') - TOPIC_PRIORITY.indexOf(b.data.topic ?? 'study-guides'));

let ok = 0, fail = 0;
for (const { f } of withMeta.slice(0, limit)) {
  const path = join(dir, f);
  const parsed = matter(readFileSync(path, 'utf8'));
  try {
    const out = await callLLM(parsed.data.title, parsed.content);
    const data = { ...parsed.data, description: out.description || parsed.data.description, faqs: out.faqs || [], rewritten: true };
    writeFileSync(path, matter.stringify('\n' + out.body.trim() + '\n', data));
    ok++;
    if (ok % 25 === 0) console.log(`rewritten ${ok}...`);
    await new Promise((r) => setTimeout(r, 400)); // gentle rate limit
  } catch (e) {
    fail++;
    console.error(`✗ ${f}: ${e.message}`);
  }
}
console.log(`DONE rewrite(${collArg}): ok ${ok}, fail ${fail}`);
