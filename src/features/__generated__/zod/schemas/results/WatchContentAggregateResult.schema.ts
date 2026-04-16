import * as z from 'zod';
export const WatchContentAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    watchId: z.number(),
    titleOverride: z.number(),
    summary: z.number(),
    hookText: z.number(),
    body: z.number(),
    bulletSpecs: z.number(),
    seoTitle: z.number(),
    seoDescription: z.number(),
    aiMetaJson: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    watch: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    watchId: z.string().nullable(),
    titleOverride: z.string().nullable(),
    summary: z.string().nullable(),
    hookText: z.string().nullable(),
    body: z.string().nullable(),
    bulletSpecs: z.array(z.string()).nullable(),
    seoTitle: z.string().nullable(),
    seoDescription: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    watchId: z.string().nullable(),
    titleOverride: z.string().nullable(),
    summary: z.string().nullable(),
    hookText: z.string().nullable(),
    body: z.string().nullable(),
    bulletSpecs: z.array(z.string()).nullable(),
    seoTitle: z.string().nullable(),
    seoDescription: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});