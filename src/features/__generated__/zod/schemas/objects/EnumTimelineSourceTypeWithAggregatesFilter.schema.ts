import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TimelineSourceTypeSchema } from '../enums/TimelineSourceType.schema';
import { NestedEnumTimelineSourceTypeWithAggregatesFilterObjectSchema as NestedEnumTimelineSourceTypeWithAggregatesFilterObjectSchema } from './NestedEnumTimelineSourceTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTimelineSourceTypeFilterObjectSchema as NestedEnumTimelineSourceTypeFilterObjectSchema } from './NestedEnumTimelineSourceTypeFilter.schema'

const makeSchema = () => z.object({
  equals: TimelineSourceTypeSchema.optional(),
  in: TimelineSourceTypeSchema.array().optional(),
  notIn: TimelineSourceTypeSchema.array().optional(),
  not: z.union([TimelineSourceTypeSchema, z.lazy(() => NestedEnumTimelineSourceTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTimelineSourceTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTimelineSourceTypeFilterObjectSchema).optional()
}).strict();
export const EnumTimelineSourceTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTimelineSourceTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTimelineSourceTypeWithAggregatesFilter>;
export const EnumTimelineSourceTypeWithAggregatesFilterObjectZodSchema = makeSchema();
