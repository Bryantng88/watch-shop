import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const WorkCaseCategorySumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkCaseCategorySumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategorySumOrderByAggregateInput>;
export const WorkCaseCategorySumOrderByAggregateInputObjectZodSchema = makeSchema();
