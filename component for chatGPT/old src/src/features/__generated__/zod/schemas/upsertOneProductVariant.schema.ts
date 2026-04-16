import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductVariantSelectObjectSchema as ProductVariantSelectObjectSchema } from './objects/ProductVariantSelect.schema';
import { ProductVariantIncludeObjectSchema as ProductVariantIncludeObjectSchema } from './objects/ProductVariantInclude.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './objects/ProductVariantWhereUniqueInput.schema';
import { ProductVariantCreateInputObjectSchema as ProductVariantCreateInputObjectSchema } from './objects/ProductVariantCreateInput.schema';
import { ProductVariantUncheckedCreateInputObjectSchema as ProductVariantUncheckedCreateInputObjectSchema } from './objects/ProductVariantUncheckedCreateInput.schema';
import { ProductVariantUpdateInputObjectSchema as ProductVariantUpdateInputObjectSchema } from './objects/ProductVariantUpdateInput.schema';
import { ProductVariantUncheckedUpdateInputObjectSchema as ProductVariantUncheckedUpdateInputObjectSchema } from './objects/ProductVariantUncheckedUpdateInput.schema';

export const ProductVariantUpsertOneSchema: z.ZodType<Prisma.ProductVariantUpsertArgs> = z.object({ select: ProductVariantSelectObjectSchema.optional(), include: ProductVariantIncludeObjectSchema.optional(), where: ProductVariantWhereUniqueInputObjectSchema, create: z.union([ ProductVariantCreateInputObjectSchema, ProductVariantUncheckedCreateInputObjectSchema ]), update: z.union([ ProductVariantUpdateInputObjectSchema, ProductVariantUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ProductVariantUpsertArgs>;

export const ProductVariantUpsertOneZodSchema = z.object({ select: ProductVariantSelectObjectSchema.optional(), include: ProductVariantIncludeObjectSchema.optional(), where: ProductVariantWhereUniqueInputObjectSchema, create: z.union([ ProductVariantCreateInputObjectSchema, ProductVariantUncheckedCreateInputObjectSchema ]), update: z.union([ ProductVariantUpdateInputObjectSchema, ProductVariantUncheckedUpdateInputObjectSchema ]) }).strict();