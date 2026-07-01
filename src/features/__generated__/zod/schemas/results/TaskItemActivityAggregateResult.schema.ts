import * as z from 'zod';
export const TaskItemActivityAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    taskItemId: z.number(),
    sourceType: z.number(),
    sourceId: z.number(),
    title: z.number(),
    body: z.number(),
    status: z.number(),
    actorUserId: z.number(),
    metadataJson: z.number(),
    occurredAt: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    taskItem: z.number(),
    actorUser: z.number(),
    replies: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    taskItemId: z.string().nullable(),
    sourceId: z.string().nullable(),
    title: z.string().nullable(),
    body: z.string().nullable(),
    actorUserId: z.string().nullable(),
    occurredAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    taskItemId: z.string().nullable(),
    sourceId: z.string().nullable(),
    title: z.string().nullable(),
    body: z.string().nullable(),
    actorUserId: z.string().nullable(),
    occurredAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});