import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => ProductVariantWhereInputObjectSchema).optional(),
  some: z.lazy(() => ProductVariantWhereInputObjectSchema).optional(),
  none: z.lazy(() => ProductVariantWhereInputObjectSchema).optional()
}).strict();
export const ProductVariantListRelationFilterObjectSchema: z.ZodType<Prisma.ProductVariantListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ProductVariantListRelationFilter>;
export const ProductVariantListRelationFilterObjectZodSchema = makeSchema();
