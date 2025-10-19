import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductImageSelectObjectSchema as ProductImageSelectObjectSchema } from './objects/ProductImageSelect.schema';
import { ProductImageUpdateManyMutationInputObjectSchema as ProductImageUpdateManyMutationInputObjectSchema } from './objects/ProductImageUpdateManyMutationInput.schema';
import { ProductImageWhereInputObjectSchema as ProductImageWhereInputObjectSchema } from './objects/ProductImageWhereInput.schema';

export const ProductImageUpdateManyAndReturnSchema: z.ZodType<Prisma.ProductImageUpdateManyAndReturnArgs> = z.object({ select: ProductImageSelectObjectSchema.optional(), data: ProductImageUpdateManyMutationInputObjectSchema, where: ProductImageWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductImageUpdateManyAndReturnArgs>;

export const ProductImageUpdateManyAndReturnZodSchema = z.object({ select: ProductImageSelectObjectSchema.optional(), data: ProductImageUpdateManyMutationInputObjectSchema, where: ProductImageWhereInputObjectSchema.optional() }).strict();