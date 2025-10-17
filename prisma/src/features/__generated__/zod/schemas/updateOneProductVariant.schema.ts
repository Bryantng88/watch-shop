import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductVariantSelectObjectSchema as ProductVariantSelectObjectSchema } from './objects/ProductVariantSelect.schema';
import { ProductVariantIncludeObjectSchema as ProductVariantIncludeObjectSchema } from './objects/ProductVariantInclude.schema';
import { ProductVariantUpdateInputObjectSchema as ProductVariantUpdateInputObjectSchema } from './objects/ProductVariantUpdateInput.schema';
import { ProductVariantUncheckedUpdateInputObjectSchema as ProductVariantUncheckedUpdateInputObjectSchema } from './objects/ProductVariantUncheckedUpdateInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './objects/ProductVariantWhereUniqueInput.schema';

export const ProductVariantUpdateOneSchema: z.ZodType<Prisma.ProductVariantUpdateArgs> = z.object({ select: ProductVariantSelectObjectSchema.optional(), include: ProductVariantIncludeObjectSchema.optional(), data: z.union([ProductVariantUpdateInputObjectSchema, ProductVariantUncheckedUpdateInputObjectSchema]), where: ProductVariantWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProductVariantUpdateArgs>;

export const ProductVariantUpdateOneZodSchema = z.object({ select: ProductVariantSelectObjectSchema.optional(), include: ProductVariantIncludeObjectSchema.optional(), data: z.union([ProductVariantUpdateInputObjectSchema, ProductVariantUncheckedUpdateInputObjectSchema]), where: ProductVariantWhereUniqueInputObjectSchema }).strict();