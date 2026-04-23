import * as z from 'zod';
export const AcquisitionSpecJobFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  acquisitionItemId: z.string(),
  productId: z.string(),
  status: z.string(),
  attempts: z.number().int(),
  lastError: z.string().optional(),
  startedAt: z.date().optional(),
  finishedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  runAfter: z.date().optional(),
  priority: z.number().int(),
  acquisitionItem: z.unknown(),
  product: z.unknown(),
  logs: z.array(z.unknown())
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