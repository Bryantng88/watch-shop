import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const TaskItemAvgAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemAvgAggregateInputType>;
export const TaskItemAvgAggregateInputObjectZodSchema = makeSchema();
