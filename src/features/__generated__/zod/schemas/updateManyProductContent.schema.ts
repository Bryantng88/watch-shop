import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductContentUpdateManyMutationInputObjectSchema as ProductContentUpdateManyMutationInputObjectSchema } from './objects/ProductContentUpdateManyMutationInput.schema';
import { ProductContentWhereInputObjectSchema as ProductContentWhereInputObjectSchema } from './objects/ProductContentWhereInput.schema';

export const ProductContentUpdateManySchema: z.ZodType<Prisma.ProductContentUpdateManyArgs> = z.object({ data: ProductContentUpdateManyMutationInputObjectSchema, where: ProductContentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductContentUpdateManyArgs>;

export const ProductContentUpdateManyZodSchema = z.object({ data: ProductContentUpdateManyMutationInputObjectSchema, where: ProductContentWhereInputObjectSchema.optional() }).strict();