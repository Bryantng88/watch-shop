import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionSelectObjectSchema as TaskActionSelectObjectSchema } from './TaskActionSelect.schema';
import { TaskActionIncludeObjectSchema as TaskActionIncludeObjectSchema } from './TaskActionInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskActionSelectObjectSchema).optional(),
  include: z.lazy(() => TaskActionIncludeObjectSchema).optional()
}).strict();
export const TaskActionArgsObjectSchema = makeSchema();
export const TaskActionArgsObjectZodSchema = makeSchema();
