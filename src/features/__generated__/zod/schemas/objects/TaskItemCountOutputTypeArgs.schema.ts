import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemCountOutputTypeSelectObjectSchema as TaskItemCountOutputTypeSelectObjectSchema } from './TaskItemCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskItemCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const TaskItemCountOutputTypeArgsObjectSchema = makeSchema();
export const TaskItemCountOutputTypeArgsObjectZodSchema = makeSchema();
