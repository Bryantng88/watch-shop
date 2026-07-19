import * as z from 'zod';
export const ProjectionRecordAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    projectionKey: z.number(),
    projectionVersion: z.number(),
    rowKey: z.number(),
    workspaceId: z.number(),
    spaceId: z.number(),
    entityType: z.number(),
    entityId: z.number(),
    status: z.number(),
    searchText: z.number(),
    sortAt: z.number(),
    dataJson: z.number(),
    sourceUpdatedAt: z.number(),
    projectedAt: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _sum: z.object({
    projectionVersion: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    projectionVersion: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    projectionKey: z.string().nullable(),
    projectionVersion: z.number().int().nullable(),
    rowKey: z.string().nullable(),
    workspaceId: z.string().nullable(),
    spaceId: z.string().nullable(),
    entityType: z.string().nullable(),
    entityId: z.string().nullable(),
    status: z.string().nullable(),
    searchText: z.string().nullable(),
    sortAt: z.date().nullable(),
    sourceUpdatedAt: z.date().nullable(),
    projectedAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    projectionKey: z.string().nullable(),
    projectionVersion: z.number().int().nullable(),
    rowKey: z.string().nullable(),
    workspaceId: z.string().nullable(),
    spaceId: z.string().nullable(),
    entityType: z.string().nullable(),
    entityId: z.string().nullable(),
    status: z.string().nullable(),
    searchText: z.string().nullable(),
    sortAt: z.date().nullable(),
    sourceUpdatedAt: z.date().nullable(),
    projectedAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});