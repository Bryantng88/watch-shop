import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const TaskChecklistItemSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemSumOrderByAggregateInput>;
export const TaskChecklistItemSumOrderByAggregateInputObjectZodSchema = makeSchema();
