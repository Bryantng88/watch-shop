import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema as TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema } from './TaskCreateNestedOneWithoutChecklistItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  title: z.string(),
  note: z.string().optional().nullable(),
  isDone: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  doneAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Task: z.lazy(() => TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema).optional()
}).strict();
export const TaskItemChecklistCreateWithoutTaskItemInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistCreateWithoutTaskItemInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistCreateWithoutTaskItemInput>;
export const TaskItemChecklistCreateWithoutTaskItemInputObjectZodSchema = makeSchema();
