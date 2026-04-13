import * as z from 'zod';
export const acquisition_spec_jobAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    acquisition_item_id: z.number(),
    product_id: z.number(),
    status: z.number(),
    attempts: z.number(),
    last_error: z.number(),
    priority: z.number(),
    run_after: z.number(),
    started_at: z.number(),
    finished_at: z.number(),
    created_at: z.number(),
    updated_at: z.number()
  }).optional(),
  _sum: z.object({
    attempts: z.number().nullable(),
    priority: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    attempts: z.number().nullable(),
    priority: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    acquisition_item_id: z.string().nullable(),
    product_id: z.string().nullable(),
    status: z.string().nullable(),
    attempts: z.number().int().nullable(),
    last_error: z.string().nullable(),
    priority: z.number().int().nullable(),
    run_after: z.date().nullable(),
    started_at: z.date().nullable(),
    finished_at: z.date().nullable(),
    created_at: z.date().nullable(),
    updated_at: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    acquisition_item_id: z.string().nullable(),
    product_id: z.string().nullable(),
    status: z.string().nullable(),
    attempts: z.number().int().nullable(),
    last_error: z.string().nullable(),
    priority: z.number().int().nullable(),
    run_after: z.date().nullable(),
    started_at: z.date().nullable(),
    finished_at: z.date().nullable(),
    created_at: z.date().nullable(),
    updated_at: z.date().nullable()
  }).nullable().optional()});