import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskArgsObjectSchema as TaskArgsObjectSchema } from './TaskArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { TaskExecutionFindManySchema as TaskExecutionFindManySchema } from '../findManyTaskExecution.schema';
import { TaskItemChecklistFindManySchema as TaskItemChecklistFindManySchema } from '../findManyTaskItemChecklist.schema';
import { TaskItemCountOutputTypeArgsObjectSchema as TaskItemCountOutputTypeArgsObjectSchema } from './TaskItemCountOutputTypeArgs.schema'

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
  checklists: z.union([z.boolean(), z.lazy(() => TaskItemChecklistFindManySchema)]).optional(),
  userId: z.boolean().optional(),
  User: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TaskItemCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TaskItemSelectObjectSchema: z.ZodType<Prisma.TaskItemSelect> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemSelect>;
export const TaskItemSelectObjectZodSchema = makeSchema();
