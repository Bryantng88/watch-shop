import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemSelectObjectSchema as TaskChecklistItemSelectObjectSchema } from './TaskChecklistItemSelect.schema';
import { TaskChecklistItemIncludeObjectSchema as TaskChecklistItemIncludeObjectSchema } from './TaskChecklistItemInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskChecklistItemSelectObjectSchema).optional(),
  include: z.lazy(() => TaskChecklistItemIncludeObjectSchema).optional()
}).strict();
export const TaskChecklistItemArgsObjectSchema = makeSchema();
export const TaskChecklistItemArgsObjectZodSchema = makeSchema();
