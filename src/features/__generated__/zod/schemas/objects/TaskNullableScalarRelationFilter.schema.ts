import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskWhereInputObjectSchema as TaskWhereInputObjectSchema } from './TaskWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => TaskWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => TaskWhereInputObjectSchema).optional().nullable()
}).strict();
export const TaskNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.TaskNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskNullableScalarRelationFilter>;
export const TaskNullableScalarRelationFilterObjectZodSchema = makeSchema();
