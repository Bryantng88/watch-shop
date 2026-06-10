import * as z from 'zod';
export const WorkCaseActivityAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    workCaseId: z.number(),
    actorId: z.number(),
    action: z.number(),
    note: z.number(),
    metadata: z.number(),
    createdAt: z.number(),
    workCase: z.number(),
    actor: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    workCaseId: z.string().nullable(),
    actorId: z.string().nullable(),
    action: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    workCaseId: z.string().nullable(),
    actorId: z.string().nullable(),
    action: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()});