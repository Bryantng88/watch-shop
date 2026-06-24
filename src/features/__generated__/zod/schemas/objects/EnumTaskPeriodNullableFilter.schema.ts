import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskPeriodSchema } from '../enums/TaskPeriod.schema';
import { NestedEnumTaskPeriodNullableFilterObjectSchema as NestedEnumTaskPeriodNullableFilterObjectSchema } from './NestedEnumTaskPeriodNullableFilter.schema'

const makeSchema = () => z.object({
  equals: TaskPeriodSchema.optional().nullable(),
  in: TaskPeriodSchema.array().optional().nullable(),
  notIn: TaskPeriodSchema.array().optional().nullable(),
  not: z.union([TaskPeriodSchema, z.lazy(() => NestedEnumTaskPeriodNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumTaskPeriodNullableFilterObjectSchema: z.ZodType<Prisma.EnumTaskPeriodNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskPeriodNullableFilter>;
export const EnumTaskPeriodNullableFilterObjectZodSchema = makeSchema();
