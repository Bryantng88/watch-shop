import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentWhereInputObjectSchema as TechnicalAssessmentWhereInputObjectSchema } from './TechnicalAssessmentWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => TechnicalAssessmentWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => TechnicalAssessmentWhereInputObjectSchema).optional()
}).strict();
export const TechnicalAssessmentScalarRelationFilterObjectSchema: z.ZodType<Prisma.TechnicalAssessmentScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentScalarRelationFilter>;
export const TechnicalAssessmentScalarRelationFilterObjectZodSchema = makeSchema();
