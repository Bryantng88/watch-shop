import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductContentSelectObjectSchema as ProductContentSelectObjectSchema } from './objects/ProductContentSelect.schema';
import { ProductContentCreateManyInputObjectSchema as ProductContentCreateManyInputObjectSchema } from './objects/ProductContentCreateManyInput.schema';

export const ProductContentCreateManyAndReturnSchema: z.ZodType<Prisma.ProductContentCreateManyAndReturnArgs> = z.object({ select: ProductContentSelectObjectSchema.optional(), data: z.union([ ProductContentCreateManyInputObjectSchema, z.array(ProductContentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ProductContentCreateManyAndReturnArgs>;

export const ProductContentCreateManyAndReturnZodSchema = z.object({ select: ProductContentSelectObjectSchema.optional(), data: z.union([ ProductContentCreateManyInputObjectSchema, z.array(ProductContentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();