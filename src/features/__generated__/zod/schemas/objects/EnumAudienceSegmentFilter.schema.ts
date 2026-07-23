import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AudienceSegmentSchema } from '../enums/AudienceSegment.schema';
import { NestedEnumAudienceSegmentFilterObjectSchema as NestedEnumAudienceSegmentFilterObjectSchema } from './NestedEnumAudienceSegmentFilter.schema'

const makeSchema = () => z.object({
  equals: AudienceSegmentSchema.optional(),
  in: AudienceSegmentSchema.array().optional(),
  notIn: AudienceSegmentSchema.array().optional(),
  not: z.union([AudienceSegmentSchema, z.lazy(() => NestedEnumAudienceSegmentFilterObjectSchema)]).optional()
}).strict();
export const EnumAudienceSegmentFilterObjectSchema: z.ZodType<Prisma.EnumAudienceSegmentFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumAudienceSegmentFilter>;
export const EnumAudienceSegmentFilterObjectZodSchema = makeSchema();
