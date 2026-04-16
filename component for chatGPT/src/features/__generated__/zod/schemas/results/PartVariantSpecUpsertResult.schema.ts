import * as z from 'zod';
export const PartVariantSpecUpsertResultSchema = z.object({
  variantId: z.string(),
  partType: z.unknown(),
  variant: z.unknown()
});