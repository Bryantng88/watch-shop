import * as z from 'zod';
export const WatchReviewStateAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    watchId: z.number(),
    productId: z.number(),
    targetType: z.number(),
    status: z.number(),
    submittedAt: z.number(),
    submittedById: z.number(),
    reviewedAt: z.number(),
    reviewedById: z.number(),
    reviewNote: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    watch: z.number(),
    WatchReviewLog: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    watchId: z.string().nullable(),
    productId: z.string().nullable(),
    submittedAt: z.date().nullable(),
    submittedById: z.string().nullable(),
    reviewedAt: z.date().nullable(),
    reviewedById: z.string().nullable(),
    reviewNote: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    watchId: z.string().nullable(),
    productId: z.string().nullable(),
    submittedAt: z.date().nullable(),
    submittedById: z.string().nullable(),
    reviewedAt: z.date().nullable(),
    reviewedById: z.string().nullable(),
    reviewNote: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});