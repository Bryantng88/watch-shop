import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { TaskCreateNestedOneWithoutTaskItemsInputObjectSchema as TaskCreateNestedOneWithoutTaskItemsInputObjectSchema } from './TaskCreateNestedOneWithoutTaskItemsInput.schema';
import { UserCreateNestedOneWithoutAssignedTaskItemsInputObjectSchema as UserCreateNestedOneWithoutAssignedTaskItemsInputObjectSchema } from './UserCreateNestedOneWithoutAssignedTaskItemsInput.schema';
import { TaskItemChecklistCreateNestedManyWithoutTaskItemInputObjectSchema as TaskItemChecklistCreateNestedManyWithoutTaskItemInputObjectSchema } from './TaskItemChecklistCreateNestedManyWithoutTaskItemInput.schema';
import { UserCreateNestedOneWithoutTaskItemsInputObjectSchema as UserCreateNestedOneWithoutTaskItemsInputObjectSchema } from './UserCreateNestedOneWithoutTaskItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  title: z.string(),
  note: z.string().optional().nullable(),
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  dueAt: z.coerce.date().optional().nullable(),
  startedAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  cancelledAt: z.coerce.date().optional().nullable(),
  isDone: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  task: z.lazy(() => TaskCreateNestedOneWithoutTaskItemsInputObjectSchema),
  assignedToUser: z.lazy(() => UserCreateNestedOneWithoutAssignedTaskItemsInputObjectSchema).optional(),
  checklists: z.lazy(() => TaskItemChecklistCreateNestedManyWithoutTaskItemInputObjectSchema).optional(),
  User: z.lazy(() => UserCreateNestedOneWithoutTaskItemsInputObjectSchema).optional()
}).strict();
export const TaskItemCreateWithoutExecutionsInputObjectSchema: z.ZodType<Prisma.TaskItemCreateWithoutExecutionsInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCreateWithoutExecutionsInput>;
export const TaskItemCreateWithoutExecutionsInputObjectZodSchema = makeSchema();
