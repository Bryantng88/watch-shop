import * as z from 'zod';
export const MediaAssetAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    key: z.number(),
    parentPrefix: z.number(),
    fileName: z.number(),
    ext: z.number(),
    sizeBytes: z.number(),
    etag: z.number(),
    lastModified: z.number(),
    profile: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _sum: z.object({
    sizeBytes: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    sizeBytes: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    key: z.string().nullable(),
    parentPrefix: z.string().nullable(),
    fileName: z.string().nullable(),
    ext: z.string().nullable(),
    sizeBytes: z.number().int().nullable(),
    etag: z.string().nullable(),
    lastModified: z.date().nullable(),
    profile: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    key: z.string().nullable(),
    parentPrefix: z.string().nullable(),
    fileName: z.string().nullable(),
    ext: z.string().nullable(),
    sizeBytes: z.number().int().nullable(),
    etag: z.string().nullable(),
    lastModified: z.date().nullable(),
    profile: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});