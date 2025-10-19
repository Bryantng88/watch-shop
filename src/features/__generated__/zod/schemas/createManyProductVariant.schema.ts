import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductVariantCreateManyInputObjectSchema as ProductVariantCreateManyInputObjectSchema } from './objects/ProductVariantCreateManyInput.schema';

export const ProductVariantCreateManySchema: z.ZodType<Prisma.ProductVariantCreateManyArgs> = z.object({ data: z.union([ ProductVariantCreateManyInputObjectSchema, z.array(ProductVariantCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ProductVariantCreateManyArgs>;

export const ProductVariantCreateManyZodSchema = z.object({ data: z.union([ ProductVariantCreateManyInputObjectSchema, z.array(ProductVariantCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();