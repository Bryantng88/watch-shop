import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { technicalActionCatalogCountOrderByAggregateInputObjectSchema as technicalActionCatalogCountOrderByAggregateInputObjectSchema } from './technicalActionCatalogCountOrderByAggregateInput.schema';
import { technicalActionCatalogAvgOrderByAggregateInputObjectSchema as technicalActionCatalogAvgOrderByAggregateInputObjectSchema } from './technicalActionCatalogAvgOrderByAggregateInput.schema';
import { technicalActionCatalogMaxOrderByAggregateInputObjectSchema as technicalActionCatalogMaxOrderByAggregateInputObjectSchema } from './technicalActionCatalogMaxOrderByAggregateInput.schema';
import { technicalActionCatalogMinOrderByAggregateInputObjectSchema as technicalActionCatalogMinOrderByAggregateInputObjectSchema } from './technicalActionCatalogMinOrderByAggregateInput.schema';
import { technicalActionCatalogSumOrderByAggregateInputObjectSchema as technicalActionCatalogSumOrderByAggregateInputObjectSchema } from './technicalActionCatalogSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  appliesTo: SortOrderSchema.optional(),
  groupKey: SortOrderSchema.optional(),
  requiresPart: SortOrderSchema.optional(),
  defaultExecutionMode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => technicalActionCatalogCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => technicalActionCatalogAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => technicalActionCatalogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => technicalActionCatalogMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => technicalActionCatalogSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const technicalActionCatalogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.technicalActionCatalogOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalActionCatalogOrderByWithAggregationInput>;
export const technicalActionCatalogOrderByWithAggregationInputObjectZodSchema = makeSchema();
