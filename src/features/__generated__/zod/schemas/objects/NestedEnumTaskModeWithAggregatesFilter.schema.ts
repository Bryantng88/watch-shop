import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskModeSchema } from '../enums/TaskMode.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTaskModeFilterObjectSchema as NestedEnumTaskModeFilterObjectSchema } from './NestedEnumTaskModeFilter.schema'

const nestedenumtaskmodewithaggregatesfilterSchema = z.object({
  equals: TaskModeSchema.optional(),
  in: TaskModeSchema.array().optional(),
  notIn: TaskModeSchema.array().optional(),
  not: z.union([TaskModeSchema, z.lazy(() => NestedEnumTaskModeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTaskModeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTaskModeFilterObjectSchema).optional()
}).strict();
export const NestedEnumTaskModeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskModeWithAggregatesFilter> = nestedenumtaskmodewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskModeWithAggregatesFilter>;
export const NestedEnumTaskModeWithAggregatesFilterObjectZodSchema = nestedenumtaskmodewithaggregatesfilterSchema;
