import * as z from 'zod';
export const PartVariantSpecFindUniqueResultSchema = z.nullable(z.object({
  variantId: z.string(),
  partType: z.unknown(),
  variant: z.unknown()
}));