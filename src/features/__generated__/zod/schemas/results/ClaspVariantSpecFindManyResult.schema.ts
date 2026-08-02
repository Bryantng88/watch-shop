import * as z from 'zod';
export const ClaspVariantSpecFindManyResultSchema = z.object({
  data: z.array(z.object({
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