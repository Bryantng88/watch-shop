import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskTypeWhereInputObjectSchema as TaskTypeWhereInputObjectSchema } from './TaskTypeWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => TaskTypeWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => TaskTypeWhereInputObjectSchema).optional().nullable()
}).strict();
export const TaskTypeNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.TaskTypeNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskTypeNullableScalarRelationFilter>;
export const TaskTypeNullableScalarRelationFilterObjectZodSchema = makeSchema();
