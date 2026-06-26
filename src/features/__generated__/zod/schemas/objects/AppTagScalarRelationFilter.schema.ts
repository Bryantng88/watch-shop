import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagWhereInputObjectSchema as AppTagWhereInputObjectSchema } from './AppTagWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => AppTagWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => AppTagWhereInputObjectSchema).optional()
}).strict();
export const AppTagScalarRelationFilterObjectSchema: z.ZodType<Prisma.AppTagScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.AppTagScalarRelationFilter>;
export const AppTagScalarRelationFilterObjectZodSchema = makeSchema();
