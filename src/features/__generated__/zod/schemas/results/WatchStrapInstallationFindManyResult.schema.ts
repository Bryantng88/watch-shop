import * as z from 'zod';
export const WatchStrapInstallationFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  watchId: z.string(),
  strapVariantId: z.string(),
  ownershipMode: z.unknown(),
  installedFullLinks: z.number().int().optional(),
  installedHalfLinks: z.number().int().optional(),
  spareFullLinks: z.number().int().optional(),
  spareHalfLinks: z.number().int().optional(),
  endLinkCount: z.number().int().optional(),
  wristSizeMM: z.number().int().optional(),
  installedAt: z.date(),
  removedAt: z.date().optional(),
  installedByUserId: z.string().optional(),
  removedByUserId: z.string().optional(),
  sourceOrderId: z.string().optional(),
  serviceRequestId: z.string().optional(),
  note: z.string().optional(),
  watch: z.unknown(),
  strapVariant: z.unknown()
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