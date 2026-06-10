import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionWhereInputObjectSchema as TaskExecutionWhereInputObjectSchema } from './TaskExecutionWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => TaskExecutionWhereInputObjectSchema).optional(),
  some: z.lazy(() => TaskExecutionWhereInputObjectSchema).optional(),
  none: z.lazy(() => TaskExecutionWhereInputObjectSchema).optional()
}).strict();
export const TaskExecutionListRelationFilterObjectSchema: z.ZodType<Prisma.TaskExecutionListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskExecutionListRelationFilter>;
export const TaskExecutionListRelationFilterObjectZodSchema = makeSchema();
