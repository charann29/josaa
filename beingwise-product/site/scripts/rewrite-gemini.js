// rewrite-gemini.js — originality rewrite via Google Gemini.
// Rewrites scraped-derived pages into ORIGINAL BeingWise content + FAQ schema.
// Idempotent (skips rewritten:true), concurrent, retries 429, resumable.
//
//   GEMINI_KEY=... node scripts/rewrite-gemini.js <collection> [limit] [concurrency]
//   e.g. GEMINI_KEY=xxx node scripts/rewrite-gemini.js colleges 50 5
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const ROOT = new URL('..', import.meta.url).pathname;
const KEY = process.env.GEMINI_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const coll = process.argv[2] || 'colleges';
const LIMIT = parseInt(process.argv[3] || '50', 10);
const CONC = parseInt(process.argv[4] || '5', 10);
if (!KEY) { console.error('Set GEMINI_KEY'); process.exit(1); }
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;

const SYSTEM = `You rewrite Indian higher-education content into ORIGINAL articles for "BeingWise", an independent admissions-guidance brand.
Rules:
- Write entirely in your own words. Never copy phrasing from the source.
- Plain, warm English for Indian students and parents.
- KEEP all correct facts (fees, ranks, dates, course names) but rephrase them.
- Do NOT invent statistics. Do NOT mention any competitor or source brand.
- No emoji. Use Markdown: ## and ### headings, short paragraphs, bullet lists, and a table where useful.
- Neutral, trustworthy, genuinely helpful.`;

function prompt(title, source, faqs) {
  const faqText = (faqs || []).map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n');
  return `Rewrite the following into an original, well-structured BeingWise page titled "${title}".
Structure the body as: a 1-2 sentence intro, then a "## Key takeaways" section with 3-4 bullet points, then 3-5 more ## sections, then a closing line. Where relevant, reference official sources BY NAME only (e.g. "the official JoSAA portal", "NTA", "NIRF rankings") — never invent URLs or mention any other website/brand. 500-900 words.
Return ONLY JSON: {"body":"<markdown body as described>","description":"<150-160 char meta>","faqs":[{"q":"...","a":"..."} x 4-6]}.
SOURCE (rewrite, do not copy):
"""
${(source || '').slice(0, 4000)}
${faqText.slice(0, 4000)}
"""`;
}

async function gen(title, source, faqs, tries = 0) {
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [{ parts: [{ text: prompt(title, source, faqs) }] }],
        generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 8192, temperature: 0.7, thinkingConfig: { thinkingBudget: 0 } },
      }),
    });
  } catch (netErr) {
    // network drop / "fetch failed" — back off and retry
    if (tries > 6) throw new Error('net/' + String(netErr.message || netErr).slice(0, 30));
    await new Promise((r) => setTimeout(r, (tries + 1) * 3000));
    return gen(title, source, faqs, tries + 1);
  }
  if (res.status === 429 || res.status >= 500) {
    if (tries > 5) throw new Error(`rate/${res.status}`);
    await new Promise((r) => setTimeout(r, (tries + 1) * 4000));
    return gen(title, source, faqs, tries + 1);
  }
  if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 120)}`);
  const j = await res.json();
  const text = j.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    if (tries < 2) { await new Promise((r) => setTimeout(r, 1500)); return gen(title, source, faqs, tries + 1); }
    throw new Error('empty/' + (j.candidates?.[0]?.finishReason || 'no-text'));
  }
  try { return JSON.parse(text); }
  catch (e) {
    if (tries < 2) { await new Promise((r) => setTimeout(r, 1200)); return gen(title, source, faqs, tries + 1); }
    throw new Error('json/' + e.message.slice(0, 40));
  }
}

async function main() {
  const dir = join(ROOT, 'src/content', coll);
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  const todo = [];
  for (const f of files) {
    const p = join(dir, f);
    let m; try { m = matter(readFileSync(p, 'utf8')); } catch { continue; }
    if (m.data.rewritten) continue;
    todo.push({ p, m });
  }
  const batch = todo.slice(0, LIMIT);
  console.log(`${coll}: ${todo.length} pending, doing ${batch.length} (conc ${CONC}, ${MODEL})`);
  let ok = 0, fail = 0, i = 0;
  async function worker() {
    while (i < batch.length) {
      const { p, m } = batch[i++];
      const title = m.data.title || m.data.name || 'Guide';
      try {
        const out = await gen(title, m.content, m.data.faqs);
        const data = { ...m.data, rewritten: true };
        if (out.description) data.description = out.description.slice(0, 165);
        if (Array.isArray(out.faqs) && out.faqs.length) data.faqs = out.faqs.filter((x) => x.q && x.a);
        writeFileSync(p, matter.stringify('\n' + String(out.body || '').trim() + '\n', data));
        ok++;
        if (ok % 20 === 0) console.log(`  ...${ok} done`);
      } catch (e) { fail++; if (fail <= 8) console.error(`  ✗ ${p.split('/').pop()}: ${e.message}`); }
    }
  }
  const t0 = Date.now();
  await Promise.all(Array.from({ length: CONC }, worker));
  const sec = ((Date.now() - t0) / 1000).toFixed(0);
  console.log(`DONE ${coll}: ok ${ok}, fail ${fail}, ${sec}s (${(ok / (sec / 60)).toFixed(1)}/min)`);
}
main().catch((e) => { console.error(e); process.exit(1); });
