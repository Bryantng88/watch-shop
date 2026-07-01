import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityCountOutputTypeSelectObjectSchema as TaskItemActivityCountOutputTypeSelectObjectSchema } from './TaskItemActivityCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskItemActivityCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const TaskItemActivityCountOutputTypeArgsObjectSchema = makeSchema();
export const TaskItemActivityCountOutputTypeArgsObjectZodSchema = makeSchema();
