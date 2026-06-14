import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionWhereInputObjectSchema as TaskActionWhereInputObjectSchema } from './TaskActionWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => TaskActionWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => TaskActionWhereInputObjectSchema).optional().nullable()
}).strict();
export const TaskActionNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.TaskActionNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskActionNullableScalarRelationFilter>;
export const TaskActionNullableScalarRelationFilterObjectZodSchema = makeSchema();
