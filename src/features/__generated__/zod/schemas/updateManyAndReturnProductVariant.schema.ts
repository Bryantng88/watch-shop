import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductVariantSelectObjectSchema as ProductVariantSelectObjectSchema } from './objects/ProductVariantSelect.schema';
import { ProductVariantUpdateManyMutationInputObjectSchema as ProductVariantUpdateManyMutationInputObjectSchema } from './objects/ProductVariantUpdateManyMutationInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './objects/ProductVariantWhereInput.schema';

export const ProductVariantUpdateManyAndReturnSchema: z.ZodType<Prisma.ProductVariantUpdateManyAndReturnArgs> = z.object({ select: ProductVariantSelectObjectSchema.optional(), data: ProductVariantUpdateManyMutationInputObjectSchema, where: ProductVariantWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductVariantUpdateManyAndReturnArgs>;

export const ProductVariantUpdateManyAndReturnZodSchema = z.object({ select: ProductVariantSelectObjectSchema.optional(), data: ProductVariantUpdateManyMutationInputObjectSchema, where: ProductVariantWhereInputObjectSchema.optional() }).strict();