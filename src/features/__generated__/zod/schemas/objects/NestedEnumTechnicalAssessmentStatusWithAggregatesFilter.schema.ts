import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentStatusSchema } from '../enums/TechnicalAssessmentStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTechnicalAssessmentStatusFilterObjectSchema as NestedEnumTechnicalAssessmentStatusFilterObjectSchema } from './NestedEnumTechnicalAssessmentStatusFilter.schema'

const nestedenumtechnicalassessmentstatuswithaggregatesfilterSchema = z.object({
  equals: TechnicalAssessmentStatusSchema.optional(),
  in: TechnicalAssessmentStatusSchema.array().optional(),
  notIn: TechnicalAssessmentStatusSchema.array().optional(),
  not: z.union([TechnicalAssessmentStatusSchema, z.lazy(() => NestedEnumTechnicalAssessmentStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTechnicalAssessmentStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTechnicalAssessmentStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumTechnicalAssessmentStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumTechnicalAssessmentStatusWithAggregatesFilter> = nestedenumtechnicalassessmentstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTechnicalAssessmentStatusWithAggregatesFilter>;
export const NestedEnumTechnicalAssessmentStatusWithAggregatesFilterObjectZodSchema = nestedenumtechnicalassessmentstatuswithaggregatesfilterSchema;
