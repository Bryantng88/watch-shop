import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  taskId: z.literal(true).optional(),
  targetType: z.literal(true).optional(),
  targetId: z.literal(true).optional(),
  actionType: z.literal(true).optional(),
  note: z.literal(true).optional(),
  createdByUserId: z.literal(true).optional(),
  createdAt: z.literal(true).optional()
}).strict();
export const TaskExecutionMaxAggregateInputObjectSchema: z.ZodType<Prisma.TaskExecutionMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionMaxAggregateInputType>;
export const TaskExecutionMaxAggregateInputObjectZodSchema = makeSchema();
