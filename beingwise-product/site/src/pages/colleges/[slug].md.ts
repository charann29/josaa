import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { collegeTwin, MD_HEADERS } from '../../lib/md-twins';

export async function getStaticPaths() {
  const entries = await getCollection('colleges');
  return entries.map((e) => ({ params: { slug: e.id }, props: { entry: e } }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(collegeTwin(props.entry as any), { headers: MD_HEADERS });
