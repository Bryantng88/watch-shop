import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  taskItemId: z.string(),
  title: z.string(),
  note: z.string().optional().nullable(),
  isDone: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  doneAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const TaskItemChecklistCreateManyTaskInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistCreateManyTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistCreateManyTaskInput>;
export const TaskItemChecklistCreateManyTaskInputObjectZodSchema = makeSchema();
