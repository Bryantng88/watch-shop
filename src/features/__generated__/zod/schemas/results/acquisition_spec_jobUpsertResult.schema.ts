import * as z from 'zod';
export const acquisition_spec_jobUpsertResultSchema = z.object({
  id: z.string(),
  acquisition_item_id: z.string(),
  product_id: z.string(),
  status: z.string(),
  attempts: z.number().int(),
  last_error: z.string().optional(),
  priority: z.number().int(),
  run_after: z.date(),
  started_at: z.date().optional(),
  finished_at: z.date().optional(),
  created_at: z.date(),
  updated_at: z.date()
});