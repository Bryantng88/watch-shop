import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAssessmentsCreateManyInputObjectSchema as technicalAssessmentsCreateManyInputObjectSchema } from './objects/technicalAssessmentsCreateManyInput.schema';

export const technicalAssessmentsCreateManySchema: z.ZodType<Prisma.technicalAssessmentsCreateManyArgs> = z.object({ data: z.union([ technicalAssessmentsCreateManyInputObjectSchema, z.array(technicalAssessmentsCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.technicalAssessmentsCreateManyArgs>;

export const technicalAssessmentsCreateManyZodSchema = z.object({ data: z.union([ technicalAssessmentsCreateManyInputObjectSchema, z.array(technicalAssessmentsCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();