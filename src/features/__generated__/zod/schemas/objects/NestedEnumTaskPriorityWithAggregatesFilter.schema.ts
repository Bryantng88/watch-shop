import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskPrioritySchema } from '../enums/TaskPriority.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTaskPriorityFilterObjectSchema as NestedEnumTaskPriorityFilterObjectSchema } from './NestedEnumTaskPriorityFilter.schema'

const nestedenumtaskprioritywithaggregatesfilterSchema = z.object({
  equals: TaskPrioritySchema.optional(),
  in: TaskPrioritySchema.array().optional(),
  notIn: TaskPrioritySchema.array().optional(),
  not: z.union([TaskPrioritySchema, z.lazy(() => NestedEnumTaskPriorityWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTaskPriorityFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTaskPriorityFilterObjectSchema).optional()
}).strict();
export const NestedEnumTaskPriorityWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTaskPriorityWithAggregatesFilter> = nestedenumtaskprioritywithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTaskPriorityWithAggregatesFilter>;
export const NestedEnumTaskPriorityWithAggregatesFilterObjectZodSchema = nestedenumtaskprioritywithaggregatesfilterSchema;
