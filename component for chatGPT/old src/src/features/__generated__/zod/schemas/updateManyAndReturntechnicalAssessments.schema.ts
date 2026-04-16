import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAssessmentsSelectObjectSchema as technicalAssessmentsSelectObjectSchema } from './objects/technicalAssessmentsSelect.schema';
import { technicalAssessmentsUpdateManyMutationInputObjectSchema as technicalAssessmentsUpdateManyMutationInputObjectSchema } from './objects/technicalAssessmentsUpdateManyMutationInput.schema';
import { technicalAssessmentsWhereInputObjectSchema as technicalAssessmentsWhereInputObjectSchema } from './objects/technicalAssessmentsWhereInput.schema';

export const technicalAssessmentsUpdateManyAndReturnSchema: z.ZodType<Prisma.technicalAssessmentsUpdateManyAndReturnArgs> = z.object({ select: technicalAssessmentsSelectObjectSchema.optional(), data: technicalAssessmentsUpdateManyMutationInputObjectSchema, where: technicalAssessmentsWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.technicalAssessmentsUpdateManyAndReturnArgs>;

export const technicalAssessmentsUpdateManyAndReturnZodSchema = z.object({ select: technicalAssessmentsSelectObjectSchema.optional(), data: technicalAssessmentsUpdateManyMutationInputObjectSchema, where: technicalAssessmentsWhereInputObjectSchema.optional() }).strict();