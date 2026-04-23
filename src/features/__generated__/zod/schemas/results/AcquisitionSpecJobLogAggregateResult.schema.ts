import * as z from 'zod';
export const AcquisitionSpecJobLogAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    acquisitionSpecJobId: z.number(),
    acquisitionItemId: z.number(),
    acquisitionId: z.number(),
    productId: z.number(),
    stage: z.number(),
    level: z.number(),
    message: z.number(),
    payload: z.number(),
    createdAt: z.number(),
    acquisitionSpecJob: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    acquisitionSpecJobId: z.string().nullable(),
    acquisitionItemId: z.string().nullable(),
    acquisitionId: z.string().nullable(),
    productId: z.string().nullable(),
    stage: z.string().nullable(),
    level: z.string().nullable(),
    message: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    acquisitionSpecJobId: z.string().nullable(),
    acquisitionItemId: z.string().nullable(),
    acquisitionId: z.string().nullable(),
    productId: z.string().nullable(),
    stage: z.string().nullable(),
    level: z.string().nullable(),
    message: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()});