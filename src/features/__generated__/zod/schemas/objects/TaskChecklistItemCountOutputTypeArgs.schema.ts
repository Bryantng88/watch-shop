import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemCountOutputTypeSelectObjectSchema as TaskChecklistItemCountOutputTypeSelectObjectSchema } from './TaskChecklistItemCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskChecklistItemCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const TaskChecklistItemCountOutputTypeArgsObjectSchema = makeSchema();
export const TaskChecklistItemCountOutputTypeArgsObjectZodSchema = makeSchema();
