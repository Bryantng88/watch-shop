import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => TaskWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => TaskWhereInputObjectSchema).optional()
}).strict();
export const TaskScalarRelationFilterObjectSchema: z.ZodType<Prisma.TaskScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskScalarRelationFilter>;
export const TaskScalarRelationFilterObjectZodSchema = makeSchema();
