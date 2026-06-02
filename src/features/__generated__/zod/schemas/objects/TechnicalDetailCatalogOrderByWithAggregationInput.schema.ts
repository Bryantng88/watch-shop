import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { TechnicalDetailCatalogCountOrderByAggregateInputObjectSchema as TechnicalDetailCatalogCountOrderByAggregateInputObjectSchema } from './TechnicalDetailCatalogCountOrderByAggregateInput.schema';
import { TechnicalDetailCatalogAvgOrderByAggregateInputObjectSchema as TechnicalDetailCatalogAvgOrderByAggregateInputObjectSchema } from './TechnicalDetailCatalogAvgOrderByAggregateInput.schema';
import { TechnicalDetailCatalogMaxOrderByAggregateInputObjectSchema as TechnicalDetailCatalogMaxOrderByAggregateInputObjectSchema } from './TechnicalDetailCatalogMaxOrderByAggregateInput.schema';
import { TechnicalDetailCatalogMinOrderByAggregateInputObjectSchema as TechnicalDetailCatalogMinOrderByAggregateInputObjectSchema } from './TechnicalDetailCatalogMinOrderByAggregateInput.schema';
import { TechnicalDetailCatalogSumOrderByAggregateInputObjectSchema as TechnicalDetailCatalogSumOrderByAggregateInputObjectSchema } from './TechnicalDetailCatalogSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  area: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => TechnicalDetailCatalogCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => TechnicalDetailCatalogAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => TechnicalDetailCatalogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => TechnicalDetailCatalogMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => TechnicalDetailCatalogSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const TechnicalDetailCatalogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogOrderByWithAggregationInput>;
export const TechnicalDetailCatalogOrderByWithAggregationInputObjectZodSchema = makeSchema();
