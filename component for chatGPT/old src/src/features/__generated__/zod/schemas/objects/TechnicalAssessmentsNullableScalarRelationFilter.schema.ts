import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAssessmentsWhereInputObjectSchema as technicalAssessmentsWhereInputObjectSchema } from './technicalAssessmentsWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => technicalAssessmentsWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => technicalAssessmentsWhereInputObjectSchema).optional().nullable()
}).strict();
export const TechnicalAssessmentsNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.TechnicalAssessmentsNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentsNullableScalarRelationFilter>;
export const TechnicalAssessmentsNullableScalarRelationFilterObjectZodSchema = makeSchema();
