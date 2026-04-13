import * as z from 'zod';
export const system_job_controlGroupByResultSchema = z.array(z.object({
  key: z.string(),
  label: z.string(),
  enabled: z.boolean(),
  batch_size: z.number().int(),
  paused_reason: z.string(),
  metadata: z.unknown(),
  updated_at: z.date(),
  updated_by: z.string(),
  _count: z.object({
    key: z.number(),
    label: z.number(),
    enabled: z.number(),
    batch_size: z.number(),
    paused_reason: z.number(),
    metadata: z.number(),
    updated_at: z.number(),
    updated_by: z.number()
  }).optional(),
  _sum: z.object({
    batch_size: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    batch_size: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    key: z.string().nullable(),
    label: z.string().nullable(),
    batch_size: z.number().int().nullable(),
    paused_reason: z.string().nullable(),
    updated_at: z.date().nullable(),
    updated_by: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    key: z.string().nullable(),
    label: z.string().nullable(),
    batch_size: z.number().int().nullable(),
    paused_reason: z.string().nullable(),
    updated_at: z.date().nullable(),
    updated_by: z.string().nullable()
  }).nullable().optional()
}));