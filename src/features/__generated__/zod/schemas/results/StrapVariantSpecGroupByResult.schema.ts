import * as z from 'zod';
export const StrapVariantSpecGroupByResultSchema = z.array(z.object({
  variantId: z.string(),
  color: z.string(),
  quickRelease: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lugWidthMM: z.number().int(),
  buckleWidthMM: z.number().int(),
  _count: z.object({
    variantId: z.number(),
    color: z.number(),
    material: z.number(),
    quickRelease: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    lugWidthMM: z.number(),
    buckleWidthMM: z.number(),
    ProductVariant: z.number()
  }).optional(),
  _sum: z.object({
    lugWidthMM: z.number().nullable(),
    buckleWidthMM: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    lugWidthMM: z.number().nullable(),
    buckleWidthMM: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    variantId: z.string().nullable(),
    color: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    lugWidthMM: z.number().int().nullable(),
    buckleWidthMM: z.number().int().nullable()
  }).nullable().optional(),
  _max: z.object({
    variantId: z.string().nullable(),
    color: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    lugWidthMM: z.number().int().nullable(),
    buckleWidthMM: z.number().int().nullable()
  }).nullable().optional()
}));