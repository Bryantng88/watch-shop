import * as z from 'zod';
export const PartVariantSpecCreateResultSchema = z.object({
  variantId: z.string(),
  partType: z.unknown(),
  variant: z.unknown()
});