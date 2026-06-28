import * as z from 'zod';
export const WorkflowEventLogAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    eventKey: z.number(),
    targetType: z.number(),
    targetId: z.number(),
    actorUserId: z.number(),
    metadataJson: z.number(),
    createdAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    eventKey: z.string().nullable(),
    targetType: z.string().nullable(),
    targetId: z.string().nullable(),
    actorUserId: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    eventKey: z.string().nullable(),
    targetType: z.string().nullable(),
    targetId: z.string().nullable(),
    actorUserId: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()});