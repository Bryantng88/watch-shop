import * as z from 'zod';
export const AppTagGroupByResultSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  color: z.string(),
  ownerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    name: z.number(),
    slug: z.number(),
    color: z.number(),
    scope: z.number(),
    ownerType: z.number(),
    ownerId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    links: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    slug: z.string().nullable(),
    color: z.string().nullable(),
    ownerId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    slug: z.string().nullable(),
    color: z.string().nullable(),
    ownerId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));