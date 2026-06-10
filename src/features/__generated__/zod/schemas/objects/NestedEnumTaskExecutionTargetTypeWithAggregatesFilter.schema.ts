import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTaskExecutionTargetTypeFilterObjectSchema as NestedEnumTaskExecutionTargetTypeFilterObjectSchema } from './NestedEnumTaskExecutionTargetTypeFilter.schema'

const nestedenumtaskexecutiontargettypewithaggregatesfilterSchema = z.object({
  equals: TaskExecutionTargetTypeSchema.optional(),
  in: TaskExecutionTargetTypeSchema.array().optional(),
  notIn: TaskExecutionTargetTypeSchema.array().optional(),
  not: z.union([TaskExecutionTargetTypeSchema, z.lazy(() => NestedEnumTaskExecutionTargetTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTaskExecutionTargetTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTaskExecutionTargetTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumTaskExecutionTargetTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskExecutionTargetTypeWithAggregatesFilter> = nestedenumtaskexecutiontargettypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskExecutionTargetTypeWithAggregatesFilter>;
export const NestedEnumTaskExecutionTargetTypeWithAggregatesFilterObjectZodSchema = nestedenumtaskexecutiontargettypewithaggregatesfilterSchema;
