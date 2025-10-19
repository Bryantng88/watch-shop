import * as z from 'zod';
export const MaintenancePartAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    recordId: z.number(),
    variantId: z.number(),
    name: z.number(),
    quantity: z.number(),
    unitCost: z.number(),
    notes: z.number(),
    record: z.number(),
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
    recordId: z.string().nullable(),
    variantId: z.string().nullable(),
    name: z.string().nullable(),
    quantity: z.number().int().nullable(),
    unitCost: z.number().nullable(),
    notes: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    recordId: z.string().nullable(),
    variantId: z.string().nullable(),
    name: z.string().nullable(),
    quantity: z.number().int().nullable(),
    unitCost: z.number().nullable(),
    notes: z.string().nullable()
  }).nullable().optional()});