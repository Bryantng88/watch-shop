import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAssessmentsUpdateManyMutationInputObjectSchema as technicalAssessmentsUpdateManyMutationInputObjectSchema } from './objects/technicalAssessmentsUpdateManyMutationInput.schema';
import { technicalAssessmentsWhereInputObjectSchema as technicalAssessmentsWhereInputObjectSchema } from './objects/technicalAssessmentsWhereInput.schema';

export const technicalAssessmentsUpdateManySchema: z.ZodType<Prisma.technicalAssessmentsUpdateManyArgs> = z.object({ data: technicalAssessmentsUpdateManyMutationInputObjectSchema, where: technicalAssessmentsWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.technicalAssessmentsUpdateManyArgs>;

export const technicalAssessmentsUpdateManyZodSchema = z.object({ data: technicalAssessmentsUpdateManyMutationInputObjectSchema, where: technicalAssessmentsWhereInputObjectSchema.optional() }).strict();