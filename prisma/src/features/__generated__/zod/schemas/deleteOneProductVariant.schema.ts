import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductVariantSelectObjectSchema as ProductVariantSelectObjectSchema } from './objects/ProductVariantSelect.schema';
import { ProductVariantIncludeObjectSchema as ProductVariantIncludeObjectSchema } from './objects/ProductVariantInclude.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './objects/ProductVariantWhereUniqueInput.schema';

export const ProductVariantDeleteOneSchema: z.ZodType<Prisma.ProductVariantDeleteArgs> = z.object({ select: ProductVariantSelectObjectSchema.optional(), include: ProductVariantIncludeObjectSchema.optional(), where: ProductVariantWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProductVariantDeleteArgs>;

export const ProductVariantDeleteOneZodSchema = z.object({ select: ProductVariantSelectObjectSchema.optional(), include: ProductVariantIncludeObjectSchema.optional(), where: ProductVariantWhereUniqueInputObjectSchema }).strict();