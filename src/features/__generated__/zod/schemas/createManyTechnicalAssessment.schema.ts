import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalAssessmentCreateManyInputObjectSchema as TechnicalAssessmentCreateManyInputObjectSchema } from './objects/TechnicalAssessmentCreateManyInput.schema';

export const TechnicalAssessmentCreateManySchema: z.ZodType<Prisma.TechnicalAssessmentCreateManyArgs> = z.object({ data: z.union([ TechnicalAssessmentCreateManyInputObjectSchema, z.array(TechnicalAssessmentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalAssessmentCreateManyArgs>;

export const TechnicalAssessmentCreateManyZodSchema = z.object({ data: z.union([ TechnicalAssessmentCreateManyInputObjectSchema, z.array(TechnicalAssessmentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();