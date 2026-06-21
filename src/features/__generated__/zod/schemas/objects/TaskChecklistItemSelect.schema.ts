import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskArgsObjectSchema as TaskArgsObjectSchema } from './TaskArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { TaskExecutionFindManySchema as TaskExecutionFindManySchema } from '../findManyTaskExecution.schema';
import { TaskChecklistItemCountOutputTypeArgsObjectSchema as TaskChecklistItemCountOutputTypeArgsObjectSchema } from './TaskChecklistItemCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  taskId: z.boolean().optional(),
  title: z.boolean().optional(),
  note: z.boolean().optional(),
  status: z.boolean().optional(),
  priority: z.boolean().optional(),
  dueAt: z.boolean().optional(),
  assignedToUserId: z.boolean().optional(),
  startedAt: z.boolean().optional(),
  completedAt: z.boolean().optional(),
  cancelledAt: z.boolean().optional(),
  isDone: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  task: z.union([z.boolean(), z.lazy(() => TaskArgsObjectSchema)]).optional(),
  assignedToUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  executions: z.union([z.boolean(), z.lazy(() => TaskExecutionFindManySchema)]).optional(),
  User: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  userId: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => TaskChecklistItemCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TaskChecklistItemSelectObjectSchema: z.ZodType<Prisma.TaskChecklistItemSelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemSelect>;
export const TaskChecklistItemSelectObjectZodSchema = makeSchema();
