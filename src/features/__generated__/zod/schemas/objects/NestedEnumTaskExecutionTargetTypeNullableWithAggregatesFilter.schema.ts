import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumTaskExecutionTargetTypeNullableFilterObjectSchema as NestedEnumTaskExecutionTargetTypeNullableFilterObjectSchema } from './NestedEnumTaskExecutionTargetTypeNullableFilter.schema'

const nestedenumtaskexecutiontargettypenullablewithaggregatesfilterSchema = z.object({
  equals: TaskExecutionTargetTypeSchema.optional().nullable(),
  in: TaskExecutionTargetTypeSchema.array().optional().nullable(),
  notIn: TaskExecutionTargetTypeSchema.array().optional().nullable(),
  not: z.union([TaskExecutionTargetTypeSchema, z.lazy(() => NestedEnumTaskExecutionTargetTypeNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTaskExecutionTargetTypeNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTaskExecutionTargetTypeNullableFilterObjectSchema).optional()
}).strict();
export const NestedEnumTaskExecutionTargetTypeNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskExecutionTargetTypeNullableWithAggregatesFilter> = nestedenumtaskexecutiontargettypenullablewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskExecutionTargetTypeNullableWithAggregatesFilter>;
export const NestedEnumTaskExecutionTargetTypeNullableWithAggregatesFilterObjectZodSchema = nestedenumtaskexecutiontargettypenullablewithaggregatesfilterSchema;
