import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { NestedEnumTaskStatusWithAggregatesFilterObjectSchema as NestedEnumTaskStatusWithAggregatesFilterObjectSchema } from './NestedEnumTaskStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTaskStatusFilterObjectSchema as NestedEnumTaskStatusFilterObjectSchema } from './NestedEnumTaskStatusFilter.schema'

const makeSchema = () => z.object({
  equals: TaskStatusSchema.optional(),
  in: TaskStatusSchema.array().optional(),
  notIn: TaskStatusSchema.array().optional(),
  not: z.union([TaskStatusSchema, z.lazy(() => NestedEnumTaskStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTaskStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTaskStatusFilterObjectSchema).optional()
}).strict();
export const EnumTaskStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTaskStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskStatusWithAggregatesFilter>;
export const EnumTaskStatusWithAggregatesFilterObjectZodSchema = makeSchema();
