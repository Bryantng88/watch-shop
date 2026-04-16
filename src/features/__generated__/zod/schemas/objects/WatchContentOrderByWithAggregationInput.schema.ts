import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WatchContentCountOrderByAggregateInputObjectSchema as WatchContentCountOrderByAggregateInputObjectSchema } from './WatchContentCountOrderByAggregateInput.schema';
import { WatchContentMaxOrderByAggregateInputObjectSchema as WatchContentMaxOrderByAggregateInputObjectSchema } from './WatchContentMaxOrderByAggregateInput.schema';
import { WatchContentMinOrderByAggregateInputObjectSchema as WatchContentMinOrderByAggregateInputObjectSchema } from './WatchContentMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  titleOverride: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  summary: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  hookText: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  body: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  bulletSpecs: SortOrderSchema.optional(),
  seoTitle: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  seoDescription: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  aiMetaJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => WatchContentCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WatchContentMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WatchContentMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WatchContentOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WatchContentOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentOrderByWithAggregationInput>;
export const WatchContentOrderByWithAggregationInputObjectZodSchema = makeSchema();
