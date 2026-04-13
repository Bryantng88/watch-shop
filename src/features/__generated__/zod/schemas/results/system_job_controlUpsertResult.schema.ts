import * as z from 'zod';
export const system_job_controlUpsertResultSchema = z.object({
  key: z.string(),
  label: z.string(),
  enabled: z.boolean(),
  batch_size: z.number().int(),
  paused_reason: z.string().optional(),
  metadata: z.unknown().optional(),
  updated_at: z.date(),
  updated_by: z.string().optional()
});