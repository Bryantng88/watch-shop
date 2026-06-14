import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { NestedEnumTaskExecutionTargetTypeNullableFilterObjectSchema as NestedEnumTaskExecutionTargetTypeNullableFilterObjectSchema } from './NestedEnumTaskExecutionTargetTypeNullableFilter.schema'

const makeSchema = () => z.object({
  equals: TaskExecutionTargetTypeSchema.optional().nullable(),
  in: TaskExecutionTargetTypeSchema.array().optional().nullable(),
  notIn: TaskExecutionTargetTypeSchema.array().optional().nullable(),
  not: z.union([TaskExecutionTargetTypeSchema, z.lazy(() => NestedEnumTaskExecutionTargetTypeNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumTaskExecutionTargetTypeNullableFilterObjectSchema: z.ZodType<Prisma.EnumTaskExecutionTargetTypeNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskExecutionTargetTypeNullableFilter>;
export const EnumTaskExecutionTargetTypeNullableFilterObjectZodSchema = makeSchema();
