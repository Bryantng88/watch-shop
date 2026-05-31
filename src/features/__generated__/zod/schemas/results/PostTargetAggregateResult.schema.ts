import * as z from 'zod';
export const PostTargetAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    name: z.number(),
    platform: z.number(),
    isActive: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    products: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    platform: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    platform: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});