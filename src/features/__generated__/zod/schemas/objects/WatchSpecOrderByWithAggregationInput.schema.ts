import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WatchSpecCountOrderByAggregateInputObjectSchema as WatchSpecCountOrderByAggregateInputObjectSchema } from './WatchSpecCountOrderByAggregateInput.schema';
import { WatchSpecAvgOrderByAggregateInputObjectSchema as WatchSpecAvgOrderByAggregateInputObjectSchema } from './WatchSpecAvgOrderByAggregateInput.schema';
import { WatchSpecMaxOrderByAggregateInputObjectSchema as WatchSpecMaxOrderByAggregateInputObjectSchema } from './WatchSpecMaxOrderByAggregateInput.schema';
import { WatchSpecMinOrderByAggregateInputObjectSchema as WatchSpecMinOrderByAggregateInputObjectSchema } from './WatchSpecMinOrderByAggregateInput.schema';
import { WatchSpecSumOrderByAggregateInputObjectSchema as WatchSpecSumOrderByAggregateInputObjectSchema } from './WatchSpecSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  productId: SortOrderSchema.optional(),
  model: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  year: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  caseType: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  gender: SortOrderSchema.optional(),
  length: SortOrderSchema.optional(),
  width: SortOrderSchema.optional(),
  thickness: SortOrderSchema.optional(),
  movement: SortOrderSchema.optional(),
  caliber: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  caseMaterial: SortOrderSchema.optional(),
  goldKarat: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  goldColor: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  caseSize: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  dialColor: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  marketSegmentId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  strap: SortOrderSchema.optional(),
  glass: SortOrderSchema.optional(),
  boxIncluded: SortOrderSchema.optional(),
  bookletIncluded: SortOrderSchema.optional(),
  cardIncluded: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  sizeCategory: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  _count: z.lazy(() => WatchSpecCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => WatchSpecAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WatchSpecMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WatchSpecMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => WatchSpecSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WatchSpecOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WatchSpecOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecOrderByWithAggregationInput>;
export const WatchSpecOrderByWithAggregationInputObjectZodSchema = makeSchema();
