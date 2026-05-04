import * as z from 'zod';
export const MediaAssetFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  key: z.string(),
  parentPrefix: z.string(),
  fileName: z.string(),
  ext: z.string().optional(),
  sizeBytes: z.number().int().optional(),
  etag: z.string().optional(),
  lastModified: z.date().optional(),
  profile: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
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