import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductContentCreateManyInputObjectSchema as ProductContentCreateManyInputObjectSchema } from './objects/ProductContentCreateManyInput.schema';

export const ProductContentCreateManySchema: z.ZodType<Prisma.ProductContentCreateManyArgs> = z.object({ data: z.union([ ProductContentCreateManyInputObjectSchema, z.array(ProductContentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ProductContentCreateManyArgs>;

export const ProductContentCreateManyZodSchema = z.object({ data: z.union([ ProductContentCreateManyInputObjectSchema, z.array(ProductContentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();