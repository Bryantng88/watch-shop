import * as z from 'zod';
export const TaskItemActivityGroupByResultSchema = z.array(z.object({
  id: z.string(),
  taskItemId: z.string(),
  sourceId: z.string(),
  title: z.string(),
  body: z.string(),
  actorUserId: z.string(),
  metadataJson: z.unknown(),
  occurredAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
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
  }).nullable().optional()
}));