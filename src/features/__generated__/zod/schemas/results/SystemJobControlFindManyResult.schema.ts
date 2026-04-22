import * as z from 'zod';
export const SystemJobControlFindManyResultSchema = z.object({
  data: z.array(z.object({
  key: z.string(),
  label: z.string(),
  enabled: z.boolean(),
  batchSize: z.number().int(),
  pausedReason: z.string().optional(),
  metadata: z.unknown().optional(),
  updatedAt: z.date(),
  updatedBy: z.string().optional()
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