// seo-clean.js — content quality pass over the imported corpus (site/src/content).
//  T2: strip scraped chrome (Views/Answer(N)/tag-chips/boilerplate/stray **)
//  T4: tidy titles
//  T3: prune thin/junk pages (word count < MIN_WORDS, empty/gibberish titles)
import { readdirSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const ROOT = new URL('..', import.meta.url).pathname;
const COLLECTIONS = ['articles', 'questions']; // never the hand-written curated blog
const MIN_WORDS = 45; // prune below this (does not apply to curated blog)

const DROP_LINE = [
  /^\s*\d+\s*views?\s*$/i,
  /^\s*\d+\s*answers?\s*$/i,
  /^\s*answers?\s*\(\d+\)\s*$/i,
  /^\s*\*+\s*$/,                      // stray ** / *
  /^#[A-Za-z0-9][^\n]*$/,             // hashtag tag-chips (#CS #Computer) — NOT md headings (## / "# " excluded)
  /^\s*(hello|hi|hey)[,.!]?\s*$/i,
  /^\s*(dear)?\s*(student|aspirant|candidate|sir|madam)[,.!]?\s*$/i,
  /^\s*hope (this|it) (helps?|clarifies)[!.]?\s*$/i,
  /^\s*thank(s| you)[.!]?\s*$/i,
  /^\s*regards?[,.!]?\s*$/i,
  /^\s*(good ?luck|all the best)[!.]?\s*$/i,
  /^\s*(read more|view all|load more|see more|follow|share)\s*$/i,
  /^\s*-\s*$/,                        // empty bullet
  /^\s*\*\*[^*]{1,70}\d{4}\s*$/,      // "**Author Name 6th Apr, 2026" byline lines
];

const stripMd = (s) => (s || '')
  .replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#>*_`|~-]+/g, ' ')
  .replace(/\s+/g, ' ').trim();

function cleanBody(body) {
  const lines = (body || '').split('\n');
  const kept = [];
  for (const ln of lines) {
    if (DROP_LINE.some((re) => re.test(ln))) continue;
    kept.push(ln);
  }
  return kept.join('\n').replace(/\n{3,}/g, '\n\n').replace(/^\s+|\s+$/g, '') + '\n';
}

function cleanTitle(t) {
  let s = (t || '').replace(/\s+/g, ' ').trim();
  // ALL-CAPS -> sentence-ish case
  if (s.length > 8 && s === s.toUpperCase()) s = s.charAt(0) + s.slice(1).toLowerCase();
  // capitalize first letter
  if (s) s = s.charAt(0).toUpperCase() + s.slice(1);
  return s;
}

function looksGibberish(title) {
  const words = (title || '').toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length < 3) return false;
  // mostly very-short tokens or no vowels -> likely transliteration noise
  const noVowel = words.filter((w) => /^[a-z]+$/.test(w) && !/[aeiou]/.test(w)).length;
  return noVowel / words.length > 0.5;
}

let report = {};
for (const name of COLLECTIONS) {
  const dir = join(ROOT, 'src/content', name);
  let files = [];
  try { files = readdirSync(dir).filter((f) => f.endsWith('.md')); } catch { continue; }
  let cleaned = 0, pruned = 0;
  for (const f of files) {
    const path = join(dir, f);
    const parsed = matter(readFileSync(path, 'utf8'));
    const body = cleanBody(parsed.content);
    const title = cleanTitle(parsed.data.title);
    const words = stripMd(body).split(/\s+/).filter(Boolean).length;
    // prune (corpus only; never the curated blog)
    if (name !== 'blog' && (words < MIN_WORDS || !title || title.length < 6 || looksGibberish(title))) {
      unlinkSync(path); pruned++; continue;
    }
    const data = { ...parsed.data, title };
    const after = matter.stringify(body, data);
    if (after !== matter.stringify(parsed.content, parsed.data)) cleaned++;
    writeFileSync(path, after);
  }
  report[name] = { remaining: files.length - pruned, cleaned, pruned };
}
console.log(JSON.stringify(report, null, 2));
