import * as z from 'zod';
export const AcquisitionItemFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  acquisitionId: z.string(),
  productId: z.string().optional(),
  variantId: z.string().optional(),
  quantity: z.number().int(),
  unitCost: z.number().optional(),
  currency: z.string().optional(),
  notes: z.string().optional(),
  sourceOrderItemId: z.string().optional(),
  createdAt: z.date(),
  acquisition: z.unknown(),
  product: z.unknown().optional(),
  sourceOrderItem: z.unknown().optional(),
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