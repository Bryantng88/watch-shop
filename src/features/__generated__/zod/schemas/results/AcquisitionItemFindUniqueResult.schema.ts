import * as z from 'zod';
export const AcquisitionItemFindUniqueResultSchema = z.nullable(z.object({
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
}));