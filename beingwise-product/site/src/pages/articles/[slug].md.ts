import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { corpusTwin, MD_HEADERS } from '../../lib/md-twins';

export async function getStaticPaths() {
  const entries = await getCollection('articles');
  return entries.map((e) => ({ params: { slug: e.id }, props: { entry: e } }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(corpusTwin('articles', props.entry as any), { headers: MD_HEADERS });
