import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemActivityWhereInputObjectSchema as TaskItemActivityWhereInputObjectSchema } from './TaskItemActivityWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => TaskItemActivityWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => TaskItemActivityWhereInputObjectSchema).optional()
}).strict();
export const TaskItemActivityScalarRelationFilterObjectSchema: z.ZodType<Prisma.TaskItemActivityScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemActivityScalarRelationFilter>;
export const TaskItemActivityScalarRelationFilterObjectZodSchema = makeSchema();
