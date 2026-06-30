import * as z from 'zod';
export const UserCommentAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    targetType: z.number(),
    targetId: z.number(),
    actorUserId: z.number(),
    body: z.number(),
    visibility: z.number(),
    metadataJson: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    targetType: z.string().nullable(),
    targetId: z.string().nullable(),
    actorUserId: z.string().nullable(),
    body: z.string().nullable(),
    visibility: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    targetType: z.string().nullable(),
    targetId: z.string().nullable(),
    actorUserId: z.string().nullable(),
    body: z.string().nullable(),
    visibility: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});