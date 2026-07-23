import * as z from 'zod';
export const MediaObjectFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  bucket: z.string(),
  storageKey: z.string(),
  originalFileName: z.string().optional(),
  mimeType: z.string().optional(),
  sizeBytes: z.bigint().optional(),
  checksum: z.string().optional(),
  etag: z.string().optional(),
  availability: z.unknown(),
  verifiedAt: z.date().optional(),
  missingAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  bindings: z.array(z.unknown()),
  operations: z.array(z.unknown())
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