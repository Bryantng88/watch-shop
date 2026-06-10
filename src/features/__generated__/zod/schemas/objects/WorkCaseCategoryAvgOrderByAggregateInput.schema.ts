import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const WorkCaseCategoryAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryAvgOrderByAggregateInput>;
export const WorkCaseCategoryAvgOrderByAggregateInputObjectZodSchema = makeSchema();
