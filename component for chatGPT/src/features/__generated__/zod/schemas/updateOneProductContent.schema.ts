import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductContentSelectObjectSchema as ProductContentSelectObjectSchema } from './objects/ProductContentSelect.schema';
import { ProductContentIncludeObjectSchema as ProductContentIncludeObjectSchema } from './objects/ProductContentInclude.schema';
import { ProductContentUpdateInputObjectSchema as ProductContentUpdateInputObjectSchema } from './objects/ProductContentUpdateInput.schema';
import { ProductContentUncheckedUpdateInputObjectSchema as ProductContentUncheckedUpdateInputObjectSchema } from './objects/ProductContentUncheckedUpdateInput.schema';
import { ProductContentWhereUniqueInputObjectSchema as ProductContentWhereUniqueInputObjectSchema } from './objects/ProductContentWhereUniqueInput.schema';

export const ProductContentUpdateOneSchema: z.ZodType<Prisma.ProductContentUpdateArgs> = z.object({ select: ProductContentSelectObjectSchema.optional(), include: ProductContentIncludeObjectSchema.optional(), data: z.union([ProductContentUpdateInputObjectSchema, ProductContentUncheckedUpdateInputObjectSchema]), where: ProductContentWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProductContentUpdateArgs>;

export const ProductContentUpdateOneZodSchema = z.object({ select: ProductContentSelectObjectSchema.optional(), include: ProductContentIncludeObjectSchema.optional(), data: z.union([ProductContentUpdateInputObjectSchema, ProductContentUncheckedUpdateInputObjectSchema]), where: ProductContentWhereUniqueInputObjectSchema }).strict();