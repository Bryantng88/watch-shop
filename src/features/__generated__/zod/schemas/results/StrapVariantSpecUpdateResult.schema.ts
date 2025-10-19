import * as z from 'zod';
export const StrapVariantSpecUpdateResultSchema = z.nullable(z.object({
  variantId: z.string(),
  widthMM: z.number().int(),
  lengthLabel: z.unknown().optional(),
  color: z.string().optional(),
  material: z.unknown(),
  quickRelease: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  variant: z.unknown()
}));