import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityWhereInputObjectSchema as TaskItemActivityWhereInputObjectSchema } from './TaskItemActivityWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => TaskItemActivityWhereInputObjectSchema).optional(),
  some: z.lazy(() => TaskItemActivityWhereInputObjectSchema).optional(),
  none: z.lazy(() => TaskItemActivityWhereInputObjectSchema).optional()
}).strict();
export const TaskItemActivityListRelationFilterObjectSchema: z.ZodType<Prisma.TaskItemActivityListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityListRelationFilter>;
export const TaskItemActivityListRelationFilterObjectZodSchema = makeSchema();
