import * as z from 'zod';
export const SystemJobRunLogGroupByResultSchema = z.array(z.object({
  id: z.string(),
  processorKey: z.string(),
  triggerSource: z.string(),
  status: z.string(),
  processedCount: z.number().int(),
  errorCount: z.number().int(),
  note: z.string(),
  detail: z.unknown(),
  startedAt: z.date(),
  finishedAt: z.date(),
  _count: z.object({
    id: z.number(),
    processorKey: z.number(),
    triggerSource: z.number(),
    status: z.number(),
    processedCount: z.number(),
    errorCount: z.number(),
    note: z.number(),
    detail: z.number(),
    startedAt: z.number(),
    finishedAt: z.number()
  }).optional(),
  _sum: z.object({
    processedCount: z.number().nullable(),
    errorCount: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    processedCount: z.number().nullable(),
    errorCount: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    processorKey: z.string().nullable(),
    triggerSource: z.string().nullable(),
    status: z.string().nullable(),
    processedCount: z.number().int().nullable(),
    errorCount: z.number().int().nullable(),
    note: z.string().nullable(),
    startedAt: z.date().nullable(),
    finishedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    processorKey: z.string().nullable(),
    triggerSource: z.string().nullable(),
    status: z.string().nullable(),
    processedCount: z.number().int().nullable(),
    errorCount: z.number().int().nullable(),
    note: z.string().nullable(),
    startedAt: z.date().nullable(),
    finishedAt: z.date().nullable()
  }).nullable().optional()
}));