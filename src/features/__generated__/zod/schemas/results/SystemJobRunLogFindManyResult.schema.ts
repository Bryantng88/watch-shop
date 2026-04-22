import * as z from 'zod';
export const SystemJobRunLogFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  processorKey: z.string(),
  triggerSource: z.string(),
  status: z.string(),
  processedCount: z.number().int(),
  errorCount: z.number().int(),
  note: z.string().optional(),
  detail: z.unknown().optional(),
  startedAt: z.date(),
  finishedAt: z.date().optional()
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