import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalAssessmentSelectObjectSchema as TechnicalAssessmentSelectObjectSchema } from './objects/TechnicalAssessmentSelect.schema';
import { TechnicalAssessmentIncludeObjectSchema as TechnicalAssessmentIncludeObjectSchema } from './objects/TechnicalAssessmentInclude.schema';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './objects/TechnicalAssessmentWhereUniqueInput.schema';

export const TechnicalAssessmentFindUniqueSchema: z.ZodType<Prisma.TechnicalAssessmentFindUniqueArgs> = z.object({ select: TechnicalAssessmentSelectObjectSchema.optional(), include: TechnicalAssessmentIncludeObjectSchema.optional(), where: TechnicalAssessmentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TechnicalAssessmentFindUniqueArgs>;

export const TechnicalAssessmentFindUniqueZodSchema = z.object({ select: TechnicalAssessmentSelectObjectSchema.optional(), include: TechnicalAssessmentIncludeObjectSchema.optional(), where: TechnicalAssessmentWhereUniqueInputObjectSchema }).strict();