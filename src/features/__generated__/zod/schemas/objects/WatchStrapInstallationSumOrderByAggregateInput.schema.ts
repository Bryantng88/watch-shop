import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  installedFullLinks: SortOrderSchema.optional(),
  installedHalfLinks: SortOrderSchema.optional(),
  spareFullLinks: SortOrderSchema.optional(),
  spareHalfLinks: SortOrderSchema.optional(),
  endLinkCount: SortOrderSchema.optional(),
  wristSizeMM: SortOrderSchema.optional()
}).strict();
export const WatchStrapInstallationSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationSumOrderByAggregateInput>;
export const WatchStrapInstallationSumOrderByAggregateInputObjectZodSchema = makeSchema();
