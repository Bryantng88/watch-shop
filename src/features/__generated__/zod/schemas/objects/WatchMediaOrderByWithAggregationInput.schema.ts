import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WatchMediaCountOrderByAggregateInputObjectSchema as WatchMediaCountOrderByAggregateInputObjectSchema } from './WatchMediaCountOrderByAggregateInput.schema';
import { WatchMediaAvgOrderByAggregateInputObjectSchema as WatchMediaAvgOrderByAggregateInputObjectSchema } from './WatchMediaAvgOrderByAggregateInput.schema';
import { WatchMediaMaxOrderByAggregateInputObjectSchema as WatchMediaMaxOrderByAggregateInputObjectSchema } from './WatchMediaMaxOrderByAggregateInput.schema';
import { WatchMediaMinOrderByAggregateInputObjectSchema as WatchMediaMinOrderByAggregateInputObjectSchema } from './WatchMediaMinOrderByAggregateInput.schema';
import { WatchMediaSumOrderByAggregateInputObjectSchema as WatchMediaSumOrderByAggregateInputObjectSchema } from './WatchMediaSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  legacyProductImageId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  key: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  url: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  role: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortOrder: SortOrderSchema.optional(),
  alt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  width: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  height: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  mime: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sizeBytes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  dominantHex: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  contentHash: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => WatchMediaCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => WatchMediaAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WatchMediaMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WatchMediaMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => WatchMediaSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WatchMediaOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WatchMediaOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaOrderByWithAggregationInput>;
export const WatchMediaOrderByWithAggregationInputObjectZodSchema = makeSchema();
