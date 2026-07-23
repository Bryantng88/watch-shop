import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AudienceSegmentSchema } from '../enums/AudienceSegment.schema'

const nestedenumaudiencesegmentfilterSchema = z.object({
  equals: AudienceSegmentSchema.optional(),
  in: AudienceSegmentSchema.array().optional(),
  notIn: AudienceSegmentSchema.array().optional(),
  not: z.union([AudienceSegmentSchema, z.lazy(() => NestedEnumAudienceSegmentFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumAudienceSegmentFilterObjectSchema: z.ZodType<Prisma.NestedEnumAudienceSegmentFilter> = nestedenumaudiencesegmentfilterSchema as unknown as z.ZodType<Prisma.NestedEnumAudienceSegmentFilter>;
export const NestedEnumAudienceSegmentFilterObjectZodSchema = nestedenumaudiencesegmentfilterSchema;
