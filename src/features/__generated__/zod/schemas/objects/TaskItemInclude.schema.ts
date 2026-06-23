import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskArgsObjectSchema as TaskArgsObjectSchema } from './TaskArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { TaskExecutionFindManySchema as TaskExecutionFindManySchema } from '../findManyTaskExecution.schema';
import { TaskItemChecklistFindManySchema as TaskItemChecklistFindManySchema } from '../findManyTaskItemChecklist.schema';
import { TaskItemCountOutputTypeArgsObjectSchema as TaskItemCountOutputTypeArgsObjectSchema } from './TaskItemCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  task: z.union([z.boolean(), z.lazy(() => TaskArgsObjectSchema)]).optional(),
  assignedToUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  executions: z.union([z.boolean(), z.lazy(() => TaskExecutionFindManySchema)]).optional(),
  checklists: z.union([z.boolean(), z.lazy(() => TaskItemChecklistFindManySchema)]).optional(),
  User: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TaskItemCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TaskItemIncludeObjectSchema: z.ZodType<Prisma.TaskItemInclude> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemInclude>;
export const TaskItemIncludeObjectZodSchema = makeSchema();
