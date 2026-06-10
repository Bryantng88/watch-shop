import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskCompletionModeSchema } from '../enums/TaskCompletionMode.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTaskCompletionModeFilterObjectSchema as NestedEnumTaskCompletionModeFilterObjectSchema } from './NestedEnumTaskCompletionModeFilter.schema'

const nestedenumtaskcompletionmodewithaggregatesfilterSchema = z.object({
  equals: TaskCompletionModeSchema.optional(),
  in: TaskCompletionModeSchema.array().optional(),
  notIn: TaskCompletionModeSchema.array().optional(),
  not: z.union([TaskCompletionModeSchema, z.lazy(() => NestedEnumTaskCompletionModeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTaskCompletionModeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTaskCompletionModeFilterObjectSchema).optional()
}).strict();
export const NestedEnumTaskCompletionModeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskCompletionModeWithAggregatesFilter> = nestedenumtaskcompletionmodewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskCompletionModeWithAggregatesFilter>;
export const NestedEnumTaskCompletionModeWithAggregatesFilterObjectZodSchema = nestedenumtaskcompletionmodewithaggregatesfilterSchema;
