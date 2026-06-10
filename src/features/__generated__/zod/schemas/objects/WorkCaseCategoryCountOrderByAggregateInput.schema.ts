import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  scope: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WorkCaseCategoryCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryCountOrderByAggregateInput>;
export const WorkCaseCategoryCountOrderByAggregateInputObjectZodSchema = makeSchema();
