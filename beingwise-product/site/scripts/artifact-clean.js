// artifact-clean.js — fix scrape markup artifacts WITHOUT deleting data/numbers.
//  - "Mechanical EngineeringOffered ByIIT Bombay" -> "Mechanical Engineering — Offered by IIT Bombay"
//  - strip stray/broken HTML tags (<location>, <tel:..>, <a href="https://www./..">), keep inner text
//  - fix broken markdown links [text](https://www./path) -> text
//  - de-emphasize orphan **123**/*123* numbers that read as stray tags (keep the number)
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const ROOT = new URL('..', import.meta.url).pathname;
const COLLECTIONS = ['articles', 'questions', 'colleges', 'blog'];

function fix(s) {
  if (!s) return s;
  let o = s;
  // label mashing: "<word>Offered By<Capital>" -> "<word> — Offered by <Capital>"
  o = o.replace(/([a-z0-9,)\]])Offered By/g, '$1 — Offered by ');
  o = o.replace(/Offered By([A-Z(])/g, 'Offered by $1');
  o = o.replace(/Offered By\b/g, 'Offered by');
  // broken markdown links where domain was stripped: [text](https://www./..) or (http://www./..)
  o = o.replace(/\[([^\]]+)\]\(https?:\/\/www\.?\/[^)]*\)/gi, '$1');
  o = o.replace(/\[([^\]]+)\]\(\s*\)/g, '$1');
  // raw HTML anchors -> keep text
  o = o.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1');
  o = o.replace(/<a\b[^>]*>/gi, '');
  // tel:/mailto:/location and other stray tags -> strip the tag, keep text
  o = o.replace(/<\/?(?:location|tel|mailto|em|strong|b|i|u|span|div|p|br|hr|h[1-6]|ul|ol|li|table|tr|td|th|tbody|thead|section|article|figure|figcaption|small|sup|sub)\b[^>]*>/gi, '');
  o = o.replace(/<(?:tel|mailto):[^>]*>/gi, '');
  // any remaining simple tag-like token <word ...>
  o = o.replace(/<\/?[a-z][a-z0-9]*(?:\s[^<>]{0,80})?>/gi, '');
  // de-emphasize standalone bold/italic bare numbers (keep the number)
  o = o.replace(/\*\*(\d[\d,. ]*)\*\*/g, '$1').replace(/(?<!\*)\*(\d[\d,. ]*)\*(?!\*)/g, '$1');
  // tidy
  o = o.replace(/[ \t]{2,}/g, ' ').replace(/ +([.,;:])/g, '$1').replace(/—\s*—/g, '—');
  return o;
}

function fixBody(body) {
  return (body || '').split('\n').map(fix).join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

let changed = 0, scanned = 0;
for (const c of COLLECTIONS) {
  let files;
  try { files = readdirSync(join(ROOT, 'src/content', c)).filter((f) => f.endsWith('.md')); } catch { continue; }
  for (const f of files) {
    const p = join(ROOT, 'src/content', c, f);
    let m;
    try { m = matter(readFileSync(p, 'utf8')); } catch { continue; }
    scanned++;
    const body = fixBody(m.content);
    const data = { ...m.data };
    let touched = body !== m.content;
    if (Array.isArray(data.faqs)) {
      const before = JSON.stringify(data.faqs);
      data.faqs = data.faqs.map((x) => ({ q: fix(x.q), a: fix(x.a) }));
      if (JSON.stringify(data.faqs) !== before) touched = true;
    }
    if (data.description) { const d = fix(data.description); if (d !== data.description) { data.description = d; touched = true; } }
    if (data.title) { const t = fix(data.title); if (t !== data.title) { data.title = t; touched = true; } }
    if (touched) { writeFileSync(p, matter.stringify(body, data)); changed++; }
  }
}
console.log(`artifact-clean: scanned ${scanned}, fixed ${changed}`);
