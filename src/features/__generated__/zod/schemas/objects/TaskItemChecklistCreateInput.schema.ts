import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCreateNestedOneWithoutChecklistsInputObjectSchema as TaskItemCreateNestedOneWithoutChecklistsInputObjectSchema } from './TaskItemCreateNestedOneWithoutChecklistsInput.schema';
import { TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema as TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema } from './TaskCreateNestedOneWithoutChecklistItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  title: z.string(),
  note: z.string().optional().nullable(),
  isDone: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  doneAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  taskItem: z.lazy(() => TaskItemCreateNestedOneWithoutChecklistsInputObjectSchema),
  Task: z.lazy(() => TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema).optional()
}).strict();
export const TaskItemChecklistCreateInputObjectSchema: z.ZodType<Prisma.TaskItemChecklistCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistCreateInput>;
export const TaskItemChecklistCreateInputObjectZodSchema = makeSchema();
