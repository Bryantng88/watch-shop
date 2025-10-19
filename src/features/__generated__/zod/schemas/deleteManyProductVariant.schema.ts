import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './objects/ProductVariantWhereInput.schema';

export const ProductVariantDeleteManySchema: z.ZodType<Prisma.ProductVariantDeleteManyArgs> = z.object({ where: ProductVariantWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductVariantDeleteManyArgs>;

export const ProductVariantDeleteManyZodSchema = z.object({ where: ProductVariantWhereInputObjectSchema.optional() }).strict();