import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskTypeCountOutputTypeSelectObjectSchema as TaskTypeCountOutputTypeSelectObjectSchema } from './TaskTypeCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TaskTypeCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const TaskTypeCountOutputTypeArgsObjectSchema = makeSchema();
export const TaskTypeCountOutputTypeArgsObjectZodSchema = makeSchema();
