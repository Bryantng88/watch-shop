import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionSelectObjectSchema as TaskExecutionSelectObjectSchema } from './TaskExecutionSelect.schema';
import { TaskExecutionIncludeObjectSchema as TaskExecutionIncludeObjectSchema } from './TaskExecutionInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskExecutionSelectObjectSchema).optional(),
  include: z.lazy(() => TaskExecutionIncludeObjectSchema).optional()
}).strict();
export const TaskExecutionArgsObjectSchema = makeSchema();
export const TaskExecutionArgsObjectZodSchema = makeSchema();
