import * as z from 'zod';
export const MarketSegmentAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    name: z.number(),
    watchSpecs: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable()
  }).nullable().optional()});