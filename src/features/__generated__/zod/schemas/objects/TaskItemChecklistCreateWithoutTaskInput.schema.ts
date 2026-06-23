import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateNestedOneWithoutChecklistsInputObjectSchema as TaskItemCreateNestedOneWithoutChecklistsInputObjectSchema } from './TaskItemCreateNestedOneWithoutChecklistsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  title: z.string(),
  note: z.string().optional().nullable(),
  isDone: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  doneAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  taskItem: z.lazy(() => TaskItemCreateNestedOneWithoutChecklistsInputObjectSchema)
}).strict();
export const TaskItemChecklistCreateWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistCreateWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistCreateWithoutTaskInput>;
export const TaskItemChecklistCreateWithoutTaskInputObjectZodSchema = makeSchema();
