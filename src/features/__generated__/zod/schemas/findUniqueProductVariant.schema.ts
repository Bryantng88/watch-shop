import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductVariantSelectObjectSchema as ProductVariantSelectObjectSchema } from './objects/ProductVariantSelect.schema';
import { ProductVariantIncludeObjectSchema as ProductVariantIncludeObjectSchema } from './objects/ProductVariantInclude.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './objects/ProductVariantWhereUniqueInput.schema';

export const ProductVariantFindUniqueSchema: z.ZodType<Prisma.ProductVariantFindUniqueArgs> = z.object({ select: ProductVariantSelectObjectSchema.optional(), include: ProductVariantIncludeObjectSchema.optional(), where: ProductVariantWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProductVariantFindUniqueArgs>;

export const ProductVariantFindUniqueZodSchema = z.object({ select: ProductVariantSelectObjectSchema.optional(), include: ProductVariantIncludeObjectSchema.optional(), where: ProductVariantWhereUniqueInputObjectSchema }).strict();