import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAssessmentsSelectObjectSchema as technicalAssessmentsSelectObjectSchema } from './objects/technicalAssessmentsSelect.schema';
import { technicalAssessmentsIncludeObjectSchema as technicalAssessmentsIncludeObjectSchema } from './objects/technicalAssessmentsInclude.schema';
import { technicalAssessmentsCreateInputObjectSchema as technicalAssessmentsCreateInputObjectSchema } from './objects/technicalAssessmentsCreateInput.schema';
import { technicalAssessmentsUncheckedCreateInputObjectSchema as technicalAssessmentsUncheckedCreateInputObjectSchema } from './objects/technicalAssessmentsUncheckedCreateInput.schema';

export const technicalAssessmentsCreateOneSchema: z.ZodType<Prisma.technicalAssessmentsCreateArgs> = z.object({ select: technicalAssessmentsSelectObjectSchema.optional(), include: technicalAssessmentsIncludeObjectSchema.optional(), data: z.union([technicalAssessmentsCreateInputObjectSchema, technicalAssessmentsUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.technicalAssessmentsCreateArgs>;

export const technicalAssessmentsCreateOneZodSchema = z.object({ select: technicalAssessmentsSelectObjectSchema.optional(), include: technicalAssessmentsIncludeObjectSchema.optional(), data: z.union([technicalAssessmentsCreateInputObjectSchema, technicalAssessmentsUncheckedCreateInputObjectSchema]) }).strict();