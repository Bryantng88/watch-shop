import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => TaskWhereInputObjectSchema).optional(),
  some: z.lazy(() => TaskWhereInputObjectSchema).optional(),
  none: z.lazy(() => TaskWhereInputObjectSchema).optional()
}).strict();
export const TaskListRelationFilterObjectSchema: z.ZodType<Prisma.TaskListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskListRelationFilter>;
export const TaskListRelationFilterObjectZodSchema = makeSchema();
