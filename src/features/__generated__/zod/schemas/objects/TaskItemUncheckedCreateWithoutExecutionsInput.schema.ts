import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { TaskItemChecklistUncheckedCreateNestedManyWithoutTaskItemInputObjectSchema as TaskItemChecklistUncheckedCreateNestedManyWithoutTaskItemInputObjectSchema } from './TaskItemChecklistUncheckedCreateNestedManyWithoutTaskItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  taskId: z.string(),
  title: z.string(),
  note: z.string().optional().nullable(),
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  dueAt: z.coerce.date().optional().nullable(),
  assignedToUserId: z.string().optional().nullable(),
  startedAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  cancelledAt: z.coerce.date().optional().nullable(),
  isDone: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string().optional().nullable(),
  checklists: z.lazy(() => TaskItemChecklistUncheckedCreateNestedManyWithoutTaskItemInputObjectSchema).optional()
}).strict();
export const TaskItemUncheckedCreateWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.TaskItemUncheckedCreateWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemUncheckedCreateWithoutExecutionsInput>;
export const TaskItemUncheckedCreateWithoutExecutionsInputObjectZodSchema = makeSchema();
