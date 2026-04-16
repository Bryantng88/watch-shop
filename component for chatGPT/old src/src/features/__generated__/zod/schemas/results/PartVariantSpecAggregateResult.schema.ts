import * as z from 'zod';
export const PartVariantSpecAggregateResultSchema = z.object({  _count: z.object({
    variantId: z.number(),
    partType: z.number(),
    variant: z.number()
  }).optional(),
  _min: z.object({
    variantId: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    variantId: z.string().nullable()
  }).nullable().optional()});