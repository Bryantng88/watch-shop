import * as z from 'zod';
export const MediaOperationGroupByResultSchema = z.array(z.object({
  id: z.string(),
  idempotencyKey: z.string(),
  mediaObjectId: z.string(),
  sourceKey: z.string(),
  destinationKey: z.string(),
  attempts: z.number().int(),
  lastError: z.string(),
  requestedByUserId: z.string(),
  startedAt: z.date(),
  completedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    idempotencyKey: z.number(),
    mediaObjectId: z.number(),
    type: z.number(),
    status: z.number(),
    sourceKey: z.number(),
    destinationKey: z.number(),
    attempts: z.number(),
    lastError: z.number(),
    requestedByUserId: z.number(),
    startedAt: z.number(),
    completedAt: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    mediaObject: z.number()
  }).optional(),
  _sum: z.object({
    attempts: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    attempts: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    idempotencyKey: z.string().nullable(),
    mediaObjectId: z.string().nullable(),
    sourceKey: z.string().nullable(),
    destinationKey: z.string().nullable(),
    attempts: z.number().int().nullable(),
    lastError: z.string().nullable(),
    requestedByUserId: z.string().nullable(),
    startedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    idempotencyKey: z.string().nullable(),
    mediaObjectId: z.string().nullable(),
    sourceKey: z.string().nullable(),
    destinationKey: z.string().nullable(),
    attempts: z.number().int().nullable(),
    lastError: z.string().nullable(),
    requestedByUserId: z.string().nullable(),
    startedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));