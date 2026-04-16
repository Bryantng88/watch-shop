import * as z from 'zod';
export const PartVariantSpecFindFirstResultSchema = z.nullable(z.object({
  variantId: z.string(),
  partType: z.unknown(),
  ProductVariant: z.unknown()
}));