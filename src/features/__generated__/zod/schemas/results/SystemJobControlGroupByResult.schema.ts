import * as z from 'zod';
export const SystemJobControlGroupByResultSchema = z.array(z.object({
  key: z.string(),
  label: z.string(),
  enabled: z.boolean(),
  batchSize: z.number().int(),
  pausedReason: z.string(),
  metadata: z.unknown(),
  updatedAt: z.date(),
  updatedBy: z.string(),
  _count: z.object({
    key: z.number(),
    label: z.number(),
    enabled: z.number(),
    batchSize: z.number(),
    pausedReason: z.number(),
    metadata: z.number(),
    updatedAt: z.number(),
    updatedBy: z.number()
  }).optional(),
  _sum: z.object({
    batchSize: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    batchSize: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    key: z.string().nullable(),
    label: z.string().nullable(),
    batchSize: z.number().int().nullable(),
    pausedReason: z.string().nullable(),
    updatedAt: z.date().nullable(),
    updatedBy: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    key: z.string().nullable(),
    label: z.string().nullable(),
    batchSize: z.number().int().nullable(),
    pausedReason: z.string().nullable(),
    updatedAt: z.date().nullable(),
    updatedBy: z.string().nullable()
  }).nullable().optional()
}));