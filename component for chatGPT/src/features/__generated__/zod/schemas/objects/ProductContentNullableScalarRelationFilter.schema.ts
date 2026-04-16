import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductContentWhereInputObjectSchema as ProductContentWhereInputObjectSchema } from './ProductContentWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => ProductContentWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => ProductContentWhereInputObjectSchema).optional().nullable()
}).strict();
export const ProductContentNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.ProductContentNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ProductContentNullableScalarRelationFilter>;
export const ProductContentNullableScalarRelationFilterObjectZodSchema = makeSchema();
