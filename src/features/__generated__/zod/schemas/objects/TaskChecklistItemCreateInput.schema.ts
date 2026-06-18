import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema as TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema } from './TaskCreateNestedOneWithoutChecklistItemsInput.schema';
import { TaskExecutionCreateNestedManyWithoutChecklistItemInputObjectSchema as TaskExecutionCreateNestedManyWithoutChecklistItemInputObjectSchema } from './TaskExecutionCreateNestedManyWithoutChecklistItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  title: z.string(),
  note: z.string().optional().nullable(),
  isDone: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  task: z.lazy(() => TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema),
  executions: z.lazy(() => TaskExecutionCreateNestedManyWithoutChecklistItemInputObjectSchema)
}).strict();
export const TaskChecklistItemCreateInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateInput>;
export const TaskChecklistItemCreateInputObjectZodSchema = makeSchema();
