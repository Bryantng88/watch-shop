import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => ProductVariantWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => ProductVariantWhereInputObjectSchema).optional()
}).strict();
export const ProductVariantScalarRelationFilterObjectSchema: z.ZodType<Prisma.ProductVariantScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantScalarRelationFilter>;
export const ProductVariantScalarRelationFilterObjectZodSchema = makeSchema();
