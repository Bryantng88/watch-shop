import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalAssessmentSelectObjectSchema as TechnicalAssessmentSelectObjectSchema } from './objects/TechnicalAssessmentSelect.schema';
import { TechnicalAssessmentIncludeObjectSchema as TechnicalAssessmentIncludeObjectSchema } from './objects/TechnicalAssessmentInclude.schema';
import { TechnicalAssessmentUpdateInputObjectSchema as TechnicalAssessmentUpdateInputObjectSchema } from './objects/TechnicalAssessmentUpdateInput.schema';
import { TechnicalAssessmentUncheckedUpdateInputObjectSchema as TechnicalAssessmentUncheckedUpdateInputObjectSchema } from './objects/TechnicalAssessmentUncheckedUpdateInput.schema';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './objects/TechnicalAssessmentWhereUniqueInput.schema';

export const TechnicalAssessmentUpdateOneSchema: z.ZodType<Prisma.TechnicalAssessmentUpdateArgs> = z.object({ select: TechnicalAssessmentSelectObjectSchema.optional(), include: TechnicalAssessmentIncludeObjectSchema.optional(), data: z.union([TechnicalAssessmentUpdateInputObjectSchema, TechnicalAssessmentUncheckedUpdateInputObjectSchema]), where: TechnicalAssessmentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.TechnicalAssessmentUpdateArgs>;

export const TechnicalAssessmentUpdateOneZodSchema = z.object({ select: TechnicalAssessmentSelectObjectSchema.optional(), include: TechnicalAssessmentIncludeObjectSchema.optional(), data: z.union([TechnicalAssessmentUpdateInputObjectSchema, TechnicalAssessmentUncheckedUpdateInputObjectSchema]), where: TechnicalAssessmentWhereUniqueInputObjectSchema }).strict();