import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { WorkCaseCategoryCountOrderByAggregateInputObjectSchema as WorkCaseCategoryCountOrderByAggregateInputObjectSchema } from './WorkCaseCategoryCountOrderByAggregateInput.schema';
import { WorkCaseCategoryAvgOrderByAggregateInputObjectSchema as WorkCaseCategoryAvgOrderByAggregateInputObjectSchema } from './WorkCaseCategoryAvgOrderByAggregateInput.schema';
import { WorkCaseCategoryMaxOrderByAggregateInputObjectSchema as WorkCaseCategoryMaxOrderByAggregateInputObjectSchema } from './WorkCaseCategoryMaxOrderByAggregateInput.schema';
import { WorkCaseCategoryMinOrderByAggregateInputObjectSchema as WorkCaseCategoryMinOrderByAggregateInputObjectSchema } from './WorkCaseCategoryMinOrderByAggregateInput.schema';
import { WorkCaseCategorySumOrderByAggregateInputObjectSchema as WorkCaseCategorySumOrderByAggregateInputObjectSchema } from './WorkCaseCategorySumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  scope: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => WorkCaseCategoryCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => WorkCaseCategoryAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => WorkCaseCategoryMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => WorkCaseCategoryMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => WorkCaseCategorySumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const WorkCaseCategoryOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryOrderByWithAggregationInput>;
export const WorkCaseCategoryOrderByWithAggregationInputObjectZodSchema = makeSchema();
