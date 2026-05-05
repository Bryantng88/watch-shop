import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WatchCountOrderByAggregateInputObjectSchema as WatchCountOrderByAggregateInputObjectSchema } from './WatchCountOrderByAggregateInput.schema';
import { WatchMaxOrderByAggregateInputObjectSchema as WatchMaxOrderByAggregateInputObjectSchema } from './WatchMaxOrderByAggregateInput.schema';
import { WatchMinOrderByAggregateInputObjectSchema as WatchMinOrderByAggregateInputObjectSchema } from './WatchMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  legacyVariantId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  acquisitionId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  stockState: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  saleState: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceState: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  siteChannel: SortOrderSchema.optional(),
  gender: SortOrderSchema.optional(),
  conditionGrade: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  movementType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  movementCalibre: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serialNumber: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  yearText: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  style: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  hasBox: SortOrderSchema.optional(),
  hasPapers: SortOrderSchema.optional(),
  specStatus: SortOrderSchema.optional(),
  notes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => WatchCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WatchMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WatchMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WatchOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WatchOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchOrderByWithAggregationInput>;
export const WatchOrderByWithAggregationInputObjectZodSchema = makeSchema();
