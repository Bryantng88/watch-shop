import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TimelineSourceTypeSchema } from '../enums/TimelineSourceType.schema';
import { NestedEnumTimelineSourceTypeFilterObjectSchema as NestedEnumTimelineSourceTypeFilterObjectSchema } from './NestedEnumTimelineSourceTypeFilter.schema'

const makeSchema = () => z.object({
  equals: TimelineSourceTypeSchema.optional(),
  in: TimelineSourceTypeSchema.array().optional(),
  notIn: TimelineSourceTypeSchema.array().optional(),
  not: z.union([TimelineSourceTypeSchema, z.lazy(() => NestedEnumTimelineSourceTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumTimelineSourceTypeFilterObjectSchema: z.ZodType<Prisma.EnumTimelineSourceTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTimelineSourceTypeFilter>;
export const EnumTimelineSourceTypeFilterObjectZodSchema = makeSchema();
