import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemChecklistSelectObjectSchema as TaskItemChecklistSelectObjectSchema } from './TaskItemChecklistSelect.schema';
import { TaskItemChecklistIncludeObjectSchema as TaskItemChecklistIncludeObjectSchema } from './TaskItemChecklistInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskItemChecklistSelectObjectSchema).optional(),
  include: z.lazy(() => TaskItemChecklistIncludeObjectSchema).optional()
}).strict();
export const TaskItemChecklistArgsObjectSchema = makeSchema();
export const TaskItemChecklistArgsObjectZodSchema = makeSchema();
