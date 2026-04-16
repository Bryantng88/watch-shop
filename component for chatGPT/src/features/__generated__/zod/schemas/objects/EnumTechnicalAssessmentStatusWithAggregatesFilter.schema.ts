import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentStatusSchema } from '../enums/TechnicalAssessmentStatus.schema';
import { NestedEnumTechnicalAssessmentStatusWithAggregatesFilterObjectSchema as NestedEnumTechnicalAssessmentStatusWithAggregatesFilterObjectSchema } from './NestedEnumTechnicalAssessmentStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumTechnicalAssessmentStatusFilterObjectSchema as NestedEnumTechnicalAssessmentStatusFilterObjectSchema } from './NestedEnumTechnicalAssessmentStatusFilter.schema'

const makeSchema = () => z.object({
  equals: TechnicalAssessmentStatusSchema.optional(),
  in: TechnicalAssessmentStatusSchema.array().optional(),
  notIn: TechnicalAssessmentStatusSchema.array().optional(),
  not: z.union([TechnicalAssessmentStatusSchema, z.lazy(() => NestedEnumTechnicalAssessmentStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumTechnicalAssessmentStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumTechnicalAssessmentStatusFilterObjectSchema).optional()
}).strict();
export const EnumTechnicalAssessmentStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumTechnicalAssessmentStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalAssessmentStatusWithAggregatesFilter>;
export const EnumTechnicalAssessmentStatusWithAggregatesFilterObjectZodSchema = makeSchema();
