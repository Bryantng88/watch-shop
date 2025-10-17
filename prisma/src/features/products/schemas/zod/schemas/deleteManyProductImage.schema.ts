import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductImageWhereInputObjectSchema as ProductImageWhereInputObjectSchema } from './objects/ProductImageWhereInput.schema';

export const ProductImageDeleteManySchema: z.ZodType<Prisma.ProductImageDeleteManyArgs> = z.object({ where: ProductImageWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductImageDeleteManyArgs>;

export const ProductImageDeleteManyZodSchema = z.object({ where: ProductImageWhereInputObjectSchema.optional() }).strict();