import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './WorkCaseWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => WorkCaseWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => WorkCaseWhereInputObjectSchema).optional()
}).strict();
export const WorkCaseScalarRelationFilterObjectSchema: z.ZodType<Prisma.WorkCaseScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseScalarRelationFilter>;
export const WorkCaseScalarRelationFilterObjectZodSchema = makeSchema();
