import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentStatusSchema } from '../enums/TechnicalAssessmentStatus.schema'

const nestedenumtechnicalassessmentstatusfilterSchema = z.object({
  equals: TechnicalAssessmentStatusSchema.optional(),
  in: TechnicalAssessmentStatusSchema.array().optional(),
  notIn: TechnicalAssessmentStatusSchema.array().optional(),
  not: z.union([TechnicalAssessmentStatusSchema, z.lazy(() => NestedEnumTechnicalAssessmentStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumTechnicalAssessmentStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumTechnicalAssessmentStatusFilter> = nestedenumtechnicalassessmentstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumTechnicalAssessmentStatusFilter>;
export const NestedEnumTechnicalAssessmentStatusFilterObjectZodSchema = nestedenumtechnicalassessmentstatusfilterSchema;
