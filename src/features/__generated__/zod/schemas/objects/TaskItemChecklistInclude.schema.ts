import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemArgsObjectSchema as TaskItemArgsObjectSchema } from './TaskItemArgs.schema';
import { TaskArgsObjectSchema as TaskArgsObjectSchema } from './TaskArgs.schema'

const makeSchema = () => z.object({
  taskItem: z.union([z.boolean(), z.lazy(() => TaskItemArgsObjectSchema)]).optional(),
  Task: z.union([z.boolean(), z.lazy(() => TaskArgsObjectSchema)]).optional()
}).strict();
export const TaskItemChecklistIncludeObjectSchema: z.ZodType<Prisma.TaskItemChecklistInclude> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemChecklistInclude>;
export const TaskItemChecklistIncludeObjectZodSchema = makeSchema();
