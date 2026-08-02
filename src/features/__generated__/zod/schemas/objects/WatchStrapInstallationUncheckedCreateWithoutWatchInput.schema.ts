import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOwnershipModeSchema } from '../enums/StrapOwnershipMode.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  strapVariantId: z.string(),
  ownershipMode: StrapOwnershipModeSchema,
  installedFullLinks: z.number().int().optional().nullable(),
  installedHalfLinks: z.number().int().optional().nullable(),
  spareFullLinks: z.number().int().optional().nullable(),
  spareHalfLinks: z.number().int().optional().nullable(),
  endLinkCount: z.number().int().optional().nullable(),
  wristSizeMM: z.number().int().optional().nullable(),
  installedAt: z.coerce.date().optional(),
  removedAt: z.coerce.date().optional().nullable(),
  installedByUserId: z.string().optional().nullable(),
  removedByUserId: z.string().optional().nullable(),
  sourceOrderId: z.string().optional().nullable(),
  serviceRequestId: z.string().optional().nullable(),
  note: z.string().optional().nullable()
}).strict();
export const WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationUncheckedCreateWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationUncheckedCreateWithoutWatchInput>;
export const WatchStrapInstallationUncheckedCreateWithoutWatchInputObjectZodSchema = makeSchema();
