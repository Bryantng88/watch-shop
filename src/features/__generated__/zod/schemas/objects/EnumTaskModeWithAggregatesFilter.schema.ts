import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskModeSchema } from '../enums/TaskMode.schema';
import { NestedEnumTaskModeWithAggregatesFilterObjectSchema as NestedEnumTaskModeWithAggregatesFilterObjectSchema } from './NestedEnumTaskModeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTaskModeFilterObjectSchema as NestedEnumTaskModeFilterObjectSchema } from './NestedEnumTaskModeFilter.schema'

const makeSchema = () => z.object({
  equals: TaskModeSchema.optional(),
  in: TaskModeSchema.array().optional(),
  notIn: TaskModeSchema.array().optional(),
  not: z.union([TaskModeSchema, z.lazy(() => NestedEnumTaskModeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTaskModeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTaskModeFilterObjectSchema).optional()
}).strict();
export const EnumTaskModeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTaskModeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskModeWithAggregatesFilter>;
export const EnumTaskModeWithAggregatesFilterObjectZodSchema = makeSchema();
