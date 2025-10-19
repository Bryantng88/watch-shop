import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductVariantSelectObjectSchema as ProductVariantSelectObjectSchema } from './objects/ProductVariantSelect.schema';
import { ProductVariantCreateManyInputObjectSchema as ProductVariantCreateManyInputObjectSchema } from './objects/ProductVariantCreateManyInput.schema';

export const ProductVariantCreateManyAndReturnSchema: z.ZodType<Prisma.ProductVariantCreateManyAndReturnArgs> = z.object({ select: ProductVariantSelectObjectSchema.optional(), data: z.union([ ProductVariantCreateManyInputObjectSchema, z.array(ProductVariantCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ProductVariantCreateManyAndReturnArgs>;

export const ProductVariantCreateManyAndReturnZodSchema = z.object({ select: ProductVariantSelectObjectSchema.optional(), data: z.union([ ProductVariantCreateManyInputObjectSchema, z.array(ProductVariantCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();