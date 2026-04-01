import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalAssessmentSelectObjectSchema as TechnicalAssessmentSelectObjectSchema } from './objects/TechnicalAssessmentSelect.schema';
import { TechnicalAssessmentIncludeObjectSchema as TechnicalAssessmentIncludeObjectSchema } from './objects/TechnicalAssessmentInclude.schema';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './objects/TechnicalAssessmentWhereUniqueInput.schema';

export const TechnicalAssessmentDeleteOneSchema: z.ZodType<Prisma.TechnicalAssessmentDeleteArgs> = z.object({ select: TechnicalAssessmentSelectObjectSchema.optional(), include: TechnicalAssessmentIncludeObjectSchema.optional(), where: TechnicalAssessmentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TechnicalAssessmentDeleteArgs>;

export const TechnicalAssessmentDeleteOneZodSchema = z.object({ select: TechnicalAssessmentSelectObjectSchema.optional(), include: TechnicalAssessmentIncludeObjectSchema.optional(), where: TechnicalAssessmentWhereUniqueInputObjectSchema }).strict();