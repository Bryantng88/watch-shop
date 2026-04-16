import * as z from 'zod';
export const WatchPriceAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    watchId: z.number(),
    costPrice: z.number(),
    serviceCost: z.number(),
    landedCost: z.number(),
    listPrice: z.number(),
    salePrice: z.number(),
    minPrice: z.number(),
    pricingNote: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    watch: z.number()
  }).optional(),
  _sum: z.object({
    costPrice: z.number().nullable(),
    serviceCost: z.number().nullable(),
    landedCost: z.number().nullable(),
    listPrice: z.number().nullable(),
    salePrice: z.number().nullable(),
    minPrice: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    costPrice: z.number().nullable(),
    serviceCost: z.number().nullable(),
    landedCost: z.number().nullable(),
    listPrice: z.number().nullable(),
    salePrice: z.number().nullable(),
    minPrice: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    watchId: z.string().nullable(),
    costPrice: z.number().nullable(),
    serviceCost: z.number().nullable(),
    landedCost: z.number().nullable(),
    listPrice: z.number().nullable(),
    salePrice: z.number().nullable(),
    minPrice: z.number().nullable(),
    pricingNote: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    watchId: z.string().nullable(),
    costPrice: z.number().nullable(),
    serviceCost: z.number().nullable(),
    landedCost: z.number().nullable(),
    listPrice: z.number().nullable(),
    salePrice: z.number().nullable(),
    minPrice: z.number().nullable(),
    pricingNote: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});