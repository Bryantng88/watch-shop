import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalAssessmentSelectObjectSchema as TechnicalAssessmentSelectObjectSchema } from './objects/TechnicalAssessmentSelect.schema';
import { TechnicalAssessmentUpdateManyMutationInputObjectSchema as TechnicalAssessmentUpdateManyMutationInputObjectSchema } from './objects/TechnicalAssessmentUpdateManyMutationInput.schema';
import { TechnicalAssessmentWhereInputObjectSchema as TechnicalAssessmentWhereInputObjectSchema } from './objects/TechnicalAssessmentWhereInput.schema';

export const TechnicalAssessmentUpdateManyAndReturnSchema: z.ZodType<Prisma.TechnicalAssessmentUpdateManyAndReturnArgs> = z.object({ select: TechnicalAssessmentSelectObjectSchema.optional(), data: TechnicalAssessmentUpdateManyMutationInputObjectSchema, where: TechnicalAssessmentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalAssessmentUpdateManyAndReturnArgs>;

export const TechnicalAssessmentUpdateManyAndReturnZodSchema = z.object({ select: TechnicalAssessmentSelectObjectSchema.optional(), data: TechnicalAssessmentUpdateManyMutationInputObjectSchema, where: TechnicalAssessmentWhereInputObjectSchema.optional() }).strict();