import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';

export async function GET(context) {
  const posts = (await getCollection('blog')).filter((p) => !p.data.draft);
  posts.sort((a, b) => +new Date(b.data.pubDate) - +new Date(a.data.pubDate));
  return rss({
    title: `${SITE.name} — JoSAA & JEE Counselling Guides`,
    description: SITE.description,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: new Date(p.data.pubDate),
      link: `/blog/${p.slug}`,
    })),
    customData: `<language>en-in</language>`,
  });
}
