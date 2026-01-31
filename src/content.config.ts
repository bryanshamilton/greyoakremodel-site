import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    location: z.string().optional(),
    images: z.array(z.string()),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = { projects };
