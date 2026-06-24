import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskPeriodSchema } from '../enums/TaskPeriod.schema';
import { NestedEnumTaskPeriodNullableWithAggregatesFilterObjectSchema as NestedEnumTaskPeriodNullableWithAggregatesFilterObjectSchema } from './NestedEnumTaskPeriodNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumTaskPeriodNullableFilterObjectSchema as NestedEnumTaskPeriodNullableFilterObjectSchema } from './NestedEnumTaskPeriodNullableFilter.schema'

const makeSchema = () => z.object({
  equals: TaskPeriodSchema.optional().nullable(),
  in: TaskPeriodSchema.array().optional().nullable(),
  notIn: TaskPeriodSchema.array().optional().nullable(),
  not: z.union([TaskPeriodSchema, z.lazy(() => NestedEnumTaskPeriodNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTaskPeriodNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTaskPeriodNullableFilterObjectSchema).optional()
}).strict();
export const EnumTaskPeriodNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTaskPeriodNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskPeriodNullableWithAggregatesFilter>;
export const EnumTaskPeriodNullableWithAggregatesFilterObjectZodSchema = makeSchema();
