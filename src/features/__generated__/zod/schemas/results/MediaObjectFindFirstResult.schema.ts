import * as z from 'zod';
export const MediaObjectFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  bucket: z.string(),
  storageKey: z.string(),
  originalFileName: z.string().optional(),
  mimeType: z.string().optional(),
  sizeBytes: z.bigint().optional(),
  checksum: z.string().optional(),
  etag: z.string().optional(),
  availability: z.unknown(),
  verifiedAt: z.date().optional(),
  missingAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  bindings: z.array(z.unknown()),
  operations: z.array(z.unknown())
}));