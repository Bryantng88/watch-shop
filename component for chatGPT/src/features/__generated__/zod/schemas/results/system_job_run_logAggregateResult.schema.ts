import * as z from 'zod';
export const system_job_run_logAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    processor_key: z.number(),
    trigger_source: z.number(),
    status: z.number(),
    processed_count: z.number(),
    error_count: z.number(),
    note: z.number(),
    detail: z.number(),
    started_at: z.number(),
    finished_at: z.number()
  }).optional(),
  _sum: z.object({
    processed_count: z.number().nullable(),
    error_count: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    processed_count: z.number().nullable(),
    error_count: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    processor_key: z.string().nullable(),
    trigger_source: z.string().nullable(),
    status: z.string().nullable(),
    processed_count: z.number().int().nullable(),
    error_count: z.number().int().nullable(),
    note: z.string().nullable(),
    started_at: z.date().nullable(),
    finished_at: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    processor_key: z.string().nullable(),
    trigger_source: z.string().nullable(),
    status: z.string().nullable(),
    processed_count: z.number().int().nullable(),
    error_count: z.number().int().nullable(),
    note: z.string().nullable(),
    started_at: z.date().nullable(),
    finished_at: z.date().nullable()
  }).nullable().optional()});