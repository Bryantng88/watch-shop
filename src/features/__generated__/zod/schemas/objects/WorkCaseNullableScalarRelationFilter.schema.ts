import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './WorkCaseWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => WorkCaseWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => WorkCaseWhereInputObjectSchema).optional().nullable()
}).strict();
export const WorkCaseNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.WorkCaseNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseNullableScalarRelationFilter>;
export const WorkCaseNullableScalarRelationFilterObjectZodSchema = makeSchema();
