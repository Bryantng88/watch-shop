import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TimelineSourceTypeSchema } from '../enums/TimelineSourceType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTimelineSourceTypeFilterObjectSchema as NestedEnumTimelineSourceTypeFilterObjectSchema } from './NestedEnumTimelineSourceTypeFilter.schema'

const nestedenumtimelinesourcetypewithaggregatesfilterSchema = z.object({
  equals: TimelineSourceTypeSchema.optional(),
  in: TimelineSourceTypeSchema.array().optional(),
  notIn: TimelineSourceTypeSchema.array().optional(),
  not: z.union([TimelineSourceTypeSchema, z.lazy(() => NestedEnumTimelineSourceTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTimelineSourceTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTimelineSourceTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumTimelineSourceTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTimelineSourceTypeWithAggregatesFilter> = nestedenumtimelinesourcetypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTimelineSourceTypeWithAggregatesFilter>;
export const NestedEnumTimelineSourceTypeWithAggregatesFilterObjectZodSchema = nestedenumtimelinesourcetypewithaggregatesfilterSchema;
