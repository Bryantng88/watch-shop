import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskSourceSchema } from '../enums/TaskSource.schema';
import { NestedEnumTaskSourceWithAggregatesFilterObjectSchema as NestedEnumTaskSourceWithAggregatesFilterObjectSchema } from './NestedEnumTaskSourceWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTaskSourceFilterObjectSchema as NestedEnumTaskSourceFilterObjectSchema } from './NestedEnumTaskSourceFilter.schema'

const makeSchema = () => z.object({
  equals: TaskSourceSchema.optional(),
  in: TaskSourceSchema.array().optional(),
  notIn: TaskSourceSchema.array().optional(),
  not: z.union([TaskSourceSchema, z.lazy(() => NestedEnumTaskSourceWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTaskSourceFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTaskSourceFilterObjectSchema).optional()
}).strict();
export const EnumTaskSourceWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTaskSourceWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTaskSourceWithAggregatesFilter>;
export const EnumTaskSourceWithAggregatesFilterObjectZodSchema = makeSchema();
