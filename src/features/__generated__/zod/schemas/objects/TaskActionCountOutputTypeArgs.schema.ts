import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCountOutputTypeSelectObjectSchema as TaskActionCountOutputTypeSelectObjectSchema } from './TaskActionCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskActionCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const TaskActionCountOutputTypeArgsObjectSchema = makeSchema();
export const TaskActionCountOutputTypeArgsObjectZodSchema = makeSchema();
