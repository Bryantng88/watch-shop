import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const TaskItemAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemAvgOrderByAggregateInput>;
export const TaskItemAvgOrderByAggregateInputObjectZodSchema = makeSchema();
