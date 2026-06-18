import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionCreateNestedManyWithoutChecklistItemInputObjectSchema as TaskExecutionCreateNestedManyWithoutChecklistItemInputObjectSchema } from './TaskExecutionCreateNestedManyWithoutChecklistItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  title: z.string(),
  note: z.string().optional().nullable(),
  isDone: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  executions: z.lazy(() => TaskExecutionCreateNestedManyWithoutChecklistItemInputObjectSchema).optional()
}).strict();
export const TaskChecklistItemCreateWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateWithoutTaskInput>;
export const TaskChecklistItemCreateWithoutTaskInputObjectZodSchema = makeSchema();
