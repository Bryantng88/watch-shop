import * as z from 'zod';
export const WatchReviewLogAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    reviewStateId: z.number(),
    action: z.number(),
    fromStatus: z.number(),
    toStatus: z.number(),
    actorId: z.number(),
    note: z.number(),
    createdAt: z.number(),
    reviewState: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    reviewStateId: z.string().nullable(),
    actorId: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    reviewStateId: z.string().nullable(),
    actorId: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()});