import * as z from 'zod';
export const AppTagLinkAggregateResultSchema = z.object({  _count: z.object({
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
  }).nullable().optional()});