import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCountOutputTypeSelectObjectSchema as TaskCountOutputTypeSelectObjectSchema } from './TaskCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const TaskCountOutputTypeArgsObjectSchema = makeSchema();
export const TaskCountOutputTypeArgsObjectZodSchema = makeSchema();
