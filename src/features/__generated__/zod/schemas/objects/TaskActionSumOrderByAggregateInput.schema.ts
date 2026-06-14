import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const TaskActionSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskActionSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionSumOrderByAggregateInput>;
export const TaskActionSumOrderByAggregateInputObjectZodSchema = makeSchema();
