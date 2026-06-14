import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const TaskActionAvgAggregateInputObjectSchema: z.ZodType<Prisma.TaskActionAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionAvgAggregateInputType>;
export const TaskActionAvgAggregateInputObjectZodSchema = makeSchema();
