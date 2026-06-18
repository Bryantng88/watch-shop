import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const TaskChecklistItemAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemAvgOrderByAggregateInput>;
export const TaskChecklistItemAvgOrderByAggregateInputObjectZodSchema = makeSchema();
