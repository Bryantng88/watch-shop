import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalAssessmentUpdateManyMutationInputObjectSchema as TechnicalAssessmentUpdateManyMutationInputObjectSchema } from './objects/TechnicalAssessmentUpdateManyMutationInput.schema';
import { TechnicalAssessmentWhereInputObjectSchema as TechnicalAssessmentWhereInputObjectSchema } from './objects/TechnicalAssessmentWhereInput.schema';

export const TechnicalAssessmentUpdateManySchema: z.ZodType<Prisma.TechnicalAssessmentUpdateManyArgs> = z.object({ data: TechnicalAssessmentUpdateManyMutationInputObjectSchema, where: TechnicalAssessmentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalAssessmentUpdateManyArgs>;

export const TechnicalAssessmentUpdateManyZodSchema = z.object({ data: TechnicalAssessmentUpdateManyMutationInputObjectSchema, where: TechnicalAssessmentWhereInputObjectSchema.optional() }).strict();