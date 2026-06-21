import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema as TaskCreateNestedOneWithoutChecklistItemsInputObjectSchema } from './TaskCreateNestedOneWithoutChecklistItemsInput.schema';
import { UserCreateNestedOneWithoutAssignedChecklistItemsInputObjectSchema as UserCreateNestedOneWithoutAssignedChecklistItemsInputObjectSchema } from './UserCreateNestedOneWithoutAssignedChecklistItemsInput.schema';
import { TaskExecutionCreateNestedManyWithoutChecklistItemInputObjectSchema as TaskExecutionCreateNestedManyWithoutChecklistItemInputObjectSchema } from './TaskExecutionCreateNestedManyWithoutChecklistItemInput.schema'

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
  assignedToUser: z.lazy(() => UserCreateNestedOneWithoutAssignedChecklistItemsInputObjectSchema).optional(),
  executions: z.lazy(() => TaskExecutionCreateNestedManyWithoutChecklistItemInputObjectSchema).optional()
}).strict();
export const TaskChecklistItemCreateWithoutUserInputObjectSchema: z.ZodType<Prisma.TaskChecklistItemCreateWithoutUserInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemCreateWithoutUserInput>;
export const TaskChecklistItemCreateWithoutUserInputObjectZodSchema = makeSchema();
