import * as z from 'zod';
export const StrapVariantSpecFindFirstResultSchema = z.nullable(z.object({
  variantId: z.string(),
  color: z.string().optional(),
  material: z.unknown(),
  quickRelease: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lugWidthMM: z.number().int(),
  buckleWidthMM: z.number().int().optional(),
  ProductVariant: z.unknown()
}));