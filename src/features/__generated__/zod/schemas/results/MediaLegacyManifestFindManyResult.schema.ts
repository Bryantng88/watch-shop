import * as z from 'zod';
export const MediaLegacyManifestFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  legacyMediaAssetId: z.string(),
  legacyKey: z.string(),
  classification: z.unknown(),
  decision: z.unknown(),
  physicalExists: z.boolean(),
  productImageId: z.string().optional(),
  productId: z.string().optional(),
  acquisitionId: z.string().optional(),
  movedFromKey: z.string().optional(),
  mediaObjectId: z.string().optional(),
  note: z.string().optional(),
  scannedAt: z.date(),
  migratedAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});