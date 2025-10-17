import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductImageSelectObjectSchema as ProductImageSelectObjectSchema } from './objects/ProductImageSelect.schema';
import { ProductImageIncludeObjectSchema as ProductImageIncludeObjectSchema } from './objects/ProductImageInclude.schema';
import { ProductImageUpdateInputObjectSchema as ProductImageUpdateInputObjectSchema } from './objects/ProductImageUpdateInput.schema';
import { ProductImageUncheckedUpdateInputObjectSchema as ProductImageUncheckedUpdateInputObjectSchema } from './objects/ProductImageUncheckedUpdateInput.schema';
import { ProductImageWhereUniqueInputObjectSchema as ProductImageWhereUniqueInputObjectSchema } from './objects/ProductImageWhereUniqueInput.schema';

export const ProductImageUpdateOneSchema: z.ZodType<Prisma.ProductImageUpdateArgs> = z.object({ select: ProductImageSelectObjectSchema.optional(), include: ProductImageIncludeObjectSchema.optional(), data: z.union([ProductImageUpdateInputObjectSchema, ProductImageUncheckedUpdateInputObjectSchema]), where: ProductImageWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProductImageUpdateArgs>;

export const ProductImageUpdateOneZodSchema = z.object({ select: ProductImageSelectObjectSchema.optional(), include: ProductImageIncludeObjectSchema.optional(), data: z.union([ProductImageUpdateInputObjectSchema, ProductImageUncheckedUpdateInputObjectSchema]), where: ProductImageWhereUniqueInputObjectSchema }).strict();