import * as z from 'zod';
export const system_job_run_logDeleteResultSchema = z.nullable(z.object({
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
}));