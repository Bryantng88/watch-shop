import * as z from 'zod';
export const ProductImageAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    productId: z.number(),
    fileKey: z.number(),
    role: z.number(),
    alt: z.number(),
    width: z.number(),
    height: z.number(),
    mime: z.number(),
    sizeBytes: z.number(),
    sortOrder: z.number(),
    dominantHex: z.number(),
    contentHash: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    product: z.number()
  }).optional(),
  _sum: z.object({
    width: z.number().nullable(),
    height: z.number().nullable(),
    sizeBytes: z.number().nullable(),
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    width: z.number().nullable(),
    height: z.number().nullable(),
    sizeBytes: z.number().nullable(),
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    productId: z.string().nullable(),
    fileKey: z.string().nullable(),
    alt: z.string().nullable(),
    width: z.number().int().nullable(),
    height: z.number().int().nullable(),
    mime: z.string().nullable(),
    sizeBytes: z.number().int().nullable(),
    sortOrder: z.number().int().nullable(),
    dominantHex: z.string().nullable(),
    contentHash: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    productId: z.string().nullable(),
    fileKey: z.string().nullable(),
    alt: z.string().nullable(),
    width: z.number().int().nullable(),
    height: z.number().int().nullable(),
    mime: z.string().nullable(),
    sizeBytes: z.number().int().nullable(),
    sortOrder: z.number().int().nullable(),
    dominantHex: z.string().nullable(),
    contentHash: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});