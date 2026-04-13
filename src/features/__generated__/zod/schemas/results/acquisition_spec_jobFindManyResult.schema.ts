import * as z from 'zod';
export const acquisition_spec_jobFindManyResultSchema = z.object({
  data: z.array(z.object({
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