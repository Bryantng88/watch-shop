import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  taskId: z.literal(true).optional(),
  title: z.literal(true).optional(),
  note: z.literal(true).optional(),
  isDone: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const TaskChecklistItemMaxAggregateInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemMaxAggregateInputType>;
export const TaskChecklistItemMaxAggregateInputObjectZodSchema = makeSchema();
