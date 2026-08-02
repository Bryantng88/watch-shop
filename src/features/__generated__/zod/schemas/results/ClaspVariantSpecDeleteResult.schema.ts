import * as z from 'zod';
export const ClaspVariantSpecDeleteResultSchema = z.nullable(z.object({
  variantId: z.string(),
  claspType: z.unknown(),
  widthMM: z.number().int(),
  originType: z.unknown(),
  brandName: z.string().optional(),
  color: z.string().optional(),
  finish: z.string().optional(),
  minStockQty: z.number().int(),
  targetStockQty: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ProductVariant: z.unknown()
}));