import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityReplySelectObjectSchema as TaskItemActivityReplySelectObjectSchema } from './TaskItemActivityReplySelect.schema';
import { TaskItemActivityReplyIncludeObjectSchema as TaskItemActivityReplyIncludeObjectSchema } from './TaskItemActivityReplyInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskItemActivityReplySelectObjectSchema).optional(),
  include: z.lazy(() => TaskItemActivityReplyIncludeObjectSchema).optional()
}).strict();
export const TaskItemActivityReplyArgsObjectSchema = makeSchema();
export const TaskItemActivityReplyArgsObjectZodSchema = makeSchema();
