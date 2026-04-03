import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAssessmentsSelectObjectSchema as technicalAssessmentsSelectObjectSchema } from './objects/technicalAssessmentsSelect.schema';
import { technicalAssessmentsCreateManyInputObjectSchema as technicalAssessmentsCreateManyInputObjectSchema } from './objects/technicalAssessmentsCreateManyInput.schema';

export const technicalAssessmentsCreateManyAndReturnSchema: z.ZodType<Prisma.technicalAssessmentsCreateManyAndReturnArgs> = z.object({ select: technicalAssessmentsSelectObjectSchema.optional(), data: z.union([ technicalAssessmentsCreateManyInputObjectSchema, z.array(technicalAssessmentsCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.technicalAssessmentsCreateManyAndReturnArgs>;

export const technicalAssessmentsCreateManyAndReturnZodSchema = z.object({ select: technicalAssessmentsSelectObjectSchema.optional(), data: z.union([ technicalAssessmentsCreateManyInputObjectSchema, z.array(technicalAssessmentsCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();