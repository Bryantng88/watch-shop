import * as z from 'zod';
export const WatchContentFindManyResultSchema = z.object({
  data: z.array(z.object({
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
  watch: z.unknown()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});