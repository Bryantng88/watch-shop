import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const TaskActionAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskActionAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionAvgOrderByAggregateInput>;
export const TaskActionAvgOrderByAggregateInputObjectZodSchema = makeSchema();
