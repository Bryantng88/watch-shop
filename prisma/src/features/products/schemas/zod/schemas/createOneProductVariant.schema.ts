import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductVariantSelectObjectSchema as ProductVariantSelectObjectSchema } from './objects/ProductVariantSelect.schema';
import { ProductVariantIncludeObjectSchema as ProductVariantIncludeObjectSchema } from './objects/ProductVariantInclude.schema';
import { ProductVariantCreateInputObjectSchema as ProductVariantCreateInputObjectSchema } from './objects/ProductVariantCreateInput.schema';
import { ProductVariantUncheckedCreateInputObjectSchema as ProductVariantUncheckedCreateInputObjectSchema } from './objects/ProductVariantUncheckedCreateInput.schema';

export const ProductVariantCreateOneSchema: z.ZodType<Prisma.ProductVariantCreateArgs> = z.object({ select: ProductVariantSelectObjectSchema.optional(), include: ProductVariantIncludeObjectSchema.optional(), data: z.union([ProductVariantCreateInputObjectSchema, ProductVariantUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ProductVariantCreateArgs>;

export const ProductVariantCreateOneZodSchema = z.object({ select: ProductVariantSelectObjectSchema.optional(), include: ProductVariantIncludeObjectSchema.optional(), data: z.union([ProductVariantCreateInputObjectSchema, ProductVariantUncheckedCreateInputObjectSchema]) }).strict();