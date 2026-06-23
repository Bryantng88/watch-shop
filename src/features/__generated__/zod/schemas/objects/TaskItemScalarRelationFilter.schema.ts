import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './TaskItemWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => TaskItemWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => TaskItemWhereInputObjectSchema).optional()
}).strict();
export const TaskItemScalarRelationFilterObjectSchema: z.ZodType<Prisma.TaskItemScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemScalarRelationFilter>;
export const TaskItemScalarRelationFilterObjectZodSchema = makeSchema();
