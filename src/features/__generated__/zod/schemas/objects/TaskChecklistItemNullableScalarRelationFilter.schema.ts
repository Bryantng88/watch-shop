import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskChecklistItemWhereInputObjectSchema as TaskChecklistItemWhereInputObjectSchema } from './TaskChecklistItemWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => TaskChecklistItemWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => TaskChecklistItemWhereInputObjectSchema).optional().nullable()
}).strict();
export const TaskChecklistItemNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.TaskChecklistItemNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TaskChecklistItemNullableScalarRelationFilter>;
export const TaskChecklistItemNullableScalarRelationFilterObjectZodSchema = makeSchema();
