import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemSelectObjectSchema as TaskItemSelectObjectSchema } from './TaskItemSelect.schema';
import { TaskItemIncludeObjectSchema as TaskItemIncludeObjectSchema } from './TaskItemInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskItemSelectObjectSchema).optional(),
  include: z.lazy(() => TaskItemIncludeObjectSchema).optional()
}).strict();
export const TaskItemArgsObjectSchema = makeSchema();
export const TaskItemArgsObjectZodSchema = makeSchema();
