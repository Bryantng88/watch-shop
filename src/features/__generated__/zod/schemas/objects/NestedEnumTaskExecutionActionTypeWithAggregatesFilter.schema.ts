import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskExecutionActionTypeSchema } from '../enums/TaskExecutionActionType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTaskExecutionActionTypeFilterObjectSchema as NestedEnumTaskExecutionActionTypeFilterObjectSchema } from './NestedEnumTaskExecutionActionTypeFilter.schema'

const nestedenumtaskexecutionactiontypewithaggregatesfilterSchema = z.object({
  equals: TaskExecutionActionTypeSchema.optional(),
  in: TaskExecutionActionTypeSchema.array().optional(),
  notIn: TaskExecutionActionTypeSchema.array().optional(),
  not: z.union([TaskExecutionActionTypeSchema, z.lazy(() => NestedEnumTaskExecutionActionTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTaskExecutionActionTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTaskExecutionActionTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumTaskExecutionActionTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskExecutionActionTypeWithAggregatesFilter> = nestedenumtaskexecutionactiontypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskExecutionActionTypeWithAggregatesFilter>;
export const NestedEnumTaskExecutionActionTypeWithAggregatesFilterObjectZodSchema = nestedenumtaskexecutionactiontypewithaggregatesfilterSchema;
