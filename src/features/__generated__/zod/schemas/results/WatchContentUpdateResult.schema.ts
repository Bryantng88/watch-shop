import * as z from 'zod';
export const WatchContentUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  watchId: z.string(),
  titleOverride: z.string().optional(),
  summary: z.string().optional(),
  hookText: z.string().optional(),
  body: z.string().optional(),
  bulletSpecs: z.array(z.string()),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  aiMetaJson: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  watch: z.unknown(),
  contentStatus: z.unknown(),
  submittedAt: z.date().optional(),
  submittedById: z.string().optional(),
  reviewedAt: z.date().optional(),
  reviewedById: z.string().optional(),
  reviewNote: z.string().optional(),
  publishedAt: z.date().optional(),
  publishedById: z.string().optional()
}));