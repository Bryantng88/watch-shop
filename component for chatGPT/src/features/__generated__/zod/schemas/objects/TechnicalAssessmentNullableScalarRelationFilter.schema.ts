import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentWhereInputObjectSchema as TechnicalAssessmentWhereInputObjectSchema } from './TechnicalAssessmentWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => TechnicalAssessmentWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => TechnicalAssessmentWhereInputObjectSchema).optional().nullable()
}).strict();
export const TechnicalAssessmentNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.TechnicalAssessmentNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentNullableScalarRelationFilter>;
export const TechnicalAssessmentNullableScalarRelationFilterObjectZodSchema = makeSchema();
