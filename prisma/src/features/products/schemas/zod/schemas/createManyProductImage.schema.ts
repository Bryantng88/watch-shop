import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductImageCreateManyInputObjectSchema as ProductImageCreateManyInputObjectSchema } from './objects/ProductImageCreateManyInput.schema';

export const ProductImageCreateManySchema: z.ZodType<Prisma.ProductImageCreateManyArgs> = z.object({ data: z.union([ ProductImageCreateManyInputObjectSchema, z.array(ProductImageCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ProductImageCreateManyArgs>;

export const ProductImageCreateManyZodSchema = z.object({ data: z.union([ ProductImageCreateManyInputObjectSchema, z.array(ProductImageCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();