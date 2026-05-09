import * as z from 'zod';
export const MediaAssetUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  key: z.string(),
  parentPrefix: z.string(),
  fileName: z.string(),
  ext: z.string().optional(),
  sizeBytes: z.number().int().optional(),
  etag: z.string().optional(),
  lastModified: z.date().optional(),
  profile: z.string().optional(),
  status: z.unknown(),
  productId: z.string().optional(),
  acquisitionId: z.string().optional(),
  role: z.unknown().optional(),
  sortOrder: z.number().int(),
  isMissing: z.boolean(),
  missingAt: z.date().optional(),
  lastSeenAt: z.date().optional(),
  movedFromKey: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
}));