import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskArgsObjectSchema as TaskArgsObjectSchema } from './TaskArgs.schema';
import { TaskExecutionFindManySchema as TaskExecutionFindManySchema } from '../findManyTaskExecution.schema';
import { TaskChecklistItemCountOutputTypeArgsObjectSchema as TaskChecklistItemCountOutputTypeArgsObjectSchema } from './TaskChecklistItemCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  task: z.union([z.boolean(), z.lazy(() => TaskArgsObjectSchema)]).optional(),
  executions: z.union([z.boolean(), z.lazy(() => TaskExecutionFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TaskChecklistItemCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TaskChecklistItemIncludeObjectSchema: z.ZodType<Prisma.TaskChecklistItemInclude> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemInclude>;
export const TaskChecklistItemIncludeObjectZodSchema = makeSchema();
