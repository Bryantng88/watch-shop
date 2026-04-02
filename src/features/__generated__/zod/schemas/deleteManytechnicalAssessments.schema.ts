import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAssessmentsWhereInputObjectSchema as technicalAssessmentsWhereInputObjectSchema } from './objects/technicalAssessmentsWhereInput.schema';

export const technicalAssessmentsDeleteManySchema: z.ZodType<Prisma.technicalAssessmentsDeleteManyArgs> = z.object({ where: technicalAssessmentsWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.technicalAssessmentsDeleteManyArgs>;

export const technicalAssessmentsDeleteManyZodSchema = z.object({ where: technicalAssessmentsWhereInputObjectSchema.optional() }).strict();