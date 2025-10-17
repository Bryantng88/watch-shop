import * as z from 'zod';
export const AcquisitionItemAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    acquisitionId: z.number(),
    productId: z.number(),
    variantId: z.number(),
    quantity: z.number(),
    unitCost: z.number(),
    currency: z.number(),
    notes: z.number(),
    sourceOrderItemId: z.number(),
    createdAt: z.number(),
    acquisition: z.number(),
    product: z.number(),
    sourceOrderItem: z.number(),
    variant: z.number()
  }).optional(),
  _sum: z.object({
    quantity: z.number().nullable(),
    unitCost: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    quantity: z.number().nullable(),
    unitCost: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    acquisitionId: z.string().nullable(),
    productId: z.string().nullable(),
    variantId: z.string().nullable(),
    quantity: z.number().int().nullable(),
    unitCost: z.number().nullable(),
    currency: z.string().nullable(),
    notes: z.string().nullable(),
    sourceOrderItemId: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    acquisitionId: z.string().nullable(),
    productId: z.string().nullable(),
    variantId: z.string().nullable(),
    quantity: z.number().int().nullable(),
    unitCost: z.number().nullable(),
    currency: z.string().nullable(),
    notes: z.string().nullable(),
    sourceOrderItemId: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()});