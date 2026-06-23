import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const TaskItemSumAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemSumAggregateInputType>;
export const TaskItemSumAggregateInputObjectZodSchema = makeSchema();
