import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WatchPriceCountOrderByAggregateInputObjectSchema as WatchPriceCountOrderByAggregateInputObjectSchema } from './WatchPriceCountOrderByAggregateInput.schema';
import { WatchPriceAvgOrderByAggregateInputObjectSchema as WatchPriceAvgOrderByAggregateInputObjectSchema } from './WatchPriceAvgOrderByAggregateInput.schema';
import { WatchPriceMaxOrderByAggregateInputObjectSchema as WatchPriceMaxOrderByAggregateInputObjectSchema } from './WatchPriceMaxOrderByAggregateInput.schema';
import { WatchPriceMinOrderByAggregateInputObjectSchema as WatchPriceMinOrderByAggregateInputObjectSchema } from './WatchPriceMinOrderByAggregateInput.schema';
import { WatchPriceSumOrderByAggregateInputObjectSchema as WatchPriceSumOrderByAggregateInputObjectSchema } from './WatchPriceSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  costPrice: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  serviceCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  landedCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  listPrice: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  salePrice: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  minPrice: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  pricingNote: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => WatchPriceCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => WatchPriceAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WatchPriceMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WatchPriceMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => WatchPriceSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WatchPriceOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WatchPriceOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceOrderByWithAggregationInput>;
export const WatchPriceOrderByWithAggregationInputObjectZodSchema = makeSchema();
