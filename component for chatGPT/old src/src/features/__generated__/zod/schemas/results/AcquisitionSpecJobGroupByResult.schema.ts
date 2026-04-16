import * as z from 'zod';
export const AcquisitionSpecJobGroupByResultSchema = z.array(z.object({
  id: z.string(),
  acquisitionItemId: z.string(),
  productId: z.string(),
  status: z.string(),
  attempts: z.number().int(),
  lastError: z.string(),
  startedAt: z.date(),
  finishedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  runAfter: z.date(),
  priority: z.number().int(),
  _count: z.object({
    id: z.number(),
    acquisitionItemId: z.number(),
    productId: z.number(),
    status: z.number(),
    attempts: z.number(),
    lastError: z.number(),
    startedAt: z.number(),
    finishedAt: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    runAfter: z.number(),
    priority: z.number(),
    AcquisitionItem: z.number(),
    Product: z.number()
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
    acquisitionItemId: z.string().nullable(),
    productId: z.string().nullable(),
    status: z.string().nullable(),
    attempts: z.number().int().nullable(),
    lastError: z.string().nullable(),
    startedAt: z.date().nullable(),
    finishedAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    runAfter: z.date().nullable(),
    priority: z.number().int().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    acquisitionItemId: z.string().nullable(),
    productId: z.string().nullable(),
    status: z.string().nullable(),
    attempts: z.number().int().nullable(),
    lastError: z.string().nullable(),
    startedAt: z.date().nullable(),
    finishedAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    runAfter: z.date().nullable(),
    priority: z.number().int().nullable()
  }).nullable().optional()
}));