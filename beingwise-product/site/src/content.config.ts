import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Curated, hand-written JoSAA guides (pillar + clusters).
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    seoTitle: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    theme: z.string(),
    keywords: z.array(z.string()).default([]),
    pillar: z.boolean().default(false),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(),
    author: z.string().default('The BeingWise Team'),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    related: z.array(z.string()).default([]),
  }),
});

// Imported corpus (guides/courses/exams/subjects) — shared schema.
const corpusSchema = z.object({
  title: z.string(),
  description: z.string().optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  date: z.string().optional(),
  author: z.string().optional(),
  category: z.string().optional(),
  topic: z.string().optional(),
  related: z.array(z.string()).optional().default([]),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional().default([]),
  rewritten: z.boolean().optional().default(false),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: corpusSchema,
});

const questions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/questions' }),
  schema: corpusSchema,
});

const colleges = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/colleges' }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string().optional().default(''),
    city: z.string().optional(),
    state: z.string().optional(),
    rating: z.coerce.string().optional(),
    reviewCount: z.coerce.string().optional(),
    website: z.string().optional(),
    topic: z.string().optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional().default([]),
    related: z.array(z.string()).optional().default([]),
  }),
});

export const collections = { blog, articles, questions, colleges };
