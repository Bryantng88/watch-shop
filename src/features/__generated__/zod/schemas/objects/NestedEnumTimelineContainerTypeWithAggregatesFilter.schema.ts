import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TimelineContainerTypeSchema } from '../enums/TimelineContainerType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTimelineContainerTypeFilterObjectSchema as NestedEnumTimelineContainerTypeFilterObjectSchema } from './NestedEnumTimelineContainerTypeFilter.schema'

const nestedenumtimelinecontainertypewithaggregatesfilterSchema = z.object({
  equals: TimelineContainerTypeSchema.optional(),
  in: TimelineContainerTypeSchema.array().optional(),
  notIn: TimelineContainerTypeSchema.array().optional(),
  not: z.union([TimelineContainerTypeSchema, z.lazy(() => NestedEnumTimelineContainerTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTimelineContainerTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTimelineContainerTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumTimelineContainerTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTimelineContainerTypeWithAggregatesFilter> = nestedenumtimelinecontainertypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTimelineContainerTypeWithAggregatesFilter>;
export const NestedEnumTimelineContainerTypeWithAggregatesFilterObjectZodSchema = nestedenumtimelinecontainertypewithaggregatesfilterSchema;
