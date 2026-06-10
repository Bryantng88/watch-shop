import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionTargetTypeSchema } from '../enums/TaskExecutionTargetType.schema';
import { NestedEnumTaskExecutionTargetTypeWithAggregatesFilterObjectSchema as NestedEnumTaskExecutionTargetTypeWithAggregatesFilterObjectSchema } from './NestedEnumTaskExecutionTargetTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTaskExecutionTargetTypeFilterObjectSchema as NestedEnumTaskExecutionTargetTypeFilterObjectSchema } from './NestedEnumTaskExecutionTargetTypeFilter.schema'

const makeSchema = () => z.object({
  equals: TaskExecutionTargetTypeSchema.optional(),
  in: TaskExecutionTargetTypeSchema.array().optional(),
  notIn: TaskExecutionTargetTypeSchema.array().optional(),
  not: z.union([TaskExecutionTargetTypeSchema, z.lazy(() => NestedEnumTaskExecutionTargetTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTaskExecutionTargetTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTaskExecutionTargetTypeFilterObjectSchema).optional()
}).strict();
export const EnumTaskExecutionTargetTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTaskExecutionTargetTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskExecutionTargetTypeWithAggregatesFilter>;
export const EnumTaskExecutionTargetTypeWithAggregatesFilterObjectZodSchema = makeSchema();
