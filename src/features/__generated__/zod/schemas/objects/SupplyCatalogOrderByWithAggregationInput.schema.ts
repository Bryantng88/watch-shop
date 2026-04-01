import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { SupplyCatalogCountOrderByAggregateInputObjectSchema as SupplyCatalogCountOrderByAggregateInputObjectSchema } from './SupplyCatalogCountOrderByAggregateInput.schema';
import { SupplyCatalogAvgOrderByAggregateInputObjectSchema as SupplyCatalogAvgOrderByAggregateInputObjectSchema } from './SupplyCatalogAvgOrderByAggregateInput.schema';
import { SupplyCatalogMaxOrderByAggregateInputObjectSchema as SupplyCatalogMaxOrderByAggregateInputObjectSchema } from './SupplyCatalogMaxOrderByAggregateInput.schema';
import { SupplyCatalogMinOrderByAggregateInputObjectSchema as SupplyCatalogMinOrderByAggregateInputObjectSchema } from './SupplyCatalogMinOrderByAggregateInput.schema';
import { SupplyCatalogSumOrderByAggregateInputObjectSchema as SupplyCatalogSumOrderByAggregateInputObjectSchema } from './SupplyCatalogSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  category: SortOrderSchema.optional(),
  unit: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  defaultCost: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => SupplyCatalogCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => SupplyCatalogAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => SupplyCatalogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => SupplyCatalogMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => SupplyCatalogSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const SupplyCatalogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.SupplyCatalogOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogOrderByWithAggregationInput>;
export const SupplyCatalogOrderByWithAggregationInputObjectZodSchema = makeSchema();
