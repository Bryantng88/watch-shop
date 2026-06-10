import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const TaskTypeAvgAggregateInputObjectSchema: z.ZodType<Prisma.TaskTypeAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeAvgAggregateInputType>;
export const TaskTypeAvgAggregateInputObjectZodSchema = makeSchema();
