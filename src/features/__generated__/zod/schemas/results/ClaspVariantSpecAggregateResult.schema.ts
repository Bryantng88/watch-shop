import * as z from 'zod';
export const ClaspVariantSpecAggregateResultSchema = z.object({  _count: z.object({
    variantId: z.number(),
    claspType: z.number(),
    widthMM: z.number(),
    originType: z.number(),
    brandName: z.number(),
    color: z.number(),
    finish: z.number(),
    minStockQty: z.number(),
    targetStockQty: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    ProductVariant: z.number()
  }).optional(),
  _sum: z.object({
    widthMM: z.number().nullable(),
    minStockQty: z.number().nullable(),
    targetStockQty: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    widthMM: z.number().nullable(),
    minStockQty: z.number().nullable(),
    targetStockQty: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    variantId: z.string().nullable(),
    widthMM: z.number().int().nullable(),
    brandName: z.string().nullable(),
    color: z.string().nullable(),
    finish: z.string().nullable(),
    minStockQty: z.number().int().nullable(),
    targetStockQty: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    variantId: z.string().nullable(),
    widthMM: z.number().int().nullable(),
    brandName: z.string().nullable(),
    color: z.string().nullable(),
    finish: z.string().nullable(),
    minStockQty: z.number().int().nullable(),
    targetStockQty: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});