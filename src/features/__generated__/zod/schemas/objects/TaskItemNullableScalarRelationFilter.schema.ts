import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskItemWhereInputObjectSchema as TaskItemWhereInputObjectSchema } from './TaskItemWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => TaskItemWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => TaskItemWhereInputObjectSchema).optional().nullable()
}).strict();
export const TaskItemNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.TaskItemNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskItemNullableScalarRelationFilter>;
export const TaskItemNullableScalarRelationFilterObjectZodSchema = makeSchema();
