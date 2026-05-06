import * as z from 'zod';
export const WatchReviewStateGroupByResultSchema = z.array(z.object({
  id: z.string(),
  watchId: z.string(),
  productId: z.string(),
  submittedAt: z.date(),
  submittedById: z.string(),
  reviewedAt: z.date(),
  reviewedById: z.string(),
  reviewNote: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
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
  }).nullable().optional()
}));