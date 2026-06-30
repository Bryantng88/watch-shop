import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TimelineSourceTypeSchema } from '../enums/TimelineSourceType.schema'

const nestedenumtimelinesourcetypefilterSchema = z.object({
  equals: TimelineSourceTypeSchema.optional(),
  in: TimelineSourceTypeSchema.array().optional(),
  notIn: TimelineSourceTypeSchema.array().optional(),
  not: z.union([TimelineSourceTypeSchema, z.lazy(() => NestedEnumTimelineSourceTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTimelineSourceTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumTimelineSourceTypeFilter> = nestedenumtimelinesourcetypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumTimelineSourceTypeFilter>;
export const NestedEnumTimelineSourceTypeFilterObjectZodSchema = nestedenumtimelinesourcetypefilterSchema;
