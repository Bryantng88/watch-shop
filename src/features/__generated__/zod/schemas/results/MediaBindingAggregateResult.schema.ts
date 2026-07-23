import * as z from 'zod';
export const MediaBindingAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    mediaObjectId: z.number(),
    ownerType: z.number(),
    ownerId: z.number(),
    role: z.number(),
    sortOrder: z.number(),
    audienceSegment: z.number(),
    lifecycle: z.number(),
    pipelineKey: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    mediaObject: z.number()
  }).optional(),
  _sum: z.object({
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    mediaObjectId: z.string().nullable(),
    ownerId: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    mediaObjectId: z.string().nullable(),
    ownerId: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});