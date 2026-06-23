import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const TaskItemSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemSumOrderByAggregateInput>;
export const TaskItemSumOrderByAggregateInputObjectZodSchema = makeSchema();
