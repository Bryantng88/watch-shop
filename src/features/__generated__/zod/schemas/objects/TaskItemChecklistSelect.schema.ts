import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemArgsObjectSchema as TaskItemArgsObjectSchema } from './TaskItemArgs.schema';
import { TaskArgsObjectSchema as TaskArgsObjectSchema } from './TaskArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  taskItemId: z.boolean().optional(),
  title: z.boolean().optional(),
  note: z.boolean().optional(),
  isDone: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  doneAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  taskItem: z.union([z.boolean(), z.lazy(() => TaskItemArgsObjectSchema)]).optional(),
  Task: z.union([z.boolean(), z.lazy(() => TaskArgsObjectSchema)]).optional(),
  taskId: z.boolean().optional()
}).strict();
export const TaskItemChecklistSelectObjectSchema: z.ZodType<Prisma.TaskItemChecklistSelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistSelect>;
export const TaskItemChecklistSelectObjectZodSchema = makeSchema();
