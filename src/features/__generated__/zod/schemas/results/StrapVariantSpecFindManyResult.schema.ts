import * as z from 'zod';
export const StrapVariantSpecFindManyResultSchema = z.object({
  data: z.array(z.object({
  variantId: z.string(),
  color: z.string().optional(),
  material: z.unknown(),
  quickRelease: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lugWidthMM: z.number().int(),
  buckleWidthMM: z.number().int().optional(),
  originType: z.unknown(),
  brandName: z.string().optional(),
  leatherType: z.string().optional(),
  surface: z.unknown().optional(),
  inventoryPolicy: z.unknown(),
  claspType: z.unknown().optional(),
  claspWidthMM: z.number().int().optional(),
  claspOriginType: z.unknown().optional(),
  finish: z.string().optional(),
  lengthClass: z.unknown().optional(),
  minStockQty: z.number().int(),
  targetStockQty: z.number().int(),
  braceletReference: z.string().optional(),
  defaultFullLinks: z.number().int().optional(),
  defaultHalfLinks: z.number().int().optional(),
  defaultEndLinks: z.number().int().optional(),
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