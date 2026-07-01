import * as z from 'zod';
export const TaskItemActivityReplyAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    activityId: z.number(),
    actorUserId: z.number(),
    body: z.number(),
    metadataJson: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    activity: z.number(),
    actorUser: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    activityId: z.string().nullable(),
    actorUserId: z.string().nullable(),
    body: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    activityId: z.string().nullable(),
    actorUserId: z.string().nullable(),
    body: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});