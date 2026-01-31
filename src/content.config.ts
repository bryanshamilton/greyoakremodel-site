import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const mediaItemSchema = z.object({
  type: z.enum(['image', 'video']),
  url: z.string(),
  poster: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    location: z.string().optional(),
    media: z.array(mediaItemSchema),
    permalink: z.string().optional(),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = { projects };
