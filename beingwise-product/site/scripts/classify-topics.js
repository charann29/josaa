// classify-topics.js — assign one clean `topic` to each corpus page from its
// title (tags are noisy site-wide meta-keywords). Powers /topics hubs.
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const ROOT = new URL('..', import.meta.url).pathname;

// priority order matters (first match wins)
const TOPICS = [
  ['engineering', /\b(jee|josaa|csab|nit|iit|iiit|gfti|b\.?tech|btech|m\.?tech|engineering|gate|polytechnic)\b/i],
  ['medical', /\b(neet|mbbs|bds|md|ms|medical|nursing|pharm|ayush|bams|bhms|veterinary|physiotherapy)\b/i],
  ['management', /\b(mba|bba|pgdm|management|\bcat\b|cmat|\bmat\b|xat|business administration)\b/i],
  ['study-abroad', /\b(study abroad|abroad|gre|gmat|ielts|toefl|\busa\b|\buk\b|canada|germany|australia)\b/i],
  ['law', /\b(law|llb|llm|clat|judiciary|advocate)\b/i],
  ['design-architecture', /\b(design|nift|nid|fashion|interior|b\.?arch|architecture|animation)\b/i],
  ['commerce-finance', /\b(b\.?com|commerce|\bca\b|cma|\bcs\b|accounting|finance|banking|economics)\b/i],
  ['science', /\b(b\.?sc|m\.?sc|physics|chemistry|biology|mathematics|biotech|microbiology|statistics)\b/i],
  ['exams', /\b(exam|admit card|result|syllabus|answer key|cut ?off|application form|hall ticket|eligibility)\b/i],
  ['careers', /\b(career|job|salary|profession|scope|placement|after 12th|after graduation|courses after)\b/i],
];
const DEFAULT = 'study-guides';

function topicFor(title) {
  const t = (title || '').toLowerCase();
  for (const [name, re] of TOPICS) if (re.test(t)) return name;
  return DEFAULT;
}

const dist = {};
for (const coll of ['articles', 'questions']) {
  const dir = join(ROOT, 'src/content', coll);
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    const p = join(dir, f);
    const parsed = matter(readFileSync(p, 'utf8'));
    const topic = topicFor(parsed.data.title);
    parsed.data.topic = topic;
    dist[topic] = (dist[topic] || 0) + 1;
    writeFileSync(p, matter.stringify(parsed.content, parsed.data));
  }
}
console.log(JSON.stringify(dist, null, 2));
