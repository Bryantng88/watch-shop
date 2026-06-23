import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const TaskItemChecklistAvgAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistAvgAggregateInputType>;
export const TaskItemChecklistAvgAggregateInputObjectZodSchema = makeSchema();
