import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOwnershipModeSchema } from '../enums/StrapOwnershipMode.schema';
import { ProductVariantCreateNestedOneWithoutStrapInstallationsInputObjectSchema as ProductVariantCreateNestedOneWithoutStrapInstallationsInputObjectSchema } from './ProductVariantCreateNestedOneWithoutStrapInstallationsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
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
  note: z.string().optional().nullable(),
  strapVariant: z.lazy(() => ProductVariantCreateNestedOneWithoutStrapInstallationsInputObjectSchema)
}).strict();
export const WatchStrapInstallationCreateWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationCreateWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationCreateWithoutWatchInput>;
export const WatchStrapInstallationCreateWithoutWatchInputObjectZodSchema = makeSchema();
