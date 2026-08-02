import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  watchId: z.boolean().optional(),
  strapVariantId: z.boolean().optional(),
  ownershipMode: z.boolean().optional(),
  installedFullLinks: z.boolean().optional(),
  installedHalfLinks: z.boolean().optional(),
  spareFullLinks: z.boolean().optional(),
  spareHalfLinks: z.boolean().optional(),
  endLinkCount: z.boolean().optional(),
  wristSizeMM: z.boolean().optional(),
  installedAt: z.boolean().optional(),
  removedAt: z.boolean().optional(),
  installedByUserId: z.boolean().optional(),
  removedByUserId: z.boolean().optional(),
  sourceOrderId: z.boolean().optional(),
  serviceRequestId: z.boolean().optional(),
  note: z.boolean().optional(),
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional(),
  strapVariant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const WatchStrapInstallationSelectObjectSchema: z.ZodType<Prisma.WatchStrapInstallationSelect> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationSelect>;
export const WatchStrapInstallationSelectObjectZodSchema = makeSchema();
