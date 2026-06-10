import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskTypeSelectObjectSchema as TaskTypeSelectObjectSchema } from './TaskTypeSelect.schema';
import { TaskTypeIncludeObjectSchema as TaskTypeIncludeObjectSchema } from './TaskTypeInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskTypeSelectObjectSchema).optional(),
  include: z.lazy(() => TaskTypeIncludeObjectSchema).optional()
}).strict();
export const TaskTypeArgsObjectSchema = makeSchema();
export const TaskTypeArgsObjectZodSchema = makeSchema();
