import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  taskItemId: z.literal(true).optional(),
  title: z.literal(true).optional(),
  note: z.literal(true).optional(),
  isDone: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  doneAt: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  taskId: z.literal(true).optional()
}).strict();
export const TaskItemChecklistMinAggregateInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistMinAggregateInputType>;
export const TaskItemChecklistMinAggregateInputObjectZodSchema = makeSchema();
