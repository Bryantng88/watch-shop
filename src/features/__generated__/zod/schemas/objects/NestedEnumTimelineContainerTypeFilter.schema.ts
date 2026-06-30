import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TimelineContainerTypeSchema } from '../enums/TimelineContainerType.schema'

const nestedenumtimelinecontainertypefilterSchema = z.object({
  equals: TimelineContainerTypeSchema.optional(),
  in: TimelineContainerTypeSchema.array().optional(),
  notIn: TimelineContainerTypeSchema.array().optional(),
  not: z.union([TimelineContainerTypeSchema, z.lazy(() => NestedEnumTimelineContainerTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTimelineContainerTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumTimelineContainerTypeFilter> = nestedenumtimelinecontainertypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumTimelineContainerTypeFilter>;
export const NestedEnumTimelineContainerTypeFilterObjectZodSchema = nestedenumtimelinecontainertypefilterSchema;
