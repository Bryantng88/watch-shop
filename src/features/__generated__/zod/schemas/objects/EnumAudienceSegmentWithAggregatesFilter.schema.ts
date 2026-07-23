import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AudienceSegmentSchema } from '../enums/AudienceSegment.schema';
import { NestedEnumAudienceSegmentWithAggregatesFilterObjectSchema as NestedEnumAudienceSegmentWithAggregatesFilterObjectSchema } from './NestedEnumAudienceSegmentWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumAudienceSegmentFilterObjectSchema as NestedEnumAudienceSegmentFilterObjectSchema } from './NestedEnumAudienceSegmentFilter.schema'

const makeSchema = () => z.object({
  equals: AudienceSegmentSchema.optional(),
  in: AudienceSegmentSchema.array().optional(),
  notIn: AudienceSegmentSchema.array().optional(),
  not: z.union([AudienceSegmentSchema, z.lazy(() => NestedEnumAudienceSegmentWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumAudienceSegmentFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumAudienceSegmentFilterObjectSchema).optional()
}).strict();
export const EnumAudienceSegmentWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumAudienceSegmentWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumAudienceSegmentWithAggregatesFilter>;
export const EnumAudienceSegmentWithAggregatesFilterObjectZodSchema = makeSchema();
