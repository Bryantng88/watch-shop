import * as z from 'zod';
export const PartVariantSpecDeleteResultSchema = z.nullable(z.object({
  variantId: z.string(),
  partType: z.unknown(),
  variant: z.unknown()
}));