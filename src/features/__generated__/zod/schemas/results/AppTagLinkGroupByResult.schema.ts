import * as z from 'zod';
export const AppTagLinkGroupByResultSchema = z.array(z.object({
  id: z.string(),
  tagId: z.string(),
  targetId: z.string(),
  createdAt: z.date(),
  _count: z.object({
    id: z.number(),
    tagId: z.number(),
    targetType: z.number(),
    targetId: z.number(),
    createdAt: z.number(),
    tag: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    tagId: z.string().nullable(),
    targetId: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    tagId: z.string().nullable(),
    targetId: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()
}));