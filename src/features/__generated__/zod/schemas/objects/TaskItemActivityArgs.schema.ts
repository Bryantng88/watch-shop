import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivitySelectObjectSchema as TaskItemActivitySelectObjectSchema } from './TaskItemActivitySelect.schema';
import { TaskItemActivityIncludeObjectSchema as TaskItemActivityIncludeObjectSchema } from './TaskItemActivityInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskItemActivitySelectObjectSchema).optional(),
  include: z.lazy(() => TaskItemActivityIncludeObjectSchema).optional()
}).strict();
export const TaskItemActivityArgsObjectSchema = makeSchema();
export const TaskItemActivityArgsObjectZodSchema = makeSchema();
