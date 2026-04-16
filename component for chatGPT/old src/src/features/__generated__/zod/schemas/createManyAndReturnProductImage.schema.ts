import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductImageSelectObjectSchema as ProductImageSelectObjectSchema } from './objects/ProductImageSelect.schema';
import { ProductImageCreateManyInputObjectSchema as ProductImageCreateManyInputObjectSchema } from './objects/ProductImageCreateManyInput.schema';

export const ProductImageCreateManyAndReturnSchema: z.ZodType<Prisma.ProductImageCreateManyAndReturnArgs> = z.object({ select: ProductImageSelectObjectSchema.optional(), data: z.union([ ProductImageCreateManyInputObjectSchema, z.array(ProductImageCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ProductImageCreateManyAndReturnArgs>;

export const ProductImageCreateManyAndReturnZodSchema = z.object({ select: ProductImageSelectObjectSchema.optional(), data: z.union([ ProductImageCreateManyInputObjectSchema, z.array(ProductImageCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();