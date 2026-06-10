import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseCategoryWhereInputObjectSchema as WorkCaseCategoryWhereInputObjectSchema } from './WorkCaseCategoryWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => WorkCaseCategoryWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => WorkCaseCategoryWhereInputObjectSchema).optional().nullable()
}).strict();
export const WorkCaseCategoryNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.WorkCaseCategoryNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryNullableScalarRelationFilter>;
export const WorkCaseCategoryNullableScalarRelationFilterObjectZodSchema = makeSchema();
