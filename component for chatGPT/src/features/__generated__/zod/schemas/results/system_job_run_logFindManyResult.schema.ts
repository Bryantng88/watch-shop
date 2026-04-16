import * as z from 'zod';
export const system_job_run_logFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  processor_key: z.string(),
  trigger_source: z.string(),
  status: z.string(),
  processed_count: z.number().int(),
  error_count: z.number().int(),
  note: z.string().optional(),
  detail: z.unknown().optional(),
  started_at: z.date(),
  finished_at: z.date().optional()
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