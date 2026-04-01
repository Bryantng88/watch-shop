import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalAssessmentSelectObjectSchema as TechnicalAssessmentSelectObjectSchema } from './objects/TechnicalAssessmentSelect.schema';
import { TechnicalAssessmentCreateManyInputObjectSchema as TechnicalAssessmentCreateManyInputObjectSchema } from './objects/TechnicalAssessmentCreateManyInput.schema';

export const TechnicalAssessmentCreateManyAndReturnSchema: z.ZodType<Prisma.TechnicalAssessmentCreateManyAndReturnArgs> = z.object({ select: TechnicalAssessmentSelectObjectSchema.optional(), data: z.union([ TechnicalAssessmentCreateManyInputObjectSchema, z.array(TechnicalAssessmentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalAssessmentCreateManyAndReturnArgs>;

export const TechnicalAssessmentCreateManyAndReturnZodSchema = z.object({ select: TechnicalAssessmentSelectObjectSchema.optional(), data: z.union([ TechnicalAssessmentCreateManyInputObjectSchema, z.array(TechnicalAssessmentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();