import * as z from 'zod';
export const MaintenancePartFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  recordId: z.string(),
  variantId: z.string().optional(),
  name: z.string(),
  quantity: z.number().int(),
  unitCost: z.number().optional(),
  notes: z.string().optional(),
  record: z.unknown(),
  variant: z.unknown().optional()
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