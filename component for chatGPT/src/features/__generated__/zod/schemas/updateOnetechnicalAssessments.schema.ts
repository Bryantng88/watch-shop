import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAssessmentsSelectObjectSchema as technicalAssessmentsSelectObjectSchema } from './objects/technicalAssessmentsSelect.schema';
import { technicalAssessmentsIncludeObjectSchema as technicalAssessmentsIncludeObjectSchema } from './objects/technicalAssessmentsInclude.schema';
import { technicalAssessmentsUpdateInputObjectSchema as technicalAssessmentsUpdateInputObjectSchema } from './objects/technicalAssessmentsUpdateInput.schema';
import { technicalAssessmentsUncheckedUpdateInputObjectSchema as technicalAssessmentsUncheckedUpdateInputObjectSchema } from './objects/technicalAssessmentsUncheckedUpdateInput.schema';
import { technicalAssessmentsWhereUniqueInputObjectSchema as technicalAssessmentsWhereUniqueInputObjectSchema } from './objects/technicalAssessmentsWhereUniqueInput.schema';

export const technicalAssessmentsUpdateOneSchema: z.ZodType<Prisma.technicalAssessmentsUpdateArgs> = z.object({ select: technicalAssessmentsSelectObjectSchema.optional(), include: technicalAssessmentsIncludeObjectSchema.optional(), data: z.union([technicalAssessmentsUpdateInputObjectSchema, technicalAssessmentsUncheckedUpdateInputObjectSchema]), where: technicalAssessmentsWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.technicalAssessmentsUpdateArgs>;

export const technicalAssessmentsUpdateOneZodSchema = z.object({ select: technicalAssessmentsSelectObjectSchema.optional(), include: technicalAssessmentsIncludeObjectSchema.optional(), data: z.union([technicalAssessmentsUpdateInputObjectSchema, technicalAssessmentsUncheckedUpdateInputObjectSchema]), where: technicalAssessmentsWhereUniqueInputObjectSchema }).strict();