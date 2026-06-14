import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskTypeWhereInputObjectSchema as TaskTypeWhereInputObjectSchema } from './TaskTypeWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => TaskTypeWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => TaskTypeWhereInputObjectSchema).optional()
}).strict();
export const TaskTypeScalarRelationFilterObjectSchema: z.ZodType<Prisma.TaskTypeScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeScalarRelationFilter>;
export const TaskTypeScalarRelationFilterObjectZodSchema = makeSchema();
