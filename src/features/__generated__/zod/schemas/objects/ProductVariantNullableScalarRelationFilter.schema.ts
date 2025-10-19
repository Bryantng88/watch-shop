import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => ProductVariantWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => ProductVariantWhereInputObjectSchema).optional().nullable()
}).strict();
export const ProductVariantNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.ProductVariantNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantNullableScalarRelationFilter>;
export const ProductVariantNullableScalarRelationFilterObjectZodSchema = makeSchema();
