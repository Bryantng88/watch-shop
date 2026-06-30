import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TimelineContainerTypeSchema } from '../enums/TimelineContainerType.schema';
import { NestedEnumTimelineContainerTypeWithAggregatesFilterObjectSchema as NestedEnumTimelineContainerTypeWithAggregatesFilterObjectSchema } from './NestedEnumTimelineContainerTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTimelineContainerTypeFilterObjectSchema as NestedEnumTimelineContainerTypeFilterObjectSchema } from './NestedEnumTimelineContainerTypeFilter.schema'

const makeSchema = () => z.object({
  equals: TimelineContainerTypeSchema.optional(),
  in: TimelineContainerTypeSchema.array().optional(),
  notIn: TimelineContainerTypeSchema.array().optional(),
  not: z.union([TimelineContainerTypeSchema, z.lazy(() => NestedEnumTimelineContainerTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTimelineContainerTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTimelineContainerTypeFilterObjectSchema).optional()
}).strict();
export const EnumTimelineContainerTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTimelineContainerTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTimelineContainerTypeWithAggregatesFilter>;
export const EnumTimelineContainerTypeWithAggregatesFilterObjectZodSchema = makeSchema();
