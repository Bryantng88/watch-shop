import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  watchId: z.literal(true).optional(),
  strapVariantId: z.literal(true).optional(),
  ownershipMode: z.literal(true).optional(),
  installedFullLinks: z.literal(true).optional(),
  installedHalfLinks: z.literal(true).optional(),
  spareFullLinks: z.literal(true).optional(),
  spareHalfLinks: z.literal(true).optional(),
  endLinkCount: z.literal(true).optional(),
  wristSizeMM: z.literal(true).optional(),
  installedAt: z.literal(true).optional(),
  removedAt: z.literal(true).optional(),
  installedByUserId: z.literal(true).optional(),
  removedByUserId: z.literal(true).optional(),
  sourceOrderId: z.literal(true).optional(),
  serviceRequestId: z.literal(true).optional(),
  note: z.literal(true).optional()
}).strict();
export const WatchStrapInstallationMinAggregateInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationMinAggregateInputType>;
export const WatchStrapInstallationMinAggregateInputObjectZodSchema = makeSchema();
