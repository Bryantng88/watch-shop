import * as z from 'zod';
export const PartVariantSpecCreateResultSchema = z.object({
  variantId: z.string(),
  partType: z.unknown(),
  ProductVariant: z.unknown()
});