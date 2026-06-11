// descriptive-slugs.js — rename files to clean, descriptive, keyword-rich slugs.
// Run ONCE at finalization (after rewrite; before deploy). Renames files, drops
// junk college pages, writes scripts/slug-remap.json (old->new) so related links
// can be recomputed afterwards. Articles/questions: slug from (final) title.
// Colleges: slug from name (+ city).
import { readdirSync, readFileSync, writeFileSync, renameSync, unlinkSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const ROOT = new URL('..', import.meta.url).pathname;
const MAXLEN = 75;

const STOP = new Set('a an the and or of for to in on at as is are be by with from this that these those i we you he she it they how what which why when who do does did can could should would will may my our your me us them his her its their there here also not no all any more than then'.split(' '));
const TAIL = new Set('a an the and or of for to in on at as is are be by with from how what which can do i my your no not the and'.split(' '));
const COLLEGE_JUNK = [/reviewscourse/i, /^compare/i, /^reviews?[a-z]*\d/i, /^mba-pgdm-bc-?\d/i, /^mba-pgdm-bc[a-z]/i, /\d{4,}/, /^course[s-]?\d/i, /^admission[s-]?\d/i, /ctry\d/i, /bc\d+edet/i, /^[a-z]{1,3}-?\d+$/i];

function descriptive(title) {
  let s = (title || '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').trim();
  let w = s.split(/\s+/).filter(Boolean);
  while (w.length && /^\d+$/.test(w[0]) && w.length > 4) w.shift();        // leading list numbers
  while (w.length > 5 && STOP.has(w[0])) w.shift();                         // leading stopwords
  while (w.length > 4 && TAIL.has(w[w.length - 1])) w.pop();               // trailing dangling
  const out = []; let len = 0;
  for (const x of w) { if (len + x.length + 1 > MAXLEN && out.length >= 4) break; out.push(x); len += x.length + 1; }
  while (out.length > 4 && TAIL.has(out[out.length - 1])) out.pop();
  return out.join('-').replace(/^-+|-+$/g, '') || 'page';
}

const remap = {};
for (const coll of ['articles', 'questions', 'colleges', 'blog']) {
  const dir = join(ROOT, 'src/content', coll);
  let files;
  try { files = readdirSync(dir).filter((f) => f.endsWith('.md')); } catch { continue; }
  const used = new Set();
  const map = {};
  let renamed = 0, pruned = 0;
  for (const f of files) {
    const oldSlug = f.replace(/\.md$/, '');
    const p = join(dir, f);
    let m;
    try { m = matter(readFileSync(p, 'utf8')); } catch { continue; }
    // blog keeps its hand-made slugs
    if (coll === 'blog') { map[oldSlug] = oldSlug; continue; }
    // colleges: junk prune + name-based slug
    let newSlug;
    if (coll === 'colleges') {
      const name = m.data.name || '';
      if (!name || name.length < 5 || COLLEGE_JUNK.some((re) => re.test(oldSlug))) { unlinkSync(p); pruned++; continue; }
      let base = name;
      if (m.data.city && !name.toLowerCase().includes(String(m.data.city).toLowerCase())) base += ' ' + m.data.city;
      newSlug = descriptive(base);
    } else {
      newSlug = descriptive(m.data.title || oldSlug);
    }
    if (used.has(newSlug)) { let i = 2; while (used.has(`${newSlug}-${i}`)) i++; newSlug = `${newSlug}-${i}`; }
    used.add(newSlug);
    map[oldSlug] = newSlug;
    if (newSlug !== oldSlug) { renameSync(p, join(dir, newSlug + '.md')); renamed++; }
  }
  remap[coll] = map;
  console.log(`${coll}: ${files.length} -> renamed ${renamed}, pruned ${pruned}`);
}
writeFileSync(join(ROOT, 'scripts/slug-remap.json'), JSON.stringify(remap));
console.log('wrote slug-remap.json');
