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
  caseType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  category: SortOrderSchema.optional(),
  gender: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  length: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  width: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  thickness: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  movement: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  caliber: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  caseMaterial: SortOrderSchema.optional(),
  goldKarat: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  goldColor: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  caseSize: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  dialColor: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  marketSegmentId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  strap: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  glass: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
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
