import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskFindManySchema as TaskFindManySchema } from '../findManyTask.schema';
import { TaskTypeCountOutputTypeArgsObjectSchema as TaskTypeCountOutputTypeArgsObjectSchema } from './TaskTypeCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  tasks: z.union([z.boolean(), z.lazy(() => TaskFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TaskTypeCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TaskTypeIncludeObjectSchema: z.ZodType<Prisma.TaskTypeInclude> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeInclude>;
export const TaskTypeIncludeObjectZodSchema = makeSchema();
