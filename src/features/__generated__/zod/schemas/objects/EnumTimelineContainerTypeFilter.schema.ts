import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TimelineContainerTypeSchema } from '../enums/TimelineContainerType.schema';
import { NestedEnumTimelineContainerTypeFilterObjectSchema as NestedEnumTimelineContainerTypeFilterObjectSchema } from './NestedEnumTimelineContainerTypeFilter.schema'

const makeSchema = () => z.object({
  equals: TimelineContainerTypeSchema.optional(),
  in: TimelineContainerTypeSchema.array().optional(),
  notIn: TimelineContainerTypeSchema.array().optional(),
  not: z.union([TimelineContainerTypeSchema, z.lazy(() => NestedEnumTimelineContainerTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumTimelineContainerTypeFilterObjectSchema: z.ZodType<Prisma.EnumTimelineContainerTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTimelineContainerTypeFilter>;
export const EnumTimelineContainerTypeFilterObjectZodSchema = makeSchema();
