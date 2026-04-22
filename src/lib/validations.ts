import { z } from 'zod';

export const BlogSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  content: z
    .string()
    .min(1, 'Content is required'),

  author: z
    .string()
    .min(1, 'Author is required')
    .trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .optional(),
  published: z
    .boolean()
    .default(false),

});

export const BlogUpdateSchema = BlogSchema.partial();

export type BlogInput = z.infer<typeof BlogSchema>;
export type BlogUpdateInput = z.infer<typeof BlogUpdateSchema>;
