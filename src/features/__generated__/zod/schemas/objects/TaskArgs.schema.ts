import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskSelectObjectSchema as TaskSelectObjectSchema } from './TaskSelect.schema';
import { TaskIncludeObjectSchema as TaskIncludeObjectSchema } from './TaskInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskSelectObjectSchema).optional(),
  include: z.lazy(() => TaskIncludeObjectSchema).optional()
}).strict();
export const TaskArgsObjectSchema = makeSchema();
export const TaskArgsObjectZodSchema = makeSchema();
