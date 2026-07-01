import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { UserCreateNestedOneWithoutAssignedTaskItemsInputObjectSchema as UserCreateNestedOneWithoutAssignedTaskItemsInputObjectSchema } from './UserCreateNestedOneWithoutAssignedTaskItemsInput.schema';
import { TaskExecutionCreateNestedManyWithoutTaskItemInputObjectSchema as TaskExecutionCreateNestedManyWithoutTaskItemInputObjectSchema } from './TaskExecutionCreateNestedManyWithoutTaskItemInput.schema';
import { TaskItemChecklistCreateNestedManyWithoutTaskItemInputObjectSchema as TaskItemChecklistCreateNestedManyWithoutTaskItemInputObjectSchema } from './TaskItemChecklistCreateNestedManyWithoutTaskItemInput.schema';
import { TaskItemActivityCreateNestedManyWithoutTaskItemInputObjectSchema as TaskItemActivityCreateNestedManyWithoutTaskItemInputObjectSchema } from './TaskItemActivityCreateNestedManyWithoutTaskItemInput.schema';
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
  assignedToUser: z.lazy(() => UserCreateNestedOneWithoutAssignedTaskItemsInputObjectSchema).optional(),
  executions: z.lazy(() => TaskExecutionCreateNestedManyWithoutTaskItemInputObjectSchema).optional(),
  checklists: z.lazy(() => TaskItemChecklistCreateNestedManyWithoutTaskItemInputObjectSchema).optional(),
  activities: z.lazy(() => TaskItemActivityCreateNestedManyWithoutTaskItemInputObjectSchema).optional(),
  User: z.lazy(() => UserCreateNestedOneWithoutTaskItemsInputObjectSchema).optional()
}).strict();
export const TaskItemCreateWithoutTaskInputObjectSchema: z.ZodType<Prisma.TaskItemCreateWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemCreateWithoutTaskInput>;
export const TaskItemCreateWithoutTaskInputObjectZodSchema = makeSchema();
