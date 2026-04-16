import * as z from 'zod';
export const system_job_controlFindManyResultSchema = z.object({
  data: z.array(z.object({
  key: z.string(),
  label: z.string(),
  enabled: z.boolean(),
  batch_size: z.number().int(),
  paused_reason: z.string().optional(),
  metadata: z.unknown().optional(),
  updated_at: z.date(),
  updated_by: z.string().optional()
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