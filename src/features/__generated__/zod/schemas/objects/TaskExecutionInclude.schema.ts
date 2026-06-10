import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskArgsObjectSchema as TaskArgsObjectSchema } from './TaskArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema'

const makeSchema = () => z.object({
  task: z.union([z.boolean(), z.lazy(() => TaskArgsObjectSchema)]).optional(),
  createdByUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional()
}).strict();
export const TaskExecutionIncludeObjectSchema: z.ZodType<Prisma.TaskExecutionInclude> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionInclude>;
export const TaskExecutionIncludeObjectZodSchema = makeSchema();
