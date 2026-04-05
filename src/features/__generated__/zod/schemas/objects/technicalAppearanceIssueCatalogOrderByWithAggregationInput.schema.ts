import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { technicalAppearanceIssueCatalogCountOrderByAggregateInputObjectSchema as technicalAppearanceIssueCatalogCountOrderByAggregateInputObjectSchema } from './technicalAppearanceIssueCatalogCountOrderByAggregateInput.schema';
import { technicalAppearanceIssueCatalogAvgOrderByAggregateInputObjectSchema as technicalAppearanceIssueCatalogAvgOrderByAggregateInputObjectSchema } from './technicalAppearanceIssueCatalogAvgOrderByAggregateInput.schema';
import { technicalAppearanceIssueCatalogMaxOrderByAggregateInputObjectSchema as technicalAppearanceIssueCatalogMaxOrderByAggregateInputObjectSchema } from './technicalAppearanceIssueCatalogMaxOrderByAggregateInput.schema';
import { technicalAppearanceIssueCatalogMinOrderByAggregateInputObjectSchema as technicalAppearanceIssueCatalogMinOrderByAggregateInputObjectSchema } from './technicalAppearanceIssueCatalogMinOrderByAggregateInput.schema';
import { technicalAppearanceIssueCatalogSumOrderByAggregateInputObjectSchema as technicalAppearanceIssueCatalogSumOrderByAggregateInputObjectSchema } from './technicalAppearanceIssueCatalogSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  area: SortOrderSchema.optional(),
  label: SortOrderSchema.optional(),
  deductionScore: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => technicalAppearanceIssueCatalogCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => technicalAppearanceIssueCatalogAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => technicalAppearanceIssueCatalogMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => technicalAppearanceIssueCatalogMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => technicalAppearanceIssueCatalogSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const technicalAppearanceIssueCatalogOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogOrderByWithAggregationInput>;
export const technicalAppearanceIssueCatalogOrderByWithAggregationInputObjectZodSchema = makeSchema();
