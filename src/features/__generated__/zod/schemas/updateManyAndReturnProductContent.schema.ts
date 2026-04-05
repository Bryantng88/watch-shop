import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductContentSelectObjectSchema as ProductContentSelectObjectSchema } from './objects/ProductContentSelect.schema';
import { ProductContentUpdateManyMutationInputObjectSchema as ProductContentUpdateManyMutationInputObjectSchema } from './objects/ProductContentUpdateManyMutationInput.schema';
import { ProductContentWhereInputObjectSchema as ProductContentWhereInputObjectSchema } from './objects/ProductContentWhereInput.schema';

export const ProductContentUpdateManyAndReturnSchema: z.ZodType<Prisma.ProductContentUpdateManyAndReturnArgs> = z.object({ select: ProductContentSelectObjectSchema.optional(), data: ProductContentUpdateManyMutationInputObjectSchema, where: ProductContentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductContentUpdateManyAndReturnArgs>;

export const ProductContentUpdateManyAndReturnZodSchema = z.object({ select: ProductContentSelectObjectSchema.optional(), data: ProductContentUpdateManyMutationInputObjectSchema, where: ProductContentWhereInputObjectSchema.optional() }).strict();