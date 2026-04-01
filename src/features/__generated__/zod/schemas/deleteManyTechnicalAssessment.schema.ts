import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalAssessmentWhereInputObjectSchema as TechnicalAssessmentWhereInputObjectSchema } from './objects/TechnicalAssessmentWhereInput.schema';

export const TechnicalAssessmentDeleteManySchema: z.ZodType<Prisma.TechnicalAssessmentDeleteManyArgs> = z.object({ where: TechnicalAssessmentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalAssessmentDeleteManyArgs>;

export const TechnicalAssessmentDeleteManyZodSchema = z.object({ where: TechnicalAssessmentWhereInputObjectSchema.optional() }).strict();