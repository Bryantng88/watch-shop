import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  strapVariantId: SortOrderSchema.optional(),
  ownershipMode: SortOrderSchema.optional(),
  installedFullLinks: SortOrderSchema.optional(),
  installedHalfLinks: SortOrderSchema.optional(),
  spareFullLinks: SortOrderSchema.optional(),
  spareHalfLinks: SortOrderSchema.optional(),
  endLinkCount: SortOrderSchema.optional(),
  wristSizeMM: SortOrderSchema.optional(),
  installedAt: SortOrderSchema.optional(),
  removedAt: SortOrderSchema.optional(),
  installedByUserId: SortOrderSchema.optional(),
  removedByUserId: SortOrderSchema.optional(),
  sourceOrderId: SortOrderSchema.optional(),
  serviceRequestId: SortOrderSchema.optional(),
  note: SortOrderSchema.optional()
}).strict();
export const WatchStrapInstallationMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationMaxOrderByAggregateInput>;
export const WatchStrapInstallationMaxOrderByAggregateInputObjectZodSchema = makeSchema();
