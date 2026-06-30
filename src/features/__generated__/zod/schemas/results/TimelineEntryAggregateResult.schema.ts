import * as z from 'zod';
export const TimelineEntryAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    containerType: z.number(),
    containerId: z.number(),
    sourceType: z.number(),
    sourceId: z.number(),
    occurredAt: z.number(),
    actorUserId: z.number(),
    title: z.number(),
    bodySnapshot: z.number(),
    visibility: z.number(),
    metadataJson: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    containerId: z.string().nullable(),
    sourceId: z.string().nullable(),
    occurredAt: z.date().nullable(),
    actorUserId: z.string().nullable(),
    title: z.string().nullable(),
    bodySnapshot: z.string().nullable(),
    visibility: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    containerId: z.string().nullable(),
    sourceId: z.string().nullable(),
    occurredAt: z.date().nullable(),
    actorUserId: z.string().nullable(),
    title: z.string().nullable(),
    bodySnapshot: z.string().nullable(),
    visibility: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});