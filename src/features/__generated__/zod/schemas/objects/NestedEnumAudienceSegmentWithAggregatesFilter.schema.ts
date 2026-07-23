import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AudienceSegmentSchema } from '../enums/AudienceSegment.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumAudienceSegmentFilterObjectSchema as NestedEnumAudienceSegmentFilterObjectSchema } from './NestedEnumAudienceSegmentFilter.schema'

const nestedenumaudiencesegmentwithaggregatesfilterSchema = z.object({
  equals: AudienceSegmentSchema.optional(),
  in: AudienceSegmentSchema.array().optional(),
  notIn: AudienceSegmentSchema.array().optional(),
  not: z.union([AudienceSegmentSchema, z.lazy(() => NestedEnumAudienceSegmentWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumAudienceSegmentFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumAudienceSegmentFilterObjectSchema).optional()
}).strict();
export const NestedEnumAudienceSegmentWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumAudienceSegmentWithAggregatesFilter> = nestedenumaudiencesegmentwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumAudienceSegmentWithAggregatesFilter>;
export const NestedEnumAudienceSegmentWithAggregatesFilterObjectZodSchema = nestedenumaudiencesegmentwithaggregatesfilterSchema;
