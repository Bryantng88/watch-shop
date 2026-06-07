import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskStatusSchema } from '../enums/TaskStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTaskStatusFilterObjectSchema as NestedEnumTaskStatusFilterObjectSchema } from './NestedEnumTaskStatusFilter.schema'

const nestedenumtaskstatuswithaggregatesfilterSchema = z.object({
  equals: TaskStatusSchema.optional(),
  in: TaskStatusSchema.array().optional(),
  notIn: TaskStatusSchema.array().optional(),
  not: z.union([TaskStatusSchema, z.lazy(() => NestedEnumTaskStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTaskStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTaskStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumTaskStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskStatusWithAggregatesFilter> = nestedenumtaskstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskStatusWithAggregatesFilter>;
export const NestedEnumTaskStatusWithAggregatesFilterObjectZodSchema = nestedenumtaskstatuswithaggregatesfilterSchema;
