import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const TaskTypeAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskTypeAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeAvgOrderByAggregateInput>;
export const TaskTypeAvgOrderByAggregateInputObjectZodSchema = makeSchema();
