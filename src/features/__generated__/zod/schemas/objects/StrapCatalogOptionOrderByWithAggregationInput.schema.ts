import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { StrapCatalogOptionCountOrderByAggregateInputObjectSchema as StrapCatalogOptionCountOrderByAggregateInputObjectSchema } from './StrapCatalogOptionCountOrderByAggregateInput.schema';
import { StrapCatalogOptionAvgOrderByAggregateInputObjectSchema as StrapCatalogOptionAvgOrderByAggregateInputObjectSchema } from './StrapCatalogOptionAvgOrderByAggregateInput.schema';
import { StrapCatalogOptionMaxOrderByAggregateInputObjectSchema as StrapCatalogOptionMaxOrderByAggregateInputObjectSchema } from './StrapCatalogOptionMaxOrderByAggregateInput.schema';
import { StrapCatalogOptionMinOrderByAggregateInputObjectSchema as StrapCatalogOptionMinOrderByAggregateInputObjectSchema } from './StrapCatalogOptionMinOrderByAggregateInput.schema';
import { StrapCatalogOptionSumOrderByAggregateInputObjectSchema as StrapCatalogOptionSumOrderByAggregateInputObjectSchema } from './StrapCatalogOptionSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  kind: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  colorHex: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => StrapCatalogOptionCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => StrapCatalogOptionAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => StrapCatalogOptionMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => StrapCatalogOptionMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => StrapCatalogOptionSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const StrapCatalogOptionOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.StrapCatalogOptionOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapCatalogOptionOrderByWithAggregationInput>;
export const StrapCatalogOptionOrderByWithAggregationInputObjectZodSchema = makeSchema();
