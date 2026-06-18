import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionUncheckedCreateNestedManyWithoutChecklistItemInputObjectSchema as TaskExecutionUncheckedCreateNestedManyWithoutChecklistItemInputObjectSchema } from './TaskExecutionUncheckedCreateNestedManyWithoutChecklistItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  taskId: z.string(),
  title: z.string(),
  note: z.string().optional().nullable(),
  isDone: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  executions: z.lazy(() => TaskExecutionUncheckedCreateNestedManyWithoutChecklistItemInputObjectSchema)
}).strict();
export const TaskChecklistItemUncheckedCreateInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemUncheckedCreateInput>;
export const TaskChecklistItemUncheckedCreateInputObjectZodSchema = makeSchema();
