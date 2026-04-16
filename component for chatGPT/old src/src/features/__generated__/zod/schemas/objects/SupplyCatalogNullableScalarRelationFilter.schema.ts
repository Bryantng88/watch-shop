import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SupplyCatalogWhereInputObjectSchema as SupplyCatalogWhereInputObjectSchema } from './SupplyCatalogWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => SupplyCatalogWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => SupplyCatalogWhereInputObjectSchema).optional().nullable()
}).strict();
export const SupplyCatalogNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.SupplyCatalogNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogNullableScalarRelationFilter>;
export const SupplyCatalogNullableScalarRelationFilterObjectZodSchema = makeSchema();
