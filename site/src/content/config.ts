import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Used in <title> / OG if different from H1 title.
    seoTitle: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    theme: z.string(),                         // research theme, e.g. choice_filling
    keywords: z.array(z.string()).default([]),
    pillar: z.boolean().default(false),        // true for the hub guide
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(),
    author: z.string().default('The BeingWise Team'),
    // FAQ entries become an on-page accordion + FAQPage JSON-LD.
    faqs: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .default([]),
    // slugs of related posts for internal linking (without /blog/ prefix)
    related: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
