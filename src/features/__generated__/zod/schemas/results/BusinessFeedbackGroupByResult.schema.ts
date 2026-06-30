import * as z from 'zod';
export const BusinessFeedbackGroupByResultSchema = z.array(z.object({
  id: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  eventKey: z.string(),
  actorUserId: z.string(),
  message: z.string(),
  visibility: z.string(),
  metadataJson: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    targetType: z.number(),
    targetId: z.number(),
    eventKey: z.number(),
    actorUserId: z.number(),
    message: z.number(),
    visibility: z.number(),
    metadataJson: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    targetType: z.string().nullable(),
    targetId: z.string().nullable(),
    eventKey: z.string().nullable(),
    actorUserId: z.string().nullable(),
    message: z.string().nullable(),
    visibility: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    targetType: z.string().nullable(),
    targetId: z.string().nullable(),
    eventKey: z.string().nullable(),
    actorUserId: z.string().nullable(),
    message: z.string().nullable(),
    visibility: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));