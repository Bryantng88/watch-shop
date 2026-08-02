import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapOwnershipModeSchema } from '../enums/StrapOwnershipMode.schema';
import { WatchCreateNestedOneWithoutStrapInstallationsInputObjectSchema as WatchCreateNestedOneWithoutStrapInstallationsInputObjectSchema } from './WatchCreateNestedOneWithoutStrapInstallationsInput.schema';
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
  watch: z.lazy(() => WatchCreateNestedOneWithoutStrapInstallationsInputObjectSchema),
  strapVariant: z.lazy(() => ProductVariantCreateNestedOneWithoutStrapInstallationsInputObjectSchema)
}).strict();
export const WatchStrapInstallationCreateInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationCreateInput>;
export const WatchStrapInstallationCreateInputObjectZodSchema = makeSchema();
