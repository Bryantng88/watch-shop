import * as z from 'zod';
export const WatchMediaFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  watchId: z.string(),
  legacyProductImageId: z.string().optional(),
  key: z.string().optional(),
  url: z.string().optional(),
  type: z.string().optional(),
  role: z.unknown().optional(),
  sortOrder: z.number().int(),
  alt: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  mime: z.string().optional(),
  sizeBytes: z.number().int().optional(),
  dominantHex: z.string().optional(),
  contentHash: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  watch: z.unknown()
}));