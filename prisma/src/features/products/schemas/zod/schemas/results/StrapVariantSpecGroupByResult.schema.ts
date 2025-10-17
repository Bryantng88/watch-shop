import * as z from 'zod';
export const StrapVariantSpecGroupByResultSchema = z.array(z.object({
  variantId: z.string(),
  widthMM: z.number().int(),
  color: z.string(),
  quickRelease: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    variantId: z.number(),
    widthMM: z.number(),
    lengthLabel: z.number(),
    color: z.number(),
    material: z.number(),
    quickRelease: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    variant: z.number()
  }).optional(),
  _sum: z.object({
    widthMM: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    widthMM: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    variantId: z.string().nullable(),
    widthMM: z.number().int().nullable(),
    color: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    variantId: z.string().nullable(),
    widthMM: z.number().int().nullable(),
    color: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));