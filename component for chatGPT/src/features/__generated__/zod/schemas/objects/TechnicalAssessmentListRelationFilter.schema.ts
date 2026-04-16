import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentWhereInputObjectSchema as TechnicalAssessmentWhereInputObjectSchema } from './TechnicalAssessmentWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => TechnicalAssessmentWhereInputObjectSchema).optional(),
  some: z.lazy(() => TechnicalAssessmentWhereInputObjectSchema).optional(),
  none: z.lazy(() => TechnicalAssessmentWhereInputObjectSchema).optional()
}).strict();
export const TechnicalAssessmentListRelationFilterObjectSchema: z.ZodType<Prisma.TechnicalAssessmentListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentListRelationFilter>;
export const TechnicalAssessmentListRelationFilterObjectZodSchema = makeSchema();
