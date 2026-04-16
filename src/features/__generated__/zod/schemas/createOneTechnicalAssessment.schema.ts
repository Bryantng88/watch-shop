import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalAssessmentSelectObjectSchema as TechnicalAssessmentSelectObjectSchema } from './objects/TechnicalAssessmentSelect.schema';
import { TechnicalAssessmentIncludeObjectSchema as TechnicalAssessmentIncludeObjectSchema } from './objects/TechnicalAssessmentInclude.schema';
import { TechnicalAssessmentCreateInputObjectSchema as TechnicalAssessmentCreateInputObjectSchema } from './objects/TechnicalAssessmentCreateInput.schema';
import { TechnicalAssessmentUncheckedCreateInputObjectSchema as TechnicalAssessmentUncheckedCreateInputObjectSchema } from './objects/TechnicalAssessmentUncheckedCreateInput.schema';

export const TechnicalAssessmentCreateOneSchema: z.ZodType<Prisma.TechnicalAssessmentCreateArgs> = z.object({ select: TechnicalAssessmentSelectObjectSchema.optional(), include: TechnicalAssessmentIncludeObjectSchema.optional(), data: z.union([TechnicalAssessmentCreateInputObjectSchema, TechnicalAssessmentUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.TechnicalAssessmentCreateArgs>;

export const TechnicalAssessmentCreateOneZodSchema = z.object({ select: TechnicalAssessmentSelectObjectSchema.optional(), include: TechnicalAssessmentIncludeObjectSchema.optional(), data: z.union([TechnicalAssessmentCreateInputObjectSchema, TechnicalAssessmentUncheckedCreateInputObjectSchema]) }).strict();