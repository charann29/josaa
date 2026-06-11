// related.js — recompute internal related-links over site/src/content corpus.
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const ROOT = new URL('..', import.meta.url).pathname;
const COLLECTIONS = ['articles', 'questions', 'blog'];
const N = 6;
const STOP = new Set('a an the and or of for to in on at as is are be by with from this that these those i we you he she it they how what which why when who do does will can your you my our get got want need please best top list india indian vs not no all any more than then there here also'.split(' '));
const toks = (s) => Array.from(new Set((s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w))));

for (const name of COLLECTIONS) {
  const dir = join(ROOT, 'src/content', name);
  let files = [];
  try { files = readdirSync(dir).filter((f) => f.endsWith('.md')); } catch { continue; }
  const list = files.map((f) => {
    const p = matter(readFileSync(join(dir, f), 'utf8'));
    return { slug: f.replace(/\.md$/, ''), file: join(dir, f), data: p.data, content: p.content, tags: (p.data.tags || []).map((t) => String(t).toLowerCase()), tk: toks(p.data.title) };
  });
  const idx = new Map();
  const add = (k, i) => { if (!idx.has(k)) idx.set(k, []); idx.get(k).push(i); };
  list.forEach((e, i) => { e.tk.forEach((t) => add('k:' + t, i)); e.tags.forEach((t) => add('t:' + t, i)); });
  list.forEach((e, i) => {
    const score = new Map();
    const bump = (k, w) => { for (const j of idx.get(k) || []) { if (j !== i) score.set(j, (score.get(j) || 0) + w); } };
    e.tk.forEach((t) => bump('k:' + t, 1));
    e.tags.forEach((t) => bump('t:' + t, 3));
    e.data.related = [...score.entries()].sort((a, b) => b[1] - a[1]).slice(0, N).map(([j]) => list[j].slug);
    writeFileSync(e.file, matter.stringify(e.content, e.data));
  });
  console.log(`${name}: ${list.length} relinked`);
}
