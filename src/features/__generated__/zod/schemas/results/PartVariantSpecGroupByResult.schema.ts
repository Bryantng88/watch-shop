import * as z from 'zod';
export const PartVariantSpecGroupByResultSchema = z.array(z.object({
  variantId: z.string(),
  _count: z.object({
    variantId: z.number(),
    partType: z.number(),
    variant: z.number()
  }).optional(),
  _min: z.object({
    variantId: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    variantId: z.string().nullable()
  }).nullable().optional()
}));