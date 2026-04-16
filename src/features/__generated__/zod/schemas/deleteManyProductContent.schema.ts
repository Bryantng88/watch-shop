import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductContentWhereInputObjectSchema as ProductContentWhereInputObjectSchema } from './objects/ProductContentWhereInput.schema';

export const ProductContentDeleteManySchema: z.ZodType<Prisma.ProductContentDeleteManyArgs> = z.object({ where: ProductContentWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProductContentDeleteManyArgs>;

export const ProductContentDeleteManyZodSchema = z.object({ where: ProductContentWhereInputObjectSchema.optional() }).strict();