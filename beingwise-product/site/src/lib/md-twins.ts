// Markdown "twin" generators for AI answer engines (AEO).
// Every content page also resolves at `<url>.md` returning clean canonical
// markdown — what dualmark targets, generated natively so we can include the
// real article body and our exact frontmatter shape.

const esc = (s: unknown): string => String(s ?? '').trim();

type Faq = { q?: string; a?: string };
const faqBlock = (faqs?: Faq[]): string =>
  Array.isArray(faqs) && faqs.length
    ? '\n\n## Frequently asked questions\n\n' +
      faqs.map((f) => `### ${esc(f.q)}\n\n${esc(f.a)}`).join('\n\n')
    : '';

const SITE_URL = 'https://www.beingwise.in';
const source = (route: string, id: string): string =>
  `\n\n---\nSource: ${SITE_URL}/${route}/${id} · Published by BeingWise (${SITE_URL}). Independent — not affiliated with JoSAA, CSAB, NTA or any government body.`;

interface TwinEntry {
  id: string;
  body?: string;
  data: Record<string, any>;
}

export function corpusTwin(route: 'articles' | 'questions', entry: TwinEntry): string {
  const d = entry.data;
  return (
    `# ${esc(d.title)}\n\n` +
    (d.description ? `${esc(d.description)}\n\n` : '') +
    (esc(entry.body) || esc(d.description)) +
    faqBlock(d.faqs) +
    source(route, entry.id)
  );
}

export function collegeTwin(entry: TwinEntry): string {
  const d = entry.data;
  const facts = [
    d.city && `- **City:** ${esc(d.city)}`,
    d.state && `- **State:** ${esc(d.state)}`,
    d.website && `- **Website:** ${esc(d.website)}`,
  ].filter(Boolean);
  return (
    `# ${esc(d.title || d.name)}\n\n` +
    (d.description ? `${esc(d.description)}\n\n` : '') +
    (facts.length ? facts.join('\n') + '\n\n' : '') +
    (esc(entry.body) || esc(d.description)) +
    faqBlock(d.faqs) +
    source('colleges', entry.id)
  );
}

export function blogTwin(entry: TwinEntry): string {
  const d = entry.data;
  return (
    `# ${esc(d.title)}\n\n` +
    (d.description ? `${esc(d.description)}\n\n` : '') +
    (d.author ? `_By ${esc(d.author)}_\n\n` : '') +
    (esc(entry.body) || esc(d.description)) +
    faqBlock(d.faqs) +
    source('blog', entry.id)
  );
}

export const MD_HEADERS = { 'Content-Type': 'text/markdown; charset=utf-8' };
