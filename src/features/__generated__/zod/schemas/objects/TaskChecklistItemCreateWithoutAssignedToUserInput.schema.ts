import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema as TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema } from './TaskCreateNestedOneWithoutChecklistItemsInput.schema';
import { TaskExecutionCreateNestedManyWithoutChecklistItemInputObjectSchema as TaskExecutionCreateNestedManyWithoutChecklistItemInputObjectSchema } from './TaskExecutionCreateNestedManyWithoutChecklistItemInput.schema';
import { UserCreateNestedOneWithoutTaskChecklistItemInputObjectSchema as UserCreateNestedOneWithoutTaskChecklistItemInputObjectSchema } from './UserCreateNestedOneWithoutTaskChecklistItemInput.schema'

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
  task: z.lazy(() => TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema),
  executions: z.lazy(() => TaskExecutionCreateNestedManyWithoutChecklistItemInputObjectSchema).optional(),
  User: z.lazy(() => UserCreateNestedOneWithoutTaskChecklistItemInputObjectSchema).optional()
}).strict();
export const TaskChecklistItemCreateWithoutAssignedToUserInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateWithoutAssignedToUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateWithoutAssignedToUserInput>;
export const TaskChecklistItemCreateWithoutAssignedToUserInputObjectZodSchema = makeSchema();
