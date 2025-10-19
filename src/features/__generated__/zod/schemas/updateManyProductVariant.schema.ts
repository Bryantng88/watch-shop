import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductVariantUpdateManyMutationInputObjectSchema as ProductVariantUpdateManyMutationInputObjectSchema } from './objects/ProductVariantUpdateManyMutationInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './objects/ProductVariantWhereInput.schema';

export const ProductVariantUpdateManySchema: z.ZodType<Prisma.ProductVariantUpdateManyArgs> = z.object({ data: ProductVariantUpdateManyMutationInputObjectSchema, where: ProductVariantWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductVariantUpdateManyArgs>;

export const ProductVariantUpdateManyZodSchema = z.object({ data: ProductVariantUpdateManyMutationInputObjectSchema, where: ProductVariantWhereInputObjectSchema.optional() }).strict();