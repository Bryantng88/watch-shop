import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionUncheckedCreateNestedManyWithoutChecklistItemInputObjectSchema as TaskExecutionUncheckedCreateNestedManyWithoutChecklistItemInputObjectSchema } from './TaskExecutionUncheckedCreateNestedManyWithoutChecklistItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  title: z.string(),
  note: z.string().optional().nullable(),
  isDone: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  executions: z.lazy(() => TaskExecutionUncheckedCreateNestedManyWithoutChecklistItemInputObjectSchema).optional()
}).strict();
export const TaskChecklistItemUncheckedCreateWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUncheckedCreateWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUncheckedCreateWithoutTaskInput>;
export const TaskChecklistItemUncheckedCreateWithoutTaskInputObjectZodSchema = makeSchema();
