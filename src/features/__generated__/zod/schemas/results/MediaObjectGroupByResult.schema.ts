import * as z from 'zod';
export const MediaObjectGroupByResultSchema = z.array(z.object({
  id: z.string(),
  bucket: z.string(),
  storageKey: z.string(),
  originalFileName: z.string(),
  mimeType: z.string(),
  sizeBytes: z.bigint(),
  checksum: z.string(),
  etag: z.string(),
  verifiedAt: z.date(),
  missingAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    bucket: z.number(),
    storageKey: z.number(),
    originalFileName: z.number(),
    mimeType: z.number(),
    sizeBytes: z.number(),
    checksum: z.number(),
    etag: z.number(),
    availability: z.number(),
    verifiedAt: z.number(),
    missingAt: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    bindings: z.number(),
    operations: z.number()
  }).optional(),
  _sum: z.object({
    sizeBytes: z.bigint().nullable()
  }).nullable().optional(),
  _avg: z.object({
    sizeBytes: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    bucket: z.string().nullable(),
    storageKey: z.string().nullable(),
    originalFileName: z.string().nullable(),
    mimeType: z.string().nullable(),
    sizeBytes: z.bigint().nullable(),
    checksum: z.string().nullable(),
    etag: z.string().nullable(),
    verifiedAt: z.date().nullable(),
    missingAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    bucket: z.string().nullable(),
    storageKey: z.string().nullable(),
    originalFileName: z.string().nullable(),
    mimeType: z.string().nullable(),
    sizeBytes: z.bigint().nullable(),
    checksum: z.string().nullable(),
    etag: z.string().nullable(),
    verifiedAt: z.date().nullable(),
    missingAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));