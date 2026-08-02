import * as z from 'zod';
export const WatchStrapInstallationUpsertResultSchema = z.object({
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
});