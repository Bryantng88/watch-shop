import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentStatusSchema } from '../enums/TechnicalAssessmentStatus.schema';
import { NestedEnumTechnicalAssessmentStatusFilterObjectSchema as NestedEnumTechnicalAssessmentStatusFilterObjectSchema } from './NestedEnumTechnicalAssessmentStatusFilter.schema'

const makeSchema = () => z.object({
  equals: TechnicalAssessmentStatusSchema.optional(),
  in: TechnicalAssessmentStatusSchema.array().optional(),
  notIn: TechnicalAssessmentStatusSchema.array().optional(),
  not: z.union([TechnicalAssessmentStatusSchema, z.lazy(() => NestedEnumTechnicalAssessmentStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumTechnicalAssessmentStatusFilterObjectSchema: z.ZodType<Prisma.EnumTechnicalAssessmentStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumTechnicalAssessmentStatusFilter>;
export const EnumTechnicalAssessmentStatusFilterObjectZodSchema = makeSchema();
