// authenticity-clean.js — make every page read as original BeingWise content.
//  - strip competitor / source brand names
//  - DROP whole sentences that reference things we don't host
//    ("download brochure", "click the link below", "read X reviews",
//     "Student Expert", "scroll down", "on our website", predictor-tool, etc.)
//  - regenerate chrome-y meta descriptions
//  - clean FAQ answers (frontmatter) the same way; drop FAQs left too short
import { readdirSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const ROOT = new URL('..', import.meta.url).pathname;
const COLLECTIONS = ['articles', 'questions', 'colleges'];

// distinct brand tokens (word-boundary, case-insensitive). Avoid common words.
const BRANDS = [
  /careers ?360/gi, /shiksha/gi, /collegedunia/gi, /college dunia/gi, /collegedekho/gi, /college dekho/gi,
  /getmyuni/gi, /embibe/gi, /byju'?s?/gi, /vedantu/gi, /unacademy/gi, /\btoppr\b/gi, /aglasem/gi,
  /collegepravesh/gi, /college pravesh/gi, /collegesearch/gi, /mouthshut/gi, /jagran ?josh/gi, /\bjagran\b/gi,
  /physics ?wallah/gi, /doubtnut/gi, /extramarks/gi, /india today/gi, /the week magazine/gi,
  /times of india/gi, /hindustan times/gi, /\bcollegebol\b/gi, /\bsulekha\b/gi,
];
// ranking-publisher words to drop only inside a "ranked by ..." list (kept minimal/safe)
const RANK_PUBS = /\b(india today|the week|outlook|business today|the times|times higher)\b/gi;

// sentence-level drop patterns (reference things we don't host / source voice)
const DROP_SENT = [
  /click\s+(on\s+)?(the\s+)?(link|here|below)/i,
  /link\s+(given|provided|mentioned)?\s*(below|above)/i,
  /below[- ]mentioned link/i,
  /download\s+(the\s+)?brochure/i,
  /\bread\b[^.!?]*\breviews?\b/i,
  /\b\d+\s+comments?\b/i,
  /\bscroll\s+(down|up)/i,
  /\b(student|career)\s+expert\b/i,
  /college predictor\s*(tool|20\d\d)/i,
  /\bas per our\b/i,
  /\bon our (website|portal|platform|page)\b/i,
  /\bregister on our\b/i,
  /\bour (college )?predictor\b/i,
  /\bvisit our\b/i,
  /\busing (the )?below[^.!?]*tool/i,
  /also download/i,
  /\b\d+\s+student reviews?\b/i,
  /offers?\s+\d+\s+courses?\s+across/i,
];

function stripBrands(s) {
  if (!s) return s;
  let out = s;
  // inside ranking lists, drop the publisher words first
  out = out.replace(RANK_PUBS, '');
  for (const re of BRANDS) out = out.replace(re, '');
  // tidy artifacts left by removals
  return out.replace(/\(\s*,?\s*\)/g, '').replace(/,\s*,/g, ',').replace(/\s+,/g, ',')
    .replace(/,\s*(\.|and\b)/gi, '$1').replace(/\s{2,}/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();
}

function dropSentences(text) {
  if (!text) return text;
  // split into sentences, keep those that don't match a drop pattern
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => { const t = s.trim(); return t && !DROP_SENT.some((re) => re.test(t)); })
    .join(' ')
    .trim();
}

function cleanText(s) {
  return stripBrands(dropSentences(stripBrands(s)));
}

function cleanBody(body) {
  return (body || '')
    .split('\n')
    .map((ln) => {
      if (/^#{1,6}\s/.test(ln) || /^\s*[-*]\s/.test(ln) || /^\s*\d+\.\s/.test(ln)) {
        // keep list/heading marker, clean the text part
        const m = ln.match(/^(\s*(?:#{1,6}|[-*]|\d+\.)\s+)(.*)$/);
        if (m) { const cleaned = cleanText(m[2]); return cleaned ? m[1] + cleaned : ''; }
      }
      return cleanText(ln);
    })
    .filter((ln, i, arr) => !(ln === '' && arr[i - 1] === ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
}

const stripMd = (s) => (s || '').replace(/[#>*_`|~\\[\]()]/g, ' ').replace(/https?:\S+/g, ' ').replace(/\s+/g, ' ').trim();
function makeDesc(body, title) {
  const t = stripMd(body); if (!t) return (title || '').slice(0, 155);
  let out = '';
  for (const s of t.split(/(?<=[.!?])\s+/)) { if ((out + ' ' + s).trim().length > 158) { if (!out) out = s.slice(0, 155); break; } out = (out + ' ' + s).trim(); }
  return out.length > 160 ? out.slice(0, 157).replace(/\s+\S*$/, '') + '…' : out;
}
const chromeyDesc = (d) => !d || /student reviews?|\bcomments?\b|download brochure|courses?\s+across|\d+\s+courses/i.test(d);

const report = {};
for (const name of COLLECTIONS) {
  const dir = join(ROOT, 'src/content', name);
  let files;
  try { files = readdirSync(dir).filter((f) => f.endsWith('.md')); } catch { continue; }
  let pruned = 0, changed = 0;
  for (const f of files) {
    const p = join(dir, f);
    let parsed;
    try { parsed = matter(readFileSync(p, 'utf8')); }
    catch (e) { console.error(`skip (bad yaml): ${name}/${f}`); continue; }
    const before = parsed.content + JSON.stringify(parsed.data);
    const body = cleanBody(parsed.content);
    const data = { ...parsed.data };
    // clean FAQ answers + questions
    if (Array.isArray(data.faqs)) {
      data.faqs = data.faqs
        .map((x) => ({ q: stripBrands(x.q), a: cleanText(x.a) }))
        .filter((x) => x.q && x.a && x.a.length > 25);
    }
    if (data.description) data.description = stripBrands(data.description);
    // college pages: regenerate chrome-y descriptions from name/city
    if (name === 'colleges' && chromeyDesc(data.description)) {
      data.description = `${data.name}${data.city ? `, ${data.city}` : ''}: courses, fees, admission, cutoff, ranking and placements — explained simply for students.`;
    } else if (chromeyDesc(data.description)) {
      data.description = makeDesc(body, data.title || data.name);
    }
    if (data.title) data.title = stripBrands(data.title);
    if (data.name) data.name = stripBrands(data.name);

    // prune: corpus pages that lost too much; colleges need >=2 faqs OR body
    const words = stripMd(body).split(/\s+/).filter(Boolean).length;
    const faqWords = (data.faqs || []).reduce((a, x) => a + x.a.split(/\s+/).length, 0);
    if (name === 'colleges') {
      if ((data.faqs || []).length < 2 && words < 40) { unlinkSync(p); pruned++; continue; }
    } else if (words + faqWords < 45) { unlinkSync(p); pruned++; continue; }

    const after = body + JSON.stringify(data);
    if (after !== before) changed++;
    writeFileSync(p, matter.stringify(body, data));
  }
  report[name] = { remaining: files.length - pruned, changed, pruned };
}
console.log(JSON.stringify(report, null, 2));
