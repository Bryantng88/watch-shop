import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const TaskItemChecklistSumAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistSumAggregateInputType>;
export const TaskItemChecklistSumAggregateInputObjectZodSchema = makeSchema();
