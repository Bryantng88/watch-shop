import * as z from 'zod';
export const MediaAssetCreateResultSchema = z.object({
  id: z.string(),
  key: z.string(),
  parentPrefix: z.string(),
  fileName: z.string(),
  ext: z.string().optional(),
  sizeBytes: z.number().int().optional(),
  etag: z.string().optional(),
  lastModified: z.date().optional(),
  profile: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});