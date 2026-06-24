import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskPeriodSchema } from '../enums/TaskPeriod.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumTaskPeriodNullableFilterObjectSchema as NestedEnumTaskPeriodNullableFilterObjectSchema } from './NestedEnumTaskPeriodNullableFilter.schema'

const nestedenumtaskperiodnullablewithaggregatesfilterSchema = z.object({
  equals: TaskPeriodSchema.optional().nullable(),
  in: TaskPeriodSchema.array().optional().nullable(),
  notIn: TaskPeriodSchema.array().optional().nullable(),
  not: z.union([TaskPeriodSchema, z.lazy(() => NestedEnumTaskPeriodNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTaskPeriodNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTaskPeriodNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumTaskPeriodNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskPeriodNullableWithAggregatesFilter> = nestedenumtaskperiodnullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskPeriodNullableWithAggregatesFilter>;
export const NestedEnumTaskPeriodNullableWithAggregatesFilterObjectZodSchema = nestedenumtaskperiodnullablewithaggregatesfilterSchema;
