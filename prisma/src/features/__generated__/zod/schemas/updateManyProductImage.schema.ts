import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductImageUpdateManyMutationInputObjectSchema as ProductImageUpdateManyMutationInputObjectSchema } from './objects/ProductImageUpdateManyMutationInput.schema';
import { ProductImageWhereInputObjectSchema as ProductImageWhereInputObjectSchema } from './objects/ProductImageWhereInput.schema';

export const ProductImageUpdateManySchema: z.ZodType<Prisma.ProductImageUpdateManyArgs> = z.object({ data: ProductImageUpdateManyMutationInputObjectSchema, where: ProductImageWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductImageUpdateManyArgs>;

export const ProductImageUpdateManyZodSchema = z.object({ data: ProductImageUpdateManyMutationInputObjectSchema, where: ProductImageWhereInputObjectSchema.optional() }).strict();