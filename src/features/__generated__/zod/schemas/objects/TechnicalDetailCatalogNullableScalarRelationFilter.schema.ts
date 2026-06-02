import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalDetailCatalogWhereInputObjectSchema as TechnicalDetailCatalogWhereInputObjectSchema } from './TechnicalDetailCatalogWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema).optional().nullable()
}).strict();
export const TechnicalDetailCatalogNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogNullableScalarRelationFilter>;
export const TechnicalDetailCatalogNullableScalarRelationFilterObjectZodSchema = makeSchema();
