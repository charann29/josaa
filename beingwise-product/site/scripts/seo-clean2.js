// seo-clean2.js — aggressive de-chrome pass for generic-converted corpus.
// Removes Q&A bylines, view/answer counts, comment/share chrome, escaped #tag
// lines, truncated URLs, predictor-promo lines, and trims trailing
// "Related Questions / Know More about" sections. Regenerates chrome-y meta
// descriptions. Re-prunes anything left too thin.
import { readdirSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const ROOT = new URL('..', import.meta.url).pathname;
const COLLECTIONS = ['articles', 'questions'];
const MIN_WORDS = 45;

const TRAILING = /^#{1,6}\s*(related\s+questions?|know\s+more\s+about|recommended|popular\s+(colleges?|questions?)|latest\s+(articles?|questions?)|you\s+may\s+(also\s+)?like|similar\s+questions?|trending|other\s+questions?)\b/i;

const DROP = [
  /^\\?#[A-Za-z0-9].*$/,                                   // #tag / \#tag chips
  /^\s*\d[\d,]*\s*views?\s*$/i,
  /^\s*answers?\s*\(\d+\)\s*$/i,
  /^\s*(comment|more|share|follow|like|upvote|downvote|facebook|twitter|whatsapp|telegram|copy link|facebook copy link|report)\s*$/i,
  /^\s*\**\s*$/,                                           // empty bold / blank-ish
  /^\s*-\s*$/,                                             // empty bullet
  /^\s*\.\.\.\s*$/,
  /^https?:\\?\/\/[a-z0-9.-]*\.?\s*$/i,                    // bare / truncated URL line
  /^\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}\s+(student\s+expert|expert|faculty|counsel+or)\b.*$/i, // "Name Student Expert 30th Sep, 2021"
  /^.{0,45}\b\d{1,2}(st|nd|rd|th)\s+[A-Z][a-z]+,?\s+\d{4}\s*$/,  // lines ending in a date byline
  /^\s*(hello|hi|hey)\b.{0,20}$/i,
  /^\s*(dear\s+)?(student|aspirant|candidate|sir|madam)\b.{0,15}$/i,
  /^\s*hope (this|it|the).{0,40}(help|clarif|inform).{0,12}$/i,
  /^\s*(thanks?|thank you|regards?|good ?luck|all the best)[!.\s]*$/i,
  /college predictor (tool|20\d\d|-)/i,                   // predictor promo lines
  /^\s*(admissions?\s+courses?\s*&?\s*fees?\s+cut.?off.*)$/i,
  /^#{3,}\s+.{0,40}\.\.\.\s*$/,                            // "##### College Name ..."
];

const stripMd = (s) => (s || '').replace(/```[\s\S]*?```/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#>*_`|~\\-]+/g, ' ').replace(/https?:\S+/g, ' ').replace(/\s+/g, ' ').trim();

function cleanBody(body) {
  const lines = (body || '').split('\n');
  const out = [];
  for (const raw of lines) {
    const ln = raw.replace(/^\\\s+/, '').replace(/^\\(?=[#])/, ''); // de-escape leading "\ " and "\#"
    if (TRAILING.test(ln)) break;                                  // drop trailing section + everything after
    if (DROP.some((re) => re.test(ln))) continue;
    out.push(ln);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function makeDesc(body, title) {
  const t = stripMd(body);
  if (!t) return (title || '').slice(0, 155);
  let out = '';
  for (const s of t.split(/(?<=[.!?])\s+/)) {
    if ((out + ' ' + s).trim().length > 158) { if (!out) out = s.slice(0, 155); break; }
    out = (out + ' ' + s).trim();
  }
  return out.length > 160 ? out.slice(0, 157).replace(/\s+\S*$/, '') + '…' : out;
}
const chromey = (d) => !d || /\bviews?\b|answers?\s*\(|student expert|^\s*\\|copy link|^\s*#/i.test(d);

const report = {};
for (const name of COLLECTIONS) {
  const dir = join(ROOT, 'src/content', name);
  let files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  let pruned = 0;
  for (const f of files) {
    const p = join(dir, f);
    const parsed = matter(readFileSync(p, 'utf8'));
    const body = cleanBody(parsed.content);
    const words = stripMd(body).split(/\s+/).filter(Boolean).length;
    if (words < MIN_WORDS) { unlinkSync(p); pruned++; continue; }
    const data = { ...parsed.data };
    if (chromey(data.description)) data.description = makeDesc(body, data.title);
    writeFileSync(p, matter.stringify(body, data));
  }
  report[name] = { remaining: files.length - pruned, pruned };
}
console.log(JSON.stringify(report, null, 2));
