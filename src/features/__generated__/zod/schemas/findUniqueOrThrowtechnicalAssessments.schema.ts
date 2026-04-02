import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAssessmentsSelectObjectSchema as technicalAssessmentsSelectObjectSchema } from './objects/technicalAssessmentsSelect.schema';
import { technicalAssessmentsIncludeObjectSchema as technicalAssessmentsIncludeObjectSchema } from './objects/technicalAssessmentsInclude.schema';
import { technicalAssessmentsWhereUniqueInputObjectSchema as technicalAssessmentsWhereUniqueInputObjectSchema } from './objects/technicalAssessmentsWhereUniqueInput.schema';

export const technicalAssessmentsFindUniqueOrThrowSchema: z.ZodType<Prisma.technicalAssessmentsFindUniqueOrThrowArgs> = z.object({ select: technicalAssessmentsSelectObjectSchema.optional(), include: technicalAssessmentsIncludeObjectSchema.optional(), where: technicalAssessmentsWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.technicalAssessmentsFindUniqueOrThrowArgs>;

export const technicalAssessmentsFindUniqueOrThrowZodSchema = z.object({ select: technicalAssessmentsSelectObjectSchema.optional(), include: technicalAssessmentsIncludeObjectSchema.optional(), where: technicalAssessmentsWhereUniqueInputObjectSchema }).strict();