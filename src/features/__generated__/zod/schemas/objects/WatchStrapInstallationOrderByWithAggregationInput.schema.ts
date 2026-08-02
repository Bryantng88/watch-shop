import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WatchStrapInstallationCountOrderByAggregateInputObjectSchema as WatchStrapInstallationCountOrderByAggregateInputObjectSchema } from './WatchStrapInstallationCountOrderByAggregateInput.schema';
import { WatchStrapInstallationAvgOrderByAggregateInputObjectSchema as WatchStrapInstallationAvgOrderByAggregateInputObjectSchema } from './WatchStrapInstallationAvgOrderByAggregateInput.schema';
import { WatchStrapInstallationMaxOrderByAggregateInputObjectSchema as WatchStrapInstallationMaxOrderByAggregateInputObjectSchema } from './WatchStrapInstallationMaxOrderByAggregateInput.schema';
import { WatchStrapInstallationMinOrderByAggregateInputObjectSchema as WatchStrapInstallationMinOrderByAggregateInputObjectSchema } from './WatchStrapInstallationMinOrderByAggregateInput.schema';
import { WatchStrapInstallationSumOrderByAggregateInputObjectSchema as WatchStrapInstallationSumOrderByAggregateInputObjectSchema } from './WatchStrapInstallationSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  strapVariantId: SortOrderSchema.optional(),
  ownershipMode: SortOrderSchema.optional(),
  installedFullLinks: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  installedHalfLinks: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  spareFullLinks: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  spareHalfLinks: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  endLinkCount: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  wristSizeMM: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  installedAt: SortOrderSchema.optional(),
  removedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  installedByUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  removedByUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sourceOrderId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceRequestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => WatchStrapInstallationCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => WatchStrapInstallationAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WatchStrapInstallationMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WatchStrapInstallationMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => WatchStrapInstallationSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WatchStrapInstallationOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationOrderByWithAggregationInput>;
export const WatchStrapInstallationOrderByWithAggregationInputObjectZodSchema = makeSchema();
