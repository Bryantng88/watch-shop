import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => ProductWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => ProductWhereInputObjectSchema).optional().nullable()
}).strict();
export const ProductNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.ProductNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ProductNullableScalarRelationFilter>;
export const ProductNullableScalarRelationFilterObjectZodSchema = makeSchema();
