import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { technicalPartCatalogCountOrderByAggregateInputObjectSchema as technicalPartCatalogCountOrderByAggregateInputObjectSchema } from './technicalPartCatalogCountOrderByAggregateInput.schema';
import { technicalPartCatalogAvgOrderByAggregateInputObjectSchema as technicalPartCatalogAvgOrderByAggregateInputObjectSchema } from './technicalPartCatalogAvgOrderByAggregateInput.schema';
import { technicalPartCatalogMaxOrderByAggregateInputObjectSchema as technicalPartCatalogMaxOrderByAggregateInputObjectSchema } from './technicalPartCatalogMaxOrderByAggregateInput.schema';
import { technicalPartCatalogMinOrderByAggregateInputObjectSchema as technicalPartCatalogMinOrderByAggregateInputObjectSchema } from './technicalPartCatalogMinOrderByAggregateInput.schema';
import { technicalPartCatalogSumOrderByAggregateInputObjectSchema as technicalPartCatalogSumOrderByAggregateInputObjectSchema } from './technicalPartCatalogSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  appliesTo: SortOrderSchema.optional(),
  partGroup: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => technicalPartCatalogCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => technicalPartCatalogAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => technicalPartCatalogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => technicalPartCatalogMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => technicalPartCatalogSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const technicalPartCatalogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.technicalPartCatalogOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalPartCatalogOrderByWithAggregationInput>;
export const technicalPartCatalogOrderByWithAggregationInputObjectZodSchema = makeSchema();
